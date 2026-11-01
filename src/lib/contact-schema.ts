import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(100, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp com DDD.")
    .max(20, "Número muito longo.")
    .regex(/^[\d\s()+.-]+$/, "Informe apenas números, por favor."),
  email: z.union([z.literal(""), z.string().trim().email("E-mail inválido.").max(255)]),
  message: z
    .string()
    .trim()
    .min(10, "Conte um pouco mais para eu entender como ajudar.")
    .max(1000, "Mensagem muito longa (máximo 1000 caracteres)."),
  consent: z.boolean().refine((v) => v === true, "É preciso autorizar o uso dos dados para contato."),
  website: z.string().max(0),
});

export type ContactInput = z.infer<typeof contactSchema>;
