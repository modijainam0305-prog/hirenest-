import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Reveal } from "../components/site/Reveal";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — HireNest Global" },
      { name: "description", content: "Start a recruitment mandate or join our confidential talent network. Offices in USA, UK, UAE, and Canada." },
      { property: "og:title", content: "Contact HireNest Global" },
      { property: "og:description", content: "Let's start a conversation." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageHero
        eyebrow="Get in Touch"
        title={<>Let's start a <span className="text-gold italic">conversation.</span></>}
        description="Whether you're scaling a global team or searching for your next chapter, we'd love to hear from you."
      />

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_1fr] gap-8">
          <Reveal>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="glass-strong rounded-3xl p-10"
            >
              <h2 className="text-3xl font-display">Send a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">A senior consultant will respond within 24 hours.</p>

              <div className="mt-8 grid sm:grid-cols-2 gap-5">
                <Field label="Full name" name="name" />
                <Field label="Company" name="company" />
                <Field label="Email" name="email" type="email" />
                <Field label="Country" name="country" />
              </div>
              <div className="mt-5">
                <Field label="What can we help with?" name="topic" />
              </div>
              <div className="mt-5">
                <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[oklch(0.82_0.14_85_/_0.5)] transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-8 btn-gold rounded-full px-8 py-3.5 text-sm font-medium inline-flex items-center gap-2"
              >
                {sent ? "Message Sent" : "Send Message"} <ArrowRight size={16} />
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-5">
              <div className="glass rounded-2xl p-8">
                <Mail size={22} className="text-[oklch(0.82_0.14_85)]" strokeWidth={1.3} />
                <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Email</div>
                <a href="mailto:info@hirenestglobal.com" className="mt-1 block text-foreground hover:text-[oklch(0.82_0.14_85)] transition">info@hirenestglobal.com</a>
              </div>
              <div className="glass rounded-2xl p-8">
                <Phone size={22} className="text-[oklch(0.82_0.14_85)]" strokeWidth={1.3} />
                <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Phone</div>
                <a href="tel:+13073128503" className="mt-1 block text-foreground hover:text-[oklch(0.82_0.14_85)] transition">+1 307 312 8503</a>
              </div>
              <div className="glass rounded-2xl p-8">
                <MapPin size={22} className="text-[oklch(0.82_0.14_85)]" strokeWidth={1.3} />
                <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Office</div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=30+N+Gould+St+Ste+R+Sheridan+WY+82801"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-sm text-foreground/90 hover:text-[oklch(0.82_0.14_85)] transition leading-relaxed"
                >
                  30 N Gould St Ste R<br />
                  Sheridan, WY 82801, USA
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[oklch(0.82_0.14_85_/_0.5)] transition"
      />
    </div>
  );
}
