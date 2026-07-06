import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./styles/animations.css";
import { Toaster } from "@/components/ui/sonner";

// Guard: unregister legacy service workers so published users never keep stale bundles.
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    if (regs.length === 0) return;
    regs.forEach((r) => r.unregister());
    if (isPreviewHost || isInIframe) return;
    caches?.keys?.().then((names) => names.forEach((name) => caches.delete(name)));
  });
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
        <Toaster />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Report Web Vitals (async, non-blocking)
import("./lib/vitals").then(({ reportWebVitals }) => reportWebVitals());
