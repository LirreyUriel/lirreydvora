import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "@/App";

// בזמן build העמוד מרונדר ל-HTML סטטי, כדי שגוגל וזחלני AI שלא מריצים JavaScript יראו את כל התוכן.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
