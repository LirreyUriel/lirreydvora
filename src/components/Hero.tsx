import { useEffect, useRef } from "react";
import { cta, hero } from "@/content/site";
import { Ltr, RichText } from "@/components/Ltr";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const WELLNESS = "Wellness";
const wellnessAt = hero.titleBefore.indexOf(WELLNESS);
const linePrefix = wellnessAt >= 0 ? hero.titleBefore.slice(0, wellnessAt) : hero.titleBefore;
const lineLtr = wellnessAt >= 0 ? hero.titleBefore.slice(wellnessAt) : "";
const lineAfter = hero.titleAfter;
const breakAt = linePrefix.length + lineLtr.length;
const titleLength = breakAt + 1 + lineAfter.length;

const MAGNET_RADIUS = 110;
const MAGNET_MAX = 14;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

function prefersFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)");
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const ltrRef = useRef<HTMLSpanElement>(null);
  const afterRef = useRef<HTMLSpanElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefix = prefixRef.current;
    const ltr = ltrRef.current;
    const after = afterRef.current;
    const typed = typedRef.current;
    if (!prefix || !ltr || !after || !typed) return;

    const paint = (count: number) => {
      const safe = Math.max(0, Math.min(titleLength, count));
      prefix.textContent = linePrefix.slice(0, Math.min(safe, linePrefix.length));
      ltr.textContent = lineLtr.slice(0, Math.max(0, Math.min(safe - linePrefix.length, lineLtr.length)));
      after.textContent = lineAfter.slice(0, Math.max(0, safe - breakAt - 1));
      const caret = safe > breakAt ? "2" : "1";
      if (typed.dataset.caret !== caret) typed.dataset.caret = caret;
    };

    const motion = prefersReducedMotion();
    let timer = 0;
    let count = 0;
    let dir = 1;
    let stopped = false;

    const stopTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    };

    const tick = () => {
      if (stopped) return;
      count += dir;
      if (count >= titleLength) {
        count = titleLength;
        dir = -1;
        paint(count);
        timer = window.setTimeout(tick, 2200);
        return;
      }
      if (count <= 0) {
        count = 0;
        dir = 1;
        paint(count);
        timer = window.setTimeout(tick, 520);
        return;
      }
      paint(count);
      const pause = dir < 0 ? 22 : count === breakAt ? 360 : 46;
      timer = window.setTimeout(tick, pause);
    };

    const start = () => {
      stopTimer();
      count = 0;
      dir = 1;
      paint(0);
      timer = window.setTimeout(tick, 160);
    };

    const showFull = () => {
      stopTimer();
      paint(titleLength);
    };

    const onMotion = () => {
      if (motion.matches) showFull();
      else start();
    };

    if (motion.matches) showFull();
    else start();

    motion.addEventListener("change", onMotion);
    return () => {
      stopped = true;
      stopTimer();
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    const anchor = anchorRef.current;
    const magnet = magnetRef.current;
    if (!heroEl || !anchor || !magnet) return;

    const reduce = prefersReducedMotion();
    const fine = prefersFinePointer();
    let frame = 0;
    let listening = false;
    let origin = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, on: false };
    const mag = { x: 0, y: 0, vx: 0, vy: 0 };
    let hot = false;

    const refresh = () => {
      const box = anchor.getBoundingClientRect();
      origin = { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    };

    const setHot = (next: boolean) => {
      if (hot === next) return;
      hot = next;
      magnet.style.willChange = next ? "transform" : "auto";
    };

    const clearMotion = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      pointer.on = false;
      mag.x = 0;
      mag.y = 0;
      mag.vx = 0;
      mag.vy = 0;
      magnet.style.transform = "";
      setHot(false);
    };

    const stepSpring = (value: number, velocity: number, target: number, stiffness: number, damping: number) => {
      const nextVelocity = (velocity + (target - value) * stiffness) * damping;
      return [value + nextVelocity, nextVelocity] as const;
    };

    const apply = () => {
      let moving = false;
      let tx = 0;
      let ty = 0;
      if (pointer.on) {
        const dx = pointer.x - origin.x;
        const dy = pointer.y - origin.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < MAGNET_RADIUS) {
          const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_MAX;
          tx = (dx / dist) * pull;
          ty = (dy / dist) * pull;
        }
      }

      const [mx, mvx] = stepSpring(mag.x, mag.vx, tx, 0.16, 0.68);
      const [my, mvy] = stepSpring(mag.y, mag.vy, ty, 0.16, 0.68);
      mag.x = mx;
      mag.y = my;
      mag.vx = mvx;
      mag.vy = mvy;
      const shiftX = Math.max(-16, Math.min(16, mx));
      const shiftY = Math.max(-16, Math.min(16, my));
      magnet.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
      if (Math.abs(mx - tx) > 0.08 || Math.abs(my - ty) > 0.08 || Math.abs(mvx) > 0.08 || Math.abs(mvy) > 0.08) {
        moving = true;
      }

      if (moving) {
        setHot(true);
        frame = window.requestAnimationFrame(apply);
        return;
      }

      frame = 0;
      setHot(false);
      if (pointer.on) return;
      mag.x = 0;
      mag.y = 0;
      mag.vx = 0;
      mag.vy = 0;
      magnet.style.transform = "";
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.on = true;
      schedule();
    };

    const onEnter = () => {
      refresh();
    };

    const onLeave = () => {
      pointer.on = false;
      schedule();
    };

    const bind = () => {
      if (listening) return;
      if (reduce.matches || !fine.matches) {
        clearMotion();
        return;
      }
      listening = true;
      refresh();
      heroEl.addEventListener("pointermove", onMove, { passive: true });
      heroEl.addEventListener("pointerenter", onEnter, { passive: true });
      heroEl.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("resize", refresh);
    };

    const unbind = () => {
      listening = false;
      heroEl.removeEventListener("pointermove", onMove);
      heroEl.removeEventListener("pointerenter", onEnter);
      heroEl.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", refresh);
      clearMotion();
    };

    const onMode = () => {
      unbind();
      bind();
    };

    bind();
    reduce.addEventListener("change", onMode);
    fine.addEventListener("change", onMode);

    return () => {
      reduce.removeEventListener("change", onMode);
      fine.removeEventListener("change", onMode);
      unbind();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={heroRef}>
      <div className="hero__mesh" aria-hidden="true">
        <div className="hero__blob hero__blob--deep" />
        <div className="hero__blob hero__blob--sage" />
        <div className="hero__blob hero__blob--gold" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content" data-parallax="-0.04">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="sr-only">
              {hero.titleBefore} {hero.titleAfter}
            </span>
            <span className="hero__reserve" aria-hidden="true">
              <span className="hero__line">
                <RichText text={hero.titleBefore} />
                <span className="hero__caret" />
              </span>
              <span className="hero__line">
                {hero.titleAfter}
                <span className="hero__caret" />
              </span>
            </span>
            <span className="hero__typed" ref={typedRef} aria-hidden="true" data-caret="1">
              <span className="hero__line">
                <span ref={prefixRef} />
                <Ltr>
                  <span ref={ltrRef} />
                </Ltr>
                <span className="hero__caret" />
              </span>
              <span className="hero__line">
                <span ref={afterRef} />
                <span className="hero__caret" />
              </span>
            </span>
          </h1>
          <span className="hero__rule" aria-hidden="true" />
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph} className="lede">
              <RichText text={paragraph} />
            </p>
          ))}
          <div className="hero__cta" ref={anchorRef}>
            <div className="hero__magnet" ref={magnetRef}>
              <WhatsAppButton source="hero">
                <RichText text={cta.hero} />
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
