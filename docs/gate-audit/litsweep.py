#!/usr/bin/env python3
"""EVERY numeric literal in a bank must be a substring of the wave's digest.

WHY NOT numsweep. `numsweep` checks literals with seven or more SIGNIFICANT
figures, and `sigFigs()` strips trailing zeros, so a round literal is never
checked. On a wave whose figures print to six decimals that hole is large: a
figure like 3.000000 or 0.500000 is round, so most of a tier's numbers are
invisible to it. This gate has NO significant-figure floor. Every literal is
checked, however short and however round.

WHAT IT CHECKS. Verbatim substring presence in digest.txt, which is the whole
claim a course makes when it quotes a number: the figure a learner reads is a
figure the engine printed. A literal that is only ARITHMETICALLY derivable from
the digest still fails, and that is the point: derived figures belong in the
digest first.

Declared constants in wave.json (`constants`) are allowed as well, because a
course may quote 14.7 or 86400 whether or not the digest happens to print it.

A MATCH MUST BE A WHOLE NUMBER, NOT A FRAGMENT. A plain substring test says
"7" is in the digest because 0.7 is, and "123" because 1234 is, so short and
round literals resolved against numbers they have nothing to do with. The
match is bounded on both sides: the character before and after the hit may not
be a digit or a decimal point. This is the failure a first attempt at this
gate shipped, where an invented figure resolved against a longer one and the
gate reported zero on a corpus it could not actually discriminate.

TIER RANGE, IN TWO DIRECTIONS, and they are not the same finding.

  * REACHING FORWARD, a tier quoting a figure that lives only in a LATER
    tier's sections, is a leak and always fails. An Associate bank whose
    answer is only on an Expert page is asking about material its reader has
    not been given.
  * REACHING BACK, a tier quoting a figure that lives only in an EARLIER
    tier's sections, is reported and counted but does not fail on its own. A
    recap module legitimately re-reads the whole chain, and CALIBRATION SAYS
    SO: FC1 separation's merged banks carry 120 backward reaches, almost all
    of them the Professional reading quoting the Associate half. A gate that
    work already shipped cannot pass is the wrong gate. Pass --strict-range to
    make backward reaches fail too.

OWNERSHIP IS A SET OF SECTIONS, NEVER AN INTERVAL, AND A SECTION CAN HAVE MORE
THAN ONE OWNER. Two defects lived in those two sentences and both made this
gate read clean on material it could not see:

  * A tier's range used to be min..max over the sections it owns, which
    NUMERICALLY SWALLOWS every other tier's section lying inside it. FC4
    Professional spanned digest lines 273 to 723 and the Expert-owned Sections
    13 to 18 sit inside that span, so a Professional bank quoting an
    Expert-only figure was IN RANGE and NO FORWARD REACH WAS REPORTED. This is
    the forward-leak gate and FC1 shipped nine forward reaches, so the span was
    the most expensive line in this file. A tier now owns a SET of sections and
    every hit is judged by the section that contains it.
  * The owner clause was read with a regex capturing ONE tier word, which takes
    only the FIRST tier. A header reading "(owned by Associate m01 l04 and
    Expert m05)" read as Associate-only, and FC4 Expert carried 10 FALSE
    BACKWARD REACHES from that one regex. The whole clause is read now and
    every tier word in it owns the section.

A hit is FORWARD only when EVERY owner of its section is a later tier, so a
section co-owned by Associate and Expert is a backward recap for a
Professional bank rather than a leak, which is what the clause says.

WHICH ROW A LITERAL RESOLVED AGAINST, AND WHY THAT IS NOT A VERDICT. Substring
presence is not proof of quotation: FC4 found `1.500000` and `3.200000` gal per
lb resolving against rows that have nothing to do with the quantity. This
cannot be settled mechanically, so the gate REPORTS the row each literal
resolved against and FLAGS two shapes FOR A HUMAN READ, never as a pass and
never as a fail: a sentence naming a unit no resolving row names, and a figure
too round to identify a row matching several rows outside the writer's own
module's sections. `--review-all` prints them all instead of the first 25.

FC2 chose to repair its four backward reaches anyway, because they were
CONSTANTS rather than recaps: 3600.000000 taught in Expert m02 and
5280.000000000 with its floating point step in Expert m04, all resolving only
to the Section 1 constants block. The repair was ADDITIVE, a derivation of
each inside the Expert sections, so no line already pinned by another reader
moved.

A SKIPPED CHECK MUST NEVER EXIT 0. The first version of this gate resolved the
tier by offset arithmetic on the caller's prefix, `name[len(prefix)]`, so
`--prefix fc2b` left it reading the UNDERSCORE of `fc2b_m04`, resolved no tier
for any bank, printed `tier-range checked: 0   tier unknown, range skipped:
877` and STILL EXITED 0 REPORTING ZERO REACHING FORWARD. Three agents ran it
that way. That is the failure class this kit exists to stop, one layer up: not
a gate that cannot fail, but a gate that DID NOT RUN and said nothing, and it
was caught only because somebody read the counts line.

So the tier is resolved from the bank NAME rather than from the caller's
prefix, `<anything><b|i|a>_<m01..|exam>`, which works whether the caller passes
`fc2` or `fc2b` or no prefix at all; and a bank whose tier cannot be resolved
REFUSES, exit 2. A wave whose digest names no section owners refuses too, and
so does a run that ends with any literal unranged. The only way to reach the
end of this gate without the tier-range check having run is to have no banks,
which already refuses.

REFUSALS. Exit 2, never 0, when the gate cannot do its job: no digest, an empty
digest, no bank files, or zero literals examined. The counts are always printed,
so a run that examined nothing cannot look like a clean one.

    python3 litsweep.py <wave_dir> [--banks DIR] [--prefix fc1a]
                        [--lessons DIR] [--strict-range] [--review-all]
    python3 litsweep.py --selftest

LESSONS TOO, BECAUSE NOTHING WAS CHECKING THEM. `litsweep` covered BANKS only
and `numsweep` covers lessons but SKIPS ROUND LITERALS, so on a wave printing
to six decimals there was a hole nothing sat in: on FC2's Expert tier that left
110 LESSON literals checked by NOTHING AT ALL. `--lessons <dir>` gives lesson
markdown the same whole-number, section-scoped treatment banks get, taking each
lesson's tier from its path. Run by hand on FC2 it found three real defects,
two of them INVENTED LITERALS.

Exit codes: 0 clean, 1 literals not in the digest, 2 REFUSED.
"""
import argparse
import glob
import io
import json
import os
import re
import sys

# Dotted clause numbers (6.1.2, 7.5.3) are ONE token; without this first
# alternative 6.1.2 was read as 6.1 and 2 (assurance compliance wave, 2026-09-18).
NUM = re.compile(r'\d+(?:\.\d+){2,}|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?')
LETTER_TIER = {'b': 'beginner', 'i': 'intermediate', 'a': 'advanced'}
NAME_TIER = {'associate': 'beginner', 'professional': 'intermediate', 'expert': 'advanced'}
# A SECTION HEADER NAMES EVERY TIER THAT OWNS IT, AND SOME OWN MORE THAN ONE.
# The first version of this captured ONE tier word with `\(owned by\s+([A-Za-z]+)`,
# so a header reading "(owned by Associate m01 l04 and Expert m05)" read as
# Associate-only and every legitimate Expert quote of that section was reported
# as a BACKWARD REACH. FC4 Expert carried 10 false backward reaches from this
# one regex. The clause is now read WHOLE and every tier word in it owns the
# section, with the module keys that follow each tier word kept beside it.
OWNER_CLAUSE_RE = re.compile(r'\(\s*(?:owned|shared)\s+by\s+(?P<clause>[^)]*)\)', re.I)
TIER_WORD_RE = re.compile(r'\b(Associate|Professional|Expert)\b', re.I)
MODULE_RE = re.compile(r'\bm(\d{1,2})\b', re.I)
ANY_SECTION_RE = re.compile(r'^#\s*SECTION\s+(\d+)\s*:', re.I)
TIER_ORDER = {'beginner': 0, 'intermediate': 1, 'advanced': 2}


class Section(object):
    """One `# SECTION n:` block, with the SET of tiers that own it.

    `owners` empty means SHARED: a section whose header carries no owner clause
    is read by every tier, and so is the preamble.
    """

    __slots__ = ('no', 'lo', 'hi', 'owners', 'modules', 'title')

    def __init__(self, no, lo, hi, owners, modules, title):
        self.no, self.lo, self.hi = no, lo, hi
        self.owners, self.modules, self.title = owners, modules, title

    def __repr__(self):
        who = ','.join(sorted(self.owners)) if self.owners else 'shared'
        return 'Section(%s, %d-%d, %s)' % (self.no, self.lo + 1, self.hi + 1, who)


def parse_owners(clause, line_no):
    """({tier, ...}, {tier: [mNN, ...]}) from the text inside an owner clause.

    Every tier word in the clause owns the section. A clause naming no tier at
    all REFUSES rather than being guessed at."""
    owners, modules = set(), {}
    marks = [(m.start(), m.group(1).lower()) for m in TIER_WORD_RE.finditer(clause)]
    if not marks:
        raise Refused(
            'digest line %d has an owner clause naming no tier: %r. The convention is '
            '"(owned by <Associate|Professional|Expert> mNN[, ...])". Refusing rather than '
            'guessing the tier ranges.' % (line_no, clause.strip()))
    for n, (at, word) in enumerate(marks):
        end = marks[n + 1][0] if n + 1 < len(marks) else len(clause)
        tier = NAME_TIER[word]
        owners.add(tier)
        modules.setdefault(tier, set()).update(
            'm%02d' % int(mm.group(1)) for mm in MODULE_RE.finditer(clause[at:end]))
    return owners, modules


def whole_number_hits(lit, lines):
    """The 0-based line indices where `lit` appears as a WHOLE number: not
    preceded or followed by a digit or a decimal point. A bare substring test
    resolves 7 against 0.7 and 123 against 1234, which is how a sweep reports
    zero on a corpus it cannot discriminate."""
    negative = lit.startswith('-')
    if negative:
        lit = lit[1:]
    out = []
    for i, line in enumerate(lines):
        start = 0
        while True:
            at = line.find(lit, start)
            if at < 0:
                break
            end = at + len(lit)
            before = line[at - 1] if at > 0 else ''
            before2 = line[at - 2] if at > 1 else ''
            after = line[end] if end < len(line) else ''
            after2 = line[end + 1] if end + 1 < len(line) else ''
            # A decimal point only makes this a fragment when a DIGIT sits on
            # the far side of it. A full stop that ENDS A SENTENCE, which is
            # how the digest prints "a share of 0.313805.", is punctuation and
            # must not refuse a perfectly good literal.
            frag_left = before.isdigit() or (before == '.' and before2.isdigit())
            frag_right = after.isdigit() or (after == '.' and after2.isdigit())
            # A WHOLE NUMBER MATCHES THE SAME NUMBER PRINTED WITH AN ALL-ZERO
            # FRACTION. `60` and `60.000000` are the same value, so this costs
            # no strictness, and refusing it forced prose to write "60.000000
            # percent" for a band percentage, which is bad writing extracted by
            # a gate. Measured before this: whole_number_hits('60') returned 0
            # while '60.000000' returned 11, against a line plainly reading
            # `| 690.000000 | 60.000000 | allowable, low |`. 85, 130, 540 and
            # 1150 were unresolvable the same way. Fails closed everywhere
            # else: 60 inside 690.000000 is still blocked on the left, and 60
            # inside 60.5 is still blocked on the right.
            if frag_right and '.' not in lit and after == '.':
                frac = ''
                k = end + 1
                while k < len(line) and line[k].isdigit():
                    frac += line[k]; k += 1
                after_frac = line[k] if k < len(line) else ''
                if frac and set(frac) == {'0'} and not after_frac.isdigit():
                    frag_right = False
            if not frag_left and not frag_right and (not negative or minus_before(line, at)):
                out.append(i)
                break
            start = at + 1
    return out


# ------------------------------------------------------------------------ K9
# A ROUND LITERAL INSIDE A MARKDOWN TABLE ROW WAS CHECKED BY NEITHER GATE.
# This file's lesson sweep skipped every line starting with a pipe, calling a
# table row "data", and `numsweep` has a SEVEN-SIGNIFICANT-FIGURE FLOOR, so a
# figure like 0.503000 or 1500 in a table row fell between the two gates and
# nothing looked at it. COURSE LESSONS PUT MOST OF THEIR NUMBERS IN TABLES: on
# FC5's Professional tier that hole was 493 of 559 literals, and the tier writer
# had to close it by hand. Table rows are swept here now, with the same
# whole-number matching, the same absence of a significant-figure floor and the
# same tier-range check the prose gets, and THE ROW AND LITERAL COUNTS ARE
# PRINTED so the count can never be silently zero again.
TABLE_RULE_CHARS = set('-: ')


def is_table_row(line):
    """A markdown table row. Leading spaces count, because an indented table
    inside a list item is still a table."""
    return line.lstrip().startswith('|')


def table_cells(line):
    s = line.strip()
    if s.startswith('|'):
        s = s[1:]
    if s.endswith('|'):
        s = s[:-1]
    return [c.strip() for c in s.split('|')]


def is_table_rule(line):
    """The `| --- | --- |` separator, which carries no figures. Counting it as
    a swept row would inflate the row count with rows that cannot fail."""
    cells = table_cells(line)
    return bool(cells) and all(c and set(c) <= TABLE_RULE_CHARS for c in cells)


def digest_sections(lines):
    """[Section, ...] covering the whole digest, preamble first.

    OWNERSHIP IS PER SECTION AND IS NEVER AN INTERVAL. The version this
    replaced took a tier's range as min..max over the sections it owned, which
    NUMERICALLY SWALLOWED every other tier's section lying inside that range.
    FC4 Professional owned digest lines 273 to 723 and the Expert-owned
    Sections 13 to 18 sit inside that span, so a Professional bank quoting an
    Expert-only figure was IN RANGE and no forward reach was reported. This is
    the forward-leak gate and FC1 shipped nine forward reaches, so a span that
    quietly covers another tier's pages is the whole gate reading clean on
    material it cannot see.

    A SECTION WITH NO OWNER CLAUSE IS SHARED, NOT THE PREVIOUS TIER'S. Reading
    every `# SECTION n:` header but only owner boundaries made an unowned
    section headed "read by every tier" fold into whichever tier happened to
    precede it, which on FC3 was Expert, so ANY LOWER TIER QUOTING A PUBLISHED
    GOLDEN FROM IT READ AS A FORWARD REACH AND FAILED. That is a gate failing
    correct committed content, and it cost real teaching quality: a bank writer
    taught a whole seam as a concept with no numerals rather than fight it.

    THE PREAMBLE IS SHARED TOO. Everything before the first section header is
    the digest's own statement of units, conventions and export counts, which
    every tier reads and no tier owns.
    """
    heads = []
    for i, line in enumerate(lines):
        m = ANY_SECTION_RE.match(line)
        if m:
            heads.append((i, m.group(1), line))
    out = []
    if not heads:
        return out
    if heads[0][0] > 0:
        out.append(Section(0, 0, heads[0][0] - 1, set(), {}, '(preamble)'))
    for n, (lo, no, line) in enumerate(heads):
        hi = heads[n + 1][0] - 1 if n + 1 < len(heads) else len(lines) - 1
        clause = OWNER_CLAUSE_RE.search(line)
        if clause is None:
            owners, modules = set(), {}
        else:
            owners, modules = parse_owners(clause.group('clause'), lo + 1)
        out.append(Section(no, lo, hi, owners, modules, line.strip()))
    return out


def owned_sections(sections, tier):
    """The sections `tier` owns. A SET, never a span."""
    return [s for s in sections if tier in s.owners]


def section_at(sections, idx):
    for s in sections:
        if s.lo <= idx <= s.hi:
            return s
    return None


def owns_desc(sections, tier):
    """"sections 13-18" for the tier's OWNED SET, ranges collapsed, so the
    report says which sections a tier owns rather than a min..max interval
    that may cover pages it does not own."""
    nos = []
    for s in owned_sections(sections, tier):
        try:
            nos.append(int(s.no))
        except (TypeError, ValueError):
            pass
    if not nos:
        return 'no sections'
    nos = sorted(set(nos))
    runs, start, prev = [], nos[0], nos[0]
    for n in nos[1:]:
        if n == prev + 1:
            prev = n
            continue
        runs.append((start, prev))
        start = prev = n
    runs.append((start, prev))
    return 'sections ' + ','.join(str(a) if a == b else '%d-%d' % (a, b) for a, b in runs)


def section_owner_desc(sec):
    if sec is None:
        return 'outside every section'
    if not sec.owners:
        return 'SECTION %s, shared' % (sec.no,)
    who = []
    for t in sorted(sec.owners, key=lambda t: TIER_ORDER[t]):
        mods = ','.join(sorted(sec.modules.get(t, ())))
        who.append('%s%s' % (t, ' ' + mods if mods else ''))
    return 'SECTION %s owned by %s' % (sec.no, ' and '.join(who))


def range_of(hits, sections, tier):
    """('in'|'back'|'fwd', Section) for a literal's digest hits.

    Per hit, the section that CONTAINS it decides. A hit in a shared section or
    in one this tier owns puts the literal in range and nothing else matters. A
    hit is FORWARD only when EVERY owner of its section is a later tier, so a
    section owned by Associate AND Expert is a backward recap for a
    Professional bank rather than a leak, which is what the clause says.
    """
    back = fwd = None
    for h in hits:
        sec = section_at(sections, h)
        if sec is None or not sec.owners or tier in sec.owners:
            return 'in', sec
        if all(TIER_ORDER[o] > TIER_ORDER[tier] for o in sec.owners):
            fwd = fwd or sec
        else:
            back = back or sec
    if back is not None:
        return 'back', back
    return 'fwd', fwd


BANK_NAME_RE = re.compile(r'^(?P<stem>.+?)(?P<letter>[bia])_(?:m\d+|exam)$', re.I)


LESSON_TIER_RE = re.compile(r'(?:^|/)(beginner|intermediate|advanced)(?:/|$)')


def lesson_tier(path):
    """A lesson's tier from its path, <course>/<tier>/<module>/<lesson>.md."""
    m = LESSON_TIER_RE.search(path.replace(os.sep, '/'))
    return m.group(1) if m else None


LESSON_MODULE_RE = re.compile(r'(?:^|/)m(\d{1,2})[-/]')


# ------------------------------------------------ OWNER DECISION 2026-09-21 (a)
# THE ONWARD PREVIEW IS EXEMPT FROM THE FORWARD-REACH RULE, BY ROLE. Every
# Associate and Professional tier ends module m06 with a signpost lesson
# ("Onward", "Onward to Professional", "What the next tier changes") whose job
# is to preview the next tier, so quoting a next-tier figure there is the
# lesson doing its job and never a leak. B5's litsweep triage counted 76
# forward reaches of exactly this shape. The owner chose the exemption over
# stripping the figures.
#
# The exemption is by ROLE, read from the lesson's place and name together:
# the lesson must sit in module m06 of a tier that HAS a next tier, and carry
# one of the signpost slugs. The same file name in any other module, or a
# figure the digest does not print at all, is swept exactly as before. It
# exempts FORWARD reaches only: a backward reach, a sign error and a figure
# missing from the digest all still fail in an onward lesson.
ONWARD_PREVIEW_SLUGS = frozenset([
    'onward', 'onward-to-professional', 'onward-to-expert', 'what-the-next-tier-changes',
])
LESSON_ROLE_RE = re.compile(r'(?:^|/)m(\d{1,2})-[^/]*/l\d{1,2}-([^/]+)\.md$')


def lesson_role(path, tier):
    """'onward-preview' for the m06 signpost lesson of a tier with a next tier,
    'lesson' for everything else."""
    m = LESSON_ROLE_RE.search(path.replace(os.sep, '/'))
    if (m and int(m.group(1)) == 6 and m.group(2) in ONWARD_PREVIEW_SLUGS
            and tier in ('beginner', 'intermediate')):
        return 'onward-preview'
    return 'lesson'


def lesson_module(path):
    """A lesson's own module key, `m03`, from <tier>/m03-.../l02-....md. Used
    only to say which section a resolve came from, never to fail anything."""
    m = LESSON_MODULE_RE.search(path.replace(os.sep, '/'))
    return 'm%02d' % int(m.group(1)) if m else None


def bank_tier(name, prefix=None):
    """The tier letter, read from the BANK NAME rather than from an offset into
    a caller-supplied prefix. `fc2b_m04` resolves to beginner whether the
    caller passed fc2, fc2b or nothing at all. Returns None only when the name
    does not carry the convention, and every caller REFUSES on None."""
    m = BANK_NAME_RE.match(name)
    if not m:
        return None
    return LETTER_TIER.get(m.group('letter').lower())


class Refused(Exception):
    pass


def literals(text):
    """Every numeric literal, digit grouping kept as one number.

    A number glued to the END OF A WORD is an IDENTIFIER and not a figure:
    B99, B31.8, x55, m06, NPS8. Sweeping those reports a course quoting a
    design code as a course quoting a number, and on FC2 it flagged the "99"
    inside the design code B99 as an out-of-range literal. A figure in this
    corpus is always preceded by a space, a bracket or a pipe."""
    out = []
    for m in NUM.finditer(text):
        if m.start() > 0 and (text[m.start() - 1].isalpha() or text[m.start() - 1] == '_'):
            continue
        out.append(('-' if minus_before(text, m.start()) else '') + m.group(0))
    return out


# ----------------------------------------------------------------- THE SIGN
# THE SWEEP COMPARED |value|, SO A SIGN ERROR PASSED. NUM carries no sign, so
# a lesson printing -7.5 where the digest prints 7.5 swept as "7.5" and
# resolved. A literal now carries its minus sign when one is written
# immediately before its digits in SIGN POSITION (start of line, after a space,
# a bracket, a pipe, an operator or punctuation), and a signed literal resolves
# only against a digest occurrence carrying the same sign. A hyphen glued to a
# word or a digit (B-99, 5-7.5, 1e-6) is not a sign and is left alone. The
# unicode minus U+2212 is a sign wherever it stands.
#
# ONE DIRECTION ONLY, deliberately. A NEGATIVE literal must meet a negative
# digest occurrence. A POSITIVE literal may still resolve against a negative
# digest figure, because prose legitimately states a magnitude ("NPV falls by
# 7.5") for a signed printout (-7.5); making that direction strict would be a
# guard that fires on clear air.
SIGN_CONTEXT = set(' \t([{|=,:;<>+*/~^$\u2248\u2264\u2265')
MINUS_CHARS = ('-', '\u2212')


def minus_before(text, at):
    """Is the character before position `at` a minus SIGN (not a hyphen)?"""
    if at <= 0 or text[at - 1] not in MINUS_CHARS:
        return False
    if text[at - 1] == '\u2212':
        return True
    return at - 1 == 0 or text[at - 2] in SIGN_CONTEXT


# ------------------------------------------------ OWNER DECISION 2026-09-21 (b)
# A SIGN-FLIPPED DISTRACTOR IS LEGITIMATE. "-30 days" offered against a keyed
# "30 days ago" tests exactly the sign convention the lesson teaches, and B5's
# triage found 16 correct figures failing only because the digest prints the
# magnitude. So a NEGATIVE literal in a bank OPTION THAT IS NOT THE KEY may
# resolve against the digest's positive printing of the same magnitude.
#
# Nothing else relaxes. The magnitude must still be a whole-number hit (a
# wrong magnitude fails exactly as before), the tier-range check runs on the
# magnitude's hits, and the KEYED option, the prompt and the explanation keep
# the strict same-sign rule, because those are the places the course states a
# figure as true.


def is_distractor_field(field, q):
    """True for `optionN` when N is not the keyed answer."""
    if not field.startswith('option'):
        return False
    try:
        j = int(field[len('option'):])
    except ValueError:
        return False
    key = q.get('answer', q.get('answer_index'))
    return key is not None and j != key


def sign_flip_hits(lit, lines):
    """Hits for the MAGNITUDE of a negative literal, or [] when `lit` is not
    negative. Only callers sweeping a distractor may use these."""
    if not lit.startswith('-'):
        return []
    return whole_number_hits(lit[1:], lines)


# --------------------------------------------------------------- K7: WHICH ROW
# A LITERAL CAN RESOLVE BY COINCIDENCE, AND SUBSTRING PRESENCE IS NOT PROOF OF
# QUOTATION. FC4 found `1.500000` and `3.200000` gal per lb resolving against
# rows that have nothing to do with the quantity the sentence was about. A
# whole-number match says the characters are in the digest; it does not say a
# learner could have read that figure off that row. This cannot be settled
# mechanically, so the gate does the honest thing: it REPORTS the row every
# literal resolved against, and FLAGS a resolve whose row names a different
# quantity, or sits in a section the writer's own module does not own, AS
# SOMETHING FOR A HUMAN TO READ. A review item is neither a pass nor a fail and
# never moves the exit code.

# Words that follow a figure without naming its quantity. A figure followed by
# one of these has no unit stated beside it, so there is nothing to compare and
# the resolve is not reviewed. Being wrong here only ever costs a review line.
NOT_A_UNIT = set("""
    a an the and or of to in on at by for from with as is are was were be been
    it its this that these those than then so because if when while which who
    what how why where all any both each every no not only same other another
    more less most least about above below over under up down out into onto off
    again still just also even here there they them their we you your our
    times per plus minus point but do does did done can could should would may
    might must shall will have has had going get gets give gives leaves leave
    one two three four five six seven eight nine ten eleven twelve
""".split())

UNIT_AFTER_RE = re.compile(r'\s*([A-Za-z][A-Za-z0-9/%_.-]*)')
NUM_THEN_WORD = re.compile(r'\d\s+([A-Za-z][A-Za-z0-9/%_.-]*)')


def unit_vocabulary(lines):
    """Every word this digest itself writes immediately after a number.

    A GUARD THAT FIRES ON CLEAR AIR IS AS MUCH A DEFECT AS ONE THAT MISSES, so
    "is this word a unit" is answered from the corpus rather than from a word
    list somebody guessed at. `253.889303 cell` and `6.000000 costs` are the
    sentence carrying on, not a quantity claim, and a hand-written stop list
    lets both through as reviews nobody should be reading."""
    vocab = set()
    for line in lines:
        for m in NUM_THEN_WORD.finditer(line):
            w = m.group(1).strip('.').lower()
            if w:
                vocab.add(w)
                vocab.add(w.rstrip('s'))
    return vocab


def unit_after(text, lit, vocab):
    """The unit the SENTENCE claims for this literal, or None.

    That word is the quantity the writer says the figure is. `3.200000 gal`
    claims gallons; `3.200000 of the total` claims nothing and is not
    reviewed. Only a word the DIGEST uses as a unit counts as a claim."""
    at = 0
    while True:
        i = text.find(lit, at)
        if i < 0:
            return None
        end = i + len(lit)
        nxt = text[end:end + 1]
        if nxt.isdigit() or (nxt == '.' and text[end + 1:end + 2].isdigit()):
            at = i + 1
            continue
        m = UNIT_AFTER_RE.match(text[end:])
        if not m:
            return None
        word = m.group(1).strip('.')
        low = word.lower()
        if not word or len(word) > 24 or low in NOT_A_UNIT:
            return None
        if low not in vocab and low.rstrip('s') not in vocab:
            return None
        return word


def significant_digits(lit):
    """How many digits a literal actually carries, trailing and leading zeros
    stripped. `1.500000` carries two. A figure this round is the one that
    resolves against an unrelated row by coincidence; a nine-digit one does
    not."""
    d = lit.replace(',', '').replace('.', '').lstrip('0').rstrip('0')
    return len(d) if d else 1


def row_context(lines, i):
    """The digest row a literal resolved against, plus the context a reader
    would use to know what that row carries: the rest of its table block,
    including the column header, and the two lines of prose above the block.
    A digest states a unit in a column header far more often than in the row."""
    ctx = [lines[i]]
    j = i - 1
    if lines[i].lstrip().startswith('|'):
        while j >= 0 and lines[j].lstrip().startswith('|') and len(ctx) < 16:
            ctx.append(lines[j])
            j -= 1
    seen = 0
    while j >= 0 and seen < 2:
        if lines[j].strip():
            ctx.append(lines[j])
            seen += 1
        j -= 1
    return '\n'.join(ctx)


def names_quantity(ctx, unit):
    """Does this context name the unit the sentence claimed? Singular and
    plural both count, and the test is deliberately generous: the point is to
    surface the resolve that names NOTHING like the quantity, not to police
    spelling."""
    low = ctx.lower()
    u = unit.lower()
    for c in (u, u.rstrip('s'), u + 's'):
        if c and c in low:
            return True
    return False


BANK_MODULE_RE = re.compile(r'_(m\d{1,2})$', re.I)


def bank_module(name):
    m = BANK_MODULE_RE.search(name)
    return 'm%02d' % int(m.group(1)[1:]) if m else None


def review_resolve(where, tier, module, lit, text, hits, lines, sections, vocab):
    """A review row for a resolve a human should read, or None.

    TWO SIGNALS, and NEITHER IS A VERDICT:

      * QUANTITY, the sentence names a unit the digest uses and no row this
        literal resolved against names anything like it. This is the FC4 shape:
        `1.500000` and `3.200000` gal per lb resolving against rows that have
        nothing to do with gallons.
      * SECTION, a literal too round to identify a row on its own, matching
        several rows, none of them in a section the writer's own module owns.
        A nine-digit figure matching one row is a quotation; a two-digit one
        matching a dozen rows on other people's pages was not shown to have
        been read off any of them.

    The second is deliberately narrow. Every wave here has a recap module that
    legitimately re-reads the whole tier, so "not my section" on its own fires
    on clear air, and a review nobody can act on is the same defect as a gate
    that misses.
    """
    unit = unit_after(text, lit, vocab)
    secs = [section_at(sections, h) for h in hits]
    first = min(hits)
    sec0 = section_at(sections, first)
    if unit:
        for h in hits:
            sec = section_at(sections, h)
            ctx = row_context(lines, h) + '\n' + (sec.title if sec else '')
            if names_quantity(ctx, unit):
                break
        else:
            return (where, 'QUANTITY', lit, unit, first + 1, section_owner_desc(sec0),
                    len(hits), lines[first].strip()[:130])
    # A ONE-DIGIT FIGURE IDENTIFIES NO ROW AT ALL, so a review of it is
    # unreadable rather than useful: `0` matches two dozen rows in every
    # digest here. The band is two to four significant digits, which is round
    # enough to collide and specific enough for a reader to judge.
    if module and len(hits) > 1 and 2 <= significant_digits(lit) <= 4:
        if all(s is not None and s.owners and module not in s.modules.get(tier, ())
               for s in secs):
            return (where, 'SECTION ', lit, unit or '-', first + 1, section_owner_desc(sec0),
                    len(hits), lines[first].strip()[:130])
    return None


def print_review(review, review_all, label):
    """Never a pass and never a fail. Printed with its count, so a reader can
    see how much of a clean sweep rests on evidence nobody has looked at."""
    if not review:
        print('[litsweep] %s: 0 resolve(s) flagged for a human read' % label)
        return
    cap = len(review) if review_all else min(25, len(review))
    print('[litsweep] %s: %d resolve(s) FLAGGED FOR A HUMAN READ, neither a pass nor a fail '
          '(a literal can resolve against an unrelated row by coincidence)' % (label, len(review)))
    for row in review[:cap]:
        where, kind, lit, unit, line_no, owner, nrows, text = row
        print('   REVIEW %s %r as %s  %s  -> digest line %d (%s), %d row(s) match'
              % (kind, lit, unit, where, line_no, owner, nrows))
        print('      row: %s' % text)
    if cap < len(review):
        print('   ... %d more, pass --review-all to print them' % (len(review) - cap))


def sweep_lessons(lessons_dir, lines, sections, allowed, strict_range=False, quiet=False,
                  review_all=False, vocab=None):
    """Lesson markdown, swept exactly as the banks are: every literal, no
    significant-figure floor, whole-number matching, tier range in both
    directions against the tier's OWNED SET of sections.

    TABLE ROWS ARE SWEPT, which they were not. A row starting with a pipe used
    to be skipped as "data", and `numsweep`, the only other gate that reads
    lesson markdown, will not look at a literal carrying fewer than seven
    significant figures. A round figure in a table row therefore belonged to
    NEITHER GATE, and a course lesson keeps most of its figures in tables. The
    row count and the table-literal count are printed beside the prose count,
    and a corpus that HAS table rows and yields NO table literals REFUSES
    rather than reporting a clean prose-only zero."""
    vocab = vocab if vocab is not None else unit_vocabulary(lines)
    files = []
    for dirpath, dirnames, filenames in os.walk(lessons_dir):
        dirnames[:] = [d for d in dirnames if not d.startswith('.')]
        for n in sorted(filenames):
            if n.endswith('.md'):
                files.append(os.path.join(dirpath, n))
    if not files:
        raise Refused(f'no .md lessons under {lessons_dir}. A lesson sweep over zero files '
                      f'is not a pass.')
    checked = as_constant = 0
    bad, reach_back, reach_fwd, review = [], [], [], []
    onward_exempt = []
    ranged = 0
    prose_lits = table_lits = table_rows = table_rules = panel_lines = digit_rows = 0
    for f in files:
        tier = lesson_tier(f)
        if tier is None:
            raise Refused(f'cannot resolve a tier from the path of {f}. A lesson whose tier is '
                          f'unknown cannot be range checked, and a skipped check is not a pass.')
        owned = owned_sections(sections, tier)
        if not owned:
            raise Refused(f'{f} is a {tier} lesson but the digest names no section owned by that '
                          f'tier. Refusing rather than passing it unchecked.')
        desc = owns_desc(sections, tier)
        module = lesson_module(f)
        rel = os.path.relpath(f, lessons_dir)
        role = lesson_role(rel, tier)
        for i, line in enumerate(open(f, encoding='utf-8').read().split('\n'), 1):
            if line.lstrip().startswith('{{panel'):
                # A panel is a component invocation rather than a sentence, and
                # its props are swept by the panel-side gates. Counted and
                # printed rather than silently dropped, because the last thing
                # this gate skipped silently was half its own corpus.
                panel_lines += 1
                continue
            if is_table_row(line):
                if is_table_rule(line):
                    table_rules += 1
                    continue
                table_rows += 1
                if any(c.isdigit() for c in line):
                    digit_rows += 1
                field = 'table'
            else:
                field = 'prose'
            for lit in literals(line):
                checked += 1
                if field == 'table':
                    table_lits += 1
                else:
                    prose_lits += 1
                hits = whole_number_hits(lit, lines)
                if not hits:
                    if lit in allowed:
                        as_constant += 1
                        continue
                    bad.append((rel, i, field, lit, line))
                    continue
                ranged += 1
                kind, sec = range_of(hits, sections, tier)
                if kind != 'in':
                    row = (rel, tier, i, field, lit, min(hits) + 1,
                           f'{section_owner_desc(sec)}; {tier} owns {desc}')
                    if kind == 'fwd' and role == 'onward-preview':
                        onward_exempt.append(row)
                        continue
                    (reach_fwd if kind == 'fwd' else reach_back).append(row)
                    continue
                r = review_resolve(f'{rel}:{i} {field}', tier, module, lit, line, hits, lines,
                                   sections, vocab)
                if r:
                    review.append(r)
    if checked == 0:
        raise Refused(f'{len(files)} lesson(s) under {lessons_dir} carried no literals at all. '
                      f'A sweep of zero literals is not a pass.')
    # K9. A corpus WITH table rows that yields NO table literals means the
    # table half did not run, and a prose-only zero on a figure-dense course is
    # the clean result this gate exists to stop.
    if digit_rows and table_lits == 0:
        raise Refused(f'{digit_rows} of {table_rows} table row(s) under {lessons_dir} carry a '
                      f'digit and the table sweep produced 0 literals, so the table half did '
                      f'not run. Most of a lesson\'s figures live in its tables and a '
                      f'prose-only zero is not a pass. (A table of words alone is legitimate '
                      f'and does not refuse: this fires only when rows with digits in them '
                      f'yielded nothing.)')
    if not quiet:
        print(f'[litsweep] {len(files)} lesson(s) under {lessons_dir}, {checked} literals '
              f'checked with no sig-fig floor, whole-number matching, {ranged} tier-range '
              f'checked against each tier\'s owned SET of sections')
        print(f'[litsweep] lessons: {prose_lits} literal(s) in prose and {table_lits} in '
              f'{table_rows} MARKDOWN TABLE ROW(S), with no significant-figure floor on '
              f'either ({table_rules} separator row(s) and {panel_lines} panel line(s) '
              f'carry no figures)')
        for f, i, field, lit, line in bad:
            print(f'   NOT IN DIGEST {lit!r}  {f}:{i} ({field})')
            print(f'      ...{line.strip()[:150]}')
        for f, tier, i, field, lit, line_no, where in reach_fwd:
            print(f'   REACHES FORWARD {lit!r}  {f}:{i} ({field}) '
                  f'(digest line {line_no}; {where})')
        for f, tier, i, field, lit, line_no, where in reach_back:
            print(f'   reaches back {lit!r}  {f}:{i} ({field}) '
                  f'(digest line {line_no}; {where})')
        nf_t = sum(1 for r in reach_fwd if r[3] == 'table')
        nb_t = sum(1 for r in reach_back if r[3] == 'table')
        print(f'[litsweep] lessons: {len(bad)} not in the digest, {len(reach_fwd)} reaching '
              f'FORWARD, {len(reach_back)} reaching back '
              f'({nf_t} forward and {nb_t} back from table rows)')
        print(f'[litsweep] lessons: {len(onward_exempt)} forward reach(es) in m06 onward '
              f'preview lessons, exempt by role (owner decision 2026-09-21)')
        print_review(review, review_all, 'lessons')
    counts = {'files': len(files), 'literals': checked, 'prose': prose_lits,
              'table': table_lits, 'table_rows': table_rows, 'digit_rows': digit_rows,
              'ranged': ranged, 'not_in_digest': len(bad), 'forward': len(reach_fwd),
              'back': len(reach_back), 'onward_exempt': len(onward_exempt),
              'table_forward': sum(1 for r in reach_fwd if r[3] == 'table'),
              'table_not_in_digest': sum(1 for r in bad if r[2] == 'table')}
    return bad + reach_fwd + (reach_back if strict_range else []), counts


def run(wave_dir, banks_dir=None, prefix=None, quiet=False, strict_range=False,
        lessons_dir=None, review_all=False, lessons_only=False):
    """K10. THE LESSON SWEEP USED TO BE UNREACHABLE THROUGH THE CLI ON A
    BANKLESS WAVE. The banks check refused BEFORE the lesson sweep was reached,
    and every foundation-phase wave has lessons and no banks, so the half that
    could run was suppressed by the half that could not at the exact moment the
    lessons most needed sweeping. FC5's Professional writer had to import this
    module to get at it.

    The order is fixed: the lesson sweep runs and prints whatever the caller
    asked for, and the banks half REFUSES BY NAME afterwards, naming the
    directory and the glob that found nothing, so neither half hides the other.
    `--lessons-only` is the deliberate declaration that the wave has no banks
    yet, exactly as promptleak's `--all` is; without it a bankless run still
    exits 2 AFTER the lesson result has been printed."""
    cfg_path = os.path.join(wave_dir, 'wave.json')
    if not os.path.exists(cfg_path):
        raise Refused(f'no wave.json in {wave_dir}')
    cfg = json.load(io.open(cfg_path, encoding='utf-8'))
    digest_path = os.path.join(wave_dir, 'digest.txt')
    if not os.path.exists(digest_path):
        raise Refused(f'no digest.txt in {wave_dir}')
    digest = io.open(digest_path, encoding='utf-8').read()
    if not digest.strip():
        raise Refused(f'{digest_path} is empty')
    allowed = set(cfg.get('constants', {}))

    # A GATE MUST SAY WHICH DIRECTORY IT READ. `<wave_dir>/banks` is a COPY on
    # every wave so far, so a green run over a default path proves nothing
    # about a bank just edited in the worktree.
    banks_dir = banks_dir or os.path.join(wave_dir, 'banks')
    # RECURSIVELY, so the COMMITTED per-tier layout can be swept as well as the
    # flat wave copy. A flat glob could not be pointed at
    # `tools/course-banks/<slug>/{beginner,intermediate,advanced}/`, which is
    # the tree a merged course actually ships, so the only banks this gate could
    # ever read were the wave directory's own copies.
    bank_glob = os.path.join(banks_dir, '**', (prefix or '') + '*.json')
    paths = sorted(p for p in glob.glob(bank_glob, recursive=True)
                   if not p.endswith('manifest.json'))
    banks_refusal = None
    if not paths:
        banks_refusal = (f'no bank JSON under {banks_dir} (glob {bank_glob}). '
                         f'The banks half of this gate examined NOTHING.')
        if lessons_dir is None:
            raise Refused(banks_refusal)
        if not quiet:
            print(f'[litsweep] BANKS REFUSED BY NAME: {banks_refusal} The lesson sweep below '
                  f'still runs, because a half that cannot run must not suppress the half '
                  f'that can.')

    lines = digest.split('\n')
    sections = digest_sections(lines)
    vocab = unit_vocabulary(lines)
    owning = [s for s in sections if s.owners]
    prefix = prefix or cfg.get('prefix')

    checked = 0
    bad, reach_back, reach_fwd = [], [], []
    sign_flips = []
    if banks_refusal is None:
        checked = as_constant = 0
        bad, reach_back, reach_fwd, review = [], [], [], []
        ranged = unranged = 0
        for p in paths:
            bank = json.load(io.open(p, encoding='utf-8'))
            if not isinstance(bank, list) or not bank:
                raise Refused(f'{p} is not a non-empty list of questions')
            name = os.path.basename(p)[:-len('.json')]
            btier = bank_tier(name)
            if btier is None:
                raise Refused(
                    f'cannot resolve a b/i/a tier for bank "{name}". The convention is '
                    f'<prefix><b|i|a>_<m01..m06|exam>.json. Refusing rather than running without '
                    f'the tier-range check, which is how a skipped check comes to exit 0.')
            if not owning:
                raise Refused(
                    f'{digest_path} names no section owners, so there is no tier range to check '
                    f'"{name}" against. A scoped check with no scope is not a pass.')
            owned = owned_sections(sections, btier)
            if not owned:
                raise Refused(
                    f'"{name}" is a {btier} bank but the digest names no section owned by that '
                    f'tier. Refusing rather than passing it unchecked.')
            desc = owns_desc(sections, btier)
            module = bank_module(name)
            for i, q in enumerate(bank, 1):
                for field, text in ([('prompt', q['prompt']), ('explanation', q['explanation'])]
                                    + [(f'option{j}', o) for j, o in enumerate(q['options'])]):
                    for lit in literals(text):
                        checked += 1
                        hits = whole_number_hits(lit, lines)
                        if is_distractor_field(field, q) and not (
                                hits and range_of(hits, sections, btier)[0] == 'in'):
                            # The magnitude's hits JOIN the signed ones, so a
                            # distractor whose negative form only sits on a
                            # later page still resolves where its magnitude is
                            # printed in range. The tier range reads both.
                            flip = [h for h in sign_flip_hits(lit, lines) if h not in hits]
                            if flip:
                                hits = sorted(hits + flip)
                                sign_flips.append((name, i, field, lit))
                        if not hits:
                            if lit in allowed:
                                as_constant += 1
                                continue
                            bad.append((name, i, field, lit, text))
                            continue
                        ranged += 1
                        # OWNERSHIP IS PER SECTION, NEVER AN INTERVAL. A tier's
                        # min..max span swallows every section another tier owns
                        # inside it, which is how a forward-leak gate reads clean
                        # on a forward leak.
                        kind, sec = range_of(hits, sections, btier)
                        if kind != 'in':
                            row = (name, btier, i, field, lit, min(hits) + 1,
                                   f'{section_owner_desc(sec)}; {btier} owns {desc}')
                            (reach_fwd if kind == 'fwd' else reach_back).append(row)
                            continue
                        r = review_resolve(f'{name} Q{i} {field}', btier, module, lit, text,
                                           hits, lines, sections, vocab)
                        if r:
                            review.append(r)

        if checked == 0:
            raise Refused('zero literals examined')
        if unranged:
            raise Refused(f'{unranged} literal(s) reached the end of the sweep with no tier range '
                          f'applied, so the tier-range result would be a zero for a check that '
                          f'never ran')
        if ranged == 0:
            raise Refused('the tier-range check examined zero literals, which is not a pass')

        if not quiet:
            print(f'[litsweep] {len(paths)} banks from {banks_dir}, {checked} literals checked '
                  f'against {digest_path} ({len(lines)} lines, {len(sections)} sections, '
                  f'{len(owning)} owned), no sig-fig floor, whole-number matching')
            for tier in ('beginner', 'intermediate', 'advanced'):
                own = owned_sections(sections, tier)
                if own:
                    print(f'[litsweep]   {tier} owns {owns_desc(sections, tier)} '
                          f'({sum(s.hi - s.lo + 1 for s in own)} digest lines)')
            shared = [s for s in sections if not s.owners]
            if shared:
                print(f'[litsweep]   shared and in range for every tier: '
                      f'{", ".join(str(s.no) for s in shared)}')
            print(f'[litsweep] resolved in the digest: {checked - len(bad) - as_constant}   '
                  f'resolved as a declared constant: {as_constant}   '
                  f'tier-range checked: {ranged}   tier unknown, range skipped: {unranged}')
            for name, i, field, lit, text in bad:
                print(f'   NOT IN DIGEST {lit!r}  {name} Q{i} {field}')
                print(f'      ...{text[:160]}')
            print(f'[litsweep] {len(bad)} literal(s) not in the digest')
            print(f'[litsweep] {len(sign_flips)} sign-flipped distractor(s) resolved on the '
                  f'magnitude the digest prints (owner decision 2026-09-21)')
            for name, i, field, lit in sign_flips:
                print(f'   sign-flipped distractor {lit!r}  {name} Q{i} {field}')
            for name, btier, i, field, lit, line, where in reach_fwd:
                print(f'   REACHES FORWARD {lit!r}  {name} Q{i} {field} '
                      f'(digest line {line}; {where})')
            for name, btier, i, field, lit, line, where in reach_back:
                print(f'   reaches back {lit!r}  {name} Q{i} {field} '
                      f'(digest line {line}; {where})')
            print(f'[litsweep] {len(reach_fwd)} literal(s) reaching FORWARD into a later '
                  f"tier's sections, which always fails")
            print(f'[litsweep] {len(reach_back)} literal(s) reaching back into an earlier '
                  f"tier's sections, which {'fails under --strict-range' if not strict_range else 'FAILS here'}")
            print_review(review, review_all, 'banks')
    failing = bad + reach_fwd + (reach_back if strict_range else [])
    lesson_counts = None
    if lessons_dir:
        lesson_fail, lesson_counts = sweep_lessons(lessons_dir, lines, sections, allowed,
                                                   strict_range, quiet, review_all, vocab)
        failing = failing + lesson_fail
    run.last_lesson_counts = lesson_counts
    run.last_sign_flips = sign_flips
    # THE BANKS HALF REFUSES BY NAME, AFTER the lesson result has been printed.
    # A wave that means to be bankless says so with --lessons-only.
    if banks_refusal is not None and not lessons_only:
        raise Refused(banks_refusal + ' Pass --lessons-only to declare a bankless wave '
                      'deliberately; the lesson sweep above has already run and its result '
                      'is printed.')
    return failing, checked


def selftest():
    import tempfile
    d = tempfile.mkdtemp()
    os.makedirs(os.path.join(d, 'banks'))
    io.open(os.path.join(d, 'wave.json'), 'w').write(json.dumps({'constants': {'14.7': 'atm'}}))
    io.open(os.path.join(d, 'digest.txt'), 'w').write(
        '# SECTION 1: the vessel (owned by Associate m01)\n'
        'the vessel is 3.049149 ft and 2.026834 ft\n')
    good = {'prompt': 'It holds 3.049149 ft at 14.7 psi.', 'options': ['a', 'b', 'c', 'd'],
            'answer': 0, 'explanation': 'Against 2.026834 ft.'}
    bad = dict(good, explanation='It is really 9.876543 ft.')
    json.dump([good], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
    found, checked = run(d, quiet=True)
    assert checked > 0 and not found, f'a clean bank failed: {found}'
    json.dump([good, bad], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
    found, _ = run(d, quiet=True)
    assert [f[3] for f in found] == ['9.876543'], f'the planted literal was missed: {found}'
    # a ROUND literal that numsweep would skip must still be caught
    roundish = dict(good, explanation='The drum is 1234500.0 ft across.')
    json.dump([good, roundish], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
    found, _ = run(d, quiet=True)
    assert [f[3] for f in found] == ['1234500.0'], f'a round literal was skipped: {found}'
    # NEGATIVE CONTROL, THE FRAGMENT. A literal that is only a SUBSTRING of a
    # longer digest number must be caught. A plain `lit in digest` test passes
    # every one of these, which is how a sweep reports zero on a corpus it
    # cannot discriminate.
    for fragment in ('3.04914', '049149', '3', '2.0268'):
        frag = dict(good, explanation=f'The reading is {fragment} ft.')
        json.dump([good, frag], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
        found, _ = run(d, quiet=True)
        assert [f[3] for f in found] == [fragment], \
            f'the fragment {fragment!r} resolved against a longer number: {found}'

    # POSITIVE CONTROL ON THE SAME CORPUS. A number the digest prints at the
    # END OF A SENTENCE, so the character after it is a full stop, must
    # RESOLVE. A tokeniser that treats the trailing stop as part of the number
    # refuses three perfectly good literals, which is the mirror failure and
    # just as useless.
    io.open(os.path.join(d, 'digest.txt'), 'w').write(
        '# SECTION 1: the vessel (owned by Associate m01)\n'
        'the vessel is 3.049149 ft and 2.026834 ft\n'
        'the fittings cost a share of 0.313805.\n')
    stop = dict(good, explanation='The share is 0.313805 of the total.')
    json.dump([good, stop], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
    found, checked = run(d, quiet=True)
    assert checked > 0 and not found, \
        f'a figure the digest prints before a full stop was refused: {found}'

    # TIER RANGE, both controls on one corpus. An Expert bank reaching a figure
    # that lives only in an Associate section must be flagged; a figure inside
    # the Expert sections must not be.
    d6 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d6, 'banks'))
    io.open(os.path.join(d6, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d6, 'digest.txt'), 'w').write(
        '# SECTION 1: constants (owned by Associate m01)\n'
        'seconds per hour: 3600.000000\n'
        '# SECTION 13: the wall (owned by Expert m01)\n'
        'the wall rates 1019.607843 psig\n')
    reach = {'prompt': 'What is the conversion?', 'options': ['3600.000000', 'b', 'c', 'd'],
             'answer': 0, 'explanation': 'It is 3600.000000 seconds.'}
    inrange = {'prompt': 'What does the wall rate?', 'options': ['1019.607843', 'b', 'c', 'd'],
               'answer': 0, 'explanation': 'It rates 1019.607843 psig.'}
    json.dump([inrange], io.open(os.path.join(d6, 'banks', 'zza_m01.json'), 'w'))
    found, _ = run(d6, quiet=True)
    assert not found, f'an in-range Expert literal was flagged: {found}'
    json.dump([inrange, reach], io.open(os.path.join(d6, 'banks', 'zza_m01.json'), 'w'))
    found, _ = run(d6, quiet=True)
    assert not found, 'a BACKWARD reach failed the gate without --strict-range'
    found, _ = run(d6, quiet=True, strict_range=True)
    assert any(len(f) == 7 and f[4] == '3600.000000' for f in found), \
        f'an Expert bank reaching an Associate-only figure was not flagged: {found}'
    # AND THE FORWARD DIRECTION, which always fails: an Associate bank whose
    # figure lives only on an Expert page.
    fwd = {'prompt': 'What does the wall rate?', 'options': ['1019.607843', 'b', 'c', 'd'],
           'answer': 0, 'explanation': 'It rates 1019.607843 psig.'}
    json.dump([fwd], io.open(os.path.join(d6, 'banks', 'zzb_m01.json'), 'w'))
    found, _ = run(d6, quiet=True)
    assert any(len(f) == 7 and f[4] == '1019.607843' and f[0] == 'zzb_m01' for f in found), \
        f'an Associate bank reaching forward to an Expert-only figure was not flagged: {found}'
    os.remove(os.path.join(d6, 'banks', 'zzb_m01.json'))

    # NEGATIVE CONTROL, THE IDENTIFIER. A number glued to the end of a word is
    # a design code or a module key, and sweeping it reports nonsense. The
    # planted B99 must NOT be swept, while a bare 99 in the same corpus must.
    io.open(os.path.join(d, 'digest.txt'), 'w').write(
        '# SECTION 1: the vessel (owned by Associate m01)\n'
        'the vessel is 3.049149 ft and 2.026834 ft\n'
        'the fittings cost a share of 0.313805.\n')
    code = dict(good, explanation='A wall to a code that does not exist: B99 is refused.')
    json.dump([good, code], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
    found, _ = run(d, quiet=True)
    assert not found, f'a design code was swept as a figure: {found}'
    bare = dict(good, explanation='The answer is 99 exactly.')
    json.dump([good, bare], io.open(os.path.join(d, 'banks', 'tb_m01.json'), 'w'))
    found, _ = run(d, quiet=True)
    assert [f[3] for f in found] == ['99'], f'a bare number was skipped with the codes: {found}'

    # NEGATIVE CONTROL FOR THE SKIP ITSELF. A gate that did not run must never
    # exit 0. A bank whose name carries no b/i/a tier letter cannot be range
    # checked, so it REFUSES rather than reporting zero for a check that never
    # executed.
    d7 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d7, 'banks'))
    io.open(os.path.join(d7, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d7, 'digest.txt'), 'w').write(
        '# SECTION 1: constants (owned by Associate m01)\n'
        'the wall rates 1019.607843 psig\n')
    ok = {'prompt': 'What does the wall rate?', 'options': ['1019.607843', 'b', 'c', 'd'],
          'answer': 0, 'explanation': 'It rates 1019.607843 psig.'}
    json.dump([ok], io.open(os.path.join(d7, 'banks', 'zz_m01.json'), 'w'))
    try:
        run(d7, quiet=True)
    except Refused as exc:
        assert 'tier' in str(exc), f'refused for the wrong reason: {exc}'
    else:
        raise AssertionError('a bank with no resolvable tier did not refuse, '
                             'so a skipped tier-range check would exit 0')

    # REGRESSION FOR THE REPORTED BUG. Resolving the tier by offset arithmetic
    # on the caller's prefix made `--prefix zzb` read the UNDERSCORE of
    # `zzb_m01` and skip every bank while exiting 0. Both the wave prefix and
    # the prefix WITH the tier letter must now resolve, and neither may skip.
    os.remove(os.path.join(d7, 'banks', 'zz_m01.json'))
    json.dump([ok], io.open(os.path.join(d7, 'banks', 'zzb_m01.json'), 'w'))
    for pfx in (None, 'zz', 'zzb', 'zzb_m01'):
        found, checked = run(d7, prefix=pfx, quiet=True)
        assert checked > 0, f'prefix {pfx!r} swept nothing'
        assert not found, f'prefix {pfx!r} reported {found}'
    assert bank_tier('fc2b_m04') == 'beginner'
    assert bank_tier('fc1a_exam') == 'advanced'
    assert bank_tier('fc3i_m06') == 'intermediate'
    assert bank_tier('fc2_m04') is None

    # SHARED SECTIONS AND THE PREAMBLE. A section with NO owner is read by
    # every tier, and so is everything before the first section header. The
    # previous version folded an unowned section into whichever tier preceded
    # it, so a lower tier quoting a published golden from it read as a FORWARD
    # REACH and FAILED ON CORRECT COMMITTED CONTENT.
    d8 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d8, 'banks'))
    io.open(os.path.join(d8, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d8, 'digest.txt'), 'w').write(
        'the exports number 7.000000 in all\n'
        '# SECTION 1: what it does (owned by Associate m01)\n'
        'the line spends 25.660631 psi\n'
        '# SECTION 13: the wall (owned by Expert m01)\n'
        'the wall rates 1019.607843 psig\n'
        '# SECTION 16: the published goldens, read by every tier\n'
        'the golden reads 123.834499 and 123.889863\n')
    shared_q = {'prompt': 'What does the golden read?',
                'options': ['123.834499', 'b', 'c', 'd'], 'answer': 0,
                'explanation': 'It reads 123.889863 beside it.'}
    pre_q = {'prompt': 'How many exports are there?',
             'options': ['7.000000', 'b', 'c', 'd'], 'answer': 0,
             'explanation': 'There are 7.000000 of them.'}
    json.dump([shared_q, pre_q], io.open(os.path.join(d8, 'banks', 'zzb_m01.json'), 'w'))
    found, checked = run(d8, quiet=True, strict_range=True)
    assert checked > 0, 'the shared-section control swept nothing'
    assert not found, (
        'an ASSOCIATE bank quoting a SHARED section or the PREAMBLE was reported: %r' % (found,))
    # and a genuinely forward reach in the same corpus must STILL fail
    fwd_q = {'prompt': 'What does the wall rate?',
             'options': ['1019.607843', 'b', 'c', 'd'], 'answer': 0,
             'explanation': 'It rates 1019.607843 psig.'}
    json.dump([shared_q, fwd_q], io.open(os.path.join(d8, 'banks', 'zzb_m01.json'), 'w'))
    found, _c = run(d8, quiet=True)
    assert any(len(f) == 7 and f[4] == '1019.607843' for f in found), (
        'the shared-section fix swallowed a real forward reach: %r' % (found,))

    # A WHOLE NUMBER AGAINST AN ALL-ZERO FRACTION. Same value, so it resolves;
    # everything that is NOT the same value still fails closed.
    zline = ['| 690.000000 | 60.000000 | allowable, low |',
             'the band runs to 85.000000 and the ceiling is 1150.000000',
             'a different reading of 60.5 and one of 160.000000']
    assert whole_number_hits('60', zline), 'a whole number did not match its all-zero fraction'
    assert whole_number_hits('85', zline), '85 did not match 85.000000'
    assert whole_number_hits('1150', zline), '1150 did not match 1150.000000'
    assert whole_number_hits('60.000000', zline), 'the six-decimal form stopped matching'
    # and the fragments must STILL fail closed
    assert not whole_number_hits('69', zline), '69 matched inside 690.000000'
    assert not whole_number_hits('90', zline), '90 matched inside 690.000000'

    # THE SIGN, NEGATIVE CONTROL AND POSITIVE CONTROL (2026-09-21). The sweep
    # compared |value|, so a lesson printing -7.5 against a digest printing 7.5
    # resolved. A planted sign error must now FAIL, a correctly signed figure
    # must resolve, and the hyphens that are not signs must stay unsigned.
    sline = ['the NPV at 12 percent is 7.5 MUSD', 'the swing is -0.25 and \u22123.5 here',
             '| well | -12.000000 | 4-6 |']
    assert not whole_number_hits('-7.5', sline), 'a sign error resolved: -7.5 against 7.5'
    assert whole_number_hits('7.5', sline), 'the positive figure stopped resolving'
    assert whole_number_hits('-0.25', sline), 'a correctly signed -0.25 did not resolve'
    assert whole_number_hits('-3.5', sline), 'a unicode minus did not resolve as a sign'
    assert whole_number_hits('-12', sline), '-12 did not match -12.000000'
    assert whole_number_hits('0.25', sline), 'a magnitude quote of a signed figure was refused'
    assert not whole_number_hits('-6', sline), 'the range 4-6 was read as a negative 6'
    assert literals('B-99, 5-7.5, 1e-6, x = -4, (-3) and \u22122') == \
        ['99', '5', '7.5', '1', '6', '-4', '-3', '-2'], literals('B-99, 5-7.5, 1e-6, x = -4, (-3) and \u22122')
    dsg = tempfile.mkdtemp()
    os.makedirs(os.path.join(dsg, 'banks'))
    io.open(os.path.join(dsg, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(dsg, 'digest.txt'), 'w').write(
        '# SECTION 1: the project (owned by Associate m01)\n'
        'the NPV is 7.5 MUSD and the swing is -2.25 MUSD\n')
    okq = {'prompt': 'What is the NPV?', 'options': ['7.5', '-2.25', 'c', 'd'], 'answer': 0,
           'explanation': 'It is 7.5 MUSD, with a swing of -2.25.'}
    json.dump([okq], io.open(os.path.join(dsg, 'banks', 'zzb_m01.json'), 'w'))
    found, checked = run(dsg, quiet=True)
    assert checked > 0 and not found, f'a correctly signed bank failed: {found}'
    badq = dict(okq, explanation='It is -7.5 MUSD.')
    json.dump([okq, badq], io.open(os.path.join(dsg, 'banks', 'zzb_m01.json'), 'w'))
    found, _ = run(dsg, quiet=True)
    assert [f[3] for f in found] == ['-7.5'], f'the planted sign error was missed: {found}'
    assert not whole_number_hits('16', zline), '16 matched inside 160.000000'
    assert not whole_number_hits('6', zline), '6 matched inside a longer number'
    assert not whole_number_hits('99', zline), 'an absent number resolved'

    # ------------------------------------------------------------------ K1
    # A SECTION OWNED BY TWO TIERS. FC4's digest heads a section "(owned by
    # Associate m01 l04 and Expert m05)". Capturing ONE tier word read it as
    # Associate-only, so every legitimate Expert quote of that section was
    # reported as a BACKWARD REACH: 10 of them on FC4 Expert alone.
    #
    # THE CONTROL DOES NOT MOVE THE DIGEST. One corpus, two ownership rules:
    # the shipped rule must report nothing and the old first-tier-only rule
    # must report the false backward reach, or this corpus cannot tell the two
    # apart and the control proves nothing.
    d9 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d9, 'banks'))
    io.open(os.path.join(d9, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d9, 'digest.txt'), 'w').write(
        '# SECTION 1: the inlet (owned by Associate m01)\n'
        'the inlet carries 53.450380 lb of water\n'
        '# SECTION 2: the numbers this module stands on (owned by Associate m01 l04 and Expert m05)\n'
        'the constant is 379.483571856287 scf per lbmol\n'
        '# SECTION 3: the cold box (owned by Expert m01)\n'
        'the box drops 36.316483434 degF\n')
    shared_two = {'prompt': 'What is the constant?',
                  'options': ['379.483571856287', 'b', 'c', 'd'], 'answer': 0,
                  'explanation': 'It is 379.483571856287 scf per lbmol.'}
    json.dump([shared_two], io.open(os.path.join(d9, 'banks', 'zza_m05.json'), 'w'))
    found, checked = run(d9, quiet=True, strict_range=True)
    assert checked > 0, 'the two-owner control swept nothing'
    assert not found, (
        'an EXPERT bank quoting a section its own tier co-owns was reported: %r' % (found,))
    lines9 = io.open(os.path.join(d9, 'digest.txt'), encoding='utf-8').read().split('\n')
    secs9 = digest_sections(lines9)
    two = [s for s in secs9 if str(s.no) == '2'][0]
    assert two.owners == {'beginner', 'advanced'}, f'both owners were not read: {two.owners}'
    assert two.modules['advanced'] == {'m05'}, f'the module keys were not read: {two.modules}'
    # the OLD rule, on the SAME corpus, and it must fire
    first_only = re.search(r'\(owned by\s+([A-Za-z]+)', two.title).group(1).lower()
    assert first_only == 'associate', 'the old regex did not read one tier'
    old_secs = [Section(s.no, s.lo, s.hi,
                        ({NAME_TIER[re.search(r'\(owned by\s+([A-Za-z]+)', s.title).group(1).lower()]}
                         if '(owned by' in s.title else set()), s.modules, s.title)
                for s in secs9]
    hits9 = whole_number_hits('379.483571856287', lines9)
    kind_old, sec_old = range_of(hits9, old_secs, 'advanced')
    kind_new, sec_new = range_of(hits9, secs9, 'advanced')
    assert kind_old == 'back' and kind_new == 'in', \
        f'the corpus cannot tell the two rules apart: old={kind_old} new={kind_new}'
    print(f'[litsweep] K1 control FIRED: with one tier word captured, '
          f'{"379.483571856287"!r} in zza_m05 reads as a {kind_old.upper()}WARD reach off '
          f'{section_owner_desc(sec_old)}; reading the whole clause it is {kind_new.upper()} range '
          f'in {section_owner_desc(sec_new)}')

    # ------------------------------------------------------------------ K6
    # OWNERSHIP IS A SET, NEVER AN INTERVAL. A tier's min..max span SWALLOWS
    # every section another tier owns inside it. On FC4, Professional owned
    # digest lines 273 to 723 and Expert's Sections 13 to 18 sit inside that,
    # so a Professional bank quoting an Expert-only figure was IN RANGE. This
    # is the FORWARD-LEAK gate, and FC1 shipped nine forward reaches.
    #
    # Same shape, smallest corpus that has it: Associate owns sections 1 and 3
    # and Expert owns section 2 BETWEEN them.
    d10 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d10, 'banks'))
    io.open(os.path.join(d10, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d10, 'digest.txt'), 'w').write(
        '# SECTION 1: the inlet (owned by Associate m01)\n'
        'the inlet carries 53.450380 lb of water\n'
        '# SECTION 2: the cold box (owned by Expert m01)\n'
        'the box drops 36.316483434 degF\n'
        '# SECTION 3: the Associate reading (owned by Associate m06)\n'
        'the reading ends at 62.000000 MMscfd\n')
    leak = {'prompt': 'How far does the box drop?',
            'options': ['36.316483434', 'b', 'c', 'd'], 'answer': 0,
            'explanation': 'It drops 36.316483434 degF.'}
    json.dump([leak], io.open(os.path.join(d10, 'banks', 'zzb_m02.json'), 'w'))
    found, checked = run(d10, quiet=True)
    assert checked > 0, 'the swallowed-section control swept nothing'
    fwd_rows = [f for f in found if len(f) == 7 and f[4] == '36.316483434']
    assert fwd_rows, (
        'an ASSOCIATE bank quoting an EXPERT-only section between two Associate sections '
        'was not reported as reaching forward: %r' % (found,))
    # and the interval rule this replaced must MISS it on the same corpus
    lines10 = io.open(os.path.join(d10, 'digest.txt'), encoding='utf-8').read().split('\n')
    secs10 = digest_sections(lines10)
    own10 = owned_sections(secs10, 'beginner')
    lo, hi = min(s.lo for s in own10), max(s.hi for s in own10)
    hits10 = whole_number_hits('36.316483434', lines10)
    assert any(lo <= h <= hi for h in hits10), \
        'the corpus does not reproduce the swallowing span, so this control proves nothing'
    print(f'[litsweep] K6 control FIRED: the Expert-only figure {"36.316483434"!r} sits on digest '
          f'line {min(hits10) + 1}, INSIDE the beginner interval {lo + 1}..{hi + 1} that the old '
          f'rule would have called in range; per section it is reported as {fwd_rows[0][6]}')
    # POSITIVE CONTROL ON THE SAME CORPUS: the Associate's own two sections,
    # one of them on the far side of the Expert section, must stay clean.
    ok10 = {'prompt': 'What does the inlet carry?',
            'options': ['53.450380', 'b', 'c', 'd'], 'answer': 0,
            'explanation': 'It ends at 62.000000 MMscfd.'}
    json.dump([ok10], io.open(os.path.join(d10, 'banks', 'zzb_m02.json'), 'w'))
    found, _c = run(d10, quiet=True, strict_range=True)
    assert not found, f'the per-section rule flagged a tier reading its own two sections: {found}'

    # ------------------------------------------------------------------ K7
    # A LITERAL CAN RESOLVE BY COINCIDENCE. `1.500000` written as gal per lb,
    # resolving against a row that is about psi, is not a quotation. The gate
    # cannot decide that, so it REPORTS THE ROW and flags it for a human. A
    # review is NEITHER A PASS NOR A FAIL and must never move the exit code.
    d11 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d11, 'banks'))
    io.open(os.path.join(d11, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d11, 'digest.txt'), 'w').write(
        '# SECTION 1: the contactor (owned by Associate m01)\n'
        'the column loses 1.500000 psi across the bed\n'
        'the ratio runs 3.200000 gal per lb of water\n')
    coincidence = {'prompt': 'What is the circulation ratio?',
                   'options': ['1.500000', 'b', 'c', 'd'], 'answer': 0,
                   'explanation': 'The unit runs at 1.500000 gal per lb of water.'}
    json.dump([coincidence], io.open(os.path.join(d11, 'banks', 'zzb_m01.json'), 'w'))
    lines11 = io.open(os.path.join(d11, 'digest.txt'), encoding='utf-8').read().split('\n')
    secs11 = digest_sections(lines11)
    vocab11 = unit_vocabulary(lines11)
    row = review_resolve('zzb_m01 Q1 explanation', 'beginner', 'm01', '1.500000',
                         coincidence['explanation'], whole_number_hits('1.500000', lines11),
                         lines11, secs11, vocab11)
    assert row and row[1] == 'QUANTITY', f'a coincidental resolve was not flagged: {row}'
    print(f'[litsweep] K7 control FIRED: {row[2]!r} written as {row[3]!r} resolved against '
          f'digest line {row[4]} ({row[5]}), whose row reads: {row[7]}')
    found, checked = run(d11, quiet=True, strict_range=True)
    assert not found, f'a REVIEW moved the exit code, which it must never do: {found}'
    # POSITIVE CONTROL: the same literal quoted with the unit its row carries
    # must NOT be flagged, or every figure in every wave is a review.
    honest = dict(coincidence, explanation='The column loses 1.500000 psi across the bed.')
    row2 = review_resolve('zzb_m01 Q1 explanation', 'beginner', 'm01', '1.500000',
                          honest['explanation'], whole_number_hits('1.500000', lines11),
                          lines11, secs11, vocab11)
    assert row2 is None, f'a figure quoted with its own row\'s unit was flagged: {row2}'
    # and the word after a figure is only a unit when the DIGEST uses it as one
    assert unit_after('it costs 1.500000 cents each', '1.500000', vocab11) is None, \
        'a word the digest never uses as a unit was treated as a quantity claim'
    assert unit_after('the ratio runs 3.200000 gal per lb', '3.200000', vocab11) == 'gal', \
        'a real unit was not read off the sentence'

    # ------------------------------------------------------------------ K9
    # A ROUND LITERAL IN A MARKDOWN TABLE ROW BELONGED TO NEITHER GATE. This
    # file skipped every line starting with a pipe and numsweep will not look
    # below seven significant figures, so the majority of a course's figures,
    # which live in its tables, were checked by nothing at all.
    #
    # THE CONTROL DOES NOT MOVE THE CORPUS. One lesson tree, two rules: the
    # shipped rule must report the planted figure and the old skip-the-pipe
    # rule must report NOTHING on the same files, or the corpus cannot tell the
    # two apart.
    d12 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d12, 'banks'))
    io.open(os.path.join(d12, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d12, 'digest.txt'), 'w').write(
        '# SECTION 1: the ladder (owned by Associate m01)\n'
        '| letter | area in2 |\n'
        '| --- | --- |\n'
        '| G | 0.503000 |\n'
        '| H | 0.785000 |\n'
        '# SECTION 13: the blowdown (owned by Expert m01)\n'
        'the march ends at 1500.000000 lb/hr\n')
    ldir = os.path.join(d12, 'lessons', 'beginner', 'm01-the-ladder')
    os.makedirs(ldir)
    clean_md = ('# A ladder\n\nThe ladder is published.\n\n'
                '| letter | area in2 |\n| --- | --- |\n| G | 0.503000 |\n| H | 0.785000 |\n')
    io.open(os.path.join(ldir, 'l01-the-ladder.md'), 'w').write(clean_md)
    ok = {'prompt': 'Which orifice?', 'options': ['0.503000', 'b', 'c', 'd'], 'answer': 0,
          'explanation': 'It is 0.503000 in2.'}
    json.dump([ok], io.open(os.path.join(d12, 'banks', 'zzb_m01.json'), 'w'))
    found, checked = run(d12, quiet=True, lessons_dir=os.path.join(d12, 'lessons'))
    c9 = run.last_lesson_counts
    assert not found, f'a clean table was reported: {found}'
    assert c9['table_rows'] == 3 and c9['table'] == 2, \
        f'the table half did not examine the rows it must: {c9}'
    # NEGATIVE CONTROL ONE: an invented figure inside a table row.
    io.open(os.path.join(ldir, 'l01-the-ladder.md'), 'w').write(
        clean_md + '| J | 9.876543 |\n')
    found, _ = run(d12, quiet=True, lessons_dir=os.path.join(d12, 'lessons'))
    c9b = run.last_lesson_counts
    planted = [f for f in found if f[3] == '9.876543']
    assert planted and planted[0][2] == 'table', \
        f'an invented figure in a table row was not caught: {found}'
    print(f'[litsweep] K9 control FIRED: {planted[0][3]!r} in a TABLE ROW at '
          f'{planted[0][0]}:{planted[0][1]} is not in the digest; the sweep examined '
          f'{c9b["table_rows"]} table row(s) carrying {c9b["table"]} table literal(s) beside '
          f'{c9b["prose"]} in prose')
    # and the OLD rule, on the SAME files, must miss it
    old_hits = 0
    for line in io.open(os.path.join(ldir, 'l01-the-ladder.md'), encoding='utf-8'):
        if line.startswith('|') or line.startswith('{{panel'):
            continue
        old_hits += sum(1 for lit in literals(line) if lit == '9.876543')
    assert old_hits == 0, 'the corpus cannot tell the two rules apart'
    print('[litsweep] K9 control FIRED: the skip-the-pipe rule this replaced examined 0 of '
          f'the {c9b["table"]} table literal(s) and could not see it at all')
    # NEGATIVE CONTROL TWO, AND IT IS THE LIVE-DEFECT SHAPE: a beginner lesson
    # quoting an EXPERT-only figure inside a table row must REACH FORWARD.
    io.open(os.path.join(ldir, 'l01-the-ladder.md'), 'w').write(
        clean_md + '| march | 1500.000000 |\n')
    found, _ = run(d12, quiet=True, lessons_dir=os.path.join(d12, 'lessons'))
    fwd9 = [f for f in found if len(f) == 7 and f[4] == '1500.000000']
    assert fwd9 and fwd9[0][3] == 'table', \
        f'a FORWARD reach from a table row was not reported: {found}'
    print(f'[litsweep] K9 control FIRED: {fwd9[0][4]!r} in a TABLE ROW at {fwd9[0][0]}:'
          f'{fwd9[0][2]} reaches FORWARD ({fwd9[0][6]})')
    # POSITIVE CONTROL: the separator rows and a table of WORDS must not be
    # swept as figures, and a table with no digits in it must NOT refuse.
    io.open(os.path.join(ldir, 'l01-the-ladder.md'), 'w').write(
        '# A ladder\n\nThe ladder is published.\n\n'
        '| letter | what it is |\n| --- | --- |\n| G | the one below H |\n'
        'The areas are 0.503000 and 0.785000 in2.\n')
    found, _ = run(d12, quiet=True, lessons_dir=os.path.join(d12, 'lessons'))
    c9c = run.last_lesson_counts
    assert not found, f'a table of words was swept as figures: {found}'
    assert c9c['table_rows'] == 2 and c9c['table'] == 0 and c9c['prose'] == 2, \
        f'the word table or the prose beside it was miscounted: {c9c}'

    # ------------------------------------------------------------------ K10
    # THE LESSON SWEEP WAS UNREACHABLE THROUGH THE CLI ON A BANKLESS WAVE,
    # because the banks check refused before it was reached and EVERY
    # foundation-phase wave has lessons and no banks. The banks half must
    # refuse BY NAME without suppressing the half that can run.
    d13 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d13, 'banks'))
    io.open(os.path.join(d13, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d13, 'digest.txt'), 'w').write(
        '# SECTION 1: the ladder (owned by Associate m01)\n'
        'the G orifice is 0.503000 in2\n')
    l13 = os.path.join(d13, 'lessons', 'beginner', 'm01-the-ladder')
    os.makedirs(l13)
    io.open(os.path.join(l13, 'l01.md'), 'w').write(
        'The G orifice is 0.503000 in2.\n\n| letter | area in2 |\n| --- | --- |\n'
        '| G | 4.444444 |\n')
    try:
        run(d13, quiet=True, lessons_dir=os.path.join(d13, 'lessons'))
    except Refused as exc:
        c10 = run.last_lesson_counts
        assert 'no bank JSON' in str(exc), f'refused for the wrong reason: {exc}'
        assert c10 and c10['literals'] > 0 and c10['table'] > 0, \
            f'the lesson sweep did not run before the banks half refused: {c10}'
        assert c10['not_in_digest'] == 1, f'the planted table literal was missed: {c10}'
        print(f'[litsweep] K10 control FIRED: the banks half REFUSED BY NAME ("{str(exc)[:60]}...") '
              f'AFTER the lesson sweep had examined {c10["literals"]} literal(s) in '
              f'{c10["files"]} file(s), {c10["table"]} of them in {c10["table_rows"]} table '
              f'row(s), and reported {c10["not_in_digest"]} not in the digest')
    else:
        raise AssertionError('a bankless wave with lessons did not refuse for the banks half')
    # --lessons-only is the deliberate declaration, and it must return the
    # lesson verdict rather than a refusal.
    found, _ = run(d13, quiet=True, lessons_dir=os.path.join(d13, 'lessons'), lessons_only=True)
    assert [f[3] for f in found] == ['4.444444'], \
        f'--lessons-only did not return the lesson verdict: {found}'
    # and a bankless wave with NO lessons asked for still refuses, which is the
    # behaviour K3 established and this repair must not loosen.
    try:
        run(d13, quiet=True)
    except Refused as exc:
        assert 'no bank JSON' in str(exc)
    else:
        raise AssertionError('a wave with no banks and no lessons did not refuse')

    # an empty wave must refuse
    d2 = tempfile.mkdtemp()
    io.open(os.path.join(d2, 'wave.json'), 'w').write('{}')
    io.open(os.path.join(d2, 'digest.txt'), 'w').write(
        '# SECTION 1: nothing (owned by Associate m01)\nx\n')
    os.makedirs(os.path.join(d2, 'banks'))
    try:
        run(d2, quiet=True)
    except Refused:
        pass
    else:
        raise AssertionError('a wave with no banks did not refuse')

    # ------------------------------------------- OWNER DECISION 2026-09-21 (a)
    # THE ONWARD PREVIEW, BY ROLE. One digest, one Expert-only figure, and the
    # same beginner sentence quoting it from four lessons. Only the m06
    # signpost may reach forward; the same slug in m05, the capstone lesson
    # beside it in m06, and a figure the digest never prints all still fail.
    d14 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d14, 'banks'))
    io.open(os.path.join(d14, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d14, 'digest.txt'), 'w').write(
        '# SECTION 1: the ladder (owned by Associate m01)\n'
        'the G orifice is 0.503000 in2\n'
        '# SECTION 13: the blowdown (owned by Expert m01)\n'
        'the march ends at 1500.000000 lb/hr\n')
    preview = 'The next tier marches the blowdown to 1500.000000 lb/hr.\n'

    def lesson_tree(files):
        root = tempfile.mkdtemp(dir=d14)
        for rel, text in files.items():
            os.makedirs(os.path.dirname(os.path.join(root, rel)), exist_ok=True)
            io.open(os.path.join(root, rel), 'w').write(text)
        return root

    anchor_md = {'beginner/m01-the-ladder/l01.md': 'The G orifice is 0.503000 in2.\n'}
    for slug in sorted(ONWARD_PREVIEW_SLUGS):
        for tier in ('beginner', 'intermediate'):
            assert lesson_role(f'{tier}/m06-the-reading/l03-{slug}.md', tier) == 'onward-preview', slug
    assert lesson_role('advanced/m06-the-reading/l03-onward.md', 'advanced') == 'lesson', \
        'an Expert onward lesson has no next tier to preview'
    assert lesson_role('beginner/m05-the-reading/l03-onward.md', 'beginner') == 'lesson'
    assert lesson_role('beginner/m06-the-reading/l02-working-the-capstone.md', 'beginner') == 'lesson'
    assert lesson_role('beginner/m06-the-reading/l03-onward-bound.md', 'beginner') == 'lesson'
    # POSITIVE: the m06 onward preview quoting the Expert figure is exempt.
    root = lesson_tree(dict(anchor_md, **{'beginner/m06-the-reading/l03-onward.md': preview}))
    found, _ = run(d14, quiet=True, lessons_dir=root, lessons_only=True)
    c14 = run.last_lesson_counts
    assert not found and c14['onward_exempt'] == 1, \
        f'the m06 onward preview was not exempted by role: {found} {c14}'
    # NEGATIVE: the same sentence anywhere else still reaches forward.
    for rel in ('beginner/m05-the-reading/l03-onward.md',
                'beginner/m06-the-reading/l02-working-the-capstone.md'):
        root = lesson_tree(dict(anchor_md, **{rel: preview}))
        found, _ = run(d14, quiet=True, lessons_dir=root, lessons_only=True)
        assert any(len(f) == 7 and f[4] == '1500.000000' for f in found), \
            f'{rel} quoting an Expert-only figure was exempted: {found}'
    # NEGATIVE: an onward preview is not exempt from the digest itself.
    root = lesson_tree(dict(anchor_md, **{
        'beginner/m06-the-reading/l03-onward.md': 'The next tier reaches 1499.000000 lb/hr.\n'}))
    found, _ = run(d14, quiet=True, lessons_dir=root, lessons_only=True)
    assert [f[3] for f in found] == ['1499.000000'], \
        f'an invented figure in an onward preview passed: {found}'
    print('[litsweep] onward control FIRED: an m06 onward preview may reach forward, the '
          'same figure in m05 or in the m06 capstone lesson still fails, and so does a '
          'figure the digest never prints')

    # ------------------------------------------- OWNER DECISION 2026-09-21 (b)
    # A SIGN-FLIPPED DISTRACTOR resolves on its magnitude; a wrong magnitude,
    # a sign-flipped KEY and a sign-flipped explanation all still fail.
    d15 = tempfile.mkdtemp()
    os.makedirs(os.path.join(d15, 'banks'))
    io.open(os.path.join(d15, 'wave.json'), 'w').write(json.dumps({'prefix': 'zz', 'constants': {}}))
    io.open(os.path.join(d15, 'digest.txt'), 'w').write(
        '# SECTION 1: the calendar (owned by Associate m01)\n'
        'the review fell due 30 days ago; days until 45\n'
        '# SECTION 13: the late register (owned by Expert m01)\n'
        'the overdue count is 181 days\n')
    base = {'prompt': 'How far off is the review?', 'options': ['30 days ago', '-30', '45', 'none'],
            'answer': 0, 'explanation': 'It fell due 30 days ago.'}
    bank = os.path.join(d15, 'banks', 'zzb_m01.json')
    json.dump([base], io.open(bank, 'w'))
    found, checked = run(d15, quiet=True)
    assert checked > 0 and not found, f'a sign-flipped distractor was refused: {found}'
    assert [x[3] for x in run.last_sign_flips] == ['-30'], run.last_sign_flips
    for label, q in (
            ('a wrong magnitude', dict(base, options=['30 days ago', '-31', '45', 'none'])),
            ('a sign-flipped KEY', dict(base, options=['-45', '30', '45 days', 'none'])),
            ('a sign-flipped explanation', dict(base, explanation='It is -30 days out.')),
            ('a sign-flipped prompt', dict(base, prompt='Is -45 days right?'))):
        json.dump([q], io.open(bank, 'w'))
        found, _ = run(d15, quiet=True)
        assert found, f'{label} passed the gate'
    # and the magnitude still carries the TIER RANGE: an Associate distractor
    # whose magnitude lives only on an Expert page reaches forward.
    json.dump([dict(base, options=['30 days ago', '-181', '45', 'none'])], io.open(bank, 'w'))
    found, _ = run(d15, quiet=True)
    assert any(len(f) == 7 and f[4] == '-181' for f in found), \
        f'a sign-flipped distractor escaped the tier range: {found}'
    # and the case the B5 triage met on riskchange: the negative form is
    # printed only on a LATER page while the magnitude is printed in range.
    io.open(os.path.join(d15, 'digest.txt'), 'a').write('a late change reads -30 days\n')
    json.dump([base], io.open(bank, 'w'))
    found, _ = run(d15, quiet=True)
    assert not found, f'an in-range magnitude was overruled by a later signed printing: {found}'
    print('[litsweep] sign-flip control FIRED: a sign-flipped distractor resolves on the '
          'printed magnitude; a wrong magnitude, a flipped key, prompt or explanation and a '
          'forward-reaching magnitude all still fail')
    print('[litsweep] selftest OK')
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('wave_dir', nargs='?')
    ap.add_argument('--banks')
    ap.add_argument('--prefix')
    ap.add_argument('--lessons', help='also sweep lesson markdown under this directory')
    ap.add_argument('--lessons-only', action='store_true',
                    help='declare a bankless wave deliberately: the lesson sweep is the whole '
                         'run and a banks directory with no banks in it does not refuse')
    ap.add_argument('--strict-range', action='store_true',
                    help='make a backward reach into an earlier tier fail as well')
    ap.add_argument('--review-all', action='store_true',
                    help='print every resolve flagged for a human read, not the first 25')
    ap.add_argument('--selftest', action='store_true')
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    if not a.wave_dir:
        print('REFUSED: no wave_dir', file=sys.stderr)
        return 2
    try:
        if a.lessons_only and not a.lessons:
            print('REFUSED: --lessons-only needs --lessons <dir>. A run with nothing to sweep '
                  'is not a pass.', file=sys.stderr)
            return 2
        bad, _ = run(a.wave_dir, a.banks, a.prefix, strict_range=a.strict_range,
                     lessons_dir=a.lessons, review_all=a.review_all,
                     lessons_only=a.lessons_only)
    except Refused as exc:
        print(f'REFUSED: {exc}', file=sys.stderr)
        return 2
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
