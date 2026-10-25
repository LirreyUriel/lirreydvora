import { useId, useState, type ReactNode } from "react";

export type LiquidGlassAccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
};

type Props = {
  items: LiquidGlassAccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  defaultOpen?: string[];
};

export function LiquidGlassAccordion({
  items,
  className = "",
  allowMultiple = false,
  defaultOpen = [],
}: Props) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState<Set<string>>(
    () => new Set(defaultOpen),
  );

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`lg-accordion ${className}`.trim()}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={`lg-accordion__item${isOpen ? " is-open" : ""}`}
          >
            <h3 className="lg-accordion__heading">
              <button
                id={triggerId}
                className="lg-accordion__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                {item.icon ? (
                  <span className="lg-accordion__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                ) : null}
                <span className="lg-accordion__title">{item.title}</span>
                <span className="lg-accordion__chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                    <path
                      d="m6 9 6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              className="lg-accordion__panel"
              role="region"
              aria-labelledby={triggerId}
              inert={!isOpen}
            >
              <div className="lg-accordion__panel-inner">
                <div className="lg-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LiquidGlassAccordion;
