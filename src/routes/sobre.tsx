import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre mim — Helia de Assis" },
      { name: "description", content: "Conheça a história, formação e valores de Helia de Assis, psicanalista e terapeuta cristã." },
      { property: "og:title", content: "Sobre mim — Helia de Assis" },
      { property: "og:description", content: "História, formação e valores de Helia de Assis." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:grid-cols-[1fr_1.4fr] md:py-20">
      <div className="fade-up">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">Sobre mim</p>
        <h1 className="text-5xl leading-tight md:text-6xl">Fé, escuta e <em className="text-primary">cuidado</em>.</h1>
      </div>
      <div className="fade-up space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>
          Sou Helia de Assis, psicanalista e terapeuta cristã. Acredito que cada pessoa carrega
          uma história única, e que ser verdadeiramente ouvida é o primeiro passo para a cura.
        </p>
        <p>
          Meu trabalho une a profundidade da psicanálise à esperança da fé cristã, oferecendo
          um espaço acolhedor, ético e sem julgamentos.
        </p>
        <p>
          Fora do consultório, sou apaixonada por família, leitura e pelos pequenos momentos
          que dão sentido à vida.
        </p>
        <div className="grid gap-4 pt-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-card p-6">
            <h3 className="text-2xl text-foreground">Formação</h3>
            <p className="mt-2 text-base">Psicanálise clínica · Terapia cristã</p>
          </div>
          <div className="rounded-2xl bg-card p-6">
            <h3 className="text-2xl text-foreground">Valores</h3>
            <p className="mt-2 text-base">Acolhimento · Ética · Esperança</p>
          </div>
        </div>
      </div>
    </section>
  );
}
