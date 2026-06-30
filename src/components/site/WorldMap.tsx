import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import worldSvg from "../../assets/world-equirect.svg?raw";

// Equirectangular: lng [-180,180] → x%, lat [90,-90] → y%
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 100,
});

type Placement = "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
type Marker = { country: string; count: string; lat: number; lng: number; place: Placement };
const MARKERS: Marker[] = [
  { country: "USA", count: "3.5K+", lat: 39, lng: -98, place: "bottom" },
  { country: "Canada", count: "1.2K+", lat: 58, lng: -100, place: "top" },
  { country: "UK", count: "1K+", lat: 54, lng: -2, place: "left" },
  { country: "Germany", count: "900+", lat: 51, lng: 10, place: "top" },
  { country: "UAE", count: "650+", lat: 24, lng: 54, place: "right" },
  { country: "Australia", count: "800+", lat: -25, lng: 134, place: "right" },
];

const OFFSET = 18;
const placementStyle = (p: Placement): CSSProperties => {
  switch (p) {
    case "top": return { transform: `translate(-50%, calc(-100% - ${OFFSET}px))` };
    case "bottom": return { transform: `translate(-50%, ${OFFSET}px)` };
    case "left": return { transform: `translate(calc(-100% - ${OFFSET}px), -50%)` };
    case "right": return { transform: `translate(${OFFSET}px, -50%)` };
    case "top-left": return { transform: `translate(calc(-100% - ${OFFSET}px), calc(-100% - 4px))` };
    case "top-right": return { transform: `translate(${OFFSET}px, calc(-100% - 4px))` };
    case "bottom-left": return { transform: `translate(calc(-100% - ${OFFSET}px), 4px)` };
    case "bottom-right": return { transform: `translate(${OFFSET}px, 4px)` };
  }
};

export function WorldMap() {
  const projected = MARKERS.map((m) => ({ ...m, ...project(m.lat, m.lng) }));

  return (
    <div className="relative w-full aspect-[2/1]">
      {/* Detailed equirectangular world map (continents). Colored via currentColor */}
      <div
        aria-hidden
        className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
        style={{ color: "oklch(0.30 0.14 265)", filter: "drop-shadow(0 0 22px oklch(0.45 0.20 265 / 0.25))" }}
        dangerouslySetInnerHTML={{ __html: worldSvg }}
      />

      {/* Marker glows + pulses + labels */}
      <div className="absolute inset-0">
        {projected.map((p, i) => (
          <div key={p.country} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            {/* radial glow */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
              style={{
                width: 56,
                height: 56,
                background:
                  "radial-gradient(circle, oklch(0.70 0.22 265 / 0.55) 0%, transparent 70%)",
              }}
            />
            {/* pulse ring */}
            <motion.span
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{ width: 10, height: 10, borderColor: "oklch(0.72 0.22 265)" }}
              animate={{ scale: [1, 3.2, 1], opacity: [0.85, 0, 0.85] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3 }}
            />
            {/* solid dot */}
            <motion.span
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 8,
                height: 8,
                background: "oklch(0.72 0.22 265)",
                boxShadow: "0 0 10px oklch(0.72 0.22 265)",
              }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            />

            {/* glass pill label */}
            <motion.div
              className="absolute pointer-events-none"
              style={placementStyle(p.place)}
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
            >
              <div className="glass-strong border border-white/10 rounded-full pl-2.5 pr-3 py-1.5 flex items-center gap-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.22_265)] shadow-[0_0_8px_oklch(0.72_0.22_265)]" />
                <span className="text-[11px] font-medium tracking-wide text-foreground/90">
                  {p.country}
                </span>
                <span className="text-[11px] font-semibold text-[oklch(0.85_0.14_85)]">
                  {p.count}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
