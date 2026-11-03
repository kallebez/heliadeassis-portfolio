import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { contentQuery } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre mim — Helia de Assis" },
      { name: "description", content: "Conheça a história, formação e valores de Helia de Assis, psicanalista e terapeuta cristã." },
      { property: "og:title", content: "Sobre mim — Helia de Assis" },
      { property: "og:description", content: "História, formação e valores de Helia de Assis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Sobre,
});

function Sobre() {
  const { data: c } = useSuspenseQuery(contentQuery);
  const valores = [
    { t: "Acolhimento", d: c.valor_acolhimento },
    { t: "Ética", d: c.valor_etica },
    { t: "Esperança", d: c.valor_esperanca },
  ];
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-[1fr_1.4fr] md:py-20">
        <div>
          <p className="fade-up mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep" style={{ animationDelay: "0.1s" }}>Sobre mim</p>
          <h1 className="fade-up text-5xl leading-tight md:text-6xl" style={{ animationDelay: "0.2s" }}>{c.sobre_titulo}</h1>
          <img src={c.sobre_foto2 || c.inicio_foto || hero} alt={`Retrato de ${c.nome}`} width={1024} height={1280}
            className="fade-up mt-8 aspect-[4/5] w-full rounded-[2rem] object-cover" style={{ animationDelay: "0.3s" }} loading="lazy" />
        </div>
        <div className="fade-up space-y-6 text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.3s" }}>
          {c.sobre_texto.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
          {c.sobre_historia.split(/\n\s*\n/).map((p, i) => <p key={`h-${i}`}>{p}</p>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="card-lift h-full rounded-2xl bg-card p-8">
              <h2 className="text-3xl">Formação</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.formacao_detalhada}</p>
              <p className="mt-3 text-muted-foreground">{c.tempo_atuacao}</p>
              {c.registro && <p className="mt-3 text-sm text-muted-foreground">{c.registro}</p>}
            </div>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <div className="card-lift h-full rounded-2xl bg-card p-8">
              <h2 className="text-3xl">Minha abordagem</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.abordagem}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal><h2 className="mb-10 text-4xl md:text-5xl">Meus valores</h2></Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {valores.map((v, i) => (
            <Reveal key={v.t} delay={i * 100} className="h-full">
              <div className="card-lift h-full rounded-2xl border p-8">
                <h3 className="text-2xl">{v.t}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <Reveal>
          <div className="card-lift rounded-2xl bg-card p-8 md:p-10">
            <h2 className="text-3xl">Ética e sigilo</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{c.etica_sigilo}</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <Reveal>
          <h2 className="text-4xl md:text-5xl">Vamos conversar?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{c.contato_texto}</p>
          <Link to="/contato" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 text-lg text-primary-foreground transition duration-300 hover:scale-105 hover:opacity-90">
            Agendar conversa
          </Link>
        </Reveal>
      </section>
    </>
  );
}
