import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { contentQuery, defaults, type ContentKey, type SiteContent } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel — Helia de Assis" },
      { name: "description", content: "Painel para editar o conteúdo do site." },
      { property: "og:title", content: "Painel — Helia de Assis" },
      { property: "og:description", content: "Painel para editar o conteúdo do site." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Field = { key: ContentKey; label: string; long?: boolean; image?: boolean };
const sections: { title: string; fields: Field[] }[] = [
  { title: "Geral", fields: [{ key: "nome", label: "Nome" }, { key: "subtitulo", label: "Profissão (aparece no topo)" }] },
  {
    title: "Página inicial",
    fields: [
      { key: "inicio_titulo", label: "Título principal" },
      { key: "inicio_texto", label: "Texto de apresentação", long: true },
      { key: "inicio_foto", label: "Foto principal", image: true },
      { key: "servico1_titulo", label: "Serviço 1 — nome" },
      { key: "servico1_texto", label: "Serviço 1 — descrição", long: true },
      { key: "servico2_titulo", label: "Serviço 2 — nome" },
      { key: "servico2_texto", label: "Serviço 2 — descrição", long: true },
      { key: "servico3_titulo", label: "Serviço 3 — nome" },
      { key: "servico3_texto", label: "Serviço 3 — descrição", long: true },
      { key: "versiculo", label: "Versículo", long: true },
      { key: "versiculo_ref", label: "Referência do versículo" },
    ],
  },
  {
    title: "Sobre mim",
    fields: [
      { key: "sobre_titulo", label: "Título" },
      { key: "sobre_texto", label: "Texto (deixe uma linha em branco entre parágrafos)", long: true },
      { key: "formacao", label: "Formação" },
      { key: "valores", label: "Valores" },
    ],
  },
  {
    title: "Contato",
    fields: [
      { key: "contato_texto", label: "Texto", long: true },
      { key: "whatsapp", label: "WhatsApp (com DDD)" },
      { key: "email", label: "E-mail" },
      { key: "instagram", label: "Instagram" },
    ],
  },
];

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return null;
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {session ? <Editor userId={session.user.id} /> : <Login />}
    </section>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("E-mail ou senha incorretos.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message);
      else toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
    }
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-2xl bg-card p-8">
      <h1 className="text-4xl">{mode === "in" ? "Entrar no painel" : "Criar conta"}</h1>
      <div className="space-y-2"><Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="pw">Senha</Label>
        <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</Button>
      <button type="button" className="w-full text-sm text-muted-foreground hover:text-primary"
        onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
      </button>
    </form>
  );
}

async function resizeImage(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

function Editor({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const role = useQuery({
    queryKey: ["is-admin", userId],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      return !!data;
    },
  });
  const content = useQuery(contentQuery);
  const [form, setForm] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (content.data && !form) setForm(content.data); }, [content.data, form]);

  async function signOut() {
    await supabase.auth.signOut();
  }
  if (role.isLoading || !form) return <p>Carregando…</p>;
  if (!role.data)
    return (
      <div className="space-y-4">
        <p>Esta conta não tem permissão para editar o site.</p>
        <Button variant="outline" onClick={signOut}>Sair</Button>
      </div>
    );

  async function save() {
    setSaving(true);
    const rows = (Object.keys(defaults) as ContentKey[]).map((key) => ({ key, value: form![key], updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("site_content").upsert(rows);
    setSaving(false);
    if (error) {
      toast.error("Não foi possível salvar. Tente novamente.");
      return;
    }
    await qc.invalidateQueries({ queryKey: contentQuery.queryKey });
    toast.success("Alterações salvas! O site já foi atualizado.");
  }

  const set = (k: ContentKey, v: string) => setForm((f) => ({ ...f!, [k]: v }));

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Editar site</h1>
        <Button variant="outline" onClick={signOut}>Sair</Button>
      </div>
      {sections.map((s) => (
        <div key={s.title} className="space-y-4 rounded-2xl bg-card p-6">
          <h2 className="text-3xl">{s.title}</h2>
          {s.fields.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              {f.image ? (
                <div className="space-y-2">
                  {form[f.key] && <img src={form[f.key]} alt="" className="h-40 rounded-lg object-cover" />}
                  <Input id={f.key} type="file" accept="image/*"
                    onChange={async (e) => { const file = e.target.files?.[0]; if (file) set(f.key, await resizeImage(file)); }} />
                  {form[f.key] && <Button type="button" variant="ghost" size="sm" onClick={() => set(f.key, "")}>Voltar à foto original</Button>}
                </div>
              ) : f.long ? (
                <Textarea id={f.key} rows={f.key === "sobre_texto" ? 8 : 3} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              ) : (
                <Input id={f.key} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}
      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={save} disabled={saving}>{saving ? "Salvando…" : "Salvar alterações"}</Button>
      </div>
    </div>
  );
}
