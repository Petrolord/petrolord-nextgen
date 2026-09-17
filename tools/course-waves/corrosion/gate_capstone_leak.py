#!/usr/bin/env python3
"""GATE: nothing the FC9 capstone grades, and no condition it is set on, reaches
the digest, the digest generator, a vendored golden row, or a sibling course's
graded answer key.

SEVEN DIRECTIONS, all checked and all counted. DIRECTION SEVEN, THE BANKS, WAS
MISSING UNTIL THE SECOND REPAIR PASS AND THREE BANK WRITERS WERE TOLD IT WAS
HERE. It was not: this gate read digest.txt, fc9_dump.mjs, the vendored golden
and the sibling waves, and had no --banks path and no argparse at all, so a
clean run said NOTHING WHATEVER about the 396 questions. The Expert writer built
the bank-side sweep by hand rather than trusting the claim and got zero on every
count, which is the only reason nobody shipped on a gate that could not see the
corpus. It is folded in here so the next wave does not rebuild it.

  1. every CONDITION in the three frozen scenarios of fc9_capstone.mjs must be
     absent from digest.txt and from fc9_dump.mjs, unless it is declared in
     SHARED below with the reason it is universal rather than a condition of a
     plant;
  2. every GRADED VALUE must be absent from digest.txt, AT FOUR RENDERINGS: the
     full double, twelve significant digits, nine significant digits, and the
     decimals the course prints that class at. The NINE-DIGIT-ONLY matcher a
     sibling wave shipped provably misses the full float, and BOTH PLANTS ARE
     PROVED BELOW rather than argued about;
  3. NEITHER FILE READS THE OTHER. fc9_dump.mjs must not name fc9_capstone.mjs,
     fields.json or any of the three capstone plants, and fc9_capstone.mjs must
     not name fc9_dump.mjs or digest.txt. Two files, always;
  4. NO CAPSTONE PLANT NAME appears anywhere in the digest. The three names are
     the capstone's and nothing else in this wave may use them;
  5. every graded value against every number in the vendored golden, and every
     capstone condition against every golden ROW by named field, which is the
     check gate_collisions.mjs owns and this gate asserts has been run by
     requiring its exit code;
  6. every graded value against every sibling wave's graded answer key, FC1
     separation named explicitly because it is the other facilities capstone
     whose plants sit in the same module;
  7. THE BANKS. Every CONDITION, every GRADED VALUE at all four renderings, and
     every CAPSTONE PLANT NAME against every prompt, option and explanation of
     every bank under --banks. A bank carrying a condition hands a learner the
     scenario, a bank carrying a graded value hands them the answer, and a bank
     naming a plant hands them both. Default --banks is <this dir>/banks, and a
     banks directory that exists and holds no readable question is a REFUSAL.

IT REFUSES rather than passing when it cannot do its job: a missing digest, a
missing generator, fewer than eighteen graded fields, fewer than thirty parsed
conditions, a banks directory it cannot read a question out of, or a SHARED
entry that clears nothing is exit 2 or exit 1, never 0.

    python3 gate_capstone_leak.py [--banks DIR] [--no-banks]

--no-banks is the DELIBERATE declaration that this run is not sweeping them, and
it prints that it did not rather than printing a count of zero.
"""
import io, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))

# DIRECTION SEVEN'S ARGUMENTS. An option whose argument is silently discarded is
# how a sibling gate swept somebody else's corpus and reported it as this one, so
# an unknown option refuses rather than being ignored.
_args = sys.argv[1:]
BANKS = os.path.join(HERE, 'banks')
SWEEP_BANKS = True
if '--banks' in _args:
    BANKS = _args[_args.index('--banks') + 1]
if '--no-banks' in _args:
    SWEEP_BANKS = False
for _a in _args:
    if _a.startswith('--') and _a not in ('--banks', '--no-banks'):
        print(f'  GATE REFUSES: unknown option {_a}')
        sys.exit(2)
    if _a == BANKS:
        continue
TOL = os.environ.get('FC9_TOLERANCE',
    '/root/wt-fc9-nextgen/src/components/course/panels/corrosion/gradedTolerance.js')

def need(p, what):
    if not os.path.exists(p):
        print(f'  GATE REFUSES: no {what} at {p}')
        sys.exit(2)
    return io.open(p, encoding='utf-8').read()

DIGEST = need(os.path.join(HERE, 'digest.txt'), 'digest')
DUMP = need(os.path.join(HERE, 'fc9_dump.mjs'), 'digest generator')
CAP = need(os.path.join(HERE, 'fc9_capstone.mjs'), 'capstone generator')
FIELDS = json.loads(need(os.path.join(HERE, 'fields.json'), 'answer key'))
TOLSRC = need(TOL, 'tolerance derivation')

PLANTS = ['OBIGBO', 'NEMBE', 'SOKU']
PLANT_WORDS = re.compile(r'\b(obigbo|nembe|soku)\w*', re.I)

# Values shared on purpose because they are not a condition of any plant.
SHARED = {
 '1': 'unity: a water-wetting factor, a retained fraction and a scale factor are all compared '
      'against it, and it is the numerator of a stated fraction. It is not a condition of a plant',
 '18': 'the NEMBE design life in years. A DESIGN LIFE IS NOT A DISCRIMINATING CONDITION: it is '
       'stated in the capstone prompt in words, so a learner is told it and no reader of the digest '
       'could recognise a case from it. In the digest this figure appears only as two COUNTS, the '
       'eighteen top-level fields `screen` returns and the number of SECTION 18, and the gate cannot '
       'tell a count from a condition by shape. Checked: the digest carries no row of three or more '
       'NEMBE conditions, which gate_collisions.mjs proves by named field',
 '24': 'the SOKU design life in years, on exactly the same terms. In the digest this figure appears '
       'only as the number of SECTION 24',
}

# ------------------------------------------------------------------ helpers

def scenario(name):
    m = re.search(r'const ' + name + r' = Object\.freeze\(\{(.*?)\n\}\);', CAP, re.S)
    if not m:
        print(f'  GATE REFUSES: cannot find the frozen {name} scenario in fc9_capstone.mjs')
        sys.exit(2)
    return [(f.group(1), f.group(2)) for f in re.finditer(r'(\w+):\s*(-?[\d.]+)\s*,', m.group(1))]

def renderings(value, decimals):
    """Every searchable shape of one graded value. FOUR of them, and the reason
    there are four is that the nine-digit shape alone provably misses the full
    double a template literal prints."""
    def trim(s):
        return s.rstrip('0').rstrip('.') if '.' in s else s
    out = [('full', repr(value)),
           ('twelve', trim(f'{value:.12g}')),
           ('nine', trim(f'{value:.9g}')),
           ('printed', f'{value:.{decimals}f}')]
    seen, keep = set(), []
    for shape, s in out:
        if 'e' in s or 'E' in s or '.' not in s or len(s) < 6 or s in seen:
            continue
        seen.add(s)
        keep.append((shape, s))
    return keep

DECIMALS = {}
for m in re.finditer(r'(\w+): (\d+),', TOLSRC[TOLSRC.index('PRINTED_DECIMALS'):TOLSRC.index('GRADED_FIELDS')]):
    DECIMALS[m.group(1)] = int(m.group(2))
CLASSOF = {m.group(2): m.group(3) for m in
           re.finditer(r"\['(beginner|intermediate|advanced)', '(\w+)', '(\w+)',", TOLSRC)}
if len(CLASSOF) != 18 or not DECIMALS:
    print(f'  GATE REFUSES: read {len(CLASSOF)} field classes and {len(DECIMALS)} precision classes '
          'out of the tolerance derivation, which cannot be the whole of it')
    sys.exit(2)

# ------------------------------------------------------------------- 1 and 4

conditions = [(n, f, v) for n in PLANTS for f, v in scenario(n)]
if len(conditions) < 30:
    print(f'  GATE REFUSES: {len(conditions)} conditions parsed, which cannot be three scenarios')
    sys.exit(2)

def numbers_in(text):
    # A NUMERIC LITERAL, AND THE ONE THING THE OBVIOUS REGEX HAS WRONG. The
    # trailing guard `(?![\w.])` REJECTS EVERY NUMBER AT THE END OF A SENTENCE,
    # because a full stop satisfies it. A sibling gate in this wave found that on
    # its own first real run by reporting a figure as absent from the digest that
    # the digest plainly printed, and a sentence-final number is the commonest
    # shape a writer produces. So the trailing guard here is TWO negatives: not a
    # word character, and not a period followed by a digit.
    return {m.group(0) for m in re.finditer(r'(?<![\w.])-?\d+(?:\.\d+)?(?!\w)(?!\.\d)', text)}

DIGEST_NUMS = numbers_in(DIGEST)
DUMP_NUMS = numbers_in(DUMP)

findings = []
shared_hit = set()
for plant, field, raw in conditions:
    if raw in SHARED:
        shared_hit.add(raw)
        continue
    if raw in DIGEST_NUMS:
        findings.append(f'CONDITION IN THE DIGEST: {plant}.{field} = {raw}')
    if raw in DUMP_NUMS:
        findings.append(f'CONDITION IN THE DIGEST GENERATOR: {plant}.{field} = {raw}')

plant_in_digest = sorted({m.group(0) for m in PLANT_WORDS.finditer(DIGEST)})
if plant_in_digest:
    findings.append(f'A CAPSTONE PLANT IS NAMED IN THE DIGEST: {plant_in_digest}')
plant_in_dump = sorted({m.group(0) for m in PLANT_WORDS.finditer(DUMP)})
if plant_in_dump:
    findings.append(f'A CAPSTONE PLANT IS NAMED IN THE DIGEST GENERATOR: {plant_in_dump}')

# --------------------------------------------------------------------- 2

rendered = []
for tier, key, value, tol in FIELDS:
    cls = CLASSOF.get(key)
    if cls is None or cls not in DECIMALS:
        print(f'  GATE REFUSES: {key} has no declared precision class, so it cannot be rendered')
        sys.exit(2)
    for shape, text in renderings(value, DECIMALS[cls]):
        rendered.append((key, shape, text))
if len(rendered) < 18 * 3:
    print(f'  GATE REFUSES: only {len(rendered)} searchable renderings over 18 fields')
    sys.exit(2)
for key, shape, text in rendered:
    if text in DIGEST:
        findings.append(f'A GRADED ANSWER IS IN THE DIGEST: {key} as its {shape} rendering {text}')
    if text in DUMP:
        findings.append(f'A GRADED ANSWER IS IN THE DIGEST GENERATOR: {key} as its {shape} rendering {text}')

# --------------------------------------------------------------------- 3

for bad, why in [('fc9_capstone', 'the digest generator reads the capstone generator'),
                 ('fields.json', 'the digest generator reads the answer key'),
                 ('gradedTolerance', 'the digest generator reads the tolerance derivation')]:
    if bad in DUMP:
        findings.append(f'TWO FILES, ALWAYS: {why} ({bad})')
for bad, why in [('fc9_dump', 'the capstone generator reads the digest generator'),
                 ('digest.txt', 'the capstone generator reads the digest')]:
    if bad in CAP:
        findings.append(f'TWO FILES, ALWAYS: {why} ({bad})')

# --------------------------------------------------------------------- 7
#
# THE BANKS. This is the direction that did not exist, and the one three writers
# were told about. It reads the EMITTED .json, which is what a seed applies, and
# it sweeps THE PROMPT, EVERY OPTION AND THE EXPLANATION, because a sibling gate
# that iterated ['prompt', 'explanation'] + options swept the two field NAMES as
# strings and never looked at roughly 45 percent of a live corpus.

BANK_TEXTS = []
BANK_FILES = []
if SWEEP_BANKS:
    if not os.path.isdir(BANKS):
        print(f'  GATE REFUSES: no banks directory at {BANKS}. Pass --banks DIR, or --no-banks to '
              'declare that this run is not sweeping them.')
        sys.exit(2)
    for name in sorted(os.listdir(BANKS)):
        if not name.endswith('.json'):
            continue
        data = json.loads(io.open(os.path.join(BANKS, name), encoding='utf-8').read())
        qs = data.get('questions', []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        BANK_FILES.append(name)
        for i, q in enumerate(qs, 1):
            BANK_TEXTS.append((f'{name}#{i}', 'prompt', str(q.get('prompt', ''))))
            BANK_TEXTS.append((f'{name}#{i}', 'explanation', str(q.get('explanation', ''))))
            for j, o in enumerate(q.get('options', [])):
                BANK_TEXTS.append((f'{name}#{i}', f'option{j}', str(o)))
    if not BANK_TEXTS:
        print(f'  GATE REFUSES: {BANKS} holds {len(BANK_FILES)} bank file(s) and not one readable '
              'question. A clean zero over a corpus this gate could not read is exactly the '
              'failure direction seven exists to end.')
        sys.exit(2)
    BANK_NUMS = {}
    for where, field, text in BANK_TEXTS:
        for lit in numbers_in(text):
            BANK_NUMS.setdefault(lit, []).append(f'{where} {field}')
    for plant, field, raw in conditions:
        if raw in SHARED:
            continue
        if raw in BANK_NUMS:
            findings.append(f'CONDITION IN A BANK: {plant}.{field} = {raw} at {BANK_NUMS[raw][0]}')
    for key, shape, text in rendered:
        for where, field, qt in BANK_TEXTS:
            if text in qt:
                findings.append(f'A GRADED ANSWER IS IN A BANK: {key} as its {shape} rendering '
                                f'{text} at {where} {field}')
    for where, field, qt in BANK_TEXTS:
        named = sorted({m.group(0) for m in PLANT_WORDS.finditer(qt)})
        if named:
            findings.append(f'A CAPSTONE PLANT IS NAMED IN A BANK: {named} at {where} {field}')

    # THE THREE PLANTS FOR DIRECTION SEVEN, RUN RATHER THAN DESCRIBED. A gate
    # nobody has seen refuse is a gate nobody knows can refuse, and this wave
    # shipped a reproducibility gate on a build script it could not execute.
    # Each plant is swept by the SAME code path as the corpus above.
    _pk, _ps, _pt = rendered[0]
    _pc = [raw for _p, _f, raw in conditions if raw not in SHARED][0]
    _plants = [
        ('a graded answer in an option', [('selftest#1', 'option0', f'about {_pt} of it')],
         lambda t: any(_pt in q for _w, _f, q in t)),
        ('a capstone condition in a prompt', [('selftest#1', 'prompt', f'at {_pc} what follows')],
         lambda t: _pc in {l for _w, _f, q in t for l in numbers_in(q)}),
        ('a capstone plant name in an explanation', [('selftest#1', 'explanation', f'the {PLANTS[0]} line')],
         lambda t: any(PLANT_WORDS.search(q) for _w, _f, q in t)),
    ]
    for _what, _texts, _caught in _plants:
        if not _caught(_texts):
            print(f'  GATE REFUSES: direction seven did not catch {_what}, so its sweep and its '
                  'plant do not agree with each other and a clean run would prove nothing')
            sys.exit(2)
    # AND THE NEGATIVE CONTROL ON THE CONTROLS: a bank text carrying none of the
    # three must be caught by none of them, so the plants above are not three
    # predicates that fire on anything at all.
    _clean = [('selftest#2', 'prompt', 'a sentence with the figure 3 in it and no plant named')]
    if any(_caught(_clean) for _what, _texts, _caught in _plants):
        print('  GATE REFUSES: a clean bank text tripped one of direction seven\'s own plants')
        sys.exit(2)

# ------------------------------------------------------------------ 5 and 6

coll = subprocess.run(['node', os.path.join(HERE, 'gate_collisions.mjs')],
                      capture_output=True, text=True)
if coll.returncode != 0:
    findings.append('gate_collisions.mjs did not exit 0, so directions five and six are UNPROVEN. '
                    'Its own output: ' + (coll.stdout + coll.stderr).strip().split('\n')[-1])
coll_line = [l for l in coll.stdout.split('\n') if l.startswith('gate_collisions EXAMINED')]

# ----------------------------------------------------- THE TWO PLANT PROOFS

# The nine-digit-only matcher a sibling wave shipped provably misses the FULL
# DOUBLE, which is exactly what a template literal with no formatter prints. Both
# plants are run here rather than described.
# THE TWO PLANTS, RUN RATHER THAN DESCRIBED.
#
# A sibling wave's guard string-matched its graded answers at NINE SIGNIFICANT
# DIGITS and at nothing else, and that was proved insufficient by planting the
# same answer twice: the rounded shape was caught and the SAME NUMBER at full
# double precision went straight past. A panel that writes `${value}` prints the
# full double, so the likelier leak was the one the guard could not see.
#
# THE PROBE MUST BE A FIELD WHOSE NINE-DIGIT STRING IS NOT A SUBSTRING OF ITS
# FULL DOUBLE, because where the nine-digit shape is a PREFIX of the full double
# a nine-only matcher would catch the full plant by accident and the two plants
# would prove nothing. Several fields here are exactly that. So the probe is
# SEARCHED FOR, the reason is printed, and the gate refuses if no field can carry
# the proof.
def nine_of(v):
    s9 = f'{v:.9g}'
    return s9.rstrip('0').rstrip('.') if '.' in s9 else s9

probe = None
for _tier, _key, _value, _tol in FIELDS:
    _shapes = dict(renderings(_value, DECIMALS[CLASSOF[_key]]))
    _nine = nine_of(_value)
    if 'full' in _shapes and _nine != _shapes['full'] and _nine not in _shapes['full']:
        probe = (_key, _value, _shapes, _nine)
        break
if probe is None:
    print('  GATE REFUSES: not one of the eighteen graded fields has a nine-digit rendering that is '
          'absent from its own full double, so a nine-only matcher could not be distinguished from '
          'a four-shape one and the proof would be vacuous on this answer key')
    sys.exit(2)
probe_key, probe_value, shapes, probe_nine = probe

# A field whose nine-digit string is a PREFIX of its full double is recorded, so
# the boundary of this proof is reported rather than silent.
PREFIX_FIELDS = [k for _t, k, v, _to in FIELDS if nine_of(v) in repr(v) and nine_of(v) != repr(v)]
# And a field whose nine-digit string was already produced by a longer rendering
# contributes one searchable string rather than two, which is not a gap: the
# string is still searched.
DEDUPED = [k for _t, k, v, _to in FIELDS
           if dict(renderings(v, DECIMALS[CLASSOF[k]])).get('nine') is None]

full_plant = f'const x = {shapes["full"]}; // a panel printing ${{value}} with no formatter'
nine_plant = f'Quote it as {probe_nine} in your answer'
FOUR_SHAPE = [t for _k, _s, t in rendered if _k == probe_key]
NINE_ONLY = [probe_nine]
caught_full_by_four = [t for t in FOUR_SHAPE if t in full_plant]
caught_full_by_nine = [t for t in NINE_ONLY if t in full_plant]
caught_nine_by_four = [t for t in FOUR_SHAPE if t in nine_plant]
if not caught_full_by_four:
    print('  GATE REFUSES: the four-shape matcher did not catch the full-double plant this gate '
          'built, so the matcher and the plant do not agree with each other')
    sys.exit(2)
if not caught_nine_by_four:
    print('  GATE REFUSES: the four-shape matcher did not catch the rounded plant')
    sys.exit(2)
if caught_full_by_nine:
    print('  GATE REFUSES: the nine-only matcher DID catch the full-double plant, so this probe '
          'cannot distinguish the two matchers. The probe search above should have excluded it')
    sys.exit(2)

dead = sorted(set(SHARED) - shared_hit)
print(f'  conditions swept: {len(conditions)} across {len(PLANTS)} scenarios')
if SWEEP_BANKS:
    print(f'  DIRECTION SEVEN, THE BANKS: {len(BANK_FILES)} bank(s) from {BANKS}, '
          f'{len(BANK_TEXTS)} field texts swept over prompts, options and explanations, '
          f'{len(BANK_NUMS)} distinct numeric literals examined. THREE PLANTS PROVED: a graded '
          f'answer in an option, a capstone condition in a prompt and a plant name in an '
          f'explanation were each caught, and a clean text tripped none of the three.')
else:
    print('  DIRECTION SEVEN, THE BANKS: NOT SWEPT, --no-banks was passed. This run says nothing '
          'about any bank.')
print(f'  graded values swept: {len(FIELDS)} at {len(rendered)} searchable renderings '
      f'({len({s for _, s, _ in rendered})} distinct shapes: '
      f'{", ".join(sorted({s for _, s, _ in rendered}))})')
print(f'  digest numbers examined: {len(DIGEST_NUMS)}  generator numbers examined: {len(DUMP_NUMS)}')
print(f'  digest lines: {DIGEST.count(chr(10)) + 1}  generator lines: {DUMP.count(chr(10)) + 1}')
print(f'  shared-on-purpose entries declared: {len(SHARED)}, hit: {len(shared_hit)}, dead: {len(dead)} -> {dead}')
print(f'  two-files check: the generator names none of fc9_capstone, fields.json or gradedTolerance; '
      f'the capstone names neither fc9_dump nor digest.txt')
print(f'  directions five and six, delegated to gate_collisions.mjs: exit {coll.returncode}')
for l in coll_line:
    print(f'    {l.strip()}')
print(f'  probe field for both plants: {probe_key}, chosen because its nine-digit rendering '
      f'"{probe_nine}" is absent from its full double "{shapes["full"]}"')
print(f'  fields whose nine-digit rendering is a PREFIX of their own full double, which is why the '
      f'probe is searched for rather than taken as the first field: {len(PREFIX_FIELDS)} -> {PREFIX_FIELDS}')
print(f'  fields whose nine-digit string was already produced by a longer rendering, so it is '
      f'searched once rather than twice: {len(DEDUPED)} -> {DEDUPED}')
print(f'  PLANT ONE, THE ROUNDED SHAPE: "{probe_nine}" planted in a sentence a writer would write. '
      f'CAUGHT by the four-shape matcher: {caught_nine_by_four}')
print(f'  PLANT TWO, THE FULL DOUBLE: "{shapes["full"]}" planted the way a template literal prints '
      f'it. CAUGHT by the four-shape matcher: {caught_full_by_four}. '
      f'The NINE-ONLY matcher a sibling wave shipped sees it: {bool(caught_full_by_nine)}. '
      f'BOTH PLANTS PROVED, and the second is the one that needs four shapes.')
print(f'  FINDINGS: {len(findings)}')
for f in findings:
    print(f'   {f}')
if dead:
    print('  GATE FAILS: a shared-on-purpose entry that nothing hits is a dead row, not an amnesty')
    sys.exit(1)
sys.exit(1 if findings else 0)
