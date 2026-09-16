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

**NOTHING HERE IS FIXED IN THIS PHASE.** The course may need to teach around
these, and a fix moves goldens. Each item says whether it **FAILS OPEN** (a
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
`compressionStage` with `ratio: 1`, which refuses — with **"a stage needs a
positive rate, suction pressure, gas gravity, k above 1 and a ratio above
1"**. The rate, the suction pressure, the gravity and k are all perfectly
good. The user is sent to check four correct inputs.

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
suction terms to 0 before the call), so **not live** — but it is the shape the
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
`brakeHp` of 123.83449883449883 — **a motor drawing a fifth of what its shaft
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
catches neither. **Two modules, two philosophies, one package** — the same
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
NPSHr". The code is `Math.max(3, 0.35 * npshrFt)`. **The code is right** — the
customary rule is `NPSHa >= 1.35 NPSHr`, a MARGIN of 0.35 NPSHr — and the UI
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

| trim ratio | the chart and the duty headline | the "what a change would buy" card |
| --- | --- | --- |
| 0.95 | 1400.691 gpm at 324.394 ft | 1433.423 gpm at 318.015 ft |
| 0.90 | 1267.314 gpm at 292.763 ft | 1337.610 gpm at 276.858 ft |
| 0.85 | 1129.118 gpm at 263.325 ft | 1244.060 gpm at 239.313 ft |
| **0.80** | **983.850 gpm at 236.041 ft** | **1152.774 gpm at 205.221 ft** |
| 0.75 | 827.554 gpm at 210.875 ft | 1063.751 gpm at 174.424 ft |

At a 20 percent trim the two figures on one screen are **17.2 percent apart in
flow and 13.1 percent apart in head**. The speed case does it too: at a ratio
of 1.2 the chart says 1922.922 gpm at 478.678 ft and the card says 1810.639
gpm at 507.415 ft.

**The card is the wrong one, and the reason is the course's own thesis.**
Applying an affinity law to a duty point does not give a new duty point,
because the system curve did not move: the machine changed and the piping did
not, so the answer is a fresh intersection. The disagreement is visible even
at a 5 percent trim where the shortfall is exactly zero (1400.691 against
1433.423), which is the proof that the gap is the missing re-intersection and
not the shortfall model.

### S2. The context's own trim law does not match the engine's

| | engine `impellerTrim` | `PumpStudioContext.configured` |
| --- | --- | --- |
| where the shortfall starts | `trimPct <= 5` | `diameterRatio < 0.95` |
| applied to head | `1 - shortfall` | `1 - shortfall` |
| applied to flow | `1 - shortfall / 2` | **nothing** |
| applied to power | nothing (ideal cube) | not computed |

Two implementations of one unsourced model, in one app, disagreeing on the
flow leg.

### S3. Every unguarded engine input in section B is reachable by typing

Both contexts parse field values and pass them through. The live ones are
`Motor eff` (P3), `Speed ratio` (P4), `Max ratio per stage` (C6),
`Polytropic efficiency` (C7), `Max discharge (F)` and `Intercool to (F)` (C1,
C2), `Suction temp (F)` (C4), `Heat rate (Btu/hp-hr)` (C3) and the four pump
curve points (P2). The two suction head terms are defaulted to 0 by the
context, which is why P1 is not live.

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
