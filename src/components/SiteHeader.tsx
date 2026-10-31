import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre mim" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Link to="/" className="font-display text-2xl text-foreground">
        Helia de Assis
      </Link>
      <nav className="flex gap-6 text-sm">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-muted-foreground transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Helia de Assis · Psicanalista e Terapeuta Cristã
      </div>
    </footer>
  );
}
