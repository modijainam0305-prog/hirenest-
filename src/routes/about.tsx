import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — HireNest Global" },
      { name: "description", content: "A boutique international recruitment firm building bridges between elite talent and the world's most ambitious companies." },
      { property: "og:title", content: "About HireNest Global" },
      { property: "og:description", content: "Boutique global recruitment with white-glove execution." },
    ],
  }),
  component: About,
});

const VALUES = [
  { t: "Discretion", d: "Confidentiality is the foundation of every executive engagement." },
  { t: "Precision", d: "We deliver a curated shortlist, never an inbox of resumes." },
  { t: "Velocity", d: "Decisions in days. Placements that last decades." },
  { t: "Reach", d: "Local consultants on the ground in seven of the world's busiest hiring markets." },
];

function About() {
  return (
    <main>
      <PageHero
        eyebrow="Our Story"
        title={<>A boutique firm with a <span className="text-gold italic">global footprint.</span></>}
        description="HireNest Global was founded on a simple conviction: that the world's most ambitious companies deserve a recruitment partner who moves at their pace, speaks their language, and operates with absolute discretion."
      />

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="glass-strong rounded-2xl p-10">
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold">Since 2014</span>
              <h2 className="mt-4 text-4xl font-display">
                Twelve years.<br/>Seven markets.<br/><span className="text-gold italic">One promise.</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                What began as a single consultancy in London has grown into a tightly-knit
                network of senior recruiters spanning North America, Europe, the Middle East,
                Asia and Oceania. We've stayed deliberately small, deeply specialised, and
                relentlessly focused on outcomes.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Today, we partner with Fortune 500 leaders, scaling unicorns, and family offices
                redefining their categories — placing the operators, engineers and executives
                who will shape the next decade.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.t} className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-display text-gold">{v.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <blockquote className="font-display text-3xl md:text-5xl leading-tight">
              "We don't fill seats.<br/>
              <span className="text-gold italic">We build trajectories.</span>"
            </blockquote>
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              — Founding Principle, HireNest Global
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
