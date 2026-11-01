import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { contentQuery } from "@/lib/content";

const links = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre mim" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-foreground">
          Helia de Assis
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Navegação principal">
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
          <Link
            to="/contato"
            className="rounded-full bg-primary px-5 py-2 text-primary-foreground transition hover:opacity-90"
          >
            Agendar conversa
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="border-t px-6 py-4 md:hidden" aria-label="Navegação móvel">
          <ul className="space-y-3 text-base">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="block py-1 text-muted-foreground transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contato"
                className="mt-2 inline-block rounded-full bg-primary px-5 py-2 text-primary-foreground"
              >
                Agendar conversa
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: c } = useQuery({ ...contentQuery, enabled: !pathname.startsWith("/admin") });
  if (pathname.startsWith("/admin")) return null;

  const insta = (c?.instagram ?? "").replace(/^@/, "");
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-foreground">{c?.nome ?? "Helia de Assis"}</p>
          <p className="mt-1 text-sm text-muted-foreground">{c?.subtitulo ?? "Psicanalista · Terapeuta Cristã"}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Todo atendimento é confidencial e segue o código de ética da profissão.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <p className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">Navegação</p>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-sm uppercase tracking-widest text-muted-foreground">Contato</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {c?.whatsapp && <li>WhatsApp: {c.whatsapp}</li>}
            {c?.email && <li>E-mail: {c.email}</li>}
            {insta && (
              <li>
                Instagram:{" "}
                <a href={`https://instagram.com/${insta}`} target="_blank" rel="noreferrer" className="hover:text-primary">
                  @{insta}
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/privacidade" className="text-muted-foreground transition-colors hover:text-primary">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link to="/termos" className="text-muted-foreground transition-colors hover:text-primary">
                Termos de Uso
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Helia de Assis · Psicanalista e Terapeuta Cristã
        </p>
      </div>
    </footer>
  );
}
