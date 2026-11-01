import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Maria Silva",
  whatsapp: "(11) 99999-0000",
  email: "",
  message: "Gostaria de agendar uma conversa inicial.",
  consent: true,
  website: "",
};

describe("contactSchema", () => {
  it("aceita um envio válido sem e-mail", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("exige o consentimento LGPD", () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejeita honeypot preenchido", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(false);
  });

  it("rejeita e-mail inválido quando preenchido", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nao-e-email" }).success).toBe(false);
  });

  it("rejeita mensagem muito curta", () => {
    expect(contactSchema.safeParse({ ...valid, message: "oi" }).success).toBe(false);
  });
});
