import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_METRICS = new Set(["CLS", "INP", "LCP", "FCP", "TTFB", "FID"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Beacons may send text/plain (sendBeacon default) — read raw and parse
    const raw = await req.text();
    const data = raw ? JSON.parse(raw) : {};

    const name = String(data.name ?? "").toUpperCase();
    const value = Number(data.value);

    if (!ALLOWED_METRICS.has(name) || !Number.isFinite(value)) {
      return new Response(JSON.stringify({ error: "Invalid metric" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ua = req.headers.get("user-agent") ?? "";
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);

    const { error } = await supabase.from("web_vitals").insert({
      metric_name: name,
      metric_value: value,
      metric_rating: typeof data.rating === "string" ? data.rating : null,
      metric_delta: Number.isFinite(Number(data.delta)) ? Number(data.delta) : null,
      metric_id: typeof data.id === "string" ? data.id.slice(0, 80) : null,
      navigation_type:
        typeof data.navigationType === "string" ? data.navigationType : null,
      page_url: typeof data.url === "string" ? data.url.slice(0, 500) : null,
      device_type: isMobile ? "mobile" : "desktop",
      user_agent: ua.slice(0, 500),
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Bad request" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});