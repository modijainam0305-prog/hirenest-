import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logoAsset from "../../assets/hirenest-logo-mark.png.asset.json";
import logo from "../../assets/logo.png";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.floor(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            exit={{ y: "-100%", transition: { duration: 1.1, ease: [0.85, 0, 0.15, 1] } }}
            className="absolute inset-0 bg-gradient-to-b from-background via-[oklch(0.06_0.02_265)] to-background"
          />

          <div className="relative flex flex-col items-center">
            <motion.img
              src={logo}
              alt="HireNest Global"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="h-24 md:h-32 w-auto object-contain mb-6 drop-shadow-[0_8px_40px_rgba(80,140,255,0.45)]"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-display text-3xl md:text-4xl tracking-tight"
            >
              Hire<span className="text-gold italic">Nest</span> Global
            </motion.div>

            <div className="mt-10 w-[260px] md:w-[340px] h-[1px] bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${pct}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
                className="h-full bg-gradient-to-r from-[oklch(0.55_0.24_265)] via-[oklch(0.82_0.14_85)] to-[oklch(0.55_0.24_265)]"
              />
            </div>

            <div className="mt-4 flex w-[260px] md:w-[340px] justify-between text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
              <span>Loading Experience</span>
              <span className="text-gold tabular-nums">{String(pct).padStart(3, "0")}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
