import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/content";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Helia de Assis" },
      { name: "description", content: "Agende uma conversa com Helia de Assis, psicanalista e terapeuta cristã." },
      { property: "og:title", content: "Contato — Helia de Assis" },
      { property: "og:description", content: "Agende uma conversa com Helia de Assis." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Contato,
});

function Contato() {
  const { data: c } = useSuspenseQuery(contentQuery);
  const digits = c.whatsapp.replace(/\D/g, "");
  const insta = c.instagram.replace(/^@/, "");
  const canais = [
    { label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${digits.length <= 11 ? "55" + digits : digits}` },
    { label: "E-mail", value: c.email, href: `mailto:${c.email}` },
    { label: "Instagram", value: c.instagram, href: `https://instagram.com/${insta}` },
  ];
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 md:py-20">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">Contato</p>
      <h1 className="fade-up text-5xl md:text-6xl">Vamos conversar?</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">{c.contato_texto}</p>
      <div className="mt-12 divide-y border-y">
        {canais.map((ch) => (
          <a key={ch.label} href={ch.href} target="_blank" rel="noreferrer"
            className="group flex items-center justify-between py-6 transition-colors hover:text-primary">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">{ch.label}</span>
            <span className="font-display text-2xl md:text-3xl">{ch.value} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
