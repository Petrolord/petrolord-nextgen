# refinery: Refinery Feasibility & Planning. Three tiers, six modules each, 26
# lessons a tier. Academy module `downstream`, path_order 49.
#
# THE ONE SENTENCE. A refinery is judged on its margin per barrel of crude: the
# screen prices that barrel before any capital is spent, the plan finds it with
# every barrel run through the crude unit, the schedule dates it, and the
# actuals are read against it line by line on what each gap did to margin.
#
# Panel ids: S the screen explorer (a modular refinery's capital under both
# scaling laws, the product slate, the annual throughput and gross margin, the
# supply scenarios and the licensing tracker), P the plan explorer (a month's
# configuration plan: crude runs, the crude unit's utilisation, the margin, the
# stream balances and marginal values, and the schedule it cascades into), V the
# variance explorer (plan against actuals on one event shape: volume, price and
# unexplained variance, totals on margin, units against plan, and an expansion
# valued through the screening engine with its tax losses carried forward).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engines: engines/downstream (refineryPlanning, streamModel, modularRefinery)
# and lib/lp/simplex at petrolord-engines 60ee266 (MD2-0 repairs in), vendored in
# the shared commit b1f29251, and engines/economics/screening.js as NextGen
# vendors it (an older copy, VENDOR.json group 4, carrying lossCarryForward).
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS with the two sibling Commercial & Trading courses:
#  * `crude` (Crude Assay & Blending, path_order 48) OWNS linear programming:
#    what an LP is, binding constraints, a shadow price as the value of one unit
#    of relief, infeasible as an answer. This course USES the plan's LP and reads
#    its stream marginal values; it does not re-teach LP fundamentals and grades
#    nothing from crudeAssay or productBlending.
#  * `supply` (Terminals, Depots & Fuel Supply, path_order 50) OWNS measurement
#    and logistics: strapping, the VCF, stock reconciliation, the Erlang C
#    queue, landed cost, pump price. Nothing here grades any of them.
#  * The Economics courses OWN NPV, IRR, Monte Carlo and decision trees. This
#    course teaches the feasibility NPV the screening engine returns and grades
#    neither the NPV nor the IRR.
# ---------------------------------------------------------------------------
S = 'refinery-screen-explorer'
P = 'refinery-plan-explorer'
V = 'refinery-variance-explorer'

WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-a-feasibility-screen-computes', 'What a Feasibility Screen Computes', [
    ('l01-two-apps-and-one-barrel', 'Two apps and one barrel', 12, []),
    ('l02-a-screen-before-a-study', 'A screen before a study', 13, [S]),
    ('l03-a-blank-box-is-refused', 'A blank box is refused', 13, [S]),
    ('l04-illustrative-prices-and-what-they-give', 'Illustrative prices and what they give', 12, [S]),
  ]),
  ('m02-capital-and-the-scaling-law', 'Capital and the Scaling Law', [
    ('l01-cost-from-a-reference-point', 'Cost from a reference point', 13, [S]),
    ('l02-six-tenths-and-nine-tenths', 'Six tenths and nine tenths', 14, [S]),
    ('l03-the-crossover-at-the-reference-size', 'The crossover at the reference size', 14, [S]),
    ('l04-cost-per-barrel-of-capacity', 'Cost per barrel of capacity', 13, [S]),
    ('l05-the-exponents-are-held', 'The exponents are held', 12, [S]),
  ]),
  ('m03-the-product-slate', 'The Product Slate', [
    ('l01-three-configurations', 'Three configurations', 13, [S]),
    ('l02-value-per-barrel-of-crude', 'Value per barrel of crude', 14, [S]),
    ('l03-the-loss-is-carried', 'The loss is carried', 12, [S]),
    ('l04-an-unpriced-product-is-named', 'An unpriced product is named', 13, [S]),
    ('l05-yields-that-do-not-close', 'Yields that do not close', 13, [S]),
  ]),
  ('m04-throughput-and-the-gross-margin', 'Throughput and the Gross Margin', [
    ('l01-nameplate-days-and-utilisation', 'Nameplate, days and utilisation', 13, [S]),
    ('l02-utilisation-is-a-fraction', 'Utilisation is a fraction', 12, [S]),
    ('l03-the-gross-margin-per-barrel', 'The gross margin per barrel', 14, [S]),
    ('l04-the-annual-streams', 'The annual streams', 14, [S]),
    ('l05-capital-in-the-construction-years', 'Capital in the construction years', 13, [S]),
  ]),
  ('m05-crude-supply-and-licensing', 'Crude Supply and Licensing', [
    ('l01-three-supply-scenarios', 'Three supply scenarios', 13, [S]),
    ('l02-the-premium-and-the-run-rate', 'The premium and the run rate', 14, [S]),
    ('l03-the-licensing-sequence', 'The licensing sequence', 12, [S]),
    ('l04-licences-out-of-order', 'Licences out of order', 12, [S]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-okordia-screen-end-to-end', 'The Okordia screen end to end', 14, [S]),
    ('l02-okordia-under-three-supplies', 'Okordia under three supplies', 14, [S]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-the-configuration', 'The Configuration', [
    ('l01-crudes-units-products-and-streams', 'Crudes, units, products and streams', 13, [P]),
    ('l02-yields-are-data', 'Yields are data', 12, [P]),
    ('l03-a-recipe-places-a-stream', 'A recipe places a stream', 13, [P]),
    ('l04-blank-limits-and-typed-zeros', 'Blank limits and typed zeros', 14, [P]),
  ]),
  ('m02-the-crude-unit-carries-every-barrel', 'The Crude Unit Carries Every Barrel', [
    ('l01-a-unit-with-no-feed', 'A unit with no feed', 13, [P]),
    ('l02-crude-run-and-crude-unit-throughput', 'Crude run and crude unit throughput', 13, [P]),
    ('l03-utilisation-against-capacity', 'Utilisation against capacity', 14, [P]),
    ('l04-the-crude-unit-operating-cost', 'The crude unit operating cost', 13, [P]),
  ]),
  ('m03-reading-the-plan', 'Reading the Plan', [
    ('l01-revenue-less-crude-and-units', 'Revenue less crude and units', 13, [P]),
    ('l02-gross-margin-per-barrel-of-crude', 'Gross margin per barrel of crude', 14, [P]),
    ('l03-stream-balances-and-surplus', 'Stream balances and surplus', 13, [P]),
    ('l04-what-binds-the-plan', 'What binds the plan', 14, [P]),
    ('l05-infeasible-and-unbounded-plans', 'Infeasible and unbounded plans', 13, [P]),
  ]),
  ('m04-what-another-barrel-is-worth', 'What Another Barrel Is Worth', [
    ('l01-the-stream-marginal-value', 'The stream marginal value', 14, [P]),
    ('l02-a-stream-worth-its-product-price', 'A stream worth its product price', 13, [P]),
    ('l03-a-stream-valued-through-a-unit', 'A stream valued through a unit', 14, [P]),
    ('l04-a-stream-worth-nothing', 'A stream worth nothing', 12, [P]),
    ('l05-pricing-a-debottleneck', 'Pricing a debottleneck', 14, [P]),
  ]),
  ('m05-the-schedule', 'The Schedule', [
    ('l01-cargoes-spaced-across-the-period', 'Cargoes spaced across the period', 13, [P]),
    ('l02-weekly-unit-runs-and-lifts', 'Weekly unit runs and lifts', 13, [P]),
    ('l03-a-fixed-period-start', 'A fixed period start', 13, [P]),
    ('l04-dates-in-every-time-zone', 'Dates in every time zone', 14, [P]),
    ('l05-what-the-schedule-leaves-out', 'What the schedule leaves out', 12, [P]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-abua-plan-end-to-end', 'The Abua plan end to end', 14, [P]),
    ('l02-the-abua-schedule-end-to-end', 'The Abua schedule end to end', 14, [P]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-one-shape-three-ledgers', 'One Shape, Three Ledgers', [
    ('l01-plan-schedule-and-actual', 'Plan, schedule and actual', 13, [V]),
    ('l02-an-event-and-its-value', 'An event and its value', 13, [V]),
    ('l03-what-an-event-refuses', 'What an event refuses', 12, [V]),
    ('l04-the-plan-ledger', 'The plan ledger', 14, [V]),
  ]),
  ('m02-volume-and-price-variance', 'Volume and Price Variance', [
    ('l01-matched-on-material-and-type', 'Matched on material and type', 13, [V]),
    ('l02-the-volume-variance', 'The volume variance', 14, [V]),
    ('l03-the-price-variance', 'The price variance', 14, [V]),
    ('l04-money-with-no-barrels', 'Money with no barrels', 13, [V]),
    ('l05-unmatched-movements', 'Unmatched movements', 13, [V]),
  ]),
  ('m03-variance-on-margin', 'Variance on Margin', [
    ('l01-cost-lines-and-revenue-lines', 'Cost lines and revenue lines', 13, [V]),
    ('l02-the-margin-effect', 'The margin effect', 14, [V]),
    ('l03-totals-on-margin', 'Totals on margin', 14, [V]),
    ('l04-units-against-plan', 'Units against plan', 13, [V]),
  ]),
  ('m04-the-investment-case', 'The Investment Case', [
    ('l01-streams-into-the-screening-engine', 'Streams into the screening engine', 14, [V]),
    ('l02-revenue-as-revenue', 'Revenue as revenue', 13, [V]),
    ('l03-no-royalty-on-a-refinery', 'No royalty on a refinery', 12, [V]),
    ('l04-capital-expensed-when-spent', 'Capital expensed when spent', 13, [V]),
    ('l05-the-feasibility-npv', 'The feasibility NPV', 14, [V]),
  ]),
  ('m05-tax-losses-carried-forward', 'Tax Losses Carried Forward', [
    ('l01-a-construction-year-loss', 'A construction year loss', 13, [V]),
    ('l02-the-loss-pool-year-by-year', 'The loss pool year by year', 14, [V]),
    ('l03-the-first-taxable-year', 'The first taxable year', 14, [V]),
    ('l04-what-carrying-the-loss-is-worth', 'What carrying the loss is worth', 13, [V]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-odioma-month-end-to-end', 'The Odioma month end to end', 14, [V]),
    ('l02-the-odioma-expansion-end-to-end', 'The Odioma expansion end to end', 14, [V]),
    ('l03-what-is-held-and-what-the-oracles-check', 'What is held and what the oracles check', 13, []),
    ('l04-where-this-course-hands-over', 'Where this course hands over', 12, []),
  ]),
 ],
}

# Nothing is held at the tier level: the engines are vendored at the MD2-0
# repair and the digest is built. Two recon findings (RECON.md 3b, 3c) are
# STOPPED items the lead rules on; no lesson depends on them.
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
        assert 'reading' in mods[5][0], f'{tier} module 6 is not the reading module'
    print(f'{"total":<14} {total} lessons, all writable')
    titles = [l[1] for mods in TIERS.values() for m in mods for l in m[2]] \
        + [m[1] for mods in TIERS.values() for m in mods]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no "X, not Y" contrastives')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            assert len(set(l[0] for l in lessons)) == len(lessons), mkey
    print('lesson keys unique inside every module')
    mins = {}
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for lkey, ltitle, minutes, panels in lessons:
                assert minutes in MIN_WORDS, f'{tier}/{mkey}/{lkey} has no minimum for {minutes} minutes'
                mins.setdefault(MIN_WORDS[minutes], 0)
                mins[MIN_WORDS[minutes]] += 1
    print(f'word band {WORD_BAND[0]} to {WORD_BAND[1]} prose words; per-lesson minimums: '
          + ', '.join(f'{k} words x {v}' for k, v in sorted(mins.items())))
    panelled = [l for mods in TIERS.values() for m in mods for l in m[2] if l[3]]
    print(f'panels: {len(panelled)} of {total} lessons carry one; '
          f'ids {sorted(set(p for l in panelled for p in l[3]))}')
