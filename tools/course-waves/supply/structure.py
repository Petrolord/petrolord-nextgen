# supply: Terminals, Depots & Fuel Supply. Three tiers, six modules each, 26
# lessons a tier. Academy module `supply_chain` (label "Supply Chain &
# Logistics"), path_order 50, built beside the two Commercial & Trading courses
# (lead ruling 2026-09-19: no `downstream` academy module is created).
#
# THE ONE SENTENCE. A terminal's stock, a cargo's cost and a litre's pump price
# are each a chain of measured inputs walked in a stated order, and the engine
# refuses or names every link nobody measured (an opening stock, a strapping
# entry, a coefficient, a rate) instead of assuming it, because a figure that
# cannot come out wrong proves nothing.
#
# Panel ids: T the tank explorer (the AKODO strapping tables, a dip and a
# water cut the learner moves, the VCF as a typed figure and as the synthetic
# form, and the day's reconciliation with the opening stock as an input), D
# the depot explorer (the IBAFO loading rack as an Erlang C queue with bays and
# arrivals as controls, the tank farm tank by tank, the lane, the fleet and the
# station), P the price explorer (the BADAGRY cargo walked from FOB to landed,
# the pump price waterfall, and the exchange rate at which a cap stops covering
# the chain).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engines: engines/downstream/terminalDepot.js and fuelPricing.js at
# petrolord-engines e4d3b10 (MD3-0 repaired twelve findings and holds two;
# MD3-1 repaired this wave's three), vendored sha-identical by the shared
# vendor commit 41d88b9f (f45ce066 on this branch). This
# course grades only terminalDepot and fuelPricing outputs.
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS with the two sibling Commercial & Trading courses:
#  * `crude` (Crude Assay & Blending, path_order 48) owns linear programming,
#    crudeAssay and productBlending. Nothing here teaches or grades an LP, a
#    blend or an assay.
#  * `refinery` (Refinery Feasibility & Planning, path_order 49) owns plan,
#    schedule and actuals variance and the modular feasibility screen.
#  * THIS course owns measurement and logistics: strapping, the VCF form, free
#    water, stock reconciliation, the Erlang C queue, landed cost, pump price,
#    trucking and station sizing. Neither sibling grades any of these.
#  * Nothing here grades NPV, IRR, Monte Carlo or a decision tree (the
#    Economics courses own them). throughputEconomics is taught as a margin and
#    a carbon ledger and never as a valuation.
# ---------------------------------------------------------------------------
T = 'supply-tank-explorer'
D = 'supply-depot-explorer'
P = 'supply-price-explorer'

WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-a-terminal-measures', 'What a Terminal Measures', [
    ('l01-two-apps-and-one-chain', 'Two apps and one chain', 12, []),
    ('l02-everything-starts-from-a-dip', 'Everything starts from a dip', 13, [T]),
    ('l03-missing-stays-missing', 'Missing stays missing', 13, [T]),
    ('l04-what-the-engine-will-not-ship', 'What the engine will not ship', 12, []),
  ]),
  ('m02-the-strapping-table', 'The Strapping Table', [
    ('l01-a-table-of-heights-and-volumes', 'A table of heights and volumes', 13, [T]),
    ('l02-between-two-entries', 'Between two entries', 13, [T]),
    ('l03-below-the-first-entry', 'Below the first entry', 12, [T]),
    ('l04-above-the-last-entry', 'Above the last entry', 12, [T]),
    ('l05-a-horizontal-tank-and-its-curve', 'A horizontal tank and its curve', 14, [T]),
  ]),
  ('m03-free-water-and-the-gross-volume', 'Free Water and the Gross Volume', [
    ('l01-water-under-the-product', 'Water under the product', 13, [T]),
    ('l02-the-water-cut-through-the-same-table', 'The water cut through the same table', 13, [T]),
    ('l03-a-water-cut-the-engine-refuses', 'A water cut the engine refuses', 12, [T]),
    ('l04-the-gross-observed-volume', 'The gross observed volume', 13, [T]),
  ]),
  ('m04-the-volume-correction-factor', 'The Volume Correction Factor', [
    ('l01-a-litre-grows-when-it-warms', 'A litre grows when it warms', 13, [T]),
    ('l02-the-form-of-the-correction', 'The form of the correction', 14, [T]),
    ('l03-the-coefficients-are-an-input', 'The coefficients are an input', 13, [T]),
    ('l04-a-vcf-read-off-your-own-table', 'A VCF read off your own table', 12, [T]),
    ('l05-the-standard-volume', 'The standard volume', 13, [T]),
  ]),
  ('m05-closing-the-day', 'Closing the Day', [
    ('l01-opening-plus-receipts-less-deliveries', 'Opening plus receipts less deliveries', 13, [T]),
    ('l02-no-opening-stock-no-day', 'No opening stock, no day', 12, [T]),
    ('l03-a-reconciliation-that-cannot-fail', 'A reconciliation that cannot fail', 14, [T]),
    ('l04-tolerance-on-what-moved', 'Tolerance on what moved', 13, [T]),
    ('l05-a-run-in-one-direction', 'A run in one direction', 13, [T]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-akodo-tanks-end-to-end', 'The Akodo tanks end to end', 14, [T]),
    ('l02-the-akodo-day-end-to-end', 'The Akodo day end to end', 14, [T]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-the-loading-rack-as-a-queue', 'The Loading Rack as a Queue', [
    ('l01-trucks-arrive-irregularly', 'Trucks arrive irregularly', 12, [D]),
    ('l02-offered-load-and-utilisation', 'Offered load and utilisation', 13, [D]),
    ('l03-the-probability-of-waiting', 'The probability of waiting', 14, [D]),
    ('l04-waiting-and-being-turned-away', 'Waiting and being turned away', 13, [D]),
    ('l05-bays-are-whole-numbers', 'Bays are whole numbers', 12, [D]),
  ]),
  ('m02-waiting-time-and-a-full-rack', 'Waiting Time and a Full Rack', [
    ('l01-the-mean-wait-in-minutes', 'The mean wait in minutes', 13, [D]),
    ('l02-the-queue-by-littles-law', "The queue by Little's law", 13, [D]),
    ('l03-a-rack-that-cannot-keep-up', 'A rack that cannot keep up', 13, [D]),
    ('l04-one-more-bay', 'One more bay', 14, [D]),
  ]),
  ('m03-the-tank-farm', 'The Tank Farm', [
    ('l01-capacity-heel-and-working-capacity', 'Capacity, heel and working capacity', 13, [D]),
    ('l02-pumpable-stock-tank-by-tank', 'Pumpable stock tank by tank', 14, [D]),
    ('l03-days-of-cover', 'Days of cover', 13, [D]),
    ('l04-ullage-and-turns', 'Ullage and turns', 12, [D]),
  ]),
  ('m04-throughput-economics', 'Throughput Economics', [
    ('l01-fee-variable-cost-and-fixed-cost', 'Fee, variable cost and fixed cost', 13, [D]),
    ('l02-a-loss-has-a-weight', 'A loss has a weight', 13, [D]),
    ('l03-no-factor-no-carbon', 'No factor, no carbon', 12, [D]),
    ('l04-two-ledgers-from-one-set-of-volumes', 'Two ledgers from one set of volumes', 13, [D]),
  ]),
  ('m05-the-lane-the-fleet-and-the-station', 'The Lane, the Fleet and the Station', [
    ('l01-the-cycle-sets-the-trips', 'The cycle sets the trips', 13, [D]),
    ('l02-the-cost-of-a-litre-delivered', 'The cost of a litre delivered', 14, [D]),
    ('l03-a-blank-cost-is-a-missing-cost', 'A blank cost is a missing cost', 12, [D]),
    ('l04-a-fleet-is-a-whole-number-of-trucks', 'A fleet is a whole number of trucks', 13, [D]),
    ('l05-the-forecourt-is-the-same-queue', 'The forecourt is the same queue', 13, [D]),
    ('l06-the-load-that-will-not-fit', 'The load that will not fit', 13, [D]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-ibafo-rack-and-farm-end-to-end', 'The Ibafo rack and farm end to end', 14, [D]),
    ('l02-the-ibafo-lane-and-stations-end-to-end', 'The Ibafo lane and stations end to end', 14, [D]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-one-cargo-every-way', 'One Cargo Every Way', [
    ('l01-tonnes-cubic-metres-litres-and-barrels', 'Tonnes, cubic metres, litres and barrels', 13, [P]),
    ('l02-density-is-required', 'Density is required', 12, [P]),
    ('l03-the-barrel-by-definition', 'The barrel by definition', 12, [P]),
    ('l04-the-templates-carry-line-items', 'The templates carry line items', 13, [P]),
  ]),
  ('m02-the-landed-cost-walk', 'The Landed Cost Walk', [
    ('l01-fob-c-and-f-and-cif', 'FOB, C&F and CIF', 13, [P]),
    ('l02-every-charge-names-its-base', 'Every charge names its base', 13, [P]),
    ('l03-insurance-quoted-on-cif', 'Insurance quoted on CIF', 14, [P]),
    ('l04-a-base-that-does-not-exist-yet', 'A base that does not exist yet', 12, [P]),
    ('l05-a-missing-rate-makes-a-floor', 'A missing rate makes a floor', 13, [P]),
  ]),
  ('m03-ocean-loss-and-the-litre-sold', 'Ocean Loss and the Litre Sold', [
    ('l01-paid-on-the-bill-of-lading', 'Paid on the bill of lading', 13, [P]),
    ('l02-divided-by-the-outturn', 'Divided by the outturn', 14, [P]),
    ('l03-the-exchange-rate', 'The exchange rate', 12, [P]),
    ('l04-the-charges-levied-at-discharge', 'The charges levied at discharge', 13, [P]),
  ]),
  ('m04-from-depot-gate-to-nozzle', 'From Depot Gate to Nozzle', [
    ('l01-the-pump-price-as-a-waterfall', 'The pump price as a waterfall', 13, [P]),
    ('l02-a-percent-of-the-running-total', 'A percent of the running total', 13, [P]),
    ('l03-who-gets-what', 'Who gets what', 13, [P]),
    ('l04-the-government-share', 'The government share', 12, [P]),
    ('l05-the-cap-and-the-shortfall', 'The cap and the shortfall', 14, [P]),
  ]),
  ('m05-what-breaks-the-price', 'What Breaks the Price', [
    ('l01-the-price-along-the-exchange-rate', 'The price along the exchange rate', 13, [P]),
    ('l02-bisection-inside-a-bracket', 'Bisection inside a bracket', 13, [P]),
    ('l03-no-crossing-in-the-range', 'No crossing in the range', 12, [P]),
    ('l04-the-sensitivity-table', 'The sensitivity table', 13, [P]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-badagry-cargo-end-to-end', 'The Badagry cargo end to end', 14, [P]),
    ('l02-what-is-held-and-what-is-decided', 'What is held and what is decided', 14, [P]),
    ('l03-what-the-oracles-check', 'What the oracles check', 13, []),
    ('l04-where-this-course-hands-over', 'Where this course hands over', 12, []),
  ]),
 ],
}

# Nothing is held at the module level: both engines are vendored, the digest is
# built, and every module has its source. FINDINGS-supply H1 (discharge charges
# on the bill-of-lading quantity) and H2 (no VCF table and no rate shipped) are
# taught as stated limits in Expert m03 l04, Associate m04 l03 and Expert m06
# l02, and never graded.
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
