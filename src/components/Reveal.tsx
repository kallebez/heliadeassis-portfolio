import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em ms para escalonar grids de cards. */
  delay?: number;
  className?: string;
};

/**
 * Reveal: fade-in + slide-up uma única vez quando o elemento entra na tela.
 * Usa IntersectionObserver e anima apenas opacity/transform (performático).
 * prefers-reduced-motion é tratado via CSS (.reveal fica visível sem animar).
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <div ref={ref} className={`reveal${visible ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
