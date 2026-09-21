// The capstone answer box: one parser for every course's typed answers.
//
// Panels and Suite apps print values of 1000 or more with a thousands comma
// (12,345.6). A learner who pastes that figure must be graded on the number
// it plainly means, so a comma is read as a thousands separator, but ONLY
// when it groups whole digits in threes. Anything else with a comma ("1,5",
// "12,34.5", "1,2345") is ambiguous between a decimal comma and a typo, and
// is refused with a message rather than guessed at.
//
// An empty box is unanswered and is sent as null, as it always was.

const PLAIN = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;
const GROUPED = /^[+-]?\d{1,3}(,\d{3})+(\.\d*)?(e[+-]?\d+)?$/i;

/**
 * Parse one typed answer.
 * @returns {{ value: number|null, error: string|null }}
 */
export function parseCapstoneAnswer(raw) {
  if (raw === null || raw === undefined) return { value: null, error: null };
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? { value: raw, error: null } : { value: null, error: 'is not a number' };
  }
  // A pasted engine figure can carry a typographic minus sign.
  const s = String(raw).trim().replace(/−/g, '-');
  if (s === '') return { value: null, error: null };
  let text = s;
  if (s.includes(',')) {
    if (!GROUPED.test(s)) {
      return {
        value: null,
        error: 'has a comma that does not group digits in threes; use a point for decimals (1.5) and commas only between thousands (12,345.6)',
      };
    }
    text = s.replace(/,/g, '');
  }
  if (!PLAIN.test(text)) return { value: null, error: 'is not a number' };
  const value = Number(text);
  if (!Number.isFinite(value)) return { value: null, error: 'is not a number' };
  return { value, error: null };
}

/**
 * Build the p_answers payload for academy_submit_capstone from the typed
 * boxes. Throws one Error naming every box that cannot be read, so nothing
 * unreadable is ever sent as a silent null or NaN.
 */
export function buildCapstoneAnswers(fields, answers) {
  const out = {};
  const bad = [];
  (fields || []).forEach((f) => {
    const { value, error } = parseCapstoneAnswer(answers?.[f.key]);
    if (error) bad.push(`${f.label || f.key} ${error}`);
    out[f.key] = value;
  });
  if (bad.length) throw new Error(`Check your answers: ${bad.join('; ')}.`);
  return out;
}
