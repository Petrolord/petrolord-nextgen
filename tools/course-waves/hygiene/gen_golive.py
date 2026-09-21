#!/usr/bin/env python3
"""Generate the H2 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the CAPSTONE
ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction. They are
then checked three ways, and none of the three is a restatement of the generator
that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node h2_capstone.mjs --json`
   through the vendored engines/hse/exposure.js when this file is generated, and
   refuses unless fields.json carries exactly what that run returned. The values
   the go-live compares the seeded rows to are THAT RUN'S, emitted to the last
   bit, so a capstone row an earlier seed left behind (the course migration
   inserts with `on conflict do nothing`) is refused here by name, and so is a
   move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL, over the inputs the learner is handed. Every graded
   value is recomputed by Postgres with no engine code at all: the reference
   duration T = 8 / 2^((L - Lc)/q) and the noise dose D = 100 sum(C/T) are summed
   period by period with the threshold applied as a WHERE clause, so the
   threshold decides what is integrated in SQL exactly as it does in the engine;
   the dose-to-average step uses the coefficient the source PRINTS; LEX,8h and
   the weekly LEX are energy sums in SQL; the protector credit, the chemical
   averages, the mixture indices, the extended-shift action level and the Brief
   and Scala factors are each written out as the formula their own source
   prints. It is an oracle in a second language, and the dry run is what proves
   it agrees with the engine on these inputs.

   AND THE INPUTS IT READS ARE THE INPUTS THE LEARNER READS. Each shipped prompt
   must be the prompt gen_course.py rendered from the engine's own inputs, byte
   for byte (md5), and every period the second route sums must be stated in its
   prompt with its own numbers together.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these inputs. For
   every one of the eighteen fields the go-live computes readings a learner who
   missed the lesson would give (the wrong threshold, the wrong decibel exchange
   rate, the exact coefficient instead of the printed one, the reference
   duration left in minutes, the day length instead of the statutory divisor,
   the arithmetic mean instead of the energy or time weighted average, the full
   protector credit instead of the field derating, the unadjusted limit, the
   weekly factor instead of the governing daily one, the shift rescaled to eight
   hours) and refuses unless each one misses the graded value by more than the
   field's own tolerance.

AND ONE MORE, WHICH IS THIS COURSE'S OWN LINE. The go-live refuses a seeded
label or unit that reads as a NIOSH heat recommended alert limit, a NIOSH heat
REL, a margin against either, an exceedance verdict, or a wet bulb globe
temperature built from thermometer readings. Those are taught and graded
nowhere, and a later edit that quietly grades one is refused here rather than
found by a learner.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field no refusal names; a division with a bare integer denominator;
an unclosed literal; an em or en dash; a go-live whose engine run and fields.json
disagree (gen_course.py refuses that first); a second route or a trap that does
not first pass, or fail, in the Python mirror below.

Usage: python3 gen_golive.py
   H2_WAVE        the wave directory (default /root/hse-wip-hygiene)
   H2_REPO        the nextgen clone   (default /root/wt-h2-nextgen)
   H2_ENGINES     packages/engines to run the capstone through
   H2_TOLERANCE   gradedTolerance.js
   H2_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   H2_GOLIVE_OUT  where to write
"""
import hashlib
import math
import os
import re
import sys

W = os.environ.get('H2_WAVE', '/root/hse-wip-hygiene')
REPO = os.environ.get('H2_REPO', '/root/wt-h2-nextgen')
COURSE = os.environ.get('H2_COURSE_SQL', f'{REPO}/migrations/20261004_h2_hygiene_course.sql')
OUT = os.environ.get('H2_GOLIVE_OUT', f'{REPO}/migrations/20261004_h2_hygiene_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['H2_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
U, A, OS = GC.U, GC.A, GC.OS
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')

PRINTED_DP = {GC.precision[c]['decimals'] for c in GC.precision}
if PRINTED_DP != {6}:
    refused.append(f'the precision classes print to {sorted(PRINTED_DP)} decimals; this go-live grades six')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] != TOL6:
        refused.append(f'{k} is graded at {TOL[k]}, and every H2 field is graded at the six-decimal floor {TOL6}')


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
# THE INPUTS, as plain Python lists, straight off the frozen scenarios the
# engine was run on. Nothing below types a number.
# ---------------------------------------------------------------------------
UL = [p['levelDbA'] for p in U['periods']]
UH = [p['durationH'] for p in U['periods']]
ULOUD = U['loudestDbA']
AL = [p['laeqDbA'] for p in A['tasks']]
AH = [p['durationH'] for p in A['tasks']]
AWEEK = list(A['weekLexDbA'])
ADOSE = A['dosimeterPelDosePct']
ANRR = A['earmuffNrrDb']
BC = [p['concentration'] for p in A['benzene']]
BH = [p['durationH'] for p in A['benzene']]
STC = [p['concentration'] for p in A['tolueneShortTerm']]
STM = [p['durationMin'] for p in A['tolueneShortTerm']]
MXC = [c['concentration'] for c in A['mixture']]
MXL = [c['limit'] for c in A['mixture']]
WBT = [p['wbgtC'] for p in OS['wbgtReadouts']]
WBM = [p['durationMin'] for p in OS['wbgtReadouts']]
MTW = [p['metabolicRateW'] for p in OS['metabolic']]
MTM = [p['durationMin'] for p in OS['metabolic']]
ODL = [p['levelDbA'] for p in OS['dosimeter']]
ODH = [p['durationH'] for p in OS['dosimeter']]
SVC = [c['concentration'] for c in OS['solvents']]
SVL = [c['limit'] for c in OS['solvents']]
SH, WH, XL = float(OS['shiftHours']), float(OS['weeklyHours']), float(OS['xyleneLimitPpm'])

# The criterion constants, as the presets print them.
PEL_LC, PEL_Q, PEL_THR, PEL_K = 90.0, 5.0, 90.0, 16.61
AL_THR = 80.0
REL_LC, REL_Q, REL_THR, REL_K = 85.0, 3.0, 80.0, 10.0
EXACT5 = 5.0 / math.log10(2.0)
EXACT3 = 3.0 / math.log10(2.0)

if abs(sum(UH) - 8.0) > 1e-12:
    refused.append('the UTOROGU periods do not total the eight hours the prompt states')
if abs(sum(ODH) - SH) > 1e-12:
    refused.append('the OSIOKA dosimeter periods do not total the shift the prompt states')
if abs(sum(WBM) - 60.0) > 1e-12 or abs(sum(MTM) - 60.0) > 1e-12:
    refused.append('the OSIOKA one-hour records do not total sixty minutes')

# ---------------------------------------------------------------------------
# THE SECOND ROUTE, WRITTEN TWICE: once as SQL text and once as Python over the
# same inputs, so a route that cannot pass is found here and never written.
# ---------------------------------------------------------------------------
NL = {'ul': 'v_u_l', 'uh': 'v_u_h', 'al': 'v_a_l', 'ah': 'v_a_h', 'week': 'v_a_week',
      'bc': 'v_b_c', 'bh': 'v_b_h', 'stc': 'v_st_c', 'stm': 'v_st_m',
      'mxc': 'v_mx_c', 'mxl': 'v_mx_l', 'wbt': 'v_wb_t', 'wbm': 'v_wb_m',
      'mtw': 'v_mt_w', 'mtm': 'v_mt_m', 'odl': 'v_od_l', 'odh': 'v_od_h',
      'svc': 'v_sv_c', 'svl': 'v_sv_l'}


def arr(vals):
    return 'array[' + ', '.join(repr(float(v)) for v in vals) + ']'


def dose_sql(lv, hv, cnt, lc, qx, thr):
    """D = 100 sum(C / T), T = 8 / 2^((L - Lc)/q), over the periods AT OR ABOVE
    the threshold. The threshold is the where clause, as it is in the engine."""
    return (f'(select 100.0 * coalesce(sum({hv}[g] / (8.0 / power(2.0, ({lv}[g] - {lc!r})'
            f' / {qx!r}))), 0.0) from generate_series(1, {cnt}) g where {lv}[g] >= {thr!r})')


def dose(levels, hours, lc, qx, thr):
    return 100.0 * sum(h / (8.0 / 2.0 ** ((l - lc) / qx)) for l, h in zip(levels, hours) if l >= thr)


def refdur_sql(level, lc, qx):
    return f'(8.0 / power(2.0, ({level!r} - {lc!r}) / {qx!r}))'


def refdur(level, lc, qx):
    return 8.0 / 2.0 ** ((level - lc) / qx)


def twa_sql(dose_expr, k, lc):
    return f'({k!r} * log(({dose_expr}) / 100.0) + {lc!r})'


def twa(d, k, lc):
    return k * math.log10(d / 100.0) + lc


def wsum_sql(a, b, cnt):
    return f'(select sum({a}[g] * {b}[g]) from generate_series(1, {cnt}) g)'


def sum_sql(a, cnt):
    return f'(select sum({a}[g]) from generate_series(1, {cnt}) g)'


def ratio_sum_sql(a, b, cnt, scale='1.0'):
    return f'(select sum({a}[g] / ({b}[g] * {scale})) from generate_series(1, {cnt}) g)'


def lex_sql(lv, hv, cnt):
    return (f'(10.0 * log((select sum(({hv}[g] / 8.0) * power(10.0, {lv}[g] / 10.0))'
            f' from generate_series(1, {cnt}) g)))')


def lex(levels, hours):
    return 10.0 * math.log10(sum((h / 8.0) * 10.0 ** (l / 10.0) for l, h in zip(levels, hours)))


def lexweek_sql(a, cnt, div):
    return (f'(10.0 * log((select sum(power(10.0, 0.1 * {a}[g])) from generate_series(1, {cnt}) g)'
            f' / {div!r}))')


def lexweek(vals, div):
    return 10.0 * math.log10(sum(10.0 ** (0.1 * v) for v in vals) / div)


def rf_daily(h):
    return min(1.0, (8.0 / h) * ((24.0 - h) / 16.0))


def rf_weekly(h):
    return min(1.0, (40.0 / h) * ((168.0 - h) / 128.0))


RF_D_SQL = f'least(1.0, (8.0 / {SH!r}) * ((24.0 - {SH!r}) / 16.0))'
RF_W_SQL = f'least(1.0, (40.0 / {WH!r}) * ((168.0 - {WH!r}) / 128.0))'
RF_G_SQL = f'least({RF_D_SQL}, {RF_W_SQL})'
RF_D, RF_W = rf_daily(SH), rf_weekly(WH)
RF_G = min(RF_D, RF_W)
if not RF_D < RF_W:
    refused.append('the OSIOKA weekly reduction factor is not above the daily one, and the capstone is built on the daily factor governing')

AL_EXT_SQL = f'({PEL_K!r} * log(50.0 / (12.5 * {SH!r})) + 90.0)'
AL_EXT = PEL_K * math.log10(50.0 / (12.5 * SH)) + 90.0

checks = []


def same(what, a, b, eps):
    checks.append((what, abs(a - b), eps))
    if not abs(a - b) <= eps:
        refused.append(f'{what}: {a!r} against {b!r}, difference {abs(a - b)} exceeds {eps}')


# The second route in Python, checked at the SAME eps the SQL will use. The
# tightest tolerance any field is graded at is 5e-7, and every eps below is at
# least a hundred times tighter, so a move a grader would pass is still seen.
EPS = 1e-9
D_PEL = dose(UL, UH, PEL_LC, PEL_Q, PEL_THR)
D_AL = dose(UL, UH, PEL_LC, PEL_Q, AL_THR)
D_REL = dose(UL, UH, REL_LC, REL_Q, REL_THR)
D_OS = dose(ODL, ODH, PEL_LC, PEL_Q, AL_THR)
EXPOSED = twa(ADOSE, PEL_K, PEL_LC)
ATTEN = max(0.0, (ANRR - 7.0) * 0.5)
MIX_RAW = sum(c / l for c, l in zip(SVC, SVL))

same('UTOROGU noise dose, OSHA permissible exposure limit setup', D_PEL, F['utorogu_osha_pel_dose_pct'], EPS)
same('UTOROGU time weighted average, OSHA setup', twa(D_PEL, PEL_K, PEL_LC), F['utorogu_osha_pel_twa_dba'], EPS)
same('UTOROGU noise dose, OSHA action level setup', D_AL, F['utorogu_action_level_dose_pct'], EPS)
same('UTOROGU noise dose, NIOSH noise REL setup', D_REL, F['utorogu_niosh_rel_dose_pct'], EPS)
same('UTOROGU time weighted average, NIOSH noise REL setup', twa(D_REL, REL_K, REL_LC), F['utorogu_niosh_rel_twa_dba'], EPS)
same('UTOROGU minutes left at the loudest sound level',
     (1.0 - D_PEL / 100.0) * refdur(ULOUD, PEL_LC, PEL_Q) * 60.0, F['utorogu_pel_minutes_left_min'], EPS)
same('AMUKPE LEX,8h', lex(AL, AH), F['amukpe_lex_8h_dba'], EPS)
same('AMUKPE weekly LEX', lexweek(AWEEK, 5.0), F['amukpe_lex_weekly_dba'], EPS)
same('AMUKPE field derated sound level', EXPOSED - ATTEN, F['amukpe_field_derated_exposure_dba'], EPS)
same('AMUKPE benzene eight-hour average', sum(c * h for c, h in zip(BC, BH)) / 8.0, F['amukpe_benzene_twa8h_ppm'], EPS)
same('AMUKPE toluene fifteen-minute average', sum(c * m for c, m in zip(STC, STM)) / 15.0, F['amukpe_toluene_stel_ppm'], EPS)
same('AMUKPE mixture index', sum(c / l for c, l in zip(MXC, MXL)), F['amukpe_mixture_index'], EPS)
same('OSIOKA one-hour wet bulb globe temperature average',
     sum(t * m for t, m in zip(WBT, WBM)) / sum(WBM), F['osioka_wbgt_twa_c'], EPS)
same('OSIOKA one-hour metabolic rate average',
     sum(w * m for w, m in zip(MTW, MTM)) / sum(MTM), F['osioka_metabolic_twa_w'], EPS)
same('OSIOKA extended-shift action level', AL_EXT, F['osioka_extended_action_level_dba'], EPS)
same('OSIOKA whole-shift noise dose', D_OS, F['osioka_extended_action_dose_pct'], EPS)
same('OSIOKA adjusted xylene limit', XL * RF_G, F['osioka_adjusted_limit_ppm'], EPS)
same('OSIOKA mixture index against the adjusted limits',
     sum(c / (l * RF_G) for c, l in zip(SVC, SVL)), F['osioka_adjusted_mixture_index'], EPS)

# THE LESSONS THESE INPUTS WERE CHOSEN TO CARRY, measured here and asserted in
# SQL. A capstone whose numbers stopped making the tier's point still grades,
# and that is exactly the failure a count of rows cannot see.
if not (F['utorogu_osha_pel_dose_pct'] < 100.0 and F['utorogu_action_level_dose_pct'] > 50.0):
    refused.append('UTOROGU no longer sits under the permissible exposure limit while over the action level')
if not F['utorogu_niosh_rel_dose_pct'] > 100.0:
    refused.append('UTOROGU no longer exceeds the NIOSH noise REL on the same day')
if not sum(AH) > 8.0:
    refused.append('the AMUKPE survey day is no longer longer than eight hours')
if not (F['osioka_extended_action_dose_pct'] > 50.0
        and F['osioka_extended_action_dose_pct'] * (8.0 / SH) < 50.0):
    refused.append('the OSIOKA shift noise dose no longer crosses 50 percent only because the shift is long')
if not (MIX_RAW < 1.0 < F['osioka_adjusted_mixture_index']):
    refused.append('the OSIOKA mixture no longer passes unadjusted and fails adjusted')

# ------------------------------------------------------- the traps, in Python
MEAN = lambda xs: sum(xs) / len(xs)  # noqa: E731
TRAPS_PY = {
    'utorogu_osha_pel_dose_pct': [
        ('the 80 dBA threshold of the action level setup used', dose(UL, UH, PEL_LC, PEL_Q, AL_THR)),
        ('the NIOSH 3 dB decibel exchange rate used on the OSHA criterion', dose(UL, UH, PEL_LC, REL_Q, PEL_THR)),
        ('no threshold applied, so every period integrated', dose(UL, UH, PEL_LC, PEL_Q, -1e9))],
    'utorogu_osha_pel_twa_dba': [
        ('the exact 5 over log10 2 coefficient instead of the printed 16.61', twa(D_PEL, EXACT5, PEL_LC)),
        ('the NIOSH coefficient and criterion used', twa(D_PEL, REL_K, REL_LC)),
        ('the action level noise dose used', twa(D_AL, PEL_K, PEL_LC)),
        ('the criterion left off the sum', twa(D_PEL, PEL_K, 0.0))],
    'utorogu_action_level_dose_pct': [
        ('the 90 dBA threshold of the permissible exposure limit setup used', dose(UL, UH, PEL_LC, PEL_Q, PEL_THR)),
        ('the NIOSH 3 dB decibel exchange rate used', dose(UL, UH, PEL_LC, REL_Q, AL_THR)),
        ('no threshold applied, so every period integrated', dose(UL, UH, PEL_LC, PEL_Q, -1e9))],
    'utorogu_niosh_rel_dose_pct': [
        ('the OSHA 5 dB decibel exchange rate used on the NIOSH criterion', dose(UL, UH, REL_LC, PEL_Q, REL_THR)),
        ('the OSHA 90 dBA threshold used on the NIOSH criterion', dose(UL, UH, REL_LC, REL_Q, PEL_THR)),
        ('the NIOSH reference duration left in minutes while the periods are in hours',
         dose(UL, UH, REL_LC, REL_Q, REL_THR) / 60.0)],
    'utorogu_niosh_rel_twa_dba': [
        ('the exact 3 over log10 2 coefficient instead of the printed 10.0', twa(D_REL, EXACT3, REL_LC)),
        ('the OSHA coefficient and criterion used', twa(D_REL, PEL_K, PEL_LC)),
        ('the OSHA permissible exposure limit noise dose used', twa(D_PEL, REL_K, REL_LC))],
    'utorogu_pel_minutes_left_min': [
        ('the remaining fraction left in hours', (1.0 - D_PEL / 100.0) * refdur(ULOUD, PEL_LC, PEL_Q)),
        ('the reference duration taken on the NIOSH scale',
         (1.0 - D_PEL / 100.0) * refdur(ULOUD, REL_LC, REL_Q) * 60.0),
        ('the whole reference duration credited with no noise dose subtracted',
         refdur(ULOUD, PEL_LC, PEL_Q) * 60.0)],
    'amukpe_lex_8h_dba': [
        ('the day length used in place of the eight hours the metric normalises to',
         10.0 * math.log10(sum((h / sum(AH)) * 10.0 ** (l / 10.0) for l, h in zip(AL, AH)))),
        ('the energy average taken with no duration weighting',
         10.0 * math.log10(MEAN([10.0 ** (l / 10.0) for l in AL]))),
        ('the arithmetic mean of the task sound levels', MEAN(AL))],
    'amukpe_lex_weekly_dba': [
        ('the divisor taken as seven days', lexweek(AWEEK, 7.0)),
        ('the arithmetic mean of the five daily values', MEAN(AWEEK)),
        ('the energy sum quoted with no divisor at all', lexweek(AWEEK, 1.0))],
    'amukpe_field_derated_exposure_dba': [
        ('the OSHA Appendix B credit of the rating less seven, with no field derating', EXPOSED - (ANRR - 7.0)),
        ('the labelled rating credited whole', EXPOSED - ANRR),
        ('the NIOSH earmuff derating of 0.75 used instead', EXPOSED - (0.75 * ANRR - 7.0)),
        ('the seven subtracted after the halving instead of before', EXPOSED - (ANRR * 0.5 - 7.0))],
    'amukpe_benzene_twa8h_ppm': [
        ('the sampled time used as the divisor instead of the eight hours the regulation writes',
         sum(c * h for c, h in zip(BC, BH)) / sum(BH)),
        ('the arithmetic mean of the three concentrations', MEAN(BC)),
        ('the sum of the products quoted with no divisor', sum(c * h for c, h in zip(BC, BH)))],
    'amukpe_toluene_stel_ppm': [
        ('the sampled minutes used as the divisor instead of the fifteen the window is',
         sum(c * m for c, m in zip(STC, STM)) / sum(STM)),
        ('the arithmetic mean of the two readings', MEAN(STC)),
        ('the sum of the products quoted with no divisor', sum(c * m for c, m in zip(STC, STM)))],
    'amukpe_mixture_index': [
        ('the concentrations summed over the summed limits', sum(MXC) / sum(MXL)),
        ('the mean of the three ratios instead of their sum', MEAN([c / l for c, l in zip(MXC, MXL)])),
        ('the largest single ratio quoted', max(c / l for c, l in zip(MXC, MXL)))],
    'osioka_wbgt_twa_c': [
        ('the arithmetic mean of the three readouts', MEAN(WBT)),
        ('weighted by the metabolic rates instead of the minutes',
         sum(t * w for t, w in zip(WBT, MTW)) / sum(MTW)),
        ('the highest readout quoted', max(WBT))],
    'osioka_metabolic_twa_w': [
        ('the arithmetic mean of the three rates', MEAN(MTW)),
        ('weighted by the temperature readouts instead of the minutes',
         sum(w * t for w, t in zip(MTW, WBT)) / sum(WBT)),
        ('the highest rate quoted', max(MTW))],
    'osioka_extended_action_level_dba': [
        ('the exact 5 over log10 2 coefficient instead of the printed 16.61',
         EXACT5 * math.log10(50.0 / (12.5 * SH)) + 90.0),
        ('the eight-hour action level of 85 dBA quoted for a long shift', 85.0),
        ('the shift hours used where the 12.5 belongs', PEL_K * math.log10(50.0 / SH) + 90.0)],
    'osioka_extended_action_dose_pct': [
        ('the shift rescaled to eight hours', D_OS * (8.0 / SH)),
        ('the 90 dBA threshold of the permissible exposure limit setup used', dose(ODL, ODH, PEL_LC, PEL_Q, PEL_THR)),
        ('the NIOSH 3 dB decibel exchange rate used', dose(ODL, ODH, PEL_LC, REL_Q, AL_THR))],
    'osioka_adjusted_limit_ppm': [
        ('the weekly factor used instead of the governing daily one', XL * RF_W),
        ('the limit left unadjusted', XL * 1.0),
        ('the two factors multiplied together', XL * RF_D * RF_W)],
    'osioka_adjusted_mixture_index': [
        ('the limits left unadjusted', MIX_RAW),
        ('the weekly factor used instead of the governing daily one',
         sum(c / (l * RF_W) for c, l in zip(SVC, SVL))),
        ('the factor applied to the concentrations instead of the limits', MIX_RAW * RF_G)],
}
if set(TRAPS_PY) != set(KEYS):
    refused.append('the traps do not cover every graded field')
for k, traps in TRAPS_PY.items():
    if len(traps) < 3:
        refused.append(f'{k} has {len(traps)} traps; three is the floor every route in this kit is held to')
    for why, wrong in traps:
        if abs(wrong - F[k]) <= TOL[k]:
            refused.append(f'{k}: {why} gives {wrong}, within the tolerance of the graded {F[k]}, so the trap does not bite')

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- H2 GO-LIVE (HELD): Occupational Hygiene: Noise, Chemical & Heat Exposure
-- flips to 'available', the SECOND course of the HSE module, at path_order
-- {PATH_ORDER}.
--
-- THIS MIGRATION IS APPLIED BY NOBODY IN THE PULL REQUEST THAT SHIPS IT. It is
-- written, generated from the committed tree, dry-run inside a rolled-back
-- transaction against a local scratch Postgres, and then left unapplied on
-- purpose. The four seed migrations beside it put the course in hidden, and
-- this one is the only file that makes it reachable.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/hygiene. The 78 lessons, the teaching lab and its three
-- explorer panels (the noise dosimeter, protection and chemicals, and heat
-- stress) ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h2_capstone.mjs returned through
--      the vendored engines/hse/exposure.js when this file was generated, to
--      the last bit, so a capstone row an earlier seed left behind, or a move
--      of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and states every period it sums, then recomputes the reference
--      duration and the noise dose period by period with the threshold as a
--      where clause, the dose-to-average step on the coefficient the source
--      prints, LEX,8h and the weekly LEX as energy sums, the protector credit,
--      the chemical averages, the mixture indices, the extended-shift action
--      level and the Brief and Scala factors, each as the formula its own
--      source writes;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- AND BY THIS COURSE'S OWN LINE. No graded field may read as a NIOSH heat
-- recommended alert limit, a NIOSH heat REL, a margin against either, an
-- exceedance verdict, or a wet bulb globe temperature built from thermometer
-- readings. Those equations and weights are TRANSCRIPTION-CHECKED ONLY, and
-- NIOSH's own worked example disagrees with its own equation, so the course
-- teaches them and grades nothing that passes through them. The check is in
-- SQL below, on the rows as seeded.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a positive, non-whole expected value at the six-decimal floor 5e-7 with
-- a label and a unit, the six-decimal answer the prompt asks for must pass, and
-- one unit either side of it in the sixth decimal must fail. All of it is
-- asserted here, on the rows as seeded.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses to emit a bare integer
-- denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

BODY = []
A_ = BODY.append
A_('do $$')
A_('declare')
A_('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A_('  v_modules int; v_graded int; v_available int; v_soon int; v_n int;')
A_('  v_names text; v_prompt text; v_x double precision; v_wrong double precision;')
A_('  v_rf double precision; v_exposed double precision;')
for k in KEYS:
    A_(f'  {V[k]} double precision; v_s_{k} double precision;')
for pykey, sqlname, vals in (
        ('ul', NL['ul'], UL), ('uh', NL['uh'], UH), ('al', NL['al'], AL), ('ah', NL['ah'], AH),
        ('week', NL['week'], AWEEK), ('bc', NL['bc'], BC), ('bh', NL['bh'], BH),
        ('stc', NL['stc'], STC), ('stm', NL['stm'], STM), ('mxc', NL['mxc'], MXC), ('mxl', NL['mxl'], MXL),
        ('wbt', NL['wbt'], WBT), ('wbm', NL['wbm'], WBM), ('mtw', NL['mtw'], MTW), ('mtm', NL['mtm'], MTM),
        ('odl', NL['odl'], ODL), ('odh', NL['odh'], ODH), ('svc', NL['svc'], SVC), ('svl', NL['svl'], SVL)):
    A_(f'  {sqlname} double precision[] := {arr(vals)};')
A_('begin')

A_(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'H2 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'H2 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'H2 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'H2 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'H2 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'H2 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'H2 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'H2 go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'H2 go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  -- THE LINE THIS COURSE DOES NOT CROSS, on the rows as seeded. No graded field
  -- may read as a NIOSH heat recommended alert limit, a NIOSH heat REL, a
  -- margin against either, an exceedance verdict, or a wet bulb globe
  -- temperature built from thermometer readings.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and ((f->>'key') || ' ' || coalesce(f->>'label', '') || ' ' || coalesce(f->>'unit', ''))
         ~* '(\\mRAL\\M|recommended alert limit|NIOSH heat REL|\\mmargin\\M|\\mexceeds?\\M|\\mexceedance\\M|\\mverdict\\M|natural wet bulb|dry bulb)';
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % graded field(s) read as a heat limit, a margin, a verdict or a wet bulb globe temperature built from thermometer readings, which this course grades nowhere: %', v_n, v_names;
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
    raise exception 'H2 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
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
    raise exception 'H2 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
PROMPT_BLOCKS = []
for tier in GC.TIERS:
    md5 = hashlib.md5(GC.PROMPTS[tier].encode('utf-8')).hexdigest()
    period_lines = [ln for _w, items, _m in GC.PERIOD_LINES[tier] for ln in items]
    for ln in period_lines:
        if ln not in GC.PROMPTS[tier]:
            refused.append(f'{tier}: the period line {ln!r} is not in the rendered prompt')
    PROMPT_BLOCKS.append(f'''
  -- {tier}: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if md5(v_prompt) <> '{md5}' then
    raise exception 'H2 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}'
                    and cert_tier = {lit(GC.TIER[tier][0])} and dataset = {lit(GC.TIER[tier][1])} and title = {lit(GC.TIER[tier][2])}) then
    raise exception 'H2 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every period the second route sums is stated, its own numbers together,
  -- matched as a literal substring with strpos (an underscore or a percent sign
  -- in a LIKE pattern is a wildcard).
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array[{', '.join(lit(x) for x in period_lines)}]) l
   where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H2 go-live refused: % {tier} period line(s) the second route sums are not stated in the shipped prompt: %', v_n, v_names;
  end if;''')
A_('\n  -- ---------------------------------------- the prompts the learner reads')
for b in PROMPT_BLOCKS:
    A_(b)

# ------------------------------------------------ load the eighteen values
A_('\n  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    A_(f"""  select (f->>'expected')::double precision into {V[k]}
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';""")
A_('  if ' + '\n     or '.join(f'{V[k]} is null' for k in KEYS) + ' then')
A_(f"    raise exception 'H2 go-live refused: one or more of the eighteen graded fields is missing{name(*KEYS)}';")
A_('  end if;')

DIGEST_NUMS = GC.DIGEST_NUMS
A_(f'''
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
    raise exception 'H2 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner at
  -- least 100 numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '([0-9]+(\\.[0-9]+)?)', 'g') m
   where p.app_slug = '{SLUG}';
  if v_n < 100 then
    raise exception 'H2 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
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
    raise exception 'H2 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
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
    raise exception 'H2 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine ledger
A_('\n  -- ------------------------------------------ 1. against the engine ledger')
A_('  -- The values h2_capstone.mjs returned through the vendored engine, to the')
A_("  -- last bit. A seeded value that is not the engine's is refused by name.")
for k in KEYS:
    A_(f'''  if {V[k]} <> {f17(ENGINE[k])} then
    raise exception 'H2 go-live refused: the seeded value % is not the {ENGINE[k]!r} the engine returned{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
D_PEL_SQL = dose_sql(NL['ul'], NL['uh'], len(UL), PEL_LC, PEL_Q, PEL_THR)
D_AL_SQL = dose_sql(NL['ul'], NL['uh'], len(UL), PEL_LC, PEL_Q, AL_THR)
D_REL_SQL = dose_sql(NL['ul'], NL['uh'], len(UL), REL_LC, REL_Q, REL_THR)
D_OS_SQL = dose_sql(NL['odl'], NL['odh'], len(ODL), PEL_LC, PEL_Q, AL_THR)
SECOND = [
    ('utorogu_osha_pel_dose_pct', D_PEL_SQL,
     'the noise dose summed period by period over the periods at or above the 90 dBA threshold'),
    ('utorogu_osha_pel_twa_dba', twa_sql(f'v_s_utorogu_osha_pel_dose_pct', PEL_K, PEL_LC),
     'the printed 16.61 coefficient on the second route noise dose, over the criterion of 90 dBA'),
    ('utorogu_action_level_dose_pct', D_AL_SQL,
     'the same record summed from the 80 dBA threshold of the action level setup'),
    ('utorogu_niosh_rel_dose_pct', D_REL_SQL,
     'the same record on the NIOSH criterion of 85 dBA and its 3 dB decibel exchange rate'),
    ('utorogu_niosh_rel_twa_dba', twa_sql('v_s_utorogu_niosh_rel_dose_pct', REL_K, REL_LC),
     'the printed 10.0 coefficient on the second route NIOSH noise dose, over the criterion of 85 dBA'),
    ('utorogu_pel_minutes_left_min',
     f'((1.0 - v_s_utorogu_osha_pel_dose_pct / 100.0) * {refdur_sql(ULOUD, PEL_LC, PEL_Q)} * 60.0)',
     'the unspent fraction times the reference duration at the loudest sound level, in minutes'),
    ('amukpe_lex_8h_dba', lex_sql(NL['al'], NL['ah'], len(AL)),
     'the Schedule 1 energy sum normalised to eight hours'),
    ('amukpe_lex_weekly_dba', lexweek_sql(NL['week'], len(AWEEK), 5.0),
     'the energy average of the five stated days over the statutory divisor of five'),
    ('amukpe_field_derated_exposure_dba',
     f'(v_exposed - greatest(0.0, ({float(ANRR)!r} - 7.0) * 0.5))',
     'the time weighted average from the stated noise dose, less half of the rating credit'),
    ('amukpe_benzene_twa8h_ppm', f'({wsum_sql(NL["bc"], NL["bh"], len(BC))} / 8.0)',
     'the sum of concentration times hours over the divisor of eight the regulation writes'),
    ('amukpe_toluene_stel_ppm', f'({wsum_sql(NL["stc"], NL["stm"], len(STC))} / 15.0)',
     'the sum of concentration times minutes over the fifteen minute window'),
    ('amukpe_mixture_index', ratio_sum_sql(NL['mxc'], NL['mxl'], len(MXC)),
     'the additive index, each concentration over its own limit'),
    ('osioka_wbgt_twa_c',
     f'({wsum_sql(NL["wbt"], NL["wbm"], len(WBT))} / {sum_sql(NL["wbm"], len(WBM))})',
     'the stated readouts weighted by their own minutes'),
    ('osioka_metabolic_twa_w',
     f'({wsum_sql(NL["mtw"], NL["mtm"], len(MTW))} / {sum_sql(NL["mtm"], len(MTM))})',
     'the stated rates weighted by their own minutes'),
    ('osioka_extended_action_level_dba', AL_EXT_SQL,
     'the extended-shift action level from the shift length'),
    ('osioka_extended_action_dose_pct', D_OS_SQL,
     'the whole shift summed from the 80 dBA threshold with no rescaling to eight hours'),
    ('osioka_adjusted_limit_ppm', f'({float(XL)!r} * v_rf)',
     'the stated limit times the governing reduction factor'),
    ('osioka_adjusted_mixture_index', ratio_sum_sql(NL['svc'], NL['svl'], len(SVC), 'v_rf'),
     'the additive index over limits each multiplied by the governing reduction factor'),
]
if [k for k, _e, _w in SECOND] != KEYS:
    refused.append('the second route does not cover the eighteen fields in the order fields.json declares them')

ROUTE = []
ROUTE.append(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- Nothing below calls the engine. The reference duration T = 8 / 2^((L - Lc)
  -- / q) and the noise dose D = 100 sum(C / T) are summed period by period with
  -- the threshold as a WHERE clause, so the threshold decides what is
  -- integrated in SQL exactly as it does in the engine; the dose-to-average
  -- step uses the coefficient each source PRINTS, 16.61 for OSHA and 10.0 for
  -- NIOSH; LEX,8h and the weekly LEX are energy sums; the protector credit, the
  -- chemical averages, the mixture indices, the extended-shift action level and
  -- the Brief and Scala factors are each the formula their own source writes.
  v_exposed := {twa_sql(repr(float(ADOSE)), PEL_K, PEL_LC)};
  v_rf := {RF_G_SQL};
  if not ({RF_D_SQL} < {RF_W_SQL}) then
    raise exception 'H2 go-live refused: the weekly Brief and Scala factor % is not above the daily factor %, and the Expert capstone is built on the daily factor governing', {RF_W_SQL}, {RF_D_SQL};
  end if;''')
for k, expr, what in SECOND:
    ROUTE.append(f'''  v_s_{k} := {expr};
  if abs(v_s_{k} - {V[k]}) > {EPS!r} then
    raise exception 'H2 go-live refused: {what} gives %, against the seeded %{name(k)}', v_s_{k}, {V[k]};
  end if;''')
ROUTE.append(f'''  -- THE LESSONS THESE INPUTS CARRY. A capstone whose numbers stopped making
  -- the tier's point still grades, and no count of rows can see that.
  if not ({V['utorogu_osha_pel_dose_pct']} < 100.0 and {V['utorogu_action_level_dose_pct']} > 50.0) then
    raise exception 'H2 go-live refused: the UTOROGU day no longer sits under the permissible exposure limit at % percent while over the action level at % percent{name('utorogu_osha_pel_dose_pct', 'utorogu_action_level_dose_pct')}', {V['utorogu_osha_pel_dose_pct']}, {V['utorogu_action_level_dose_pct']};
  end if;
  if not ({V['utorogu_niosh_rel_dose_pct']} > 100.0) then
    raise exception 'H2 go-live refused: the UTOROGU day no longer exceeds the NIOSH noise REL at % percent{name('utorogu_niosh_rel_dose_pct')}', {V['utorogu_niosh_rel_dose_pct']};
  end if;
  if not ({V['osioka_extended_action_dose_pct']} > 50.0
          and {V['osioka_extended_action_dose_pct']} * (8.0 / {SH!r}) < 50.0) then
    raise exception 'H2 go-live refused: the OSIOKA shift noise dose of % percent no longer crosses 50 percent only because the shift is long{name('osioka_extended_action_dose_pct')}', {V['osioka_extended_action_dose_pct']};
  end if;
  v_x := {ratio_sum_sql(NL['svc'], NL['svl'], len(SVC))};
  if not (v_x < 1.0 and {V['osioka_adjusted_mixture_index']} > 1.0) then
    raise exception 'H2 go-live refused: the OSIOKA mixture index is % unadjusted and % adjusted, and the Expert capstone is built on it passing unadjusted and failing adjusted{name('osioka_adjusted_mixture_index')}', v_x, {V['osioka_adjusted_mixture_index']};
  end if;''')
for r in ROUTE:
    A_(r)

# ------------------------------------------------------ 3. the traps bite
TRAPS_SQL = {
    'utorogu_osha_pel_dose_pct': [D_AL_SQL,
                                  dose_sql(NL['ul'], NL['uh'], len(UL), PEL_LC, REL_Q, PEL_THR),
                                  dose_sql(NL['ul'], NL['uh'], len(UL), PEL_LC, PEL_Q, -1e9)],
    'utorogu_osha_pel_twa_dba': [twa_sql('v_s_utorogu_osha_pel_dose_pct', EXACT5, PEL_LC),
                                 twa_sql('v_s_utorogu_osha_pel_dose_pct', REL_K, REL_LC),
                                 twa_sql('v_s_utorogu_action_level_dose_pct', PEL_K, PEL_LC),
                                 twa_sql('v_s_utorogu_osha_pel_dose_pct', PEL_K, 0.0)],
    'utorogu_action_level_dose_pct': [D_PEL_SQL,
                                      dose_sql(NL['ul'], NL['uh'], len(UL), PEL_LC, REL_Q, AL_THR),
                                      dose_sql(NL['ul'], NL['uh'], len(UL), PEL_LC, PEL_Q, -1e9)],
    'utorogu_niosh_rel_dose_pct': [dose_sql(NL['ul'], NL['uh'], len(UL), REL_LC, PEL_Q, REL_THR),
                                   dose_sql(NL['ul'], NL['uh'], len(UL), REL_LC, REL_Q, PEL_THR),
                                   f'({D_REL_SQL} / 60.0)'],
    'utorogu_niosh_rel_twa_dba': [twa_sql('v_s_utorogu_niosh_rel_dose_pct', EXACT3, REL_LC),
                                  twa_sql('v_s_utorogu_niosh_rel_dose_pct', PEL_K, PEL_LC),
                                  twa_sql('v_s_utorogu_osha_pel_dose_pct', REL_K, REL_LC)],
    'utorogu_pel_minutes_left_min': [
        f'((1.0 - v_s_utorogu_osha_pel_dose_pct / 100.0) * {refdur_sql(ULOUD, PEL_LC, PEL_Q)})',
        f'((1.0 - v_s_utorogu_osha_pel_dose_pct / 100.0) * {refdur_sql(ULOUD, REL_LC, REL_Q)} * 60.0)',
        f'({refdur_sql(ULOUD, PEL_LC, PEL_Q)} * 60.0)'],
    'amukpe_lex_8h_dba': [
        f'(10.0 * log((select sum(({NL["ah"]}[g] / {float(sum(AH))!r}) * power(10.0, {NL["al"]}[g] / 10.0)) from generate_series(1, {len(AL)}) g)))',
        f'(10.0 * log((select sum(power(10.0, {NL["al"]}[g] / 10.0)) / {float(len(AL))!r} from generate_series(1, {len(AL)}) g)))',
        f'((select sum({NL["al"]}[g]) / {float(len(AL))!r} from generate_series(1, {len(AL)}) g))'],
    'amukpe_lex_weekly_dba': [lexweek_sql(NL['week'], len(AWEEK), 7.0),
                              f'((select sum({NL["week"]}[g]) / {float(len(AWEEK))!r} from generate_series(1, {len(AWEEK)}) g))',
                              lexweek_sql(NL['week'], len(AWEEK), 1.0)],
    'amukpe_field_derated_exposure_dba': [
        f'(v_exposed - ({float(ANRR)!r} - 7.0))',
        f'(v_exposed - {float(ANRR)!r})',
        f'(v_exposed - (0.75 * {float(ANRR)!r} - 7.0))',
        f'(v_exposed - ({float(ANRR)!r} * 0.5 - 7.0))'],
    'amukpe_benzene_twa8h_ppm': [
        f'({wsum_sql(NL["bc"], NL["bh"], len(BC))} / {sum_sql(NL["bh"], len(BH))})',
        f'({sum_sql(NL["bc"], len(BC))} / {float(len(BC))!r})',
        wsum_sql(NL['bc'], NL['bh'], len(BC))],
    'amukpe_toluene_stel_ppm': [
        f'({wsum_sql(NL["stc"], NL["stm"], len(STC))} / {sum_sql(NL["stm"], len(STM))})',
        f'({sum_sql(NL["stc"], len(STC))} / {float(len(STC))!r})',
        wsum_sql(NL['stc'], NL['stm'], len(STC))],
    'amukpe_mixture_index': [
        f'({sum_sql(NL["mxc"], len(MXC))} / {sum_sql(NL["mxl"], len(MXL))})',
        f'({ratio_sum_sql(NL["mxc"], NL["mxl"], len(MXC))} / {float(len(MXC))!r})',
        f'((select max({NL["mxc"]}[g] / {NL["mxl"]}[g]) from generate_series(1, {len(MXC)}) g))'],
    'osioka_wbgt_twa_c': [
        f'({sum_sql(NL["wbt"], len(WBT))} / {float(len(WBT))!r})',
        f'({wsum_sql(NL["wbt"], NL["mtw"], len(WBT))} / {sum_sql(NL["mtw"], len(MTW))})',
        f'((select max({NL["wbt"]}[g]) from generate_series(1, {len(WBT)}) g))'],
    'osioka_metabolic_twa_w': [
        f'({sum_sql(NL["mtw"], len(MTW))} / {float(len(MTW))!r})',
        f'({wsum_sql(NL["mtw"], NL["wbt"], len(MTW))} / {sum_sql(NL["wbt"], len(WBT))})',
        f'((select max({NL["mtw"]}[g]) from generate_series(1, {len(MTW)}) g))'],
    'osioka_extended_action_level_dba': [
        f'({EXACT5!r} * log(50.0 / (12.5 * {SH!r})) + 90.0)',
        '85.0',
        f'({PEL_K!r} * log(50.0 / {SH!r}) + 90.0)'],
    'osioka_extended_action_dose_pct': [
        f'(v_s_osioka_extended_action_dose_pct * (8.0 / {SH!r}))',
        dose_sql(NL['odl'], NL['odh'], len(ODL), PEL_LC, PEL_Q, PEL_THR),
        dose_sql(NL['odl'], NL['odh'], len(ODL), PEL_LC, REL_Q, AL_THR)],
    'osioka_adjusted_limit_ppm': [
        f'({float(XL)!r} * {RF_W_SQL})',
        f'({float(XL)!r} * 1.0)',
        f'({float(XL)!r} * {RF_D_SQL} * {RF_W_SQL})'],
    'osioka_adjusted_mixture_index': [
        ratio_sum_sql(NL['svc'], NL['svl'], len(SVC)),
        ratio_sum_sql(NL['svc'], NL['svl'], len(SVC), f'({RF_W_SQL})'),
        f'({ratio_sum_sql(NL["svc"], NL["svl"], len(SVC))} * v_rf)'],
}
if set(TRAPS_SQL) != set(KEYS) or any(len(TRAPS_SQL[k]) != len(TRAPS_PY[k]) for k in KEYS):
    refused.append('the SQL traps and the Python traps are not the same list')

A_('\n  -- ------------------------------------------------- 3. the traps bite')
A_('  -- Each wrong reading is computed over the same inputs and must MISS the')
A_('  -- graded value by more than its tolerance, or the field does not')
A_('  -- discriminate the trap it is for.')
NTRAPS = 0
for k in KEYS:
    for (why, _wrong), expr in zip(TRAPS_PY[k], TRAPS_SQL[k]):
        NTRAPS += 1
        reads = [k] + [r for r in dict.fromkeys(re.findall(r'\bv_g_(\w+)\b', expr)) if r != k]
        A_(f'''  v_wrong := {expr};
  if v_wrong is null or abs(v_wrong - {V[k]}) <= {TOL[k]!r} then
    raise exception 'H2 go-live refused: {why.replace("'", "''")} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(*reads)}', v_wrong, {V[k]};
  end if;''')

A_(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'H2 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H2 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
    print(f'second route in SQL: 18 fields, none of them through engine code | traps that must bite: {NTRAPS} over 18 fields')
    print(f'digest sweep: {len(DIGEST_NUMS)} numbers | graded fields named by a refusal: '
          f'{len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
    print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
    print('every identity the second route asserts, checked here first in Python:')
    for what, diff, eps in checks:
        print(f'  {diff:.3e} <= {eps:.0e}  {what}')
