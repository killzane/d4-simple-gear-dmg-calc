const SAFE = /^[\d+\-*/(). \t]*$/;

export function evalExpr(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return 0;
  if (!SAFE.test(trimmed)) return null;
  try {
    const result = Function(`"use strict"; return (${trimmed});`)();
    if (typeof result !== 'number' || !Number.isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}
