import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { contentQuery } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helia de Assis — Psicanalista e Terapeuta Cristã" },
      { name: "description", content: "Psicanálise e terapia cristã com acolhimento, escuta e fé. Conheça o trabalho de Helia de Assis." },
      { property: "og:title", content: "Helia de Assis — Psicanalista e Terapeuta Cristã" },
      { property: "og:description", content: "Psicanálise e terapia cristã com acolhimento, escuta e fé." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Index,
});

function Index() {
  const { data: c } = useSuspenseQuery(contentQuery);
  const servicos = [1, 2, 3].map((n) => ({
    t: c[`servico${n}_titulo` as const],
    d: c[`servico${n}_texto` as const],
  }));
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
        <div className="fade-up">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">{c.subtitulo}</p>
          <h1 className="text-5xl leading-[1.05] md:text-7xl">{c.inicio_titulo}</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{c.inicio_texto}</p>
          <div className="mt-8 flex gap-4">
            <Link to="/contato" className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90">
              Agendar conversa
            </Link>
            <Link to="/sobre" className="rounded-full border px-6 py-3 transition hover:border-primary hover:text-primary">
              Conhecer minha história
            </Link>
          </div>
        </div>
        <img src={c.inicio_foto || hero} alt={c.nome} width={1024} height={1280}
          className="fade-up aspect-[4/5] w-full rounded-[2rem] object-cover" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl md:text-5xl">Como posso te ajudar</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {servicos.map((s, i) => (
            <div key={i} className="rounded-2xl bg-card p-8">
              <span className="font-display text-3xl text-sage-deep">0{i + 1}</span>
              <h3 className="mt-4 text-2xl">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <blockquote className="font-display text-3xl italic leading-snug text-sage-deep md:text-4xl">
          “{c.versiculo}”
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground">{c.versiculo_ref}</p>
      </section>
    </>
  );
}
