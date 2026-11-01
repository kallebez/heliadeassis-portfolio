import { queryOptions } from "@tanstack/react-query";
import { getSiteContent } from "./content.functions";

export const defaults = {
  nome: "Helia de Assis",
  subtitulo: "Psicanalista · Terapeuta Cristã",
  inicio_titulo: "Um lugar seguro para ser ouvida e cuidada.",
  inicio_texto:
    "Sou Helia de Assis. Acompanho pessoas em seus processos de dor, cura e reencontro consigo mesmas — unindo psicanálise e fé.",
  inicio_foto: "",
  servico1_titulo: "Psicanálise",
  servico1_texto: "Um espaço de escuta profunda para compreender sua história, emoções e padrões.",
  servico2_titulo: "Terapia Cristã",
  servico2_texto: "Cuidado emocional que integra a fé e os valores cristãos ao processo terapêutico.",
  servico3_titulo: "Atendimento online",
  servico3_texto: "Sessões por vídeo, com o mesmo acolhimento, onde você estiver.",
  versiculo: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
  versiculo_ref: "Mateus 11:28",
  sobre_titulo: "Fé, escuta e cuidado.",
  sobre_texto:
    "Sou Helia de Assis, psicanalista e terapeuta cristã. Acredito que cada pessoa carrega uma história única, e que ser verdadeiramente ouvida é o primeiro passo para a cura.\n\nMeu trabalho une a profundidade da psicanálise à esperança da fé cristã, oferecendo um espaço acolhedor, ético e sem julgamentos.\n\nFora do consultório, sou apaixonada por família, leitura e pelos pequenos momentos que dão sentido à vida.",
  formacao: "Psicanálise clínica · Terapia cristã",
  valores: "Acolhimento · Ética · Esperança",
  contato_texto: "Dar o primeiro passo pode ser difícil. Me envie uma mensagem e combinamos o melhor horário.",
  whatsapp: "(00) 00000-0000",
  email: "contato@heliadeassis.com",
  instagram: "@heliadeassis",
  whatsapp_msg: "Olá, Helia! Vim pelo site e gostaria de agendar uma conversa.",
  cidade: "[preencher: Cidade – UF]",
  modalidade: "Atendimento online e presencial",
  horario: "[preencher: ex. seg a sex, 9h às 18h]",
  resposta_tempo: "Respondo em até 24h",
  agenda_link: "",
  servico1_paraquem: "[preencher: para quem é este serviço]",
  servico1_modalidade: "Online ou presencial",
  servico2_paraquem: "[preencher: para quem é este serviço]",
  servico2_modalidade: "Online ou presencial",
  servico3_paraquem: "[preencher: para quem é este serviço]",
  servico3_modalidade: "Online, por videochamada",
  sobre_historia: "[preencher: sua história e por que escolheu este trabalho]",
  formacao_detalhada: "[preencher: instituição, ano, cursos e supervisão]",
  tempo_atuacao: "[preencher: X anos de atuação]",
  registro: "",
  abordagem: "[preencher: como é o seu jeito de trabalhar]",
  valor_acolhimento: "Um espaço seguro, sem julgamentos, para você ser quem é.",
  valor_etica: "Sigilo e responsabilidade profissional em cada encontro.",
  valor_esperanca: "A certeza de que sempre é possível recomeçar.",
  etica_sigilo:
    "Todo o conteúdo das sessões é confidencial e protegido pelo sigilo profissional, conforme o código de ética da profissão. O processo terapêutico é uma caminhada de cuidado — sem promessas de cura ou de resultados imediatos, mas com compromisso, escuta e respeito à sua história.",
  sobre_foto2: "",
  faq_json: JSON.stringify([
    { q: "Como funciona a primeira sessão?", a: "A primeira sessão é um momento de apresentação: você conta o que te trouxe e eu explico como funciona o acompanhamento. [preencher: detalhes da sua primeira sessão]" },
    { q: "Quanto dura e com que frequência?", a: "[preencher: duração e frequência das sessões]" },
    { q: "Como funcionam valores e pagamento?", a: "[preencher: valores e formas de pagamento]" },
    { q: "Atende só cristãos?", a: "[preencher: explique que o atendimento é aberto a todas as pessoas]" },
    { q: "Qual a diferença entre psicanálise e terapia cristã?", a: "A psicanálise é um método de escuta que busca compreender a sua história e o que está por trás do sofrimento. A terapia cristã integra a fé e os valores cristãos ao cuidado emocional. [preencher: como você apresenta essa diferença]" },
    { q: "Como funciona o sigilo?", a: "Tudo o que é dito em sessão é confidencial e protegido pelo sigilo profissional, conforme o código de ética. [preencher: detalhes adicionais, se houver]" },
    { q: "Como funciona o atendimento online?", a: "[preencher: plataforma utilizada e como agendar]" },
  ]),
  depoimentos_json: "[]",
};

export type ContentKey = keyof typeof defaults;
export type SiteContent = Record<ContentKey, string>;

export type FaqItem = { q: string; a: string };
export type Depoimento = { nome: string; texto: string };

export function parseFaq(json: string): FaqItem[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((i) => i && typeof i.q === "string" && typeof i.a === "string") : [];
  } catch {
    return [];
  }
}

export function parseDepoimentos(json: string): Depoimento[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((i) => i && typeof i.nome === "string" && typeof i.texto === "string") : [];
  } catch {
    return [];
  }
}

export function whatsappHref(whatsapp: string, msg: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  const number = digits.length <= 11 ? "55" + digits : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export const contentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async (): Promise<SiteContent> => {
    const rows = await getSiteContent();
    const out = { ...defaults } as SiteContent;
    for (const r of rows) if (r.key in out && r.value) out[r.key as ContentKey] = r.value;
    return out;
  },
});
