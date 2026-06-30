import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Reveal } from "../components/site/Reveal";
import { Star } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — HireNest Global" },
      { name: "description", content: "What founders, CHROs and global hiring leaders say about partnering with HireNest Global." },
      { property: "og:title", content: "Testimonials — HireNest Global" },
      { property: "og:description", content: "Trusted by Fortune 500 leaders and scaling unicorns." },
    ],
  }),
  component: Testimonials,
});

const TESTIMONIALS = [
  { q: "HireNest closed our VP Engineering search in twenty-three days. The shortlist was the best I've seen in fifteen years of hiring.", a: "Sarah Lindqvist", r: "Chief People Officer, Global Fintech (London)" },
  { q: "Three GCC build-outs in eighteen months. Zero attrition in year one. They are simply in a different league.", a: "Rajiv Menon", r: "SVP Operations, Fortune 100 Technology" },
  { q: "Discreet, fast, and astonishingly well-connected. They placed our entire executive bench across four continents.", a: "Maxime Dubois", r: "Managing Partner, Private Capital Group" },
  { q: "The only recruitment partner who actually understands what 'white-glove' means. We will not work with anyone else.", a: "Hannah Reeves", r: "Founder & CEO, Series C SaaS" },
  { q: "Our entire Berlin engineering org came through HireNest. The cultural calibration is unmatched.", a: "Lukas Bauer", r: "CTO, Mobility Scale-up (Munich)" },
  { q: "From mandate to offer-letter in nineteen days for a Group CFO. They redefined what is possible.", a: "Amira Khalil", r: "Chair, Family Office (Dubai)" },
];

function Testimonials() {
  return (
    <main>
      <PageHero
        eyebrow="In Their Words"
        title={<>Trusted by the world's <span className="text-gold italic">most ambitious teams.</span></>}
        description="A small selection of what our partners say about working together."
      />

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.a} delay={(i % 2) * 0.08}>
              <figure className="glass rounded-2xl p-10 h-full flex flex-col hover:border-[oklch(0.82_0.14_85_/_0.3)] transition">
                <div className="flex gap-1 text-[oklch(0.82_0.14_85)]">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-xl md:text-2xl leading-snug text-foreground/95 flex-1">
                  "{t.q}"
                </blockquote>
                <figcaption className="mt-8 pt-6 border-t border-white/5">
                  <div className="text-sm font-medium text-gold">{t.a}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.r}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
