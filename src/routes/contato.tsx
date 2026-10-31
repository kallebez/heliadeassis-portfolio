import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Helia de Assis" },
      { name: "description", content: "Agende uma conversa com Helia de Assis, psicanalista e terapeuta cristã." },
      { property: "og:title", content: "Contato — Helia de Assis" },
      { property: "og:description", content: "Agende uma conversa com Helia de Assis." },
    ],
  }),
  component: Contato,
});

const canais = [
  { label: "WhatsApp", value: "(00) 00000-0000", href: "https://wa.me/5500000000000" },
  { label: "E-mail", value: "contato@heliadeassis.com", href: "mailto:contato@heliadeassis.com" },
  { label: "Instagram", value: "@heliadeassis", href: "https://instagram.com/heliadeassis" },
];

function Contato() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 md:py-20">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">Contato</p>
      <h1 className="fade-up text-5xl md:text-6xl">Vamos conversar?</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        Dar o primeiro passo pode ser difícil. Me envie uma mensagem e combinamos o melhor horário.
      </p>
      <div className="mt-12 divide-y border-y">
        {canais.map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
            className="group flex items-center justify-between py-6 transition-colors hover:text-primary">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">{c.label}</span>
            <span className="font-display text-2xl md:text-3xl">{c.value} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
