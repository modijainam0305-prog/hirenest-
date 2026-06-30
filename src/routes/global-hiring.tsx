import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Reveal } from "../components/site/Reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/global-hiring")({
  head: () => ({
    meta: [
      { title: "Global Hiring — HireNest Global" },
      { name: "description", content: "Employer-of-record, visa sponsorship and cross-border placement programs across seven international markets." },
      { property: "og:title", content: "Global Hiring — HireNest Global" },
      { property: "og:description", content: "Hire anywhere. Compliantly. In 48 hours." },
    ],
  }),
  component: GlobalHiring,
});

const REGIONS = [
  { c: "United States", h: "San Francisco · New York · Austin", n: "Tech, finance, life sciences. H-1B, O-1, L-1 sponsorship." },
  { c: "Canada", h: "Toronto · Vancouver", n: "Express Entry, GTS and ICT programs. Rapid scale-up support." },
  { c: "United Kingdom", h: "London", n: "Skilled Worker, Global Talent and Scale-up visa routes." },
  { c: "Germany", h: "Berlin · Munich · Frankfurt", n: "EU Blue Card, engineering and industrial leadership." },
  { c: "UAE", h: "Dubai · Abu Dhabi", n: "Golden Visa, free-zone setup and executive relocations." },
  { c: "Australia", h: "Sydney · Melbourne", n: "TSS 482, ENS 186 and Global Talent Independent program." },
];

function GlobalHiring() {
  return (
    <main>
      <PageHero
        eyebrow="Borderless Talent"
        title={<>Hire anywhere.<br/><span className="text-gold italic">Compliantly. In 48 hours.</span></>}
        description="Our employer-of-record platform, visa specialists and on-the-ground consultants remove every friction point between you and the world's best talent."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl space-y-5">
          {REGIONS.map((r, i) => (
            <Reveal key={r.c} delay={i * 0.05}>
              <div className="glass rounded-2xl p-8 md:p-10 grid md:grid-cols-[200px_1fr_auto] gap-6 items-center hover:border-[oklch(0.82_0.14_85_/_0.35)] transition group">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold">0{i + 1}</div>
                  <h3 className="mt-2 text-2xl font-display">{r.c}</h3>
                </div>
                <div>
                  <div className="text-sm text-foreground/90">{r.h}</div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{r.n}</p>
                </div>
                <ArrowRight size={20} className="text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="glass-strong rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[oklch(0.55_0.24_265)] blur-[120px] opacity-50" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[oklch(0.82_0.14_85)] blur-[140px] opacity-40" />
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-display">
                  Looking for your <span className="text-gold italic">next role?</span>
                </h2>
                <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
                  Submit your profile to our confidential talent network. We'll match you with leadership and senior opportunities worldwide.
                </p>
                <Link to="/contact" className="mt-8 inline-flex items-center gap-2 btn-gold rounded-full px-8 py-3.5 text-sm font-medium">
                  Find Jobs <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
