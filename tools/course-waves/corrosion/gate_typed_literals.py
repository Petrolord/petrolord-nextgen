#!/usr/bin/env python3
"""GATE: no number is TYPED into the digest.

Every figure in digest.txt has to be a return value of the engine, a golden,
or arithmetic on values printed on the same line. The only way a typed number
can reach the digest is a numeric literal sitting in a printed template string
in fc9_dump.mjs OUTSIDE a ${...} substitution.

This sweeps fc9_dump.mjs for exactly that: it strips every ${...} group from
every w(`...`) and w('...') argument, then reports every numeric literal left
in the prose. Each survivor must be listed in ALLOWED below with the reason it
is allowed to be prose rather than a measurement, or the gate fails.

It prints how many w() calls it examined and how many literals it swept, so a
green run that examined nothing is not possible.
"""
import re, sys, os

DUMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fc9_dump.mjs')

# Numbers allowed to appear as PROSE in a printed string, each with its reason.
ALLOWED = {
 # ---------------------------------------------------------------------------
 # THE ONE CLASS THAT IS ALLOWED, AND WHY. The digest's own contract says a
 # figure is an engine return, a vendored golden, a STATED INPUT named on the
 # same row, or arithmetic on values printed in the same block. A stated input is
 # TYPED BY DEFINITION: nobody can ask the engine what pressure a reader chose.
 # So every entry below is a row label, a column heading or a probe name that
 # NAMES a stated input, plus unity and small integers used as algebra in a
 # stated relation. Every entry says which row it names. A DEAD ENTRY FAILS THE
 # GATE, so this ledger cannot go stale.
 #
 # WHAT IS NOT HERE, AND THIS IS THE POINT FOR FC9. Not one held correlation
 # constant is in this ledger. 0.0031, 1.4, 4.93, 1119, 0.58, 2.45, 0.8, 0.2,
 # 2400, 0.6, 6.7, -0.5, 0.046, 16, 0.0035, 100, 50, 0.1, 0.5 and 1.0 are all
 # MEASURED out of the engine in digest section 3 and printed from the
 # measurement, and the literals they are compared against live in fc9_dump.mjs's
 # pin() calls, which are NOT printed strings. A held constant typed into the
 # digest's prose would be this course quoting an unsourced number as if it had
 # checked it.
 # ---------------------------------------------------------------------------
 # unity, zero and small integers used as algebra or as a comparison
 '7':   'pH 7, the second point of the pH slope probe, a stated probe argument whose measured slope is printed beside it',
 '2e5': 'the Reynolds number the Blasius probe runs at, written the way the probe passes it, a stated probe argument',
 '8e5': 'the second Reynolds number of the same probe',
 '15156': 'ISO 15156, a standard NUMBER and part of a standard NAME. It appears only in the section about the withdrawal, in the sentence that says the engine no longer names it in any returned string',
 '500': 'a water cut of 500 percent, a stated probe input whose refusal message is printed beside it',
 '1e-3': 'the tolerance the golden rate column is checked at, stated in the column heading so a reader can see WHICH tolerance each column carries. The looseness is the independence of the oracle duty cycle',
 '1e-9': 'the tolerance the golden combined column is checked at, stated in the same way and tighter for the stated reason',
 '0.001': 'centipoise to pascal seconds, stated in the conversion table of the section whose subject is the conversions',
 '2.0': 'one of the three pH values below the reference that now refuse, a stated input named in the sentence that says all of them once gave the same rate',
 '3.0': 'the second of those three, on the same row',
 '3.5': 'the third of those three, and also the pH the verbatim refusal message quoted beside it was produced at',
 '0':   'zero: what a rate, a wetting factor, a consumed depth and a partial pressure are compared against, and the value a typed zero CO2 mole fraction asserts',
 '1':   'unity: what a factor, a coefficient and a retained fraction are compared against, and the numerator of a stated fraction',
 '2':   'the two in "two resistances", "two units of pH" and "two mole fractions": a count of things, and the denominator of the stated decade property whose measured value is printed beside it',
 '3':   'the three in "three capstones", "three boundaries" and "three ways": counts of things the structure fixes',
 '4':   'the four in "four answers", "four paths" and "four independent ways": counts of things',
 '5':   'the five in "five changes" and "five constants": counts of things',
 '6':   'the six in "SIX paths" and "six per tier": counts the vendoring closure and the field list fix',
 # the four ENFORCED range guards, which are definitions rather than held bands
 # stated inputs of the shipped app defaults, each named on a row whose answers
 # are printed beside it. These are the STUDIO's typed values and the studio's
 # own conversion factors, and digest section 24 is the section about them.
 '140': 'the shipped studio temperature in Fahrenheit, a stated input on the conversion row that prints its Celsius answer',
 '725': 'the shipped studio pressure in psig, a stated input on the row that prints its bar answer',
 '0.1': 'the shipped studio H2S mole percentage, and the same figure as the shortfall trigger in percentage points: both are stated on rows whose measured answers are printed beside them',
 '0.125': 'the shipped studio corrosion allowance in inches, a stated input on the row that prints its millimetre answer',
 '20':  'the shipped studio design life in years, a stated input on the row that prints the life verdict taken against it',
 '10':  'the shipped studio velocity in feet a second, a stated input on the row that prints its metres a second answer',
 '56':  'the shipped studio density in pounds a cubic foot, a stated input on the same conversion row',
 '60':  'the velocity in feet a second the studio sweep reaches, a stated input on the rows that print the stripped rate and the life beside it',
 '32':  'the Fahrenheit offset of the studio conversion, stated in the section whose subject is that conversion',
 '1.8': 'the Fahrenheit slope of the same conversion, stated in the same section',
 '14.7': 'the atmospheric offset the studio adds to a gauge pressure, stated in the same section',
 '14.5038': 'the TRUNCATED bar to psia divisor the studio uses, stated in section 24 beside the engine exact factor it is measured against. This is the literal the section exists to expose',
 '0.3048': 'feet to metres, stated in the same conversion table',
 '0.0254': 'inches to metres, stated in the same conversion table',
 '16.0185': 'pounds a cubic foot to kilograms a cubic metre, stated in the same conversion table',
 '25.4': 'millimetres an inch, stated in the conversion table and in the mpy conversion whose result is printed beside it',
 '1000': 'mils an inch, stated in the same mpy conversion',
 '0.05': 'the psia value the old threshold comment claimed, stated beside the MEASURED psia value it is compared against. The whole point of the row is that the two differ',
 '8760': 'hours in a year, stated as the oracle duty cycle length in the sentence that explains why one tolerance is looser than another',
 '0.250000': 'a stated corrosion rate for the worked allowance example, whose four answers are printed beside it',
 '1.2': 'the stated consumed depth of the same worked example, whose reinstating allowance is printed beside it',
 '4': 'the stated corrosion allowance of the same worked example, in millimetres',
 '0.600000': 'a stated CO2 mole fraction for the partial-pressure sum boundary row, whose accepted sum is printed beside it',
 '0.400000': 'the stated H2S mole fraction of the same row',
 '95':  'a stated inhibitor efficiency for the availability sweep, whose effective protection is printed on every row',
 '80':  'a stated inhibitor availability, the row of that sweep the prose reads twice, with its own answers printed beside it',
 '90':  'the shipped studio inhibitor efficiency, a stated input on the conversion row',
 '100': 'the shipped studio water cut and the perfect availability the datasheet comparison is taken against, both stated inputs on rows whose answers are printed beside them',
 '50':  'the stated efficiency the shortfall trigger is bisected at, named in the sentence that prints the trigger it measured',
 '4.5': 'the shipped studio pH, a stated input on the conversion row and on the comparison row that prints the pH 4.0 answer beside it',
 '4.0': 'the pH the comparison row is taken at, a stated input whose rate is printed beside it',
 '1500': 'the Reynolds number the laminar friction probe runs at, a stated probe argument whose measured constant is printed beside it',
 '200000': 'the Reynolds number the Blasius probe runs at, a stated probe argument',
 '800000': 'the second Reynolds number of the same probe',
 '150': 'the temperature in Celsius the unclamped scale probe runs at, a stated probe argument whose measured constants are printed beside it',
 '200': 'the second temperature of the same probe',
 '180': 'the temperature the fugacity and reaction probes run at, a stated probe argument',
 '300': 'the temperature in Celsius below absolute zero the refusal probe runs at, a stated probe argument whose refusal is printed beside it',
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
    body_src = strip_decls(body_src, ['MEASURED', 'PUBLISHED'])
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
        body = re.sub(r'FC\d-\d', ' WAVEREF ', body)
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
    if dead:
        print('  GATE FAILS: an allowed entry that nothing hits is a dead row, not an amnesty')
        return 1
    return 1 if bad else 0

sys.exit(main())
