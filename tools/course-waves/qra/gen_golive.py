#!/usr/bin/env python3
"""Generate the H5 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction.
They are then checked three ways, and none of the three is a restatement of the
generator that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node h5_capstone.mjs --json`
   through the vendored engines/hse/qra.js when this file is generated, and
   refuses unless fields.json carries exactly what that run returned. The values
   the go-live compares the seeded rows to are THAT RUN'S, emitted to the last
   bit, so a capstone row an earlier seed left behind (the course migration
   inserts with `on conflict do nothing`) is refused here by name, and so is a
   move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL, over the inputs the learner is handed. Every
   graded value is recomputed by Postgres with no engine code at all: the two
   event trees as products of their stated branch probabilities; each LSIR as
   the sum of f times the stated probability of death; each IRPA as the sum of
   LSIR times the fraction of the year (hours over 8760); the PLL as the sum of
   f times N and the FAR over the crew's exposed hours per 100,000,000; the
   frequency of N or more deaths as a sum over the scenarios with N at or above
   ten; the worst ratio to the line F = C / N^2 as the greatest of the corner
   ratios, which is exact on a step function; the exceedance range's lower end
   as the greatest of the previous corner, the line's smallest N and
   sqrt(C / F); the ratio to the R2P2 point; and every present value year by
   year, the benefit uprated and discounted at its rates and the cost at its
   own, so the cost to benefit ratio, the ICAF over the UNDISCOUNTED fatalities
   prevented, and DF times the benefit follow.

   AND THE INPUTS IT READS ARE THE INPUTS THE LEARNER READS. Each shipped prompt
   must be the prompt gen_course.py rendered from the engine's own inputs, byte
   for byte (md5), and every rendered fragment carrying an input must be in it.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE on these inputs. Every
   wrong method discriminate.mjs sweeps (91 over 18 fields: the split swapped,
   delayed ignition taken as unconditional, one leaf read for a pooled outcome,
   probabilities of death summed without their frequencies, hours over 8766,
   occupancy ignored, f over N, one person's hours for the crew's, "more than
   N", a non-cumulative curve, the crossing of the previous step, benefits
   discounted from year 0, the growth ignored, fatalities discounted, the ICAF
   net of injuries, and the rest) is recomputed here and must miss the graded
   value by more than the field's own tolerance. The Python mirror of every
   trap is checked against discriminate.mjs's own values first.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field no refusal names; a division with a bare integer
denominator; an unclosed literal; an em or en dash; a go-live whose engine run
and fields.json disagree (gen_course.py refuses that first); a second route or
a trap that does not first pass, or fail, in the Python mirror below.

Usage: python3 gen_golive.py
   H5_WAVE        the wave directory (default /root/hse-wip-qra)
   H5_REPO        the nextgen clone   (default /root/wt-h5-nextgen)
   H5_ENGINES     packages/engines to run the capstone through
   H5_TOLERANCE   gradedTolerance.js
   H5_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   H5_GOLIVE_OUT  where to write
"""
import hashlib
import json
import math
import os
import re
import subprocess
import sys

W = os.environ.get('H5_WAVE', '/root/hse-wip-qra')
REPO = os.environ.get('H5_REPO', '/root/wt-h5-nextgen')
COURSE = os.environ.get('H5_COURSE_SQL', f'{REPO}/migrations/20261007_h5_qra_course.sql')
OUT = os.environ.get('H5_GOLIVE_OUT', f'{REPO}/migrations/20261007_h5_qra_go_live.sql')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['H5_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL, DP = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL, GC.DP
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
UK, OG, EB = GC.UK, GC.OG, GC.EB
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')

TOL_OF_DP = {12: 5e-13, 6: 5e-7, 2: 0.005}
for k in KEYS:
    if DP.get(k) not in TOL_OF_DP or TOL[k] != TOL_OF_DP[DP[k]]:
        refused.append(f'{k} is graded at {TOL[k]} for {DP.get(k)} decimals; this go-live grades '
                       f'twelve decimals at 5e-13, six at 5e-7 and two at 0.005')


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


def greatest(*xs):
    xs = [E.of(x) for x in xs]
    v = None if any(x.v is None for x in xs) else max(x.v for x in xs)
    return E(v, 'greatest(' + ', '.join(x.s for x in xs) + ')')


def sqrtE(x):
    x = E.of(x)
    return E(None if x.v is None else math.sqrt(x.v), f'sqrt({x.s})')


def powE(a, t):
    """(1 + r) ** t for a whole year t, as JavaScript's Math.pow and Postgres's power."""
    a = E.of(a)
    return E(None if a.v is None else a.v ** t, f'power({a.s}, {float(t)!r}::double precision)')


def total(parts):
    acc = L(0.0)
    for x in parts:
        acc = acc + x
    return acc


def sq(x):
    return x * x


checks = []


def same(what, a, b, eps_rel):
    d = abs(a - b) / abs(b)
    checks.append((what, d, eps_rel))
    if not d <= eps_rel:
        refused.append(f'{what}: {a!r} against {b!r}, relative difference {d} exceeds {eps_rel}')


EPS = 1e-12  # a second-route value against the seeded one, relative
HOURS = 8760.0

# ------------------------------------------------------------ UKPOKITI, E
C_ = UK['compressor']
S_ = UK['sourGas']


def flammable(o=None):
    """The four outcome frequencies of the compressor release, the engine's order."""
    o = o or {}
    f0, pi, pd = L(C_['initiatingFrequencyPerYr']), L(C_['immediateIgnitionProbability']), L(C_['delayedIgnitionProbability'])
    ff, ex = L(o.get('flashFire', C_['vapourCloudSplit']['flashFire'])), L(o.get('explosion', C_['vapourCloudSplit']['explosion']))
    no_imm = L(1.0) - pi
    return {
        'jet or pool fire': f0 * (L(1.0) * pi),
        'flash fire': f0 * (((L(1.0) * no_imm) * pd) * ff),
        'explosion': f0 * (((L(1.0) * no_imm) * pd) * ex),
        'no ignition': f0 * ((L(1.0) * no_imm) * (L(1.0) - pd)),
    }


def tree_totals(t, f0):
    out = {}

    def walk(node, p):
        for b in node['branches']:
            pp = p * L(b['probability'])
            if 'next' in b:
                walk(b['next'], pp)
            else:
                oc = b.get('outcome', b['name'])
                out[oc] = (out[oc] + L(f0) * pp) if oc in out else L(f0) * pp
    walk(t, L(1.0))
    return out


FL = flammable()
SOUR = tree_totals(S_['tree'], S_['initiatingFrequencyPerYr'])
CAMPF = SOUR['camp exposure']
FREQ = dict(FL, **{'camp exposure': CAMPF})
PDS = UK['deathProbability']


def lsir(place, freq=None):
    freq = freq or FREQ
    return total([freq[n_] * L(pd) for n_, pd in PDS[place].items()])


CR, DECK, CAMP = lsir('controlRoom'), lsir('compressorDeck'), lsir('camp')
OP, TE = UK['operator'], UK['technician']


def op_irpa(h=HOURS):
    return (DECK * (L(OP['compressorDeckHoursPerYr']) / L(h))) + (CR * (L(OP['controlRoomHoursPerYr']) / L(h))) + \
        (CAMP * (L(OP['campHoursPerYr']) / L(h)))


TECH = (DECK * L(TE['compressorDeckFraction'])) + (CR * (L(TE['controlRoomHoursPerYr']) / L(HOURS))) + \
    (CAMP * (L(TE['campHoursPerYr']) / L(HOURS)))

# --------------------------------------------------------------- OGINI, E
CREW = OG['crew']
VIL = OG['village']
PLL = total([L(s['frequencyPerYr']) * L(s['fatalities']) for s in CREW])
EXPOSED = L(float(OG['crewPersons'])) * L(float(OG['crewHoursPerPersonPerYr']))
FAR = (PLL * L(1e8)) / EXPOSED
LINE_C, LINE_A, LINE_NMIN = 1e-3, 2.0, 10.0
FL_ = GC.FN_LINE
if not (GC.OG['criterionPreset'] == 'vrom-establishments'):
    refused.append('the OGINI line is not the vrom-establishments preset this second route writes out')


def Fge(nn, scen=VIL):
    return total([L(s['frequencyPerYr']) for s in scen if s['fatalities'] >= nn])


def Fgt(nn):
    return total([L(s['frequencyPerYr']) for s in VIL if s['fatalities'] > nn])


def Feq(nn):
    return total([L(s['frequencyPerYr']) for s in VIL if s['fatalities'] == nn])


def line(nn, c=LINE_C, a=LINE_A):
    return L(c) / (L(float(nn)) ** a if False else L(float(nn) ** a))


CORNERS = sorted({s['fatalities'] for s in VIL if s['fatalities'] >= LINE_NMIN})
ALLCORNERS = sorted({s['fatalities'] for s in VIL if s['fatalities'] > 0})
STEP = OG['exceedanceStepEndsAtFatalities']
PREV = max(n_ for n_ in ALLCORNERS if n_ < STEP)
VROM = greatest(*[Fge(nn) / line(nn) for nn in CORNERS])
FROM = greatest(float(PREV), sqrtE(L(LINE_C) / Fge(STEP)), LINE_NMIN)
POINT_N, POINT_F = 50, 1.0 / 5000.0
R2P2 = Fge(POINT_N) / L(POINT_F)
if CORNERS != [10, 55, 140]:
    refused.append(f'the village corners in range are {CORNERS}; the second route and its prompt are built on 10, 55 and 140')

# -------------------------------------------------------------- EBUGHU, E
MEAS = {'deluge': EB['deluge'], 'blastWall': EB['blastWall'], 'gasDetection': EB['gasDetection']}


def benefit_per_yr(m, harms=True, vpf=None):
    b = L(m['deltaPllPerYr']) * L(m['vpf'] if vpf is None else vpf)
    for h in (m.get('otherHarms') or []) if harms else []:
        b = b + L(h['expectedCasesPerYr']) * L(h['valuePerCase'])
    return b


def pv_benefit(m, r=None, g=None, n=None, year0=False, harms=True, vpf=None):
    r = m.get('benefitDiscountRate', 0.0) if r is None else r
    g = m.get('benefitGrowthRate', 0.0) if g is None else g
    n = m['lifetimeYears'] if n is None else n
    B = benefit_per_yr(m, harms, vpf)
    acc = L(0.0)
    for t in range(1, n + 1):
        acc = acc + (B * powE(L(1.0) + L(g), t)) / powE(L(1.0) + L(r), t - 1 if year0 else t)
    return acc


def pv_cost(m, r=None, n=None, annual=None, capital=None):
    r = m.get('costDiscountRate', 0.0) if r is None else r
    n = m['lifetimeYears'] if n is None else n
    a = m.get('annualCost', 0.0) if annual is None else annual
    c = m['capitalCost'] if capital is None else capital
    acc = L(0.0) + L(c) / powE(L(1.0) + L(r), 0)
    for t in range(1, n + 1):
        acc = acc + L(a) / powE(L(1.0) + L(r), t)
    return acc


def fat(m, n=None):
    return L(m['deltaPllPerYr']) * L(float(m['lifetimeYears'] if n is None else n))


D_, W_, G_ = MEAS['deluge'], MEAS['blastWall'], MEAS['gasDetection']
D_PVB, D_PVC = pv_benefit(D_), pv_cost(D_)
W_PVB, W_PVC = pv_benefit(W_), pv_cost(W_)
G_PVB, G_PVC = pv_benefit(G_), pv_cost(G_)

ROUTE = {
    'ukpokiti_compressor_explosion_frequency_per_yr': FL['explosion'],
    'ukpokiti_camp_exposure_frequency_per_yr': CAMPF,
    'ukpokiti_control_room_lsir_per_yr': CR,
    'ukpokiti_compressor_deck_lsir_per_yr': DECK,
    'ukpokiti_operator_irpa_per_yr': op_irpa(),
    'ukpokiti_technician_irpa_per_yr': TECH,
    'ogini_crew_pll_per_yr': PLL,
    'ogini_crew_far': FAR,
    'ogini_village_frequency_ten_or_more_per_yr': Fge(10),
    'ogini_village_vrom_max_ratio': VROM,
    'ogini_village_exceedance_from_fatalities': FROM,
    'ogini_village_r2p2_point_ratio': R2P2,
    'ebughu_deluge_cost_to_benefit_ratio': D_PVC / D_PVB,
    'ebughu_deluge_icaf_gbp': D_PVC / fat(D_),
    'ebughu_deluge_maximum_reasonably_practicable_cost_gbp': L(float(D_['disproportionFactor'])) * D_PVB,
    'ebughu_blast_wall_cost_to_benefit_ratio': W_PVC / W_PVB,
    'ebughu_blast_wall_icaf_gbp': W_PVC / fat(W_),
    'ebughu_gas_detection_cost_to_benefit_ratio': G_PVC / G_PVB,
}
if set(ROUTE) != set(KEYS):
    refused.append('the second route does not cover every graded field exactly once')
for k, e in ROUTE.items():
    same(f'second route {k}', e.v, F[k], EPS)
# The tiers' points, on these inputs.
if not (D_PVC.v <= float(D_['disproportionFactor']) * D_PVB.v):
    refused.append('the deluge is grossly disproportionate, and the capstone is built on it being reasonably practicable')
if not (W_PVC.v > float(W_['disproportionFactor']) * W_PVB.v and G_PVC.v > float(G_['disproportionFactor']) * G_PVB.v):
    refused.append('the blast wall or the gas detection is reasonably practicable, and the capstone is built on both failing')
if not (VROM.v > 1.0 and R2P2.v < 1.0):
    refused.append('the village curve does not exceed the line and sit below the R2P2 point as the capstone is built')
if not (PREV < FROM.v < STEP):
    refused.append('the exceedance on the stated step does not start inside the step')

# ------------------------------------------------------- the traps, as E
ptoff = lambda place: total([L(pd) for pd in PDS[place].values()])  # noqa: E731


def maxc(place):
    xs = [FREQ[n_] * L(pd) for n_, pd in PDS[place].items()]
    return max(xs, key=lambda e: e.v)


SWAP = flammable({'flashFire': 0.4, 'explosion': 0.6})
B_ = S_['tree']['branches']
f0s = L(S_['initiatingFrequencyPerYr'])
f0c = L(C_['initiatingFrequencyPerYr'])
pi_, pd_ = L(C_['immediateIgnitionProbability']), L(C_['delayedIgnitionProbability'])
TRAPS = {
    'ukpokiti_compressor_explosion_frequency_per_yr': [
        ('split swapped', SWAP['explosion']),
        ('delayed ignition unconditional', f0c * pd_ * L(0.4)),
        ('every delayed ignition an explosion', f0c * (L(1.0) - pi_) * pd_),
        ('immediate probability used for delayed', f0c * pi_ * L(0.4)),
        ('flash fire reported', FL['flash fire']),
        ('no ignition branch used', f0c * (L(1.0) - pi_) * (L(1.0) - pd_) * L(0.4))],
    'ukpokiti_camp_exposure_frequency_per_yr': [
        ('late isolation leaf only', f0s * L(B_[1]['probability']) * L(B_[1]['next']['branches'][0]['probability'])),
        ('failed isolation leaf only', f0s * L(B_[2]['probability']) * L(B_[2]['next']['branches'][0]['probability'])),
        ('one wind probability for both', f0s * (L(B_[1]['probability']) + L(B_[2]['probability'])) * L(B_[1]['next']['branches'][0]['probability'])),
        ('root branch forgotten', f0s * (L(B_[1]['next']['branches'][0]['probability']) + L(B_[2]['next']['branches'][0]['probability']))),
        ('complement reported', SOUR['no camp exposure'])],
    'ukpokiti_control_room_lsir_per_yr': [
        ('pd summed without frequency', ptoff('controlRoom')),
        ('largest contribution only', maxc('controlRoom')),
        ('flash fire at pd one', CR + FREQ['flash fire'] * (L(1.0) - L(PDS['controlRoom']['flash fire']))),
        ('release frequency for every outcome', f0c * ptoff('controlRoom')),
        ('split swapped upstream', lsir('controlRoom', dict(SWAP, **{'camp exposure': CAMPF})))],
    'ukpokiti_compressor_deck_lsir_per_yr': [
        ('pd summed without frequency', ptoff('compressorDeck')),
        ('largest contribution only', maxc('compressorDeck')),
        ('release frequency for every outcome', f0c * ptoff('compressorDeck')),
        ('split swapped upstream', lsir('compressorDeck', dict(SWAP, **{'camp exposure': CAMPF}))),
        ('no ignition counted at deck pd', DECK + FL['no ignition'] * L(PDS['compressorDeck']['jet or pool fire']))],
    'ukpokiti_operator_irpa_per_yr': [
        ('hours over 8766', op_irpa(8766.0)),
        ('occupancy ignored', DECK + CR + CAMP),
        ('deck only', DECK * L(OP['compressorDeckHoursPerYr']) / L(HOURS)),
        ('camp forgotten', (DECK * (L(OP['compressorDeckHoursPerYr']) / L(HOURS))) + (CR * (L(OP['controlRoomHoursPerYr']) / L(HOURS)))),
        ('hours over a 2000 hour working year', (DECK * L(OP['compressorDeckHoursPerYr']) + CR * L(OP['controlRoomHoursPerYr']) + CAMP * L(OP['campHoursPerYr'])) / L(2000.0))],
    'ukpokiti_technician_irpa_per_yr': [
        ('deck fraction read as hours', DECK * L(TE['compressorDeckFraction']) / L(HOURS) + (CR * L(TE['controlRoomHoursPerYr']) + CAMP * L(TE['campHoursPerYr'])) / L(HOURS)),
        ('hours over 8766', DECK * L(TE['compressorDeckFraction']) + (CR * L(TE['controlRoomHoursPerYr']) + CAMP * L(TE['campHoursPerYr'])) / L(8766.0)),
        ('occupancy ignored', DECK + CR + CAMP),
        ('deck only', DECK * L(TE['compressorDeckFraction'])),
        ('operator hours used', op_irpa())],
    'ogini_crew_pll_per_yr': [
        ('f over n', total([L(s['frequencyPerYr']) / L(s['fatalities']) for s in CREW if s['fatalities'] > 0])),
        ('n ignored', total([L(s['frequencyPerYr']) for s in CREW])),
        ('largest contribution only', max([L(s['frequencyPerYr']) * L(s['fatalities']) for s in CREW], key=lambda e: e.v)),
        ('zero scenario counted as one', PLL + total([L(s['frequencyPerYr']) for s in CREW if s['fatalities'] == 0])),
        ('n rounded to whole', total([L(s['frequencyPerYr']) * L(float(round(s['fatalities']))) for s in CREW]))],
    'ogini_crew_far': [
        ('one persons hours', (PLL * L(1e8)) / L(float(OG['crewHoursPerPersonPerYr']))),
        ('base one million', FAR / L(100.0)),
        ('calendar hours per person', (PLL * L(1e8)) / (L(float(OG['crewPersons'])) * L(HOURS))),
        ('pll over hours without base', PLL / EXPOSED),
        ('village pll used', (total([L(s['frequencyPerYr']) * L(s['fatalities']) for s in VIL]) * L(1e8)) / EXPOSED)],
    'ogini_village_frequency_ten_or_more_per_yr': [
        ('more than ten', Fgt(10)),
        ('exactly ten only', Feq(10)),
        ('every scenario with deaths', Fge(1e-9)),
        ('expected fatalities reported', total([L(s['frequencyPerYr']) * L(s['fatalities']) for s in VIL])),
        ('ten or fewer', total([L(s['frequencyPerYr']) for s in VIL if 0 < s['fatalities'] <= 10]))],
    'ogini_village_vrom_max_ratio': [
        ('ratio at ten only', Fge(10) / line(10)),
        ('non cumulative curve', greatest(*[Feq(nn) / line(nn) for nn in CORNERS])),
        ('more than n', greatest(*[Fgt(nn) / line(nn) for nn in CORNERS])),
        ('slope one line', greatest(*[Fge(nn) / line(nn, LINE_C, 1.0) for nn in CORNERS])),
        ('ratio inverted', E(min((line(nn) / Fge(nn)).v for nn in CORNERS), 'least(' + ', '.join((line(nn) / Fge(nn)).s for nn in CORNERS) + ')'))],
    'ogini_village_exceedance_from_fatalities': [
        ('previous corner', L(float(PREV))),
        ('line minimum', L(LINE_NMIN)),
        ('slope one crossing', L(LINE_C) / Fge(STEP)),
        ('non cumulative crossing', sqrtE(L(LINE_C) / Feq(STEP))),
        ('crossing of the previous step', sqrtE(L(LINE_C) / Fge(PREV)))],
    'ogini_village_r2p2_point_ratio': [
        ('non cumulative nearest corner', Feq(STEP) / L(POINT_F)),
        ('largest n only', Feq(max(s['fatalities'] for s in VIL)) / L(POINT_F)),
        ('frequency of ten or more', Fge(10) / L(POINT_F)),
        ('ratio inverted', L(POINT_F) / Fge(POINT_N)),
        ('point read as one in fifty thousand', Fge(POINT_N) / L(2e-5))],
    'ebughu_deluge_cost_to_benefit_ratio': [
        ('undiscounted', pv_cost(D_, r=0.0) / pv_benefit(D_, r=0.0)),
        ('benefits at the cost rate', D_PVC / pv_benefit(D_, r=D_['costDiscountRate'])),
        ('rates swapped', pv_cost(D_, r=D_['benefitDiscountRate']) / pv_benefit(D_, r=D_['costDiscountRate'])),
        ('injuries dropped', D_PVC / pv_benefit(D_, harms=False)),
        ('benefits discounted from year zero', D_PVC / pv_benefit(D_, year0=True))],
    'ebughu_deluge_icaf_gbp': [
        ('fatalities discounted', D_PVC / (D_PVB * (benefit_per_yr(D_, harms=False) / benefit_per_yr(D_)) / L(D_['vpf']))),
        ('cost undiscounted', pv_cost(D_, r=0.0) / fat(D_)),
        ('net of injuries', (D_PVC - (benefit_per_yr(D_) - benefit_per_yr(D_, harms=False)) * L(float(D_['lifetimeYears']))) / fat(D_)),
        ('per year denominator', D_PVC / L(D_['deltaPllPerYr'])),
        ('capital only', L(D_['capitalCost']) / fat(D_))],
    'ebughu_deluge_maximum_reasonably_practicable_cost_gbp': [
        ('injuries dropped', L(float(D_['disproportionFactor'])) * pv_benefit(D_, harms=False)),
        ('benefit undiscounted', L(float(D_['disproportionFactor'])) * pv_benefit(D_, r=0.0)),
        ('benefit at the cost rate', L(float(D_['disproportionFactor'])) * pv_benefit(D_, r=D_['costDiscountRate'])),
        ('df applied twice', L(float(D_['disproportionFactor'])) * (L(float(D_['disproportionFactor'])) * D_PVB)),
        ('present value of the benefit reported', D_PVB)],
    'ebughu_blast_wall_cost_to_benefit_ratio': [
        ('growth ignored', W_PVC / pv_benefit(W_, g=0.0)),
        ('undiscounted', pv_cost(W_, r=0.0) / pv_benefit(W_, r=0.0, g=0.0)),
        ('growth netted off the rate', W_PVC / pv_benefit(W_, r=W_['benefitDiscountRate'] - W_['benefitGrowthRate'], g=0.0)),
        ('benefits discounted from year zero', W_PVC / pv_benefit(W_, year0=True)),
        ('benefits undiscounted growth kept', W_PVC / pv_benefit(W_, r=0.0))],
    'ebughu_blast_wall_icaf_gbp': [
        ('fatalities discounted', W_PVC / (W_PVB / L(W_['vpf']))),
        ('per year denominator', W_PVC / L(W_['deltaPllPerYr'])),
        ('lifetime minus one', pv_cost(W_, n=W_['lifetimeYears'] - 1) / fat(W_, W_['lifetimeYears'] - 1)),
        ('fatalities uprated by growth', W_PVC / total([L(W_['deltaPllPerYr']) * powE(L(1.0) + L(W_['benefitGrowthRate']), t) for t in range(1, W_['lifetimeYears'] + 1)])),
        ('vpf times df reported', L(W_['vpf']) * L(float(W_['disproportionFactor'])))],
    'ebughu_gas_detection_cost_to_benefit_ratio': [
        ('annual cost ignored', pv_cost(G_, annual=0.0) / G_PVB),
        ('annual cost from year zero', (L(G_['capitalCost']) + L(G_['annualCost']) * L(float(G_['lifetimeYears'] + 1))) / G_PVB),
        ('the 2001 vpf', G_PVC / pv_benefit(G_, vpf=1000000.0)),
        ('checklist rates applied', pv_cost(G_, r=0.035) / pv_benefit(G_, r=0.015)),
        ('ratio inverted', L(1.0) / (G_PVC / G_PVB))],
}
if set(TRAPS) != set(KEYS):
    refused.append('the traps do not cover every graded field')

NTRAPS = sum(len(v) for v in TRAPS.values())
TRAPVAL = {}
for k, traps in TRAPS.items():
    if len(traps) < 3:
        refused.append(f'{k} has {len(traps)} traps; three is the floor discriminate.mjs holds every route to')
    for why, t in traps:
        v = t.v
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
                       env=dict(os.environ, H5_WAVE_DIR=W, H5_ENGINES=GC.ENGINES, H5_REPO=GC.ENV['H5_REPO']))
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
-- H5 GO-LIVE (HELD): Quantitative Risk Assessment flips to 'available', the
-- FIFTH and last course of the HSE module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/qra. The 78 lessons, the teaching lab (qraLab.js) and
-- its three explorer panels (the event tree and individual risk builder, the
-- societal risk explorer and the ALARP and cost-benefit explorer) ship in the
-- ZIP and NOT in this database, so a flip before the upload puts a live
-- catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values h5_capstone.mjs returned through
--      the vendored engines/hse/qra.js when this file was generated, to the
--      last bit, so a capstone row an earlier seed left behind, or a move of
--      one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the inputs the learner is handed: the
--      go-live first proves each shipped prompt is the rendered one byte for
--      byte and carries every input fragment, then recomputes the event trees
--      as products of their branches, each LSIR and IRPA as its sum, the PLL,
--      the FAR, the frequency of N or more, the corner ratios to the line and
--      the crossing, the ratio to the R2P2 point, and every present value
--      year by year, the ICAF over the undiscounted fatalities prevented;
--   3. by the TRAPS the course is built on, {NTRAPS} wrong methods, each of which
--      must bite on these inputs: the reading a learner who missed the lesson
--      would give is computed and refused if it lands within the field's
--      tolerance.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Per-year values
-- are graded at twelve decimals (tolerance 5e-13), FAR, ratios and fatality
-- counts at six (5e-7) and money at two (0.005). Every field must carry a
-- positive, non-whole expected value at its class's tolerance with a label and
-- a unit, the answer the prompt asks for must pass, and one unit either side
-- of it in the last asked decimal must fail. All of it is asserted here, on
-- the rows as seeded.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses to emit a bare integer
-- denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================"""

K12 = [k for k in KEYS if DP[k] == 12]
K6 = [k for k in KEYS if DP[k] == 6]
K2 = [k for k in KEYS if DP[k] == 2]
if len(K12) + len(K6) + len(K2) != 18:
    refused.append('a graded field is in no precision class this go-live grades')


def inlist(keys):
    return '(' + ', '.join(lit(k) for k in keys) + ')'


BODY = []
A = BODY.append
A('do $$')
A('declare')
A('  v_structures int; v_questions int; v_capstones int; v_lessons int;')
A('  v_modules int; v_graded int; v_available int; v_soon int; v_n int; v_k int;')
A('  v_names text; v_prompt text; v_x double precision; v_wrong double precision;')
for k in KEYS:
    A(f'  {V[k]} double precision;')
A('begin')

A(f'''
  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = '{SLUG}' and active;
  if v_structures <> 3 then
    raise exception 'H5 go-live refused: {SLUG} has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{SLUG}';
  if v_questions <> 396 then
    raise exception 'H5 go-live refused: {SLUG} has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions where app_slug = '{SLUG}'
     group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = '{SLUG}' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;

  -- A key outside its own options is unanswerable, and a count of rows cannot
  -- see it.
  select count(*) into v_n from public.academy_quiz_questions
   where app_slug = '{SLUG}'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = '{SLUG}' and s.active;
  if v_lessons <> 78 then
    raise exception 'H5 go-live refused: {SLUG} carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = '{SLUG}' and s.active;
  if v_modules <> 18 then
    raise exception 'H5 go-live refused: {SLUG} carries % modules, expected 18 (six per tier)', v_modules;
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
    raise exception 'H5 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = '{SLUG}';
  if v_capstones <> 3 then
    raise exception 'H5 go-live refused: {SLUG} has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = '{SLUG}';
  if v_graded <> 18 then
    raise exception 'H5 go-live refused: {SLUG} has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_n from (
    select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = '{SLUG}' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = '{SLUG}' and module = '{MODULE}'
                    and path_order = {PATH_ORDER} and prereq_slug is null) then
    raise exception 'H5 go-live refused: the {SLUG} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{SLUG}') then
    raise exception 'H5 go-live refused: another course already holds path_order {PATH_ORDER}';
  end if;

  -- ------------------------------------------------- the grader is numeric
  -- Every field a positive, non-whole number at its class's tolerance (twelve
  -- decimals at 5e-13, six at 5e-7, two at 0.005), with a label and a unit.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = '{SLUG}'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or (f->>'expected')::numeric = round((f->>'expected')::numeric)
          or (f->>'tol')::numeric <> case when f->>'key' in {inlist(K6)} then 0.0000005
                                          when f->>'key' in {inlist(K2)} then 0.005
                                          else 0.0000000000005 end
          or (f->>'key') not in {inlist(KEYS)}
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % graded field(s) are not a positive non-whole number at their class tolerance with a label and a unit: %', v_n, v_names;
  end if;

  -- THE GRADER, SIMULATED ON THE SEEDED ROW. The answer the prompt asks for,
  -- the expected value to its class's decimals, must pass
  -- abs(answer - expected) <= tol in numeric exactly as academy_submit_capstone
  -- computes it, and one unit in the last decimal either side of it must fail.
  select count(*), string_agg(t.tier || '/' || t.k, ', ')
    into v_n, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::numeric e, (f->>'tol')::numeric tl,
                 case when f->>'key' in {inlist(K6)} then 6 when f->>'key' in {inlist(K2)} then 2 else 12 end dp
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = '{SLUG}') t
   where abs(round(t.e, t.dp) - t.e) > t.tl
      or abs(round(t.e, t.dp) + power(10::numeric, -t.dp) - t.e) <= t.tl
      or abs(round(t.e, t.dp) - power(10::numeric, -t.dp) - t.e) <= t.tl;
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % graded field(s) either fail the answer the prompt asks for or pass one a unit off in its last decimal: %', v_n, v_names;
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
    raise exception 'H5 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = '{SLUG}' and tier = '{tier}'
                    and cert_tier = {lit(GC.TIER[tier][0])} and dataset = {lit(GC.TIER[tier][1])} and title = {lit(GC.TIER[tier][2])}) then
    raise exception 'H5 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  -- Every input fragment the second route reads is stated, matched as a
  -- literal substring with strpos (an underscore or a percent sign in a LIKE
  -- pattern is a wildcard).
  select count(*) into v_n from unnest(array[{arr}]) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'H5 go-live refused: % {tier} input fragment(s) the second route reads are not stated in the shipped prompt', v_n;
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
A(f"    raise exception 'H5 go-live refused: one or more of the eighteen graded fields is missing{name(*KEYS)}';")
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
    raise exception 'H5 go-live refused: % graded field(s) are stated in capstone text a learner reads: %', v_n, v_names;
  end if;

  -- The sweep must have read something: the three prompts hand a learner
  -- {PROMPT_NUMS} numbers between them.
  select count(*) into v_n
    from public.academy_capstones p, lateral regexp_matches(replace(p.prompt, ',', ''), '{NUMRE}', 'g') m
   where p.app_slug = '{SLUG}';
  if v_n < {PROMPT_NUMS} then
    raise exception 'H5 go-live refused: the prompt sweep read only % numbers, so it is reading the wrong thing', v_n;
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
    raise exception 'H5 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_n, v_names;
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
    raise exception 'H5 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes: %', v_n, v_names;
  end if;
''')

# ------------------------------------------------------- 1. the engine ledger
A('\n  -- ------------------------------------------ 1. against the engine ledger')
A('  -- The values h5_capstone.mjs returned through the vendored engine, to the')
A('  -- last bit. A seeded value that is not the engine\'s is refused by name.')
for k in KEYS:
    A(f'''  if {V[k]} <> {f17(ENGINE[k])} then
    raise exception 'H5 go-live refused: the seeded value % is not the {ENGINE[k]!r} the engine returned{name(k)}', {V[k]};
  end if;''')

# ------------------------------------------------ 2. the second route in SQL
WHAT = {
    'ukpokiti_compressor_explosion_frequency_per_yr': 'the compressor release through its stated branches and split',
    'ukpokiti_camp_exposure_frequency_per_yr': 'the sour gas release pooled over its two paths to the camp',
    'ukpokiti_control_room_lsir_per_yr': 'the control room as the sum of f times the stated probability of death',
    'ukpokiti_compressor_deck_lsir_per_yr': 'the compressor deck as the sum of f times the stated probability of death',
    'ukpokiti_operator_irpa_per_yr': 'the operator as LSIR times hours over 8760 at each place',
    'ukpokiti_technician_irpa_per_yr': 'the technician as LSIR times the stated fraction or hours over 8760',
    'ogini_crew_pll_per_yr': 'the crew as the sum of f times N',
    'ogini_crew_far': 'the crew PLL per 100,000,000 over its exposed hours',
    'ogini_village_frequency_ten_or_more_per_yr': 'the village sum of f over N of ten or more',
    'ogini_village_vrom_max_ratio': 'the greatest corner ratio of the village curve to the line',
    'ogini_village_exceedance_from_fatalities': 'the greatest of the previous corner, the line minimum and sqrt(C / F)',
    'ogini_village_r2p2_point_ratio': 'the village frequency of 50 or more over the R2P2 point',
    'ebughu_deluge_cost_to_benefit_ratio': 'the deluge present values year by year',
    'ebughu_deluge_icaf_gbp': 'the deluge cost over its undiscounted fatalities prevented',
    'ebughu_deluge_maximum_reasonably_practicable_cost_gbp': 'the deluge DF times its present benefit',
    'ebughu_blast_wall_cost_to_benefit_ratio': 'the blast wall present values year by year',
    'ebughu_blast_wall_icaf_gbp': 'the blast wall cost over its undiscounted fatalities prevented',
    'ebughu_gas_detection_cost_to_benefit_ratio': 'the gas detection present values undiscounted',
}
ROUTE_SQL = []
for k in KEYS:
    ROUTE_SQL.append(f'''  v_x := {ROUTE[k].s};
  if abs(v_x - {V[k]}) > {EPS!r} * abs({V[k]}) then
    raise exception 'H5 go-live refused: {WHAT[k].replace("'", "''")} gives % in SQL, against the seeded %{name(k)}', v_x, {V[k]};
  end if;''')

A('''
  -- ----------------------------------------------- 2. the second route in SQL
  -- ASSOCIATE, UKPOKITI. The two event trees as products of their stated
  -- branch probabilities, each LSIR as the sum of f times the stated
  -- probability of death, each IRPA as LSIR times the fraction of the year.
  -- PROFESSIONAL, OGINI. PLL and FAR; the frequency of N or more deaths as a
  -- sum; the corner ratios to F = C / N^2, the crossing sqrt(C / F) and the
  -- R2P2 ratio. EXPERT, EBUGHU. Every present value year by year with power(),
  -- the ICAF over the UNDISCOUNTED fatalities prevented.''')
for b in ROUTE_SQL:
    A(b)
A(f'''  -- The tiers' points, on these inputs: the village curve exceeds the line and
  -- sits below the R2P2 point, the exceedance starts inside its step, the deluge
  -- is reasonably practicable and the blast wall and the gas detection are not.
  if not ({V['ogini_village_vrom_max_ratio']} > 1.0::double precision and {V['ogini_village_r2p2_point_ratio']} < 1.0::double precision) then
    raise exception 'H5 go-live refused: the village curve does not exceed the line and sit below the point{name('ogini_village_vrom_max_ratio', 'ogini_village_r2p2_point_ratio')}';
  end if;
  if not ({V['ogini_village_exceedance_from_fatalities']} > {f17(PREV)} and {V['ogini_village_exceedance_from_fatalities']} < {f17(STEP)}) then
    raise exception 'H5 go-live refused: the exceedance does not start inside the step{name('ogini_village_exceedance_from_fatalities')}';
  end if;
  if not ({V['ebughu_deluge_cost_to_benefit_ratio']} <= {f17(D_['disproportionFactor'])}) then
    raise exception 'H5 go-live refused: the deluge is grossly disproportionate{name('ebughu_deluge_cost_to_benefit_ratio')}';
  end if;
  if not ({V['ebughu_blast_wall_cost_to_benefit_ratio']} > {f17(W_['disproportionFactor'])} and {V['ebughu_gas_detection_cost_to_benefit_ratio']} > {f17(G_['disproportionFactor'])}) then
    raise exception 'H5 go-live refused: the blast wall or the gas detection is reasonably practicable{name('ebughu_blast_wall_cost_to_benefit_ratio', 'ebughu_gas_detection_cost_to_benefit_ratio')}';
  end if;''')

# ------------------------------------------------------ 3. the traps bite
A('\n  -- ------------------------------------------------- 3. the traps bite')
A('  -- Each wrong reading is computed over the same inputs and must MISS the')
A('  -- graded value by more than its tolerance, or the field does not')
A('  -- discriminate the trap it is for.')
for k in KEYS:
    for why, t in TRAPS[k]:
        A(f'  v_wrong := {t.s};')
        A(f'''  if v_wrong is null or abs(v_wrong - {V[k]}) <= {TOL[k]!r} then
    raise exception 'H5 go-live refused: the {why} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', v_wrong, {V[k]};
  end if;''')

A(f'''
  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = '{SLUG}';
  if not exists (select 1 from public.academy_apps where slug = '{SLUG}' and status = 'available') then
    raise exception 'H5 go-live refused: {SLUG} did not reach status available';
  end if;

  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'H5 go-live: {SLUG} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
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
    print(f'second route in SQL: 18 fields | traps that must bite: '
          f'{NTRAPS} over 18 fields, {DISC_CHECKED} matched to discriminate.mjs to 1e-9')
    print(f'digest sweep: {len(DIGEST_NUMS)} numbers | graded fields named by a refusal: '
          f'{len(named & {f"{TIER_OF[k]}/{k}" for k in KEYS})} of 18')
    print('integer-division guard: 0 | unclosed literals: 0 | en/em dashes: 0')
    print('every identity the second route asserts, checked here first in Python:')
    for what, diff, eps in checks:
        print(f'  {diff:.3e} <= {eps:.0e}  {what}')
