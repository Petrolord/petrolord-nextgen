# `gasvalue` RECON: Flare Gas to Value & LPG/CNG

Academy module `energy_transition` (label "Energy Transition", already in
src/lib/academyModules.js), path_order 51, slug `gasvalue`, course code prefix
**`gv`** (unused: no `gv` file under migrations/, no tools/course-banks/gv*, no
wave.json with that prefix). Built beside `carbon` (Carbon & Energy Efficiency,
52). Subject: `engines/downstream/flareToValue.js` and
`engines/downstream/lpgCng.js` as vendored sha-identical from petrolord-engines
**f0aef14** (MD4-0, engines #227, with MD5-0 #226) by the lead's shared vendor
commit fe001b52; their goldens `test-data/downstream/goldens/flaretovalue_cases.json`
and `lpgcng_cases.json`; their oracles `oracle_flaretovalue.py` and
`oracle_lpgcng.py` and `FINDINGS-gasvalue.md` under
`tools/validation/downstream/`; and the two live Suite apps that call them, the
Flare Gas to Value Studio (DS10) and the LPG & CNG Rollout Studio (DS7).

> RECON.md IS PROVENANCE. No writer may quote a figure from this file. The
> teaching truth is `digest.txt`, and every figure below that is not a count of
> files or cases was produced by running the engine or the oracle, and is
> reproduced by the command shown beside it.

## THE ONE SENTENCE

**A flare is a measured gas before it is an emission or a product: its heating
value, its liquids and its carbon come from the analysis by the mole, the
flare's CO2 and methane follow the rule's two efficiencies, a route can yield no
more than the gas holds and is credited only for the share it recovers against
a declared counterfactual, and the LPG vessel, the vaporizer, the carousel, the
CNG bank and the cascade are each sized on the basis the engine states (a fill
limit's basis, the boiling point at pressure, the positions wholly working,
absolute pressure, real gas, equalisation).**

## WHAT THE COURSE CHOSE TO TEACH, AND WHAT IT LEAVES OUT

The two modules export 17 functions and 17 constants and tables (digest SECTION
1 counts them from the modules). The three tiers follow the gas from the flare
tip to the customer:

- **Associate, THE GAS AND THE FLARE** (characteriseGas, and abatement's flare
  half). Graded: heating value, gpm C3+, C3+ kg/Mscf, flare CO2, CH4, CO2e.
- **Professional, ROUTES, RECOVERY AND THE CREDIT** (ROUTE_TEMPLATES,
  screenRoute, yieldCeiling, routeEconomics, abatement's recovered share and
  counterfactual, creditSensitivity, compareRoutes). Graded: capital, CNG a
  year, value per Mscf, avoided CO2e, net abatement, breakeven credit price.
- **Expert, LPG AND CNG ON THE GROUND** (lpgBlendProperties, lpgStorageSizing,
  vaporizerDuty, bottlingPlant, assetFloat, gasMassInVessel, cascadeFills,
  cngCompression as a unit bridge, cngDispensing, conversionEconomics). Graded:
  usable LPG, vaporizer design duty, carousel wait, bank mass, gas left in the
  cascade, simple payback.

**Taught but never graded:** every refusal, note, verdict and basis word;
screenRoute's verdicts; richness; compareRoutes' ranking; the counts
(fillsBeforeRecharge, queuePositions, fleetRequired; an integer graded at 0.5
collides with the digest's integers); the stand-in note; the forecourt queue
(the carousel's is graded); cngCompression (FC3 owns compression; only its unit
bridge is shown, and no power is graded); lpgBlendProperties (its figures feed
two graded fields); assetFloat. **Left out:** nothing in scope.

## 1. What the modules compute

| function | inputs | outputs a lesson reads |
|---|---|---|
| characteriseGas | components [{code, moleFraction, c, molarMassLbLbmol, ghvBtuScf, liquidDensityLbGal, recoverableAsNgl, inert}] | normalised fractions, rawMoleFractionSum and normalisationNote, ghvBtuScf (mole-weighted; null if any heating value is missing), inertMoleFraction, co2MoleFraction, carbonPerMol, hydrocarbonCarbonPerMol, methaneMoleFraction, molarMassLbLbmol, kgPerMscf, c3PlusKgPerMscf, gpmC2Plus and gpmC3Plus (null if a liquid density is missing), richness (lean below 1, moderate below 2.5, rich; read back by bisection in SECTION 7), or a refusal (blank or negative fraction, unknown code with no carbon number, a sum of nothing) |
| screenRoute | a route with requirement limits, the gas, the volume | per check: actual, limit, pass / fail / unchecked / no data, margin; verdict passes / fails / not fully screened; failures with shortfall; uncheckedRequirements |
| yieldCeiling | yieldBasis, gas | kg or t per Mscf from the gas mass or the C3+ mass, or MWh per Mscf from the heating value over BTU_PER_MWH |
| routeEconomics | route, gas, volume, on-stream days (omitted 350, blank refused, (0, 366]), yield (refused above the ceiling or not positive), recovery ((0, 1]), price, reference capital and capacity, exponent (0.9), fixed and variable opex (blank taken as zero and named) | mscfPerYear, productPerYear, revenue, opex, margin, valuePerMscf, capitalCost, cashFlow {year0, recurring}, assumedZero, capexNote, valuationNote |
| abatement | gas, volume, days, destruction efficiency (required, (0, 1]), combustion efficiency (optional, not above destruction; stands in), recovery, product combustion, displaced fuel, GWP, label | flareCo2Tonnes (CO2 in the gas passed through plus combustion x hydrocarbon carbon), flareCh4Tonnes (methane x (1 - destruction)), flareCo2eTonnes (null without GWP), methaneShareOfFlareCo2e, avoidedFlareCo2eTonnes (flare x recovery), netAbatementTonnesCo2ePerYear (avoided - product + displaced, only when all are declared), grossClaimIfNoCounterfactual, blockedBy, warning, basis, combustionEfficiencyNote |
| creditSensitivity | net abatement (refused if missing or not positive), prices, margin, hurdle (omitted 0, blank missing) | points [{revenue, total, clears}], standsAloneWithoutCredits, breakevenCreditPrice = (hurdle - margin) / tonnes, lowestTestedClearingPrice, verdict |
| compareRoutes | screenings, economics, abatements | rows; bestByValuePerMscf only among routes that pass; leaderNotFullyScreened; screenedOut; rankingNote |
| lpgBlendProperties | components by liquid volume with density, molar mass, latent heat | density on volume, mass fractions, latent heat on mass, molar mass on moles |
| lpgStorageSizing | capacity, fill ratio (required), fillRatioBasis (liquid_volume or water_capacity_mass at WATER_KG_M3 999.1), density, demand, delivery, lead, safety (blank missing) | usableM3, usableTonnes, vapourSpaceM3, coverDays, safety, reorder, ullage, delivery fits, deliveries a month, missingInputs |
| vaporizerDuty | mass flow, latent heat (required), liquid cp, inlet, boiling point (refused below the inlet), vapour cp, outlet (refused below the boiling point), margin | three terms in kW with shares, dutyKW, designDutyKW, missingTerms and the floor note |
| bottlingPlant | cylinders a day, fill minutes, positions, shift hours (omitted 8), availability (omitted 1) | effectivePositions, queuePositions = floor (refused below 1), rounding note, minimum positions, the rackQueue (Erlang C) result, throughput capacity, meetsDemand |
| assetFloat | units a day, stages (a blank stage refused), spares | cycleDays, inCirculation, spares, fleetRequired = ceiling, dominant stage |
| gasMassInVessel | volume, pressure bar(a), temperature, gas SG (omitted 0.6) | z (DAK on Sutton), ppr, tpr, correlationInRange, massKg, idealMassKg, realVersusIdeal, pressureBasis |
| cascadeFills | banks bar(a), vehicle tank, start, target, temperature (omitted 15), SG (omitted 0.6) | kgPerFill, fillsBeforeRecharge, fills, delivered, stored, leftInBanksKg, cascadeEfficiency, banksAfter, nextVehicleReachesBar, hitFillLimit |
| cngCompression | kg/h, suction and discharge bar(a), suction C, SG, k, efficiencies | the unit bridge (qMMscfd, psia) into facilities/compression.compressorTrain and its stages back in bar(a) and kW |
| cngDispensing | vehicles an hour, fill minutes, dispensers (whole) | the rackQueue result (an unstable forecourt is an answer), kg an hour |
| conversionEconomics | distance, base fuel, new fuel (measured consumption, or both energies and an efficiency ratio, required), conversion cost, extra maintenance | derived consumption, costs, cost per km, annual saving, simple payback (undiscounted; null if no saving), kg CO2e avoided, the annual cash flow |

**The clock.** Neither module reads a clock. The code they call does not either,
with ONE exception off this course's path: `modularRefinery.feasibilityEconomics`
defaults `startYear` to `new Date().getFullYear()` (the refinery wave's RECON
records it). This course imports only `scaleCapex` and `SCALING_EXPONENT` from
that module; `gate_clock.sh` names the read, proves nothing here calls it, and
shows the digest and the eighteen graded values byte-identical with the machine
clock moved -400 and +900 days. No as-of date.

## 2. The live surface, and what depends on the MD4-0 Suite PR

| app | engine calls (Suite `src/contexts/*Context.jsx`) |
|---|---|
| Flare Gas to Value Studio | characteriseGas on the gas table; screenRoute per route; routeEconomics per route; abatement for the credited route; creditSensitivity on that route's margin; compareRoutes |
| LPG & CNG Rollout Studio | lpgBlendProperties, lpgStorageSizing, vaporizerDuty, bottlingPlant, assetFloat (cylinders and trailers), cascadeFills, gasMassInVessel per bank, cngCompression, cngDispensing (on the cascade's kgPerFill), conversionEconomics |

**THE LIVE PAGES ARE NOT YET WHAT THIS COURSE TEACHES.** Suite origin/main
(0d01a1c6c) vendors packages/engines at **5c0cb97**, BEFORE MD4-0, and its
contexts predate the repair. The repair is branch
**`fix/md4-0-gasvalue-apps`** (pushed to origin at 2d4f02792, vendoring f0aef14;
it was unpushed with uncommitted edits in /root/wt-md4-suite when this recon
began, and was re-read from origin once pushed). **Go-live of this course
depends on that branch merging and the Suite being uploaded.** Page behaviours
that depend on it:

| behaviour the course teaches | origin/main | fix/md4-0-gasvalue-apps |
|---|---|---|
| flare methane from the methane, CO2 passed through | pre-repair engine (every unburned carbon as methane) | f0aef14 |
| a combustion efficiency input | absent | FlareInputs "Flare combustion efficiency", optional |
| only the recovered share avoided | engine takes the whole flare; no recoveryFraction passed | the credited route's recovery passed |
| the LPG route yield within the ceiling | 0.02 t/Mscf (3.6 times the C3+ the gas holds) | 0.0045 |
| best only among routes that pass | "best on value" on unscreened routes | leaderNotFullyScreened shown |
| breakeven credit price | first clearing price typed | the breakeven with the lowest tested price |
| blank on-stream days, costs, hurdle | read as 350, 0, 0 by the page's num() | passed as missing |
| a variable opex input | none (hidden number) | per route |
| the cascade by equalisation | 10 fills, "stranded below target" | 33 fills, left in the banks, next vehicle's pressure |
| boiling point at the vaporizer's pressure | n-butane atmospheric -0.5 C passed | an input with no default |
| the fill limit's basis | none | a select |
| bar(a) labels | "bar" | "bar(a)" |
| positions wholly working, a blank stage refused, efficiency ratio required | rounded, dropped, defaulted 1 | per the engine |

## 3. Findings

### 3a. P1, the Rollout Studio's vaporizer defaults cannot give a full duty. ON THE MD4-0 BRANCH, NOT ON A GRADED PATH. For the lead.

On `fix/md4-0-gasvalue-apps` (LpgCngContext.jsx lines 44 and 45) the vaporizer
opens with inlet 25 C, outlet 15 C and the boiling point blank. The engine
refuses a boiling point below the inlet and an outlet below the boiling point,
so NO boiling point a user types completes the duty: 25 or more is refused for
the outlet, anything below 25 for the inlet. The page can show only the floor
(boil alone, 55.511389 kW at the defaults) or a refusal. Reproduce:

    node --input-type=module -e "const L=await import('/root/wt-et-gasvalue-nextgen/packages/engines/engines/downstream/lpgCng.js');
    for (const bp of ['',10,20,25,30]) { const r=L.vaporizerDuty({massFlowKgHr:500,latentHeatKJkg:399.682,liquidCpKJkgK:2.5,inletTempC:25,boilingPointC:bp,vapourCpKJkgK:1.7,outletTempC:15,designMarginPercent:20}); console.log(bp, r.error||r.dutyKW) }"
    ->  55.511389 (floor), 10/20: "The liquid enters at 25 C, above the boiling point given ...", 25/30: "The vapour leaves at 15 C, below the boiling point given ..."

Recommend: an outlet default above any plausible boiling point at the
vaporizer's pressure, or the outlet blank like the boiling point. The engine is
right; the page's two defaults contradict each other. The course teaches the
KANO vaporizer (inlet 18, boiling 38, outlet 55), never the page's defaults.

### 3b. F-R1, four oracle ledgers were inline in main(). REPAIRED UPSTREAM IN MD45-1 (engines #228, df31f53); oracle_check.py now calls them. The foundation's note follows.

`oracle_flaretovalue.py` computes the net abatement (avoided - product +
displaced) inline in main(); `oracle_lpgcng.py` computes the storage (both
bases), the vaporizer's three terms and the conversion case inline in main().
No function is exported for any of them. `oracle_check.py` TRANSCRIBES those
four ledgers from main() for the capstone (net abatement, water-capacity
storage, vaporizer design duty, payback) and says so; every other graded field
calls an exported oracle function (characterise, flare, economics, credits,
blend, erlang_c, mass, cascade). Each is a one-line identity and the goldens
cover the same exports, but a callable oracle function is stronger. Same shape
as the supply wave's, closed there by MD3-1 (engines #224). Recommend a small
engines PR exporting `net_abatement()`, `storage()`, `vaporizer()` and
`conversion()`.

### 3c. F-R2, the flare tonnages carry the engine's nine-figure pound. TOLERANCE DECISION TAKEN.

flareToValue converts with `LB_PER_KG = 2.20462262`, the reciprocal of the exact
0.45359237 to nine figures; the oracle carries the exact figure. On ERIEMU's
CO2e (339,138.908 t/yr) the engine, after rounding to three decimals, and the
oracle differ by 1.05e-3 t, one thousandth of a tonne past a one-unit tolerance
at three decimals. Decision: tonnes a year of a flare or an abatement are graded
at 0.01 t (ten units of the printed place; gradeprecision accepts it, and the
closest wrong route on any tonnage field is above 1e5 tolerances). Reproduce:
`python3 oracle_check.py` (the tonnes rows print their distance in tolerances).
The same module weighs the flare's CO2 at 44.009 (inline in abatement) and
carries CO2 at 44.010 in GAS_COMPONENT_REFERENCE; the oracle uses the same pair,
the digest prints both (SECTIONS 2 and 10), and nothing graded mixes them. Not a
defect; noted.

### 3d. F-R3, engine strings broke the owner copy rule. REPAIRED UPSTREAM IN MD45-1 (three strings reworded); the digest now quotes the new wording and defers nothing. The foundation's note follows.

`flareToValue.characteriseGas` ghvNote ("... makes the mixture value missing,
not partial.") and `lpgCng.vaporizerDuty` note ("It is a floor, not the duty.")
carry the "X, not Y" contrastive. The digest quotes both verbatim (SECTIONS 8
and 27); digestprose defers them as verbatim engine strings and pins them, so an
engines copy sweep that rewords them turns the digest gate red until the digest
is rebuilt. The lesson task tells writers to quote them only as the engine's
words.

### 3e. F-R4, constants the engine did not export. REPAIRED UPSTREAM IN MD45-1: FLARE_MOLAR_MASS and RICHNESS_GPM; the digest, the capstone generator and the lab read them. The foundation's note follows.

The flare's molar masses (44.009 and 16.043) are inline in abatement and the
richness band edges (1 and 2.5 gal/Mscf) are inline in characteriseGas. Neither
is exported. The digest prints both by making the engine answer about itself (an
all-CO2 and an all-methane flare give back the molar masses; a bisection on a
methane and propane mix finds where the richness word changes), and the Expert
prompt's molar masses are read the same way by the capstone generator. A small
engines PR exporting `FLARE_MOLAR_MASS` and `RICHNESS_GPM` would make both
direct reads.

### 3f. Smaller notes, none on a graded path

- `assetFloat` returns `complete: true` and `missingStages: 0` as constants
  since MD4-0 refuses a blank stage; dead fields, not taught.
- The cascade is isothermal (FINDINGS C1): taught as a stated limit in SECTION
  31; the count is a ceiling in that one respect.
- `cngDispensing` passes an unstable forecourt through as an answer with the
  queue's own message; taught in SECTION 33.

## 4. FINDINGS-gasvalue held items and repairs in scope

HELD, taught as limits and never graded (digest SECTIONS 14 and 35): **H1** the
flare efficiency tiers of 40 CFR 98.233(n)(1) as defaults (both efficiencies
stay inputs); **H2** the unlit flare, not modelled; **H3** code fill limits,
not shipped; **H4** GWP values and credit prices as case inputs.

REPAIRED at f0aef14 and taught as current rules: C1 the cascade by equalisation
(SECTION 31); Y1 the yield ceiling (18); B1 the best only among routes that pass
(23); A1 the flare by the rule (10, 11); A2 the recovered share (21); K1 the
closed-form breakeven (22); K2 no credits from a project that adds emissions
(22); K3 no margin, no verdict, and the blank hurdle (22); E1 blank costs named,
blank days missing (19, 13); G1 a missing density or heating value is missing
(8); G2 the carbon number from the reference and the normalisation note (4, 6);
V1 the boiling point at the vaporizer's pressure (27); L1 the efficiency ratio
required (34); L2 the positions wholly working (28); L3 a blank lead time (26);
L4 the fill ratio basis (26); L5 a blank stage refused (29); L6 blank boxes
missing (28, 30, 31); L7 the pressure basis (30); L8 the queue refusal passed up
(33); L9 a blank LPG fraction refused (25); T1 the computed scf/kmol (32 uses
the bridge; not printed separately). Decisions D1 (the stand-in, SECTION 11),
D2 (recovery required, 21), D3 (the page's 0.0045, 18), D4 (the stop and the
banks after the last whole fill, 31) and D5 (omitted keeps the default, blank is
missing, 13 and 19) are each taught where the section numbers say.

## 5. The gradeable set, and why these eighteen

**The academy grader is numeric only**, so every graded field is a number the
engine returns. Every graded output is recomputed by the vendored ORACLES on the
capstone records (`oracle_check.py`, 18 of 18, largest disagreement 0.435 of a
tolerance), chained oracle to oracle:

| graded output | oracle |
|---|---|
| ghvBtuScf, gpmC3Plus, c3PlusKgPerMscf | oracle_flaretovalue.characterise (exact rationals in kg and m3) |
| flareCo2Tonnes, flareCh4Tonnes, flareCo2eTonnes | oracle_flaretovalue.flare (by moles, W-36 cross-check inside) |
| capitalCost, productPerYear, valuePerMscf | oracle_flaretovalue.economics |
| avoidedFlareCo2eTonnes | oracle_flaretovalue.flare with the recovery |
| netAbatementTonnesCo2ePerYear | oracle_flaretovalue.net_abatement (exported in MD45-1) |
| breakevenCreditPrice | oracle_flaretovalue.credits on the oracle's own margin and net |
| usableTonnes (water basis) | oracle_lpgcng.storage (exported in MD45-1) |
| designDutyKW | oracle_lpgcng.vaporizer (exported in MD45-1) on oracle_lpgcng.blend's latent heat |
| averageWaitMinutes | oracle_lpgcng.erlang_c (exact rationals, floored positions) |
| massKg | oracle_lpgcng.mass (DAK by bisection) |
| leftInBanksKg | oracle_lpgcng.cascade (mass ledger by false position, conservation asserted) |
| simplePaybackYears | oracle_lpgcng.conversion (exported in MD45-1) |

Not graded although oracle-covered: the blend's own figures (they feed two
graded fields), the Z factor, queue probability and length, the counts. Not
graded because no oracle covers it: screenRoute's margins, compareRoutes'
ranking, the compressor train's stages beyond the unit bridge (FC3's oracle
covers the thermodynamics), assetFloat's ceiling (the oracle covers it; it is a
count, and counts are not graded).

## 6. The split with carbon

This course owns the flare as a resource and grades flareToValue and lpgCng
only. `carbon` owns the inventory, the GWP sets and their editions, intensity,
the cost per tonne and the MAC curve, targets and energy efficiency, and grades
carbonAbatement and energyEfficiency only. Flare combustion appears in both
engines; here it is the flare in abatement, there an inventory line. Neither
grades NPV, IRR, Monte Carlo or a decision tree.

## 7. Vendoring

Not re-vendored. The worktree sits on the lead's shared vendor commit fe001b52
(engines f0aef14). `gate_vendor.sh` compares the 15 paths this wave stands on
(the two engines and the four they call, both oracles, FINDINGS-gasvalue,
negcontrol_md4.sh, both goldens and the three jest suites) with
`git show f0aef14:<path>`: all sha-identical. The three suites
(`downstream.flareToValue`, `downstream.lpgCng`, `downstream.gasvalue.golden`)
run 200 of 200 in the worktree, and both oracles regenerate their goldens
byte-identical (run from a scratch copy in this wave directory).

## 8. The extension round (2026-09-19), engines df31f53 (MD45-1)

Re-vendored by the lead (d39ae319). Rebuilt on it before any edit, the
foundation digest differed in exactly three lines: SECTION 1's export count
(flareToValue now exports FLARE_MOLAR_MASS and RICHNESS_GPM) and the two
reworded engine notes (the heating-value note in SECTION 8, the vaporizer
floor note in SECTION 27). **All eighteen graded fields are byte-identical**
(fields.json and capstone.json unchanged; the prompts' molar masses and
exponent are read from exports and print the same figures). The writers' gaps
in DIGEST-GAPS.md were then closed additively: the digest grew from 895 to
1030 lines, 36 sections either side. REVISE.md maps every changed line.

LEAD RULING on the fill basis, applied: the digest prints both cases. Typed
blank the basis is refused (the engine's "Unknown fill ratio basis" refusal);
OMITTED, lpgStorageSizing takes liquid_volume and NAMES it in its output
(fillRatioBasis liquid_volume). The output names the basis it assumed, so
there is no engine follow-up, and the lessons teach the typed basis.

Gaps NOT closed, reported rather than typed: hitFillLimit's cap (maxFills 500)
is an inline default the engine does not export, so the digest says only "the
cap the call carries"; the gas constant in m = PVM/ZRT is inline in
gasMassInVessel and not printed as a figure; blockedBy's precedence with two
inputs missing and a blank credit-price entry are not probed; a route payback
(capital over margin) is not printed because no oracle computes it; coverDays
is rounded by the engine to three decimals (a rounding note says so).
