import { Link } from "@tanstack/react-router";
import { SiInstagram, SiReddit, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const socialLinks = [
    { icon: SiX, label: "Twitter" },
    { icon: SiInstagram, label: "Instagram" },
    { icon: SiYoutube, label: "YouTube" },
    { icon: SiReddit, label: "Reddit" },
  ];

  const communityLinks = [
    { label: "Guidelines", href: "/" },
    { label: "About", href: "/" },
    { label: "Contact", href: "/" },
  ];

  const groupLinks = [
    "AKB48",
    "SKE48",
    "NMB48",
    "HKT48",
    "JKT48",
    "BNK48",
    "MNL48",
    "SNH48",
  ];

  return (
    <footer
      className="border-t border-border mt-16"
      style={{ background: "oklch(0.10 0.015 255)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-0.5">
              <span className="font-display font-bold text-xl text-primary">
                48
              </span>
              <span className="font-display font-bold text-xl text-foreground">
                LIVEUPDATE
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The premier community platform for 48 Group fans worldwide. News,
              discussions, and member database.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="p-2 rounded-lg bg-muted text-muted-foreground cursor-default"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="section-label">Sections</h3>
            <nav className="space-y-2">
              {(
                [
                  { href: "/", label: "48HOME" },
                  { href: "/live", label: "48LIVE" },
                  { href: "/rumor", label: "48RUMOR" },
                  { href: "/discuss", label: "48DISSCUS" },
                  { href: "/groups", label: "48GROUP" },
                  { href: "/members", label: "MEMBER DATABASE" },
                ] as const
              ).map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Groups */}
          <div className="space-y-4">
            <h3 className="section-label">48 Groups</h3>
            <div className="grid grid-cols-2 gap-1">
              {groupLinks.map((g) => (
                <a
                  key={g}
                  href={`/groups/${g.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
                >
                  {g}
                </a>
              ))}
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="section-label">Community</h3>
            <nav className="space-y-2">
              <Link
                to="/profile"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Profile
              </Link>
              {communityLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} 48LIVEUPDATE. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
