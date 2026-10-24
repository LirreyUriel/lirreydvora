import { useEffect, useState } from "react";
import {
  analyticsConfigured,
  denyConsent,
  getConsent,
  grantConsent,
  startAnalytics,
} from "@/analytics";
import { privacy } from "@/content/site";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsConfigured()) return;
    if (getConsent() === "granted") {
      startAnalytics();
      return;
    }
    if (getConsent() !== "denied") setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <aside className="consent-bar" role="dialog" aria-labelledby="consent-title">
      <p id="consent-title">{privacy.banner}</p>
      <div className="consent-bar__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            grantConsent();
            setVisible(false);
          }}
        >
          {privacy.accept}
        </button>
        <button
          type="button"
          className="consent-bar__decline"
          onClick={() => {
            denyConsent();
            setVisible(false);
          }}
        >
          {privacy.decline}
        </button>
      </div>
    </aside>
  );
}
