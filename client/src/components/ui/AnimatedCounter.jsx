import { useEffect, useRef, useState } from "react";
import { formatAmount } from "../../lib/format";

const DURATION_MS = 1600;

const animate =
  typeof window !== "undefined" &&
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AnimatedCounter({ value }) {
  const target = Number(value) || 0;
  const [current, setCurrent] = useState(animate ? 0 : target);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!animate) return undefined;

    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        setCurrent(target * (1 - (1 - progress) ** 3));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return <span ref={ref}>{formatAmount(current)}</span>;
}
