import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { contentQuery } from "@/lib/content";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Helia de Assis" },
      { name: "description", content: "Como tratamos os dados enviados pelo formulário de contato, conforme a LGPD." },
      { property: "og:title", content: "Política de Privacidade — Helia de Assis" },
      { property: "og:description", content: "Como tratamos os dados enviados pelo formulário de contato, conforme a LGPD." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(contentQuery),
  component: Privacidade,
});

function Privacidade() {
  const { data: c } = useSuspenseQuery(contentQuery);
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 md:py-20">
      <h1 className="text-5xl md:text-6xl">Política de Privacidade</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-muted-foreground">
        <p>Esta política explica, de forma simples, como os seus dados são tratados neste site, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
        <h2 className="text-2xl text-foreground">Quais dados coletamos</h2>
        <p>Pelo formulário de contato, coletamos apenas: nome, número de WhatsApp, e-mail (opcional) e a mensagem que você escreve. Nenhum outro dado pessoal é coletado automaticamente.</p>
        <h2 className="text-2xl text-foreground">Para que usamos</h2>
        <p>Os dados servem exclusivamente para que Helia de Assis possa responder ao seu contato e agendar uma conversa. Eles não são vendidos, compartilhados com terceiros nem usados para envio de publicidade.</p>
        <h2 className="text-2xl text-foreground">Armazenamento e segurança</h2>
        <p>As mensagens ficam armazenadas em ambiente seguro, com acesso restrito à responsável pelo atendimento, e são mantidas apenas pelo tempo necessário para o contato.</p>
        <h2 className="text-2xl text-foreground">Seus direitos</h2>
        <p>Você pode, a qualquer momento, solicitar a confirmação, o acesso, a correção ou a exclusão dos seus dados. Basta enviar um e-mail para {c.email} ou uma mensagem para o WhatsApp {c.whatsapp}.</p>
        <h2 className="text-2xl text-foreground">Responsável pelos dados</h2>
        <p>Helia de Assis · E-mail: {c.email} · WhatsApp: {c.whatsapp}</p>
      </div>
    </section>
  );
}
