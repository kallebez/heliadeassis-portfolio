import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCircle, Coffee, HeartHandshake } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { contentQuery, parseDepoimentos, parseFaq } from "@/lib/content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helia de Assis — Psicanalista e Terapeuta Cristã" },
      { name: "description", content: "Psicanálise e terapia cristã com acolhimento, escuta e fé. Atendimento online e presencial. Conheça o trabalho de Helia de Assis." },
      { property: "og:title", content: "Helia de Assis — Psicanalista e Terapeuta Cristã" },
      { property: "og:description", content: "Psicanálise e terapia cristã com acolhimento, escuta e fé." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Helia de Assis — Psicanalista e Terapeuta Cristã",
          description: "Psicanálise e terapia cristã com acolhimento, escuta e fé.",
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Index,
});

const passos = [
  { icon: MessageCircle, titulo: "Você me envia uma mensagem", texto: "Pelo WhatsApp ou pelo formulário de contato, do seu jeito." },
  { icon: Coffee, titulo: "Conversamos para nos conhecer", texto: "Um primeiro encontro para entender o que você procura, sem compromisso." },
  { icon: HeartHandshake, titulo: "Iniciamos o acompanhamento", texto: "Sessões no seu ritmo, em um espaço de escuta e cuidado." },
];

function Index() {
  const { data: c } = useSuspenseQuery(contentQuery);
  const servicos = ([1, 2, 3] as const).map((n) => ({
    t: c[`servico${n}_titulo` as const],
    d: c[`servico${n}_texto` as const],
    p: c[`servico${n}_paraquem` as const],
    m: c[`servico${n}_modalidade` as const],
  }));
  const faq = parseFaq(c.faq_json);
  const depoimentos = parseDepoimentos(c.depoimentos_json);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
        <div className="fade-up">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">{c.subtitulo}</p>
          <h1 className="text-5xl leading-[1.05] md:text-7xl">{c.inicio_titulo}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{c.inicio_texto}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contato" className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90">
              Agendar conversa
            </Link>
            <Link to="/sobre" className="rounded-full border px-6 py-3 transition hover:border-primary hover:text-primary">
              Conhecer minha história
            </Link>
          </div>
        </div>
        <img src={c.inicio_foto || hero} alt={`Foto de ${c.nome}`} width={1024} height={1280}
          className="fade-up aspect-[4/5] w-full rounded-[2rem] object-cover" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl md:text-5xl">Como posso te ajudar</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {servicos.map((s, i) => (
            <div key={i} className="rounded-2xl bg-card p-8">
              <span className="font-display text-3xl text-sage-deep">0{i + 1}</span>
              <h3 className="mt-4 text-2xl">{s.t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.d}</p>
              <p className="mt-4 text-sm text-muted-foreground"><strong className="text-foreground">Para quem é:</strong> {s.p}</p>
              <p className="mt-1 text-sm text-muted-foreground"><strong className="text-foreground">Modalidade:</strong> {s.m}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl md:text-5xl">Como funciona</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {passos.map((p, i) => (
            <div key={i} className="rounded-2xl border p-8 text-center">
              <p.icon className="mx-auto h-8 w-8 text-sage-deep" aria-hidden="true" />
              <h3 className="mt-4 text-2xl">{p.titulo}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {depoimentos.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="mb-10 text-4xl md:text-5xl">Quem já caminhou comigo</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {depoimentos.map((d, i) => (
              <figure key={i} className="rounded-2xl bg-card p-8">
                <blockquote className="leading-relaxed text-muted-foreground">“{d.texto}”</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-foreground">{d.nome}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Depoimentos publicados com autorização.</p>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <blockquote className="font-display text-3xl italic leading-snug text-sage-deep md:text-4xl">
          “{c.versiculo}”
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground">{c.versiculo_ref}</p>
      </section>

      {faq.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-10 text-center text-4xl md:text-5xl">Perguntas frequentes</h2>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-4xl md:text-5xl">Dê o primeiro passo</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{c.contato_texto}</p>
        <Link to="/contato" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 text-lg text-primary-foreground transition hover:opacity-90">
          Agendar conversa
        </Link>
      </section>
    </>
  );
}
