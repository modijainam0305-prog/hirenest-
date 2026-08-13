import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import logoAsset from "../../assets/hirenest-logo-mark.png.asset.json";
import logo from "../../assets/logo.png";

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hirenest-globall/",
    icon: Linkedin,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hirenestglobal",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1Bi5gdGHpA/",
    icon: Facebook,
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-x-0 top-0 divider-gold" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="HireNest Global"
                className="h-10 w-10 object-contain drop-shadow-[0_2px_12px_rgba(80,140,255,0.35)]"
              />
              <span className="font-display text-xl">
                Hire<span className="text-gold">Nest</span> Global
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              A boutique international recruitment partner connecting world-class
              companies with exceptional talent across six global markets.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:border-[oklch(0.82_0.14_85_/_0.45)] hover:text-[oklch(0.82_0.14_85)]"
                >
                  <Icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/industries" className="hover:text-foreground">Industries</Link></li>
              <li><Link to="/global-hiring" className="hover:text-foreground">Global Hiring</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="mailto:info@hirenestgloball.com" className="hover:text-foreground">info@hirenestgloball.com</a></li>
              <li><a href="tel:+13073128503" className="hover:text-foreground">+1 307 312 8503</a></li>
              <li>30 N Gould St Ste R<br />Sheridan, WY 82801, USA</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} HireNest Global. All rights reserved.</p>
          <p className="font-display tracking-wide">Crafted for the world's most ambitious teams.</p>
        </div>
      </div>
    </footer>
  );
}
