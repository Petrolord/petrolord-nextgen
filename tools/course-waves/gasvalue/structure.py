# gasvalue: Flare Gas to Value & LPG/CNG. Three tiers, six modules each, 26
# lessons a tier. Academy module `energy_transition` ("Energy Transition"),
# path_order 51, the first Energy Transition course; `carbon` (Carbon & Energy
# Efficiency, path_order 52) is built beside it.
#
# THE ONE SENTENCE. A flare is a measured gas before it is an emission or a
# product: its heating value, its liquids and its carbon come from the analysis
# by the mole, the flare's CO2 and methane follow the rule's two efficiencies,
# a route can yield no more than the gas holds and is credited only for the
# share it recovers against a declared counterfactual, and the LPG vessel, the
# vaporizer, the carousel, the CNG bank and the cascade are each sized on the
# basis the engine states (a fill limit's basis, the boiling point at pressure,
# the positions wholly working, absolute pressure, real gas, equalisation).
#
# Panel ids: G the flare explorer (a gas analysis the learner edits, the gas
# characterised by the mole, the liquids and their mass ceiling, the flare's
# CO2, methane and CO2e under its two efficiencies), R the route explorer (four
# routes, their envelopes and yield ceilings, a route's year, the capital, the
# counterfactual, the credit breakeven and the bid table), S the rollout
# explorer (the LPG blend and vessel, the vaporizer, the carousel queue, the
# cylinder float, the CNG bank, the cascade, the forecourt and the customer's
# switch).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engines: engines/downstream/flareToValue.js and engines/downstream/lpgCng.js
# at petrolord-engines f0aef14 (MD4-0 repaired this scope), vendored
# sha-identical by the shared vendor commit fe001b52.
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS:
#  * `carbon` (Carbon & Energy Efficiency, path_order 52) OWNS the inventory:
#    emission sources, GWP sets and their editions, computed against
#    reportable, intensity, the abatement cost per tonne, the MAC curve,
#    targets and energy efficiency. It teaches flare combustion as an
#    inventory line and grades carbonAbatement only. THIS course owns the
#    flare as a resource and grades flareToValue and lpgCng only. A GWP here
#    is a case input, never taught as a choice between editions.
#  * Facilities (FC3) owns compressor thermodynamics. cngCompression is taught
#    as a unit bridge into that engine and is never graded.
#  * Nothing here grades NPV, IRR, Monte Carlo or a decision tree (Economics).
#    A simple payback and a breakeven credit price are graded.
# ---------------------------------------------------------------------------
import re

G = 'gasvalue-flare-explorer'
R = 'gasvalue-route-explorer'
S = 'gasvalue-rollout-explorer'

WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-is-being-flared', 'What Is Being Flared', [
    ('l01-two-apps-and-one-gas', 'Two apps and one gas', 12, []),
    ('l02-a-standard-cubic-foot-is-a-count-of-moles', 'A standard cubic foot is a count of moles', 13, [G]),
    ('l03-the-component-reference-table', 'The component reference table', 13, [G]),
    ('l04-an-analysis-that-does-not-sum-to-one', 'An analysis that does not sum to one', 13, [G]),
  ]),
  ('m02-the-gas-by-the-mole', 'The Gas by the Mole', [
    ('l01-heating-value-blends-on-moles', 'Heating value blends on moles', 13, [G]),
    ('l02-inerts-and-the-co2-in-the-gas', 'Inerts and the CO2 in the gas', 13, [G]),
    ('l03-carbon-atom-by-atom', 'Carbon atom by atom', 14, [G]),
    ('l04-the-mass-in-a-thousand-cubic-feet', 'The mass in a thousand cubic feet', 14, [G]),
    ('l05-a-carbon-number-is-never-assumed', 'A carbon number is never assumed', 12, [G]),
  ]),
  ('m03-the-liquids-in-the-gas', 'The Liquids in the Gas', [
    ('l01-gallons-per-thousand-cubic-feet', 'Gallons per thousand cubic feet', 14, [G]),
    ('l02-ethane-plus-and-propane-plus', 'Ethane plus and propane plus', 13, [G]),
    ('l03-rich-moderate-and-lean', 'Rich, moderate and lean', 13, [G]),
    ('l04-a-missing-density-is-a-missing-answer', 'A missing density is a missing answer', 12, [G]),
    ('l05-the-mass-ceiling-on-liquids', 'The mass ceiling on liquids', 13, [G]),
  ]),
  ('m04-the-flare-by-the-rule', 'The Flare by the Rule', [
    ('l01-what-a-flare-emits', 'What a flare emits', 13, [G]),
    ('l02-co2-from-the-hydrocarbon-carbon', 'CO2 from the hydrocarbon carbon', 14, [G]),
    ('l03-the-co2-in-the-gas-passes-through', 'The CO2 in the gas passes through', 13, [G]),
    ('l04-methane-from-the-methane', 'Methane from the methane', 14, [G]),
    ('l05-destruction-and-combustion-efficiency', 'Destruction and combustion efficiency', 14, [G]),
  ]),
  ('m05-co2e-and-its-limits', 'CO2e and Its Limits', [
    ('l01-co2e-with-a-stated-gwp', 'CO2e with a stated GWP', 13, [G]),
    ('l02-the-methane-share', 'The methane share', 13, [G]),
    ('l03-no-efficiency-no-flare', 'No efficiency, no flare', 12, [G]),
    ('l04-what-the-flare-model-leaves-out', 'What the flare model leaves out', 13, []),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-egbema-flare-end-to-end', 'The Egbema flare end to end', 14, [G]),
    ('l02-the-studios-opening-gas', "The studio's opening gas", 13, [G]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-four-routes-and-their-envelopes', 'Four Routes and Their Envelopes', [
    ('l01-four-ways-to-sell-a-flare', 'Four ways to sell a flare', 12, []),
    ('l02-a-limit-is-yours-to-set', 'A limit is yours to set', 13, [R]),
    ('l03-pass-fail-and-not-fully-screened', 'Pass, fail and not fully screened', 14, [R]),
    ('l04-a-failure-names-its-requirement', 'A failure names its requirement', 13, [R]),
  ]),
  ('m02-what-the-gas-can-yield', 'What the Gas Can Yield', [
    ('l01-a-yield-has-a-basis', 'A yield has a basis', 13, [R]),
    ('l02-the-ceiling-on-each-route', 'The ceiling on each route', 14, [R]),
    ('l03-megawatt-hours-from-the-heating-value', 'Megawatt hours from the heating value', 13, [R]),
    ('l04-a-yield-above-the-gas-is-refused', 'A yield above the gas is refused', 12, [R]),
  ]),
  ('m03-a-routes-year', "A Route's Year", [
    ('l01-thousand-cubic-feet-a-year', 'Thousand cubic feet a year', 13, [R]),
    ('l02-recovery-is-a-design-outcome', 'Recovery is a design outcome', 13, [R]),
    ('l03-revenue-cost-and-margin', 'Revenue, cost and margin', 14, [R]),
    ('l04-a-blank-cost-is-named', 'A blank cost is named', 12, [R]),
    ('l05-capital-by-the-modular-power-law', 'Capital by the modular power law', 14, [R]),
  ]),
  ('m04-the-counterfactual', 'The Counterfactual', [
    ('l01-the-gross-flare-is-not-the-abatement', 'The gross flare is not the abatement', 13, [R]),
    ('l02-only-the-recovered-share-is-avoided', 'Only the recovered share is avoided', 14, [R]),
    ('l03-what-burning-the-product-emits', 'What burning the product emits', 13, [R]),
    ('l04-what-the-product-displaces', 'What the product displaces', 13, [R]),
    ('l05-blocked-until-declared', 'Blocked until declared', 12, [R]),
  ]),
  ('m05-credits-and-the-bid', 'Credits and the Bid', [
    ('l01-does-the-project-need-credits', 'Does the project need credits', 13, [R]),
    ('l02-the-breakeven-credit-price', 'The breakeven credit price', 14, [R]),
    ('l03-the-lowest-tested-price-that-clears', 'The lowest tested price that clears', 13, [R]),
    ('l04-no-abatement-no-credits', 'No abatement, no credits', 12, [R]),
    ('l05-the-bid-table', 'The bid table', 14, [R]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-egbema-routes-end-to-end', 'The Egbema routes end to end', 14, [R]),
    ('l02-what-the-oracle-checks-on-a-parcel', 'What the oracle checks on a parcel', 13, []),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-the-lpg-blend-and-the-vessel', 'The LPG Blend and the Vessel', [
    ('l01-three-properties-three-bases', 'Three properties, three bases', 13, [S]),
    ('l02-the-fill-limit-and-its-basis', 'The fill limit and its basis', 14, [S]),
    ('l03-usable-stock-and-the-vapour-space', 'Usable stock and the vapour space', 13, [S]),
    ('l04-cover-reorder-and-ullage', 'Cover, reorder and ullage', 13, [S]),
    ('l05-a-blank-lead-time-is-missing', 'A blank lead time is missing', 12, [S]),
  ]),
  ('m02-vaporizer-carousel-and-float', 'Vaporizer, Carousel and Float', [
    ('l01-three-terms-of-vaporizer-duty', 'Three terms of vaporizer duty', 14, [S]),
    ('l02-the-boiling-point-at-pressure', 'The boiling point at pressure', 13, [S]),
    ('l03-the-carousel-is-a-queue', 'The carousel is a queue', 14, [S]),
    ('l04-positions-wholly-working', 'Positions wholly working', 13, [S]),
    ('l05-cylinders-in-circulation', 'Cylinders in circulation', 13, [S]),
  ]),
  ('m03-gas-in-a-bank', 'Gas in a Bank', [
    ('l01-real-gas-at-storage-pressure', 'Real gas at storage pressure', 14, [S]),
    ('l02-ideal-against-real', 'Ideal against real', 13, [S]),
    ('l03-gauge-and-absolute', 'Gauge and absolute', 13, [S]),
    ('l04-the-correlations-range', "The correlation's range", 12, [S]),
  ]),
  ('m04-the-cascade', 'The Cascade', [
    ('l01-equalising-bank-by-bank', 'Equalising bank by bank', 14, [S]),
    ('l02-fills-before-recharge', 'Fills before recharge', 13, [S]),
    ('l03-what-is-left-in-the-banks', 'What is left in the banks', 13, [S]),
    ('l04-the-compressor-as-a-unit-bridge', 'The compressor as a unit bridge', 12, [S]),
    ('l05-the-forecourt-queue', 'The forecourt queue', 13, [S]),
  ]),
  ('m05-the-customers-switch', "The Customer's Switch", [
    ('l01-cost-per-kilometre', 'Cost per kilometre', 13, [S]),
    ('l02-energy-equivalence-and-its-ratio', 'Energy equivalence and its ratio', 14, [S]),
    ('l03-simple-payback-undiscounted', 'Simple payback, undiscounted', 13, [S]),
    ('l04-trailers-to-the-daughter-station', 'Trailers to the daughter station', 12, [S]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-kano-and-ibafo-rollout-end-to-end', 'The Kano and Ibafo rollout end to end', 14, [S]),
    ('l02-what-is-held-and-what-the-oracles-check', 'What is held and what the oracles check', 14, []),
    ('l03-where-this-course-hands-over', 'Where this course hands over', 12, []),
  ]),
 ],
}

# Nothing is held back from writing: the engines are vendored, the digest is
# built, and every module has its source. The four FINDINGS-gasvalue HELD items
# are TAUGHT as stated limits and never graded: H1 the flare efficiency tiers
# and H2 the unlit flare (Associate m05 l04), H3 the code fill limits (Expert
# m01 l02) and H4 GWP values and credit prices as case inputs (Associate m05
# l01, Professional m05 l02); all four again in Expert m06 l02.
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
