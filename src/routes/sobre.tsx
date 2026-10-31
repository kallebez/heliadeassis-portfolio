import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/content";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre mim — Helia de Assis" },
      { name: "description", content: "Conheça a história, formação e valores de Helia de Assis, psicanalista e terapeuta cristã." },
      { property: "og:title", content: "Sobre mim — Helia de Assis" },
      { property: "og:description", content: "História, formação e valores de Helia de Assis." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Sobre,
});

function Sobre() {
  const { data: c } = useSuspenseQuery(contentQuery);
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-[1fr_1.4fr] md:py-20">
      <div className="fade-up">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">Sobre mim</p>
        <h1 className="text-5xl leading-tight md:text-6xl">{c.sobre_titulo}</h1>
      </div>
      <div className="fade-up space-y-6 text-lg leading-relaxed text-muted-foreground">
        {c.sobre_texto.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
        <div className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-card p-6">
            <h3 className="text-2xl text-foreground">Formação</h3>
            <p className="mt-2 text-base">{c.formacao}</p>
          </div>
          <div className="rounded-2xl bg-card p-6">
            <h3 className="text-2xl text-foreground">Valores</h3>
            <p className="mt-2 text-base">{c.valores}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
