import { describe, expect, it } from "vitest";
import { csvCell, moveItem } from "@/lib/admin-utils";

describe("ordenação das perguntas", () => {
  it("move uma pergunta para cima", () => {
    expect(moveItem(["primeira", "segunda"], 1, -1)).toEqual(["segunda", "primeira"]);
  });
  it("preserva os limites da lista", () => {
    expect(moveItem(["primeira", "segunda"], 0, -1)).toEqual(["primeira", "segunda"]);
    expect(moveItem(["primeira", "segunda"], 1, 1)).toEqual(["primeira", "segunda"]);
  });
});

describe("exportação segura", () => {
  it("neutraliza fórmulas de planilha em mensagens", () => {
    expect(csvCell("=1+1")).toBe('"\'=1+1"');
    expect(csvCell(" +1")).toBe('"\' +1"');
  });
  it("preserva aspas e conteúdo normal", () => {
    expect(csvCell('Olá "Helia"')).toBe('"Olá ""Helia"""');
  });
});