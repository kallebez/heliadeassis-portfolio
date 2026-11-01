import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { contentQuery, whatsappHref } from "@/lib/content";

export function WhatsAppFloat() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: c } = useQuery({ ...contentQuery, enabled: !pathname.startsWith("/admin") });
  if (pathname.startsWith("/admin") || !c) return null;

  return (
    <a
      href={whatsappHref(c.whatsapp, c.whatsapp_msg)}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar pelo WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-sage-deep text-primary-foreground shadow-lg transition hover:scale-105 hover:opacity-90"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
