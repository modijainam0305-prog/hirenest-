import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Building2, HeartPulse, Banknote, Factory, ShoppingBag, Plane, Rocket } from "lucide-react";
import { PageHero, Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — HireNest Global" },
      { name: "description", content: "Specialist recruitment across technology, finance, healthcare, energy, retail, aviation, manufacturing and venture-backed startups." },
      { property: "og:title", content: "Industries — HireNest Global" },
      { property: "og:description", content: "Deep specialisation across eight global sectors." },
    ],
  }),
  component: Industries,
});

const INDUSTRIES = [
  { icon: Cpu, t: "Technology & AI", d: "Engineers, founders and machine-learning leaders building the next platforms." },
  { icon: Banknote, t: "Banking & Finance", d: "Investment, capital markets, fintech, treasury and risk leadership." },
  { icon: HeartPulse, t: "Healthcare & Life Sciences", d: "Clinical, biotech, medical devices and digital health operators." },
  { icon: Building2, t: "Real Estate & Construction", d: "Development, capital, asset management and PropTech leadership." },
  { icon: Factory, t: "Manufacturing & Industrial", d: "Operations, supply chain, advanced manufacturing and Industry 4.0." },
  { icon: ShoppingBag, t: "Retail & Consumer", d: "Brand, ecommerce, merchandising and DTC growth leadership." },
  { icon: Plane, t: "Aviation & Logistics", d: "Aerospace, freight, mobility and global supply chain expertise." },
  { icon: Rocket, t: "Venture-Backed Startups", d: "Founding teams, key operators and exec hires from seed to IPO." },
];

function Industries() {
  return (
    <main>
      <PageHero
        eyebrow="Sectors"
        title={<>Deep specialisation.<br/><span className="text-gold italic">Across eight industries.</span></>}
        description="Our consultants don't generalise. Each leads a focused practice with a deep network and intimate market intelligence."
      />

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map((s, i) => (
            <Reveal key={s.t} delay={(i % 4) * 0.06}>
              <div className="glass rounded-2xl p-8 h-full group hover:border-[oklch(0.82_0.14_85_/_0.35)] transition relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.55_0.24_265)]/0 to-[oklch(0.82_0.14_85)]/0 group-hover:from-[oklch(0.55_0.24_265)]/10 group-hover:to-[oklch(0.82_0.14_85)]/10 transition-opacity duration-500" />
                <div className="relative">
                  <s.icon size={28} className="text-[oklch(0.82_0.14_85)]" strokeWidth={1.2} />
                  <h3 className="mt-5 text-xl font-display">{s.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
