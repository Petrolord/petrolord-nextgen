# FC3 findings. Rotating Equipment, foundation phase, 2026-09-16.

Engines `packages/engines/engines/facilities/pumps.js` and
`engines/facilities/compression.js` at engines main `709172f`, over
`engines/production/gasProperties.js`. Found by reading the source, by direct
probe, and by the independent oracle `oracle_rotating.py` / `oracle_stage2.py`
(the curve fit in exact rational arithmetic, the duty point in closed form,
the polytropic head by 64-point Gauss-Legendre in 50-digit Decimal with a
path-property residual, the discharge temperature inverted out of that
integral, the stage count in closed form, and every field packaging derived
from its own definition). 403 engine-against-oracle comparisons across 14
blocks plus 8 stages in a second pass, with a negative control in each that
was caught.

**RE-CUT 2026-09-16 ONTO ENGINES MAIN `4fa37e6`.** When this file was written
nothing was fixed. Everything in sections A, B and E now is: the FC3-0 wave
repaired the engines half (engines PR #197) and the Suite half (Suite PR #491),
and the course foundation was rebuilt on the repaired engine before a lesson
was written. The status of every item is recorded in the two FC3-0 sections at
the end of this file, and a third section records what the REBUILD itself
found. Read the per-item text below as the state at `709172f` and the
resolution at the end.

**NOTHING IN THIS FILE IS TEACHING TRUTH, AND REPAIR-HISTORY LEAST OF ALL.**
Every ratio, every "used to", every old constant and every moved golden here is
provenance for the lead. A lesson, a question, a panel or a capstone takes its
numbers from `digest.txt` and from nowhere else. See RECON.md, which says the
same thing at the top for the same reason.

**NOTHING HERE WAS FIXED IN THE FOUNDATION PHASE.** The course may have needed
to teach around these, and a fix moves goldens. Each item says whether it **FAILS OPEN** (a
wrong number presented confidently), **FAILS SILENT** (a non-finite value with
no `error` key, so a caller checking `if (r.error)` is told nothing is wrong),
**FAILS CLOSED** (a refusal), or is a **CONVENTION** (a rounded packaging,
real but not a bug).

**Findings marked LIVE are reachable today by typing into a box in a shipped
Suite studio.** There are nine, and section S lists them again.

---

## The honest positive first, because it bounds what follows

| block | comparisons | worst relative gap against the independent route |
| --- | --- | --- |
| duty point (closed form against bisection) | 24 | **1.065e-15** |
| head and pressure, both ways | 14 | 3.226e-16 |
| NPSH available (field balance against the engine) | 16 | 8.514e-16 |
| the NPSH check: margins, ratios, severities, pass flags | 27 | **exact** |
| the exact affinity speed law | 18 | 1.480e-16 |
| the four operating regions and their boundaries | 12 | **exact** |
| stage count, ratio per stage, which limit governed | 20 | 2.006e-16 |
| actual inlet volume | 8 | **exact** |
| HI factors (Decimal against double) | 46 | 2.469e-15 |
| every refusal branch, classified | 48 | **48 of 48 as expected** |
| discharge temperature, inverted out of the head integral | 8 | 4.711e-16 |
| mass flow | 8 | **exact** |
| isentropic efficiency | 8 | 1.171e-15 |

**The polytropic path is real.** The product `p v^n` along the path the
engine's own exponent implies is constant to between 1e-60 and 1.7e-59 across
all eight stages. That is the defining property of a polytropic path and no
amount of matching algebra can fake it.

**Nine stage counts out of ten came out of a loop that searches and a closed
form that does not, and they agreed exactly, including which limit governed.**

Everything below is what is left.

---

## A. FAILS OPEN. Eleven of them.

### C1. A compressor train can break the discharge-temperature limit it was staged against, and says nothing. LIVE

`stageCount` decides how many stages the temperature limit demands using
`tSuctionF` for **every** stage. `compressorTrain` then runs stage 1 from
`tSuctionF` and every later stage from `interstageCoolToF`. **If the
intercooler approach is above the suction temperature, the later stages are
hotter than the stage count was chosen for.**

    compressorTrain({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100,
                      pDischargePsia: 400, gasSg: 0.65, k: 1.28,
                      polytropicEfficiency: 0.75,
                      interstageCoolToF: 180, maxDischargeF: 250 })

returns **2 stages**, `governedBy: 'discharge temperature'`, stage discharges
**225.396 F and 323.320 F**. The stated limit was 250 F. The final discharge
is **73.320 F above it**, on a train whose own return says the temperature
limit is what set the stage count.

Every approach above the suction temperature does it:

| coolTo | stated limit | stages | stage discharges | over the limit | warned |
| --- | --- | --- | --- | --- | --- |
| 140 | 200 | 3 | 180.751, 226.522, 226.522 | 2 | **0** |
| 150 | 220 | 3 | 180.751, 237.965, 237.965 | 2 | **0** |
| 160 | 230 | 2 | 225.396, 298.839 | 1 | **0** |
| 170 | 240 | 2 | 225.396, 311.080 | 1 | 1 |
| 180 | 250 | 2 | 225.396, 323.320 | 1 | 1 |
| 200 | 250 | 3 | 215.403, 365.510, 365.510 | 2 | 2 |
| 240 | 250 | 3 | 215.403, 415.546, 415.546 | 2 | 2 |

**LIVE.** `Intercool to (F)`, `Suction temp (F)` and `Max discharge (F)` are
three input boxes in the Compressor Station Designer, and **the app's own
default state already has the approach above the suction temperature** (110 F
against 100 F). The Staging & Power tab prints "the stage count is the larger
of what the ratio limit demands and what the discharge temperature demands"
beside a table whose later rows can sit above the limit the user typed.

### C2. The hot-stage warning fires on a hardcoded 300 F, not on the caller's limit. LIVE

`compressionStage`'s warning is `tDischargeF > 300`; `maxDischargeF` is never
consulted. The first four rows above break the user's limit by up to 37.965 F
**with no warning at all**, and a train run at `maxDischargeF: 400` would be
warned at 310 F for nothing. The one field that could have caught C1 is
measured against a different threshold from the one the user set.

### C3. A driver whose thermal efficiency exceeds 100 percent is accepted and reported. LIVE

`driverFuel({ brakeHp: 1000, heatRateBtuHpHr: 2000 })` returns
`thermalEfficiencyPct: 127.22149999999999`. At a heat rate of 1 it returns
**254443 percent**. `heatRateBtuHpHr` is validated only as `> 0`.

**LIVE.** `Heat rate (Btu/hp-hr)` is an input box and the Machine & Fuel tab
renders `Driver thermal efficiency` as a headline percentage.

### C4. A suction below absolute zero gives a negative inlet volume, and the machine screen recommends on it. LIVE

`actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: -600, gasSg: 0.65 })` returns
**-275.48758058196427**, and `machineScreen` then reports
`recommendation: 'reciprocating'` with the reason **"only -275.5 acfm at
suction: below about 500 acfm a centrifugal wheel is too small to be
efficient"**. `Number.isFinite` is the only guard, and a negative number is
finite.

**LIVE.** `Suction temp (F)` is an input box.

### C6. A per-stage ratio limit of 1 gives an infinite stage count, and the train then blames the wrong input. LIVE

`stageCount({ ..., maxRatioPerStage: 1 })` returns
`{ overallRatio: 10, stages: Infinity, ratioPerStage: 1, byRatio: Infinity,
byTemp: 3, governedBy: 'ratio per stage' }` **with no error key**, because
`Math.log(1)` is zero. `maxRatioPerStage: -4` returns `stages: NaN` and
`governedBy: 'both equally'`.

`compressorTrain` does not hang on it (checked under a timeout): it calls
`compressionStage` with `ratio: 1`, which refuses, with **"a stage needs a
positive rate, suction pressure, gas gravity, k above 1 and a ratio above
1"**. The rate, the suction pressure, the gravity and k are all perfectly
good. The user is sent to check four correct inputs.

**ADDED 2026-09-16, during the FC3-0 repair. `maxRatioPerStage: -4` does not
return `stages: NaN`; it THROWS.** `stages` is NaN, so the stage loop body
never runs, `stages` stays empty and the return statement reads
`stages[stages.length - 1].tDischargeF` on `undefined`:
`TypeError: Cannot read properties of undefined (reading 'tDischargeF')`.
In the Suite that throw happens inside a `useMemo` during render, so **typing
a minus sign into `Max ratio per stage` takes the whole Compressor Station
Designer down**, not just the one field. This is the strongest single argument
for checking the inputs at the door, and it is now gated in the Suite.

**LIVE.** `Max ratio per stage` is an input box.

### C7. One refusal message for four different causes, and it is right for none of them. LIVE

`stageCount` returns **"no practical stage count keeps the discharge
temperature under the limit: intercool harder, or check k and the suction
temperature"** for all of:

| input | the actual fault |
| --- | --- |
| `polytropicEfficiency: 0` | an efficiency of zero, not a temperature problem |
| `polytropicEfficiency: 1.5` | an efficiency above 1 |
| `tSuctionF: -600` | a suction below absolute zero |
| `maxDischargeF: -100` | a limit below absolute zero |

In each case `polytropicExponentRatio` returns `NaN`, the loop's comparison
`NaN <= limit` is false at every stage count, and the twelve-stage cap is hit.
**FAILS CLOSED with the wrong reason**, which is worse than a bare refusal: it
sends the user to intercool harder when the fault is a typed 1.5.

**LIVE.** `Polytropic efficiency` is an input box with no bound.

### P1. The NPSH check reports `adequate` for an available head it could not read

`npshCheck({ npshrFt: 12 })` with no `npshaFt`, or with `NaN`:

    { marginFt: NaN, requiredMarginFt: 4.2, ratio: NaN,
      pass: false, severity: 'adequate', note: null }

`NaN < 0` is false and `NaN < requiredMarginFt` is false, so the ternary falls
to its last branch. **`pass: false` and `severity: 'adequate'` in one
object.** With `npshaFt: Infinity`: `pass: true, severity: 'adequate'`.

Not reachable through the Suite today (the context defaults the two unguarded
suction terms to 0 before the call), so **not live**, but it is the shape the
platform rule exists for: a verdict returned for an input it could not read.

### P2. A duty point is returned for a curve the engine has just said is not a pump curve. LIVE

`fitPumpCurve` on rising points returns `c2: +120.00000000000011` and the
warning "the fitted curve does not fall with flow: check the points, because a
centrifugal head curve must droop". `dutyPoint` is untroubled: against a
system of static 50 and friction 60 at 500 gpm it returns
`{ qGpm: 833.333333333333, headFt: 216.66666666666657 }`.

**LIVE.** The Duty Point tab renders the warning as a small note **and** the
duty flow and head as the two headline figures, in that order.

### P3. A motor efficiency above 1 or below 0 is accepted. LIVE

`pumpPower({ qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78,
motorEfficiency: 5 })` returns `motorInputHp: 24.766899766899765` against a
`brakeHp` of 123.83449883449883, **a motor drawing a fifth of what its shaft
delivers**. At `-0.5` it returns `motorInputKw: -184.68677156177156`.
`efficiency` is bounded to `(0, 1]`; `motorEfficiency` is not bounded at all.

**LIVE.** `Motor eff` is an input box.

### P4. The affinity speed law is unbounded. LIVE

`speedChange({ qGpm: 1000, headFt: 300, brakeHp: 100, speedRatio: 100 })`
returns 100000 gpm, 3000000 ft and **100000000 brake hp**. The laws hold for a
geometrically similar machine over a modest speed change; nothing flags an
extrapolation, and the cube on power means the error grows fastest on the
number that buys the motor.

**LIVE.** `Speed ratio` is an input box.

### P5. The trim de-rates head and flow but not power, so the return implies an efficiency change nothing states

`impellerTrim` applies the shortfall whole to head, half to flow, and **not at
all to brake power**, which stays the ideal `diameterRatio^3`. At a 25 percent
trim the hydraulic product `Q x H` falls to `(1 - 0.06) x (1 - 0.12) = 0.8272`
of ideal while the power is unchanged, so the return implies a 17.28 percent
efficiency loss that appears in no field and no warning. It may be the
intended physics; it is not stated, and a reader who divides the returned
power into the returned head and flow gets a number the module never mentions.

---

## B. FAILS SILENT. Eighteen inputs across twelve functions, one shape.

Each returns a non-finite value with **no `error` key**. Every row was
classified by the comparator: 48 of 48 refusal-catalogue entries as expected.

| module | function | input | returns |
| --- | --- | --- | --- |
| pumps | `systemCurve` | `staticHeadFt` omitted | `headAt(q)` is `NaN`; `kFt` is fine, so the object looks healthy |
| pumps | `psiToHeadFt` | `sg: 0` | `Infinity` |
| pumps | `headFtToPsi` | `headFt` omitted | `NaN` |
| pumps | `pumpPower` | `motorEfficiency: 0` | `motorInputHp`/`motorInputKw` `Infinity`, `hydraulicHp` and `brakeHp` correct |
| pumps | `npshAvailable` | `staticSuctionLiftFt: NaN` | `npshaFt: NaN`, `pressureHeadFt` correct |
| pumps | `npshAvailable` | `suctionFrictionFt: NaN` | same |
| pumps | `npshCheck` | `npshaFt` omitted or `NaN` | `marginFt: NaN`, and see P1 |
| pumps | `speedChange` | no duty given | all three outputs `NaN` |
| pumps | `impellerTrim` | no duty given | four outputs `NaN`, `trimPercent` and `shortfallPct` correct |
| pumps | `viscosityCorrection` | `speedRpm: 0` | `B: Infinity`, `cQ: 0`, `cEta: 0`, `correctedQGpm: 0` |
| pumps | `viscosityCorrection` | `speedRpm: -3560` | every field `NaN`, **and no warning either** |
| compression | `polytropicExponentRatio` | `polytropicEfficiency: 0` | bare `NaN` |
| compression | `polytropicExponentRatio` | `k <= 1` | bare `NaN` |
| compression | `dischargeTempR` | any of the above | bare `NaN` |
| compression | `stageCount` | `maxRatioPerStage: 1` | `stages: Infinity` (C6) |
| compression | `stageCount` | `maxRatioPerStage: -4` | `stages: NaN` (C6) |
| compression | `compressionStage` | `polytropicEfficiency: 0` or `> 1` | every thermodynamic field `NaN` |
| compression | `compressionStage` | `mechanicalEfficiency: 0` | `brakeHp: Infinity` |
| compression | `actualInletCfm` | `qMMscfd: 0` | bare `NaN` |
| compression | `compressorTrain` | `cpBtuLbF: NaN` | `totalCoolingBtuHr: NaN`, every power correct |

**The shape is always the same and that is what makes these dangerous: the
guarded half of the input set is guarded properly.** `pumpPower` validates
flow, head, gravity and pump efficiency and then divides by an unvalidated
motor efficiency. `npshAvailable` validates gravity, suction and vapour
pressure and then adds two unvalidated head terms. `compressionStage`
validates five inputs and hands two efficiencies straight to the arithmetic.
**The existence of the guards is what makes the gaps invisible.**

---

## C. CONVENTIONS AND CROSS-MODULE DIVERGENCE

### F1. Two values of one gas constant, in two modules that import from each other. **This one is a defect.**

`compression.js` declares `R_UNIVERSAL_FT_LBF = 1545.349` and imports
`suttonPseudoCriticals`, `dakZ` and `toRankine` from `gasProperties.js`, which
declares the **same constant** as `R_UNIVERSAL = 10.7316` psia.ft3/(lbmol.R).

| route | ft.lbf/(lbmol.degR) | ratio to the SI derivation |
| --- | --- | --- |
| derived from the 2019 SI value of R | 1545.3471008183 | 1 |
| `compression.js` | 1545.3490000000 | 1.000001228967688 |
| `gasProperties.js` x 144 | 1545.3504000000 | 1.000002134913025 |

**Ratio of the two engine constants: 0.999999094056597.** Every polytropic
head and every gas horsepower is **9.06e-7 low** against the gas constant the
module it imports from uses for the same gas.

This is the whole of the stage-block gap. The quadrature on the derived
constant sits **1.229e-6** from the engine on all eight stages, identically,
and re-scaling the same quadrature onto the engine's own 1545.349 closes it to
machine noise. **It is a constant, not a tolerance.** The fix belongs in the
engines repo: import the gas constant from the one module that owns it.

### F2. `MW_AIR` and the Rankine offset are duplicated, with no divergence yet

`compression.js` carries `MW_AIR = 28.9625` and writes `459.67` inline three
times, while the `gasProperties.js` it already imports from exports
`AIR_MW = 28.9625` and `R_OFFSET = 459.67`. The values agree today. F1 is what
this becomes when one of them is edited.

### F3. Two standard bases in one module, 3.4 parts in ten thousand apart

`LBMOL_SCF = 379.49` belongs to the **14.696 psia, 519.67 degR** base: the
derived molar volume there is 379.482762 scf/lbmol, ratio 1.000019074.
`actualInletCfm` in the **same file** works from **14.7 psia and 520 degR**,
whose derived molar volume is 379.620414, ratio 0.999656462. The two bases are
3.4e-4 apart. (The gas transmission forms FC2 teaches use a third, 14.65 and
520, at 380.916047.)

### F4. The kilowatt packaging is rounded

`0.7457` against the derived `0.7456998715822702`, ratio
**1.0000001722110123**. Every `motorInputKw` is 1.722e-7 high, measured
identically on all eight power cases. That is the entire `power` block gap.

### F5. The horsepower-hour packaging is rounded

`2544.43` against the derived `2544.433577644024`, ratio
**0.9999985939330248**. Every `thermalEfficiencyPct` is 1.406e-6 high, on all
six fuel cases. That is the entire `fuel` block gap.

### F6. The two pump packagings are ONE constant, and that is a positive result

`psiToHeadFt({ psi: 1, sg: 1 })` gives 2.31, implying `144 / 2.31 =
62.33766233766234` lb/ft3. `pumpPower` at unit flow, head, gravity and
efficiency gives 3960, implying `(33000 / 3960) x (1728 / 231) =
62.33766233766234` lb/ft3. **The two are equal to the last digit**, computed
rather than claimed. Comparing that density to a published water density is
held (section D).

### F7. The curve fit is solved on the normal equations in double precision

Condition numbers of the normal-equation matrix across the six swept point
sets: 3.434e2, 3.608e2, 3.667e2, 3.868e2, 3.868e2, 6.095e2. Against the exact
rational solve the coefficients land within **7.807e-15 of the coefficient
norm**, about thirty-five machine epsilons and exactly what that conditioning
predicts. The only large *relative* gaps, up to 1.233e-12, are on the small
linear coefficient `c1`, which on one set is 6.3e-3 of the coefficient norm.
**Not a constant and not a bug: it is what a normal-equation solve costs, and
a QR or orthogonal-polynomial fit would not pay it.**

### F8. The trim's 5 percent boundary is missed by floating point

`diameterRatio: 0.95` gives `trimPercent: 5.000000000000004`, so `trimPct <= 5`
fails and the shortfall comes out `2.6645352591003757e-15` where the rule
intends exactly zero. The head difference it causes is 0 at this magnitude, so
nothing moves; it is **FC1's floor-comparison lesson repeating**, and the
repair there (a small slack on the comparison) applies unchanged.

---

## D. HELD FOR LITERATURE. Taught as limits, never graded.

1. **The Hydraulic Institute viscosity correction.** `B`, `cQ`, `cH` and
   `cEta` are empirical with no publication in this repository. The oracle
   checks the arithmetic at 60 digits, the closed-form inverse of the `cQ`
   form (round trip to 2.6e-14 or better on all eight corrected cases) and the
   monotonicity both factors must have. **That is arithmetic evidence only and
   is weaker than anything derived.** `cH = cQ` at BEP is a further
   simplification of the standard.
2. **The impeller trim shortfall model.** Zero at or under 5 percent, then
   0.006 per further percent, capped at 0.12, applied whole to head and half
   to flow. No source. The engine's own comment calls it "the published
   shortfall" without naming a publication.
3. **The operating region bands**, 50, 70, 120 and 140 percent of BEP flow.
   Customary; unsourced in the repo.
4. **The NPSH margin rule**, the larger of 3 ft and 35 percent of required.
   Customary; unsourced. See also G7.
5. **The machine screening thresholds**: 500, 5000 and 20000 acfm, ratios of
   4 and 6, 200 and 10000 brake hp.
6. **The 300 F discharge warning threshold** (and see C2, where it is also the
   wrong threshold to be testing).
7. **The comparison of the implied water density, 62.33766233766234 lb/ft3, to
   a real water density.** The packagings are the engine's own definitions and
   are measurable; what they sit 0.05 percent away from is a handbook figure
   this repository does not hold.
8. **All sixteen published goldens are synthetic.** Ten pump cases and six
   compression cases, every one written by an oracle. **No measured pump test,
   no vendor performance run and no field compressor datasheet is in this
   course.**

**No graded capstone value touches any of these**, and the neutralisation is
asserted rather than promised: `fc3_capstone.mjs` greps its own source and
fails if `viscosityCorrection`, `impellerTrim`, `operatingRegion`, `npshCheck`
or `machineScreen` is ever called from it; the Professional tier grades a
SPEED change, where the affinity laws are exact, and never a trim; the
compressor capstone proves every evaluated state sits inside the DAK window
(Ppr 0.207 to 1.859, Tpr 1.498 to 1.837) and that no stage exceeds its own
stated 285 F limit; and every discriminating condition is stated in the
prompt rather than defaulted.

---

## E. STRUCTURAL AND GATE DEFECTS

### G1. The engine's own strongest check is an algebraic identity and validates nothing

`__tests__/facilities.compression.test.js` asserts the polytropic and
isentropic power routes agree to 1e-12 and comments: "they agree identically,
which is the strongest available check that neither is transcribed wrong."

They agree because they are the same expression. With `e = (k-1)/(k eta_p)`
and `kExp = (k-1)/k`, the isentropic route divides the isentropic head by
`eta_s = (r^kExp - 1)/(r^e - 1)`, which cancels to `A (r^e - 1)/kExp`; the
polytropic route divides the polytropic head by `eta_p`, giving
`A (r^e - 1)/(e eta_p)`. **`e * eta_p == kExp` exactly**, proved in rational
arithmetic for (1.28, 0.75) -> 7/32, (1.26, 0.78) -> 13/63, (1.3, 0.72) ->
3/13 and (1.4, 0.82). The test cannot fail for any input at all. The
programme's own rule: a gate that restates the formula validates nothing.

### G2. One module in this package refuses outside the DAK window by name. This one does not.

`separatorSizing.js` exports `DAK_TPR_MIN`, `DAK_TPR_MAX`, `DAK_PPR_MAX` and
refuses by name outside them. `compression.js` calls the same `dakZ` through
its private `zAt` and never checks:

| state | Tpr | Ppr | `compressionStage` returns | `separatorSizing` would |
| --- | --- | --- | --- | --- |
| 1000 psia, -150 F, sg 0.65 | **0.848** | 1.492 | `z1: 0.22349360002287877`, no error, `gasHp: 180.88` | refuse: "below the DAK validity range of 1.0 to 3.0" |
| 24000 psia, 100 F, sg 0.65 | 1.532 | **35.814** | `z1: 2.864603158649205`, no error, `gasHp: 1790.90` | refuse: "above the DAK validity limit of 30" |

`dakZ` reports `converged: true` in both, so reading the convergence flag
catches neither. **Two modules, two philosophies, one package**, the same
shape FC2 recorded between `chokePerformance` and `pipeSchedule`.

### G3. `viscosityCorrection` returns a sentinel dressed as a value, and changes its return shape between branches

On the water branch (`viscosityCSt <= 1`) it returns `B: 0`. The correlating
parameter at 1 cSt for the swept case is **0.3168144585671778**, not zero.
Separately, the water branch and the `B <= 1` branch **omit `correctedQGpm`
and `correctedHeadFt` entirely**, so a caller reading `r.correctedQGpm` gets
`undefined` on exactly the cases where the answer is "the catalogue values,
unchanged".

### G4. Nothing reports convergence or conditioning

`dutyPoint` runs 200 bisections and returns the midpoint whatever happened.
`fitPumpCurve` reports `rSquared`, which measures the fit and not the solve.
Neither carries a flag. They do converge everywhere the oracle looked, which
is what makes the absence easy to miss.

### G5. The module warns about a curve it does not carry

`operatingRegion`'s note above 120 percent of BEP says "NPSH required climbs
steeply here, so check the suction margin again at this duty". But `npshrFt`
is a **scalar input** to `npshCheck`: there is no NPSHr-against-flow curve
anywhere in the module, so a reader who follows that advice re-checks against
the same number. A real seam between two of the module's own returns, and good
teaching material rather than a repair.

### G6. `combineParallel` and `combineSeries` accept a fractional machine

`combineParallel({ pump, n: 2.5 })` returns a curve, and
`headAt(1000) = 504.28723404255305`. The guard is `n >= 1`, not an integer
check.

### G7. The module header misstates its own margin rule

`pumps.js` says "the customary rule is the larger of 3 ft and 1.35 times
NPSHr". The code is `Math.max(3, 0.35 * npshrFt)`. **The code is right**, the
customary rule is `NPSHa >= 1.35 NPSHr`, a MARGIN of 0.35 NPSHr, and the UI
and the STATUS document both say 35 percent. The header describes a ratio rule
as if it were a margin rule, and a reader trusting it would demand nearly four
times the margin the engine applies.

### G8. `fitPumpCurve` reports `rSquared: 1` for a fit that explains nothing

Three identical heads give `sst = 0`, the ternary returns 1, and the
horizontal "curve" is reported as a perfect fit. The droop warning does fire
(`c2 = 0` is not `< 0`), so the caller is told something; the R squared beside
it says the opposite.

---

## S. THE SUITE. Four findings, and the first is on screen today.

Unlike FC2, there is no Suite composition layer: both shims are two-line
`export *` re-exports. The composition lives in the two React contexts, and so
do these.

### S1. The Pump studio shows TWO different answers for the same change, on one screen, and they are far apart. LIVE

`PumpStudioContext.configured` scales the whole pump CURVE (speed, trim and
multiples) and `dutyPoint` re-intersects it with the system. That feeds the
chart, the duty flow and the duty head. Meanwhile `NpshResults` renders
`changeEffect`, which is the ENGINE's `impellerTrim` and `speedChange` applied
to the **untrimmed** duty point, under the heading "What a change would buy".

On the app's own default inputs:

**CORRECTION, 2026-09-16, measured against the shipped code during the FC3-0
repair.** The second column below was originally recorded as the engine law
applied to the UNTRIMMED duty. That is not what the shipped context does.
`changeEffect` passes `duty.qGpm`, and `duty` is already the duty of the
TRIMMED curve, so the change is applied to the curve and then applied a
second time to the point that curve produced. The card is therefore further
out, and out in the other direction, than this file first said.

| trim ratio | the chart and the duty headline | the card, AS SHIPPED | the card if it used the untrimmed duty (what this file first recorded) |
| --- | --- | --- | --- |
| 0.95 | 1400.691 gpm at 324.394 ft | 1330.657 gpm at 292.766 ft | 1433.423 gpm at 318.015 ft |
| 0.90 | 1267.314 gpm at 292.763 ft | 1123.474 gpm at 230.024 ft | 1337.610 gpm at 276.858 ft |
| 0.85 | 1129.118 gpm at 263.325 ft | 930.958 gpm at 178.837 ft | 1244.060 gpm at 239.313 ft |
| **0.80** | **983.850 gpm at 236.041 ft** | **751.661 gpm at 137.470 ft** | 1152.774 gpm at 205.221 ft |
| 0.75 | 827.554 gpm at 210.875 ft | 583.426 gpm at 104.383 ft | 1063.751 gpm at 174.424 ft |

At a 20 percent trim the two figures in the app are **23.6 percent apart in
flow and 41.8 percent apart in head**, the card reading low. The speed case
does it too and there the card reads high: at a ratio of 1.2 the chart says
1922.922 gpm at 478.678 ft and the card says **2307.507 gpm at 689.297 ft**
(1810.639 gpm at 507.415 ft is again the single-application figure).

The cheapest proof that the card is not on any curve the app draws: at a trim
of 0.95 the card's point is 1330.657 gpm at 292.766 ft, and the configured
pump curve makes **337.587 ft** at that flow. At 0.80 the card says 137.470 ft
where the curve makes **261.992 ft**.

**The card is the wrong one, and the reason is the course's own thesis.**
Applying an affinity law to a duty point does not give a new duty point,
because the system curve did not move: the machine changed and the piping did
not, so the answer is a fresh intersection. The disagreement is visible even
at a 5 percent trim where the shortfall is exactly zero (1400.691 against
1433.423), which is the proof that the gap is the missing re-intersection and
not the shortfall model.

**REPAIRED 2026-09-16, Suite branch `fix/fc3-0-rotating-studio-defects`.**
The judgement: both paths answer real questions and the defect was presenting
them as one answer, so neither was deleted. `changeEffect` now works from the
duty BEFORE the change (a new `baseDuty`, the same machine count and the same
system with no speed or trim applied) and returns three things under separate
labels: `before`, `after` (the fresh crossing, which is the duty headline and
the chart marker), and `onCurve` (where the old duty point lands on the
changed curve, which sits on the pump curve and not on the system curve). The
card's headline figures are now the crossing. `onCurve` is exactly the
third column of the table above, which is to say the quantity this file
originally described is the one that was missing and is now shown, labelled.

### S2. The context's own trim law does not match the engine's

| | engine `impellerTrim` | `PumpStudioContext.configured` |
| --- | --- | --- |
| where the shortfall starts | `trimPct <= 5` | `diameterRatio < 0.95` |
| applied to head | `1 - shortfall` | `1 - shortfall` |
| applied to flow | `1 - shortfall / 2` | **nothing** |
| applied to power | nothing (ideal cube) | not computed |

Two implementations of one unsourced model, in one app, disagreeing on the
flow leg.

**REPAIRED 2026-09-16.** The context no longer states the law at all. It asks
`impellerTrim` and `speedChange` what they do to a duty of 1 gpm at 1 ft at
1 bhp and scales the curve by the answer. Both laws are homogeneous of degree
one in the duty, so the factors ARE the law, the curve and the point cannot
disagree by construction, and an engine repair to the shortfall model carries
through to the curve with no second edit. The flow leg is now applied, which
is what moves duty numbers (see the repair-wave section at the end).

### S3. Every unguarded engine input in section B is reachable by typing

Both contexts parse field values and pass them through. The live ones are
`Motor eff` (P3), `Speed ratio` (P4), `Max ratio per stage` (C6),
`Polytropic efficiency` (C7), `Max discharge (F)` and `Intercool to (F)` (C1,
C2), `Suction temp (F)` (C4), `Heat rate (Btu/hp-hr)` (C3) and the four pump
curve points (P2). The two suction head terms are defaulted to 0 by the
context, which is why P1 is not live.

**REPAIRED 2026-09-16, at the door in both contexts, since the engine could
not be touched in this wave.** Pump: the motor efficiency is bounded to
(0, 1] with the shaft power still computed and only the motor figures refused
by name, because the shaft side never depended on it; a trim ratio above 1
carries the engine's own refusal; a speed ratio outside 0.5 to 1.5 is NAMED as
an extrapolation rather than refused, because it is computable; a fitted curve
that does not droop no longer yields a duty point (P2, and G8's flat curve
with its rSquared of 1 falls under the same check). Compressor: the gas rate,
both pressures, the gravity, k, both efficiencies, the ratio limit, the two
temperature limits and the heat capacity are all checked before the engine
sees them, each refusal naming the box that was typed in; the heat rate is
refused below 2544.43 Btu/hp-hr (C3). Every refusal is a named refusal and
none returns a NaN.

### S4. Neither studio has a numeric gate

`PumpStudio.smoke.test.jsx` and `CompressorStudio.smoke.test.jsx` mount the
pages and assert that headings and prose are present. **Neither asserts a
single number**, and there is no other test of either app. Nothing in the
Suite would have caught S1.

---

## Ranked for a repair wave (FC3-0), if the lead wants one

1. **C1 and C2 together.** A train that silently exceeds the temperature limit
   it says it was staged against is the worst thing here, it is reachable from
   the app's default state, and the warning that should have caught it is
   measured against the wrong number. One fix: stage on the temperature the
   stages will actually see, and warn against `maxDischargeF`.
2. **S1.** Two answers on one screen, 17 percent apart, and the wrong one is
   the one with the explanatory paragraph under it.
3. **C6 and C7**, the two refusals that name the wrong cause. Cheap, and they
   send users to fix inputs that are correct.
4. **F1**, one gas constant for the package.
5. **C3, C4, P2, P3, P4**, the remaining fails-open, as one input-guard pass.
6. **All of section B**, as the same pass: a refusal must be a named refusal,
   never a NaN.
7. **G1**, replace the tautological gate with a check that can fail.

**Everything in A, B and S would move a number somewhere. Nothing here is
fixed in this phase, and the digest and the goldens are built on the engines
as they stand at `709172f`.**

---

## FC3-0. THE SUITE HALF, REPAIRED 2026-09-16

Suite PR: https://github.com/Petrolord/petrolord-suite/pull/491

Branch `fix/fc3-0-rotating-studio-defects` off Suite main `dde23115a`, in a
fresh worktree. **S1, S2, S3 and S4 are all repaired. Nothing in sections A
to E is touched**: `packages/engines` is untouched and `engines/facilities/
pumps.js` and `compression.js` are being repaired separately in the engines
repo. Four of the nine LIVE findings (C1, C2, C3 partly, C4, C6, C7) are
defended from the Suite side where the defence does not need the engine, and
each such guard says in its own comment that it is a door check and not the
repair.

Files: `src/contexts/PumpStudioContext.jsx`,
`src/components/pumpstudio/PumpPanels.jsx`,
`src/contexts/CompressorStudioContext.jsx`,
`src/components/compressorstudio/CompressorPanels.jsx`, two new gate files
under `src/contexts/__tests__/`, and both `docs/scope/*-STATUS.md`.

### What moves, measured before anything was changed

Control set declared first: 3 systems (the app default, one friction
dominated, one static dominated) x 2 pump curves (the catalogue default and a
flatter machine) x 9 trim ratios (1.00 down to 0.70) x 3 speed ratios x 1 and
2 machines in parallel = **324 combinations**.

- **168 of 324 duty points move, every one of them DOWN**, because the trim's
  flow shortfall is now applied and was not before. Worst move **4.43 percent
  in flow** (static-dominated system, 30 percent trim at a 1.2 speed ratio),
  median **0.53 percent**, smallest **0.037 percent**.
- **Nothing at all moves at a trim of 5 percent or shallower**, which is the
  whole of the default state and every speed-only change. The app's own
  defaults produce an identical duty, power, region and NPSH verdict.
- **3 of 324 operating-region bands flip**, all `preferred` to
  `allowable, low`, all within 1.5 points of the 70 percent boundary.
- The changes card moves at every non-unit ratio, by the gap in the corrected
  S1 table above.

### The judgement on S1, for the record

Two paths existed because they answer two different questions, and the app
presented them as one answer. The crossing is the operating point and the
affinity map is not, but the affinity map is not junk either: it is where the
old duty point lands on the new curve, and after the repair it lies exactly on
the curve the chart draws, which is now gated. **Users have been sizing on the
duty headline, the chart marker and the summary rail, and those were always
right.** The card was wrong and was wrong by a double application, not by the
missing re-intersection alone.

### Gates

`src/contexts/__tests__/pumpStudioContext.test.jsx` and
`compressorStudioContext.test.jsx`. The S1 gate asserts the card's point lies
on the configured curve and that the card's operating point IS the duty; it
fails against the shipped code at every ratio, including a 5 percent trim
where the shortfall is exactly zero. Both smoke tests stayed green unchanged.

---

## FC3-0. THE ENGINES HALF, REPAIRED 2026-09-16

Engines PR: https://github.com/Petrolord/petrolord-engines/pull/197

Branch `fix/fc3-0-rotating`, rebased onto engines main `fa53f7f` (past
`da9693b`, which this branch was cut from, so PR #195's FC1 near-floor K flag
is under it). Four commits: `5ff2f9a` (the derived power packagings in
`lib/units/fieldUnits.js`), `f308385` (compression), `a5b31e5` (pumps),
`485246d` (`tools/validation/facilities/FINDINGS-rotating.md`).

**Repaired: C1, C2, C3, C4, C6, C7, P1, P2, P3, P4, P5, all eighteen rows of
section B, F1, F2, F3, F4, F5, F8, G1, G2, G3, G4, G5, G6, G7, G8.** Nothing in
section A, B or E is left open.

**Deliberately not changed:** F6 and F7 were positive results, not defects. The
eight items in section D are held for literature and taught as limits: in
particular the trim's power leg stays the ideal cube, because the shortfall
model has no publication here and de-rating the power would be a second
unsourced model on top of the first. What the trim returns now is
`impliedEfficiencyRatio`, the quantity a reader used to have to discover by
division.

### Two things this file said that the repair found were not quite so

1. **C6's negative case.** Already corrected in place above: `maxRatioPerStage:
   -4` does not return `stages: NaN`, it THROWS out of `compressorTrain`'s
   return statement. Both are refused now and the throw is gated.
2. **C7's fourth row.** `maxDischargeF: -100` is above absolute zero, so the
   honest diagnosis is not "a limit below absolute zero" but a limit below the
   suction temperature. The refusal says that, with both temperatures in it.
   `-600` gets the absolute-zero sentence.

### Movement

**Engine goldens: nine of 63 compression fields moved, and the ten published
pump cases did not move at all.** Every moved field is one of exactly two named
constant ratios or their product: `headPolyFtLbfLbm` x 1.0000009059442236 (F1,
the gas constant), `massLbHr` x 1.0000169391883849 (F3, the standard base),
`gasHp` x 1.0000178451479544. `tDischargeF`, `zAvg`, `ratio` and every staging
field are bit for bit unchanged. Both golden files regenerate byte for byte
from their own oracles.

**Graded capstone fields: four of the 18 in `fields.json` moved**, and the same
three constants account for all four:

| field | ratio | cause |
| --- | --- | --- |
| `escravos_motor_input_kw` | 0.9999998277890173 | F4, 0.7457 |
| `bonny_stage1_poly_head` | 1.0000009059442239 | F1 |
| `bonny_stage1_gas_hp` | 1.0000178451479547 | F1 x F3 |
| `bonny_fuel_mmscfd` | 1.0000178451479544 | F1 x F3 |

The other fourteen are byte identical, and `fields.json` in this directory
already holds the REPAIRED values.

**THE COURSE BRANCH DOES NOT.**
`/root/wt-fc3-nextgen/tools/course-waves/rotating/fields.json` still holds the
four pre-repair values, and all four move by more than their own stated
tolerance, so four capstone answers would be graded against numbers the engine
no longer produces. **It must be re-seeded from the repaired engine before FC3
goes live.**

### A trap in regenerating it

`fc3_capstone.mjs` writes `fields.json` only on a successful run and leaves the
old file in place on a crash, so a control run against a different engine tree
that fails to import will look byte identical. It needs a `package.json` with
`"type": "module"` beside any extracted engine tree, and the exit status has to
be checked. The first control run of this wave failed exactly that way and
briefly reported "byte identical" for a run that never happened.

### Two constants that are still roundings, one level up

`gasProperties.R_UNIVERSAL = 10.7316` is 2.135e-6 above the 2019 SI derivation,
and the private 1545.349 this wave deleted was marginally CLOSER to it (1.229e-6).
Consistency was chosen over proximity: a second opinion held privately by one
module is the defect whatever its sign, and the owner's value is what the gas
engines, the separator sizing and the shipped courses all grade against. That
is why the stage-block gap against the independent quadrature grew from
1.229e-6 to a flat 2.135e-6 on all eight stages, and why re-scaling the same
quadrature onto the package's own constant still closes it to 7e-16. Moving
`gasProperties.R_UNIVERSAL` onto the SI derivation is a package-wide decision
that would move every gas course, and it is not this wave's to take.


---

## FC3 FOUNDATION REBUILD, 2026-09-16. What rebuilding the digest found.

The engines were re-vendored at `4fa37e6` (twelve paths, all sha-identical with
a pristine `git archive` and with the git blob shas), `fields.json` was
regenerated, and `digest.txt` was rebuilt: **660 to 809 lines, 149 added, 216
changed, 0 removed, across 77 blocks.** Byte-identical across five timezones
and across repeat runs, with a negative control (a planted
`getTimezoneOffset()` line) proving the reproducibility check can fail.

### Graded fields: four of eighteen moved, and nothing else did

The tolerances in `fields.json` are ABSOLUTE in each field's own units (the
FC1 leak-guard code says so in as many words, and the rodpump capstone guard
gates it). On that reading **all four moved fields exceed their own stated
tolerance**, by 17.9x, 3.2x, 2995x and 17045x. A relative reading would have
said only two exceeded, and it would have been wrong; the reading was checked
against `separationLab.js` and `panelCapstoneGuard.test.js` rather than
assumed.

| field | old | new | absolute move | tol | move/tol | named cause |
| --- | --- | --- | --- | --- | --- | --- |
| `escravos_motor_input_kw` | 103.76581046865581 | 103.76579259904362 | 1.78696e-5 kW | 1e-6 | 17.9 | F4, `KW_PER_HP`: 0.7457 -> the derived 0.7456998715822702 |
| `bonny_stage1_poly_head` | 35027.48016377518 | 35027.51189671851 | 3.17329e-2 ft lbf/lbm | 1e-2 | 3.2 | F1, the gas constant: 1545.349 -> `R_UNIVERSAL * 144` |
| `bonny_stage1_gas_hp` | 1678.2891686175976 | 1678.3191179361222 | 2.99493e-2 hp | 1e-5 | 2995 | F1 x F3 |
| `bonny_fuel_mmscfd` | 0.9551730234380579 | 0.9551900686419833 | 1.70452e-5 MMscfd | 1e-9 | 17045 | F1 x F3, through `brakeHp` |

The other **fourteen are bit for bit**. Each cause was RECOVERED FROM THE
ENGINE rather than typed: `KW_PER_HP` as `motorInputKw / motorInputHp`,
`BTU_PER_HP_HR` as `heatRate * thermalEfficiencyPct / 100` and again by
bisecting the first-law refusal boundary, `LBMOL_SCF` out of `massLbHr`, and
the gas constant out of `headPolyFtLbfLbm`. Measured ratios: head
x1.0000009059442234, mass x1.0000169391883849, gas hp x1.000017845147954,
`KW_PER_HP` x0.9999998277890172. `zAvg` and `tDischargeF` are bit for bit at
the stage level, which is why `bonny_stage1_discharge_f` did not move.

**Nothing moved that these four constants do not explain**, so there is no
finding here beyond the four.

### The generator trap, closed

`fc3_capstone.mjs` writes only on success and used to leave the old file in
place on a crash, which briefly reported "byte identical" for a run that never
happened. Three things now close it: the target is DELETED before every run and
its absence afterwards is a failure; the generator prints its engines root and
the sha256 of the payload it wrote; and the output path is overridable with
`FC3_FIELDS_OUT` so a control run cannot clobber the real file. **Negative
control: pointed at a non-existent engines tree the run exits 1 and the file is
absent, so a crash cannot masquerade as agreement.** The pre-repair engine run
reproduces the committed `fields.json` and the committed `digest.txt` BYTE FOR
BYTE, which is the proof in the other direction that a byte-identical result
means something here.

### Five defects in the foundation digest that the rebuild caught

These were shipped at `dd9148bf` and are the reason the two-figure sweep is a
standing rule.

1. **A ratio off by a factor of ten, in prose.** Section 16 said the published
   power and NPSH goldens "agree only to a few parts in a thousand". The
   quotient columns beneath it print 0.999553114, 1.000395783 and 1.000525448,
   which are parts in TEN thousand. This is the sixth instance of the same
   defect class on this programme. Fixed by computing the worst quotient and
   the worst absolute disagreement and printing both.
2. **A branch count the fixtures could not deliver.** Section 14 said four
   duties were "chosen to land in all four of its branches"; the fourth duty,
   labelled "the duty where both machines are viable", had an overall ratio of
   10.7 at 3090 acfm, which is the RECIPROCATING branch. Two branches were
   reached, not four. Fixed in `fc3_fields.mjs` with a duty that fails all
   three tests above `either` (67 MMscfd at 92 psia, ratio 3.0, 7962.7 acfm),
   and the digest now COUNTS the distinct reasons it reached and prints the
   count.
3. **A monotonic claim its own table contradicts.** "Colder suction means less
   work and more heat to take out" holds across the five approach rows that
   share a stage count and REVERSES on the two that do not: at a 150 degF
   approach the cooling goes back up from 8.1149 to 8.6374 MMBtu/hr while the
   gas power goes down from 4453.3383 to 4447.6481 hp. The repair made this
   visible by letting the stage count move with the approach. Fixed by putting
   the stage count in the table and computing where the trade holds.
4. **A probe label that named the wrong input.** "a machine screen with no
   rate" returned a message about the gas gravity, because the probe passed
   neither. Split into two probes, one per cause.
5. **A probe label that named the wrong physics.** "a discharge limit below
   absolute zero" at -100 degF: -100 degF is above absolute zero, and the
   honest diagnosis is a limit below the suction temperature. Already corrected
   in the engines' own FINDINGS; corrected here in the fixture label too.

### Eleven defects the REBUILD itself introduced, caught before it shipped

Every one was found by re-reading the rebuilt digest end to end and sweeping
every two-figure comparison as guilty until it printed its own comparison.

| # | defect | how it was fixed |
| --- | --- | --- |
| R1 | "the same place 200 blind halvings arrived at" characterised a relationship to an engine no longer present | 200 blind halvings are now RUN in the dump and the difference printed (it is 0) |
| R2 | "the two readings are far apart" compared a margin rule to a ratio rule with no computed comparison | the boundary ratio is computed at four required NPSHs; where the fraction binds it is 1.35 on every row and where the floor binds it is 1.75, and the difference is printed |
| R3 | "NOT ONE OF THEM IS BIT FOR BIT" while its own table showed two that were | the count is now computed and the field names printed |
| R4 | a table of "engine equals golden" listed `ratio`, which `compressionStage` does not return, so it reported `false`: a FALSE FINDING manufactured by the digest itself | the output keys are read off the golden file with the stated inputs excluded |
| R5 | "three different stated limits" above a four-row table | corrected to four |
| R6 | the twelve-stage-cap refusal printed `undefined` for all four evidence fields, because the input it used is now caught by an earlier guard | a real cap case was added (`STAGE_CAP_DUTY`, limit above the suction, overall ratio 1000) and it reaches the cap |
| R7 | two refusal probes read "no error" because `undefined` fell through to a default parameter | changed to `NaN`, which is what an unreadable input actually looks like |
| R8 | "across every point set this digest fits" over a list of five of the seven | all seven are now collected and the range is derived from them |
| R9 | the trim slack was called "far below any trim anyone can machine" with no figure | the slack is bisected out of the engine and printed |
| R10 | `e6(200)` and `e6(35)` printed a count and a percentage to six decimals, against the digest's own header rule | printed as a count, and the percentage replaced by the measured fraction |
| R11 | "a factor of two either way is far beyond any drive turndown" compared the band to an unstated figure | reworded to say what the band IS, a judgement about when to make a reader think |

### Two things the rebuild added because the repair made them teachable

- **A gate that CAN fail, beside one that cannot.** Digest Section 3 now runs
  `dutyPoint` against a curve that returns a non-finite head between 900 and
  1400 gpm. The solve returns 900 gpm, which is 334.452969 gpm from the real
  crossing, on a bracket of 1.14e-13 gpm with a residual of 154.78 ft. **A flag
  made only of that bracket would have called it converged.** The engine's flag
  says false. That is the G1 lesson, run rather than described.
- **What a golden's agreement is worth.** Two of five published stage output
  fields come back bit for bit and three do not, by up to 1.5e-11, because the
  file is a fifty-digit Python oracle and the engine is double precision.
  Section 16 computes it and teaches the tolerance question.

### Capstone generator, strengthened

`fc3_capstone.mjs` now asserts `droops`, `converged` on all three duty solves,
a finite `rSquared`, and that the graded speed change carries no
extrapolation warning. **`fields.json` is byte identical before and after those
assertions**, proven by deleting the target and re-running. Negative control: a
capstone pointed at a rising point set exits 1 and writes nothing. The two
comments claiming the engine does not check the discharge limit or the DAK
window were corrected, because at `4fa37e6` it checks both; the assertions stay
as second opinions on the CASE rather than on the engine.

### Gates run on the rebuilt foundation

| gate | result | negative control |
| --- | --- | --- |
| vendored suites `facilities.pumps` + `facilities.compression` | **68 green** (36 at `709172f`) | n/a |
| whole vendored `facilities` suite | **159 green across 5 files** | n/a |
| digestrepro, 5 timezones + a repeat | byte identical, sha `33ca3e33...` before the Section 3 addition | a planted `getTimezoneOffset()` line makes UTC and Auckland differ: **caught** |
| digestleak, 18 graded fields x 3 scalings against 1751 literals | **0 of 54** | two answers planted into the text: **2 hits, caught** |
| promptleak, the three capstone machine names | **none in the digest** | n/a |
| capstone isolation | `fc3_dump.mjs` does not mention `fc3_fields_capstone` | n/a |
| capstone anti-trap protocol | file absent after a failed run | pointed at a missing engines tree: exits 1, writes nothing: **caught** |
| capstone droop assertion | passes on the real case | fed a rising point set: exits 1, writes nothing: **caught** |
| `dutyPoint.converged` | `true` on every real solve | non-finite head inside the bracket: `false` with a 154.78 ft residual, where a bracket-only flag would have said `true`: **caught** |


---

## THE HEADING SWEEP, 2026-09-16. Six more, and the sweep that was missing.

The two-figure sweep above covered PROSE. It did not cover HEADINGS, and a
section title survived it reading **"the limit it can break"** over a table
whose seventh column is the stated limit less the hottest stage and which
records **0 stages over the limit on every row**, with the prose beneath saying
so in as many words. The body had been re-cut and the heading above it had not.

**That is the commonest shape of the defect this programme keeps paying for**,
and it is the same one FC2 hit twice: once where a writer fixed a paragraph and
left the section heading contradicting it, and once where fixing `structure.py`
and regenerating a manifest did not propagate into the lesson text. Headings
need a sweep of their own, because a heading is read first and is the thing a
writer builds a module on.

Six found, all fixed at the generator as **one-line-for-one-line replacements**
so no line number moved: **809 to 809 lines, 0 added, 6 changed, 0 removed,
across 6 blocks**, at lines 201, 272, 485, 553, 713 and 720.

| line | heading | why it failed | now |
| --- | --- | --- | --- |
| 553 | `# SECTION 13: The train, its cooling, and the limit it can break` | names a behaviour the repair removed and the section's own table refutes | `...and the limit that buys the stages`, matching `structure.py` and `wave.json`, which were already re-cut |
| 272 | `# SECTION 7: The margin, and what a check does not check` | what the check did not check was an available head it could not read; it now refuses that, so the body says the opposite of the title | `# SECTION 7: The margin, and the rule it is judged against` |
| 201 | `THE CONSTANTS. pumps.js exports no constants and names none internally: every packaging is written inline at its point of use.` | true at `709172f`, false at `4fa37e6`: `pumps.js` names `PCT_SLACK`, `SPEED_RATIO_MIN` and `SPEED_RATIO_MAX` and imports `KW_PER_HP` | names the three, says all three are measured out of the engine in Section 8, and says a packaging is inline or imported |
| 485 | `A COMPARISON THAT CANNOT COME OUT FALSE IS NOT A CHECK. The engine's gate used to call...` | the principle is teaching truth, the framing was repair-history | re-pointed at what the identity table beneath it shows |
| 713 | `FOUR FAULTS THAT USED TO SHARE ONE SENTENCE` | repair-history framing, and its "not one of the four is about the temperature" was loose: two of the four ARE temperature faults | `FOUR FAULTS, FOUR REFUSALS, and each names the input that is actually wrong rather than the one a reader would check first` |
| 720 | `AND THE ONE THAT USED TO REACH THE NEXT FUNCTION BEFORE IT FAILED` | same class | `AND THE SAME FAULT ASKED THROUGH BOTH FUNCTIONS, SO THE MESSAGE CANNOT DRIFT BETWEEN THEM` |

Lines 485, 713 and 720 were found by the gate below rather than by eye, after
the first three had been fixed by hand.

### Two more outside the digest, same class

- **`structure.py`** carried Professional m02 as *The Margin, and What a Check
  Does Not Check* with the slug to match. Retitled to
  *The Margin, and the Rule It Is Judged Against*, slug
  `m02-the-margin-and-the-rule-it-is-judged-against`. Free to change now,
  because no lesson is written against it yet; after the writers start it would
  not be.
- **`wave.json`**'s Professional m02 said the module would teach *"why NPSHr is
  itself measured at a three percent head drop"*. **Nothing in this repository
  carries that** and the digest does not compute it, so a writer taking the
  plan at its word would have written an unsourced number into a live course.
  **Struck rather than held**, and the plan now says why: a held item is one the
  engine uses, and this is one the engine has never heard of.

### The gate, and the gate's own founding failure

`digest_headings.mjs` sweeps all 17 section titles and all 22 in-body ALL-CAPS
markers against the block beneath each, and exits 1 on a hit. It passes clean
on the rebuilt digest and **flags all six on the pre-fix one**, which is its
negative control.

**Its first version missed the very defect it was written for.** It gave a
section title the same short block as an in-body marker, so Section 13's block
stopped at `NOW MOVE THE INTERCOOLER APPROACH` and never reached the table that
refutes the title. A section title now owns everything down to the next
section. Recorded because a gate that cannot catch its own founding case is
precisely the thing it was built to stop, and the first run of it looked green
on five of six.

### Battery re-run after the heading fixes

Digest byte-identical across six timezones and a repeat; digestleak 0 of 54
from 1751 literals with two planted answers caught; promptleak none; the wave
oracle 446 comparisons across 14 blocks with 65 of 65 refusal branches as
expected, 0 silent, and both negative controls caught at 9.901e-3 and 1.750e-4;
`fields.json` byte identical; `structure.py` gate green.


---

## THE PROSE SWEEP, 2026-09-16. A third class, and a correction to the split.

The Associate writer, writing against the digest, found a sentence in it that
the digest's own banners forbid. Two sweeps had already run over this file, for
two-figure characterisations and then for headings; **repair-history framing
inside a teaching section is a third class**, and it had already produced hits
twice without being named as a class: three in-body markers in the heading pass,
and now one deeper inside a block.

**809 lines examined**, every line of the digest, three times: once for the
"used to" family, once for plain past-tense narrative, and once for the owner
copy rule. **Eight lines changed, 0 added, 0 removed**, all one-for-one at the
generator: **809 to 809 lines, all 17 section start lines unchanged, all 257
table rows byte identical, and the numeric-literal multiset identical at 1752**,
so no figure moved anywhere and the Associate tier's committed sweep of 373
literals across Sections 1 to 5, 16 and 17 still resolves.

### A. Repair history inside a teaching section. Four, of which the writer found one.

`digest.txt` is the ONE file writers are told is teaching truth. RECON.md and
FINDINGS.md both open with a banner saying they are provenance; **the digest
has no such licence, so a "used to" sentence is worse there than anywhere
else.** The writer refused line 174 and taught the droop flag with no
before-and-after, which was right.

| line | section | was | now |
| --- | --- | --- | --- |
| 174 | 3, Associate m03 | "they used to disagree about the same curve, and the trusting half was the bug" | the flag is how the half that judges the shape tells the half that solves on it, and the half that trusts is the one to doubt |
| 551 | 12, Expert m02 | "That sentence used to be the answer to four unrelated faults as well as this one" | Section 15 puts four other faults that reach this same function beside the refusal that names each |
| 671 | 15, Expert m05 | "on the inputs that used to come back as a number instead" | "on the inputs where handing back a number rather than a refusal would be the dangerous answer" |
| 683 | 15, Expert m05 | "That one WAS the sharpest of the set: the object looked healthy, the coefficient was right, and the failure only appeared when the curve was called" | a curve object CAN look healthy and carry a correct coefficient while the function hanging off it is unusable, so the guard catches at construction what would otherwise surface only at the call |

**683 is the interesting one.** It is repair history told in plain past tense
with no trigger word, so no keyword sweep finds it; it came out of a manual
past-tense pass. That hole is now named in the gate and covered by a WARN
family rather than pretended away.

Four lines matched the history patterns and were checked and CLEARED: "never
used to refuse" (present-tense usage), "the old duty point" (the pre-change
duty, a live concept), "no longer affordable" (a live sweep), and "the golden
was written through SI watts" (the provenance of a file, which is a live
property of that file).

### B. The owner copy rule, and a correction to which lines are ours

Four lines of this file's own prose: **180, 331, 467, 475**, each a `", not "`
contrastive, each rewritten to `rather than`. No em dash or en dash anywhere in
the digest.

**The coordinator's split listed 441 among the five for FC3 to fix. It is not
ours.** `digest.txt:441` is `pumps.js:572` quoted verbatim, the viscosity
warning ending "vendor viscous test data, not a corrected centrifugal curve".
It belongs with 465 and 470 to 472, which are `compression.js:420`, the
hot-stage warning ending "become the limit, not the thermodynamics". The
deferred set is therefore **five lines across two engine modules, not four
across one**, and it was not edited here.

### DEFERRED ENGINES ITEM. Do not fix these locally.

**`digest.txt` lines 441, 465, 470, 471 and 472 break the owner copy rule
inside text the engine itself returns.** Both strings are user-facing in the
live Suite panels, so the rule arguably does reach them. They are **not** being
changed now, and the reason is recorded so nobody "helpfully" fixes them:

- changing one churns the engine, its tests, this digest, and any lesson
  quoting it verbatim, with two writers mid-flight;
- **Section 15 exists precisely to quote refusal messages EXACTLY**, so an
  edit here desyncs the quote from the engine it is quoting;
- it is programme-wide rather than FC3's: the same contrastive shape is likely
  in other engine modules' messages.

**It becomes an engines-repo copy sweep after FC3's writers land.** The two
sources are `engines/facilities/pumps.js:572` and
`engines/facilities/compression.js:420`.

`digest_prose.mjs` **pins both fragments** and fails if either leaves its
module, so an engine edit turns the gate red rather than leaving a stale quote
passing quietly. Negative control run: a copy of `pumps.js` with the phrase
reworded makes the gate report the broken pin.

### C. structure.py's title gate had a hole

It asserted on `chr(0x2014)` and `'--'` and not on the **en dash U+2013**,
while `gate_copy_rule.py` checks both. Nothing had shipped through the gap, so
this closes a hole rather than fixing a defect. Negative control: an en dash
planted in a lesson title now exits 1 with the character and the title in the
message.

### The gate, consolidated

`digest_headings.mjs` is **retired** and replaced by `digest_prose.mjs`, which
covers all three families in one file, because two half-gates that must both be
run is a trap and a gate whose name no longer matches its scope is its own
small defect. It reports:

- headings against the block beneath each, a section title owning everything
  down to the next section;
- repair history, failed;
- past-tense narrative, **WARNED for a human read**, because the keyword net
  has a known hole and pretending otherwise is how line 683 survived;
- the owner copy rule, failed for our prose and **deferred** for pinned engine
  quotes.

| run | result |
| --- | --- |
| the rebuilt digest | **0 failing, 0 warned**, 5 deferred |
| the digest before these eight edits | **7 failing, 1 warned** (the warn is line 683, the hole it was written for) |
| the shipped foundation digest `dd9148bf` | 3 failing, 4 deferred |
| `pumps.js` with the pinned phrase reworded | the broken pin reported by name |


---

## THE RESOLVER, AND WHAT THE PROSE SWEEP BROKE DOWNSTREAM. 2026-09-16.

### A gate that was measuring nothing: truth-rotating.json

**The wave directory shipped no `truth-rotating.json`.** FC1 and FC2 both ship
one. `numsweep.mjs` builds its resolver from every `truth-*.json` a wave
produced plus the goldens `wave.json` names and the constants it declares, so a
wave that emits a TEXT digest and no JSON resolves against almost nothing. Run
raw against the Professional tier it reported **396 of 412 literals
unresolved**, which measures the RESOLVER and not the lessons. Both writers who
hit it worked around it privately, one harvesting into a scratch copy of the
wave dir (correctly declining to write into the shared one) and one building
its own value set from the digest sections it owns. **Solving it twice in
private is the cost of not shipping it once.**

Harvested with `/root/dc-wavekit/harvest_digest.py`: **432 digest lines
carrying 1606 numeric literals, 799 distinct**, which `numsweep` combines with
the goldens and the declared constants into **864 derived values from 3
sources**. Against all 78 committed lessons:

    rotating: sweeping 78 lesson file(s) against 864 derived values from 3 source(s)
      => literals with 7+ significant figures checked: 859   unresolved: 0

**And the gate can fail, which is the half that matters**, because a resolver
that resolves everything is as useless as one that resolves nothing:

| control | planted | result |
| --- | --- | --- |
| A, a fabricated literal that is no engine value | `1234.5678901` | **UNRESOLVED, exit 1**, named with its file and line |
| B, real engine values of the same length | `1234.452969` and `417.801018` | resolved, exit 0, checked count rises by 2 |

Declared hole, which `numsweep` prints itself: **676 round literals are skipped
for trailing zeros** and never checked. That is the gate's own documented blind
spot, not this wave's.

### What the prose sweep broke, and it was the gates working

The eight one-for-one digest edits went red downstream immediately, which is
the correct behaviour of a well-built gate rather than a problem:

- **`src/components/course/panels/rotating/rotatingLab.test.js`** rebuilds
  `digest.txt` BYTE FOR BYTE from the panel's own computed values and asserts
  equality. It pinned all eight changed lines and went **7 failed / 64 passed**
  the moment the digest moved. The same eight edits were carried into its
  mirror, plus the `SANITY BOUND` clause on the same line: **71 of 71 green**
  again. The lab agent's gate did exactly what it was built to do.

### Three repair-history leaks that had already reached LIVE LESSON TEXT

This is the harm the banners exist to prevent, and it had already happened.
Found by sweeping all 78 committed lessons for the same patterns:

| file | was | why it is wrong |
| --- | --- | --- |
| `advanced/m05-what-a-refusal-is/l01-an-object-carrying-an-error.md` | "the object looked healthy. The coefficient was right and the failure only appeared when the curve was called" | taken in good faith from digest line 683, which is the sentence this sweep re-pointed. Now present tense: a curve object CAN look healthy while the function hanging off it is unusable |
| `advanced/m02-.../l05-a-refusal-that-carries-its-evidence.md` | the H2 heading "One sentence used to answer several questions", and a paragraph "That message once stood in for four unrelated faults" | repair history in a lesson HEADING, the same class as the digest heading defect, one level down. Now "One refusal, and the four faults it is not" |
| `advanced/m01-a-stage-is-not-a-pump/l05-an-identity-is-not-a-check.md` | "The engine's own gate used to call the agreement of those two routes its strongest available check" | NOT from the current digest, which was corrected in the heading pass. It came from the engine's own source comment or an earlier read. Now "It is tempting to read the agreement as a strong check" |

**The writers were not at fault on the first two**: they took what the digest
said, and the digest is the one file they are told is teaching truth. That is
precisely why a forbidden sentence in it is worse than the same sentence in a
provenance file. The third shows a second route for history to reach a lesson:
the engine's own source comments are full of it, and nothing gates a writer
reading those.

After the fixes, a sweep of all 78 lessons for
`used to call|answer|be|come|disagree|return|report|give|stand`, `once stood`,
`looked healthy`, `was the bug`, `before the repair`, `no longer has`,
`the old engine` returns **nothing**.

### Two items recorded and NOT acted on

- **The panel wiring is not landed.** `panelRegistry.js` has no `rotating`
  entry and none of `fc-pump-explorer`, `fc-suction-explorer`,
  `fc-compressor-explorer` appears in it, so **74 `{{panel:}}` markers across
  the three tiers will not render**. That is the lab agent's work and it is
  still running. Recorded here so it is not lost, not touched.
- **Digest Section 6 gap, for whenever it is next rebuilt.** Its two flashing
  rows state a pressure head and an NPSH available but not the static column or
  the suction friction behind them, so they read as a separate suction with no
  stated geometry. A writer correctly refused to infer it. Fixing it costs a
  line and would move Section 6's line numbers, so it waits for a rebuild
  rather than being slipped in while three tiers are pinned to this file.


---

## SHARED SECTIONS, AND A COUNT THAT WAS TWO COUNTS. 2026-09-16.

Four digest lines changed, **809 to 809, 0 added, 0 removed, all 17 section
start lines unchanged, all 257 table rows byte identical**, and `fields.json`
byte identical, so no graded answer moved. The Associate-owned Sections 1 to 5
are literal-for-literal unchanged.

### Sections 16 and 17 were not owned by anybody, and the gate had to guess

`litsweep` builds its tier ranges from each section's `(owned by <Tier> mNN)`
clause. **Section 16 carried none at all** and **Section 17 carried a compound
one**, `(owned by Expert m05, and read again in Associate m06, Professional m06
and Expert m06)`, of which the regex reads only the first name. Both therefore
fell inside the EXPERT range, so any lower tier quoting a published golden or a
held item read as a FORWARD REACH.

**Measured, on the committed corpus:** with the old headings, litsweep reported
`REACHES FORWARD '35' beginner/m06-the-associate-reading/l03-onward.md:21
(digest line 797; beginner owns 8 to 246)`. Line 797 is Section 17's NPSH
margin rule, which the Associate reading legitimately re-reads. And **both FC3
bank writers independently refused every Section 16 and Section 17 numeral for
this reason**, so the Associate and Professional banks teach the published
goldens, the tolerance argument and the held items in prose with no figures.
That is teaching quality paid away to a gate defect.

Both headings now read **`(shared by Associate m06, Professional m06 and Expert
m06)`**.

**The form was chosen to agree with the kit rather than to work around it.**
`litsweep.tier_spans` now carries a shared-section concept whose contract is
**"A SECTION WITH NO OWNER IS SHARED, NOT THE PREVIOUS TIER'S"**, plus the
preamble. `(shared by ...)` carries no `owned by` clause, so the gate reads it
as shared, and a human reads which modules it is shared by. Verified against
the kit's own code, not assumed:

    owned spans  : beginner 8-246, intermediate 247-447, advanced 448-737
    shared ranges: 1-7 (the preamble), 738-787 (Section 16), 788-810 (Section 17)

and the controlled before-and-after on the same corpus, swapping only
`digest.txt`:

| headings | reaching FORWARD | reaching back |
| --- | --- | --- |
| old | **1** (the false one at line 797) | 1 |
| new | **0** | 0 |

The preamble being shared also answers the other half of that report: the
export counts 14 and 8 live before Section 1 and used to class as backward
reaches for every tier. They are in range for everyone now.

### One count that was two, and it is the second time this claim has been wrong

Section 14 said the screen was run "on 4 duties chosen to land in all four of
its branches" with "4 distinct first reasons". Both are TRUE. What was missing
is that **there are only 3 distinct recommendation words**, because two
branches both end on `reciprocating`, and the section's prose asserted that
without computing it.

**A branch is a reason; a recommendation is a machine type.** The section now
prints both counts and says which is which, derived rather than promised: 4
distinct first reasons, one per branch, and 3 distinct recommendations, one
fewer, with the difference itself computed.

**The lab module carried the identical conflation.**
`rotatingLab.js` keyed `branchesHit` on `` `${recommendation}|${reasons[0]}` ``
and labelled the result `distinctFirstReasonsDerived`: a count of PAIRS
reported as a count of reasons. The two coincide at 4 on this fixture set, so
the name was wrong rather than the number, which is exactly how it survived.
Split into `branchesHit` and `machinesHit`, and
`distinctRecommendationsDerived` added.

This is the second time this one claim has been wrong. The first time the
FIXTURE was wrong, reaching two branches while claiming four. This time the
fixture is right and the VOCABULARY was wrong. A sentence that has been wrong
twice in two different ways is a sentence to compute rather than to write.

### wave.json was stale against the digest on the held thresholds

Its `heldItemCheck` item (6) listed "500 and 20000 acfm" where digest Section 14
lists **500 and 5000 and 20000**. The engine has all three: `acfm < 500`,
`acfm > 20000 && ratio < 4`, and `ratio > 6 && acfm < 5000`. The writer taught
the digest's list, which was right. **A plan that lists fewer thresholds than
the engine has is how a writer gets told to teach something the digest does not
carry**, which is precisely what the struck three-percent-head-drop promise
was. Corrected, and the omission named in the plan so it is not re-introduced.

### Still open, and not ours

`litsweep --lessons` exits 1 on **five literals in one committed Associate
lesson**, `beginner/m05-where-the-duty-landed/l03-both-sides-of-every-boundary.md`
lines 33 and 53, which write the band percentages bare as `30, 60, 85 and 130`
where the digest's table prints `60.000000` and `130.000000`. Whole-number
matching correctly refuses `60` against `60.000000`. It is prose in another
agent's committed tier and it is a round-form question rather than a wrong
figure, so it is reported rather than edited: the cheapest fix is for that
lesson to cite the table's own values.


---

## wave.json SWEPT WHOLE, AND A GATE FALSE POSITIVE THAT IS NOT OURS. 2026-09-16.

### The plan still carried the pre-repair audit paragraph

`plan.tiers.advanced` was the second staleness found in this file after the
screening thresholds, so it was swept whole rather than line by line. That one
paragraph carried **seven claims the repair removed**, every one of them
refuted by the digest the writers are told to work from:

| the plan said | the digest says |
| --- | --- |
| "the train can break the very temperature limit it was staged against" | Section 13 prints **0 stages over the limit on every row** of both sweeps |
| "eighteen returns that come back non-finite with no error key" | Section 15 prints a named refusal for each of them |
| "two refusals that name the wrong cause" | Section 15 prints four faults each refused by its own name |
| "a validity window one module in this package enforces and this one does not" | Section 15: this module IMPORTS the window from the module that declares it |
| "two values of one gas constant" | Section 14 computes the two as ONE, difference 2.27e-13 |
| "a gate that compares a value with itself" | Section 11 teaches the distinction between a check that can fail and an identity that cannot |
| Expert m05 as an audit of what the engines accept | Expert m05 is now what a refusal IS |

Re-cut onto what the sections teach now. **This is the same failure mode as the
struck three-percent-head-drop promise**: a plan that outlives the engine it
was written against tells a writer to teach something the digest does not
carry, and a writer who trusts the plan writes it.

`plan.capstones.heldItemCheck` item (7) also still read "the capstone generator
must assert that rather than assume it, **because this module does not check
it**", one clause away from a note added later saying the engine now does. The
stale clause is gone.

`plan.reCut` now opens with a PROVENANCE banner, because it is the one field
whose job is to record what the plan used to say, and five history phrases
legitimately live there. Nothing in it may reach a lesson.

**Re-verified rather than assumed:** 6 modules and 26 lessons a tier against
`structure.py`, 6 x 15 + 42 = 132 questions, 3 capstones x 6 graded fields = the
18 rows `fields.json` carries, 3 panel ids, and every one of the 22 declared
constants checked against the engine. Five of those constants do not appear in
the digest as written, and that is CORRECT rather than stale: `constants` is a
resolver source in its own right, and it carries the engine's exact values
(0.7456998715822702, 379.48357185628737, 62.33766233766234) where the digest
prints them rounded to its stated precision.

### digestprose line 790 is a FALSE POSITIVE, and it is older than the repair

The kit's `digestprose` fails line 790 as `[count-disagrees]`:

    # The three tier readings, Associate m06, Professional m06 and Expert m06,
      assemble the sections above; they introduce no number of their own.

The rule reads "three" from the marker and then takes the largest numbered item
in the block beneath, which is the **eight** held items, and calls the heading
wrong. **They are two unrelated counts.** Three is the number of tier readings;
eight is the number of held items, and the sentence that owns that list says so
correctly two lines later: "Eight things are HELD FOR LITERATURE". The rule
attributes the list to the nearest preceding `#` marker rather than to the
plain-text sentence that actually introduces it.

**It was asked whether the shared-section repair introduced it. It did not.**
It fails identically on the digest before that repair AND on the original
foundation digest at `dd9148bf`, which predates every heading change this wave
made.

**It is not being cleared by rewording**, and the kit's own doctrine is the
reason: "A FRAMING MAY ONLY FAIL IF IT CANNOT BE READ INNOCENTLY... an
ambiguous FAILURE is not [acceptable], because it makes an auditor reword a
TRUE sentence to clear red." Rewording here would delete a correct count to
satisfy a rule that picked the wrong list. Routed to the kit owner with the
mechanism and a suggested fix: prefer a plain-text count sentence inside the
block over the nearest `#` marker, or require the numbered list to begin before
any other count sentence.

Line 331 is a WARN rather than a fail, on "never used to refuse", which the
kit's own benign list already names as reading equally as "is never employed
to". It is correct English about present behaviour and is left alone.

The five copy-rule failures at 441, 465 and 470 to 472 are the verbatim engine
strings this wave already deferred. The kit gate reports `0 engine pin(s)`, so
its deferral is not reaching them; the wave-local gate pins them by fragment
and defers all five correctly. That mechanism is offered to the kit owner.

### A gate caveat that changes how earlier results should be read

`numsweep` accepts anything within 5e-7 relative at any significant-figure
count, so mutating `417.801018` to `417.801019` in a real lesson reports **0
unresolved**. **A numsweep zero says nothing about the last digit of a
nine-figure literal.** FC3's "859 checked / 0 unresolved" is therefore weaker
evidence than it reads, and is worth re-running once the kit compares at the
precision the literal itself carries. Recorded here so no later reader takes
that line at face value.


---

## THE GRADING TOLERANCE DEFECT, AND THREE COUNTS. 2026-09-16.

### A learner who followed the course exactly failed a graded field

**This is the worst thing this programme can ship**, and five of the eighteen
graded fields were in that state. The digest's own precision line says gas degF
prints to four decimals. `bonny_stage1_discharge_f` was graded at **1e-5**. A
learner quoting **221.7762**, exactly as the digest shows it, is **3.98e-5 out
and fails.**

| field | printed at | quoting it gives | error | old tol | verdict |
| --- | --- | --- | --- | --- | --- |
| `bonny_stage1_discharge_f` | 4 dp | 221.7762 | 3.976e-5 | 1e-5 | **FAILED** |
| `bonny_stage1_gas_hp` | 4 dp | 1678.3191 | 1.793e-5 | 1e-5 | **FAILED** |
| `escravos_discharge_psi` | 6 dp | 136.164028 | 4.309e-7 | 1e-7 | **FAILED** |
| `bonga_npsha_raised_ft` | 6 dp | 130.887342 | 2.278e-7 | 1e-7 | **FAILED** |
| `bonny_exponent_ratio` | 9 dp | 0.278795930 | 4.206e-10 | 1e-12 | **FAILED** |
| `bonga_pressure_head_ft` | 6 dp | 45.907595 | 6.329e-8 | 1e-7 | within a factor of 2 |
| `bonga_npsha_ft` | 6 dp | 53.107595 | 6.329e-8 | 1e-7 | within a factor of 2 |

**Settled at the generator rather than field by field.** `fc3_capstone.mjs` now
declares `PRINTED_DECIMALS` per quantity class and derives every tolerance as
`Math.max(stated, half a unit in the last printed place)`. `Math.max` and never
`min`, so this only ever LOOSENS and no answer that graded correct before
grades wrong now. **Seven tolerances loosened; not one of the eighteen VALUES
moved.**

Gas horsepower is the one that is not obvious. The digest's precision line puts
horsepower in the six-decimal class, and Section 11 prints gas hp with the
four-decimal gas formatter. **Four is the number a reader can take off the
page, so four sets the floor.** That mismatch between the declared class and
the printed class is itself worth a look whenever Section 11 is next rebuilt.

**The assertion, and the control that was circular.** The generator now asserts
every graded value survives being quoted at its printed precision. The first
control written for it mutated `PRINTED_DECIMALS`, which moves the floor and
the check together, so it could not fail and proved nothing: **a gate that
cannot fail, built while fixing a gate defect.** The honest control restores a
bare `1e-5` on the discharge temperature, and the generator exits 1, writes
nothing, and names the field, the tolerance, the precision, the quoted value
and the error. Both the circularity and the real control are recorded in the
generator itself.

Knock-ons carried: the lab module's mirrored tolerance list, and its leak-guard
band pin, which was a bare `1e-8` derived from the old 1e-12 and is now stated
as `10 * 5e-10 * 1000` so it moves with the tolerance rather than silently
pinning a stale one. Leak gate re-run with the wider bands: **0 of 54.**

### Three count defects, and a sweep of all thirty-four

- **Digest line 74 listed SEVEN held items and said "all eight"**, and its set
  differed from Section 17's: it omitted the implied water density and the
  published goldens and counted the speed band separately. Reconciled onto
  Section 17's eight. Section 1 is Associate m01's range, so the line keeps its
  `300` and `eight` tokens and introduces no new numeral.
- **The twelve-stage cap refusal carries SIX numeric fields and the digest
  named five.** `interstageCoolToF` was the missing one, and it is the field
  that says whether the approach or the limit is the impossible half. Printed
  beside the inlet it was taken from, and the lead line now states six.
- **Section 17's preamble claimed "three tier readings" over the eight-item
  held list**, which the kit's `count-disagrees` rule reads as a heading whose
  count disagrees with its list. The three readings are named in the same
  sentence, so the numeral carried nothing the enumeration does not; the line
  now names them and says the list below is the only count on the page. **It
  was checked and it predates the shared-section repair**: it fails identically
  on the digest before that repair and on the foundation digest `dd9148bf`.

**Swept rather than patched:** all **34** count claims across the whole digest
were read against the list or table beneath each. The three above were the only
defects; the other 31 are computed or check out by inspection.

**809 to 809 lines, 0 added, 4 changed, 0 removed; all 17 section start lines
unchanged; all 257 table rows byte identical.**

### wave.json, third sweep: a list that numbered two different items (7)

`heldItemCheck` ran **1-8, then 7 again, then 9**, because an earlier pass
appended a back-reference to item (7) that reads as a new list item. The
back-reference is folded into item (7); the capstone's new assertions, which
are not held items, are out of the numbered list; and the list now states that
there are EIGHT, the same eight digest Section 17 carries, so it checks itself.

The whole file was swept structurally this time, not by keyword: every string
field scanned for numbered lists, duplicates, gaps and ordering. **One defect,
now clean.** `plan.reCut`'s three `(7)`s are back-reference prose rather than a
list, which the checker distinguishes by whether the numbering starts at 1.

### digest_prose.rules.mjs, which FC3 never had

Its absence is what disabled the gate's deferral, so five true lines read as
copy-rule failures and an auditor was one step from rewording the engine's own
words in the digest. Written against FC4's as the reference: **47 engine pins**,
5 heading claims specific to this digest's own stale titles, and 4 cleared
phrases.

**The pins are the stronger half, not the deferral.** Each fragment is asserted
still present in its module, so an upstream engine edit turns the gate RED
rather than leaving a stale quote looking current. Negative control: a copy of
the engines with both quoted messages reworded makes the gate name both broken
pins and fail.

Result: `digestprose --rules` reports **0 failing, 0 warned, 47 engine pins, 5
deferred**.

### Recorded, not fixed

- **The bare-number contract's "never an Infinity" is falsifiable.** Four of the
  five bare-number functions return Infinity at denormal inputs, because the
  guard is `pPsia > 0` and 1e-308 passes it. Nothing taught or graded depends
  on it. **Engines-repo note.**
- **`numsweep` accepts anything within 5e-7 relative**, so FC3's "859 checked /
  0 unresolved" says nothing about the last digit of a nine-figure literal.
  Worth re-running when the kit compares at the literal's own precision.
