import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal;
  maxRetries?: number;
}

/**
 * Upload a file to Supabase Storage via XHR so we can report real upload
 * progress (the JS SDK does not expose progress events).
 * Retries transient failures with exponential backoff.
 */
export async function uploadFileWithProgress(opts: UploadOptions): Promise<string> {
  const { bucket, path, file, onProgress, signal, maxRetries = 2 } = opts;
  const url = `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(path)}`;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Authorization", `Bearer ${SUPABASE_ANON_KEY}`);
        xhr.setRequestHeader("apikey", SUPABASE_ANON_KEY);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress?.(100);
            resolve();
          } else {
            reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText || xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload timed out"));
        xhr.timeout = 60_000;

        if (signal) {
          if (signal.aborted) {
            xhr.abort();
            reject(new DOMException("Aborted", "AbortError"));
            return;
          }
          signal.addEventListener("abort", () => xhr.abort(), { once: true });
        }

        xhr.send(file);
      });

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } catch (err) {
      lastError = err as Error;
      if ((err as DOMException)?.name === "AbortError") throw err;
      attempt++;
      if (attempt > maxRetries) break;
      // Exponential backoff: 500ms, 1500ms
      await new Promise((r) => setTimeout(r, 500 * Math.pow(3, attempt - 1)));
      onProgress?.(0);
    }
  }

  throw lastError ?? new Error("Upload failed");
}