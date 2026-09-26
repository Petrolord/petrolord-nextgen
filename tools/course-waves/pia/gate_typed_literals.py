#!/usr/bin/env python3
"""GATE: no number is TYPED into the EC7 digest.

Adapted from SC2's gate_typed_literals.py (itself D5's, D4's, D3's, D2's, D1's, H1's and FC9's). Every figure in digest.txt has to be
a return value of the engine, a golden, a stated input named on its row, or
arithmetic on values printed in the same block. The only way a typed number can
reach the digest is a numeric literal sitting in a printed string in
pia_dump.mjs OUTSIDE a ${...} substitution.

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

DUMP = os.path.join(os.environ.get('EC7_WAVE_DIR', os.path.dirname(os.path.abspath(__file__))), 'pia_dump.mjs')

ALLOWED = {
 # ---------------------------------------------------------------------------
 # WHAT IS ALLOWED, AND WHY. In this course most prose figures are RULE
 # FIGURES: a rate, band, threshold or cap that a gazetted text states. Each
 # one below is quoted verbatim, with its citation, in the digest's concepts
 # section (checked against the text by quote_check.py), and the engine
 # applies it (asserted in the digest where the rule is stated). Every other
 # figure is an engine return, a golden input or a stated input, substituted.
 # A DEAD ENTRY FAILS THE GATE.
 # ---------------------------------------------------------------------------
 '0': 'zero: the royalty by price at or below the low benchmark (Seventh Schedule para 11(1)(a)), a gas in-country share of 0, HCDT of 0 when no preceding opex is stated',
 '1': 'one: the 1 January dates of the texts (escalation, the NTA commencement) and the 1 percent capital allowance retention (PIA Fifth Schedule para 5(2))',
 '2': 'the 2 percent annual escalation of the royalty by price benchmarks (PIA Seventh Schedule para 11(1); REGS Schedule)',
 '2.5': 'the 2.5 percent gas royalty for gas used in-country (PIA Seventh Schedule para 10(6)) and the 2.5 percent tertiary education tax before 2023 (Finance Act 2021, secondary)',
 '2.50': 'the converted-lease production allowance of US$2.50 a barrel (PIA Sixth Schedule para 1(1))',
 '3': 'the 3 percent HCDT (PIA s.240(2)), the 3 percent NDDC levy (NDDC Act s.14(2)(b), secondary) and the 3 percent tertiary education tax from 2023 (Finance Act 2023 s.26)',
 '4': 'the 4 percent development levy (NTA s.59(1))',
 '4.00': 'the new-lease allowance after the cap, US$4.00 a barrel (PIA Sixth Schedule para 1(2))',
 '5': 'the 5 percent first tranche, deep offshore tranche and gas royalty (PIA Seventh Schedule para 10(3), (4), (6); REGS r.13, r.16)',
 '5,000': 'the first small-field tranche edge of 5,000 bopd (PIA Seventh Schedule para 10(4); REGS r.13(2))',
 '7.5': 'the 7.5 percent second tranche, deep offshore upper tier and frontier rate (PIA Seventh Schedule para 10(2)(c), (d), (3), (4); REGS r.13)',
 '8.00': 'the new-lease allowance below the cap, US$8.00 a barrel (PIA Sixth Schedule para 1(2))',
 '10': 'the 10 percent top of the royalty by price (PIA Seventh Schedule para 11(1)(c))',
 '10,000': 'the second small-field tranche edge of 10,000 bopd (PIA Seventh Schedule para 10(4); REGS r.13(2))',
 '12.5': 'the 12.5 percent shallow water royalty (PIA Seventh Schedule para 10(2)(b))',
 '12.50': 'the oil price at which 20 percent of the price equals US$2.50 (derived from Sixth Schedule para 1(1), stated in the boundary table)',
 '15': 'the 15 percent onshore royalty (para 10(2)(a)), the 15 percent hydrocarbon tax (PIA s.267(b); NTA s.72(b)) and the 15 percent minimum effective tax rate (NTA s.57(1))',
 '19': 'the 19 percent fifth-year capital allowance under the Act (PIA Fifth Schedule para 17(1))',
 '20': 'the 20 percent capital allowance (PIA Fifth Schedule para 17(1); NTA First Schedule Part II para 14(1)), the 20 percent of the fiscal oil price in the production allowance (Sixth Schedule para 1), 20 billion naira (NTA s.57(2)) and the stated custom deep offshore rate of 20 in the rate table',
 '30': 'the 30 percent hydrocarbon tax (PIA s.267(a); NTA s.72(a)), the 30 percent companies income tax (NTA s.56(b)) and the 30 percent escrow deposit (NTA s.86(a))',
 '50': 'the 50 USD/bbl low benchmark (Seventh Schedule para 11(1)(a)) and the 50 million barrel onshore allowance cap (Sixth Schedule para 1(2)(a)); the 50 percent working interest of the Ekene Alpha case named in the text',
 '50,000': 'the deep offshore tier edge of 50,000 bopd (PIA Seventh Schedule para 10(3); REGS r.13(1))',
 '65': 'the 65 percent cost price ratio (PIA Sixth Schedule para 2(1); NTA Sixth Schedule para 2(1))',
 '100': 'the 100 USD/bbl middle benchmark (para 11(1)(b)), the 100 million barrel shallow water allowance cap (Sixth Schedule para 1(2)(b)), a 100 percent working interest and an in-country share of 100',
 '102.00': 'the Regulations Schedule middle column as printed (REGS Schedule, quoted)',
 '104.00': 'the Regulations Schedule middle column as printed (REGS Schedule, quoted)',
 '106.00': 'the Regulations Schedule middle column as printed (REGS Schedule, quoted)',
 '108.00': 'the Regulations Schedule middle column as printed (REGS Schedule, quoted)',
 '110.00': 'the Regulations Schedule middle column as printed (REGS Schedule, quoted)',
 '150': 'the 150 USD/bbl high benchmark (Seventh Schedule para 11(1)(c))',
 '200': 'the 200 metre water depth line between shallow water and deep offshore (Seventh Schedule para 10(2)(b), (c))',
 '350': 'the 350 million barrel step the PSC scale needs where para 14(4)(d) prints 250 (quoted misprint)',
 '500': 'the 500 million barrel deep offshore and frontier allowance cap (Sixth Schedule para 1(2)(c))',
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
    body_src = strip_calls(body_src, ['must', 'refusal', 'ok', 'runG', 'runCfg'])
    # THE STATED INPUT TABLES. Each is a declaration of inputs the dump hands
    # to the engine (the hand set, the tokeniser and normaliser strings, the
    # saturation and near-tie passages, the refusal calls, the text probes,
    # the extraction records) or, for PLANTED, the fixture record's list of
    # planted defects, every item of which planted() asserts against the
    # engine. They are INPUTS, typed once, and never a measurement.
    body_src = strip_decls(body_src, ['ORDER', 'SOURCES', 'FNS', 'PROBES', 'EDGES', 'SHARES', 'BYEARS', 'PRICES', 'PA_ROWS', 'CHANGES', 'NOTE_WHEN', 'CONCEPT_GROUPS', 'DATASET', 'PROVISIONS', 'HCT_ROWS'])
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
        body = re.sub(r'\bss?\.\d+(?:\(\d+\))*(?:\([a-z]+\))*(?:(?:, | and | to )\d+(?:\(\d+\))*(?:\([a-z]+\))*)*', ' CITEREF ', body)
        body = re.sub(r'\bNTA ss?\.?\s?\d+', ' CITEREF ', body)
        body = re.sub(r'(?<![\w.])\(\d+\)(?:\([a-z]+\))*', ' CITEREF ', body)
        body = re.sub(r'\br\.\d+(?:\(\d+\))*(?:\([a-z]+\))*', ' CITEREF ', body)
        body = re.sub(r'\b(?:Schedule|Part|Chapter) (?:para |paras )?[IVX\d]+(?:\(\d+\))*', ' CITEREF ', body)
        # A COMMA-GROUPED FIGURE (5,000; 10,000; 50,000) is ONE figure and is
        # matched whole, never as its digit groups.
        body = re.sub(r'(?<![\d.,])(\d{1,3}(?:,\d{3})+)(?![\d,])', lambda m: ' ' + m.group(1).replace(',', '_') + ' ', body)
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
        body = re.sub(r'\bPRs? #\d+(?:(?:, | and )#\d+)*', ' PRREF ', body)
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
        for m in re.finditer(r'(?<![\w.])\d+(?:_\d{3})*(?:\.\d+)?(?:e[-+]?\d+)?(?![\w.])', body):
            swept += 1
            tok = m.group(0).replace('_', ',')
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
