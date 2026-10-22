import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export function useButtonRipple() {
  const reduced = usePrefersReducedMotion();
  const nextId = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (reduced || event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const id = ++nextId.current;
    setRipples((current) => [
      ...current,
      {
        id,
        size,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
      },
    ]);
  }

  function removeRipple(id: number) {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }

  return { ripples, onPointerDown, removeRipple };
}

export function ButtonRipples({
  ripples,
  onDone,
}: {
  ripples: Ripple[];
  onDone: (id: number) => void;
}) {
  return (
    <span className="btn__ripples" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="btn__ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
          onAnimationEnd={() => onDone(ripple.id)}
        />
      ))}
    </span>
  );
}
