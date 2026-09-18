#!/usr/bin/env python3
"""GATE: the THREE VOCABULARY COLLISIONS digest section 22 legislates, enforced
over every lesson and every bank question in this wave.

WHY THIS FILE EXISTS. Section 22 binds every lesson, every bank question, every
key truth and every panel string, and says in its own words that "the copy gate
catches it". NOTHING CAUGHT IT. `gate_copy_rule.py` checks em dashes and "X, not
Y" contrastives and nothing else, and the only collision check anywhere in this
wave lives inside corrosionLab.test.js, where it sweeps the lab, the three
panels and the learning page: four files, none of them a lesson and none of them
a bank. The Expert bank writer wrote the check again by hand to sweep its own
132 questions, which is the second time this wave built it. It is promoted here
so the 78 lessons and the 396 questions are swept by the rule the panels already
were, and so the next wave inherits it rather than writing it a third time.

THE RULES, AND WHICH OF THEM FAILS A BUILD.

FATAL, because section 22 states them as absolutes:
  * NEVER BARE "inhibitor" IN A PROMPT, AN OPTION OR A HEADING. The Flow
    Assurance course means a HYDRATE inhibitor by the bare word, and a learner
    who has taken it reads a prompt the other way.
  * FIRST USE IN EVERY LESSON AND EVERY BANK QUESTION IS "corrosion inhibitor".
  * NEVER BARE "erosion" AS A NOUN. The Basin Modelling course means a
    GEOLOGICAL process by it. "mechanical erosion", "erosional wall loss" and
    the erosional-velocity criterion this engine does not have are the forms.

FOR A HUMAN READ, never a pass and never a fail:
  * the friction factor and the Reynolds number. Section 22 asks that both be
    labelled as THIS module's and that the Line Sizing course be named as the
    other owner. Calibrated over this wave's committed corpus, requiring that of
    every four-option question that mentions a Reynolds number reports 24 of
    them, and the copy is not wrong: a question inside a wall-shear module is
    already in this module's frame and cannot name a sibling course in every
    option without ceasing to be a question. The count is printed per BANK and
    per LESSON, which is the granularity the clause can actually be read at, and
    a reviewer looks at the ones that carry neither label.

THE EXEMPTIONS ARE CLASSES WITH REASONS, never lists of what happens to fail:
  * an ENGINE FIELD, ARGUMENT OR GOLDEN BLOCK NAME. `inhibitorEfficiencyPct` is
    code, and a lesson naming the key a caller passes is naming code.
  * a PANEL ID. `fc-inhibitor-integrity-explorer` is a route, not copy.
  * THE ENGINE'S OWN VERBATIM MESSAGES. A lesson may quote them and may not edit
    them, and they are recognised by being a run of text the DIGEST prints, so a
    lesson can quote the teaching truth and can invent nothing. Not an amnesty:
    a sentence the digest does not print is copy.
  * A META-USE. The lesson and the question that TEACH this collision have to
    name the bare word in order to name it, and they say so in the same
    sentence. Recognised by the sentence naming the other course or naming the
    word as a word, which is what a meta-use looks like and what ordinary copy
    never does.

MARKDOWN IS HARD WRAPPED AND THIS GATE UNWRAPS IT FIRST. The first version of
this file swept line by line and reported five lessons for a bare "inhibitor"
that every one of them had written as "corrosion\\ninhibitor" across a line
break, and reported "generosity" as a bare "erosion" because it matched on the
substring. Both are fixed and both are negative controls below.

IT REFUSES rather than passing when it cannot do its job: no lessons, no banks,
a lesson tree it cannot read, or a digest it cannot read is exit 2 and never 0.
A sweep that examined nothing must never report clean.

    python3 gate_vocabulary.py [--lessons DIR] [--banks DIR] [--digest FILE]
    python3 gate_vocabulary.py --selftest        THE NEGATIVE CONTROLS

Exit codes: 0 clean, 1 breaches, 2 REFUSED. Only 0 is a pass.
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[1:]

def opt(name, default):
    return args[args.index(name) + 1] if name in args else default

LESSONS = opt('--lessons', '/root/wt-fc9-nextgen/src/content/courses/corrosion')
BANKS = opt('--banks', os.path.join(HERE, 'banks'))
DIGEST_PATH = opt('--digest', os.path.join(HERE, 'digest.txt'))
SELFTEST = '--selftest' in args
for a in args:
    if a.startswith('--') and a not in ('--lessons', '--banks', '--digest', '--selftest'):
        print(f'  GATE REFUSES: unknown option {a}. An option whose argument is discarded is how a '
              "sibling gate swept somebody else's corpus and reported it as this one.")
        sys.exit(2)

CODE_WORDS = re.compile(
    r'inhibitorEfficiencyPct|inhibitorAvailabilityPct|inhibitorFilmIntact|inhibitorShortfallPp'
    r'|inhibitorArithmetic|inhibitorClamps|effectiveInhibitionPct|InhibitorIntegrityExplorer'
    r'|fc-inhibitor-integrity-explorer|INHIBITOR_SHORTFALL_PP|`inhibitor`|`inhibitorClamps`')
QUALIFIED_INHIBITOR = re.compile(r'corrosion inhibitor', re.I)
BARE_INHIBITOR = re.compile(r'\binhibitor\b', re.I)
# "erosional velocity", "erosional wall loss", "mechanical erosion" and the
# erosional criterion or limit this engine does not have are ALL the qualified
# mechanical sense. The bare GEOLOGICAL noun is what the rule is about.
QUALIFIED_EROSION = re.compile(
    r'mechanical erosion|erosional wall loss|erosional[-\s]velocity'
    r'|erosional (criterion|limit)|velocity is erosional|erosional\b', re.I)
BARE_EROSION = re.compile(r'\berosion\b', re.I)
# A META-USE names the word as a word, or names the course that owns the other
# meaning. Ordinary copy in this module does neither.
META_USE = re.compile(
    r'the (bare |same )?word|Flow Assurance|Basin Modelling|Production Chemistry'
    r'|already (means|carries)|collision|vocabulary|first use|spelling', re.I)
FRICTION_WORDS = re.compile(r'friction factor|Reynolds number', re.I)
FRICTION_OWNED = re.compile(r"(this|the corrosion) module'?s (own )?(friction factor|Reynolds number)", re.I)
LINE_SIZING = re.compile(r'line sizing', re.I)
HEADING = re.compile(r'^\s*#{1,6}\s')


def paragraphs(text):
    """(start_line, unwrapped_text) per markdown block. MARKDOWN IS HARD WRAPPED
    and a phrase rule read line by line reports the wrap rather than the copy."""
    out, buf, start = [], [], 1
    for i, line in enumerate(text.split('\n'), 1):
        if line.strip():
            if not buf:
                start = i
            buf.append(line.strip())
        elif buf:
            out.append((start, ' '.join(buf)))
            buf = []
    if buf:
        out.append((start, ' '.join(buf)))
    return out


def sentences(text):
    return [s for s in re.split(r'(?<=[.!?])\s+|\s*\|\s*', text) if s.strip()]


def scrub(text):
    return QUALIFIED_INHIBITOR.sub(' ', CODE_WORDS.sub(' ', text))


VERBATIM_MIN = 40


def quoted_run(text, at, digest):
    """The LONGEST run of `text` around position `at` that the DIGEST also
    prints, found by growing left and then right while the run stays a digest
    substring. A course quoting the engine's own message carries the engine's
    own words, including the bare word inside them, and may not edit them.

    THE FRAMING AROUND THE QUOTE IS STILL COPY. This clears the run and nothing
    outside it, so a question that writes its own bare "inhibitor" beside a
    quotation is still reported."""
    lo, hi = at, at + 1
    if text[lo:hi] not in digest:
        return ''
    while lo > 0 and text[lo - 1:hi] in digest:
        lo -= 1
    while hi < len(text) and text[lo:hi + 1] in digest:
        hi += 1
    return text[lo:hi]


def engine_verbatim(sentence, digest, at=None):
    """The engine's own words, quoted. Short fragments clear nothing: a run must
    be at least VERBATIM_MIN characters of the digest, and when a position is
    given the run must COVER it."""
    s = sentence.strip().strip('|').strip()
    if len(s) >= VERBATIM_MIN and s in digest:
        return True
    if at is None:
        return False
    return len(quoted_run(sentence, at, digest)) >= VERBATIM_MIN


def inhibitor_breaches(text, digest, where, kind):
    """kind is 'lesson', 'heading-bearing' or 'prompt'/'option'."""
    out = []
    for start, para in paragraphs(text):
        for s in sentences(para):
            m = BARE_INHIBITOR.search(scrub(s))
            if not m:
                continue
            if META_USE.search(s) or engine_verbatim(s, digest, m.start()):
                continue
            if HEADING.match(s):
                out.append((start, f'bare "inhibitor" IN A HEADING: {s[:110]}'))
            elif kind in ('prompt', 'option'):
                out.append((start, f'bare "inhibitor" in a {kind}: {s[:110]}'))
    return out


def unqualified_first_use(text, digest):
    """THE FIRST USE RULE, read over the UNWRAPPED text: the first sentence that
    names the word at all must name it as "corrosion inhibitor"."""
    for start, para in paragraphs(text):
        for s in sentences(para):
            m = BARE_INHIBITOR.search(CODE_WORDS.sub(' ', s))
            if not m:
                continue
            if QUALIFIED_INHIBITOR.search(s):
                return None
            if META_USE.search(s) or engine_verbatim(s, digest, m.start()):
                continue
            return (start, s[:110])
    return None


def erosion_breaches(text, digest):
    out = []
    for start, para in paragraphs(text):
        for s in sentences(para):
            m = BARE_EROSION.search(QUALIFIED_EROSION.sub(' ', s))
            if not m:
                continue
            if META_USE.search(s) or engine_verbatim(s, digest, m.start()):
                continue
            out.append((start, f'bare "erosion": {s[:110]}'))
    return out


def friction_review(whole):
    """NEVER A PASS AND NEVER A FAIL. See the docstring."""
    if not FRICTION_WORDS.search(whole):
        return None
    return (bool(FRICTION_OWNED.search(whole)), bool(LINE_SIZING.search(whole)))


def sweep(lessons_dir, banks_dir, digest_path):
    if not os.path.exists(digest_path):
        print(f'  GATE REFUSES: no digest at {digest_path}')
        sys.exit(2)
    digest = io.open(digest_path, encoding='utf-8').read()
    breaches, review, n_lessons, n_questions, n_banks = [], [], 0, 0, 0

    for root, _d, files in os.walk(lessons_dir):
        for f in sorted(files):
            if not f.endswith('.md'):
                continue
            n_lessons += 1
            p = os.path.join(root, f)
            rel = os.path.relpath(p, lessons_dir)
            text = io.open(p, encoding='utf-8').read()
            first = unqualified_first_use(text, digest)
            if first:
                breaches.append(f'{rel}:{first[0]} FIRST USE is bare "inhibitor": {first[1]}')
            for i, msg in inhibitor_breaches(text, digest, rel, 'lesson'):
                breaches.append(f'{rel}:{i} {msg}')
            for i, msg in erosion_breaches(text, digest):
                breaches.append(f'{rel}:{i} {msg}')
            fr = friction_review(text)
            if fr and not all(fr):
                review.append(f'lesson {rel}: labels it as this module\'s: {fr[0]}, names line sizing: {fr[1]}')

    if not os.path.isdir(banks_dir):
        print(f'  GATE REFUSES: no banks directory at {banks_dir}')
        sys.exit(2)
    for name in sorted(os.listdir(banks_dir)):
        if not name.endswith('.json'):
            continue
        n_banks += 1
        data = json.loads(io.open(os.path.join(banks_dir, name), encoding='utf-8').read())
        qs = data.get('questions', []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
        bank_whole = []
        for i, q in enumerate(qs, 1):
            n_questions += 1
            where = f'{name}#{i}'
            fields = [('prompt', str(q.get('prompt', ''))), ('explanation', str(q.get('explanation', '')))]
            fields += [(f'option{j}', str(o)) for j, o in enumerate(q.get('options', []))]
            whole = ' '.join(t for _f, t in fields)
            bank_whole.append(whole)
            for field, text in fields:
                kind = 'option' if field.startswith('option') else field
                if kind == 'explanation':
                    continue
                for _i, msg in inhibitor_breaches(text, digest, where, kind):
                    breaches.append(f'{where} {field}: {msg}')
            first = unqualified_first_use(whole, digest)
            if first:
                breaches.append(f'{where}: FIRST USE across the question is bare "inhibitor": {first[1]}')
            for field, text in fields:
                for _i, msg in erosion_breaches(text, digest):
                    breaches.append(f'{where} {field}: {msg}')
        fr = friction_review(' '.join(bank_whole))
        if fr and not all(fr):
            review.append(f'bank {name}: labels it as this module\'s: {fr[0]}, names line sizing: {fr[1]}')

    if not n_lessons:
        print(f'  GATE REFUSES: 0 lessons under {lessons_dir}. A sweep that examined nothing is not a pass.')
        sys.exit(2)
    if not n_questions:
        print(f'  GATE REFUSES: 0 questions under {banks_dir}. A sweep that examined nothing is not a pass.')
        sys.exit(2)
    return breaches, review, n_lessons, n_questions, n_banks


def selftest():
    """THE NEGATIVE CONTROLS. Each rule is shown catching a plant and shown NOT
    catching correct copy, and the two defects the first version of this file
    shipped, the hard wrap and the substring, are controls of their own."""
    D = 'a line the digest prints, forty characters long at least, about the inhibitor programme.'
    ok = []
    def c(what, got): ok.append((what, got))
    c('a bare "inhibitor" first use is caught',
      unqualified_first_use('The inhibitor removes metal loss while it is on the steel.', D) is not None)
    c('a qualified first use passes',
      unqualified_first_use('The corrosion inhibitor removes it, and the inhibitor is off the rest.', D) is None)
    c('a code name is not a bare use',
      unqualified_first_use('Read inhibitorEfficiencyPct here.', D) is None)
    # THE HARD WRAP, which the first version of this file reported five times.
    c('"corrosion" and "inhibitor" split across a line break is NOT a breach',
      unqualified_first_use('the rate depends on whether the corrosion\ninhibitor film survived.', D) is None)
    c('a bare "erosion" is caught', bool(erosion_breaches('Erosion removes wall from solids.', D)))
    c('"mechanical erosion" passes', not erosion_breaches('Mechanical erosion removes wall.', D))
    c('"an erosional velocity limit" passes', not erosion_breaches('None of this is an erosional velocity limit.', D))
    # THE SUBSTRING, which the first version reported as a bare "erosion".
    c('"generosity" is NOT a bare "erosion"',
      not erosion_breaches('The generosity stops at ambiguity.', D))
    c('a meta-use naming the other course passes',
      not erosion_breaches('The word erosion already carries a different meaning in the Basin Modelling course.', D))
    c('the engine\'s own words, quoted, pass',
      unqualified_first_use(D, D) is None)
    # THE ENGINE'S MESSAGE INSIDE A WRITER'S OWN SENTENCE. The message carries
    # the bare word and a course may not edit it, and the framing around it is
    # still copy.
    c('a long engine run quoted inside a framing sentence passes',
      unqualified_first_use('The engine says that ' + D[:-1] + ' on that case.', D) is None)
    c('a SHORT run of the digest clears nothing',
      unqualified_first_use('It has an inhibitor.', 'an inhibitor.') is not None)
    c('a friction factor with neither label is reported for review',
      friction_review('The friction factor is 0.003') == (False, False))
    c('a labelled friction factor naming the other owner is clean',
      friction_review("this module's friction factor, and the line sizing course computes its own") == (True, True))
    c('text naming no friction factor at all returns nothing to review',
      friction_review('A rate is a rate.') is None)
    c('a clean sentence trips nothing',
      unqualified_first_use('A rate is a rate.', D) is None and not erosion_breaches('A rate is a rate.', D))
    bad = [w for w, g in ok if not g]
    for w, g in ok:
        print(f'  {"OK  " if g else "FAIL"} {w}')
    if bad:
        print(f'  SELFTEST FAILED: {len(bad)} control(s) did not behave: {bad}')
        return 2
    print(f'  SELFTEST: {len(ok)} controls, every one as expected')
    return 0


if SELFTEST:
    sys.exit(selftest())

breaches, review, n_lessons, n_questions, n_banks = sweep(LESSONS, BANKS, DIGEST_PATH)
print(f'  gate_vocabulary SWEPT: {n_lessons} lesson(s) under {LESSONS} and {n_questions} question(s) '
      f'in {n_banks} bank(s) from {BANKS}, against the three collisions digest section 22 legislates')
print(f'  BREACHES, which fail: {len(breaches)}')
for b in breaches:
    print(f'   {b}')
print(f'  FLAGGED FOR A HUMAN READ, neither a pass nor a fail: {len(review)}')
for r in review:
    print(f'   {r}')
sys.exit(1 if breaches else 0)
