import { describe, expect, it } from "vitest";
import { hasTransparency, imageOutputType, imageScale, isSupportedImage, isImageTooLarge } from "@/lib/image-utils";

function file(type: string, size: number): File {
  return new File([new Uint8Array(size)], "foto", { type });
}

describe("fotos aceitas no painel", () => {
  it("aceita png, jpg e webp", () => {
    expect(isSupportedImage(file("image/png", 10))).toBe(true);
    expect(isSupportedImage(file("image/jpeg", 10))).toBe(true);
    expect(isSupportedImage(file("image/webp", 10))).toBe(true);
  });
  it("recusa outros formatos", () => {
    expect(isSupportedImage(file("image/gif", 10))).toBe(false);
    expect(isSupportedImage(file("application/pdf", 10))).toBe(false);
  });
  it("recusa arquivos acima de 8 MB", () => {
    expect(isImageTooLarge(file("image/png", 8 * 1024 * 1024))).toBe(false);
    expect(isImageTooLarge(file("image/png", 8 * 1024 * 1024 + 1))).toBe(true);
  });
});

describe("ajuste de tamanho", () => {
  it("reduz fotos grandes mantendo a proporção", () => {
    expect(imageScale(4000, 2000)).toBe(0.25);
  });
  it("não amplia fotos pequenas", () => {
    expect(imageScale(600, 800)).toBe(1);
  });
  it("não divide por zero com medidas inválidas", () => {
    expect(imageScale(0, 0)).toBe(1);
  });
});

describe("saída em png ou jpg", () => {
  it("mantém png quando a imagem tem transparência", () => {
    const rgba = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 0]);
    expect(hasTransparency(rgba)).toBe(true);
    expect(imageOutputType("image/png", true)).toBe("image/png");
  });
  it("usa jpg quando o png é opaco", () => {
    const rgba = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 255]);
    expect(hasTransparency(rgba)).toBe(false);
    expect(imageOutputType("image/png", false)).toBe("image/jpeg");
  });
  it("nunca entrega jpg com transparência", () => {
    expect(imageOutputType("image/jpeg", true)).toBe("image/jpeg");
    expect(imageOutputType("image/webp", true)).toBe("image/png");
  });
});
