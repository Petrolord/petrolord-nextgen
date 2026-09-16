#!/usr/bin/env python3
"""GATE: no number is TYPED into the digest.

Every figure in digest.txt has to be a return value of the engine, a golden,
or arithmetic on values printed on the same line. The only way a typed number
can reach the digest is a numeric literal sitting in a printed template string
in fc4_dump.mjs OUTSIDE a ${...} substitution.

This sweeps fc4_dump.mjs for exactly that: it strips every ${...} group from
every w(`...`) and w('...') argument, then reports every numeric literal left
in the prose. Each survivor must be listed in ALLOWED below with the reason it
is allowed to be prose rather than a measurement, or the gate fails.

It prints how many w() calls it examined and how many literals it swept, so a
green run that examined nothing is not possible.
"""
import re, sys, os

DUMP = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fc4_dump.mjs')

# Numbers allowed to appear as PROSE in a printed string, each with its reason.
ALLOWED = {
 '14.65': "quoted to be contradicted: the module's own comment names this base pressure and Section 2 computes the base its pound mole actually implies",
 '970':   "quoted to be contradicted: the module's comment names this latent heat and the code contains only the folded figure",
 '100':   "the lean glycol band the engine names in its OWN refusal message, quoted in the row label that asks for the refusal",
 '231':   'cubic inches in a gallon, a definition, used in a stated conversion whose result is printed beside it',
 '1728':  'cubic inches in a cubic foot, a definition, used in the same stated conversion',
 '90':    'the lean glycol band the engine names in its own refusal message, quoted as prose',
 '60':    'minutes in an hour, in the stated conversion of the amine duty column, whose result is printed beside it',
 '12':    'a decimal-place count in prose about rounding',
 '200':   'a stage count in prose naming a column the table above prints',
 '180':   'names a row of the BTEX table printed directly above, whose ratio to another named row is computed on the same line',
 '0.1':   'names a row of the same BTEX table, on the same terms',
 '0.2':   'names a row of the same BTEX table, on the same terms',
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
    # import specifiers and engine paths are addresses, not output
    calls = [c for c in calls if not re.search(r'(engines|fc-wip|node:|\.mjs|\.js|\.json|utf8)', c)]
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
        for m in re.finditer(r'(?<![\w.])\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w.])|1e6', body):
            swept += 1
            tok = m.group(0)
            if tok in ALLOWED:
                seen.append(tok)
                continue
            bad.append((tok, body[max(0, m.start()-60):m.start()+40].replace('\n', ' ')))
    print(f'  w() calls examined: {len(calls)}')
    print(f'  numeric literals swept in printed prose: {swept}')
    print(f'  allowed-with-a-reason entries: {len(ALLOWED)}')
    used = sorted(set(seen))
    dead = sorted(set(ALLOWED) - set(used))
    print(f'  allowed entries actually hit: {len(used)} -> {used}')
    print(f'  DEAD allowed entries (the ledger has gone stale): {len(dead)} -> {dead}')
    print(f'  UNEXPLAINED TYPED NUMBERS: {len(bad)}')
    for tok, ctx in bad:
        print(f'   TYPED "{tok}"  ... {ctx}')
    if len(calls) < 100 or swept < 5:
        print('  GATE REFUSES: it examined too little to have checked anything')
        return 2
    if dead:
        print('  GATE FAILS: an allowed entry that nothing hits is a dead row, not an amnesty')
        return 1
    return 1 if bad else 0

sys.exit(main())
