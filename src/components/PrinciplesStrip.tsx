import { principles } from "@/content/site";

function PrincipleIcon({ icon }: { icon: (typeof principles)[number]["icon"] }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (icon === "link") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path {...common} d="M9 17H7a5 5 0 0 1 0-10h2" />
        <path {...common} d="M15 7h2a5 5 0 0 1 0 10h-2" />
        <path {...common} d="M8 12h8" />
      </svg>
    );
  }

  if (icon === "hands") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path {...common} d="M18 11V6a2 2 0 0 0-4 0" />
        <path {...common} d="M14 10V4a2 2 0 0 0-4 0v2" />
        <path {...common} d="M10 10.5V6a2 2 0 0 0-4 0v8" />
        <path
          {...common}
          d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.3l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        {...common}
        d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"
      />
      <path {...common} d="M2 21c0-3 1.8-5.4 5.1-6" />
    </svg>
  );
}

export function PrinciplesStrip() {
  return (
    <section className="principles" aria-label="איך זה נשאר בידיים שלך">
      <div className="container">
        <ul className="principles__grid">
          {principles.map((item) => (
            <li key={item.title} className="principles__item">
              <span className="principles__icon">
                <PrincipleIcon icon={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
