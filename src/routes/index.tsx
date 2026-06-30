import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Globe2, Briefcase, Users, TrendingUp, Award, Sparkles, Quote } from "lucide-react";
import { EarthHero } from "../components/site/EarthHero";
import { Particles, LightBeams } from "../components/site/Particles";
import { Reveal } from "../components/site/Reveal";
import { Counter } from "../components/site/Counter";
import { Magnetic, TiltCard } from "../components/site/MagneticButton";
import { WorldMap } from "../components/site/WorldMap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireNest Global — Connecting Global Talent with World-Class Companies" },
      { name: "description", content: "Premium international recruitment, executive search, contract staffing, C2C, payroll, and global hiring across seven continents." },
      { property: "og:title", content: "HireNest Global — Premium International Recruitment" },
      { property: "og:description", content: "Connecting world-class companies with elite global talent." },
    ],
  }),
  component: Home,
});

const COUNTRIES = ["USA", "Canada", "United Kingdom", "Germany", "UAE", "Australia"];

const SERVICES = [
  { icon: Users, title: "Recruitment", desc: "End-to-end hiring across mid-senior roles with white-glove curation." },
  { icon: Award, title: "Executive Search", desc: "Confidential mandates for C-suite and board-level appointments." },
  { icon: Briefcase, title: "Contract Staffing", desc: "On-demand specialists deployed in days, not months." },
  { icon: Sparkles, title: "C2C Engagements", desc: "Corp-to-corp partnerships built for compliance and speed." },
  { icon: TrendingUp, title: "Payroll Services", desc: "Multi-country payroll, benefits and statutory compliance." },
  { icon: Globe2, title: "Global Hiring", desc: "EOR, visa sponsorship and cross-border placements." },
];

const STATS: { v: number; suffix?: string; prefix?: string; l: string; decimals?: number }[] = [
  { v: 6, l: "Global Markets" },
  { v: 1200, suffix: "+", l: "Placements Delivered" },
  { v: 97, suffix: "%", l: "Client Retention" },
  { v: 24, suffix: "h", l: "Average Response" },
];

const TESTIMONIALS = [
  { q: "HireNest delivered our entire APAC leadership bench in 60 days. Quiet, precise, exceptional.", a: "Chief People Officer", c: "Fortune 500 SaaS" },
  { q: "The level of curation is unmatched. Every shortlist felt hand-picked by a partner who truly understood our brand.", a: "Founder & CEO", c: "Series C Fintech" },
  { q: "Cross-border hiring across UAE, Germany and the United Kingdom — handled with a single point of contact. Effortless.", a: "VP, Global Talent", c: "Industrial Holding Group" },
];

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <main className="relative">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden hero-bg flex items-center">
        <LightBeams />
        <Particles />

        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <EarthHero />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]), opacity: heroOpacity }}
          className="relative z-10 mx-auto max-w-7xl px-6 w-full pt-28 pb-20"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.82_0.14_85)] opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.14_85)]" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
                Global Recruitment · Established 2014
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02] tracking-tight">
              {["Connecting", "Global Talent", "with World-Class", "Companies"].map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 1.9 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    className="block"
                  >
                    {i === 1 ? <span className="text-gold italic">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              Recruitment · Executive Search · Contract Staffing · C2C · Payroll · Global Hiring
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.7 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Magnetic>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 btn-royal rounded-full px-7 py-3.5 text-sm font-medium"
                >
                  Hire Talent
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/global-hiring"
                  className="group inline-flex items-center gap-2 btn-ghost-glass rounded-full px-7 py-3.5 text-sm font-medium"
                >
                  Find Jobs
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
              className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Active in</span>
              {COUNTRIES.map((c) => (
                <span key={c} className="text-xs text-foreground/80 tracking-wide">
                  {c}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          style={{ opacity: heroOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
          <div className="relative h-10 w-[1px] bg-white/10 overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-[oklch(0.82_0.14_85)] to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* STATS — animated counters */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px glass-strong rounded-2xl overflow-hidden">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08}>
                <div className="p-8 md:p-10 text-center bg-background/40 group hover:bg-background/20 transition-colors duration-500">
                  <div className="font-display text-4xl md:text-5xl text-gold">
                    <Counter to={s.v} suffix={s.suffix} prefix={s.prefix} decimals={s.decimals} />
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.l}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES — floating tilted cards */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold">Services</span>
              <h2 className="mt-4 text-4xl md:text-6xl font-display leading-tight">
                Six disciplines.<br/>
                <span className="text-gold italic">One global standard.</span>
              </h2>
              <p className="mt-6 text-muted-foreground max-w-xl">
                Every engagement is led by senior consultants who have built and led teams
                inside the world's most ambitious companies.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.08}>
                <TiltCard className="h-full">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                    className="glass rounded-2xl p-8 h-full group relative overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[oklch(0.5_0.24_265)] blur-[60px] opacity-0 group-hover:opacity-40 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[oklch(0.82_0.14_85_/_0.05)] opacity-0 group-hover:opacity-100 transition duration-700" />
                    <div className="relative" style={{ transform: "translateZ(40px)" }}>
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.24_265)] to-[oklch(0.4_0.22_270)] flex items-center justify-center shadow-[0_8px_30px_-10px_oklch(0.55_0.24_265/0.7)] group-hover:scale-110 transition duration-500">
                        <s.icon size={20} className="text-white" />
                      </div>
                      <h3 className="mt-6 text-2xl font-display">{s.title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      <div className="mt-6 text-xs uppercase tracking-[0.3em] text-gold/70 group-hover:text-gold transition flex items-center gap-2">
                        Learn more <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD MAP */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-[oklch(0.5_0.24_265)] blur-[160px]" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold">Worldwide</span>
              <h2 className="mt-4 text-4xl md:text-6xl font-display leading-tight">
                Talent without <span className="text-gold italic">borders.</span>
              </h2>
              <p className="mt-6 text-muted-foreground">
                Six offices. One network. Real-time placement intelligence across every market we serve.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-16 relative">
            <div className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
              <WorldMap />

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:block absolute top-10 left-10 glass rounded-2xl px-5 py-4 max-w-[200px]"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Live</div>
                <div className="mt-1 text-lg font-display">
                  <Counter to={342} /> active mandates
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">across 6 markets</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="hidden md:block absolute bottom-10 right-10 glass rounded-2xl px-5 py-4 max-w-[220px]"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">This quarter</div>
                <div className="mt-1 text-lg font-display">
                  <Counter to={184} /> placements
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">avg. 14-day shortlist</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="hidden lg:block absolute top-1/2 right-8 -translate-y-1/2 glass rounded-2xl px-5 py-4"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold">Avg. response</div>
                <div className="mt-1 text-lg font-display">&lt; <Counter to={24} suffix="h" /></div>
              </motion.div>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {COUNTRIES.map((c, i) => (
              <Reveal key={c} delay={i * 0.05}>
                <div className="glass rounded-xl py-6 px-3 text-center hover:border-[oklch(0.82_0.14_85_/_0.4)] hover:-translate-y-1 transition-all duration-500 group">
                  <div className="text-2xl font-display text-gold">{String(i + 1).padStart(2, "0")}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/80 group-hover:text-foreground transition">{c}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-16">
              <div>
                <span className="text-[11px] uppercase tracking-[0.35em] text-gold">Trusted Voices</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-display leading-tight max-w-xl">
                  The world's most ambitious teams,<br/>
                  <span className="text-gold italic">in their words.</span>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="glass rounded-2xl p-8 h-full relative overflow-hidden group"
                >
                  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[oklch(0.82_0.14_85)] blur-[80px] opacity-0 group-hover:opacity-20 transition duration-700" />
                  <Quote size={28} className="text-gold/40" />
                  <p className="mt-6 text-foreground/90 leading-relaxed font-display text-lg">
                    "{t.q}"
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="text-sm font-medium">{t.a}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{t.c}</div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="relative glass-strong rounded-3xl p-12 md:p-20 text-center overflow-hidden">
              <div className="absolute top-0 left-0 right-0 divider-gold" />
              <motion.div
                animate={{ x: [-40, 40, -40], y: [0, 30, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-[oklch(0.55_0.24_265)] blur-[100px] opacity-60"
              />
              <motion.div
                animate={{ x: [40, -40, 40], y: [0, -30, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[oklch(0.82_0.14_85)] blur-[120px] opacity-50"
              />
              <div className="relative">
                <span className="text-[11px] uppercase tracking-[0.35em] text-gold">Begin</span>
                <h2 className="mt-4 text-4xl md:text-6xl font-display leading-tight">
                  Build the team the <br/>
                  <span className="text-gold italic">world will follow.</span>
                </h2>
                <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
                  A single conversation is all it takes to discover what global recruitment can be.
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                  <Magnetic>
                    <Link to="/contact" className="btn-gold rounded-full px-8 py-3.5 text-sm font-medium inline-flex items-center gap-2">
                      Start a Mandate <ArrowRight size={16} />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link to="/services" className="btn-ghost-glass rounded-full px-8 py-3.5 text-sm font-medium">
                      Explore Services
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
