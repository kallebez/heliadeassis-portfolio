export function moveItem<T>(items: T[] | null, index: number, direction: -1 | 1): T[] | null {
  if (!items) return items;
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
  const copy = [...items];
  copy.splice(target, 0, ...copy.splice(index, 1));
  return copy;
}

export function csvCell(value: string): string {
  const safe = /^[\s]*[=+@\-]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}