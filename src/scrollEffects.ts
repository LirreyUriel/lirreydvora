function supportsScrollTimeline() {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline", "scroll()") &&
    CSS.supports("animation-timeline", "view()")
  );
}

export function markScrollTimelineSupport() {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    root.classList.add("reduced-motion");
    return;
  }
  if (!supportsScrollTimeline()) root.classList.add("no-scroll-timeline");
}

export function startScrollFallback() {
  const root = document.documentElement;
  if (!root.classList.contains("no-scroll-timeline")) return () => {};

  let frame = 0;
  const updateScroll = () => {
    frame = 0;
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));

    const hero = document.querySelector(".hero");
    if (!hero) return;
    const traveled = window.innerHeight - hero.getBoundingClientRect().top;
    hero.querySelectorAll<HTMLElement>("[data-parallax]").forEach((layer) => {
      const speed = Number(layer.dataset.parallax) || 0;
      layer.style.transform = `translate3d(0, ${(traveled * speed).toFixed(2)}px, 0)`;
    });
  };

  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateScroll);
  };

  updateScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll(".words, .photo-reveal, .pull-quote").forEach((node) => revealObserver.observe(node));

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (frame) window.cancelAnimationFrame(frame);
    revealObserver.disconnect();
  };
}
