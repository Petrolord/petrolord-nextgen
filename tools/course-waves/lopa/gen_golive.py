#!/usr/bin/env python3
"""Generate the H3 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked three ways, and none of the three is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node h3_capstone.mjs --json`
   through the vendored engines/hse/lopa.js when this file is generated, and
   refuses unless fields.json carries exactly what that run returned. The values
   the go-live compares the seeded rows to are THAT RUN'S, emitted to the last
   bit, so a capstone row an earlier seed left behind (the course migration
   inserts with `on conflict do nothing`) is refused here by name, and so is a
   move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL, over the inputs the learner is handed. Every
   graded value is recomputed by Postgres with no engine code at all: the LOPA
   chains as products and quotients, with the export row's required SIL found
   by Postgres from the decade snap; every subsystem by the IEC 61508-6 Annex B
   form written out term by term (the proof test coverage split of the DU down
   time, tCE and tGE, the beta factor and betaD terms, no beta factor term in
   2oo2); the SIF as the series sum; and the three longest intervals asserted
   BY THE EQUATION THEY ARE A ROOT OF: the Annex B PFDavg evaluated at the
   seeded interval must land on the budget or target, within a relative eps
   that a move of one part in 1e7 in the interval visibly breaks. The coverage
   floor is the same form at an interval of zero, and it must sit at or above
   the transmitter's target, which is what makes that target unachievable.

   AND THE INPUTS IT READS ARE THE INPUTS THE LEARNER READS. Each shipped prompt
   must be the prompt gen_course.py rendered from the engine's own inputs, byte
   for byte (md5), and every rendered fragment carrying an input must be in it.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these inputs. Every
   wrong method discriminate.mjs sweeps with the engine (94 over 18 fields: a
   forgotten factor, a non-independent layer credited, the ratio inverted, the
   band ceiling for the target, the unsnapped decade, 6 read as 3, no (1 - beta
   factor), tGE at T/2, MRT ignored, detected failures ignored, the TR84 form,
   the beta factor on 2oo2, the product of the subsystems, coverage ignored, the
   uncovered part over the whole lifetime, and the rest) is recomputed here, the
   interval ones by a bisection written in PL/pgSQL, and each must miss the
   graded value by more than the field's own tolerance. The Python mirror of
   every trap is checked against discriminate.mjs's own values first.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field no refusal names; a division with a bare integer
denominator; an unclosed literal; an em or en dash; a go-live whose engine run
and fields.json disagree (gen_course.py refuses that first); a second route or
a trap that does not first pass, or fail, in the Python mirror below.

Usage: python3 gen_golive.py
   H3_WAVE        the wave directory (default /root/hse-wip-lopa)
   H3_REPO        the nextgen clone   (default /root/wt-h3-nextgen)
   H3_ENGINES     packages/engines to run the capstone through
   H3_TOLERANCE   gradedTolerance.js
   H3_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   H3_GOLIVE_OUT  where to write
"""
import hashlib
import json
import math
import os
import re
import subprocess
import sys

W = os.environ.get('H3_WAVE', '/root/hse-wip-lopa')
REPO = os.environ.get('H3_REPO', '/root/wt-h3-nextgen')
COURSE = os.environ.get('H3_COURSE_SQL', f'{REPO}/migrations/20261005_h3_lopa_course.sql')
OUT = os.environ.get('H3_GOLIVE_OUT', f'{REPO}/migrations/20261005_h3_lopa_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['H3_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL, DP = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL, GC.DP
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
AK, US, YO = GC.AK, GC.US, GC.YO
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')

TOL_OF_DP = {12: 5e-13, 6: 5e-7}
for k in KEYS:
    if DP.get(k) not in TOL_OF_DP or TOL[k] != TOL_OF_DP[DP[k]]:
        refused.append(f'{k} is graded at {TOL[k]} for {DP.get(k)} decimals; this go-live grades '
                       f'twelve decimals at 5e-13 and six at 5e-7')


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
# ONE EXPRESSION, TWO LANGUAGES. E carries a Python double and the SQL text of
# the same arithmetic, fully parenthesised, so Postgres performs the same IEEE
# operations in the same order as the Python mirror. A symbolic E (a PL/pgSQL
# variable) carries no Python value.
# ---------------------------------------------------------------------------
class E:
    __slots__ = ('v', 's')

    def __init__(self, v, s):
        self.v, self.s = v, s

    @staticmethod
    def of(x):
        return x if isinstance(x, E) else E(float(x), f17(x))

    def _op(self, o, sym, fn, rev=False):
        o = E.of(o)
        a, b = (o, self) if rev else (self, o)
        v = None if a.v is None or b.v is None else fn(a.v, b.v)
        return E(v, f'({a.s} {sym} {b.s})')

    def __add__(self, o): return self._op(o, '+', lambda a, b: a + b)
    def __radd__(self, o): return self._op(o, '+', lambda a, b: a + b, True)
    def __sub__(self, o): return self._op(o, '-', lambda a, b: a - b)
    def __rsub__(self, o): return self._op(o, '-', lambda a, b: a - b, True)
    def __mul__(self, o): return self._op(o, '*', lambda a, b: a * b)
    def __rmul__(self, o): return self._op(o, '*', lambda a, b: a * b, True)
    def __truediv__(self, o): return self._op(o, '/', lambda a, b: a / b if b != 0 else math.nan)
    def __rtruediv__(self, o): return self._op(o, '/', lambda a, b: a / b if b != 0 else math.nan, True)


def L(x):
    return E.of(x)


def sym(var):
    return E(None, var)


def sq(x):
    return x * x


# --------------------------------------------- the Annex B form, with switches
def annexB(p, o, T):
    """The IEC 61508-6 Annex B low demand PFDavg, written from the equations,
    with discriminate.mjs's switch for every mistake the traps aim. All
    switches off is the correct form. T is the proof test interval, an E."""
    g = o.get
    arch = p['architecture']
    lDU = L(p['lambdaDuPerHour'])
    lDD = L(0.0) if g('ddIgnored') else L(p.get('lambdaDdPerHour', 0.0))
    mrt = L(0.0) if g('mrtIgnored') else L(p.get('mrtHours', 0.0))
    mttr = L(p.get('mttrHours', 0.0))
    ptc = 1.0 if g('coverageIgnored') else float(p.get('proofTestCoverage', 1.0))
    T2 = L(p['lifetimeHours']) if 'lifetimeHours' in p else T
    redundant = arch in ('1oo2', '2oo3', '1oo3')
    b = L(p.get('beta', 0.0) if (redundant or g('betaOn2oo2')) else 0.0)
    if redundant or g('betaOn2oo2'):
        bD = L(p.get('beta', 0.0) if g('betaDasBeta') else p.get('betaD', 0.0))
    else:
        bD = L(0.0)
    lD = lDU + lDD

    def div(j):
        return L(1.0 if (g('noHalf1oo1') and j == 1) else float(j + 1))

    def du(j):
        cov = T / div(j) + mrt
        if ptc == 1.0:
            return cov
        unc = (T2 if g('uncoveredAtFullLifetime') else T2 / div(j)) + mrt
        return L(ptc) * cov + (L(0.0) if g('coveredOnly') else (L(1.0) - L(ptc)) * unc)

    def teq(j):
        return (lDU / lD) * du(j) + (lDD / lD) * mttr

    tCE = (T / L(2.0) + mrt) if g('ddAsDu') else teq(1)
    tGE = teq(1 if g('tgeAsHalf') else 2)
    lInd = (lDD + lDU) if g('noOneMinusBeta') else (L(1.0) - bD) * lDD + (L(1.0) - b) * lDU
    ccfDU = b * lDU * ((T + mrt) if g('ccfAtFullInterval') else du(1))
    ccf = ccfDU + bD * lDD * mttr
    if g('tr84'):
        l_ = (L(1.0) - b) * lDU
        if arch == '1oo2':
            return sq(l_) * sq(T) / L(3.0) + b * lDU * T / L(2.0)
        if arch == '2oo3':
            return sq(l_) * sq(T) + b * lDU * T / L(2.0)
        return E(math.nan, "'NaN'::double precision")
    a = g('as') or arch
    if a == '1oo1':
        ind = lD * tCE
    elif a == '2oo2':
        rate = ((L(1.0) - L(p['beta'])) * lDU + (L(1.0) - L(p['betaD'])) * lDD) if g('oneMinusBetaOn2oo2') else lD
        ind = L(1.0 if g('noFactor2') else 2.0) * rate * tCE
    elif a == '1oo2':
        ind = L(2.0) * sq(lInd) * tCE * tGE
    elif a == '2oo3':
        ind = L(3.0 if g('multiplicity3') else 6.0) * sq(lInd) * tCE * tGE
    else:
        return E(math.nan, "'NaN'::double precision")
    with_ccf = redundant or g('betaOn2oo2') or g('as') == '1oo2'
    return ind + ccf if with_ccf else ind


def at(p, t, o=None):
    return annexB(p, o or {}, L(t))


def maxT(p, target, o=None):
    """Longest T1 with PFDavg <= target, by discriminate.mjs's bisection, step
    for step, so the PL/pgSQL below lands on the same double."""
    o = o or {}
    f = lambda t: annexB(p, o, L(t)).v  # noqa: E731
    if not (f(1e-9) < target):
        return math.nan
    lo, hi = 0.0, 1.0
    while f(hi) <= target:
        hi *= 2.0
        if hi > 1e12:
            return math.nan
    k = 0
    while k < 400 and hi - lo > 1e-13 * hi:
        mid = (lo + hi) / 2.0
        if f(mid) <= target:
            lo = mid
        else:
            hi = mid
        k += 1
    return lo


def maxT_sql(p, target, o=None):
    """The same bisection in PL/pgSQL, leaving its answer in v_wrong."""
    ex = annexB(p, o or {}, sym('v_t')).s
    tg = f17(target)
    return f'''  v_t := 1e-09::double precision;
  if not ({ex} < {tg}) then
    v_wrong := 'NaN'::double precision;
  else
    v_lo := 0.0::double precision; v_hi := 1.0::double precision; v_t := v_hi; v_wrong := null;
    while {ex} <= {tg} loop
      v_hi := v_hi * 2.0::double precision; v_t := v_hi;
      if v_hi > 1e12::double precision then v_wrong := 'NaN'::double precision; exit; end if;
    end loop;
    if v_wrong is null then
      for v_k in 1..400 loop
        exit when not (v_hi - v_lo > 1e-13::double precision * v_hi);
        v_mid := (v_lo + v_hi) / 2.0::double precision; v_t := v_mid;
        if {ex} <= {tg} then v_lo := v_mid; else v_hi := v_mid; end if;
      end loop;
      v_wrong := v_lo;
    end if;
  end if;'''


# ------------------------------------------------------------ the LOPA chain
def lopa(s, sif=None, ipls=None, en=None, cm=None):
    """The LOPA chain in the engine's operation order: products from 1, then
    ief x enabling x modifiers, x credited IPL PFDs, over the TMEL."""
    ipls = s['ipls'] if ipls is None else ipls
    en = s['enablingConditions'] if en is None else en
    cm = s['conditionalModifiers'] if cm is None else cm
    credited = [i for i in ipls if i.get('independent') is True and i.get('auditable') is not False]

    def prod(xs, k):
        acc = L(1.0)
        for x in xs:
            acc = acc * L(x[k])
        return acc
    unmit = L(s['initiatingEventFrequencyPerYr']) * prod(en, 'probability') * prod(cm, 'probability')
    mit0 = unmit * prod(credited, 'pfd')
    rrf = mit0 / L(s['tmelPerYr'])
    out = {'unmit': unmit, 'mit0': mit0, 'rrf': rrf, 'reqPfd': L(1.0) / rrf}
    if sif is not None:
        out['mit'] = mit0 * (sif if isinstance(sif, E) else L(sif))
    return out


def decade_of(x):
    r = round(math.log10(x))
    return r if abs(x / 10 ** r - 1) <= 1e-9 else None


def required_sil(rrf):
    p = 1 / rrf
    r = decade_of(p)
    nn = (-r if r is not None else math.ceil(-math.log10(p))) - 1
    return nn


def allind(ipls):
    return [dict(i, independent=True) for i in ipls]


checks = []


def same(what, a, b, eps_rel):
    d = abs(a - b) / abs(b)
    checks.append((what, d, eps_rel))
    if not d <= eps_rel:
        refused.append(f'{what}: {a!r} against {b!r}, relative difference {d} exceeds {eps_rel}')


EPS = 1e-12       # a second-route value against the seeded one, relative
EPS_ROOT = 1e-10  # the Annex B PFDavg at a seeded interval against its budget, relative

S1, S2, S3, S4 = AK['separator'], AK['tank'], AK['compressor'], AK['export']
CAT = S4['catalogue']
USUB = [US['transmitters'], US['logicSolver'], US['valves']]
YSUB = [YO['transmitters2oo3'], YO['logicSolver'], YO['valves']]
T_US = US['transmitters']['proofTestIntervalHours']
T_STRETCH = YO['stretchedIntervalHours']
SIL_PFD_MAX = {1: 0.1, 2: 0.01, 3: 0.001, 4: 0.0001}
SIL_PFD_MIN = {1: 0.01, 2: 0.001, 3: 0.0001, 4: 0.00001}


def total(parts):
    acc = L(0.0)
    for x in parts:
        acc = acc + x
    return acc


def sub(p, t):
    return dict(p, proofTestIntervalHours=t)


# ------------------------------------------------ the second route, as E
exp_sil = required_sil(lopa(S4)['rrf'].v)
if exp_sil != 1:
    refused.append(f'the export row snaps to SIL {exp_sil}, and the Associate capstone is built on the exact decade 100 at SIL 1')
ROUTE = {
    'akpo_separator_unmitigated_frequency_per_yr': lopa(S1)['unmit'],
    'akpo_separator_required_rrf': lopa(S1)['rrf'],
    'akpo_tank_mitigated_frequency_without_sif_per_yr': lopa(S2)['mit0'],
    'akpo_tank_required_sif_pfdavg': lopa(S2)['reqPfd'],
    'akpo_compressor_mitigated_frequency_with_sif_per_yr': lopa(S3, S3['sifPfdAvg'])['mit'],
    'akpo_export_catalogue_sif_mitigated_frequency_per_yr': lopa(S4, CAT['sil1'])['mit'],
    'usan_transmitters_2oo3_pfdavg': at(US['transmitters'], T_US),
    'usan_logic_solver_1oo1_pfdavg': at(US['logicSolver'], T_US),
    'usan_valves_1oo2_pfdavg': at(US['valves'], T_US),
    'usan_sif_rrf': L(1.0) / total([at(p, T_US) for p in USUB]),
    'usan_proposed_2oo2_transmitters_pfdavg': at(US['proposed2oo2'], T_US),
    'usan_mitigated_frequency_with_sif_per_yr': lopa(US['lopaRow'], total([at(p, T_US) for p in USUB]))['mit'],
    'yoho_valve_1oo1_ptc_pfdavg': at(YO['singleValve'], YO['singleValve']['proofTestIntervalHours']),
    'yoho_transmitter_ptc_floor_pfdavg': at(YO['transmitter'], 0.0),
    'yoho_sif_rrf_at_three_year_interval': L(1.0) / total([at(p, T_STRETCH) for p in YSUB]),
}
ROOTS = {
    'yoho_valves_1oo2_max_interval_hours': (YO['valves'], YO['valveBudgetPfdAvg'], 'the valves\' budget'),
    'yoho_valve_1oo1_ptc_max_interval_hours': (YO['singleValve'], YO['singleValveTargetPfdAvg'], 'the single valve\'s target'),
    'yoho_transmitters_2oo3_max_interval_hours': (YO['transmitters2oo3'], YO['transmitterBudgetPfdAvg'], 'the transmitters\' budget'),
}
if set(ROUTE) | set(ROOTS) != set(KEYS) or set(ROUTE) & set(ROOTS):
    refused.append('the second route does not cover every graded field exactly once')
for k, e in ROUTE.items():
    same(f'second route {k}', e.v, F[k], EPS)
for k, (p, target, _w) in ROOTS.items():
    same(f'root {k}: Annex B PFDavg at the seeded interval against {target}', at(p, F[k]).v, target, EPS_ROOT)
    move = abs(at(p, F[k] * 1.0000001).v / target - 1)
    checks.append((f'a 1e-7 move of {k} moves its PFDavg by {move:.3e} relative', 0.0, 0.0))
    if move < 100 * EPS_ROOT:
        refused.append(f'the root check of {k} moves only {move} for a 1e-7 move, under 100 times its eps')
# The tiers' points, on these inputs.
if not (lopa(S4)['rrf'].v > 100.0 and decade_of(lopa(S4)['rrf'].v) == 2):
    refused.append('the export row is not a double just above the exact decade 100')
if not (lopa(S4, CAT['sil1'])['mit'].v > S4['tmelPerYr']):
    refused.append('the SIL 1 catalogue design meets the export TMEL, and the capstone is built on it missing')
if not (lopa(S3, S3['sifPfdAvg'])['mit'].v < S3['tmelPerYr']):
    refused.append('the compressor SIF does not meet its TMEL')
if not (F['usan_mitigated_frequency_with_sif_per_yr'] < US['lopaRow']['tmelPerYr']):
    refused.append('the USAN SIF does not close its row')
if not (F['yoho_transmitter_ptc_floor_pfdavg'] >= YO['transmitterTargetPfdAvg']):
    refused.append('the YOHO transmitter floor sits below its target, so the target is achievable')
if not (F['yoho_valve_1oo1_ptc_max_interval_hours'] < 8760 < F['yoho_valves_1oo2_max_interval_hours']):
    refused.append('the YOHO intervals do not fall either side of one year as the capstone is built')

# ------------------------------------------------------- the traps, as E
usParts = [at(p, T_US) for p in USUB]
usSum = total(usParts)
usRow = US['lopaRow']
usWithout = lopa(usRow)['mit0']
yoParts1 = [at(p, p['proofTestIntervalHours']) for p in YSUB]
yoParts3 = [at(p, T_STRETCH) for p in YSUB]


def prodE(xs):
    acc = L(1.0)
    for x in xs:
        acc = acc * x
    return acc


def sumP(xs):
    acc = L(0.0)
    for x in xs:
        acc = acc + L(x['probability'])
    return acc


def mx(xs):
    m = max(xs, key=lambda e: e.v)
    return m


s2sil = required_sil(lopa(S2)['rrf'].v)
unsnapped = 3 if lopa(S4)['rrf'].v > 1000 else (2 if lopa(S4)['rrf'].v > 100 else 1)
Yv, Ys, Yt, Y23 = YO['valves'], YO['singleValve'], YO['transmitter'], YO['transmitters2oo3']
# ('why', E) or ('why', ('maxT', p, target, o))
TRAPS = {
    'akpo_separator_unmitigated_frequency_per_yr': [
        ('enabling condition forgotten', lopa(S1, en=[])['unmit']),
        ('modifiers forgotten', lopa(S1, cm=[])['unmit']),
        ('initiating frequency alone', L(S1['initiatingEventFrequencyPerYr'])),
        ('credited ipl applied', lopa(S1)['mit0']),
        ('probabilities summed', L(S1['initiatingEventFrequencyPerYr']) * (sumP(S1['enablingConditions']) + sumP(S1['conditionalModifiers'])))],
    'akpo_separator_required_rrf': [
        ('non independent ipl credited', lopa(S1, ipls=allind(S1['ipls']))['rrf']),
        ('enabling condition forgotten', lopa(S1, en=[])['rrf']),
        ('modifiers forgotten', lopa(S1, cm=[])['rrf']),
        ('ratio inverted', L(1.0) / lopa(S1)['rrf']),
        ('no ipl credited', lopa(S1, ipls=[])['rrf'])],
    'akpo_tank_mitigated_frequency_without_sif_per_yr': [
        ('non independent ipl credited', lopa(S2, ipls=allind(S2['ipls']))['mit0']),
        ('enabling conditions forgotten', lopa(S2, en=[])['mit0']),
        ('second enabling condition forgotten', lopa(S2, en=S2['enablingConditions'][:1])['mit0']),
        ('modifier forgotten', lopa(S2, cm=[])['mit0']),
        ('ipls not applied', lopa(S2)['unmit'])],
    'akpo_tank_required_sif_pfdavg': [
        ('required rrf reported', lopa(S2)['rrf']),
        ('non independent ipl credited', lopa(S2, ipls=allind(S2['ipls']))['reqPfd']),
        ('band ceiling of the required sil', L(SIL_PFD_MAX[s2sil])),
        ('band floor of the required sil', L(SIL_PFD_MIN[s2sil])),
        ('enabling conditions forgotten', lopa(S2, en=[])['reqPfd'])],
    'akpo_compressor_mitigated_frequency_with_sif_per_yr': [
        ('sif not applied', lopa(S3)['mit0']),
        ('sif at the sil band ceiling', lopa(S3, 0.01)['mit']),
        ('required pfdavg used for the sif', lopa(S3, lopa(S3)['reqPfd'])['mit']),
        ('fatal injury modifier forgotten', lopa(S3, S3['sifPfdAvg'], cm=S3['conditionalModifiers'][:2])['mit']),
        ('gas detection not credited', lopa(S3, S3['sifPfdAvg'], ipls=[])['mit'])],
    'akpo_export_catalogue_sif_mitigated_frequency_per_yr': [
        ('exact decade put in the higher sil', lopa(S4, CAT['sil2'])['mit']),
        ('unsnapped float comparison', lopa(S4, CAT[f'sil{unsnapped}'])['mit']),
        ('sif not applied', lopa(S4)['mit0']),
        ('non independent ipl credited', lopa(S4, CAT['sil1'], ipls=allind(S4['ipls']))['mit']),
        ('required pfdavg used for the sif', lopa(S4, lopa(S4)['reqPfd'])['mit'])],
    'usan_transmitters_2oo3_pfdavg': [
        (w, annexB(US['transmitters'], {o: True}, L(T_US))) for w, o in (
            ('multiplicity three for six', 'multiplicity3'), ('no one minus beta', 'noOneMinusBeta'),
            ('group down time at t over two', 'tgeAsHalf'), ('mrt ignored', 'mrtIgnored'),
            ('detected failures ignored', 'ddIgnored'), ('tr84 simplified form', 'tr84'),
            ('beta used for betad', 'betaDasBeta'))],
    'usan_logic_solver_1oo1_pfdavg': [
        (w, annexB(US['logicSolver'], {o: True}, L(T_US))) for w, o in (
            ('half dropped in 1oo1', 'noHalf1oo1'), ('mrt ignored', 'mrtIgnored'),
            ('detected failures ignored', 'ddIgnored'), ('detected failures treated as undetected', 'ddAsDu'))],
    'usan_valves_1oo2_pfdavg': [
        (w, annexB(US['valves'], {o: True}, L(T_US))) for w, o in (
            ('no one minus beta', 'noOneMinusBeta'), ('group down time at t over two', 'tgeAsHalf'),
            ('mrt ignored', 'mrtIgnored'), ('detected failures ignored', 'ddIgnored'),
            ('tr84 simplified form', 'tr84'), ('common cause over the full interval', 'ccfAtFullInterval'))],
    'usan_sif_rrf': [
        ('product of subsystem pfdavg', L(1.0) / prodE(usParts)),
        ('weakest subsystem only', L(1.0) / mx(usParts)),
        ('logic solver left out', L(1.0) / (usParts[0] + usParts[2])),
        ('sum of subsystem rrfs', total([L(1.0) / x for x in usParts])),
        ('valves as 1oo1', L(1.0) / (usParts[0] + usParts[1] + at(dict(US['valves'], architecture='1oo1'), T_US)))],
    'usan_proposed_2oo2_transmitters_pfdavg': [
        ('beta applied to 2oo2', annexB(US['proposed2oo2'], {'betaOn2oo2': True}, L(T_US))),
        ('one minus beta applied to 2oo2', annexB(US['proposed2oo2'], {'oneMinusBetaOn2oo2': True}, L(T_US))),
        ('the 1oo2 formula', at(dict(US['proposed2oo2'], architecture='1oo2'), T_US)),
        ('the 1oo1 formula', at(dict(US['proposed2oo2'], architecture='1oo1'), T_US)),
        ('the 2oo3 result reused', at(US['transmitters'], T_US))],
    'usan_mitigated_frequency_with_sif_per_yr': [
        ('sif not applied', usWithout),
        ('product of subsystem pfdavg', usWithout * prodE(usParts)),
        ('required pfdavg used for the sif', usWithout * lopa(usRow)['reqPfd']),
        ('sil band ceiling used', usWithout * L(0.01)),
        ('relief not credited', lopa(usRow, usSum, ipls=[])['mit']),
        ('valves only', usWithout * usParts[2])],
    'yoho_valves_1oo2_max_interval_hours': [
        ('group down time at t over two', ('maxT', Yv, YO['valveBudgetPfdAvg'], {'tgeAsHalf': True})),
        ('no one minus beta', ('maxT', Yv, YO['valveBudgetPfdAvg'], {'noOneMinusBeta': True})),
        ('mrt ignored', ('maxT', Yv, YO['valveBudgetPfdAvg'], {'mrtIgnored': True})),
        ('common cause over the full interval', ('maxT', Yv, YO['valveBudgetPfdAvg'], {'ccfAtFullInterval': True})),
        ('budget read as the sil band ceiling', ('maxT', Yv, 0.01, {})),
        ('linear scaling from one year', L(8760.0) * L(YO['valveBudgetPfdAvg']) / at(Yv, Yv['proofTestIntervalHours']))],
    'yoho_valve_1oo1_ptc_pfdavg': [
        (w, annexB(Ys, {o: True}, L(Ys['proofTestIntervalHours']))) for w, o in (
            ('coverage ignored', 'coverageIgnored'), ('uncovered part over the full lifetime', 'uncoveredAtFullLifetime'),
            ('mrt ignored', 'mrtIgnored'), ('covered part only', 'coveredOnly'), ('half dropped in 1oo1', 'noHalf1oo1'))],
    'yoho_valve_1oo1_ptc_max_interval_hours': [
        (w, ('maxT', Ys, YO['singleValveTargetPfdAvg'], {o: True})) for w, o in (
            ('coverage ignored', 'coverageIgnored'), ('uncovered part over the full lifetime', 'uncoveredAtFullLifetime'),
            ('mrt ignored', 'mrtIgnored'), ('covered part only', 'coveredOnly'), ('half dropped in 1oo1', 'noHalf1oo1'))],
    'yoho_transmitter_ptc_floor_pfdavg': [
        (w, annexB(Yt, {o: True}, L(0.0))) for w, o in (
            ('coverage ignored', 'coverageIgnored'), ('uncovered part over the full lifetime', 'uncoveredAtFullLifetime'),
            ('mrt ignored', 'mrtIgnored'), ('detected failures left out', 'ddIgnored'))] + [
        ('the one year pfdavg reported', at(Yt, Yt['proofTestIntervalHours']))],
    'yoho_sif_rrf_at_three_year_interval': [
        ('one year rrf divided by three', L(1.0) / (L(3.0) * total(yoParts1))),
        ('only the valves stretched', L(1.0) / (yoParts1[0] + yoParts1[1] + yoParts3[2])),
        ('one year rrf kept', L(1.0) / total(yoParts1)),
        ('product of subsystem pfdavg', L(1.0) / prodE(yoParts3)),
        ('logic solver left out', L(1.0) / (yoParts3[0] + yoParts3[2]))],
    'yoho_transmitters_2oo3_max_interval_hours': [
        (w, ('maxT', Y23, YO['transmitterBudgetPfdAvg'], {o: True})) for w, o in (
            ('multiplicity three for six', 'multiplicity3'), ('no one minus beta', 'noOneMinusBeta'),
            ('group down time at t over two', 'tgeAsHalf'), ('mrt ignored', 'mrtIgnored'),
            ('detected failures ignored', 'ddIgnored'))],
}
if set(TRAPS) != set(KEYS):
    refused.append('the traps do not cover every graded field')


def trap_value(t):
    if isinstance(t, E):
        return t.v
    _m, p, target, o = t
    return maxT(p, target, o)


NTRAPS = sum(len(v) for v in TRAPS.values())
TRAPVAL = {}
for k, traps in TRAPS.items():
    if len(traps) < 3:
        refused.append(f'{k} has {len(traps)} traps; three is the floor discriminate.mjs holds every route to')
    for why, t in traps:
        v = trap_value(t)
        TRAPVAL[(k, why)] = v
        if not math.isnan(v) and abs(v - F[k]) <= TOL[k]:
            refused.append(f'{k}: {why} gives {v}, within the tolerance of the graded {F[k]}, so the trap does not bite')

# THE PYTHON MIRROR AGAINST discriminate.mjs's OWN VALUES. Every trap here is a
# wrong method discriminate.mjs already swept through the engine; if the two
# disagree, one of them is not the method it names.
DISC = os.path.join(W, 'discriminate.mjs')
DISC_CHECKED = 0
if os.path.exists(DISC):
    r = subprocess.run(['node', DISC, '--values'], capture_output=True, text=True,
                       env=dict(os.environ, H3_WAVE_DIR=W, H3_ENGINES=GC.ENGINES))
    got = {}
    for m in re.finditer(r'^\s*wrong (\S+) (\S+) = (\S+)$', r.stdout, re.M):
        got[(m.group(1), m.group(2).replace('_', ' '))] = float(m.group(3))
    if len(got) != NTRAPS:
        refused.append(f'discriminate.mjs --values printed {len(got)} wrong methods and this go-live carries {NTRAPS}')
    for (k, why), v in TRAPVAL.items():
        d = got.get((k, why))
        if d is None:
            refused.append(f'{k}: the trap {why!r} is not a wrong method discriminate.mjs sweeps')
            continue
        DISC_CHECKED += 1
        if math.isnan(v) != math.isnan(d) or (not math.isnan(v) and abs(v - d) > 1e-9 * abs(d)):
            refused.append(f'{k}: {why} is {v} here and {d} in discriminate.mjs')
else:
    refused.append(f'no discriminate.mjs at {DISC}, so the traps cannot be checked against the engine sweep')

# ---------------------------------------------------------------------------
# THE SQL
# ---------------------------------------------------------------------------
HEADER = f"""-- ============================================================================
-- H3 GO-LIVE (HELD): Process Safety: LOPA & SIL Determination flips to
-- 'available', the THIRD course of the HSE module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/lopa. The 78 lessons, the teaching lab (lopaLab.js)
-- and its three explorer panels (the worksheet, the SIF builder and the proof
-- test) ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist. This file
-- is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h3_capstone.mjs returned through
--      the vendored engines/hse/lopa.js when this file was generated, to the
--      last bit, so a capstone row an earlier seed left behind, or a move of
--      one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and carries every input fragment, then recomputes the LOPA chains
--      as products and quotients (finding the export row's SIL itself, through
--      the decade snap), every subsystem by the Annex B form term by term and
--      the SIF as their sum, and asserts the three longest intervals BY THE
--      EQUATION THEY ARE A ROOT OF (the Annex B PFDavg at the seeded interval
--      lands on its budget) and the coverage floor as the form at an interval
--      of zero;
--   3. by the TRAPS the course is built on, {NTRAPS} wrong methods, each of which
--      must bite on these inputs: the reading a learner who missed the lesson
--      would give is computed (the interval ones by a bisection in PL/pgSQL)
--      and refused if it lands within the field's tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Frequencies and
-- PFDavg values are graded at twelve decimals (tolerance 5e-13), risk
-- reduction factors and hours at six (5e-7). Every field must carry a positive,
-- non-whole expected value at its class's tolerance with a label and a unit,
-- the answer the prompt asks for must pass, and one unit either side of it in
-- the last asked decimal must fail. All of it is asserted here, on the rows as
-- seeded.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses to emit a bare integer
-- denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

K12 = [k for k in KEYS if DP[k] == 12]
K6 = [k for k in KEYS if DP[k] == 6]


def inlist(keys):
    return '(' + ', '.join(lit(k) for k in keys) + ')'


BODY = []
A = BODY.append
A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int; v_k int;')
A('  v_names text; v_prompt text; v_x double precision; v_wrong double precision; v_sil int;')
A('  v_t double precision; v_lo double precision; v_hi double precision; v_mid double precision;')
for k in KEYS:
    A(f'  {V[k]} double precision;')
A('begin')

A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'H3 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'H3 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'H3 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'H3 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'H3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'H3 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'H3 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'H3 go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'H3 go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at its class's tolerance (twelve
  -- decimals at 5e-13, six at 5e-7), with a label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or (f->>'expected')::numeric = round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> case when f->>'key' in {inlist(K6)} then 0.0000005 else 0.0000000000005 end
          or (f->>'key') not in {inlist(KEYS)}
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) are not a positive non-whole number at their class tolerance with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to its class's decimals, must pass
  -- abs(answer - expected) <= tol in numeric exactly as academy_submit_capstone
  -- computes it, and one unit in the last decimal either side of it must fail.
  select count(*), string_agg(t.tier || '/' || t.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric tl,
                 case when f->>'key' in {inlist(K6)} then 6 else 12 end dp
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') t
   where abs(round(t.e, t.dp) - t.e) > t.tl
      or abs(round(t.e, t.dp) + power(10::numeric, -t.dp) - t.e) <= t.tl
      or abs(round(t.e, t.dp) - power(10::numeric, -t.dp) - t.e) <= t.tl;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) either fail the answer the prompt asks for or pass one a unit off in its last decimal: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------------ the prompts
PROMPT_BLOCKS = []
for tier in GC.TIERS:
    md5 = hashlib.md5(GC.PROMPTS[tier].encode('utf-8')).hexdigest()
    frs = GC.FRAG[tier]
    for fr in frs:
        if fr not in GC.PROMPTS[tier]:
            refused.append(f'{tier}: a fragment is not in the rendered prompt')
    arr = ', '.join(lit(x) for x in frs)
    PROMPT_BLOCKS.append(f'''
  -- {tier}: the rendered prompt, byte for byte, and the dataset and title.
  select prompt into v_prompt from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}';
  if md5(v_prompt) <> '{md5}' then
    raise exception 'H3 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}'
                    and cert_tier = {lit(GC.TIER[tier][0])} and dataset = {lit(GC.TIER[tier][1])} and title = {lit(GC.TIER[tier][2])}) then
    raise exception 'H3 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every input fragment the second route reads is stated, matched as a
  -- literal substring with strpos (an underscore or a percent sign in a LIKE
  -- pattern is a wildcard).
  select count(*) into v_n from unnest(array[{arr}]) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % {tier} input fragment(s) the second route reads are not stated in the shipped prompt', v_n;
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
A(f"    raise exception 'H3 go-live refused: one or more of the eighteen graded fields is missing{name(*KEYS)}';")
A('  end if;')

DIGEST_NUMS = GC.DIGEST_NUMS
PROMPT_NUMS = sum(len(GC.NUM.findall(GC.PROMPTS[t].replace(',', ''))) for t in GC.TIERS)
NUMRE = '([0-9]+(\\.[0-9]+)?(e-[0-9]+)?)'
A(f'''
  -- ---------------------------------------------------- the collision sweeps
  -- PROMPTLEAK, IN SQL. No number in any prompt, dataset, title or label of
  -- this course, exponent spellings read as the numbers they are, lands within
  -- a graded field's tolerance of a graded value of ANY tier. A different tier
  -- is a leak and the same tier a transcription; both are refused.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' in the ' || p.tier || ' capstone text', ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(
           replace(p.prompt || ' ' || p.dataset || ' ' || p.title || ' '
                   || (select string_agg((pf->>'label') || ' ' || (pf->>'unit'), ' ') from jsonb_array_elements(p.fields) pf),
                   ',', ''),
           '{NUMRE}', 'g') as m
   where c.app_slug = '{SLUG}' and p.app_slug = '{SLUG}'
     and abs((f->>'expected')::double precision - (m[1])::double precision) <= (f->>'tol')::double precision;
  if v_n <> 0 then
    raise exception 'H3 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner
  -- {PROMPT_NUMS} numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '{NUMRE}', 'g') m
   where p.app_slug = '{SLUG}';
  if v_n < {PROMPT_NUMS} then
    raise exception 'H3 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
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
    raise exception 'H3 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
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
    raise exception 'H3 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine ledger
A('\n  -- ------------------------------------------ 1. against the engine ledger')
A('  -- The values h3_capstone.mjs returned through the vendored engine, to the')
A('  -- last bit. A seeded value that is not the engine\'s is refused by name.')
for k in KEYS:
    A(f'''  if {V[k]} <> {f17(ENGINE[k])} then
    raise exception 'H3 go-live refused: the seeded value % is not the {ENGINE[k]!r} the engine returned{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
WHAT = {
    'akpo_separator_unmitigated_frequency_per_yr': 'the separator row, the initiating event frequency times its enabling condition and both modifiers,',
    'akpo_separator_required_rrf': 'the separator row with only its independent alarm credited, over its TMEL,',
    'akpo_tank_mitigated_frequency_without_sif_per_yr': 'the tank row with only its independent alarm credited',
    'akpo_tank_required_sif_pfdavg': 'one over the tank row\'s required risk reduction factor',
    'akpo_compressor_mitigated_frequency_with_sif_per_yr': 'the compressor row through its proposed SIF',
    'akpo_export_catalogue_sif_mitigated_frequency_per_yr': 'the export row through the SIL 1 catalogue design',
    'usan_transmitters_2oo3_pfdavg': 'the Annex B 2oo3 form for the transmitters',
    'usan_logic_solver_1oo1_pfdavg': 'the Annex B 1oo1 form for the logic solver',
    'usan_valves_1oo2_pfdavg': 'the Annex B 1oo2 form for the valves',
    'usan_sif_rrf': 'one over the series sum of the three subsystems',
    'usan_proposed_2oo2_transmitters_pfdavg': 'the Annex B 2oo2 form, with no beta factor term,',
    'usan_mitigated_frequency_with_sif_per_yr': 'the USAN row through the summed SIF',
    'yoho_valve_1oo1_ptc_pfdavg': 'the Annex B 1oo1 form with the coverage split of the DU down time',
    'yoho_transmitter_ptc_floor_pfdavg': 'the transmitter\'s Annex B form at a proof test interval of zero',
    'yoho_sif_rrf_at_three_year_interval': 'one over the series sum with every interval stretched',
}
ROUTE_SQL = []
for k in KEYS:
    if k in ROUTE:
        ROUTE_SQL.append(f'''  v_x := {ROUTE[k].s};
  if abs(v_x - {V[k]}) > {EPS!r} * abs({V[k]}) then
    raise exception 'H3 go-live refused: {WHAT[k].replace("'", "''")} gives % in SQL, against the seeded %{name(k)}', v_x, {V[k]};
  end if;''')
    else:
        p, target, what = ROOTS[k]
        ROUTE_SQL.append(f'''  v_x := {annexB(p, {}, sym(V[k])).s};
  if abs(v_x - {f17(target)}) > {EPS_ROOT!r} * {f17(target)} then
    raise exception 'H3 go-live refused: the Annex B PFDavg at the seeded interval % hours is %, and the longest interval lands on {what.replace("'", "''")}, {target!r}{name(k)}', {V[k]}, v_x;
  end if;''')

S4r = lopa(S4)['rrf']
A(f'''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, AKPO. Each LOPA chain as products and quotients of the stated
  -- inputs, crediting only the layers flagged independent. The export row's
  -- required SIL is found HERE, through the decade snap: its required risk
  -- reduction factor is a double just above 100, a plain comparison bands it
  -- SIL 2, and within one part in a billion of a decade it IS the decade, SIL 1.
  -- PROFESSIONAL, USAN, and EXPERT, YOHO. Every subsystem by the IEC 61508-6
  -- Annex B form written out term by term; the SIF as the series sum; each
  -- longest interval as the root it is.
  v_x := {S4r.s};
  if not (v_x > 100.0::double precision) then
    raise exception 'H3 go-live refused: the export row''s required risk reduction factor % is not a double above 100, so it teaches no snap', v_x;
  end if;
  v_sil := case when abs(v_x / power(10.0::double precision, round(log(v_x))) - 1.0::double precision) <= 1e-09::double precision
                then round(log(v_x))::int - 1
                else ceil(log(v_x))::int - 1 end;
  if v_sil <> 1 then
    raise exception 'H3 go-live refused: the decade snap puts the export row at SIL %, and it is built on the exact decade at SIL 1', v_sil;
  end if;
  v_x := {lopa(S4)['mit0'].s} * (case v_sil when 1 then {f17(CAT['sil1'])} when 2 then {f17(CAT['sil2'])} else {f17(CAT['sil3'])} end);
  if abs(v_x - {V['akpo_export_catalogue_sif_mitigated_frequency_per_yr']}) > {EPS!r} * abs({V['akpo_export_catalogue_sif_mitigated_frequency_per_yr']}) then
    raise exception 'H3 go-live refused: the catalogue design Postgres selects gives %, against the seeded %{name('akpo_export_catalogue_sif_mitigated_frequency_per_yr')}', v_x, {V['akpo_export_catalogue_sif_mitigated_frequency_per_yr']};
  end if;
''')
for b in ROUTE_SQL:
    A(b)
A(f'''  -- The tiers' points, on these inputs: the SIL 1 catalogue design sits in the
  -- band the export row requires and still misses its TMEL; the USAN SIF closes
  -- its row; the YOHO transmitter's floor sits at or above its target, so no
  -- interval reaches it; and the two valve intervals fall either side of a year.
  if not ({V['akpo_export_catalogue_sif_mitigated_frequency_per_yr']} > {f17(S4['tmelPerYr'])}) then
    raise exception 'H3 go-live refused: the SIL 1 catalogue design meets the export TMEL{name('akpo_export_catalogue_sif_mitigated_frequency_per_yr')}';
  end if;
  if not ({V['usan_mitigated_frequency_with_sif_per_yr']} < {f17(US['lopaRow']['tmelPerYr'])}) then
    raise exception 'H3 go-live refused: the USAN SIF does not close its row{name('usan_mitigated_frequency_with_sif_per_yr')}';
  end if;
  if not ({V['yoho_transmitter_ptc_floor_pfdavg']} >= {f17(YO['transmitterTargetPfdAvg'])}) then
    raise exception 'H3 go-live refused: the transmitter floor sits below its target, so the target is achievable{name('yoho_transmitter_ptc_floor_pfdavg')}';
  end if;
  if not ({V['yoho_valve_1oo1_ptc_max_interval_hours']} < 8760.0::double precision and {V['yoho_valves_1oo2_max_interval_hours']} > 8760.0::double precision) then
    raise exception 'H3 go-live refused: the two valve intervals do not fall either side of a year{name('yoho_valve_1oo1_ptc_max_interval_hours', 'yoho_valves_1oo2_max_interval_hours')}';
  end if;''')

# ------------------------------------------------------ 3. the traps bite
A('\n  -- ------------------------------------------------- 3. the traps bite')
A('  -- Each wrong reading is computed over the same inputs and must MISS the')
A('  -- graded value by more than its tolerance, or the field does not')
A('  -- discriminate the trap it is for. A wrong method with no answer at all')
A('  -- (NaN) misses by construction.')
for k in KEYS:
    for why, t in TRAPS[k]:
        if isinstance(t, E):
            A(f'  v_wrong := {t.s};')
        else:
            _m, p, target, o = t
            A(maxT_sql(p, target, o))
        A(f'''  if v_wrong is null or (v_wrong <> 'NaN'::double precision and abs(v_wrong - {V[k]}) <= {TOL[k]!r}) then
    raise exception 'H3 go-live refused: the {why} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', v_wrong, {V[k]};
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'H3 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H3 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
    print(f'second route in SQL: 18 fields, 3 of them as roots of the Annex B form | traps that must bite: '
          f'{NTRAPS} over 18 fields, {DISC_CHECKED} matched to discriminate.mjs to 1e-9')
    print(f'digest sweep: {len(DIGEST_NUMS)} numbers | graded fields named by a refusal: '
          f'{len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
    print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
    print('every identity the second route asserts, checked here first in Python:')
    for what, diff, eps in checks:
        print(f'  {diff:.3e} <= {eps:.0e}  {what}')
