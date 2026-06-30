import { createFileRoute } from "@tanstack/react-router";
import { Users, Award, Briefcase, Sparkles, TrendingUp, Globe2 } from "lucide-react";
import { PageHero, Reveal } from "../components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — HireNest Global" },
      { name: "description", content: "Recruitment, executive search, contract staffing, C2C, payroll and global hiring delivered with white-glove precision." },
      { property: "og:title", content: "Services — HireNest Global" },
      { property: "og:description", content: "Six recruitment disciplines, one global standard." },
    ],
  }),
  component: Services,
});

const SERVICES = [
  { icon: Users, t: "Recruitment", d: "Permanent placements across mid- and senior-level engineering, product, design, sales, finance and operations.", bullets: ["Curated shortlists in 7–14 days", "90-day replacement guarantee", "Dedicated senior consultant"] },
  { icon: Award, t: "Executive Search", d: "Confidential retained searches for C-suite, VP and board-level appointments.", bullets: ["Discreet market mapping", "Off-market candidate access", "Onboarding & first-year support"] },
  { icon: Briefcase, t: "Contract Staffing", d: "On-demand specialists deployed for transformation, scale-up and turnaround mandates.", bullets: ["Vetted bench of 5,000+ specialists", "Days-to-deploy timelines", "Compliance handled end-to-end"] },
  { icon: Sparkles, t: "C2C Engagements", d: "Corp-to-corp partnerships built for compliance, speed and continuity across borders.", bullets: ["W2 / 1099 / C2C structures", "Multi-vendor program management", "Pass-through and prime models"] },
  { icon: TrendingUp, t: "Payroll Services", d: "Multi-country payroll, benefits administration and statutory compliance under one roof.", bullets: ["Local entities or EOR model", "Tax, social & visa compliance", "Single monthly invoice"] },
  { icon: Globe2, t: "Global Hiring", d: "Employer-of-record, visa sponsorship and cross-border placement programs.", bullets: ["Hire anywhere in 48 hours", "180+ supported jurisdictions", "Relocation & onboarding"] },
];

function Services() {
  return (
    <main>
      <PageHero
        eyebrow="What We Do"
        title={<>Six disciplines.<br/><span className="text-gold italic">One global standard.</span></>}
        description="Every engagement is led by a senior consultant. Every shortlist is curated, never automated. Every placement is built to last."
      />

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl space-y-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.t} delay={(i % 2) * 0.08}>
              <div className="glass-strong rounded-3xl p-10 md:p-12 grid md:grid-cols-[auto_1fr_1fr] gap-8 md:gap-12 items-start hover:border-[oklch(0.82_0.14_85_/_0.3)] transition">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[oklch(0.55_0.24_265)] to-[oklch(0.4_0.22_270)] flex items-center justify-center shadow-[0_10px_40px_-10px_oklch(0.55_0.24_265/0.6)]">
                  <s.icon size={26} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gold">0{i + 1}</div>
                  <h3 className="mt-2 text-3xl md:text-4xl font-display">{s.t}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">{s.d}</p>
                </div>
                <ul className="space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1 w-4 bg-gradient-to-r from-[oklch(0.82_0.14_85)] to-transparent flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
