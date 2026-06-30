import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "../../assets/hirenest-logo-mark.png.asset.json";
import logo from "../../assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/global-hiring", label: "Global Hiring" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="HireNest Global">
            <img
              src={logo}
              alt="HireNest Global"
              className="h-9 w-9 md:h-10 md:w-10 object-contain drop-shadow-[0_2px_10px_rgba(80,140,255,0.35)] transition-transform duration-500 group-hover:scale-105"
            />
            <span className="font-display text-xl tracking-wide">
              Hire<span className="text-gold">Nest</span> Global
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3.5 py-1.5 text-[13px] tracking-wide text-muted-foreground hover:text-foreground transition-colors rounded-full"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="btn-gold rounded-full px-5 py-2 text-[13px] font-medium"
            >
              Get Started
            </Link>
          </div>

          <button
            className="lg:hidden text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-3 glass-strong rounded-2xl p-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm text-muted-foreground hover:text-gold rounded-lg"
                activeProps={{ className: "text-gold" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
