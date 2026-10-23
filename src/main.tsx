import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/rubik/wght.css";
import "@fontsource-variable/rubik/wght-italic.css";
import "@/styles/index.css";
import App from "@/App";
import { markScrollTimelineSupport } from "@/scrollEffects";

markScrollTimelineSupport();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
