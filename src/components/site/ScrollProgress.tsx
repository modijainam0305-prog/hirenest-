import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-[90] h-[2px] bg-gradient-to-r from-[oklch(0.55_0.24_265)] via-[oklch(0.82_0.14_85)] to-[oklch(0.55_0.24_265)] shadow-[0_0_20px_oklch(0.82_0.14_85/0.6)]"
    />
  );
}
