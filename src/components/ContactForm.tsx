import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/contact.functions";
import { contactSchema } from "@/lib/contact-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const empty = { name: "", whatsapp: "", email: "", message: "", consent: false, website: "" };

export function ContactForm() {
  const send = useServerFn(sendContactMessage);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof empty, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await send({ data: parsed.data });
      setSent(true);
      setForm(empty);
      toast.success("Mensagem enviada! Responderei em breve.");
    } catch {
      toast.error("Não foi possível enviar. Tente novamente ou chame no WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  if (sent)
    return (
      <div className="rounded-2xl bg-card p-8 text-center">
        <h2 className="text-3xl">Mensagem enviada</h2>
        <p className="mt-3 text-muted-foreground">
          Obrigada pelo contato! Responderei o mais breve possível.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
          Enviar outra mensagem
        </Button>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl bg-card p-6 md:p-8" noValidate>
      <h2 className="text-3xl">Envie uma mensagem</h2>

      <div className="space-y-2">
        <Label htmlFor="cf-name">Nome</Label>
        <Input id="cf-name" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        {errors["name"] && <p className="text-sm text-destructive">{errors["name"]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf-whats">WhatsApp (com DDD)</Label>
        <Input id="cf-whats" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} inputMode="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
        {errors["whatsapp"] && <p className="text-sm text-destructive">{errors["whatsapp"]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf-email">E-mail (opcional)</Label>
        <Input id="cf-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        {errors["email"] && <p className="text-sm text-destructive">{errors["email"]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cf-msg">Como posso te ajudar?</Label>
        <Textarea id="cf-msg" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} />
        {errors["message"] && <p className="text-sm text-destructive">{errors["message"]}</p>}
      </div>

      {/* Honeypot anti-spam: invisível para pessoas, preenchido por robôs */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="cf-website">Site</Label>
        <Input id="cf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="cf-consent"
          checked={form.consent}
          onCheckedChange={(v) => set("consent", v === true)}
        />
        <Label htmlFor="cf-consent" className="text-sm font-normal leading-snug text-muted-foreground">
          Autorizo o uso dos meus dados apenas para que Helia entre em contato comigo, conforme a{" "}
          <a href="/privacidade" className="underline hover:text-primary">Política de Privacidade</a>.
        </Label>
      </div>
      {errors["consent"] && <p className="text-sm text-destructive">{errors["consent"]}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={sending}>
        {sending ? "Enviando…" : "Enviar mensagem"}
      </Button>
    </form>
  );
}
