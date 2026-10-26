import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/rubik/wght.css";
import "@fontsource-variable/rubik/wght-italic.css";
import "@/styles/index.css";
import App from "@/App";
import { markScrollTimelineSupport } from "@/scrollEffects";

markScrollTimelineSupport();

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// ב-build ה-HTML כבר מרונדר מראש (scripts/prerender.mjs), אז רק מחברים אליו את React.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
