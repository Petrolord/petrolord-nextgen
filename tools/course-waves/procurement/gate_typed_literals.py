#!/usr/bin/env python3
"""GATE: no number is TYPED into the SC2 digest.

Adapted from D5's gate_typed_literals.py (itself D4's, D3's, D2's, D1's, H1's and FC9's). Every figure in digest.txt has to be
a return value of the engine, a golden, a stated input named on its row, or
arithmetic on values printed in the same block. The only way a typed number can
reach the digest is a numeric literal sitting in a printed string in
sc2_dump.mjs OUTSIDE a ${...} substitution.

This strips every ${...} group, every assertion call and every comment, then
reports every numeric literal left in the prose. Each survivor must be in
ALLOWED below with the reason it may be prose rather than a measurement, and a
DEAD entry fails the gate.

SHAPES REMOVED BEFORE THE SWEEP, by shape and never by value:
  * a cross-reference to a section, a module or a lesson key;
  * a CITATION: a section of an Act (s.14, s.31(14)), a paragraph or ITB
    clause (para 5.50, ITB 34.1), an Act or gazette number, a journal volume,
    a year or a date (2007, 2026-09-26), an edition;
  * a bid code, a tender number or a well name.

    python3 gate_typed_literals.py [--plant]

--plant is THE NEGATIVE CONTROL: it appends a printed line carrying a typed
figure to the swept source in memory and must exit 1 naming it.
"""
import re, sys, os

DUMP = os.path.join(os.environ.get('SC2_WAVE_DIR', os.path.dirname(os.path.abspath(__file__))), 'sc2_dump.mjs')

ALLOWED = {
 # ---------------------------------------------------------------------------
 # WHAT IS ALLOWED, AND WHY. A figure in the digest is an engine return, a
 # fixture value read from the file, a stated input named in code and
 # substituted, a source figure typed with its citation, or derived arithmetic
 # on printed values. Every entry below is a COUNT WORD, a FORMULA CONSTANT the
 # engine's basis states, or a RULE FIGURE the cited text states and the
 # engine's own basis prints. A DEAD ENTRY FAILS THE GATE.
 # ---------------------------------------------------------------------------
 '0':   'zero: the lower end of a scale, an NPT fraction of zero in a stated probe, 0 where no overrun occurs, 0 failed assertions',
 '1':   'one: the 1 of the discount factor 1 / (1 + r) and of 1 - X, a quantity of one in a stated probe line, year 1, and the names Table 1, Example 1 and Stage 1 of the cited sources',
 '2':   'two: the names Annex 2 and Example 2 of the cited sources',
 '3':   'three: the name Annex 3 of the cited source',
 '100': 'the 100 of the score formulas the engine basis states (St = 100 x T / Thigh, Sc = 100 x Cmin / C) and the top of a score, St 100',
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
        src += "\nw('A typed figure of 4.217 psi.');\n"
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
    body_src = strip_calls(body_src, ['must', 'refusal', 'success', 'noTie'])
    # THE STATED INPUT TABLES. Each is a declaration of inputs the dump hands
    # to the engine (the hand set, the tokeniser and normaliser strings, the
    # saturation and near-tie passages, the refusal calls, the text probes,
    # the extraction records) or, for PLANTED, the fixture record's list of
    # planted defects, every item of which planted() asserts against the
    # engine. They are INPUTS, typed once, and never a measurement.
    body_src = strip_decls(body_src, ['ORDER', 'PUB', 'SOURCES', 'EXPORTS', 'DSRC', 'PROBES', 'EDGE', 'RV', 'CAPS', 'PLANTED', 'tieBids', 'TYN', 'TY', 'TOL_PROBE', 'DEC_PROBE', 'TIE_COST', 'RV_PROBE', 'S16_PROBE', 'CT_FLAT', 'BAND_EDGE', 'SC_EDGE', 'SCHED_PROBE', 'TIE12', 'ALB_EDGE', 'CELLS', 'USER_T', 'KK_PRICES'])
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
        # A CITATION IS AN ADDRESS: s.14, s.31(14), s.17 to s.24, para 5.50,
        # paras 3.7 and 3.8, ITB 34.1, ITB 35.1(c), Act No. 2, No. 65, Vol. 94,
        # 15(3), p. 409, a year, a date, an edition.
        body = re.sub(r'\bs\.\d+(?:\(\d+\))*', ' CITEREF ', body)
        body = re.sub(r'\bparas? \d+(?:\.\d+)*(?: (?:and|to) \d+(?:\.\d+)*)?(?: \([a-d]\))?', ' CITEREF ', body)
        body = re.sub(r'\bITB \d+\.\d+(?:\([a-c]\))*', ' CITEREF ', body)
        body = re.sub(r'\b(?:Act|No\.|Vol\.) ?(?:No\. )?\d+', ' CITEREF ', body)
        body = re.sub(r'\b\d+\(\d\)', ' CITEREF ', body)
        body = re.sub(r'\bp\. \d+', ' CITEREF ', body)
        body = re.sub(r'\b\d{4}-\d{2}-\d{2}(?:T[\d:]+Z)?', ' DATEREF ', body)
        body = re.sub(r'\b(?:19|20)\d{2}\b', ' YEARREF ', body)
        body = re.sub(r'\b\d+(?:st|nd|rd|th)\b', ' EDITIONREF ', body)
        body = re.sub(r'\bEK-11/\w+/\d{4}-\d{2}', ' TENDERREF ', body)
        body = re.sub(r'\b(?:WS|MS|T|U|R|B|K|LO|E|S|Z|L|I|H|N|NC)\d+\b', ' BIDREF ', body)
        body = re.sub(r'\bAPI (?:\d+\w*)(?: and API \d+\w*)*', ' STANDARDREF ', body)
        body = re.sub(r'\bPR #\d+', ' PRREF ', body)
        body = re.sub(r'\b[ml]\d{2}\b', ' KEYREF ', body)
        # A FIELD PATH NAMED BY A REFUSAL (values[1], index[5]) is an address.
        body = re.sub(r'\b\w+\[\d+\]', ' FIELDREF ', body)
        # A WELL NAME IS NOT A QUANTITY: EKENE-7 and EKENE-3 are names.
        # A QUOTATION IS NOT A MEASUREMENT. In this course most worked examples
        # are TEXT: a stated string handed to the tokeniser, the normaliser or
        # the claim check, or a fixture answer quoted beside its score. A span in
        # double quotes or in backticks quotes that input verbatim, so it is
        # removed by SHAPE. Every figure the engine RETURNS about it is still a
        # substitution, and a bare number outside quotes still fails.
        body = re.sub(r'"[^"\n]{1,120}"', ' QUOTEREF ', body)
        body = re.sub(r'\\?`[^`\n]{1,120}\\?`', ' CODEREF ', body)
        body = re.sub(r'\bEkene-\d\b', ' WELLNAME ', body)
        body = re.sub(r'petrolord-engines [0-9a-f]{7}\b', ' SHAREF ', body)
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
