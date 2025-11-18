import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import App from "./App.tsx";
import "./index.css";
import "./styles/animations.css";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatePresence mode="wait" initial={false}>
        <App />
      </AnimatePresence>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
