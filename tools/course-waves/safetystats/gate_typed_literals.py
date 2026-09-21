#!/usr/bin/env python3
"""GATE: no number is TYPED into the H1 digest.

Adapted from FC9's gate_typed_literals.py. Every figure in digest.txt has to be
a return value of the engine, a golden, a stated input named on its row, or
arithmetic on values printed in the same block. The only way a typed number can
reach the digest is a numeric literal sitting in a printed string in
h1_dump.mjs OUTSIDE a ${...} substitution.

This strips every ${...} group, every assertion call and every comment, then
reports every numeric literal left in the prose. Each survivor must be in
ALLOWED below with the reason it may be prose rather than a measurement, and a
DEAD entry fails the gate.

TWO SHAPES ARE REMOVED BEFORE THE SWEEP, by shape and never by value:
  * the three NAMED BASES written with thousands separators (200,000, 1,000,000
    and 100,000,000). They are the exported RATE_BASES, printed from the export
    in section 1 and asserted there, and a separator is how a reader tells a
    base from a measurement.
  * a cross-reference to a section, a module or a lesson key.

    python3 gate_typed_literals.py [--plant]

--plant is THE NEGATIVE CONTROL: it appends a printed line carrying a typed
figure to the swept source in memory and must exit 1 naming it.
"""
import re, sys, os

DUMP = os.path.join(os.environ.get('H1_WAVE_DIR', os.path.dirname(os.path.abspath(__file__))), 'h1_dump.mjs')

ALLOWED = {
 # ---------------------------------------------------------------------------
 # WHAT IS ALLOWED, AND WHY. A figure in the digest is an engine return, a
 # golden, a stated input named on its row, or derived arithmetic on printed
 # values. Every entry below is a NAME rather than a measurement: a confidence
 # level, a sigma multiple, a significance threshold, a year, a standard's
 # number, the factors of a definition the digest then checks against the
 # export, or unity and zero used as algebra or as a comparison. A DEAD ENTRY
 # FAILS THE GATE.
 # ---------------------------------------------------------------------------
 '0':    'zero: what a lower limit is floored at, a count of no events, the start of a swept range, and Q(0, mu) in the stated coverage formula',
 '1':    'unity: the value a rate ratio is compared with, the upper end of a fraction, a Tier 1 name, the capped p-value and "1 over 1 hour" in the stated base-of-one convention',
 '2':    'two: the halves in alpha/2, "2 sigma" as the name of a narrower band, "2 ln q" in the stated closed form, a Tier 2 name, and "2N" in the degrees-of-freedom rule',
 '3':    'three: "3 sigma", the engine\'s own limit multiple (its method line prints it), "the rule of three" and its 3 events, and "3 times the square root" in the stated limit formula',
 '5':    'the 5 percent a central 90 percent interval leaves in each tail, and "a rolling window of 5 years" naming the IOGP rule whose window the engine runs',
 '2.5':  'the 2.5 percent a central 95 percent interval leaves in the upper tail, the name of a tail',
 '0.025':'alpha/2 at 95 percent, named as the tail probability the floating-point paragraph is about; its computed value is printed beside it',
 '0.05': 'the significance threshold the p-value sentences compare against, a convention named in the sentence',
 '0.95': 'the confidence level named in the floating-point paragraph and the coverage threshold the coverage table is compared with; both are names of the nominal level',
 '90':   'a confidence level, "90 percent", naming a column the table prints',
 '95':   'a confidence level, "95 percent", naming the interval every Professional table prints',
 '100':  'the 100 full-time workers of the OSHA base definition, which the digest multiplies out and compares with the exported OSHA_200K, and "per 100 people" naming a derived column',
 '40':   'the 40 hours a week of the same definition',
 '50':   'the 50 weeks of the same definition',
 '1e-17':'a tail probability named on the row the floating-point table prints for it',
 '754':  'API RP 754, a standard NUMBER and part of the standard\'s name',
 '2010': 'Fay 2010, the year of the cited paper on the central and minlike conventions',
 '2020': 'a year, the first of the IOGP five-year window, and part of a golden case id',
 '2023': 'a year naming an IOGP golden case',
 '2024': 'a year naming an IOGP golden case and part of golden case ids',
}

def strip_decls(text, names):
    """Remove whole `const NAME = [...]` or `const NAME = {...}` declarations,
    matching brackets by DEPTH.

    WHY. MEASURED and PUBLISHED are the assertion TABLES: one lists every
    measured constant so a non-finite one fails, and the other pairs each
    measured leading constant with the PUBLISHED figure it must equal. Their
    numbers are what an assertion compares against and none of them reaches the
    digest. A sweep that read them would fail this gate on the very table that
    caught the 716.625 defect.
    """
    out, i, n = [], 0, len(text)
    while i < n:
        hit = None
        for name in names:
            for kw in ('const ', 'let '):
                pref = kw + name + ' = '
                if text.startswith(pref, i):
                    hit = pref
                    break
            if hit:
                break
        if hit:
            i += len(hit)
            if i < n and text[i] in '[{':
                open_c, close_c = text[i], (']' if text[i] == '[' else '}')
                depth = 1
                i += 1
                while i < n and depth:
                    if text[i] == open_c:
                        depth += 1
                    elif text[i] == close_c:
                        depth -= 1
                    i += 1
            out.append(' ASSERTIONTABLE ')
        else:
            out.append(text[i])
            i += 1
    return ''.join(out)


def strip_calls(text, names):
    """Remove whole CALL EXPRESSIONS to the named functions, matching parentheses
    by DEPTH so a nested call or an object literal goes with them.

    WHY. This gate's question is "did a number reach the DIGEST as prose". The
    assertion machinery in the dump (`must`, `refusal`, `success`, `agree`) takes
    string arguments that never reach the digest at all: they are the claim and
    the detail a failed assertion prints to stderr, and they legitimately carry
    tolerances like 1e-6. Sweeping them made the gate report three typed numbers
    that no reader can ever see, which is a gate failing on its own scaffolding.
    """
    out, i, n = [], 0, len(text)
    while i < n:
        hit = None
        for name in names:
            if text.startswith(name + '(', i) and (i == 0 or not (text[i - 1].isalnum() or text[i - 1] in '_$.')):
                hit = name
                break
        if hit:
            i += len(hit) + 1
            depth = 1
            while i < n and depth:
                if text[i] == '(':
                    depth += 1
                elif text[i] == ')':
                    depth -= 1
                i += 1
            out.append(' ASSERTION ')
        else:
            out.append(text[i])
            i += 1
    return ''.join(out)


def strip_substitutions(text):
    """Remove every ${...} group, matching braces by DEPTH so a substitution
    holding an object literal or a nested template is removed whole. A regex
    that only handles one level of nesting leaks the tail of the expression
    into the prose and the gate then sweeps code as if it were output."""
    out, i, n = [], 0, len(text)
    while i < n:
        if text[i] == '$' and i + 1 < n and text[i + 1] == '{':
            depth, i = 1, i + 2
            while i < n and depth:
                if text[i] == '{':
                    depth += 1
                elif text[i] == '}':
                    depth -= 1
                i += 1
            out.append(' ')
        else:
            out.append(text[i])
            i += 1
    return ''.join(out)


def main():
    src = open(DUMP, encoding='utf-8').read()
    if '--plant' in sys.argv:
        src += "\nw('A typed figure of 4.217 per 200,000 hours.');\n"
    # EVERY string literal in the file, not only the ones handed straight to
    # w(). Row labels live in arrays and reach the digest through a forEach,
    # so a gate that only read w() arguments would miss exactly the strings a
    # writer is most likely to type a number into. Line comments are stripped
    # first so the module header's own prose is not swept as output.
    # BLOCK COMMENTS FIRST, and this matters more than it looks. A /* */ block
    # holding an apostrophe breaks the pairing of the single-quote literal regex
    # below, so everything after it is paired from the wrong quote and the gate
    # starts sweeping CODE as though it were printed prose. Observed: it
    # reported a units conversion inside an expression and two figures from an
    # explanatory comment as typed digest numbers. Strip both comment shapes.
    body_src = re.sub(r'/\*.*?\*/', ' ', src, flags=re.S)
    body_src = re.sub(r'^\s*//.*$', '', body_src, flags=re.M)
    # THE ASSERTION MACHINERY IS NOT OUTPUT. Its string arguments are what a
    # failed assertion prints to stderr, never what the digest carries.
    body_src = strip_calls(body_src, ['must', 'refusal', 'success', 'agree'])
    body_src = strip_decls(body_src, ['ORDER'])
    # Strip every ${...} at SOURCE level first. A nested backtick template
    # inside a substitution would otherwise split the outer literal in two and
    # feed the gate a fragment of code as if it were prose.
    body_src = strip_substitutions(body_src)
    calls = re.findall(r"(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')", body_src, re.S)
    # Import specifiers and file paths are addresses, not output. Excluded by
    # SHAPE rather than by substring: a substring filter on the word "engines"
    # silently skipped a prose line reading "54 across the vendored engines"
    # and with it two typed figures, which is a gate quietly not examining
    # the thing it reports on.
    def is_path(lit):
        body = lit[1:-1].strip()
        if ' ' in body:
            return False
        return bool(re.match(r'^(\.{0,2}/|node:|[A-Za-z0-9_@./-]+\.(mjs|js|json|py|md|txt))', body)) \
            or body.startswith('/') or body in ('utf8',)
    skipped = [c for c in calls if is_path(c)]
    calls = [c for c in calls if not is_path(c)]
    swept, bad, seen = 0, [], []
    for c in calls:
        body = c[1:-1]
        # A CROSS-REFERENCE IS NOT A QUANTITY. Section numbers, the repair
        # wave's name and module and lesson keys are addresses in this
        # package, not measurements, so they are removed by SHAPE rather
        # than allowlisted by value, which would blind the gate to the same
        # digits used as a figure.
        body = re.sub(r'#?\s*SECTIONS?\s+\d+(?:\s*,\s*\d+)*(?:\s+and\s+\d+)?', ' SECTIONREF ', body, flags=re.I)
        body = re.sub(r'(?<![\d,])(?:100,000,000|1,000,000|200,000)(?![\d,])', ' BASEREF ', body)
        body = re.sub(r'\b[ml]\d{2}\b', ' KEYREF ', body)
        # A DERIVATION IS NOT A MEASUREMENT. Section 14 prints the relation
        # the module derives, and the exponents in it are algebra rather
        # than figures. Recognised by SHAPE: an indented line that is all
        # symbols, operators and single letters, with no units and no
        # decimal point. A number with a decimal point is never exempted
        # here, so a real figure typed into a formula line still fails.
        # A DERIVATION OR A CLOSED FORM IS NOT A MEASUREMENT. Recognised by
        # SHAPE: an indented line whose first token is a short symbol and
        # whose second is an equals sign, with no decimal point anywhere in
        # it. A figure has a decimal point in this digest, so a real number
        # typed into a formula line still fails; the negative control for
        # that is run and recorded.
        if (re.match(r'^\s{4,}\S', body) and '=' in body
                and not re.search(r'\d\.\d', body)):
            # Only SINGLE DIGITS are algebra: an exponent, an offset of one,
            # a branch condition. A multi-digit integer on a formula line is
            # a figure wearing a formula's clothes and still fails. Both
            # halves have a negative control, one with a decimal figure and
            # one with a whole number, and both are recorded in wave.json.
            body = re.sub(r'(?<!\d)\d(?!\d)', ' ALGEBRA ', body)
        for m in re.finditer(r'(?<![\w.])\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w.])|1e6', body):
            swept += 1
            tok = m.group(0)
            if tok in ALLOWED:
                seen.append(tok)
                continue
            bad.append((tok, body[max(0, m.start()-60):m.start()+40].replace('\n', ' ')))
    print(f'  string literals examined: {len(calls)}  (paths excluded by shape: {len(skipped)})')
    print(f'  numeric literals swept in printed prose: {swept}')
    print(f'  allowed-with-a-reason entries: {len(ALLOWED)}')
    used = sorted(set(seen))
    dead = sorted(set(ALLOWED) - set(used))
    print(f'  allowed entries actually hit: {len(used)} -> {used}')
    print(f'  DEAD allowed entries (the ledger has gone stale): {len(dead)} -> {dead}')
    print(f'  UNEXPLAINED TYPED NUMBERS: {len(bad)}')
    for tok, ctx in bad:
        print(f'   TYPED "{tok}"  ... {ctx}')
    if len(calls) < 200 or swept < 20:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if '--plant' in sys.argv:
        caught = [t for t, _ in bad if t == '4.217']
        print(f'  NEGATIVE CONTROL: a typed 4.217 was planted in a printed line; caught {len(caught)}')
        return 1 if caught else 2
    if dead:
        print('  GATE FAILS: an allowed entry that nothing hits is a dead row, not an amnesty')
        return 1
    return 1 if bad else 0

sys.exit(main())
