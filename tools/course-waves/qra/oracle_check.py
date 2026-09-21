#!/usr/bin/env python3
"""THE EIGHTEEN GRADED H5 ANSWERS, RECOMPUTED BY A SECOND ROUTE.

fields.json is written from the JavaScript engine. This replays the three
capstone facilities through the vendored Python oracle
tools/validation/hse/oracle_qra.py, which was written independently of the
engine and never calls it, and through EXACT RATIONAL arithmetic on the
decimal spellings of the inputs wherever the oracle keeps its arithmetic
inside its main() (the individual risk sums and the discounting):

  * UKPOKITI: both event trees through the oracle's own tree walker in exact
    Fractions (its flammable_tree for the compressor, its tree_leaves for the
    sour gas tree), then LSIR and IRPA as exact sums of the exact outcome
    frequencies, hours over 8760.
  * OGINI: PLL and FAR in exact Fractions; F(10), the Dutch line comparison,
    its exceedance range and the R2P2 point through the oracle's fn_brute and
    fn_line_compare, whose own route B (a 200 001 point log grid) must never
    exceed the corner maximum.
  * EBUGHU: every present value year by year in exact Fractions (route A) and
    by the closed-form growing annuity in double (route B); the ratio, the ICAF
    and the largest reasonably practicable cost from both.

Every graded value must agree with route A to 1e-10 relative, and with route
B to 1e-9. It also checks the claims the capstone prompts make that are
DECISIONS rather than numbers, in exact arithmetic with no snap: the deluge is
not grossly disproportionate, the blast wall and the gas detection are; the
village curve exceeds the Dutch line and is below the R2P2 point.

    /root/hseenv/bin/python oracle_check.py [--plant]

--plant is THE NEGATIVE CONTROL: it perturbs one graded value by ten
tolerances before comparing, and must exit 1 naming it.

The oracle imports numpy and scipy (and the H4 oracle's transcriptions), so
this runs under the venv the engine's validation record names, /root/hseenv.

Exit 0 clean, 1 a disagreement, 2 could not run.
"""
import json
import math
import os
import subprocess
import sys
from fractions import Fraction as Fr

HERE = os.environ.get('H5_WAVE_DIR', '/root/hse-wip-qra')
ENG = os.environ.get('H5_ENGINES', '/root/wt-h5-nextgen/packages/engines')
sys.path.insert(0, os.path.join(ENG, 'tools', 'validation', 'hse'))
try:
    import oracle_qra as O  # noqa: E402
except Exception as e:  # pragma: no cover
    print(f'REFUSED: the oracle could not be imported from {ENG} ({e}); run under /root/hseenv/bin/python')
    sys.exit(2)

PLANT = '--plant' in sys.argv
fields = json.load(open(os.path.join(HERE, 'fields.json')))
if len(fields) != 18:
    print(f'REFUSED: fields.json carries {len(fields)} fields')
    sys.exit(2)
graded = {k: (v, tol) for _, k, v, tol in fields}
inp = json.loads(subprocess.run(['node', os.path.join(HERE, 'h5_capstone.mjs'), '--inputs'],
                                capture_output=True, text=True, check=True).stdout)
U, G, E = inp['UKPOKITI'], inp['OGINI'], inp['EBUGHU']


def F(x):
    """The exact rational of a decimal input, as typed."""
    return Fr(repr(x)) if isinstance(x, float) else Fr(x)


HOURS = Fr(8760)
routeA = {}
routeB = {}
claims = []

# ------------------------------------------------------------ UKPOKITI
c = U['compressor']
comp_tree = O.flammable_tree(c['immediateIgnitionProbability'], c['delayedIgnitionProbability'],
                             c['vapourCloudSplit']['flashFire'], c['vapourCloudSplit']['explosion'])
tot = {}
for _path, oc, _p, f in O.tree_leaves(comp_tree, c['initiatingFrequencyPerYr'], exact=True):
    tot[oc] = tot.get(oc, Fr(0)) + f
sour = {}
for _path, oc, _p, f in O.tree_leaves(U['sourGas']['tree'], U['sourGas']['initiatingFrequencyPerYr'], exact=True):
    sour[oc] = sour.get(oc, Fr(0)) + f
freqs = dict(tot)
freqs['camp exposure'] = sour['camp exposure']


def lsir(place):
    return sum((freqs[n] * F(pd) for n, pd in U['deathProbability'][place].items()), Fr(0))


cr, deck, campL = lsir('controlRoom'), lsir('compressorDeck'), lsir('camp')
op, te = U['operator'], U['technician']
routeA['ukpokiti_compressor_explosion_frequency_per_yr'] = tot['explosion']
routeA['ukpokiti_camp_exposure_frequency_per_yr'] = sour['camp exposure']
routeA['ukpokiti_control_room_lsir_per_yr'] = cr
routeA['ukpokiti_compressor_deck_lsir_per_yr'] = deck
routeA['ukpokiti_operator_irpa_per_yr'] = (deck * F(op['compressorDeckHoursPerYr']) + cr * F(op['controlRoomHoursPerYr'])
                                         + campL * F(op['campHoursPerYr'])) / HOURS
routeA['ukpokiti_technician_irpa_per_yr'] = (deck * F(te['compressorDeckFraction'])
                                           + (cr * F(te['controlRoomHoursPerYr']) + campL * F(te['campHoursPerYr'])) / HOURS)
claims.append(('the compressor tree sums back to its release frequency, exactly',
               sum(tot.values(), Fr(0)) == F(c['initiatingFrequencyPerYr'])))

# ------------------------------------------------------------ OGINI
pll = sum((F(s['frequencyPerYr']) * F(s['fatalities']) for s in G['crew']), Fr(0))
routeA['ogini_crew_pll_per_yr'] = pll
routeA['ogini_crew_far'] = pll * Fr(10) ** 8 / (F(G['crewPersons']) * F(G['crewHoursPerPersonPerYr']))
V = G['village']
F10 = sum((F(s['frequencyPerYr']) for s in V if s['fatalities'] >= 10), Fr(0))
routeA['ogini_village_frequency_ten_or_more_per_yr'] = F10
routeB['ogini_village_frequency_ten_or_more_per_yr'] = O.fn_brute(V, 10)
checks, grid_max = O.fn_line_compare(V, 1e-3, 2, 10)
worst = max(checks, key=lambda r: r['ratio'])
routeB['ogini_village_vrom_max_ratio'] = worst['ratio']
exact_ratios = [(sum((F(s['frequencyPerYr']) for s in V if s['fatalities'] >= n), Fr(0)) / (Fr(1, 1000) / (F(n) ** 2)), n)
                for n in sorted({s['fatalities'] for s in V if s['fatalities'] >= 10})]
routeA['ogini_village_vrom_max_ratio'] = max(exact_ratios)[0]
step = [r for r in checks if r['fatalities'] == G['exceedanceStepEndsAtFatalities']][0]
routeB['ogini_village_exceedance_from_fatalities'] = step['exceedsOverFatalities']['from']
F55 = sum((F(s['frequencyPerYr']) for s in V if s['fatalities'] >= G['exceedanceStepEndsAtFatalities']), Fr(0))
routeA['ogini_village_exceedance_from_fatalities'] = Fr(math.sqrt(Fr(1, 1000) / F55))
F50 = sum((F(s['frequencyPerYr']) for s in V if s['fatalities'] >= 50), Fr(0))
routeA['ogini_village_r2p2_point_ratio'] = F50 * 5000
routeB['ogini_village_r2p2_point_ratio'] = O.fn_brute(V, 50) / (1 / 5000)
claims.append(('the oracle grid route never exceeds the corner maximum', grid_max <= worst['ratio'] * (1 + 1e-12)))
claims.append(('the grid route comes within 1e-3 of the corner maximum', grid_max >= worst['ratio'] * (1 - 1e-3)))
claims.append(('the village curve exceeds the Dutch line, exactly', max(exact_ratios)[0] > 1))
claims.append(('the village curve is below the R2P2 point, exactly', F50 < Fr(1, 5000)))
claims.append(('the exceedance starts at the crossing, inside the step (10, 55)', 10 < math.sqrt(Fr(1, 1000) / F55) < 55))


# ------------------------------------------------------------ EBUGHU
def exact_cb(m):
    n = m['lifetimeYears']
    rb, rc, g = F(m.get('benefitDiscountRate', 0)), F(m.get('costDiscountRate', 0)), F(m.get('benefitGrowthRate', 0))
    bpy = F(m['deltaPllPerYr']) * F(m['vpf']) + sum((F(h['expectedCasesPerYr']) * F(h['valuePerCase']) for h in m.get('otherHarms', [])), Fr(0))
    pvb = sum((bpy * (1 + g) ** t / (1 + rb) ** t for t in range(1, n + 1)), Fr(0))
    pvc = F(m['capitalCost']) + sum((F(m.get('annualCost', 0)) / (1 + rc) ** t for t in range(1, n + 1)), Fr(0))
    fat = F(m['deltaPllPerYr']) * n
    return {'ratio': pvc / pvb, 'icaf': pvc / fat, 'max': F(m['disproportionFactor']) * pvb, 'gross': pvc > F(m['disproportionFactor']) * pvb}


def annuity_cb(m):
    n = m['lifetimeYears']
    rb, rc, g = m.get('benefitDiscountRate', 0.0), m.get('costDiscountRate', 0.0), m.get('benefitGrowthRate', 0.0)
    bpy = m['deltaPllPerYr'] * m['vpf'] + sum(h['expectedCasesPerYr'] * h['valuePerCase'] for h in m.get('otherHarms', []))

    def ann(B, r, gr):
        x = (1 + gr) / (1 + r)
        return B * n if abs(x - 1) < 1e-15 else B * x * (1 - x ** n) / (1 - x)
    pvb = ann(bpy, rb, g)
    pvc = m['capitalCost'] + ann(m.get('annualCost', 0.0), rc, 0.0)
    return {'ratio': pvc / pvb, 'icaf': pvc / (m['deltaPllPerYr'] * n), 'max': m['disproportionFactor'] * pvb}


d, w, g = exact_cb(E['deluge']), exact_cb(E['blastWall']), exact_cb(E['gasDetection'])
db, wb, gb = annuity_cb(E['deluge']), annuity_cb(E['blastWall']), annuity_cb(E['gasDetection'])
routeA['ebughu_deluge_cost_to_benefit_ratio'] = d['ratio']
routeA['ebughu_deluge_icaf_gbp'] = d['icaf']
routeA['ebughu_deluge_maximum_reasonably_practicable_cost_gbp'] = d['max']
routeA['ebughu_blast_wall_cost_to_benefit_ratio'] = w['ratio']
routeA['ebughu_blast_wall_icaf_gbp'] = w['icaf']
routeA['ebughu_gas_detection_cost_to_benefit_ratio'] = g['ratio']
routeB['ebughu_deluge_cost_to_benefit_ratio'] = db['ratio']
routeB['ebughu_deluge_icaf_gbp'] = db['icaf']
routeB['ebughu_deluge_maximum_reasonably_practicable_cost_gbp'] = db['max']
routeB['ebughu_blast_wall_cost_to_benefit_ratio'] = wb['ratio']
routeB['ebughu_blast_wall_icaf_gbp'] = wb['icaf']
routeB['ebughu_gas_detection_cost_to_benefit_ratio'] = gb['ratio']
claims.append(('the deluge is NOT grossly disproportionate, exactly', not d['gross']))
claims.append(('the blast wall is grossly disproportionate, exactly', w['gross']))
claims.append(('the gas detection is grossly disproportionate, exactly', g['gross']))

# ------------------------------------------------------------ compare
if len(routeA) != 18:
    print(f'REFUSED: route A covers {len(routeA)} of 18 fields')
    sys.exit(2)
bad = []
worstA = 0.0
worstB = 0.0
planted = None
for i, (k, (v, tol)) in enumerate(graded.items()):
    if PLANT and i == 4:
        v = v + 10 * tol
        planted = k
    a = float(routeA[k])
    ra = abs(v - a) / abs(a)
    worstA = max(worstA, ra)
    if ra > 1e-10 or abs(v - a) > tol:
        bad.append(f'{k}: engine {v!r}, exact route {a!r} (relative {ra:.3e}, tolerance {tol})')
    if k in routeB:
        rb = abs(v - routeB[k]) / abs(routeB[k])
        worstB = max(worstB, rb)
        if rb > 1e-9:
            bad.append(f'{k}: engine {v!r}, route B {routeB[k]!r} (relative {rb:.3e})')
failed_claims = [c for c, ok in claims if not ok]
print(f'oracle_check: 18 graded fields against an exact rational route A, {len(routeB)} also against a route B through the oracle or a closed form')
print(f'  worst relative difference, route A: {worstA:.3e}; route B: {worstB:.3e}')
print(f'  decision claims checked exactly: {len(claims)}, failed: {len(failed_claims)}')
for c in failed_claims:
    print(f'   CLAIM FAILED: {c}')
print(f'  DISAGREEMENTS: {len(bad)}')
for b in bad:
    print(f'   {b}')
if PLANT:
    caught = any(b.startswith(f'{planted}:') for b in bad)
    print(f'  NEGATIVE CONTROL: {planted} moved by ten tolerances; {"caught" if caught else "NOT CAUGHT"}')
    sys.exit(1 if caught else 2)
sys.exit(1 if bad or failed_claims else 0)
