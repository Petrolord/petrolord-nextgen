# carbon: Carbon & Energy Efficiency. Three tiers, six modules each, 26
# lessons a tier. Academy module `energy_transition` (label "Energy
# Transition", already in src/lib/academyModules.js), path_order 52, built
# beside the sibling course `gasvalue` (Flare Gas to Value & LPG/CNG,
# path_order 51).
#
# THE ONE SENTENCE. A tonne of CO2e is carbon counted atom by atom, weighted by
# a declared GWP set and carried on a record that says where every factor came
# from, and a tonne saved is priced over the life of the measure that saves
# it; the engines refuse or name every box nobody filled (a destruction
# efficiency, a factor, a safe oxygen floor, a discount rate) instead of
# reading it as the best case.
#
# Panel ids: I the inventory explorer (the IGBOGENE sources as atom-balance and
# factor lines, the flare's destruction efficiency as a control with blank
# refused, the four GWP sets, computed against reportable, and intensity over
# two boundaries), E the efficiency explorer (the ISIOKPO fuel gas, stack
# oxygen and the stack losses on LHV and HHV, the tuning saving against its
# floor, the steam trap with its exponent, condensate, and the pinch with the
# minimum approach as a control), M the abatement explorer (the AGBOR measures
# costed and ranked into a curve, the target and its verdict, the path and its
# gap, and one saving priced in money and carbon).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engines: engines/downstream/carbonAbatement.js and energyEfficiency.js at
# petrolord-engines f0aef14 (MD5-0, engines PR #226, repaired twenty-one
# findings and holds four), vendored sha-identical by the shared vendor commit
# fe001b52. This course grades only carbonAbatement and energyEfficiency
# outputs.
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS with the sibling course `gasvalue` (Flare Gas to Value &
# LPG/CNG, path_order 51):
#  * `gasvalue` OWNS the flare as a resource: gas characterisation, the
#    flare's emissions as flareToValue computes them, recovery routes and
#    yields, the credit breakeven, LPG and CNG. It grades flareToValue and
#    lpgCng outputs only.
#  * THIS course OWNS the inventory: sources, GWP sets and their editions,
#    computed against reportable, intensity and its boundary, the cost per
#    tonne and the marginal abatement cost curve, target verdicts, the path,
#    and energy efficiency (combustion and stack loss, steam traps, condensate,
#    pinch, savings). Flare combustion appears here as an inventory line
#    computed by carbonAbatement, and only carbonAbatement outputs are graded.
#  * Nothing here grades NPV, IRR, Monte Carlo or a decision tree (the
#    Economics courses own them). A levelised cost per tonne is graded; the
#    simple payback is taught.
#  * No compressor thermodynamics (FC3 owns them).
# ---------------------------------------------------------------------------
I = 'carbon-inventory-explorer'
E = 'carbon-efficiency-explorer'
M = 'carbon-abatement-explorer'

WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-an-inventory-counts', 'What an Inventory Counts', [
    ('l01-two-apps-and-one-ledger', 'Two apps and one ledger', 12, []),
    ('l02-scope-1-and-scope-2', 'Scope 1 and Scope 2', 13, [I]),
    ('l03-missing-stays-missing', 'Missing stays missing', 13, [I]),
    ('l04-what-the-engines-will-not-ship', 'What the engines will not ship', 12, []),
  ]),
  ('m02-carbon-in-co2-out', 'Carbon In, CO2 Out', [
    ('l01-the-atom-balance', 'The atom balance', 13, [I]),
    ('l02-molar-masses-from-atomic-weights', 'Molar masses from atomic weights', 13, [I]),
    ('l03-carbon-per-kilomole-of-fuel', 'Carbon per kilomole of fuel', 13, [I]),
    ('l04-a-fired-heaters-co2', "A fired heater's CO2", 13, [I]),
    ('l05-what-the-atom-balance-refuses', 'What the atom balance refuses', 12, [I]),
  ]),
  ('m03-the-flare-as-an-inventory-line', 'The Flare as an Inventory Line', [
    ('l01-destruction-efficiency-is-an-input', 'Destruction efficiency is an input', 13, [I]),
    ('l02-a-blank-box-is-missing', 'A blank box is missing', 13, [I]),
    ('l03-what-escapes-is-counted-as-methane', 'What escapes is counted as methane', 14, [I]),
    ('l04-one-flare-at-five-efficiencies', 'One flare at five efficiencies', 13, [I]),
  ]),
  ('m04-global-warming-potentials', 'Global Warming Potentials', [
    ('l01-a-set-carries-its-report', 'A set carries its report', 13, [I]),
    ('l02-ar5-and-ar6', 'AR5 and AR6', 13, [I]),
    ('l03-fossil-and-non-fossil-methane', 'Fossil and non-fossil methane', 14, [I]),
    ('l04-one-inventory-on-four-sets', 'One inventory on four sets', 13, [I]),
    ('l05-which-set-to-file-on', 'Which set to file on', 12, []),
  ]),
  ('m05-lines-factors-and-provenance', 'Lines, Factors and Provenance', [
    ('l01-a-factor-is-a-record', 'A factor is a record', 13, [I]),
    ('l02-blocked-and-unsourced-lines', 'Blocked and unsourced lines', 13, [I]),
    ('l03-the-scope-totals', 'The scope totals', 13, [I]),
    ('l04-computed-and-reportable', 'Computed and reportable', 13, [I]),
    ('l05-intensity-and-its-boundary', 'Intensity and its boundary', 13, [I]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-igbogene-inventory-end-to-end', 'The Igbogene inventory end to end', 14, [I]),
    ('l02-what-is-held-in-the-inventory', 'What is held in the inventory', 13, []),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-combustion-from-the-fuel-analysis', 'Combustion from the Fuel Analysis', [
    ('l01-oxygen-demand-by-atom-counts', 'Oxygen demand by atom counts', 13, [E]),
    ('l02-air-and-the-flue-gas', 'Air and the flue gas', 13, [E]),
    ('l03-inerts-ride-through', 'Inerts ride through', 12, [E]),
    ('l04-atmospheric-nitrogen-and-its-argon', 'Atmospheric nitrogen and its argon', 13, [E]),
  ]),
  ('m02-excess-air-and-stack-oxygen', 'Excess Air and Stack Oxygen', [
    ('l01-reading-excess-air-from-oxygen', 'Reading excess air from oxygen', 13, [E]),
    ('l02-a-closed-form-and-a-bisection', 'A closed form and a bisection', 13, [E]),
    ('l03-what-the-oxygen-reading-cannot-see', 'What the oxygen reading cannot see', 12, [E]),
    ('l04-an-oxygen-the-fuel-cannot-reach', 'An oxygen the fuel cannot reach', 12, [E]),
  ]),
  ('m03-stack-loss-efficiency', 'Stack Loss Efficiency', [
    ('l01-losses-out-of-the-stack', 'Losses out of the stack', 13, [E]),
    ('l02-lhv-and-hhv', 'LHV and HHV', 14, [E]),
    ('l03-the-moisture-loss-on-each-basis', 'The moisture loss on each basis', 13, [E]),
    ('l04-radiation-is-an-input', 'Radiation is an input', 12, [E]),
    ('l05-two-bases-are-never-compared', 'Two bases are never compared', 12, [E]),
  ]),
  ('m04-what-tuning-is-worth', 'What Tuning Is Worth', [
    ('l01-fuel-is-duty-over-efficiency', 'Fuel is duty over efficiency', 13, [E]),
    ('l02-the-ratio-and-the-shortcut', 'The ratio and the shortcut', 14, [E]),
    ('l03-the-safe-oxygen-floor', 'The safe oxygen floor', 13, [E]),
    ('l04-a-year-of-fuel-saved', 'A year of fuel saved', 13, [E]),
  ]),
  ('m05-steam-condensate-and-the-pinch', 'Steam, Condensate and the Pinch', [
    ('l01-a-failed-trap-is-choked-flow', 'A failed trap is choked flow', 13, [E]),
    ('l02-the-isentropic-exponent', 'The isentropic exponent', 13, [E]),
    ('l03-fuel-and-carbon-need-a-boiler', 'Fuel and carbon need a boiler', 13, [E]),
    ('l04-condensate-return-and-its-floor', 'Condensate return and its floor', 13, [E]),
    ('l05-the-problem-table', 'The problem table', 14, [E]),
    ('l06-the-pinch-and-the-threshold', 'The pinch and the threshold', 13, [E]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-isiokpo-heater-end-to-end', 'The Isiokpo heater end to end', 14, [E]),
    ('l02-the-isiokpo-steam-and-streams-end-to-end', 'The Isiokpo steam and streams end to end', 14, [E]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-the-cost-of-a-tonne-abated', 'The Cost of a Tonne Abated', [
    ('l01-capital-recovery', 'Capital recovery', 13, [M]),
    ('l02-a-negative-cost-pays-for-itself', 'A negative cost pays for itself', 13, [M]),
    ('l03-a-blank-is-not-free', 'A blank is not free', 13, [M]),
    ('l04-a-rate-is-a-fraction', 'A rate is a fraction', 12, [M]),
    ('l05-one-year-against-a-life', 'One year against a life', 14, [M]),
  ]),
  ('m02-the-marginal-abatement-cost-curve', 'The Marginal Abatement Cost Curve', [
    ('l01-cheapest-first', 'Cheapest first', 13, [M]),
    ('l02-steps-that-tile-the-axis', 'Steps that tile the axis', 12, [M]),
    ('l03-the-weighted-average', 'The weighted average', 13, [M]),
    ('l04-measures-that-pay-for-themselves', 'Measures that pay for themselves', 13, [M]),
  ]),
  ('m03-interactions-and-over-claims', 'Interactions and Over-claims', [
    ('l01-two-measures-on-one-source', 'Two measures on one source', 13, [M]),
    ('l02-claims-above-what-a-source-emits', 'Claims above what a source emits', 14, [M]),
    ('l03-a-verdict-left-unassessed', 'A verdict left unassessed', 13, [M]),
    ('l04-a-source-with-no-emission-passed', 'A source with no emission passed', 12, [M]),
  ]),
  ('m04-targets-and-the-path', 'Targets and the Path', [
    ('l01-a-target-on-a-partial-inventory', 'A target on a partial inventory', 13, [M]),
    ('l02-a-straight-line-to-the-end-year', 'A straight line to the end year', 13, [M]),
    ('l03-the-unabated-gap', 'The unabated gap', 13, [M]),
    ('l04-measures-with-no-start-year', 'Measures with no start year', 12, [M]),
    ('l05-the-first-shortfall-year', 'The first shortfall year', 13, [M]),
  ]),
  ('m05-savings-into-the-ledger', 'Savings into the Ledger', [
    ('l01-one-saving-in-money-and-carbon', 'One saving in money and carbon', 13, [M]),
    ('l02-the-heating-value-basis', 'The heating value basis', 13, [M]),
    ('l03-the-cost-per-tonne-handed-over', 'The cost per tonne handed over', 14, [M]),
    ('l04-the-simple-payback', 'The simple payback', 12, [M]),
    ('l05-energy-intensity-and-its-peer', 'Energy intensity and its peer', 13, [M]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-agbor-programme-end-to-end', 'The Agbor programme end to end', 14, [M]),
    ('l02-what-is-held-and-what-is-decided', 'What is held and what is decided', 14, [M]),
    ('l03-what-the-oracles-check', 'What the oracles check', 13, []),
  ]),
 ],
}

# Nothing is held at the module level: both engines are vendored, the digest is
# built, and every module has its source. FINDINGS-carbon H1 (AR5 or AR6 as the
# recommended set), H2 (the methane heating value pair), H3 (escaped carbon
# counted as methane) and H4 (combustion N2O not computed) are taught as
# stated limits in Associate m03 l03, m04 l05 and m06 l02, Professional m03
# l02 and Expert m06 l02, and never graded.
HELD = {}

if __name__ == '__main__':
    total = 0
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        held = sum(len(m[2]) for m in mods if m[0] in HELD.get(tier, []))
        total += n
        print(f'{tier:<14} {len(mods)} modules  {n} lessons  ({held} held)')
        assert len(mods) == 6, f'{tier} has {len(mods)} modules'
        assert n == 26, f'{tier} has {n} lessons'
    print(f'{"total":<14} {total} lessons, all writable')
    titles = [l[1] for mods in TIERS.values() for m in mods for l in m[2]] \
        + [m[1] for mods in TIERS.values() for m in mods]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no "X, not Y" contrastives')
    for tier, mods in TIERS.items():
        assert len(set(m[0] for m in mods)) == len(mods), tier
        assert mods[5][0].endswith('reading'), f'{tier} module 6 is not the reading module'
        for mkey, mtitle, lessons in mods:
            assert len(set(l[0] for l in lessons)) == len(lessons), mkey
    print('lesson keys unique inside every module; module 6 of every tier is its reading module')
    mins = {}
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for lkey, ltitle, minutes, panels in lessons:
                assert minutes in MIN_WORDS, f'{tier}/{mkey}/{lkey} has no minimum for {minutes} minutes'
                mins.setdefault(MIN_WORDS[minutes], 0)
                mins[MIN_WORDS[minutes]] += 1
    print(f'word band {WORD_BAND[0]} to {WORD_BAND[1]} prose words; per-lesson minimums: '
          + ', '.join(f'{k} words x {v}' for k, v in sorted(mins.items())))
    est = {t: sum(l[2] for m in mods for l in m[2]) for t, mods in TIERS.items()}
    print('estimated minutes: ' + ', '.join(f'{t} {v}' for t, v in est.items()))
    panelled = [l for mods in TIERS.values() for m in mods for l in m[2] if l[3]]
    print(f'panels: {len(panelled)} of {total} lessons carry one; '
          f'ids {sorted(set(p for l in panelled for p in l[3]))}')
