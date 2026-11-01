import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Helia de Assis" },
      { name: "description", content: "Termos de uso do site de Helia de Assis, psicanalista e terapeuta cristã." },
      { property: "og:title", content: "Termos de Uso — Helia de Assis" },
      { property: "og:description", content: "Termos de uso do site." },
    ],
  }),
  component: Termos,
});

function Termos() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <h1 className="text-5xl md:text-6xl">Termos de Uso</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <h2 className="text-2xl text-foreground">Sobre este site</h2>
        <p>Este site apresenta o trabalho de Helia de Assis, psicanalista e terapeuta cristã, e oferece canais para agendamento de uma conversa inicial.</p>
        <h2 className="text-2xl text-foreground">Conteúdo informativo</h2>
        <p>Os textos deste site têm caráter informativo e acolhedor. Eles não substituem consulta, diagnóstico ou tratamento, e nenhum conteúdo aqui promete cura ou resultados.</p>
        <h2 className="text-2xl text-foreground">Formulário de contato</h2>
        <p>Ao enviar o formulário, você concorda com o uso dos seus dados apenas para retorno do contato, conforme descrito na Política de Privacidade.</p>
        <h2 className="text-2xl text-foreground">Propriedade</h2>
        <p>Textos, imagens e identidade visual deste site pertencem a Helia de Assis e não podem ser reproduzidos sem autorização.</p>
      </div>
    </section>
  );
}
