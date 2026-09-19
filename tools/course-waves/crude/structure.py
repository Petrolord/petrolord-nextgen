# crude: Crude Assay & Blending. Three tiers, six modules each, 26 lessons a
# tier. Academy module `commercial_trading` ("Commercial & Trading"), path_order
# 48, the first Commercial & Trading course (LEAD RULING 2026-09-19; the engine
# family stays engines/downstream).
#
# THE ONE SENTENCE. Every property of a blend is computed on its own basis
# (gravity through specific gravity on volume, sulfur and the other per-mass
# properties on mass, viscosity through an index, yields on volume off the
# curve), and every least-cost recipe is a linear programme whose binding
# specifications, value of relief and infeasibility are answers in their own
# right.
#
# Panel ids: A the assay explorer (a crude library, a blend recipe the learner
# moves, each property on its basis beside the wrong basis, the curve and its
# cuts, the stability screen), V the valuation explorer (the blend's own curve,
# the fifty percent point, the blend's cut yields on a refinery's cut set, the
# netback and the marker), L the recipe explorer (a component pool and its
# specifications, the least-cost recipe, binding rows, giveaway, the value of
# relief, infeasible and refused).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engines: engines/downstream/crudeAssay.js, engines/downstream/productBlending.js
# and lib/lp/simplex.js at petrolord-engines 60ee266 (MD1-0 repaired this
# scope; MD2-0 and MD3-0 the siblings'), vendored sha-identical by the shared
# vendor commit b1f29251.
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS with the two sibling Commercial & Trading courses:
#  * `refinery` (Refinery Feasibility & Planning, path_order 49) USES the LP
#    kernel and teaches its stream marginal values. THIS course OWNS linear
#    programming: what an LP is, rows and bounds, the vertex, binding
#    constraints, shadow prices as the value of one unit of relief, and
#    infeasible as an answer. refinery grades no productBlending output.
#  * `supply` (Terminals, Depots & Fuel Supply, path_order 50) owns strapping,
#    the VCF, stock reconciliation, queues, landed cost and pump price. Nothing
#    here grades any of those.
#  * Nothing here grades NPV, IRR, Monte Carlo or a decision tree (Economics).
# ---------------------------------------------------------------------------
import re

A = 'crude-assay-explorer'
V = 'crude-valuation-explorer'
L = 'crude-recipe-explorer'

WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-an-assay-carries', 'What an Assay Carries', [
    ('l01-four-questions-an-assay-answers', 'Four questions an assay answers', 12, []),
    ('l02-api-gravity-is-a-hyperbola', 'API gravity is a hyperbola', 13, [A]),
    ('l03-the-crude-library', 'The crude library', 13, [A]),
    ('l04-two-modules-and-a-kernel', 'Two modules and a kernel', 12, []),
  ]),
  ('m02-blending-on-the-right-basis', 'Blending on the Right Basis', [
    ('l01-density-blends-on-volume', 'Density blends on volume', 13, [A]),
    ('l02-api-through-specific-gravity', 'API through specific gravity', 14, [A]),
    ('l03-volume-shares-become-mass-shares', 'Volume shares become mass shares', 13, [A]),
    ('l04-sulfur-blends-on-mass', 'Sulfur blends on mass', 14, [A]),
    ('l05-a-blank-is-not-a-zero', 'A blank is not a zero', 13, [A]),
  ]),
  ('m03-viscosity-through-an-index', 'Viscosity Through an Index', [
    ('l01-why-viscosity-needs-an-index', 'Why viscosity needs an index', 12, [A]),
    ('l02-the-refutas-index', 'The Refutas index', 13, [A]),
    ('l03-the-index-blends-on-mass', 'The index blends on mass', 14, [A]),
    ('l04-where-the-index-has-no-answer', 'Where the index has no answer', 12, [A]),
  ]),
  ('m04-the-curve-and-its-cuts', 'The Curve and Its Cuts', [
    ('l01-a-tbp-curve-is-cumulative', 'A TBP curve is cumulative', 13, [A]),
    ('l02-between-the-measured-points', 'Between the measured points', 13, [A]),
    ('l03-outside-the-measured-points', 'Outside the measured points', 14, [A]),
    ('l04-a-cut-is-a-difference', 'A cut is a difference', 13, [A]),
    ('l05-a-cut-set-that-closes', 'A cut set that closes', 13, [A]),
  ]),
  ('m05-will-the-blend-stay-stable', 'Will the Blend Stay Stable', [
    ('l01-saturates-against-aromatics-and-resins', 'Saturates against aromatics and resins', 13, [A]),
    ('l02-three-bands-and-three-answers', 'Three bands and three answers', 14, [A]),
    ('l03-sara-blends-on-mass', 'SARA blends on mass', 13, [A]),
    ('l04-a-rule-of-thumb-can-raise-a-flag', 'A rule of thumb can raise a flag', 14, [A]),
    ('l05-no-gravity-no-screen', 'No gravity, no screen', 12, [A]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-obigbo-blend-end-to-end', 'The Obigbo blend end to end', 14, [A]),
    ('l02-the-obigbo-library-crude-by-crude', 'The Obigbo library crude by crude', 14, [A]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-the-blends-own-curve', "The Blend's Own Curve", [
    ('l01-yields-add-on-volume', 'Yields add on volume', 13, [V]),
    ('l02-temperatures-do-not-average', 'Temperatures do not average', 14, [V]),
    ('l03-every-temperature-a-crude-measured', 'Every temperature a crude measured', 13, [V]),
    ('l04-a-truncated-crude-in-the-blend', 'A truncated crude in the blend', 13, [V]),
  ]),
  ('m02-the-fifty-percent-point', 'The Fifty Percent Point', [
    ('l01-reading-a-temperature-off-the-curve', 'Reading a temperature off the curve', 13, [V]),
    ('l02-interpolated-against-the-grid', 'Interpolated against the grid', 14, [V]),
    ('l03-the-component-midpoints-do-not-average', 'The component midpoints do not average', 13, [V]),
    ('l04-the-watson-factor', 'The Watson factor', 13, [V]),
    ('l05-a-screening-basis-for-k', 'A screening basis for K', 12, [V]),
  ]),
  ('m03-cut-yields-of-the-blend', 'Cut Yields of the Blend', [
    ('l01-the-blends-cut-yields', "The blend's cut yields", 13, [V]),
    ('l02-moving-a-cut-point', 'Moving a cut point', 14, [V]),
    ('l03-a-cut-the-curve-cannot-answer', 'A cut the curve cannot answer', 13, [V]),
    ('l04-the-refinery-draws-its-own-cuts', 'The refinery draws its own cuts', 13, [V]),
  ]),
  ('m04-netback', 'Netback', [
    ('l01-product-value-per-barrel-of-crude', 'Product value per barrel of crude', 14, [V]),
    ('l02-losses-on-the-product-side', 'Losses on the product side', 13, [V]),
    ('l03-processing-and-freight', 'Processing and freight', 13, [V]),
    ('l04-a-blank-cost-is-named', 'A blank cost is named', 12, [V]),
    ('l05-an-unpriced-cut', 'An unpriced cut', 13, [V]),
  ]),
  ('m05-against-the-marker', 'Against the Marker', [
    ('l01-the-differential', 'The differential', 13, [V]),
    ('l02-each-crude-on-its-own-netback', 'Each crude on its own netback', 14, [V]),
    ('l03-the-blend-against-its-components', 'The blend against its components', 14, [V]),
    ('l04-losses-outside-zero-to-one-hundred', 'Losses outside zero to one hundred', 12, [V]),
    ('l05-d86-is-a-product-test', 'D86 is a product test', 12, []),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-kwale-valuation-end-to-end', 'The Kwale valuation end to end', 14, [V]),
    ('l02-what-the-oracle-checks-on-a-cargo', 'What the oracle checks on a cargo', 13, []),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-what-a-linear-programme-is', 'What a Linear Programme Is', [
    ('l01-a-recipe-is-a-continuous-decision', 'A recipe is a continuous decision', 12, []),
    ('l02-an-objective-rows-and-bounds', 'An objective, rows and bounds', 13, [L]),
    ('l03-the-optimum-sits-on-a-vertex', 'The optimum sits on a vertex', 14, [L]),
    ('l04-optimal-infeasible-and-unbounded', 'Optimal, infeasible and unbounded', 13, [L]),
    ('l05-two-phases', 'Two phases', 12, [L]),
  ]),
  ('m02-blending-rules-as-rows', 'Blending Rules as Rows', [
    ('l01-a-ratio-limit-becomes-a-row', 'A ratio limit becomes a row', 14, [L]),
    ('l02-volume-mass-and-index', 'Volume, mass and index', 13, [L]),
    ('l03-the-rvp-index', 'The RVP index', 13, [L]),
    ('l04-viscosity-on-mass-in-the-diesel-pool', 'Viscosity on mass in the diesel pool', 14, [L]),
  ]),
  ('m03-binding-and-giveaway', 'Binding and Giveaway', [
    ('l01-the-apapa-recipe', 'The Apapa recipe', 13, [L]),
    ('l02-binding-specifications', 'Binding specifications', 14, [L]),
    ('l03-giveaway-is-quality-handed-over', 'Giveaway is quality handed over', 13, [L]),
    ('l04-pricing-the-giveaway', 'Pricing the giveaway', 13, [L]),
  ]),
  ('m04-shadow-prices', 'Shadow Prices', [
    ('l01-the-dual-of-a-row', 'The dual of a row', 13, [L]),
    ('l02-relief-per-unit-of-the-property', 'Relief per unit of the property', 14, [L]),
    ('l03-the-index-slope', 'The index slope', 13, [L]),
    ('l04-the-marginal-barrel', 'The marginal barrel', 14, [L]),
    ('l05-checking-a-price-by-re-solving', 'Checking a price by re-solving', 13, [L]),
  ]),
  ('m05-infeasible-refused-and-skipped', 'Infeasible, Refused and Skipped', [
    ('l01-infeasible-is-an-answer', 'Infeasible is an answer', 14, [L]),
    ('l02-a-typed-zero-is-none', 'A typed zero is none', 13, [L]),
    ('l03-a-blank-cost-is-refused', 'A blank cost is refused', 12, [L]),
    ('l04-a-specification-not-applied', 'A specification not applied', 13, [L]),
    ('l05-bounds-that-cross', 'Bounds that cross', 12, [L]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-apapa-pool-end-to-end', 'The Apapa pool end to end', 14, [L]),
    ('l02-what-is-held-and-what-the-oracles-check', 'What is held and what the oracles check', 14, []),
    ('l03-where-this-course-hands-over', 'Where this course hands over', 12, []),
  ]),
 ],
}

# Nothing is held back from writing: the engines are vendored, the digest is
# built, and every module has its source. The three FINDINGS HELD items (L4,
# C12, C13) are TAUGHT as stated limits (Expert m06 l02, Associate m03 l03,
# Professional m02 l05) and are never graded.
HELD = {}

KEY = {'m': re.compile(r'^m(\d\d)-[a-z0-9]+(?:-[a-z0-9]+)*$'), 'l': re.compile(r'^l(\d\d)-[a-z0-9]+(?:-[a-z0-9]+)*$')}

if __name__ == '__main__':
    total = 0
    problems = []
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        held = sum(len(m[2]) for m in mods if m[0] in HELD.get(tier, []))
        total += n
        print(f'{tier:<14} {len(mods)} modules  {n} lessons  ({held} held)')
        assert len(mods) == 6, f'{tier} has {len(mods)} modules'
        assert n == 26, f'{tier} has {n} lessons'
        assert 'reading' in mods[5][0], f'{tier} module 6 is not the reading module'
        for mi, (mkey, mtitle, lessons) in enumerate(mods, 1):
            m = KEY['m'].match(mkey)
            if not m or int(m.group(1)) != mi:
                problems.append(f'{tier}/{mkey} is not m{mi:02d}-<slug>')
            for li, (lkey, *_rest) in enumerate(lessons, 1):
                m = KEY['l'].match(lkey)
                if not m or int(m.group(1)) != li:
                    problems.append(f'{tier}/{mkey}/{lkey} is not l{li:02d}-<slug>')
    print(f'{"total":<14} {total} lessons, all writable')
    print(f'PROBLEMS {len(problems)}' + (': ' + '; '.join(problems) if problems else ''))
    assert not problems
    titles = [l[1] for mods in TIERS.values() for m in mods for l in m[2]] \
        + [m[1] for mods in TIERS.values() for m in mods]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no "X, not Y" contrastives')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            assert len(set(l[0] for l in lessons)) == len(lessons), mkey
    print('lesson keys slugged (m<nn>-<slug>, l<nn>-<slug> at their own ordinal) and unique inside every module')
    mins = {}
    est = 0
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for lkey, ltitle, minutes, panels in lessons:
                assert minutes in MIN_WORDS, f'{tier}/{mkey}/{lkey} has no minimum for {minutes} minutes'
                mins.setdefault(MIN_WORDS[minutes], 0)
                mins[MIN_WORDS[minutes]] += 1
                est += minutes
    print(f'word band {WORD_BAND[0]} to {WORD_BAND[1]} prose words; per-lesson minimums: '
          + ', '.join(f'{k} words x {v}' for k, v in sorted(mins.items())) + f'; est_minutes total {est}')
    panelled = [l for mods in TIERS.values() for m in mods for l in m[2] if l[3]]
    print(f'panels: {len(panelled)} of {total} lessons carry one; '
          f'ids {sorted(set(p for l in panelled for p in l[3]))}')
