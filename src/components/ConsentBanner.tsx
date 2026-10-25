import { useEffect, useState } from "react";
import {
  analyticsConfigured,
  analyticsEnabled,
  denyConsent,
  getConsent,
  grantConsent,
  startAnalytics,
} from "@/analytics";
import { privacy } from "@/content/site";

export const OPEN_CONSENT_EVENT = "lirrey:open-consent";

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    if (!analyticsConfigured()) return;
    // Measurement starts right away; the banner only lets the visitor turn it off.
    startAnalytics();
    if (getConsent() === null) setVisible(true);

    const open = () => {
      setAnalytics(analyticsEnabled());
      setExpanded(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (!visible) return null;

  if (!expanded) {
    return (
      <button type="button" className="consent-line" onClick={() => setExpanded(true)}>
        {privacy.banner}
      </button>
    );
  }

  const close = (allowAnalytics: boolean) => {
    if (allowAnalytics) grantConsent();
    else denyConsent();
    setVisible(false);
  };

  return (
    <aside className="consent-bar" role="dialog" aria-labelledby="consent-title">
      <p id="consent-title">{privacy.intro}</p>

      <div className="consent-bar__options">
        <div className="consent-bar__option">
          <div>
            <strong>{privacy.necessaryTitle}</strong>
            <span>{privacy.necessaryText}</span>
          </div>
          <span className="consent-switch is-on is-locked" aria-hidden="true" />
        </div>
        <label className="consent-bar__option">
          <div>
            <strong>{privacy.analyticsTitle}</strong>
            <span>{privacy.analyticsText}</span>
          </div>
          <input
            type="checkbox"
            className="consent-switch__input"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
          <span className={`consent-switch${analytics ? " is-on" : ""}`} aria-hidden="true" />
        </label>
      </div>

      <div className="consent-bar__actions">
        <button type="button" className="btn btn--primary" onClick={() => close(true)}>
          {privacy.acceptAll}
        </button>
        <button type="button" className="btn consent-bar__save" onClick={() => close(analytics)}>
          {privacy.save}
        </button>
      </div>
    </aside>
  );
}
