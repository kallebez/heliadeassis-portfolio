import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helia de Assis — Psicanalista e Terapeuta Cristã" },
      { name: "description", content: "Psicanálise e terapia cristã com acolhimento, escuta e fé. Conheça o trabalho de Helia de Assis." },
      { property: "og:title", content: "Helia de Assis — Psicanalista e Terapeuta Cristã" },
      { property: "og:description", content: "Psicanálise e terapia cristã com acolhimento, escuta e fé." },
    ],
  }),
  component: Index,
});

const servicos = [
  { t: "Psicanálise", d: "Um espaço de escuta profunda para compreender sua história, emoções e padrões." },
  { t: "Terapia Cristã", d: "Cuidado emocional que integra a fé e os valores cristãos ao processo terapêutico." },
  { t: "Atendimento online", d: "Sessões por vídeo, com o mesmo acolhimento, onde você estiver." },
];

function Index() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
        <div className="fade-up">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-deep">Psicanalista · Terapeuta Cristã</p>
          <h1 className="text-5xl leading-[1.05] md:text-7xl">
            Um lugar seguro para <em className="text-primary">ser ouvida</em> e cuidada.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Sou Helia de Assis. Acompanho pessoas em seus processos de dor, cura e
            reencontro consigo mesmas — unindo psicanálise e fé.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/contato" className="rounded-full bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90">
              Agendar conversa
            </Link>
            <Link to="/sobre" className="rounded-full border px-6 py-3 transition hover:border-primary hover:text-primary">
              Conhecer minha história
            </Link>
          </div>
        </div>
        <img src={hero} alt="Consultório acolhedor com poltrona, plantas e Bíblia aberta" width={1024} height={1280}
          className="fade-up aspect-[4/5] w-full rounded-[2rem] object-cover" />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-4xl md:text-5xl">Como posso te ajudar</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {servicos.map((s, i) => (
            <div key={s.t} className="rounded-2xl bg-card p-8">
              <span className="font-display text-3xl text-sage-deep">0{i + 1}</span>
              <h3 className="mt-4 text-2xl">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <blockquote className="font-display text-3xl italic leading-snug text-sage-deep md:text-4xl">
          “Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.”
        </blockquote>
        <p className="mt-4 text-sm text-muted-foreground">Mateus 11:28</p>
      </section>
    </>
  );
}
