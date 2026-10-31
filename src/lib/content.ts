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
};

export type ContentKey = keyof typeof defaults;
export type SiteContent = Record<ContentKey, string>;

export const contentQuery = queryOptions({
  queryKey: ["site-content"],
  queryFn: async (): Promise<SiteContent> => {
    const rows = await getSiteContent();
    const out = { ...defaults } as SiteContent;
    for (const r of rows) if (r.key in out && r.value) out[r.key as ContentKey] = r.value;
    return out;
  },
});
