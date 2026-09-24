import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(
  onEnter?: () => void,
  threshold = 0.35,
) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);
  const called = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (!called.current) {
            called.current = true;
            onEnter?.();
          }
        } else {
          setIsInView(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onEnter, threshold]);

  return { ref, isInView };
}
