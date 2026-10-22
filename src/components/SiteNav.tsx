import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type LinkRect = { x: number; width: number };

export function SiteNav() {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const rects = useRef<LinkRect[]>([]);
  const activeRef = useRef<string | null>(null);
  const lockUntil = useRef(0);
  const placed = useRef(false);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>(() => {
    const id = window.location.hash.slice(1);
    return nav.some((item) => item.id === id) ? id : null;
  });

  activeRef.current = active;

  function measure() {
    const root = navRef.current;
    if (!root) return;
    const base = root.getBoundingClientRect();
    if (base.width === 0) return;
    rects.current = linkRefs.current.map((link) => {
      if (!link) return { x: 0, width: 0 };
      const rect = link.getBoundingClientRect();
      return { x: rect.left - base.left, width: rect.width };
    });
  }

  function write(id: string | null) {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const index = id ? nav.findIndex((item) => item.id === id) : -1;
    const rect = index >= 0 ? rects.current[index] : undefined;
    if (!rect || rect.width <= 0) {
      indicator.style.width = "0px";
      return;
    }
    if (!placed.current) indicator.classList.add("is-instant");
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translate3d(${rect.x}px, 0, 0)`;
    if (!placed.current) {
      placed.current = true;
      requestAnimationFrame(() => indicator.classList.remove("is-instant"));
    }
  }

  useEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const clearWillChange = (event: TransitionEvent) => {
      if (event.target !== indicator) return;
      if (event.propertyName !== "transform" && event.propertyName !== "width") return;
      indicator.style.willChange = "auto";
    };
    indicator.addEventListener("transitionend", clearWillChange);
    return () => indicator.removeEventListener("transitionend", clearWillChange);
  }, []);

  useEffect(() => {
    const root = navRef.current;
    if (!root) return;

    measure();

    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      measure();
      indicatorRef.current?.classList.add("is-instant");
      frame = requestAnimationFrame(() => {
        write(activeRef.current);
        indicatorRef.current?.classList.remove("is-instant");
      });
    });
    resizeObserver.observe(root);

    const heights = new Map<string, number>();
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lockUntil.current) return;
        for (const entry of entries) {
          heights.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }
        let bestId = "";
        let best = 0;
        for (const [id, height] of heights) {
          if (height > best) {
            best = height;
            bestId = id;
          }
        }
        if (!bestId) return;
        setActive((current) => (current === bestId ? current : bestId));
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] },
    );

    for (const item of nav) {
      const section = document.getElementById(item.id);
      if (section) intersectionObserver.observe(section);
    }

    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!nav.some((item) => item.id === id)) return;
      lockUntil.current = performance.now() + 900;
      setActive(id);
    };
    window.addEventListener("hashchange", onHash);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const indicator = indicatorRef.current;
      if (indicator && !reduced && placed.current) {
        indicator.style.willChange = "transform, width";
      }
      write(active);
    });
    const fallback = window.setTimeout(() => {
      if (indicatorRef.current) indicatorRef.current.style.willChange = "auto";
    }, 420);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [active, reduced]);

  return (
    <nav className="site-nav" aria-label="ניווט בעמוד" ref={navRef}>
      {nav.map((item, index) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          ref={(node) => {
            linkRefs.current[index] = node;
          }}
          aria-current={active === item.id ? "location" : undefined}
          onClick={() => {
            lockUntil.current = performance.now() + 900;
            setActive(item.id);
          }}
        >
          {item.label}
        </a>
      ))}
      <span className="site-nav__indicator" ref={indicatorRef} aria-hidden="true" />
    </nav>
  );
}
