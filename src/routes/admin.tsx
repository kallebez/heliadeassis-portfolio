import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { contentQuery, defaults, parseDepoimentos, parseFaq, type ContentKey, type Depoimento, type FaqItem, type SiteContent } from "@/lib/content";
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
      { key: "versiculo", label: "Versículo", long: true },
      { key: "versiculo_ref", label: "Referência do versículo" },
    ],
  },
  {
    title: "Serviços",
    fields: [
      { key: "servico1_titulo", label: "Serviço 1 — nome" },
      { key: "servico1_texto", label: "Serviço 1 — descrição", long: true },
      { key: "servico1_paraquem", label: "Serviço 1 — para quem é", long: true },
      { key: "servico1_modalidade", label: "Serviço 1 — modalidade" },
      { key: "servico2_titulo", label: "Serviço 2 — nome" },
      { key: "servico2_texto", label: "Serviço 2 — descrição", long: true },
      { key: "servico2_paraquem", label: "Serviço 2 — para quem é", long: true },
      { key: "servico2_modalidade", label: "Serviço 2 — modalidade" },
      { key: "servico3_titulo", label: "Serviço 3 — nome" },
      { key: "servico3_texto", label: "Serviço 3 — descrição", long: true },
      { key: "servico3_paraquem", label: "Serviço 3 — para quem é", long: true },
      { key: "servico3_modalidade", label: "Serviço 3 — modalidade" },
    ],
  },
  {
    title: "Sobre mim",
    fields: [
      { key: "sobre_titulo", label: "Título" },
      { key: "sobre_texto", label: "Texto (linha em branco entre parágrafos)", long: true },
      { key: "sobre_historia", label: "Minha história", long: true },
      { key: "sobre_foto2", label: "Segunda foto", image: true },
      { key: "formacao", label: "Formação (resumo)" },
      { key: "formacao_detalhada", label: "Formação detalhada", long: true },
      { key: "tempo_atuacao", label: "Tempo de atuação" },
      { key: "registro", label: "Registro/filiação (deixe vazio para não exibir)" },
      { key: "abordagem", label: "Minha abordagem", long: true },
      { key: "valores", label: "Valores (resumo)" },
      { key: "valor_acolhimento", label: "Valor Acolhimento — explicação", long: true },
      { key: "valor_etica", label: "Valor Ética — explicação", long: true },
      { key: "valor_esperanca", label: "Valor Esperança — explicação", long: true },
      { key: "etica_sigilo", label: "Bloco Ética e sigilo", long: true },
    ],
  },
  {
    title: "Contato",
    fields: [
      { key: "contato_texto", label: "Texto", long: true },
      { key: "whatsapp", label: "WhatsApp (com DDD)" },
      { key: "whatsapp_msg", label: "Mensagem pronta do botão de WhatsApp", long: true },
      { key: "email", label: "E-mail" },
      { key: "instagram", label: "Instagram" },
      { key: "cidade", label: "Cidade – UF" },
      { key: "modalidade", label: "Modalidade de atendimento" },
      { key: "horario", label: "Horário de atendimento" },
      { key: "resposta_tempo", label: "Tempo médio de resposta" },
      { key: "agenda_link", label: "Link da agenda (Calendly/Google — vazio para não exibir)" },
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
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("E-mail ou senha incorretos.");
    } else if (mode === "up") {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message);
      else toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
      if (error) toast.error(error.message);
      else toast.success("Enviamos um link de recuperação para o seu e-mail.");
    }
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-2xl bg-card p-8">
      <h1 className="text-4xl">{mode === "in" ? "Entrar no painel" : mode === "up" ? "Criar conta" : "Recuperar senha"}</h1>
      <div className="space-y-2"><Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      {mode !== "reset" && (
        <div className="space-y-2"><Label htmlFor="pw">Senha</Label>
          <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      )}
      <Button type="submit" className="w-full" disabled={busy}>
        {mode === "in" ? "Entrar" : mode === "up" ? "Criar conta" : "Enviar link de recuperação"}
      </Button>
      {mode === "in" && (
        <button type="button" className="w-full text-sm text-muted-foreground hover:text-primary" onClick={() => setMode("reset")}>
          Esqueci minha senha
        </button>
      )}
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
  const [faq, setFaq] = useState<FaqItem[] | null>(null);
  const [depoimentos, setDepoimentos] = useState<Depoimento[] | null>(null);
  const [tab, setTab] = useState<"conteudo" | "listas" | "mensagens">("conteudo");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (content.data && !form) {
      setForm(content.data);
      setFaq(parseFaq(content.data.faq_json));
      setDepoimentos(parseDepoimentos(content.data.depoimentos_json));
    }
  }, [content.data, form]);

  async function signOut() {
    await supabase.auth.signOut();
  }
  if (role.isLoading || !form || !faq || !depoimentos) return <p>Carregando…</p>;
  if (!role.data)
    return (
      <div className="space-y-4">
        <p>Esta conta não tem permissão para editar o site.</p>
        <Button variant="outline" onClick={signOut}>Sair</Button>
      </div>
    );

  async function save() {
    setSaving(true);
    const all: SiteContent = { ...form!, faq_json: JSON.stringify(faq), depoimentos_json: JSON.stringify(depoimentos) };
    const rows = (Object.keys(defaults) as ContentKey[]).map((key) => ({ key, value: all[key], updated_at: new Date().toISOString() }));
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

  const tabs = [
    { id: "conteudo", label: "Textos e fotos" },
    { id: "listas", label: "FAQ e depoimentos" },
    { id: "mensagens", label: "Mensagens recebidas" },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Editar site</h1>
        <Button variant="outline" onClick={signOut}>Sair</Button>
      </div>
      <div className="flex gap-2 border-b" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            className={`px-4 py-2 text-sm transition-colors ${tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-primary"}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "conteudo" && (
        <div className="space-y-10">
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
        </div>
      )}

      {tab === "listas" && (
        <div className="space-y-10">
          <div className="space-y-4 rounded-2xl bg-card p-6">
            <h2 className="text-3xl">Perguntas frequentes</h2>
            {faq.map((item, i) => (
              <div key={i} className="space-y-2 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor={`faq-q-${i}`}>Pergunta {i + 1}</Label>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="icon" aria-label="Mover para cima" disabled={i === 0}
                      onClick={() => setFaq((f) => { const c = [...f!]; const t = c[i - 1]!; c[i - 1] = c[i]!; c[i] = t; return c; })}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Mover para baixo" disabled={i === faq.length - 1}
                      onClick={() => setFaq((f) => { const c = [...f!]; const t = c[i + 1]!; c[i + 1] = c[i]!; c[i] = t; return c; })}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Remover pergunta"
                      onClick={() => { if (window.confirm("Remover esta pergunta?")) setFaq((f) => f!.filter((_, j) => j !== i)); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Input id={`faq-q-${i}`} value={item.q} onChange={(e) => setFaq((f) => f!.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
                <Textarea rows={3} value={item.a} aria-label={`Resposta ${i + 1}`} onChange={(e) => setFaq((f) => f!.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setFaq((f) => [...f!, { q: "", a: "" }])}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar pergunta
            </Button>
          </div>

          <div className="space-y-4 rounded-2xl bg-card p-6">
            <h2 className="text-3xl">Depoimentos</h2>
            <p className="text-sm text-muted-foreground">Use apenas o primeiro nome ou iniciais, e somente com autorização da pessoa. A seção só aparece no site se houver depoimentos.</p>
            {depoimentos.map((d, i) => (
              <div key={i} className="space-y-2 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor={`dep-n-${i}`}>Nome ou iniciais</Label>
                  <Button type="button" variant="ghost" size="icon" aria-label="Remover depoimento"
                    onClick={() => { if (window.confirm("Remover este depoimento?")) setDepoimentos((f) => f!.filter((_, j) => j !== i)); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input id={`dep-n-${i}`} value={d.nome} onChange={(e) => setDepoimentos((f) => f!.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))} />
                <Textarea rows={3} value={d.texto} aria-label={`Depoimento ${i + 1}`} onChange={(e) => setDepoimentos((f) => f!.map((x, j) => (j === i ? { ...x, texto: e.target.value } : x)))} />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => setDepoimentos((f) => [...f!, { nome: "", texto: "" }])}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar depoimento
            </Button>
          </div>
        </div>
      )}

      {tab === "mensagens" && <Mensagens />}

      {tab !== "mensagens" && (
        <div className="sticky bottom-4 flex justify-end">
          <Button size="lg" onClick={save} disabled={saving}>{saving ? "Salvando…" : "Salvar alterações"}</Button>
        </div>
      )}
    </div>
  );
}

type Mensagem = { id: string; created_at: string; name: string; whatsapp: string; email: string | null; message: string; read: boolean };

function Mensagens() {
  const qc = useQueryClient();
  const mensagens = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async (): Promise<Mensagem[]> => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function toggleRead(m: Mensagem) {
    const { error } = await supabase.from("contact_messages").update({ read: !m.read }).eq("id", m.id);
    if (error) toast.error("Não foi possível atualizar.");
    else qc.invalidateQueries({ queryKey: ["contact-messages"] });
  }

  async function excluir(m: Mensagem) {
    if (!window.confirm(`Excluir a mensagem de ${m.name}? Essa ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", m.id);
    if (error) toast.error("Não foi possível excluir.");
    else { toast.success("Mensagem excluída."); qc.invalidateQueries({ queryKey: ["contact-messages"] }); }
  }

  function exportarCsv() {
    const rows = mensagens.data ?? [];
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = ["Data;Nome;WhatsApp;E-mail;Mensagem;Lida"]
      .concat(rows.map((m) => [new Date(m.created_at).toLocaleString("pt-BR"), m.name, m.whatsapp, m.email ?? "", m.message, m.read ? "sim" : "não"].map(esc).join(";")))
      .join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mensagens.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (mensagens.isLoading) return <p>Carregando…</p>;
  if (mensagens.error) return <p>Não foi possível carregar as mensagens.</p>;
  const rows = mensagens.data ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">Mensagens recebidas</h2>
        <Button variant="outline" onClick={exportarCsv} disabled={rows.length === 0}>Exportar CSV</Button>
      </div>
      {rows.length === 0 && <p className="text-muted-foreground">Nenhuma mensagem por aqui ainda.</p>}
      {rows.map((m) => (
        <div key={m.id} className={`space-y-2 rounded-2xl p-6 ${m.read ? "bg-card" : "bg-card ring-2 ring-primary/40"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{m.name} · {m.whatsapp}{m.email ? ` · ${m.email}` : ""}</p>
            <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("pt-BR")}</p>
          </div>
          <p className="leading-relaxed text-muted-foreground">{m.message}</p>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => toggleRead(m)}>{m.read ? "Marcar como não lida" : "Marcar como lida"}</Button>
            <Button variant="ghost" size="sm" onClick={() => excluir(m)}>Excluir</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
