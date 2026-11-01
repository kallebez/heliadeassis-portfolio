import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { contactSchema } from "./contact-schema";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // Honeypot preenchido: finge sucesso e descarta.
    if (data.website) return { ok: true as const };

    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await sb.from("contact_messages").insert({
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email || null,
      message: data.message,
    });
    if (error) {
      console.error(error);
      throw new Error("Não foi possível enviar sua mensagem. Tente novamente.");
    }
    return { ok: true as const };
  });
