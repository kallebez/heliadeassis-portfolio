import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, MapPin, Timer } from "lucide-react";
import { contentQuery, whatsappHref } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Helia de Assis" },
      { name: "description", content: "Agende uma conversa com Helia de Assis, psicanalista e terapeuta cristã. Atendimento online e presencial." },
      { property: "og:title", content: "Contato — Helia de Assis" },
      { property: "og:description", content: "Agende uma conversa com Helia de Assis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Contato,
});

function Contato() {
  const { data: c } = useSuspenseQuery(contentQuery);
  const insta = c.instagram.replace(/^@/, "");
  const canais = [
    { label: "WhatsApp", value: c.whatsapp, href: whatsappHref(c.whatsapp, c.whatsapp_msg) },
    { label: "E-mail", value: c.email, href: `mailto:${c.email}` },
    { label: "Instagram", value: c.instagram, href: `https://instagram.com/${insta}` },
  ];
  const infos = [
    { icon: Clock, label: "Horário de atendimento", value: c.horario },
    { icon: Timer, label: "Tempo de resposta", value: c.resposta_tempo },
    { icon: MapPin, label: "Região e modalidade", value: `${c.cidade} · ${c.modalidade}` },
  ];
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 md:py-20">
      <p className="fade-up mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep" style={{ animationDelay: "0.1s" }}>Contato</p>
      <h1 className="fade-up text-5xl md:text-6xl" style={{ animationDelay: "0.2s" }}>Vamos conversar?</h1>
      <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.3s" }}>{c.contato_texto}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {infos.map((i, idx) => (
          <Reveal key={i.label} delay={idx * 100} className="h-full">
            <div className="card-lift h-full rounded-2xl bg-card p-5">
              <i.icon className="h-5 w-5 text-sage-deep" aria-hidden="true" />
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{i.label}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{i.value}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <Reveal>
          <div className="divide-y border-y">
            {canais.map((ch) => (
              <a key={ch.label} href={ch.href} target="_blank" rel="noreferrer"
                className="group flex items-center justify-between py-5 transition-colors duration-300 hover:text-primary">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">{ch.label}</span>
                <span className="font-display text-xl md:text-2xl">{ch.value} →</span>
              </a>
            ))}
          </div>
          {c.agenda_link && (
            <a href={c.agenda_link} target="_blank" rel="noreferrer"
              className="mt-6 inline-block rounded-full border px-6 py-3 transition duration-300 hover:scale-105 hover:border-primary hover:text-primary">
              Ver agenda disponível
            </a>
          )}
        </Reveal>
        <Reveal delay={100}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
