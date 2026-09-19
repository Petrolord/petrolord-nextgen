# `carbon` RECON: Carbon & Energy Efficiency

Academy module `energy_transition` (label "Energy Transition", already in
src/lib/academyModules.js), path_order 52, slug `carbon`, course code prefix
`cef` (unused in migrations/, tools/course-banks/ and every waves.json entry).
Built beside the sibling course `gasvalue` (Flare Gas to Value & LPG/CNG,
path_order 51). Subject: `engines/downstream/carbonAbatement.js` and
`engines/downstream/energyEfficiency.js` as vendored sha-identical from
petrolord-engines **f0aef14** by the shared vendor commit fe001b52 (the carbon
files are unchanged since 5c0cb97, MD5-0, engines PR #226); their goldens
`test-data/downstream/goldens/carbonabatement_cases.json` and
`energyefficiency_cases.json`; their oracles `oracle_carbonabatement.py` and
`oracle_energyefficiency.py` and `FINDINGS-carbon.md` under
`tools/validation/downstream/`; and the two live Suite apps that call them,
the Carbon Footprint & Abatement Studio and the Energy & Utilities Efficiency
Studio.

> RECON.md IS PROVENANCE. No writer may quote a figure from this file. The
> teaching truth is `digest.txt`, and every figure below that is not a count of
> files or cases was produced by running the engine or the oracle, and is
> reproduced by the command shown beside it.

## THE ONE SENTENCE

**A tonne of CO2e is carbon counted atom by atom, weighted by a declared GWP
set and carried on a record that says where every factor came from, and a
tonne saved is priced over the life of the measure that saves it; the engines
refuse or name every box nobody filled (a destruction efficiency, a factor, a
safe oxygen floor, a discount rate) instead of reading it as the best case.**

## WHAT THE COURSE CHOSE TO TEACH, AND WHAT IT LEAVES OUT

The two modules export 19 functions and 12 constants (digest SECTION 1 counts
them from the modules). The three tiers follow the order a decarbonisation
programme is built in: count it, find the energy, rank what to do.

- **Associate, THE INVENTORY** (carbonAbatement: makeFactor, makeGwpSet,
  combustionCo2FromCarbon, emissionLine, buildInventory, carbonIntensity).
  Graded: six tonnes (heater CO2, flare CO2, flare methane, the flare methane
  line in CO2e, Scope 1, the total) on the AR6 fossil set stated in the prompt.
- **Professional, THE HEATER, THE STEAM AND THE PINCH** (energyEfficiency:
  combustionStoichiometry, excessAirFromFlueOxygen, stackLossEfficiency,
  excessAirSaving, steamTrapLoss, condensateReturnValue, pinchTargets).
  Graded: excess air and LHV efficiency in percent, the fuel a tuning saves in
  GJ, a trap's steam loss in tonnes a year, hot and cold utility in kW.
- **Expert, THE CURVE AND THE PATH** (carbonAbatement: abatementCost,
  abatementCurve, decarbonisationPath; energyEfficiency: priceSaving,
  energyIntensity). Graded: two costs per tonne, one net annual cost, the
  curve's weighted average, the path's final unabated gap, and a priced
  saving's cost per tonne.

**Taught but never graded:** every refusal, note and verdict (the grader takes
numbers only: reportable, meetsTarget, targetBasis, paysForItself,
thresholdProblem, complete); carbonIntensity, the curve's residual and
pays-for-itself tonnes, compositeCurve, the simple payback, condensate return
and energy intensity (no oracle function recomputes them, see section 5); the
four held items; the GWP choice itself. **Left out:** compositeCurve is named
in SECTION 1 and left to the panel (the digest prints the problem table and
the grand composite instead).

## 1. What the modules compute

| function | inputs | outputs a lesson reads |
|---|---|---|
| makeFactor | id, label, value, unit, gas, source, version, vintage | a record: hasValue, provenanceComplete, missingProvenance |
| makeGwpSet | label, values {CH4, N2O} (NO VALUES SHIPPED) | declared (label and one value), gases, note, methaneNote |
| combustionCo2FromCarbon | fuel kmol a year, carbon per kmol, destruction efficiency (REQUIRED when blank; omitted = 1) | carbonKmolPerYear, co2Tonnes (x MW_CO2), ch4Tonnes (escaped carbon x MW_CH4), method, unburnedNote |
| emissionLine | label, scope, activity, factor record, gwpSet | tonnesGas, gwp, tCo2e, provenance, blockedBy (no activity / no factor value / no GWP for the gas) |
| buildInventory | lines, gwpSet | scope1/2/total tonnes, blockedLines (errored and off-scope lines blocked since MD5-0), unsourcedLines, computed, reportable, notReportableBecause, disclaimer |
| carbonIntensity | inventory, denominator, unit, boundary (REQUIRED) | scope and total intensity, reportable inherited, comparabilityNote |
| abatementCost | capital (blank refused), savings and cost (blank = 0 NAMED), tonnes (negative refused), life, rate (a fraction in (-1, 1), blank refused with capital) | CRF, annualisedCapital, netAnnualCost, costPerTonne, paysForItself, assumedZero |
| abatementCurve | costed measures, sourceEmissions, target | steps ranked cheapest first, totals, weighted average, interactions, overClaims, meetsTarget (null on an over-claim), targetBasis, residual |
| decarbonisationPath | baseline (positive), measures, years, targetByYear | rows, firstShortfallYear, finalGapTonnes, unscheduledMeasures, gapNote |
| combustionStoichiometry | components with atom counts, molar mass, LHV and HHV | O2 and air demand, products (air and fuel N2 split), mixture heating values |
| excessAirFromFlueOxygen | stoichiometry, dry O2 percent | excess air (closed form), actual air, dry and wet flue gas |
| stackLossEfficiency | stoichiometry, excess air, temperatures, basis, cps, latent heat, radiation (REQUIRED) | losses by kind, efficiency, masses, notes |
| excessAirSaving | two efficiencies on one basis, safe floor and target O2 (both REQUIRED) | saving fraction as the ratio, annual GJ |
| steamTrapLoss | orifice, bar a, Cd, density, exponent (REQUIRED), hours (blank refused), boiler efficiency (none = no fuel) | kg/h, t/yr, cost, fuel GJ, tCO2e, notes |
| condensateReturnValue | flows, fractions, temperatures, boiler efficiency (REQUIRED), prices | extra condensate, energy saved, components, floor note |
| energyIntensity | streams, throughput, peer | intensity, shares, versusPeer only when complete |
| pinchTargets | streams, minimum approach | hot and cold utility, interior pinch only, problem table, grand composite |
| priceSaving | GJ saved, fuel price, factor, implementation cost, life, rate, three bases | annual value, tCO2e, simple payback, costPerTonneCo2e via abatementCost |

Neither module reads a clock or a random number (gate_clock.sh reads both
sources: 539 and 835 lines, zero hits), so the digest needs no as-of date; the
path's years are inputs.

## 2. The live surface

| app | engine calls (Suite `src/contexts/*Context.jsx`) |
|---|---|
| Carbon Footprint & Abatement Studio | makeGwpSet from a label and two boxes (CH4, N2O); combustionCo2FromCarbon for the heaters and the flare; atom-balance lines through a factor of 1 sourced "Atom balance (conservation of mass)"; emissionLine per factor line; buildInventory; carbonIntensity; abatementCost per measure at one discount rate; abatementCurve with sourceEmissions {heaters, flare} in CO2e and a target of a percent of the inventory total; decarbonisationPath with a straight-line targetByYear |
| Energy & Utilities Efficiency Studio | combustionStoichiometry from FUEL_REFERENCE rows; excessAirFromFlueOxygen and stackLossEfficiency at the current and target O2; excessAirSaving; steamTrapLoss for one trap, multiplied by a trap count on the page; condensateReturnValue; energyIntensity; pinchTargets and compositeCurve; a register of priceSaving rows (tuning, traps, condensate) with NO implementation cost, so the page never shows a cost per tonne |

**THE PAGE LAYER THIS COURSE TEACHES AGAINST IS NOW ON SUITE origin/main.**
The MD5-0 Suite PR (#543, branch `fix/md5-0-carbon-apps`, commits 748654bf3
vendor engines 5c0cb97, 0f457287a Carbon Studio, 1f55d8636 Energy Studio)
merged as 60871c1e8 during this recon; the merged contexts and components are
byte-identical with the branch tip read from /root/wt-md5-suite. Page
behaviours that DEPEND on that PR (and so on the Suite being UPLOADED to
production before this course goes live):

- the heater destruction efficiency is passed as typed (blank refused, C1);
- the curve receives each source in CO2e including its methane, and a source
  that did not compute is LEFT OUT (C11; see finding F1);
- capital, savings, running cost and the rate reach abatementCost as typed, so
  blank capital and a blank rate are refused and blank savings are named (C13);
- a blank target percent is no target, the baseline is null when nothing
  computed, and a warning says the target and path rest on a partial inventory
  while the inventory is not reportable (C12);
- the target verdict reads "met, as an upper bound" or "not assessed" with the
  targetBasis, and unscheduled measures are listed under the path;
- the trap asks for the isentropic exponent (default 1.135), blank hours and a
  blank boiler efficiency are missing, a blank trap count is refused (E11);
- the register declares the price and factor basis (E9); the peer note shows.

Until the upload, the LIVE production pages still run the pre-MD5-0 engines
(a blank flare efficiency read as 100 percent, a 1.3 trap exponent, and so on).

## 3. Findings (rule 5: each STOPPED, reproduced, reported; none is graded)

### F1. THE CURVE SAYS "MET" ON A SOURCE IT COULD NOT CHECK, AT THE PAGE'S DEFAULTS

C11's Suite repair leaves a source that did not compute out of
sourceEmissions ("an unknown emission is not an emission of zero"), and
abatementCurve only checks claims against the sources it is given. So at the
Carbon Studio's opening defaults (flare efficiency blank, so the flare is
refused and left out), the 9,000 t flare gas recovery claim is not checked
and the curve returns a verdict on it:

    node /root/et-wip-carbon/recon_pagedefaults.mjs
    -> flare refused; inventoryTotal 30559.8496 (not reportable);
       sourceEmissions { heaters: 30559.8496 }; target 9167.95488;
       total 15300; meetsTarget true; targetBasis "upper bound: measures interact";
       overClaims []

The merged page then shows "met, as an upper bound" beside the partial
inventory warning. This is C7's shape reopened by the C11 repair: a target met
on tonnes that may not exist. The digest prints the engine behaviour honestly
(SECTION 21, third row, "the same claim, the flare's emission not passed":
meetsTarget true) and the lessons may teach it as "a source whose emission is
not passed cannot be checked". **Lead: repair in the engine** (a measure whose
actsOn names a source absent from sourceEmissions makes meetsTarget null with
a targetBasis such as "not assessed: a claim acts on a source with no
emission") **or hold it as a stated limit.** Nothing graded depends on it.

### F2. stackLossEfficiency labels a basis it did not use

Any basis other than exactly 'HHV' is computed on LHV and returned under the
caller's label:

    stackLossEfficiency({ ..., basis: 'hhv' }) -> efficiencyPercent 89.821412, basis 'hhv'
    the same heater on 'HHV' -> 80.803591; on 'LHV' -> 89.821412
    (recon_probe.mjs P4, pure methane at 3 percent O2, 200 C stack)

A label that contradicts its own numbers; excessAirSaving then compares the
strings. The pages pass HEATING_VALUE_BASIS constants from a select, so it is
not live. Repair: refuse a basis that is not LHV or HHV.

### F3. abatementCurve drops a refused measure without naming it

    abatementCost with capital '' is refused; abatementCurve({ measures: [ok, refused], targetTonnes: 400 })
    -> totalAbatementTonnes 100, meetsTarget false, residual 300, and no field names the dropped measure
    (recon_probe.mjs P1)

The Carbon Studio lists refused measures above the curve, so the page is
honest; the engine result is not, and the page's path still schedules the
refused measure (the path is built from the raw inputs; the costed ones never reach it).
Repair: name refused measures in the curve result (as unscheduledMeasures does
for the path).

### F4. A negative activity or factor makes a negative line, and the inventory stays reportable

    emissionLine({ activity: -100, factor 2 }) -> tCo2e -200, blockedBy null;
    buildInventory -> totalTonnes -200, reportable true; carbonIntensity -> -20
    (recon_probe.mjs P2, P10)

The same shape as C4 (a negative abatement), on the inventory side. Repair or
hold: refuse a negative activity and factor, or block the line.

### F5. condensateReturnValue accepts a target return below the current one

    currentReturnFraction 0.7, targetReturnFraction 0.4 -> extraCondensateTonnesPerYear -52560,
    annualValue -229334.74, complete true, no note (recon_probe.mjs P6)

### F6. steamTrapLoss reports choked flow at any pressure

`choked: true` is unconditional; there is no downstream pressure input. At 1.2
bar a venting to atmosphere the pressure ratio is above the critical ratio and
the flow is not choked, yet the result says it is (recon_probe.mjs P7,
3.2813616 kg/h). The course's traps sit at 9 and 8.213 bar a. Hold as a stated
limit or add a downstream pressure.

### F7. Smaller shapes, reported for completeness

- decarbonisationPath lets emissions go negative when abatement exceeds the
  baseline, with no over-claim check (P8: baseline 1000, 1500 abated, emissions -500).
- stackLossEfficiency reads a blank unburned loss as 0 without naming it, and a
  negative radiation loss raises the efficiency (P5: 94.321412 at -3).
- makeGwpSet accepts a negative GWP and calls the set declared (P3).

### No clock, no vendoring problem

Both sources are clock- and random-free; the vendored carbon scope (two
engines, two oracles, FINDINGS, two goldens, three jest suites, negcontrol_md5)
is sha-identical with engines f0aef14; the three suites run 191 of 191; both
oracles regenerate their goldens byte-identical.

## 4. FINDINGS-carbon held items and repairs in scope

HELD, taught as limits and never graded (digest SECTION 25; H1 in SECTION 6,
H3 in SECTION 5, H4 in SECTION 3): **H1** AR5 or AR6 as the recommended set;
**H2** the methane heating value pair (88.2 against 87.985 computed from the
engine's own latent heat, SECTION 25); **H3** every escaped carbon atom counted
as methane; **H4** combustion N2O not computed.

REPAIRED at 5c0cb97 and taught as current rules (SECTION 25 table): C1 to C10
and E1 to E10, each with the section that prints it. C11, C12, C13 and E11 are
the Suite page repairs listed in section 2.

**GWP.** The engine ships none. The digest prints four sets (AR6 fossil 29.8,
AR6 non-fossil 27.0, AR5 fossil 30, AR5 non-fossil 28; N2O 273 and 265), all
100-year, as tabulated in GHG Protocol "IPCC Global Warming Potential Values"
v2.0 (7 August 2024, from AR6 WG1 ch.7 7.6.1.1 and AR5 WG1 ch.8), the source
FINDINGS-carbon reached. DECISION: the course computes on AR6 fossil because
the engine's own methaneNote (C10) says the fossil value is the consistent one
for its atom balance; the other three are printed beside it; the choice of
report to file on is H1 and is never graded.

## 5. The gradeable set, and why these eighteen

**The academy grader is numeric only**, so every graded field is a number the
engine returns, stored at full precision, with a tolerance of one unit in the
last place the prompt asks for (the tuning saving is asked to the whole GJ: it
is a ratio of two efficiencies the engine rounds to six decimals). Every
graded output is recomputed by the vendored ORACLES on the capstone records
(`oracle_check.py`, 18 of 18):

| graded output | oracle |
|---|---|
| co2Tonnes, ch4Tonnes (heaters, flare) | oracle_carbonabatement.combustion (by mass, exact rationals) |
| the flare methane line, Scope 1, total | oracle_carbonabatement.inventory (a ledger) |
| excessAirPercent | oracle_energyefficiency.excess_by_bisection |
| efficiencyPercent (LHV) | oracle_energyefficiency.efficiency (species ledger, argon at atmospheric N2) |
| annualEnergySavedGJ | oracle_energyefficiency.duty_ledger on its efficiency() (exported in MD45-1; the foundation transcribed it from main()) |
| tonnesPerYear (trap) | oracle_energyefficiency.trap_nozzle (isentropic nozzle) |
| hotUtilityKW, coldUtilityKW | oracle_energyefficiency.pinch_by_deficit (no cascade) |
| costPerTonne, netAnnualCost | oracle_carbonabatement.levelised (PV ledger) |
| weightedAverageCostPerTonne | oracle_carbonabatement.curve |
| finalGapTonnes | oracle_carbonabatement.path |
| costPerTonneCo2e (priceSaving) | oracle_energyefficiency.levelised |

**Coverage gaps, reported (rule 4):** the tuning saving's duty ledger lives in
oracle_energyefficiency.main() only (transcribed and marked; recommend
exporting `duty_ledger()`); likewise the trap's fuel and carbon, condensate
return and energy intensity are computed only inside main(), and are not
graded. No oracle recomputes carbonIntensity, residualToTargetTonnes,
paysForItselfTonnes, compositeCurve or simplePaybackYears; none is graded.

## 6. The split with gasvalue

This course owns the inventory, GWP sets, computed against reportable,
intensity, the cost per tonne, the curve, targets, the path and energy
efficiency. The flare appears only as a carbonAbatement inventory line; every
graded flare figure is a carbonAbatement output. `gasvalue` owns the flare as
a resource and grades flareToValue and lpgCng only. Nothing here grades NPV,
IRR, Monte Carlo or a decision tree, or a compressor.

## 7. Vendoring

Not re-vendored. The worktree sits on the lead's shared vendor commit fe001b52
(engines f0aef14, `downstream` removed from excludedDomains).

## 8. The extension round (2026-09-19, engines df31f53)

The lead repaired F1 to F7 and the writers' F8 (a refused combustion left no
trace in the inventory) and F9 (the stack oxygen refusal text) in engines
#228 (MD45-1, df31f53), and re-vendored in NextGen (4b848680). Rebuilt on it,
**all eighteen graded values are byte-identical** (fields.json, capstone.json
and the prompts). None of the moved molar masses reaches a graded path: the
heater and flare CO2 use MW_CO2, which did not move. The IGRITA fuel's propane
(44.096 to 44.097) and CO2 (44.010 to 44.009) move only the fuel molar mass and
the air per kg of fuel, which are not graded. The efficiency weighs products
at PRODUCT_MOLAR_MASS, the same values as before. The IGRITA trap is choked at
8.213 bar a against the default atmosphere.

The digest grew from 695 to 913 lines and keeps its 26 sections. Every line
that changed is in REVISE.md: the engine strings reworded by the copy rule
sweep, the FUEL_REFERENCE molar masses, the mass-balance residual, the stack
oxygen refusal, the choked note, the life refusal, the SECTION 9 first steps
(the refused flare is now a blocked line), and the SECTION 21 verdicts. Rows 1
and 3 are now "not assessed", and a row with every computed source passed and
a what-if row show when the verdict returns. The writers' gaps in
DIGEST-GAPS.md are closed additively, except P5 (a flue gas with carbon
monoxide), which the engine does not model.

The page layer's F1 behaviour is now the engine's: at the Carbon Studio's
defaults the curve reads "not assessed" on steam and flare (FINDINGS-carbon
MD45-1). oracle_check.py now calls the exported `duty_ledger()`, so every
graded field goes through an oracle function. Nothing is transcribed.
