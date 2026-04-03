import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ChevronDown, Menu, Search, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MOCK_GROUPS } from "../data/mockData";
import { useIsCallerAdmin } from "../hooks/useBackend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const location = useLocation();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setGroupDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const navLinks = [
    { href: "/" as const, label: "48HOME" },
    { href: "/live" as const, label: "48LIVE" },
    { href: "/rumor" as const, label: "48RUMOR" },
    { href: "/discuss" as const, label: "48DISSCUS" },
    { href: "/members" as const, label: "MEMBER" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{ background: "oklch(0.10 0.015 255)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-0.5"
            data-ocid="nav.link"
          >
            <span className="font-display font-bold text-2xl text-primary">
              48
            </span>
            <span className="font-display font-bold text-2xl text-foreground">
              LIVEUPDATE
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid="nav.link"
                className={cn(
                  "px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 border-b-2",
                  isActive(link.href) && link.href !== "/"
                    ? "text-primary border-primary"
                    : link.href === "/" && location.pathname === "/"
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-primary/50",
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* 48GROUP Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                data-ocid="nav.dropdown_menu"
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 border-b-2",
                  isActive("/groups")
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-primary/50",
                )}
              >
                48GROUP{" "}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    groupDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {groupDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-popover shadow-xl shadow-black/50 p-2 z-50 grid grid-cols-3 gap-1">
                  <Link
                    to="/groups"
                    className="col-span-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-muted transition-colors"
                    onClick={() => setGroupDropdownOpen(false)}
                    data-ocid="nav.link"
                  >
                    All Groups →
                  </Link>
                  {MOCK_GROUPS.map((group) => (
                    <a
                      key={group.slug}
                      href={`/groups/${group.slug}`}
                      className="px-2 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
                      onClick={() => setGroupDropdownOpen(false)}
                      data-ocid="nav.link"
                    >
                      {group.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.link"
                className={cn(
                  "px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-200 border-b-2 text-yellow-400",
                  isActive("/admin")
                    ? "border-yellow-400"
                    : "border-transparent hover:border-yellow-400/50",
                )}
              >
                ADMIN
              </Link>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 ml-auto">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                  placeholder="Search..."
                  data-ocid="nav.search_input"
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-40"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                data-ocid="nav.button"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            {identity ? (
              <>
                <button
                  type="button"
                  className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  data-ocid="nav.button"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 text-[10px] bg-primary text-primary-foreground border-0 flex items-center justify-center">
                    3
                  </Badge>
                </button>
                <Link
                  to="/profile"
                  data-ocid="nav.link"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-secondary transition-colors"
                >
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold hidden sm:block">
                    Profile
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.button"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {isLoggingIn ? "Signing in..." : "Login"}
              </Button>
            )}

            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.button"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-popover py-4 px-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
              className={cn(
                "block px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/groups"
            onClick={() => setMobileOpen(false)}
            data-ocid="nav.link"
            className={cn(
              "block px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
              isActive("/groups")
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            48GROUP
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-yellow-400 hover:bg-muted transition-colors"
            >
              ADMIN PANEL
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
