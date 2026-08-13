import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { PageHero, Reveal } from "../components/site/Reveal";
import { Magnetic } from "../components/site/MagneticButton";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../lib/emailjs";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
  User,
  AtSign,
  Globe,
  ChevronDown,
} from "lucide-react";

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

const TOPICS = [
  "Recruitment",
  "Executive Search",
  "Contract Staffing",
  "C2C Engagements",
  "Payroll",
  "Global Hiring",
  "Something else",
] as const;

const COUNTRIES = [
  "USA",
  "Canada",
  "United Kingdom",
  "Germany",
  "UAE",
  "Australia",
  "Other",
] as const;

const fieldClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/45 outline-none transition duration-300 hover:border-white/20 focus:border-[oklch(0.82_0.14_85_/_0.55)] focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_oklch(0.82_0.14_85_/_0.08)] disabled:opacity-50";

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [topicError, setTopicError] = useState(false);

  function resetForm() {
    setStatus("idle");
    setErrorMessage("");
    setTopic("");
    setTopicError(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!topic) {
      setTopicError(true);
      setErrorMessage("Please choose what we can help with.");
      setStatus("error");
      return;
    }

    const serviceId = EMAILJS_SERVICE_ID;
    const templateId = EMAILJS_TEMPLATE_ID;
    const publicKey = EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS env vars are missing. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.");
      setErrorMessage("EmailJS is not configured. Check the environment variables.");
      setStatus("error");
      return;
    }

    setErrorMessage("");
    setTopicError(false);
    setStatus("sending");

    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: String(data.get("name") ?? ""),
          from_email: String(data.get("email") ?? ""),
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          country: String(data.get("country") ?? ""),
          topic,
          message: String(data.get("message") ?? ""),
          reply_to: String(data.get("email") ?? ""),
        },
        { publicKey },
      );
      setStatus("sent");
      form.reset();
      setTopic("");
    } catch (err) {
      console.error("EmailJS send failed:", err);
      const text = err && typeof err === "object" && "text" in err ? String(err.text) : "";
      const needsReconnect = /invalid grant|reconnect your gmail/i.test(text);
      setErrorMessage(
        needsReconnect
          ? "Mail delivery is temporarily unavailable. Please email us directly at info@hirenestgloball.com."
          : text || "Something went wrong. Please try again or email us directly.",
      );
      setStatus("error");
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="Get in Touch"
        title={<>Let's start a <span className="text-gold italic">conversation.</span></>}
        description="Whether you're scaling a global team or searching for your next chapter, we'd love to hear from you."
      />

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <Reveal>
            <div className="glass-strong rounded-3xl p-6 sm:p-10">
              {status === "sent" ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center py-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[oklch(0.82_0.14_85_/_0.35)] bg-[oklch(0.82_0.14_85_/_0.1)]">
                    <CheckCircle2 className="text-[oklch(0.82_0.14_85)]" size={28} strokeWidth={1.4} />
                  </div>
                  <h2 className="mt-6 text-3xl font-display">Message sent.</h2>
                  <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
                    Thank you — a senior consultant will reply within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-8 btn-ghost-glass rounded-full px-6 py-3 text-sm font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate={false}>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-display">Send a message</h2>
                      <p className="mt-2 text-sm text-muted-foreground">Tell us a little about what you need.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-[oklch(0.82_0.14_85_/_0.25)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-gold">
                      <Clock size={12} strokeWidth={1.6} />
                      Reply in 24h
                    </div>
                  </div>

                  <div className="mt-8 h-px bg-gradient-to-r from-[oklch(0.82_0.14_85_/_0.35)] via-white/10 to-transparent" />

                  <div className="mt-8 grid sm:grid-cols-2 gap-5">
                    <Field
                      label="Full name"
                      name="name"
                      autoComplete="name"
                      placeholder="Jane Cooper"
                      icon={<User size={15} strokeWidth={1.6} />}
                      required
                      disabled={status === "sending"}
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      icon={<AtSign size={15} strokeWidth={1.6} />}
                      required
                      disabled={status === "sending"}
                    />
                    <div className="sm:col-span-2">
                      <label htmlFor="country" className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <Globe size={15} strokeWidth={1.6} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                          id="country"
                          name="country"
                          defaultValue=""
                          disabled={status === "sending"}
                          className={`${fieldClass} appearance-none pl-11 pr-10`}
                        >
                          <option value="" disabled>
                            Select a country
                          </option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c} className="bg-[oklch(0.12_0.02_260)]">
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={15} strokeWidth={1.6} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                        What can we help with? <span className="text-gold">*</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((item) => {
                        const active = topic === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            disabled={status === "sending"}
                            onClick={() => {
                              setTopic(item);
                              setTopicError(false);
                              if (status === "error") setErrorMessage("");
                            }}
                            className={`rounded-full px-4 py-2 text-xs font-medium transition duration-300 disabled:opacity-50 ${
                              active
                                ? "btn-gold"
                                : `border ${topicError ? "border-red-400/50 text-red-300" : "border-white/10 text-muted-foreground hover:border-[oklch(0.82_0.14_85_/_0.4)] hover:text-foreground"}`
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                      Message <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      disabled={status === "sending"}
                      placeholder="Share the role, timeline, or anything that will help us prepare."
                      className={`${fieldClass} resize-none min-h-[140px]`}
                    />
                  </div>

                  {status === "error" && errorMessage && (
                    <div className="mt-6 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="btn-gold rounded-full px-8 py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:transform-none"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send Message <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <p className="text-xs text-muted-foreground">
                      Or email us at{" "}
                      <a href="mailto:info@hirenestgloball.com" className="text-gold hover:underline">
                        info@hirenestgloball.com
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-4 lg:sticky lg:top-28">
              <ContactCard
                icon={Mail}
                label="Email"
                href="mailto:info@hirenestgloball.com"
                value="info@hirenestgloball.com"
              />
              <ContactCard
                icon={Phone}
                label="Phone"
                href="tel:+13073128503"
                value="+1 307 312 8503"
              />
              <ContactCard
                icon={MapPin}
                label="Office"
                href="https://www.google.com/maps/search/?api=1&query=30+N+Gould+St+Ste+R+Sheridan+WY+82801"
                value={
                  <>
                    30 N Gould St Ste R<br />
                    Sheridan, WY 82801, USA
                  </>
                }
                external
              />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  icon,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const id = name;
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`${fieldClass} ${icon ? "pl-11" : ""}`}
        />
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  href,
  value,
  external,
}: {
  icon: typeof Mail;
  label: string;
  href: string;
  value: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group glass rounded-2xl p-7 block transition duration-300 hover:border-[oklch(0.82_0.14_85_/_0.35)] hover:-translate-y-0.5"
    >
      <Icon size={20} className="text-[oklch(0.82_0.14_85)] transition group-hover:scale-110" strokeWidth={1.3} />
      <div className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm text-foreground/90 group-hover:text-[oklch(0.82_0.14_85)] transition leading-relaxed">
        {value}
      </div>
    </a>
  );
}
