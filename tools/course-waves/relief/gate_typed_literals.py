#!/usr/bin/env python3
"""GATE: no number is TYPED into the digest.

Every figure in digest.txt has to be a return value of the engine, a golden,
or arithmetic on values printed on the same line. The only way a typed number
can reach the digest is a numeric literal sitting in a printed template string
in fc5_dump.mjs OUTSIDE a ${...} substitution.

This sweeps fc5_dump.mjs for exactly that: it strips every ${...} group from
every w(`...`) and w('...') argument, then reports every numeric literal left
in the prose. Each survivor must be listed in ALLOWED below with the reason it
is allowed to be prose rather than a measurement, or the gate fails.

It prints how many w() calls it examined and how many literals it swept, so a
green run that examined nothing is not possible.
"""
import re, sys, os

DUMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fc5_dump.mjs')

# Numbers allowed to appear as PROSE in a printed string, each with its reason.
ALLOWED = {
 # ---------------------------------------------------------------------------
 # THE ONE CLASS THAT IS ALLOWED, AND WHY. The digest's own contract says a
 # figure is an engine return, a published golden, a STATED INPUT named on the
 # same row, or arithmetic on values printed in the same block. A stated input
 # is TYPED BY DEFINITION: nobody can ask the engine what pressure a reader
 # chose. So the entries below are all row labels, column headings and probe
 # names that NAME a stated input or a published boundary whose ANSWER is
 # printed on the same page, plus unity and small integers used as algebra in a
 # stated relation. Every entry says which row it names. A dead entry fails the
 # gate, so this ledger cannot go stale.
 # ---------------------------------------------------------------------------
 # unity, zero and small integers used as algebra or as a comparison
 '1':    'unity: what a coefficient, a factor or a ratio is compared against, and the numerator of a stated fraction',
 '1.0':  'unity again, written with a decimal where the engine prints a factor at that precision: what KN, Kb, KSH and Kv are compared against',
 '2':    'the two in the exponent (k+1)/2 of the stated closed form, and in the (2/(k+1)) bracket, algebra whose numeric result is printed beside it',
 '4':    'the four in 4 pi and in 4/3, algebra in a stated relation whose MEASURED value is printed beside it',
 '5':    'the five percent inventory cap the engine enforces, whose substep count is printed beside it',
 '6':    'quoted from the engine OWN note text, "L/D above 6: go to a larger diameter", which is printed verbatim in the same table',
 # published standard numbers and boundaries the engine names
 '10':   'the overpressure percentage a process case is allowed: a row label of the section 3 sweep and a stated input on that row',
 '25':   'the wetted-height limit in feet, quoted from the engine OWN note, which is printed verbatim on the same page',
 '26.0001': 'the required area of a row printed directly above, named so the reader can find the row whose refusal message carries its own evidence',
 '200':  'the Reynolds number BELOW WHICH the published liquid set is asserted to carry a row: the row and its Reynolds number are printed beside the sentence',
 '521':  'API 521, a standard number',
 '526':  'API 526, a standard number',
 # the package's own bases, named in the prose that states a conversion whose
 # result is printed on the same page
 '14.696': 'the package standard pressure in psia, named in the prose that states the drum rate conversion whose result is printed beside it',
 '519.67': 'the package standard temperature in degR, on the same terms',
 '520':  'the standard temperature in degR the app own drum conversion uses, named beside the package base in the same sentence',
 # MEASUREMENT PROBE NAMES. Each names the constant the probe RECOVERS, and the
 # recovered value is printed on the same row.
 '21000': 'the name of the probe that MEASURES the pool fire constant with drainage; the measured value is printed on the same row',
 '34500': 'the same for the constant without drainage',
 '2800':  'the same for the liquid Reynolds constant',
 '38':    'the same for the liquid leading constant',
 '51.5':  'the same for the steam leading constant',
 '735':   'the same for the subcritical leading constant',
 '0.82':  'the exponent named in the column heading of the row that MEASURES it, printed on that row',
 '1e18':  'the Reynolds number the Kv asymptote probe is asked at, stated in the how-it-was-asked column beside the answer',
 '1e4':   'the Reynolds number the Kv inverse-root probe is asked at, on the same terms',
 # ROW AND COLUMN LABELS naming a stated input of the row they head
 '0.8':   'the pressure ratio the F2 column of the section 4 table is evaluated at, stated in that column heading',
 '0.83':  'the superheated KSH the same case is re-run at, stated in the sentence whose answer is printed beside it',
 '0.1':   'a depth fraction naming a row of the table printed directly above',
 '0.75':  'a second depth fraction naming another row of the same table',
 '0.30':  'a holdup naming a row of the section 18 sweep, in the sentence that reads two of its rows',
 '0.90':  'the other holdup naming a row of the same sweep',
 '0.3':   'the environment factor of a variant row of the section 16 table, stated in that row label',
 '2.0':   'a trimmed level in feet naming a variant row of the same table, and an orifice in inches naming a closed-form row',
 '8.0':   'a raised level in feet naming a variant row of the same table',
 '90':    'a latent heat in Btu/lb naming a variant row of the same table',
 '0.60':  'a discharge coefficient naming a closed-form row of section 21',
 '1800':  'a start pressure in psia naming a closed-form row of section 21',
 '14':    'a drum diameter in feet naming a note row of section 26',
}

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
    body_src = re.sub(r'^\s*//.*$', '', src, flags=re.M)
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
