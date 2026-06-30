import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
};

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="relative pt-40 pb-20 px-6 hero-bg overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-[oklch(0.5_0.24_265)] blur-[120px]" />
        <div className="absolute top-40 right-1/4 h-72 w-72 rounded-full bg-[oklch(0.82_0.14_85)] blur-[140px] opacity-50" />
      </div>
      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-gold border border-[oklch(0.82_0.14_85_/_0.3)] rounded-full px-4 py-1.5">
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-8 text-5xl md:text-7xl font-display leading-[1.05]">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
