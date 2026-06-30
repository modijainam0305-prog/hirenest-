import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[80] -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full opacity-60 mix-blend-screen"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,oklch(0.55_0.24_265/0.35)_0%,transparent_60%)] blur-2xl" />
      <div className="absolute inset-1/3 rounded-full bg-[radial-gradient(circle,oklch(0.82_0.14_85/0.25)_0%,transparent_70%)] blur-xl" />
    </motion.div>
  );
}
