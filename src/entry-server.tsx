import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "@/App";

// בזמן build העמוד מרונדר ל-HTML סטטי, כדי שגוגל וזחלני AI שלא מריצים JavaScript יראו את כל התוכן.
export { llmsFull, prerenderPaths, resolveRoute, routeMeta } from "@/routes";

export function render(path = "/") {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
