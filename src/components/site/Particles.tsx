export function Particles() {
  const dots = Array.from({ length: 36 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const left = (i * 37) % 100;
        const size = 1 + ((i * 13) % 3);
        const dur = 14 + ((i * 7) % 20);
        const delay = (i * 0.6) % 12;
        const gold = i % 4 === 0;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: "-10vh",
              width: `${size}px`,
              height: `${size}px`,
              background: gold ? "oklch(0.85 0.14 85)" : "oklch(0.8 0.15 265)",
              boxShadow: gold
                ? "0 0 12px oklch(0.85 0.14 85 / 0.8)"
                : "0 0 10px oklch(0.65 0.22 265 / 0.7)",
              animation: `float-up ${dur}s linear ${delay}s infinite`,
              opacity: 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

export function LightBeams() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute top-0 left-1/4 h-full w-[2px] origin-center"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.7 0.22 265 / 0.4), transparent)",
          animation: "beam 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-0 left-2/3 h-full w-[2px] origin-center"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.85 0.14 85 / 0.35), transparent)",
          animation: "beam 12s ease-in-out 2s infinite",
        }}
      />
      <div
        className="absolute top-0 left-[15%] h-full w-[1px]"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.7 0.22 265 / 0.3), transparent)",
          animation: "beam 14s ease-in-out 4s infinite",
        }}
      />
    </div>
  );
}
