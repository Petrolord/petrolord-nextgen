# `supply` RECON: Terminals, Depots & Fuel Supply

Academy module `supply_chain` (label "Supply Chain & Logistics"), path_order 50,
slug `supply` (lead ruling 2026-09-19; the engine family stays engines/downstream).
Built beside the two Commercial & Trading courses, `crude` and `refinery`. Subject:
`engines/downstream/terminalDepot.js` and `engines/downstream/fuelPricing.js`
as vendored sha-identical from petrolord-engines **60ee266** (MD3-0, engines PR
#221) by the shared vendor commit b1f29251; their goldens
`test-data/downstream/goldens/terminaldepot_cases.json` and
`fuelpricing_cases.json`; their oracles `oracle_terminaldepot.py` and
`oracle_fuelpricing.py` and `FINDINGS-supply.md` under
`tools/validation/downstream/`; and the two live Suite apps that call them,
Terminal & Depot Operations and Fuel Pricing & Supply Chain.

> RECON.md IS PROVENANCE. No writer may quote a figure from this file. The
> teaching truth is `digest.txt`, and every figure below that is not a count of
> files or cases was produced by running the engine or the oracle, and is
> reproduced by the command shown beside it.

## THE ONE SENTENCE

**A terminal's stock, a cargo's cost and a litre's pump price are each a chain
of measured inputs walked in a stated order, and the engine refuses or names
every link nobody measured (an opening stock, a strapping entry, a coefficient,
a rate) instead of assuming it, because a figure that cannot come out wrong
proves nothing.**

## WHAT THE COURSE CHOSE TO TEACH, AND WHAT IT LEAVES OUT

The two modules export 17 functions and 8 constants (digest SECTION 1 counts
them from the modules). The three tiers follow the order product moves in:

- **Associate, THE TANK AND THE DAY** (terminalDepot measurement). A dip through
  a strapping table, linear between entries and refused outside them; free
  water through the same table; the ASTM D1250 VCF form on SYNTHETIC
  coefficients and a VCF typed off the terminal's own tables; the day closed
  from yesterday's closing stock against a tolerance on throughput; the trend.
  Graded: six volumes in m3.
- **Professional, THE RACK, THE TANK FARM AND THE LANE** (terminalDepot
  queueing and cover, throughputEconomics, fuelPricing trucking, fleet and
  station). Erlang C, pumpable stock tank by tank, the cycle, the cost of a
  litre delivered, the fleet ceiling, the forecourt as the same queue. Graded:
  a probability, a wait, a stock, days of cover, a cost per litre, a truck
  count.
- **Expert, THE CARGO AND THE PRICE** (fuelPricing). One cargo every way, the
  landed cost walk, insurance on CIF in closed form, the ocean loss dividing
  the cost, the pump price waterfall, the government's share, the exchange
  rate that breaks a cap. Graded: CIF, the landed total, three naira-a-litre
  figures and the breakeven exchange rate.

**Taught but never graded:** every refusal and note (the grader takes numbers
only), `direction`, `withinTolerance`, `stable`, `payloadFitsUllage`,
`capCoversChain`, the trend's run and prompt, `cargoQuantities` (a unit
conversion the brief does not list), `throughputEconomics` (margin and carbon),
`stationSizing` (its queue duplicates the rack's, graded at Professional), the
synthetic VCF, the templates and `PRODUCT_REFERENCE`. **Left out:** nothing in
scope; `solveCrossing` is taught through `priceSensitivity`, which is how the
page calls it.

## 1. What the modules compute

| function | inputs | outputs a lesson reads |
|---|---|---|
| volumeAtDip | strapping [{heightMm, volumeM3}], heightMm | volumeM3, or error below a non-empty first entry, above the last, negative, missing |
| volumeCorrectionFactor | densityKgM3, temperatureC, coefficients {k0,k1,k2} (REQUIRED, no default) | vcf, alpha, or error |
| dipToStandardVolume | strapping, heightMm, vcf, waterMm | grossM3 (volume at dip less volume at water cut), waterM3, standardM3 = gross x vcf or null with a note |
| reconcileStock | openingM3 (REQUIRED since MD3-0), receipts, deliveries, knownLoss, closingDippedM3, tolerance percent | expectedClosingM3, unaccountedM3, percent of throughput, toleranceM3 (on receipts + deliveries), withinTolerance, direction |
| trendUnaccounted | days [{date, unaccountedM3, throughputM3}] | cumulative, meanPercent, runLength/runDirection ending on the latest day, prompt at 4 or more |
| rackQueue | arrivalsPerHour, loadMinutes, bays (whole number >= 1 since MD3-0) | offered, utilisation, probabilityOfWaiting (Erlang C via the Erlang B recursion), averageWaitMinutes, queueLength, or unstable at utilisation >= 1 |
| tankFarmCover | tanks [{capacityM3, heelM3, stockM3}], dailyThroughputM3 | capacity, heel, working capacity, pumpable stock and ullage TANK BY TANK (MD3-0), daysOfCover, turnsPerYear |
| throughputEconomics | throughput, fee, variable, fixed, loss, density, factor | revenue, margin, marginPerM3, lossTonnes (null without density, MD3-0), emissions (null without factor or density) |
| cargoQuantities | quantity, unit, density (required) | m3, litres, tonnes, bbl |
| landedCost | cargo, fobPrice+basis, charges [{basis, stage, amount}], oceanLossPercent, fxRate | lines, fob, cf, cif (insurance on CIF in closed form, MD3-0), totalUsd, perLitreUsd and perLitreLocal over the OUTTURN litres, complete / missingRates, or error on a forward reference or unknown stage (MD3-0) |
| buildPumpPrice | landedPerLitre, elements [{basis per_litre / percent_of_landed / percent_of_running}], cap | lines with running totals, pricePerLitre (4 dp), shortfallPerLitre, capCoversChain |
| marginWaterfall | a buildPumpPrice result | groups by recipient, largest first |
| truckingEconomics | lane | cycleHours, tripsPerTruckPerDay (6 dp), components, costPerTrip, costPerLitreDelivered over payload less transit loss; a BLANK cost is named missing (MD3-0) |
| fleetSizing | demand, payload, trips a truck a day | trucksRequired = ceiling, spare |
| stationSizing | forecourt and tank | the forecourt queue by calling rackQueue, tankage, ullage at reorder and the warning |
| solveCrossing / priceSensitivity | a price function, a bracket / values, a cap | the crossing by bisection, or "No crossing in the range searched" |

Neither module reads a clock or a random number (gate_clock.sh reads both
sources: 428 and 747 lines, zero hits), so the digest needs no as-of date.

## 2. The live surface

| app | engine calls (Suite `src/contexts/*Context.jsx`) |
|---|---|
| Terminal & Depot Operations | volumeCorrectionFactor (when the user types K0), dipToStandardVolume per tank, reconcileStock (closing dip = sum of standard, else gross, volumes), trendUnaccounted, rackQueue, tankFarmCover, throughputEconomics |
| Fuel Pricing & Supply Chain | landedCost (IMPORT_TEMPLATE, rates blank), buildPumpPrice (on landed.perLitreLocal, 4 dp), marginWaterfall, truckingEconomics, fleetSizing (on the lane's tripsPerTruckPerDay), stationSizing, priceSensitivity over the exchange rate (the whole chain re-priced at each rate) |

**THE LIVE PAGES ARE NOT YET WHAT THIS COURSE TEACHES.** Suite origin/main
(3e5506561) vendors packages/engines at ac45012, BEFORE MD3-0, and its Terminal
& Depot page still derives the opening stock from today's dip
(`openingM3: totalStockM3 - receipts + deliveries + known`, origin/main
TerminalDepotContext.jsx line 142). The repair is on the unmerged Suite branch
`fix/md3-0-supply-apps` in /root/wt-md3-suite: 41a974862 re-vendors engines
60ee266, 9ea9c63ad adds the Opening stock input (sample 4,068 m3), passes bays
and density as typed. **Go-live of this course depends on that branch merging
and the Suite being uploaded**; until then a learner who opens the live page
sees a reconciliation that always balances, bays rounded, insurance on CIF
charged on FOB, and dips below a partial table read as its first entry.

## 3. Findings

### 3a. T1, the reconciliation that cannot fail: TAUGHT, as the brief asks

An opening stock taken from today's closing dip less today's net movement makes
the expected closing equal the dip for every input. The digest demonstrates it
from the engine (SECTION 7: four closing dips, every row unaccounted 0.000,
direction balanced) and teaches it in the present tense as the reason the
opening stock is an input (Associate m05 l03, "A reconciliation that cannot
fail"). No lesson describes any app as having done it.

### 3b. F-R1, rackQueue accepted a load time of zero minutes. REPAIRED UPSTREAM IN MD3-1 (engines #224); the refusal is now taught (SECTION 10).

    node -e "import('/root/wt-md-supply-nextgen/packages/engines/engines/downstream/terminalDepot.js').then(T=>console.log(T.rackQueue({arrivalsPerHour:9,loadMinutes:0,bays:4})))"
    -> { offered: 0, utilisation: 0, stable: true, probabilityOfWaiting: 0, averageWaitMinutes: 0, ... error: null }

60 / 0 is Infinity, which passes `serviceRate > 0`, so a rack whose trucks load
in no time reports a perfect rack. A negative load time and a missing one are
refused ("Arrival rate and load time are both needed."). Same shape in
stationSizing only if the dispense rate is infinite, which num() refuses. Not on
any graded path (every graded rack has a positive load time). The digest's
refusal table uses a MISSING load time instead. Lead: repair (refuse a load
time that is not positive and finite) or hold.

### 3c. F-R2, several money and movement inputs read a blank as zero. REPAIRED UPSTREAM IN MD3-1 for throughputEconomics and the turns figure; now taught (SECTIONS 12, 13). reconcileStock's movement defaults are unchanged.

"Missing stays missing" holds for every MEASURED input (dip, table, water cut,
density, coefficients, opening stock, FOB, every rate, bays, a trucking cost
box). It does not hold for:

- `throughputEconomics`: throughput, fee, variable cost, fixed cost and loss go
  through `num(v, 0)`, so a blank fee is a revenue of 0 and the margin is
  simply the costs, with no note. Reproduce:
  `throughputEconomics({throughputM3: 2640, feePerM3: '', fixedCostPerPeriod: 9400})` -> revenue 0, margin -9400.
- `tankFarmCover`: with no daily throughput, `daysOfCover` is null but
  `turnsPerYear` is **0** (`num(dailyThroughputM3, 0)`), two answers to one
  missing input. Reproduce: `tankFarmCover({tanks:[{capacityM3:100,heelM3:10,stockM3:50}]})` -> daysOfCover null, turnsPerYear 0.
- `reconcileStock`: a blank receipts, deliveries or known-loss box is 0. That
  one is arguably right (no receipts is a real zero), but it is the same
  `num(v, 0)` and the page passes blanks through `num()`.

The digest's SECTION 2 claim was scoped to measured inputs so it is true of the
engine, and the "turns a year 0" line was removed. None is on a graded path
(every graded record supplies every input). Lead: F3-style repair (blank named
as missing) for throughputEconomics and the turns figure, or hold.

### 3d. F-R3, the engine repository's own unit test typed a coefficient row. REPAIRED UPSTREAM IN MD3-1 (synthetic K0 600).

`__tests__/downstream.terminalDepot.test.js` passes `{ k0: 594.5418, k1: 0, k2: 0 }`
in five cases. FINDINGS-supply H2 says no published coefficient row is in the
repository; if 594.5418 is a published API MPMS 11.1 K0 (it has the look of
one, and this recon did not check it against a table because the rule is not
to quote from memory), the test file ships one. The course never reads it: the
digest uses its own synthetic row (K0 520, K1 0.3, K2 0) labelled SYNTHETIC.

### 3e. Three Suite page findings the course does not teach as app behaviour

Present on origin/main AND on the repair branch 9ea9c63ad:

- **Days of cover on receipts plus deliveries.** `tankFarmCover` gets
  `dailyThroughputM3: receipts + deliveries`, so a day's receipts shorten the
  cover the tanks give. The course grades cover on liftings (the engine's
  definition, pumpable / daily throughput), and discriminate.mjs models the
  page's choice as the wrong route `cover_on_receipts_plus_liftings`.
- **A gain counted as a loss.** `throughputEconomics` gets
  `lossM3: known + |unaccounted|`, so a gain adds emissions.
- **One density for the terminal.** The loss is weighed at `tanks[0]`'s
  density whatever product was lost, and the farm mixes standard and gross
  stocks (`standardM3 ?? grossM3`) when one tank has a VCF and another does not.

### 3f. The breakeven lands anywhere on a flat step, harmlessly

The page's sensitivity (and the capstone's) re-prices the chain with the landed
cost and the price each rounded to four decimals, so price minus cap is a step
function in the exchange rate and bisection returns the first midpoint that
lands on a zero step (ORON: 1682.8320980072021 after 21 steps, where the
oracle's closed form on unrounded figures gives 1682.83222...). The difference
is 0.0126 of the 0.01 tolerance; nothing to repair at two decimals.

## 4. FINDINGS-supply held items and repairs in scope

HELD, taught as limits and never graded (digest SECTION 23, SECTION 19 for H1):
**H1** discharge charges (jetty, storage) are billed on the bill-of-lading
quantity; **H2** no VCF table and no rate shipped.

REPAIRED at 60ee266 and taught as current rules (SECTION 23): opening stock
required (T2); a dip below a non-empty first entry and a negative dip refused
(T3); an unconvertible water cut and water above the dip refused (T4); whole
bays (T5); heel tank by tank (T6); a loss with no density has no weight (T7);
insurance on CIF in closed form and a freight-stage charge on C&F or CIF refused
(F1); an unknown stage refused (F2); a blank trucking cost named (F3).

## 5. The gradeable set, and why these eighteen

**The academy grader is numeric only**, so every graded field is a number the
engine returns, stored at full precision, with a tolerance of one unit in the
last place the prompt asks for (0.5 for the truck count). Every graded output is
recomputed by the vendored ORACLES on the capstone records (`oracle_check.py`,
18 of 18, largest disagreement 0.35 of a tolerance):

| graded output | oracle |
|---|---|
| grossM3, standardM3 (two tanks) | oracle_terminaldepot.interp (search, never the engine's loop) x the typed VCF |
| expectedClosingM3, unaccountedM3, toleranceM3 | the oracle's day ledger, TRANSCRIBED from its main() |
| probabilityOfWaiting, averageWaitMinutes | oracle_terminaldepot.erlang_exact (factorial form in rationals) |
| pumpableStockM3, daysOfCover | the oracle's farm block, TRANSCRIBED from its main() |
| costPerLitreDelivered | oracle_fuelpricing.lane_ledger |
| trucksRequired | oracle_fuelpricing.fleet_search (integer search) |
| cif, totalUsd, perLitreLocal | oracle_fuelpricing.invoice (insurance on CIF by fixed-point iteration) |
| pricePerLitre, Government share | oracle_fuelpricing.pump |
| the breakeven exchange rate | closed form by linearity on the oracle's invoice() and pump() |

**Coverage caveat, CLOSED in MD3-1:** the day ledger and the farm block lived inside
the oracles' `main()`; the oracle now exports `day_ledger()` and `farm_cover()`
and `oracle_check.py` calls them. What follows is the foundation's note. They are
one-line identities, and the goldens cover the same exports, but a callable
oracle function would be stronger. Recommend a small engines PR exporting
`day_ledger()` and `farm_cover()` from oracle_terminaldepot.py.

Not graded although oracle-covered: queueLength (Little's law in the oracle),
the station queue (duplicates the rack), outturn litres (a single product).
Not graded because no oracle covers it: the computed VCF (the oracle pins the
FORM only), cargoQuantities, throughputEconomics, trendUnaccounted, every
waterfall share.

## 6. The split with crude and refinery

This course owns measurement and logistics. It teaches no LP, no assay, no
blend, no refinery plan or variance, and grades no NPV, IRR, Monte Carlo or
decision tree; throughputEconomics is taught as a period's margin and a carbon
ledger.

## 7. Vendoring

Not re-vendored. The worktree sits on the lead's shared vendor commit b1f29251
(engines 60ee266, `downstream` removed from excludedDomains). The downstream
supply suites run green on it: `downstream.supply.golden`,
`downstream.terminalDepot` and `downstream.fuelPricing`, 3 suites, 135 tests;
both oracles regenerate their goldens byte-identical.

## 8. The extension round (2026-09-19)

Re-vendored to engines e4d3b10 (f45ce066). Rebuilt on it, the foundation digest
and all eighteen graded values reproduced byte-identical before any edit. The
writers' gaps and line fixes in DIGEST-GAPS.md were then closed additively (the
digest grew from 634 to 712 lines, 24 sections either side). Two existing
lines changed and REVISE.md lists them: the ENGINES header (60ee266 to
e4d3b10) and the forecourt and rack comparison (now made on the station's
unrounded inputs, so it reads true where it read false; the rounding effect is
printed beside it). One gap is filled with a
figure the engine does not export and the digest says so: Erlang B, derived
from the engine's Erlang C by the identity B = C(1 - rho)/(1 - rho C), and the
wait of a truck that queues, the mean wait over the probability of waiting.
One gap is NOT filled and is reported: a missing ocean loss is read as zero
loss by landedCost (`oceanLossPercent = 0`, `num(v, 0)`), a missing value read
as a zero on a path that understates the cost of a litre sold. It is not
printed and not graded; it is a candidate MD3-2 finding (F-R4).
Module ruling: the academy module is `supply_chain`, "Supply Chain & Logistics".
