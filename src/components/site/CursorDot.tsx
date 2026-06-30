import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorDot() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [onGold, setOnGold] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 32, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 32, mass: 0.3 });

  // outer ring lags behind for trail effect
  const rx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.style.cursor = "none";

    const isGoldish = (color: string) => {
      const m = color.match(/\d+(\.\d+)?/g);
      if (!m) return false;
      const [r, g, b] = m.map(Number);
      return r > 180 && g > 140 && b < 140;
    };

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = !!el.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]');
      setHovering(interactive);

      // detect gold/yellow background under cursor
      let node: HTMLElement | null = el;
      let gold = false;
      for (let i = 0; i < 4 && node; i++) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          if (isGoldish(bg)) { gold = true; break; }
          break;
        }
        node = node.parentElement;
      }
      setOnGold(gold);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => { x.set(-100); y.set(-100); };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.style.cursor = "";
    };
  }, [x, y]);

  if (!enabled) return null;

  const goldCol = "oklch(0.82 0.14 85)";
  const darkCol = "oklch(0.08 0.02 260)";
  const dotColor = onGold ? darkCol : goldCol;
  const ringColor = onGold ? darkCol : goldCol;

  return (
    <>
      {/* outer ring */}
      <motion.div
        aria-hidden
        style={{ x: rx, y: ry, borderColor: ringColor }}
        animate={{
          width: hovering ? 56 : pressed ? 22 : 36,
          height: hovering ? 56 : pressed ? 22 : 36,
          opacity: onGold ? 0.5 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full border mix-blend-difference"
      />
      {/* inner dot */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy, backgroundColor: dotColor }}
        animate={{
          scale: pressed ? 0.6 : hovering ? 1.6 : 1,
          opacity: onGold ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className="pointer-events-none fixed top-0 left-0 z-[101] -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full shadow-[0_0_18px_oklch(0.82_0.14_85/0.8)]"
      />
    </>
  );
}
