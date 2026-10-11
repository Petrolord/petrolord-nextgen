// Printing helpers shared by the QI digest generators (qi_dump.mjs and its
// tier parts). Every figure is printed through one of these, so the precision
// the digest header declares is the precision every line carries.

/** Six decimals; a negative zero prints as 0.000000. */
export const f6 = (x) => {
  if (x === null || x === undefined || !Number.isFinite(x)) throw new Error(`f6: not a finite number: ${x}`);
  const s = x.toFixed(6);
  return s === '-0.000000' ? '0.000000' : s;
};
/** A whole number, refused unless it is one. */
export const whole = (n) => {
  if (!Number.isInteger(n)) throw new Error(`whole: not a whole number: ${n}`);
  return String(n);
};
/** A figure as the source states it (an input), printed with String(). */
export const stated = (x) => String(x);

export function table(head, rows) {
  const out = [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`];
  for (const r of rows) out.push(`| ${r.join(' | ')} |`);
  return out.join('\n');
}

export function section(n, title, owners, body) {
  if (/[–—]/.test(title + body)) throw new Error(`section ${n} carries a dash character`);
  return `# SECTION ${n}: ${title} (owned by ${owners})\n\n${body.trim()}\n`;
}

/** The engine's own message for a call expected to refuse; throws if it does not. */
export function refusal(fn) {
  try {
    const r = fn();
    if (r && r.error) return r.error;
  } catch (e) {
    return e.message;
  }
  throw new Error('refusal(): the call did not refuse');
}
