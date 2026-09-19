# `refinery` RECON: Refinery Feasibility & Planning

Academy module `downstream` ("Midstream & Downstream"), path_order 49, slug
`refinery`: the second of three Commercial & Trading courses. Subject: three
`engines/downstream` modules and the screening engine where they meet it, as
vendored in the shared commit b1f29251 (engines **60ee266**, the MD2-0 repairs
of engines PR #219 in): `refineryPlanning.js` (planRefinery, cascadeToSchedule,
reconcilePeriod), `streamModel.js` (the event shape, attributeVariance,
materialBalance, dualLedgerTotals), `modularRefinery.js` (scaleCapex,
scaleComparison, productSlate, feasibilityStreams, feasibilityEconomics,
SUPPLY_SCENARIOS, licensingProgress), over `lib/lp/simplex.js`, and
`engines/economics/screening.js` **as NextGen vendors it** (an older copy,
VENDOR.json deviation group 4, with only the lossCarryForward option patched
on). Goldens `test-data/downstream/goldens/refineryplanning_cases.json` and
`modularrefinery_cases.json`; oracles `oracle_refineryplanning.py` (on
`exact_simplex.py`) and `oracle_modularrefinery.py`; FINDINGS-refinery.md. The
live apps: the Refinery Planning Studio and the Modular Refinery Feasibility
Studio, read on the Suite branch `fix/md2-0-refinery-apps` (worktree
`/root/wt-md2-suite`, head 3011c4e54, not merged at the time of reading).

> RECON.md IS PROVENANCE. No writer may quote a figure from this file. The
> teaching truth is `digest.txt`. Every figure below that is not a count of
> files or cases was produced by running the engine or the oracle, and is
> reproduced by the command shown beside it.

## THE ONE SENTENCE

**A refinery is judged on its margin per barrel of crude: the screen prices
that barrel before any capital is spent, the plan finds it with every barrel
run through the crude unit, the schedule dates it, and the actuals are read
against it line by line on what each gap did to margin.**

## WHAT THE COURSE CHOSE TO TEACH, AND WHAT IT LEAVES OUT

- **Associate, THE MODULAR SCREEN** (modularRefinery). A blank box is refused;
  capital scaled from a vendor quotation on the 0.6 and 0.9 laws and the
  crossover at the reference size; the three configurations and the product
  slate per barrel of crude; annual throughput, the gross margin per barrel and
  the annual streams; supply scenarios; the licensing tracker. Graded: two
  capital costs, the slate value, the annual throughput, the gross margin per
  barrel, the first operating year's revenue.
- **Professional, THE PLAN AND THE SCHEDULE** (refineryPlanning planRefinery
  and cascadeToSchedule). Blank limits against typed zeros; the crude unit
  carries every barrel; margin, gross margin per barrel, stream balances and
  what binds; stream marginal values and a debottleneck; the schedule from a
  fixed period start in seven time zones. Graded: crude run, crude unit
  utilisation, plan margin, gross margin per barrel, two stream values.
- **Expert, ACTUALS, VARIANCE AND THE INVESTMENT CASE** (streamModel's event
  shape and attributeVariance, reconcilePeriod, feasibilityEconomics). One
  shape for three ledgers; volume, price and unexplained variance; unmatched
  movements; totals on margin; units against plan; the streams valued through
  the screening engine with revenue as revenue, no royalty, and the
  construction-year tax loss carried forward. Graded: a price variance, a
  volume variance, the margin total, the cost total, the first year's tax and
  the lifetime tax.

**Taught, never graded:** the NPV (the Economics courses grade it; SECTIONS 22
and 23 print it); every status word, flag, refusal and date; the schedule
counts (the oracle takes the cargo count as an input, so it does not compute
it; see 6); planMargin, actualMargin, marginVariance and unitPerformance (no
oracle computes them). **Left out:** the IRR (the Economics courses own it and
the vendored IRR search is the older copy); materialBalance and
dualLedgerTotals (STOPPED, 3b and 3c); LP fundamentals (the `crude` course owns
them).

## 1. What the modules compute

| module | exported functions | lists and constants | clock readers (argument that stops the read) |
|---|---|---|---|
| refineryPlanning | 3 | 0 | cascadeToSchedule (periodStart) |
| streamModel | 7 | 4 | none |
| modularRefinery | 6 | 4 | feasibilityEconomics (startYear) |
| screening (vendored) | 6 | 1 | calculateEconomics (startYear), expandQuickInputs (never called) |
| lib/lp/simplex | 1 | 1 | none |

Measured by `refinery_dump.mjs` SECTION 1 from the modules and by
`clockguard.mjs`'s source scan.

- `planRefinery({crudes, units, products, streams})` -> `{status, crudeRuns[],
  unitRuns[{throughput, capacity, utilisation, crudeUnit, cost}],
  productMakes[], streamBalance[{made, consumed, placed, surplus,
  marginalValue}], revenue, crudeCost, unitCost, margin, totalCrude,
  grossMarginPerBbl}`, or `{status: invalid | infeasible | unbounded, error}`.
  marginalValue is the negated dual of the stream's balance row.
- `cascadeToSchedule({plan, periodStart, periodDays, cargoSize})` ->
  `{events[], note}`: whole cargoes spaced `floor(periodDays / cargoes)` days
  apart, weekly unit runs and lifts, dated in UTC from the period start.
- `reconcilePeriod({planEvents, actualEvents, plan})` -> attributeVariance's
  `{lines[], unmatched[], total{..., cost, revenue, basis}}` plus
  `unitPerformance[]`, `planMargin`, `actualMargin`, `marginVariance`,
  `planGrossMarginPerBbl`.
- `feasibilityStreams(...)` -> `{years[], annualBbl, capex, capexPerBpd,
  grossMarginPerBbl}` or `{error}`; `feasibilityEconomics({streams,
  discountRate, taxRate, startYear})` -> the screening engine's result plus the
  `inputs` it was given (royaltyRate 0, lossCarryForward true, fiscalType
  TaxRoyalty).

## 2. The live surface (Suite branch fix/md2-0-refinery-apps)

| app | context | engine calls | what the page prints |
|---|---|---|---|
| Refinery Planning Studio | `RefineryPlanningContext.jsx` | planRefinery (blank boxes sent as absent), cascadeToSchedule (periodStart from the page's date box), reconcilePeriod (plan events from the schedule, actuals typed by the user) | PlanResults: gross margin $/bbl (2 dp), period margin, crude run, revenue, crude and unit runs with utilisation (0 dp percent), stream marginal values (2 dp) and surplus. SchedulePanel: the note and every event. ActualsPanel: plan/actual margin, margin variance, lines coloured by marginEffect with direction, unmatched, units against plan |
| Modular Refinery Feasibility Studio | `ModularRefineryContext.jsx` | scaleCapex, scaleComparison (capacities at 0.2 to 10 times the plant), productSlate, feasibilityStreams, feasibilityEconomics (no startYear passed), licensingProgress | ScaleResults: capital (MM, 1 dp) and per bpd, gross margin $/bbl, NPV and IRR, the scale chart, the slate, and a scenario table whose annual margin and simple payback are computed IN THE PAGE (3f) |

## 3. Findings

### 3a. The clock. NO CLOCK READ WITHOUT AN OVERRIDE.

Four exports read the machine clock when an argument is left out
(`clockguard.mjs` finds them in the source): cascadeToSchedule (`periodStart
|| Date.now()`), feasibilityEconomics and calculateEconomics (`startYear = new
Date().getFullYear()`), and expandQuickInputs (never called here). Every call
the generators make passes `periodStart: '2027-03-01'` or `startYear: 2027`
(one declared check year, 2031, shows the year labels no figure); a bare call
throws (`--plant-clock`). `gate_clock.sh` rebuilds the digest and the capstone
with the machine clock moved 400 days back and 900 forward: byte-identical, and
the detector is shown to move the engine's own default first. The start year
moves no figure (SECTION 22 prints NPV and tax at 2027 and 2031, identical).

The schedule is dated from a YYYY-MM-DD STRING, which the engine reads as a UTC
day: identical in seven zones including Pacific/Pago_Pago and America/New_York
(SECTION 16, and gate_repro.sh on the whole digest). A Date built at LOCAL
midnight is read by its UTC day and moves the schedule back a day east of
Greenwich (Africa/Lagos, Pacific/Kiritimati): a contract, taught in SECTION 16
and used as the repro gate's negative control. The Suite passes a string.

### 3b. STOPPED: materialBalance cannot close a refinery's tanks

`signedQuantity` counts receipts in and deliveries, burns, flares, vents and
losses out; a unit run moves nothing. A refinery's crude is consumed by the
crude unit and its products are made by units, so on a refinery ledger a crude
tank shows every receipt and no consumption, and a product tank shows lifts and
no production. Reproduction (`node recon_findings.mjs`, ODIOMA actual ledger):
Escravos opening 120000 + 735000 received, computed closing 855000 against a
dip of 130500, unaccounted -724500; diesel computed closing -199000 against a
dip of 47300, unaccounted 246300. No Suite refinery app calls materialBalance
and no oracle covers it. **Not in the digest.** The lead decides: repair
(count unit feed and yield as flows, or refuse a ledger with unit runs) or
teach as a terminal-only function in the `supply` course.

### 3c. STOPPED: dualLedgerTotals adds sales into "cost"

`dualLedgerTotals` sums `e.cost` over every event, and a delivery's cost field
carries what it sold for, so a refinery ledger's "cost" total adds revenue to
spend: the R4 defect class, in a sibling function. Reproduction: ODIOMA actual
ledger cost = 121082150 = spend 60658650 + sales 60423500. No Suite refinery
app calls it and no oracle covers it. **Not in the digest.**

### 3d. STOPPED: feasibilityEconomics reads a blank tax or discount rate as 0

`Number('')` and `Number(null)` are 0, so the rate check passes and a blank tax
rate values the plant tax-free. Reproduction (`recon_findings.mjs`, a
hydroskimmer on 60 dollar crude): tax 30 gives NPV 61.7954 MM and total tax
124.8162 MM; tax '' or null gives NPV 94.0244 MM and total tax 0 with
`inputs.taxRate` 0. Left out (undefined) is refused. The Suite page is not
exposed (it passes `num(v, 30)`, so a blank box reads as the default), but the
engine contract fails open in the M3 class FINDINGS-refinery repaired
elsewhere. The digest prints only the left-out refusal (SECTION 2).

### 3h. STOPPED: feasibilityStreams' comment contradicts what it does with a blank schedule term

The engine comment reads "The money and the size are required; the schedule
terms keep their stated defaults only when they are absent, never when they are
blank." The code reads a blank the other way. Reproduction (`node
recon_findings.mjs`, OKORDIA's plant, one term blanked at a time): on-stream
days '' gives annualBbl 1530000, the same as left out (340 days); utilisation ''
gives the 0.9 default; project life '' gives 20 years; construction years ''
gives ZERO construction years (years 20, year 0 capex 64000000) while left out
gives the default 2 (years 22, year 0 capex 32000000). So a blank reads as the
default for three terms and as zero for the fourth, which is the "blank is zero"
class M3 repaired for money. The Suite page substitutes its own defaults
(`num(v, 340)`, `num(v, 2)`, ...), so the page is not exposed. The digest's first
cut repeated the comment's claim; it now states only the refusals it prints
(SECTION 2). Nothing on this path is graded.

### 3e. Two contracts that are not defects, stated so nobody grades against them

- marginVariance (from the ledger margins) counts unmatched movements and the
  variance total does not. ODIOMA: the difference is exactly the unmatched LPG
  sale (SECTION 21). Taught.
- A line with money and no barrels is carried by `unexplained` (the Forcados
  demurrage, SECTION 20). The oracle's `variance_case` divides by the actual
  quantity, so it cannot take a zero-quantity line: no capstone line has one.

### 3f. The page computes two figures the engine does not

ModularRefineryContext's scenario table computes `annualMargin = annualBbl x
grossMarginPerBbl - fixedOpexPerYear` and `simplePaybackYears = capex /
annualMargin` in the page. No engine returns them and no oracle checks them.
The digest prints neither; nothing grades them. Worth moving into the engine.

### 3g. The Suite page's default period start

`defaultInputs().periodStart` is `new Date().toISOString().split('T')[0]`, the
UTC date of the moment the page opens; in Lagos between 00:00 and 01:00 that is
yesterday. Cosmetic, app-side, not taught.

## 4. FINDINGS-refinery repairs, decisions and HELD items in scope

Repairs, all taught as current behaviour (no history in the digest): R1 the
crude unit carries every barrel (SECTION 11); R2 a typed zero is zero (SECTIONS
9, 13); R3 blank cost/opex/price refused by name (SECTION 10); R4 variance lines
carry direction and marginEffect, totals on margin (SECTIONS 20, 21); R5 the
schedule in UTC (SECTION 16); R6 `unexplained` (SECTION 20); M1 revenue as
revenue (SECTION 22); M2 construction-year losses carried forward (SECTION 23);
M3 blank money boxes refused (SECTION 2); M4 utilisation refused outside 0..1
(SECTION 2); M5 capital in year 0 with no construction period (SECTION 5).
Decisions: opt-in lossCarryForward, no royalty, a feedless unit is the crude
unit (SECTION 24). HELD: H1 the exponents, H2 depreciation in the year of spend
(SECTION 24): taught as limits, never graded.

## 5. The vendored screening engine against the golden (rule 5 check)

NextGen's `engines/economics/screening.js` differs from canonical 60ee266 only
in the IRR search (canonical uses `irrContract.solveIrrInBand`) and the
portfolio chance-of-success guard; the TaxRoyalty arithmetic, the loss pool and
the mid-year NPV are the same. Measured, not read: the vendored
`__tests__/downstream.refinery.golden.test.js` (every `modularrefinery_cases`
case's per-year tax and NPV through feasibilityEconomics) passes on the
vendored copy, 4 suites and 145 tests green with the three unit suites. **No
refinery output differs from the golden.** The IRR is not taught or graded.

## 6. The gradeable set

**The academy grader is numeric only** (abs(got - expected) <= tol). Every
graded field below is an engine return, and the oracle column is the vendored
oracle function `oracle_check.py` calls on the capstone record itself (18 of
18 reproduce).

| graded output | class, tolerance | oracle |
|---|---|---|
| scaleCapex cost at 0.9 and at 0.6 | USD, 0.5 | oracle_modularrefinery.accounts (capex, with modularExponent 0.9 and 0.6) |
| productSlate.grossValuePerBbl | $/bbl, 0.005 | accounts -> slate_value |
| feasibilityStreams.annualBbl, years[build].revenue | bbl / USD, 0.5 | accounts rows |
| feasibilityStreams.grossMarginPerBbl | $/bbl, 0.005 | accounts row (revenue - crude - variable) / bbl |
| planRefinery totalCrude, margin, grossMarginPerBbl, crude unit utilisation | bbl / USD 0.5, $/bbl 0.005, percent 0.005 | oracle_refineryplanning.plan (exact_simplex with certificate) |
| streamBalance.marginalValue | $/bbl, 0.005 | plan (exact one-sided re-solve, never a dual) |
| variance line priceVariance, volumeVariance; total on margin; cost total | USD, 0.5 | variance_case, its ledgers redirected to the oracle's exact plan and the actuals (AST edit of two literals) |
| per-year tax, lifetime tax (loss carried forward) | MM, 0.00005 | tax_with_ledger (dated ledger, oldest first) |

Not graded although numeric: NPV, IRR (Economics); the schedule counts (the
oracle's schedule_dates takes the cargo count as input); planMargin,
actualMargin, marginVariance, unitPerformance, unexplained (no oracle computes
them from these records); materialBalance, dualLedgerTotals (STOPPED).

## 7. The split with `crude` and `supply`

`crude` owns the LP: this course reads stream values ("the negated dual of the
stream's balance row") and never teaches what a dual, a binding constraint or
infeasibility is. Nothing from crudeAssay or productBlending is graded here.
`supply` owns strapping, VCF, reconciliation, Erlang C, landed cost and pump
price; 3b's materialBalance question is shared ground the lead should route.
No NPV, IRR, Monte Carlo or decision tree is graded here.

## 8. Vendoring

Not re-vendored: the shared vendor commit b1f29251 (engines 60ee266) is the
branch base. The digest's engines are those files. One observation for the
lead: the vendored screening IRR is the pre-irrContract copy (VENDOR.json group
4), which this course sidesteps by printing no IRR.
