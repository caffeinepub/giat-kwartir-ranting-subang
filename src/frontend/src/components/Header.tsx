import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!identity;

  const { data: userRole } = useQuery({
    queryKey: ["userRole", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isLoggedIn) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });

  const isAdmin = userRole === UserRole.admin;
  const isAdminOrPembantu = isAdmin || userRole === UserRole.user;

  return (
    <header
      className="sticky top-0 z-50 text-primary-foreground shadow-lg"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.28 0.1 145) 0%, oklch(0.34 0.12 145) 60%, oklch(0.38 0.14 145) 100%)",
      }}
    >
      {/* Gold accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.75 0.17 80), oklch(0.82 0.14 80), oklch(0.75 0.17 80))",
        }}
      />

      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "oklch(0.99 0.005 145 / 0.15)",
              border: "2px solid oklch(0.75 0.17 80 / 0.6)",
            }}
          >
            <img
              src="/assets/generated/pramuka-logo-transparent.dim_200x200.png"
              alt="Logo Pramuka"
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-base leading-tight tracking-tight">
              Giat Kwartir Ranting
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: "oklch(0.85 0.14 80)" }}
            >
              Kwarcab Subang
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          <Link
            to="/"
            className="text-sm font-medium opacity-85 hover:opacity-100 transition-opacity"
            data-ocid="nav.beranda.link"
          >
            Beranda
          </Link>
          <Link
            to="/ranking"
            className="text-sm font-medium opacity-85 hover:opacity-100 transition-opacity"
            data-ocid="nav.ranking.link"
          >
            Ranking
          </Link>
          {isLoggedIn && isAdminOrPembantu && (
            <Link
              to="/form"
              className="text-sm font-medium opacity-85 hover:opacity-100 transition-opacity"
              data-ocid="nav.form.link"
            >
              Form Penilaian
            </Link>
          )}
          {isLoggedIn && isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium opacity-85 hover:opacity-100 transition-opacity"
              data-ocid="nav.admin.link"
            >
              Admin
            </Link>
          )}
          {isLoggedIn ? (
            <Button
              size="sm"
              variant="outline"
              onClick={clear}
              className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              data-ocid="nav.logout_button"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Keluar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              style={{
                background: "oklch(0.75 0.17 80)",
                color: "oklch(0.22 0.06 80)",
              }}
              className="font-semibold hover:opacity-90 border-0"
              data-ocid="nav.login_button"
            >
              <LogIn className="h-4 w-4 mr-1" />
              {isLoggingIn ? "Masuk..." : "Masuk"}
            </Button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-primary-foreground/20 px-4 py-4 flex flex-col gap-3"
          style={{ background: "oklch(0.28 0.1 145)" }}
        >
          <Link
            to="/"
            className="text-sm font-medium text-primary-foreground"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.beranda.link"
          >
            Beranda
          </Link>
          <Link
            to="/ranking"
            className="text-sm font-medium text-primary-foreground"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.ranking.link"
          >
            Ranking
          </Link>
          {isLoggedIn && isAdminOrPembantu && (
            <Link
              to="/form"
              className="text-sm font-medium text-primary-foreground"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.form.link"
            >
              Form Penilaian
            </Link>
          )}
          {isLoggedIn && isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-primary-foreground"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.admin.link"
            >
              Admin
            </Link>
          )}
          {isLoggedIn ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                clear();
                setMenuOpen(false);
              }}
              className="bg-transparent border-primary-foreground/40 text-primary-foreground w-fit"
              data-ocid="nav.logout_button"
            >
              <LogOut className="h-4 w-4 mr-1" /> Keluar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                login();
                setMenuOpen(false);
              }}
              disabled={isLoggingIn}
              style={{
                background: "oklch(0.75 0.17 80)",
                color: "oklch(0.22 0.06 80)",
              }}
              className="font-semibold w-fit border-0"
              data-ocid="nav.login_button"
            >
              <LogIn className="h-4 w-4 mr-1" />
              {isLoggingIn ? "Masuk..." : "Masuk"}
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
