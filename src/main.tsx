import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/assistant";
import "@/styles/index.css";
import App from "@/App";
import { markScrollTimelineSupport } from "@/scrollEffects";

markScrollTimelineSupport();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
