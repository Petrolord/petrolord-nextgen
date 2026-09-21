#!/usr/bin/env python3
"""Generate the H1 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked three ways, and none of the three is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node h1_capstone.mjs --json`
   through the vendored engines/hse/safetyStats.js when this file is generated,
   and refuses unless fields.json carries exactly what that run returned. The
   values the go-live compares the seeded rows to are THAT RUN'S, emitted to
   the last bit, so a capstone row an earlier seed left behind (the course
   migration inserts with `on conflict do nothing`) is refused here by name,
   and so is a move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL, over the inputs the learner is handed. Every
   graded value is recomputed by Postgres with no engine code at all: the rates
   and the rolling window by sum then divide; the u-chart centre, limits and
   revised centre from exposure units, with the signalling months found by
   Postgres from the strict rule; and the ten quantities the engine finds by a
   quantile or a bisection (the Garwood limits, the zero-event limit, the
   rate-ratio limits) asserted BY THE EQUATION THEY ARE A ROOT OF, a Poisson
   or binomial tail summed term by term in SQL that must land on 0.025. The
   three p-values are the central convention, twice the smaller binomial tail,
   summed the same way. It is an oracle in a second language, and the dry run
   is what proves it agrees with the engine on these inputs.

   AND THE INPUTS IT READS ARE THE INPUTS THE LEARNER READS. Each shipped prompt
   must be the prompt gen_course.py rendered from the engine's own inputs, byte
   for byte (md5), and every month the second route sums must be stated in its
   prompt as `month n, count in hours`.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these inputs. For
   every one of the eighteen fields the go-live computes readings a learner who
   missed the lesson would give, each one a wrong method discriminate.mjs
   already swept with the ENGINE (the mean of rates, the wrong base, the fatality
   counted twice, the calendar-year window, the normal approximation, the rule
   of three, the Wald interval, the groups swapped, the minlike p-value, one
   tail not doubled, equal hours assumed, two-sigma limits, limits from the
   average exposure, the centre as the mean of u, the limit floored by habit,
   the chart not revised, the short month dropped instead, month six left in or
   its events dropped with its hours kept), and refuses unless each one misses
   the graded value by more than the field's own tolerance.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field no refusal names; a division with a bare integer
denominator; an unclosed literal; an em or en dash; a go-live whose engine run
and fields.json disagree (gen_course.py refuses that first); a second route or
a trap that does not first pass, or fail, in the Python mirror below.

Usage: python3 gen_golive.py
   H1_WAVE        the wave directory (default /root/hse-wip-safetystats)
   H1_REPO        the nextgen clone   (default /root/wt-h1-nextgen)
   H1_ENGINES     packages/engines to run the capstone through
   H1_TOLERANCE   gradedTolerance.js
   H1_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   H1_GOLIVE_OUT  where to write
"""
import hashlib
import math
import os
import re
import sys

W = os.environ.get('H1_WAVE', '/root/hse-wip-safetystats')
REPO = os.environ.get('H1_REPO', '/root/wt-h1-nextgen')
COURSE = os.environ.get('H1_COURSE_SQL', f'{REPO}/migrations/20261003_h1_safetystats_course.sql')
OUT = os.environ.get('H1_GOLIVE_OUT', f'{REPO}/migrations/20261003_h1_safetystats_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['H1_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
O, B, FC = GC.O, GC.B, GC.FC
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')

B2, B6, B8 = 200000.0, 1000000.0, 100000000.0
PRINTED_DP = {GC.precision[c]['decimals'] for c in GC.precision}
if PRINTED_DP != {6}:
    refused.append(f'the precision classes print to {sorted(PRINTED_DP)} decimals; this go-live grades six')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] != TOL6:
        refused.append(f'{k} is graded at {TOL[k]}, and every H1 field is graded at the six-decimal floor {TOL6}')


def f17(x):
    """A float literal SQL will read back as this exact double."""
    return repr(float(x)) + '::double precision'


def lit(s):
    return "'" + s.replace("'", "''") + "'"


V = {k: f'v_g_{k}' for k in KEYS}


def name(*keys):
    """The graded fields a refusal reads, spelled tier/key."""
    for k in keys:
        assert k in V, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


# ---------------------------------------------------------------------------
# THE SECOND ROUTE, WRITTEN TWICE: once as SQL text and once as Python over the
# same inputs, so a route that cannot pass is found here and never written.
# ---------------------------------------------------------------------------
def lnfact_sql(n):
    return f'(select coalesce(sum(ln(g::double precision)), 0) from generate_series(1, {n}) g)'


def pois_le_sql(k, mu):
    """P(X <= k) for a Poisson count model of mean mu, summed term by term."""
    return (f'(select sum(exp(-({mu}) + j * ln({mu}) - {lnfact_sql("j")})) '
            f'from generate_series(0, {k}) j)')


def binpmf_sql(n, j, p):
    return (f'exp({lnfact_sql(n)} - {lnfact_sql(j)} - {lnfact_sql(f"{n} - {j}")}'
            f' + {j} * ln({p}) + ({n} - {j}) * ln(1.0 - ({p})))')


def bin_le_sql(n, k, p):
    return f'(select sum({binpmf_sql(n, "j", p)}) from generate_series(0, {k}) j)'


def bin_ge_sql(n, k, p):
    return f'(select sum({binpmf_sql(n, "j", p)}) from generate_series({k}, {n}) j)'


def central_sql(c1, h1, c2, h2):
    p0 = f'(({h1}) / (({h1}) + ({h2})))'
    n = f'({c1} + {c2})'
    return f'least(1.0, 2.0 * least({bin_le_sql(n, c1, p0)}, {bin_ge_sql(n, c1, p0)}))'


def minlike_sql(c1, h1, c2, h2):
    p0 = f'(({h1}) / (({h1}) + ({h2})))'
    n = f'({c1} + {c2})'
    return (f'least(1.0, (select sum(t.q) from (select {binpmf_sql(n, "j", p0)} q '
            f'from generate_series(0, {n}) j) t where t.q <= {binpmf_sql(n, c1, p0)} * (1.0 + 1e-7)))')


def one_tail_sql(c1, h1, c2, h2):
    p0 = f'(({h1}) / (({h1}) + ({h2})))'
    n = f'({c1} + {c2})'
    return f'least({bin_le_sql(n, c1, p0)}, {bin_ge_sql(n, c1, p0)})'


# The Python mirror, with nothing borrowed from the engine.
def lnfact(n):
    return sum(math.log(g) for g in range(1, n + 1))


def pois_le(k, mu):
    return sum(math.exp(-mu + j * math.log(mu) - lnfact(j)) for j in range(k + 1))


def binpmf(n, j, p):
    return math.exp(lnfact(n) - lnfact(j) - lnfact(n - j) + j * math.log(p) + (n - j) * math.log(1.0 - p))


def bin_le(n, k, p):
    return sum(binpmf(n, j, p) for j in range(k + 1))


def bin_ge(n, k, p):
    return sum(binpmf(n, j, p) for j in range(k, n + 1))


def central(c1, h1, c2, h2):
    p0 = h1 / (h1 + h2)
    return min(1.0, 2.0 * min(bin_le(c1 + c2, c1, p0), bin_ge(c1 + c2, c1, p0)))


def minlike(c1, h1, c2, h2):
    p0, n = h1 / (h1 + h2), c1 + c2
    d = binpmf(n, c1, p0)
    return min(1.0, sum(q for q in (binpmf(n, j, p0) for j in range(n + 1)) if q <= d * (1.0 + 1e-7)))


def one_tail(c1, h1, c2, h2):
    p0 = h1 / (h1 + h2)
    return min(bin_le(c1 + c2, c1, p0), bin_ge(c1 + c2, c1, p0))


checks = []


def same(what, a, b, eps):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a!r} against {b!r}, difference {abs(a - b)} exceeds {eps}')


# ------------------------------------------------ the inputs, as Python sums
okH = O['employeeHours'] + O['contractorHours']
okR = O['employeeRecordables'] + O['contractorRecordables']
okc, okh = O['monthlyRecordables'], O['monthlyHours']
fcc, fch = FC['monthlyRecordables'], FC['monthlyHours']
okh_total = float(sum(okh[:12]))
if sum(okh[:12]) != okH or sum(okc[:12]) != okR:
    refused.append('OKRIKA months 1 to 12 do not sum to the annual report, so the prompt contradicts itself')
units = [h / B2 for h in fch]
ubar = sum(fcc) / sum(units)
lims = [(ubar - 3.0 * math.sqrt(ubar / u), ubar + 3.0 * math.sqrt(ubar / u)) for u in units]
flagged = [n for n, (c, u, (lo, hi)) in enumerate(zip(fcc, units, lims)) if c / u > hi or c / u < max(0.0, lo)]
if flagged != [5]:
    refused.append(f'the Python mirror flags months {[n + 1 for n in flagged]} and the prompt is built on month 6 alone')
kept = [n for n in range(12) if n not in flagged]
aft = (sum(fcc[6:]), float(sum(fch[6:])))
bef = (sum(fcc[:6]), float(sum(fch[:6])))
befo = (sum(fcc[n] for n in range(6) if n not in flagged), float(sum(fch[n] for n in range(6) if n not in flagged)))
aH, bH, cH = float(B['alphaHours']), float(B['betaHours']), float(B['crewHours'])
nA, nB = B['alphaRecordables'], B['betaRecordables']
CONF = B['confidence']
if CONF != 0.95 or FC['confidence'] != 0.95:
    refused.append('the second route solves at 0.025 in each tail, and a capstone runs at another confidence')
Q = (1.0 - CONF) / 2.0


def x_of(r):
    """The conditional proportion a rate ratio r stands for: the engine's
    toRatio(p) = p / (1 - p) x hours2 / hours1, inverted."""
    x = r * aH / bH
    return x / (1.0 + x)


# The second route in Python, checked at the SAME eps the SQL will use.
EPS_RATE, EPS_TAIL, EPS_P = 1e-12, 1e-12, 1e-11
same('OKRIKA pooled recordable rate', okR * B2 / okH, F['okrika_combined_trir_per_200k'], EPS_RATE)
same('OKRIKA lost time rate', O['lostTimeInjuries'] * B6 / okH, F['okrika_combined_ltir_per_1m'], EPS_RATE)
same('OKRIKA observed FAR', O['fatalities'] * B8 / okH, F['okrika_far_per_100m'], EPS_RATE * 10)
same('OKRIKA severity rate', O['daysLost'] * B2 / okH, F['okrika_severity_rate_per_200k'], EPS_RATE)
same('OKRIKA Tier 1 rate', O['tier1Pse'] * B2 / okH, F['okrika_tier1_pse_rate_per_200k'], EPS_RATE)
same('OKRIKA rolling window 3 to 14', sum(okc[2:14]) * B2 / sum(okh[2:14]),
     F['okrika_rolling12_trir_month14_per_200k'], EPS_RATE)
same('BONNY lower limit, a root of the upper Poisson tail',
     1.0 - pois_le(nA - 1, F['bonny_alpha_trir_lower95_per_200k'] * aH / B2), Q, EPS_TAIL)
same('BONNY upper limit, a root of the lower Poisson tail',
     pois_le(nA, F['bonny_alpha_trir_upper95_per_200k'] * aH / B2), Q, EPS_TAIL)
same('BONNY zero-event limit, a root of exp(-mu)',
     math.exp(-F['bonny_crew_zero_event_upper95_per_200k'] * cH / B2), Q, EPS_TAIL)
same('BONNY rate-ratio lower limit, a root of the upper binomial tail',
     bin_ge(nA + nB, nA, x_of(F['bonny_rate_ratio_lower95'])), Q, EPS_TAIL)
same('BONNY rate-ratio upper limit, a root of the lower binomial tail',
     bin_le(nA + nB, nA, x_of(F['bonny_rate_ratio_upper95'])), Q, EPS_TAIL)
same('BONNY central p-value', central(nA, aH, nB, bH), F['bonny_compare_p_value'], EPS_P)
same('FORCADOS centre', ubar, F['forcados_centre_per_200k'], EPS_RATE)
same('FORCADOS UCL month 9', ubar + 3.0 * math.sqrt(ubar / units[8]), F['forcados_ucl_month09_per_200k'], EPS_RATE * 10)
same('FORCADOS LCL month 7', ubar - 3.0 * math.sqrt(ubar / units[6]), F['forcados_lcl_month07_per_200k'], EPS_RATE)
same('FORCADOS revised centre', sum(fcc[n] for n in kept) / sum(units[n] for n in kept),
     F['forcados_revised_centre_per_200k'], EPS_RATE)
same('FORCADOS before and after', central(*aft, *bef), F['forcados_before_after_p_value'], EPS_P)
same('FORCADOS before and after without month 6', central(*aft, *befo),
     F['forcados_before_after_p_value_without_month06'], EPS_P)

# THE ROOT CHECKS MUST BE ABLE TO SEE A MOVE OF ONE PART IN 1e7: a root check
# whose tail barely moves when the root does would pass the negative control
# by blindness. Each is measured here and must move by 100 times its eps.
for what, fn, k in (
        ('lower limit', lambda v: 1.0 - pois_le(nA - 1, v * aH / B2), 'bonny_alpha_trir_lower95_per_200k'),
        ('upper limit', lambda v: pois_le(nA, v * aH / B2), 'bonny_alpha_trir_upper95_per_200k'),
        ('zero-event limit', lambda v: math.exp(-v * cH / B2), 'bonny_crew_zero_event_upper95_per_200k'),
        ('rate-ratio lower', lambda v: bin_ge(nA + nB, nA, x_of(v)), 'bonny_rate_ratio_lower95'),
        ('rate-ratio upper', lambda v: bin_le(nA + nB, nA, x_of(v)), 'bonny_rate_ratio_upper95')):
    move = abs(fn(F[k] * 1.0000001) - fn(F[k]))
    checks.append((f'a 1e-7 move of the {what} moves its tail by {move:.3e}', 0.0, 0.0))
    if move < 100 * EPS_TAIL:
        refused.append(f'the {what} root check moves only {move} for a 1e-7 move, under 100 times its eps')

# ------------------------------------------------------- the traps, in Python
Z = 1.959963984540054
scaleA, scaleZ = B2 / aH, B2 / cH
meanU = sum(c / u for c, u in zip(fcc, units)) / 12.0
nbar = sum(units) / 12.0
TRAPS_PY = {
    'okrika_combined_trir_per_200k': [
        ('the mean of the two workforce rates', (O['employeeRecordables'] * B2 / O['employeeHours'] + O['contractorRecordables'] * B2 / O['contractorHours']) / 2.0),
        ('the IOGP 1,000,000 hour base', okR * B6 / okH),
        ('the fatality counted a second time', (okR + O['fatalities']) * B2 / okH)],
    'okrika_combined_ltir_per_1m': [
        ('the 200,000 hour base', O['lostTimeInjuries'] * B2 / okH),
        ('the recordable cases counted', okR * B6 / okH),
        ('the fatality added again', (O['lostTimeInjuries'] + O['fatalities']) * B6 / okH)],
    'okrika_far_per_100m': [
        ('the 1,000,000 hour base', O['fatalities'] * B6 / okH),
        ('the 200,000 hour base', O['fatalities'] * B2 / okH),
        ('the lost time count used', O['lostTimeInjuries'] * B8 / okH)],
    'okrika_severity_rate_per_200k': [
        ('days per lost time case', O['daysLost'] / O['lostTimeInjuries']),
        ('the 1,000,000 hour base', O['daysLost'] * B6 / okH),
        ('days per recordable case', O['daysLost'] / okR)],
    'okrika_tier1_pse_rate_per_200k': [
        ('the 1,000,000 hour base', O['tier1Pse'] * B6 / okH),
        ('Tier 1 and Tier 2 counted together', (O['tier1Pse'] + O['tier2Pse']) * B2 / okH),
        ('the Tier 2 count used', O['tier2Pse'] * B2 / okH)],
    'okrika_rolling12_trir_month14_per_200k': [
        ('the calendar-year window', sum(okc[0:12]) * B2 / sum(okh[0:12])),
        ('the window ending at month 13', sum(okc[1:13]) * B2 / sum(okh[1:13])),
        ('the mean of the monthly rates in the window', sum(c * B2 / h for c, h in zip(okc[2:14], okh[2:14])) / 12.0)],
    'bonny_alpha_trir_lower95_per_200k': [
        ('the normal approximation', (nA - Z * math.sqrt(nA)) * scaleA),
        ('the point estimate quoted as the limit', nA * scaleA),
        ('the 1,000,000 hour base', F['bonny_alpha_trir_lower95_per_200k'] * B6 / B2)],
    'bonny_alpha_trir_upper95_per_200k': [
        ('the normal approximation', (nA + Z * math.sqrt(nA)) * scaleA),
        ('the point estimate quoted as the limit', nA * scaleA),
        ('the 1,000,000 hour base', F['bonny_alpha_trir_upper95_per_200k'] * B6 / B2)],
    'bonny_crew_zero_event_upper95_per_200k': [
        ('the rule of three', 3.0 * scaleZ),
        ('the point estimate of zero quoted', 0.0),
        ('the 1,000,000 hour base', F['bonny_crew_zero_event_upper95_per_200k'] * B6 / B2)],
    'bonny_rate_ratio_lower95': [
        ('the Wald interval on the log ratio', (nA / aH) / (nB / bH) * math.exp(-Z * math.sqrt(1.0 / nA + 1.0 / nB))),
        ('the groups swapped', 1.0 / F['bonny_rate_ratio_upper95']),
        ('the hours ratio ignored', F['bonny_rate_ratio_lower95'] * aH / bH)],
    'bonny_rate_ratio_upper95': [
        ('the Wald interval on the log ratio', (nA / aH) / (nB / bH) * math.exp(Z * math.sqrt(1.0 / nA + 1.0 / nB))),
        ('the groups swapped', 1.0 / F['bonny_rate_ratio_lower95']),
        ('the hours ratio ignored', F['bonny_rate_ratio_upper95'] * aH / bH)],
    'bonny_compare_p_value': [
        ('the minlike convention of R and scipy', minlike(nA, aH, nB, bH)),
        ('one tail not doubled', one_tail(nA, aH, nB, bH)),
        ('equal hours assumed', central(nA, 1.0, nB, 1.0))],
    'forcados_centre_per_200k': [
        ('the mean of the monthly u', meanU),
        ('recordable cases per month', sum(fcc) / 12.0),
        ('the 1,000,000 hour base', sum(fcc) * B6 / sum(fch))],
    'forcados_ucl_month09_per_200k': [
        ('two-sigma limits', ubar + 2.0 * math.sqrt(ubar / units[8])),
        ('limits from the average exposure', ubar + 3.0 * math.sqrt(ubar / nbar)),
        ('the centre taken as the mean of u', meanU + 3.0 * math.sqrt(meanU / units[8])),
        ('hours not converted to units', ubar + 3.0 * math.sqrt(ubar / fch[8]))],
    'forcados_lcl_month07_per_200k': [
        ('two-sigma limits', ubar - 2.0 * math.sqrt(ubar / units[6])),
        ('limits from the average exposure', ubar - 3.0 * math.sqrt(ubar / nbar)),
        ('the centre taken as the mean of u', meanU - 3.0 * math.sqrt(meanU / units[6])),
        ('a lower limit floored by habit', 0.0)],
    'forcados_revised_centre_per_200k': [
        ('the chart not revised', ubar),
        ('the mean of the kept monthly u', sum(fcc[n] / units[n] for n in kept) / len(kept)),
        ('the events dropped and the hours kept', sum(fcc[n] for n in kept) / sum(units)),
        ('the short month dropped instead', sum(fcc[n] for n in range(12) if n != 8) / sum(units[n] for n in range(12) if n != 8))],
    'forcados_before_after_p_value': [
        ('the minlike convention of R and scipy', minlike(*aft, *bef)),
        ('one tail not doubled', one_tail(*aft, *bef)),
        ('equal hours assumed', central(aft[0], 1.0, bef[0], 1.0)),
        ('the signalling month removed', central(*aft, *befo))],
    'forcados_before_after_p_value_without_month06': [
        ('the signalling month left in', central(*aft, *bef)),
        ('its events dropped and its hours kept', central(aft[0], aft[1], befo[0], bef[1])),
        ('the minlike convention of R and scipy', minlike(*aft, *befo)),
        ('one tail not doubled', one_tail(*aft, *befo))],
}
if set(TRAPS_PY) != set(KEYS):
    refused.append('the traps do not cover every graded field')
for k, traps in TRAPS_PY.items():
    if len(traps) < 3:
        refused.append(f'{k} has {len(traps)} traps; three is the floor discriminate.mjs holds every route to')
    for why, wrong in traps:
        if abs(wrong - F[k]) <= TOL[k]:
            refused.append(f'{k}: {why} gives {wrong}, within the tolerance of the graded {F[k]}, so the trap does not bite')

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- H1 GO-LIVE (HELD): Safety Performance Statistics & KPIs flips to
-- 'available', the FIRST course of the HSE module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/safetystats. The 78 lessons, the teaching lab
-- (safetystatsLab.js) and its three explorer panels (rates, intervals and the
-- u-chart) ship in the ZIP and NOT in this database, so a flip before the
-- upload puts a live catalogue tile in front of a route that does not exist.
-- This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h1_capstone.mjs returned through
--      the vendored engines/hse/safetyStats.js when this file was generated,
--      to the last bit, so a capstone row an earlier seed left behind, or a
--      move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and states every month it sums, then recomputes the rates, the
--      rolling window and the u-chart by sum then divide, finds the signalling
--      month itself, and asserts the Garwood, zero-event and rate-ratio limits
--      BY THE EQUATION THEY ARE A ROOT OF (a Poisson or binomial tail summed in
--      SQL landing on 0.025) and the three p-values as twice the smaller tail;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a positive, non-whole expected value at the six-decimal floor 5e-7
-- with a label and a unit, the six-decimal answer the prompt asks for must
-- pass, and one unit either side of it in the sixth decimal must fail. All of
-- it is asserted here, on the rows as seeded.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses to emit a bare integer
-- denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

BODY = []
A = BODY.append
A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int;')
A('  v_names text; v_prompt text; v_x double precision; v_wrong double precision;')
A('  v_ubar double precision; v_units double precision[];')
A('  v_flagged int[]; v_kept int[];')
for k in KEYS:
    A(f'  {V[k]} double precision; v_s_{k} double precision;')
A(f"  v_ok_c int[] := array[{', '.join(str(int(c)) for c in okc)}];")
A(f"  v_ok_h double precision[] := array[{', '.join(repr(float(h)) for h in okh)}];")
A(f"  v_fc_c int[] := array[{', '.join(str(int(c)) for c in fcc)}];")
A(f"  v_fc_h double precision[] := array[{', '.join(repr(float(h)) for h in fch)}];")
A('begin')

A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'H1 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'H1 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'H1 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'H1 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_n from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = '{SLUG}' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'H1 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'H1 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'H1 go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'H1 go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at the six-decimal floor, with a
  -- label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric <> 0.0000005
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to six decimals, must pass abs(answer - expected) <= tol
  -- in numeric exactly as academy_submit_capstone computes it, and one unit in
  -- the sixth decimal either side of it must fail.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
PROMPT_BLOCKS = []
for tier, obj in (('beginner', O), ('intermediate', B), ('advanced', FC)):
    md5 = hashlib.md5(GC.PROMPTS[tier].encode('utf-8')).hexdigest()
    lines_ = []
    if 'monthlyHours' in obj:
        cs, hs = obj['monthlyRecordables'], obj['monthlyHours']
        for n, (c, h) in enumerate(zip(cs, hs), 1):
            if n == 1:
                s_ = f'month 1, {c} recordable {"case" if c == 1 else "cases"} in {h} hours; '
            else:
                s_ = f'; month {n}, {c} in {h}' + ('.' if n == len(hs) else ';')
            if s_ not in GC.PROMPTS[tier]:
                refused.append(f'{tier}: the month line {s_!r} is not in the rendered prompt')
            lines_.append(s_)
    PROMPT_BLOCKS.append(f'''
  -- {tier}: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if md5(v_prompt) <> '{md5}' then
    raise exception 'H1 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}'
                    and cert_tier = {lit(GC.TIER[tier][0])} and dataset = {lit(GC.TIER[tier][1])} and title = {lit(GC.TIER[tier][2])}) then
    raise exception 'H1 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;''')
    if lines_:
        arr = ', '.join(lit(x) for x in lines_)
        PROMPT_BLOCKS.append(f'''  -- Every month the second route sums is stated, count paired with hours,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array[{arr}]) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % {tier} month(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;''')
A('\n  -- ---------------------------------------- the prompts the learner reads')
for b in PROMPT_BLOCKS:
    A(b)

# ------------------------------------------------ load the eighteen values
A('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A(f"""  select (f->>'expected')::double precision into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A(f"    raise exception 'H1 go-live refused: one or more of the eighteen graded fields is missing{name(*KEYS)}';")
A('  end if;')

DIGEST_NUMS = GC.DIGEST_NUMS
A(f'''
  -- ---------------------------------------------------- the collision sweeps
  -- PROMPTLEAK, IN SQL. No number in any prompt, dataset, title or label of
  -- this course, thousands separators stripped, lands within a graded field's
  -- tolerance of a graded value of ANY tier. A different tier is a leak and the
  -- same tier a transcription; both are refused.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone text', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(p.prompt || ' ' || p.dataset || ' ' || p.title || ' '
                   || (select string_agg((pf->>'label') || ' ' || (pf->>'unit'), ' ') from jsonb_array_elements(p.fields) pf),
                   ',', ''),
           '([0-9]+(\\.[0-9]+)?)', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision - (m[1])::double precision) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner at
  -- least 100 numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '([0-9]+(\\.[0-9]+)?)', 'g') m
   where p.app_slug = '{SLUG}';
  if v_n < 100 then
    raise exception 'H1 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
  end if;

  -- PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e, (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(a.e - b.e) <= greatest(a.t, b.t);
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
  end if;

  -- EVERY NUMBER THE TEACHING DIGEST PRINTS ({len(DIGEST_NUMS)} of them), at each
  -- field's SHIPPED tolerance. A graded value on one of them is a lookup.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[{', '.join(repr(float(d)) for d in DIGEST_NUMS)}]::double precision[]) pub
   where c.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision - pub) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H1 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine ledger
A('\n  -- ------------------------------------------ 1. against the engine ledger')
A('  -- The values h1_capstone.mjs returned through the vendored engine, to the')
A('  -- last bit. A seeded value that is not the engine\'s is refused by name.')
for k in KEYS:
    A(f'''  if {V[k]} <> {f17(ENGINE[k])} then
    raise exception 'H1 go-live refused: the seeded value % is not the {ENGINE[k]!r} the engine returned{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
OK_SUM = lambda a, b, col: f'(select sum({col}[g]) from generate_series({a}, {b}) g)'  # noqa: E731
okH_sql = f'({float(O["employeeHours"])!r} + {float(O["contractorHours"])!r})'
POIS_L = pois_le_sql(nA - 1, f"{V['bonny_alpha_trir_lower95_per_200k']} * {aH!r} / {B2!r}")
POIS_U = pois_le_sql(nA, f"{V['bonny_alpha_trir_upper95_per_200k']} * {aH!r} / {B2!r}")


ANNUAL = [
    ('okrika_combined_trir_per_200k', okR, B2, EPS_RATE, 'the recordable cases of both workforces'),
    ('okrika_combined_ltir_per_1m', O['lostTimeInjuries'], B6, EPS_RATE, 'the lost time injuries'),
    ('okrika_far_per_100m', O['fatalities'], B8, EPS_RATE * 10, 'the fatality'),
    ('okrika_severity_rate_per_200k', O['daysLost'], B2, EPS_RATE, 'the days lost'),
    ('okrika_tier1_pse_rate_per_200k', O['tier1Pse'], B2, EPS_RATE, 'the Tier 1 process safety events'),
]
OKRIKA_RATES = ''.join(
    f"""  v_x := {n} * {base!r} / {okH_sql};
  if abs({V[k]} - v_x) > {eps!r} then
    raise exception 'H1 go-live refused: the rate of {what} over the hours of both workforces is % on the {int(base)} hour base, against the seeded %{name(k)}', v_x, {V[k]};
  end if;
""" for k, n, base, eps, what in ANNUAL)


def xr(var):
    return f'(({var} * {aH!r} / {bH!r}) / (1.0 + {var} * {aH!r} / {bH!r}))'


A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, OKRIKA. Every rate is a count times its base over the hours of
  -- both workforces; the rolling window ending at month 14 is months 3 to 14,
  -- summed and then divided.
{OKRIKA_RATES}  if {OK_SUM(1, 12, 'v_ok_h')} <> {okh_total!r} or {OK_SUM(1, 12, 'v_ok_c')} <> {okR} then
    raise exception 'H1 go-live refused: OKRIKA months 1 to 12 do not sum to the annual report the prompt states';
  end if;
  v_s_okrika_rolling12_trir_month14_per_200k := {OK_SUM(3, 14, 'v_ok_c')} * {B2!r} / {OK_SUM(3, 14, 'v_ok_h')};
  if abs(v_s_okrika_rolling12_trir_month14_per_200k - {V['okrika_rolling12_trir_month14_per_200k']}) > {EPS_RATE!r} then
    raise exception 'H1 go-live refused: the second route in SQL gives % for the window of months 3 to 14, against the seeded %{name('okrika_rolling12_trir_month14_per_200k')}', v_s_okrika_rolling12_trir_month14_per_200k, {V['okrika_rolling12_trir_month14_per_200k']};
  end if;

  -- PROFESSIONAL, BONNY. The Garwood limits are the roots of the two Poisson
  -- tails at 0.025: at the lower limit's mean the chance of {nA} or more is
  -- 0.025, and at the upper limit's mean the chance of {nA} or fewer is 0.025.
  -- The zero-event limit's mean is where exp(-mu) is 0.025. The rate-ratio
  -- limits stand for conditional proportions p = x / (1 + x), x = ratio times
  -- Alpha's hours over Beta's, and are the roots of the two binomial tails of
  -- {nA} in {nA + nB}. Each tail is summed term by term here.
  v_x := 1.0 - {POIS_L};
  if abs(v_x - {Q!r}) > {EPS_TAIL!r} then
    raise exception 'H1 go-live refused: at the seeded lower limit % the chance of {nA} or more is %, and a Garwood lower limit makes it 0.025{name('bonny_alpha_trir_lower95_per_200k')}', {V['bonny_alpha_trir_lower95_per_200k']}, v_x;
  end if;
  v_x := {POIS_U};
  if abs(v_x - {Q!r}) > {EPS_TAIL!r} then
    raise exception 'H1 go-live refused: at the seeded upper limit % the chance of {nA} or fewer is %, and a Garwood upper limit makes it 0.025{name('bonny_alpha_trir_upper95_per_200k')}', {V['bonny_alpha_trir_upper95_per_200k']}, v_x;
  end if;
  v_x := exp(-{V['bonny_crew_zero_event_upper95_per_200k']} * {cH!r} / {B2!r});
  if abs(v_x - {Q!r}) > {EPS_TAIL!r} then
    raise exception 'H1 go-live refused: at the seeded zero-event limit % the chance of no event is %, and the limit makes it 0.025{name('bonny_crew_zero_event_upper95_per_200k')}', {V['bonny_crew_zero_event_upper95_per_200k']}, v_x;
  end if;
  v_x := {bin_ge_sql(nA + nB, nA, xr(V['bonny_rate_ratio_lower95']))};
  if abs(v_x - {Q!r}) > {EPS_TAIL!r} then
    raise exception 'H1 go-live refused: the seeded rate-ratio lower limit % leaves an upper binomial tail of %, and a Clopper-Pearson limit leaves 0.025{name('bonny_rate_ratio_lower95')}', {V['bonny_rate_ratio_lower95']}, v_x;
  end if;
  v_x := {bin_le_sql(nA + nB, nA, xr(V['bonny_rate_ratio_upper95']))};
  if abs(v_x - {Q!r}) > {EPS_TAIL!r} then
    raise exception 'H1 go-live refused: the seeded rate-ratio upper limit % leaves a lower binomial tail of %, and a Clopper-Pearson limit leaves 0.025{name('bonny_rate_ratio_upper95')}', {V['bonny_rate_ratio_upper95']}, v_x;
  end if;
  v_s_bonny_compare_p_value := {central_sql(nA, repr(aH), nB, repr(bH))};
  if abs(v_s_bonny_compare_p_value - {V['bonny_compare_p_value']}) > {EPS_P!r} then
    raise exception 'H1 go-live refused: twice the smaller binomial tail gives %, against the seeded %{name('bonny_compare_p_value')}', v_s_bonny_compare_p_value, {V['bonny_compare_p_value']};
  end if;
  -- The tier's point, on these inputs: the central p-value sits above 0.05 and
  -- the engine's own rate-ratio interval contains 1, so the two agree.
  if not ({V['bonny_compare_p_value']} > 0.05 and {V['bonny_rate_ratio_lower95']} < 1.0 and {V['bonny_rate_ratio_upper95']} > 1.0) then
    raise exception 'H1 go-live refused: the p-value % and the ratio interval % to % do not agree about 1{name('bonny_compare_p_value', 'bonny_rate_ratio_lower95', 'bonny_rate_ratio_upper95')}', {V['bonny_compare_p_value']}, {V['bonny_rate_ratio_lower95']}, {V['bonny_rate_ratio_upper95']};
  end if;

  -- EXPERT, FORCADOS. Exposure units are hours over 200,000; the centre is the
  -- pooled count over the pooled units; limits are the centre plus and minus
  -- three root(centre over units), the lower floored at zero; a month signals
  -- only STRICTLY outside. Postgres finds the signalling months itself, and the
  -- revised centre and the second p-value leave out exactly those months.
  select array_agg(v_fc_h[g] / {B2!r} order by g) into v_units from generate_series(1, 12) g;
  select sum(v_fc_c[g]) / sum(v_units[g]) into v_ubar from generate_series(1, 12) g;
  select coalesce(array_agg(g order by g), '{{}}') into v_flagged from generate_series(1, 12) g
   where v_fc_c[g] / v_units[g] > v_ubar + 3.0 * sqrt(v_ubar / v_units[g])
      or v_fc_c[g] / v_units[g] < greatest(0.0, v_ubar - 3.0 * sqrt(v_ubar / v_units[g]));
  if v_flagged <> array[6] then
    raise exception 'H1 go-live refused: the second route finds the chart signalling on months %, and the Expert capstone is built on month 6 alone', v_flagged;
  end if;
  select array_agg(g order by g) into v_kept from generate_series(1, 12) g where g <> all (v_flagged);
  if abs(v_ubar - {V['forcados_centre_per_200k']}) > {EPS_RATE!r} then
    raise exception 'H1 go-live refused: the pooled centre is %, against the seeded %{name('forcados_centre_per_200k')}', v_ubar, {V['forcados_centre_per_200k']};
  end if;
  v_x := v_ubar + 3.0 * sqrt(v_ubar / v_units[9]);
  if abs(v_x - {V['forcados_ucl_month09_per_200k']}) > {EPS_RATE * 10!r} then
    raise exception 'H1 go-live refused: the month 9 upper limit is %, against the seeded %{name('forcados_ucl_month09_per_200k')}', v_x, {V['forcados_ucl_month09_per_200k']};
  end if;
  if not (v_ubar - 3.0 * sqrt(v_ubar / v_units[9]) < 0.0) then
    raise exception 'H1 go-live refused: the month 9 lower limit is not floored, so the shutdown month teaches nothing about the floor';
  end if;
  v_x := v_ubar - 3.0 * sqrt(v_ubar / v_units[7]);
  if abs(v_x - {V['forcados_lcl_month07_per_200k']}) > {EPS_RATE!r} or not (v_x > 0.0) then
    raise exception 'H1 go-live refused: the month 7 lower limit is % and positive, against the seeded %{name('forcados_lcl_month07_per_200k')}', v_x, {V['forcados_lcl_month07_per_200k']};
  end if;
  select sum(v_fc_c[g]) / sum(v_units[g]) into v_x from unnest(v_kept) g;
  if abs(v_x - {V['forcados_revised_centre_per_200k']}) > {EPS_RATE!r} then
    raise exception 'H1 go-live refused: the centre without the signalling month is %, against the seeded %{name('forcados_revised_centre_per_200k')}', v_x, {V['forcados_revised_centre_per_200k']};
  end if;
  v_s_forcados_before_after_p_value := {central_sql(OK_SUM(7, 12, 'v_fc_c'), OK_SUM(7, 12, 'v_fc_h'), OK_SUM(1, 6, 'v_fc_c'), OK_SUM(1, 6, 'v_fc_h'))};
  if abs(v_s_forcados_before_after_p_value - {V['forcados_before_after_p_value']}) > {EPS_P!r} then
    raise exception 'H1 go-live refused: twice the smaller tail for months 7 to 12 against 1 to 6 is %, against the seeded %{name('forcados_before_after_p_value')}', v_s_forcados_before_after_p_value, {V['forcados_before_after_p_value']};
  end if;
  v_s_forcados_before_after_p_value_without_month06 := {central_sql(OK_SUM(7, 12, 'v_fc_c'), OK_SUM(7, 12, 'v_fc_h'), '(select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))', '(select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))')};
  if abs(v_s_forcados_before_after_p_value_without_month06 - {V['forcados_before_after_p_value_without_month06']}) > {EPS_P!r} then
    raise exception 'H1 go-live refused: twice the smaller tail with the signalling month left out is %, against the seeded %{name('forcados_before_after_p_value_without_month06')}', v_s_forcados_before_after_p_value_without_month06, {V['forcados_before_after_p_value_without_month06']};
  end if;
  -- The tier's point, on these inputs: with month 6 the drop is significant at
  -- 0.05 and without it the drop is not.
  if not ({V['forcados_before_after_p_value']} < 0.05 and {V['forcados_before_after_p_value_without_month06']} > 0.05) then
    raise exception 'H1 go-live refused: the two before-and-after p-values % and % do not fall either side of 0.05{name('forcados_before_after_p_value', 'forcados_before_after_p_value_without_month06')}', {V['forcados_before_after_p_value']}, {V['forcados_before_after_p_value_without_month06']};
  end if;
''')

# ------------------------------------------------------ 3. the traps bite
ZL = repr(Z)
OKe, OKc_ = float(O['employeeHours']), float(O['contractorHours'])
UNITS = 'v_units'
MEANU = f'(select sum(v_fc_c[g] / v_units[g]) / 12.0 from generate_series(1, 12) g)'
NBAR = f'(select sum(v_units[g]) / 12.0 from generate_series(1, 12) g)'
AFT_C, AFT_H = OK_SUM(7, 12, 'v_fc_c'), OK_SUM(7, 12, 'v_fc_h')
BEF_C, BEF_H = OK_SUM(1, 6, 'v_fc_c'), OK_SUM(1, 6, 'v_fc_h')
BO_C = '(select sum(v_fc_c[g]) from generate_series(1, 6) g where g <> all (v_flagged))'
BO_H = '(select sum(v_fc_h[g]) from generate_series(1, 6) g where g <> all (v_flagged))'
TRAPS_SQL = {
    'okrika_combined_trir_per_200k': [
        f"({O['employeeRecordables']} * {B2!r} / {OKe!r} + {O['contractorRecordables']} * {B2!r} / {OKc_!r}) / 2.0",
        f'{okR} * {B6!r} / {okH_sql}',
        f"({okR} + {O['fatalities']}) * {B2!r} / {okH_sql}"],
    'okrika_combined_ltir_per_1m': [
        f"{O['lostTimeInjuries']} * {B2!r} / {okH_sql}",
        f'{okR} * {B6!r} / {okH_sql}',
        f"({O['lostTimeInjuries']} + {O['fatalities']}) * {B6!r} / {okH_sql}"],
    'okrika_far_per_100m': [
        f"{O['fatalities']} * {B6!r} / {okH_sql}",
        f"{O['fatalities']} * {B2!r} / {okH_sql}",
        f"{O['lostTimeInjuries']} * {B8!r} / {okH_sql}"],
    'okrika_severity_rate_per_200k': [
        f"{float(O['daysLost'])!r} / {float(O['lostTimeInjuries'])!r}",
        f"{O['daysLost']} * {B6!r} / {okH_sql}",
        f"{float(O['daysLost'])!r} / {float(okR)!r}"],
    'okrika_tier1_pse_rate_per_200k': [
        f"{O['tier1Pse']} * {B6!r} / {okH_sql}",
        f"({O['tier1Pse']} + {O['tier2Pse']}) * {B2!r} / {okH_sql}",
        f"{O['tier2Pse']} * {B2!r} / {okH_sql}"],
    'okrika_rolling12_trir_month14_per_200k': [
        f"{OK_SUM(1, 12, 'v_ok_c')} * {B2!r} / {OK_SUM(1, 12, 'v_ok_h')}",
        f"{OK_SUM(2, 13, 'v_ok_c')} * {B2!r} / {OK_SUM(2, 13, 'v_ok_h')}",
        f"(select sum(v_ok_c[g] * {B2!r} / v_ok_h[g]) / 12.0 from generate_series(3, 14) g)"],
    'bonny_alpha_trir_lower95_per_200k': [
        f'({nA} - {ZL} * sqrt({float(nA)!r})) * {B2!r} / {aH!r}',
        f'{nA} * {B2!r} / {aH!r}',
        f"{V['bonny_alpha_trir_lower95_per_200k']} * {B6!r} / {B2!r}"],
    'bonny_alpha_trir_upper95_per_200k': [
        f'({nA} + {ZL} * sqrt({float(nA)!r})) * {B2!r} / {aH!r}',
        f'{nA} * {B2!r} / {aH!r}',
        f"{V['bonny_alpha_trir_upper95_per_200k']} * {B6!r} / {B2!r}"],
    'bonny_crew_zero_event_upper95_per_200k': [
        f'3.0 * {B2!r} / {cH!r}',
        '0.0',
        f"{V['bonny_crew_zero_event_upper95_per_200k']} * {B6!r} / {B2!r}"],
    'bonny_rate_ratio_lower95': [
        f'({float(nA)!r} / {aH!r}) / ({float(nB)!r} / {bH!r}) * exp(-{ZL} * sqrt(1.0 / {float(nA)!r} + 1.0 / {float(nB)!r}))',
        f"1.0 / {V['bonny_rate_ratio_upper95']}",
        f"{V['bonny_rate_ratio_lower95']} * {aH!r} / {bH!r}"],
    'bonny_rate_ratio_upper95': [
        f'({float(nA)!r} / {aH!r}) / ({float(nB)!r} / {bH!r}) * exp({ZL} * sqrt(1.0 / {float(nA)!r} + 1.0 / {float(nB)!r}))',
        f"1.0 / {V['bonny_rate_ratio_lower95']}",
        f"{V['bonny_rate_ratio_upper95']} * {aH!r} / {bH!r}"],
    'bonny_compare_p_value': [
        minlike_sql(nA, repr(aH), nB, repr(bH)),
        one_tail_sql(nA, repr(aH), nB, repr(bH)),
        central_sql(nA, '1.0', nB, '1.0')],
    'forcados_centre_per_200k': [
        MEANU,
        f"(select sum(v_fc_c[g]) / 12.0 from generate_series(1, 12) g)",
        f"(select sum(v_fc_c[g]) * {B6!r} / sum(v_fc_h[g]) from generate_series(1, 12) g)"],
    'forcados_ucl_month09_per_200k': [
        'v_ubar + 2.0 * sqrt(v_ubar / v_units[9])',
        f'v_ubar + 3.0 * sqrt(v_ubar / {NBAR})',
        f'{MEANU} + 3.0 * sqrt({MEANU} / v_units[9])',
        'v_ubar + 3.0 * sqrt(v_ubar / v_fc_h[9])'],
    'forcados_lcl_month07_per_200k': [
        'v_ubar - 2.0 * sqrt(v_ubar / v_units[7])',
        f'v_ubar - 3.0 * sqrt(v_ubar / {NBAR})',
        f'{MEANU} - 3.0 * sqrt({MEANU} / v_units[7])',
        '0.0'],
    'forcados_revised_centre_per_200k': [
        'v_ubar',
        '(select sum(v_fc_c[g] / v_units[g]) / count(*) from unnest(v_kept) g)',
        '(select sum(v_fc_c[g]) from unnest(v_kept) g) / (select sum(v_units[g]) from generate_series(1, 12) g)',
        '(select sum(v_fc_c[g]) / sum(v_units[g]) from generate_series(1, 12) g where g <> 9)'],
    'forcados_before_after_p_value': [
        minlike_sql(AFT_C, AFT_H, BEF_C, BEF_H),
        one_tail_sql(AFT_C, AFT_H, BEF_C, BEF_H),
        central_sql(AFT_C, '1.0', BEF_C, '1.0'),
        central_sql(AFT_C, AFT_H, BO_C, BO_H)],
    'forcados_before_after_p_value_without_month06': [
        central_sql(AFT_C, AFT_H, BEF_C, BEF_H),
        central_sql(AFT_C, AFT_H, BO_C, BEF_H),
        minlike_sql(AFT_C, AFT_H, BO_C, BO_H),
        one_tail_sql(AFT_C, AFT_H, BO_C, BO_H)],
}
if set(TRAPS_SQL) != set(KEYS) or any(len(TRAPS_SQL[k]) != len(TRAPS_PY[k]) for k in KEYS):
    refused.append('the SQL traps and the Python traps are not the same list')

A('\n  -- ------------------------------------------------- 3. the traps bite')
A('  -- Each wrong reading is computed over the same inputs and must MISS the')
A('  -- graded value by more than its tolerance, or the field does not')
A('  -- discriminate the trap it is for.')
NTRAPS = 0
for k in KEYS:
    for (why, _wrong), expr in zip(TRAPS_PY[k], TRAPS_SQL[k]):
        NTRAPS += 1
        reads = [k] + [r for r in dict.fromkeys(re.findall(r'\bv_g_(\w+)\b', expr)) if r != k]
        A(f'''  v_wrong := {expr};
  if v_wrong is null or abs(v_wrong - {V[k]}) <= {TOL[k]!r} then
    raise exception 'H1 go-live refused: {why.replace("'", "''")} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(*reads)}', v_wrong, {V[k]};
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'H1 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H1 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;''')

SQL = HEADER + '\n\n' + '\n'.join(BODY) + '\n'

# ----------------------------------------------------------- self checks
named = set()
for m in re.finditer(r'\[graded field: ([^\]]*)\]', SQL):
    named.update(x.strip() for x in m.group(1).split(','))
unnamed = [f'{TIER_OF[k]}/{k} is graded and no refusal names it' for k in KEYS
           if f'{TIER_OF[k]}/{k}' not in named]
# Every refusal whose GUARD or MESSAGE reads a graded variable must name it.
prev = SQL.find('\nbegin\n')
for m in re.finditer(r"raise exception '((?:[^']|'')*)'([^;]*);", SQL):
    scope = SQL[prev:m.end()]
    prev = m.end()
    reads = set(re.findall(r'\bv_g_(\w+)\b', scope))
    for r in reads:
        if f'/{r}' not in m.group(1):
            unnamed.append(f'a refusal reads {r} and does not name it: {m.group(1)[:70]}')
code = '\n'.join(l.split('--', 1)[0] if not l.lstrip().startswith('--') else '' for l in SQL.splitlines())
intdiv = [l.strip()[:120] for l in code.splitlines() if re.search(r'/\s*\d+(?![\d.eE])', l)]
unclosed = code.replace("''", '').count("'") % 2
dashes = len(re.findall('[–—]', SQL))

if __name__ == '__main__':
    if refused or unnamed or intdiv or unclosed or dashes:
        print('REFUSED, nothing written:')
        for b in refused + unnamed + intdiv:
            print('  ', b)
        print('unclosed literal:', bool(unclosed), '| en/em dashes:', dashes)
        sys.exit(1)
    open(OUT, 'w').write(SQL)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines')
    print('engine ledger: 18 of 18 graded values emitted as the engine returned them, to the last bit')
    print(f'second route in SQL: 18 fields, 10 of them as roots or tail sums | traps that must bite: {NTRAPS} over 18 fields')
    print(f'digest sweep: {len(DIGEST_NUMS)} numbers | graded fields named by a refusal: '
          f'{len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
    print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
    print('every identity the second route asserts, checked here first in Python:')
    for what, diff, eps in checks:
        print(f'  {diff:.3e} <= {eps:.0e}  {what}')
