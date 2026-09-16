# FC3 recon. Rotating Equipment.

Course `rotating`, module `facilities`, the THIRD of nine Facilities courses.
Written 2026-09-16 against engines main `709172f`, the NextGen worktree
`/root/wt-fc3-nextgen` (branch `feat/fc3-rotating-course`, off nextgen main
`b539fa15`) and the Suite worktree
`/opt/petrolord-studio/workspaces/dev1/projects/petrolord-suite`.

Every path below is exact and every exported name was read from the source with
`grep -oE "^export const"`, not remembered. **Nothing in this file is teaching
truth.** The only teaching truth this wave has is `digest.txt`, and every line
of that is an engine return value.

---

## 0. The path_order decision, and a gap somebody should look at

FC1 `separation` took **39**, described in its own migration as "the first free
slot above Production's 38 and below Economics' 53". FC2 `linesizing` took
**41**. **Nothing took 40.** Both the FC2 recon and the FC2 commit message say
41 without giving a reason, and no migration claims 40.

**Decision: FC3 takes 42**, the next free slot after 41. It cannot collide
whatever 40 turns out to be. **The gap at 40 is flagged for the lead** rather
than silently closed by FC3, because closing it would put FC3 before FC2 in the
Facilities path and that is a curriculum decision, not a recon one.

Facilities has 39 to 52 inclusive, fourteen slots for nine courses, so the gap
costs nothing yet.

The slug `rotating` collides with nothing: no `src/content/courses/rotating`,
no `'rotating'` anywhere in `src/` or `migrations/`.

---

## 1. The engines this course teaches

Two modules, both `engines/facilities/`, both vendored into
`/root/wt-fc3-nextgen/packages/engines` at this wave's first commit and both
sha-identical with engines main `709172f`.

### `engines/facilities/pumps.js` (Facilities F10)

Centrifugal pump hydraulics and station design. **14 exports, no exported
constants at all**, and — unlike `lineHydraulics.js` — **no named internal
constants either**: `grep -nE "^const [A-Z_]+"` returns nothing. Every
numeric packaging in this module (2.31, 3960, 0.7457, the HI coefficients,
the region bands, the trim shortfall slope) is written inline at its point of
use. Under the FC1 rule that every digest number is an engine return, all of
them must be MEASURED by asking the engine a question about itself. Section 5
below records the measurement route proven for each.

**Curves**

| export | signature | returns |
| --- | --- | --- |
| `systemCurve` | `{ staticHeadFt, frictionHeadFt, atFlowGpm }` | `{ kFt, headAt(q), staticHeadFt }` or `{ error }` |
| `fitPumpCurve` | `{ points: [{qGpm, headFt}] }` | `{ coefficients: {c0,c1,c2,scale}, headAt(q), rSquared, shutoffHeadFt, warning }` or `{ error }` |

`systemCurve` expresses the friction coefficient through a reference point (a
friction head at a stated flow) rather than as an abstract coefficient, which
is the form a hydraulics calculation hands over. `fitPumpCurve` is a
least-squares quadratic in `q/scale`, solved by Gaussian elimination with
partial pivoting on the normal equations, and it reports `rSquared` and a
`warning` when the fitted curve does not droop.

**The duty point**

| export | signature | returns |
| --- | --- | --- |
| `dutyPoint` | `{ pump, system, qMaxGpm }` | `{ qGpm, headFt }` or `{ error, shutoffHeadFt?, systemStaticHeadFt? }` |

Bisection on the head difference, 200 halvings, no convergence flag. **This is
the organising idea of the whole module**: a pump has no operating point until
it is connected to something, so the duty is SOLVED as an intersection rather
than typed in, and every downstream question is asked at that solved point.
The two refusals are real answers rather than hidden errors: a pump whose
shutoff head is below the system's static head cannot start that system, and a
pair of curves that do not cross below the search limit is a search-limit
problem the caller is told about.

**Power and head**

| export | signature | returns |
| --- | --- | --- |
| `headFtToPsi` | `{ headFt, sg }` | a bare number |
| `psiToHeadFt` | `{ psi, sg }` | a bare number |
| `pumpPower` | `{ qGpm, headFt, sg, efficiency, motorEfficiency = 0.94 }` | `{ hydraulicHp, brakeHp, motorInputHp, motorInputKw }` or `{ error }` |

**NPSH**

| export | signature | returns |
| --- | --- | --- |
| `npshAvailable` | `{ suctionPressurePsia, vapourPressurePsia, sg, staticSuctionLiftFt = 0, suctionFrictionFt = 0 }` | `{ pressureHeadFt, npshaFt, warning }` or `{ error }` |
| `npshCheck` | `{ npshaFt, npshrFt }` | `{ marginFt, requiredMarginFt, ratio, pass, severity, note }` or `{ error }` |

The customary margin is `Math.max(3, 0.35 * npshrFt)`, and the three severities
are `cavitating`, `marginal` and `adequate`. **The module header says the rule
is "the larger of 3 ft and 1.35 times NPSHr", which is not what the code does**
(see FINDINGS P12); the UI and the STATUS doc both state 35 percent, which is
the code and is the customary rule.

**Affinity laws and trimming**

| export | signature | returns |
| --- | --- | --- |
| `speedChange` | `{ qGpm, headFt, brakeHp, speedRatio }` | `{ qGpm, headFt, brakeHp }` or `{ error }` |
| `impellerTrim` | `{ qGpm, headFt, brakeHp, diameterRatio }` | `{ trimPercent, idealQGpm, idealHeadFt, qGpm, headFt, brakeHp, shortfallPct, warning }` or `{ error }` |

`speedChange` is the exact cube law. `impellerTrim` is the module's teaching
point and the one place in the package where the affinity laws are stated NOT
to hold: a cut impeller no longer matches its casing, so the engine applies a
shortfall (zero at or under 5 percent trim, then `(trimPct - 5) * 0.006`
capped at 0.12) to the head and half of it to the flow, and returns the ideal
and the real side by side.

**Viscosity (Hydraulic Institute 9.6.7)**

| export | signature | returns |
| --- | --- | --- |
| `viscosityCorrection` | `{ qBepGpm, headBepFt, viscosityCSt, speedRpm = 3560 }` | `{ B, cQ, cH, cEta, correctedQGpm?, correctedHeadFt?, note?, warning }` or `{ error }` |

`B = 26.6 * sqrt(nu) * H^0.0625 / (Q^0.375 * N^0.25)`,
`cQ = exp(-0.165 * (log10 B)^3.15)`, `cH = cQ` at BEP, and
`cEta = B^(-0.0547 * B^0.69)`. **The return SHAPE changes between branches**:
the water branch and the `B <= 1` branch carry a `note` and omit
`correctedQGpm` and `correctedHeadFt` entirely (FINDINGS P13).

**Multiple machines and the operating region**

| export | signature | returns |
| --- | --- | --- |
| `combineParallel` | `{ pump, n }` | `{ headAt, n, mode }` or `{ error }` |
| `combineSeries` | `{ pump, n }` | `{ headAt, n, mode }` or `{ error }` |
| `operatingRegion` | `{ qGpm, qBepGpm }` | `{ percentOfBep, region, note, preferred }` or `{ error }` |

Parallel and series return CURVES, not duties, so the combined duty is solved
by intersecting again. The four region bands are 50, 70, 120 and 140 percent
of BEP flow, named `preferred`, `allowable, low`, `allowable, high` and
`outside`.

### `engines/facilities/compression.js` (Facilities F9)

Gas compression to the GPSA Chapter 13 method. **8 exports and three internal
constants**, none of them exported:

```
const R_UNIVERSAL_FT_LBF = 1545.349;   // ft.lbf/(lbmol.R)
const MW_AIR = 28.9625;
const LBMOL_SCF = 379.49;
```

It imports `suttonPseudoCriticals`, `dakZ` and `toRankine` from
`../production/gasProperties.js` — which already exports `AIR_MW = 28.9625`,
`R_UNIVERSAL = 10.7316` and `R_OFFSET = 459.67`. **All three internal
constants duplicate a constant the imported module already owns** (FINDINGS
C11), and one of the two duplicates does not agree with its twin.

| export | signature | returns |
| --- | --- | --- |
| `polytropicExponentRatio` | `{ k, polytropicEfficiency }` | a bare number, or `NaN` |
| `dischargeTempR` | `{ tSuctionR, ratio, k, polytropicEfficiency }` | a bare number, or `NaN` |
| `stageCount` | `{ pSuctionPsia, pDischargePsia, tSuctionF, k, polytropicEfficiency = 0.75, maxRatioPerStage = 4, maxDischargeF = 300 }` | `{ overallRatio, stages, ratioPerStage, byRatio, byTemp, governedBy }` or `{ error }` |
| `compressionStage` | `{ qMMscfd, pSuctionPsia, tSuctionF, ratio, gasSg, k, polytropicEfficiency = 0.75, mechanicalEfficiency = 0.97 }` | `{ pDischargePsia, tDischargeF, z1, z2, zAvg, massLbHr, headPolyFtLbfLbm, headIsenFtLbfLbm, polytropicEfficiency, isentropicEfficiency, gasHp, gasHpIsentropicRoute, brakeHp, warning }` or `{ error }` |
| `compressorTrain` | the stage inputs plus `pDischargePsia, interstageCoolToF, cpBtuLbF = 0.55, maxRatioPerStage, maxDischargeF` | the staging fields plus `{ stages: [...], totalGasHp, totalBrakeHp, totalCoolingBtuHr, totalCoolingMMBtuHr, finalDischargeF }` or `{ error }` |
| `actualInletCfm` | `{ qMMscfd, pPsia, tF, gasSg }` | a bare number, or `NaN` |
| `machineScreen` | `{ qMMscfd, pSuctionPsia, tSuctionF, gasSg, overallRatio, totalBrakeHp }` | `{ acfm, recommendation, reasons }` or `{ error }` |
| `driverFuel` | `{ brakeHp, heatRateBtuHpHr = 8000, gasLhvBtuScf = 950 }` | `{ fuelBtuHr, fuelMMscfd, thermalEfficiencyPct }` or `{ error }` |

The teaching points the module is built around, in its own words: the
polytropic exponent is NOT the isentropic one and using `k` where `n` belongs
is worth about ten percent of power; the stage count is the larger of what the
ratio rule demands and what the discharge-temperature limit demands, and the
governing one is NAMED; Z is evaluated at both ends of a stage and averaged;
the machine screen runs on published criteria with `either` allowed; and the
driver's fuel comes out of the very stream being compressed.

`stageCount` searches `byTemp` from 1 to 12 and refuses past 12.
`compressorTrain` chains equal-ratio stages, cools all but the last back to a
stated approach, and totals the power and the cooling duty.

### What is NOT in these modules, checked rather than assumed

Grepped the whole `engines/` tree for `recycle`, `anti-surge`, `antisurge`,
`surge`, `mechanical seal` and `bearing`:

- **There is no compressor surge line, no surge control, no recycle valve and
  no anti-surge calculation anywhere in the package.** The only `surge` hits
  are `drilling/surgeSwab.js` (surge and swab pressures while tripping, a
  different phenomenon entirely) and `production/pumpingUnit.js`. The
  Compressor Station Designer's own help guide says so out loud: "No machine
  curves, no surge line, no wheel selection, no valve dynamics or rod
  loading."
- **There is no seal or bearing calculation.** `pumps.js` mentions bearing and
  seal life only in the prose of `operatingRegion`'s `note` strings, which are
  returned text and not computed quantities.
- **There is no driver sizing beyond `pumpPower.motorInputHp` /
  `motorInputKw` and `compression.driverFuel`.** No motor selection, no
  starting torque, no turbine derate.

**Consequence, and it is a decision rather than an observation: FC3 cannot
teach surge, recycle, seals or bearings as digest truth, and no graded field
can touch them.** The course teaches the seam by name — what a screening tool
answers and what needs a vendor frame — exactly as FC2 taught the two-phase
seam it could not compute. Extracting a surge-line model would be an engines
programme item and is out of scope here.

### The published goldens

| file | blocks | cases | measured? |
| --- | --- | --- | --- |
| `test-data/facilities/goldens/pumps_cases.json` | `curves` 2, `duty` 2, `npsh` 2, `power` 2, `viscosity` 2 | **10** | **all SYNTHETIC** |
| `test-data/facilities/goldens/compression_cases.json` | `stages` 3, `staging` 3 | **6** | **all SYNTHETIC** |

**Sixteen published cases for twenty-two exported functions.** No measured pump
test, no vendor performance run and no field compressor datasheet is in this
course. That is stated in the digest and repeated in FINDINGS section D.

What the published goldens do NOT cover, and FC3's own goldens therefore must:
every refusal branch of both modules; `dutyPoint`'s two refusals and its
behaviour on a curve that does not droop; `headFtToPsi` / `psiToHeadFt` and the
water density their packaging implies; `speedChange`; the whole of
`impellerTrim` including its 5 percent boundary and its 25 percent cap;
`combineParallel` / `combineSeries` and the parallel result the module exists
to show; `operatingRegion`'s four bands and their boundaries; the whole of
`compressorTrain` including the interstage cooling duty; `machineScreen`'s four
branches; `driverFuel`; `actualInletCfm`; and every measured constant.

### The engine's own oracles, and why FC3's is a third route

`tools/validation/facilities/oracle_pumps.py` takes the fit by **Cramer's
rule** plus a residual-orthogonality check, the duty by a **two-million-point
scan**, power through **SI watts at 999.0 kg/m3**, NPSH from a **pascal
balance** and the HI correction **transcribed**.
`tools/validation/facilities/oracle_compression.py` takes the head by
**Simpson integration** of `int(v dp)`, the discharge temperature by a
**100,000-step march**, the stage count by **brute force** and power through
**SI watts**.

**`oracle_rotating.py` imports neither and repeats neither route**: the fit is
solved in **exact rational arithmetic** (`fractions.Fraction`) with an exactly
zero orthogonality residual rather than a small float one; the duty is the
**closed-form root of the quadratic** the two curves make, where the engine
bisects and the engine's oracle scans; the head integral is **64-point
Gauss-Legendre in `decimal.Decimal`** with the nodes generated from the
Legendre recurrence, plus a **path-property check** that `p v^n` really is
constant along the path the exponent claims; the stage count is **closed form**
in logarithms; and every field packaging (2.31, 3960, 0.7457, 1545.349,
379.49, 2544.43, 33000) is **derived from its definition** rather than quoted.
Stdlib only.

### The engine gates

`__tests__/facilities.pumps.test.js` and `__tests__/facilities.compression.test.js`,
**36 tests across the two suites, green on the vendored copy** at this wave's
first commit (measured, not quoted). One of those tests is a tautology and is
recorded in FINDINGS as a gate defect, not a content defect.

---

## 2. The Suite apps this course teaches against, and the layer in between

**Two apps, not one.** This is the first Facilities course that teaches against
a pair.

| | Pump Station Designer | Compressor Station Designer |
| --- | --- | --- |
| page | `src/pages/apps/PumpStationDesigner.jsx` (159 lines) | `src/pages/apps/CompressorStationDesigner.jsx` (151 lines) |
| route | `apps/facilities/pump-station-designer` | `apps/facilities/compressor-station-designer` |
| state | `src/contexts/PumpStudioContext.jsx` | `src/contexts/CompressorStudioContext.jsx` |
| panels | `src/components/pumpstudio/{PumpPanels,PumpHelpGuide,fields}.jsx` | `src/components/compressorstudio/{CompressorPanels,CompressorHelpGuide,fields}.jsx` |
| persistence | `saved_pump_projects` | `saved_compressor_projects` |
| tabs | Duty Point, Suction & Changes | Staging & Power, Machine & Fuel, Pressure Sweep |
| gate | `src/pages/apps/__tests__/PumpStudio.smoke.test.jsx` | `src/pages/apps/__tests__/CompressorStudio.smoke.test.jsx` |
| shipped | F10, 2026-08-29, `docs/scope/PumpStation-STATUS.md` | F9, 2026-08-29, `docs/scope/CompressorStation-STATUS.md` |

**The Suite layer is different in shape from FC2's, and that matters.** FC2
taught through `src/utils/facilities/lineSizing.js`, a 222-line composition
layer with six functions of its own. Here the shims are two-line pure
re-exports:

```
src/utils/facilities/engine/pumps.js:2:       export * from '.../engines/facilities/pumps.js';
src/utils/facilities/engine/compression.js:2: export * from '.../engines/facilities/compression.js';
```

**So the composition that exists lives inside the two React contexts**, and
that is where the app-side defects are:

- `PumpStudioContext.configured` **reimplements the trim and speed laws in the
  context rather than calling `impellerTrim` and `speedChange`**, in order to
  scale the whole CURVE rather than one point. `NpshResults` then renders the
  ENGINE's `impellerTrim` and `speedChange` applied to the untrimmed duty. The
  two answers are on one screen at once and they disagree (FINDINGS S1, live
  and user-facing).
- `CompressorStudioContext.engineArgs` converts psig to psia by adding 14.7 at
  the door, and `sweep` reruns the whole train per listed discharge pressure.
- Both contexts pass raw parsed input fields straight through, so every
  unguarded engine input in FINDINGS section B is reachable by typing into a
  box.

Neither app has a unit test of its own beyond the two smoke tests, and neither
smoke test asserts a number: they assert that headings and prose are on the
page. **Nothing in the Suite gates the arithmetic of either studio.**

---

## 3. What this course must NOT teach, because another live course owns it

Checked against the shipped catalogue in `/root/wt-fc3-nextgen/migrations`
(44 `*_course.sql` files; 45 courses live once FC1's seeds are applied) and
against the working digests of every Production course, not assumed. The scan
was `grep -ioE 'npsh|affinity|impeller|polytropic|isentropic|acfm|best
efficiency|compressor|centrifugal|reciprocating'` over all seventeen live
digests.

| already taught | by | evidence |
| --- | --- | --- |
| **The affinity laws**, rate with speed, head with the square, power with the cube | **PD3 `esp`** (path_order 32) | 112 `affinity` hits; its Section 5 is "THE AFFINITY LAWS, ON THE TWELVE PUBLISHED GOLDEN ROWS" |
| **The best efficiency point**: what it is, how the engine finds it, what it does not promise | **PD3 `esp`** | 62 `best efficiency` hits; Associate m03 is four lessons on exactly this |
| **Operating range either side of BEP** | **PD3 `esp`** | 57 `upthrust` and 31 `downthrust` hits, at 1.25 and 0.75 of the BEP rate |
| **A pump stage curve fitted to catalogue points, and what a fit outside its data costs** | **PD3 `esp`** | Sections 3, 4, 6, 7, 8 |
| Beam pumping, rod strings, pumping units | **PD4 `rodpump`** | whole course |

Three other digests mention a rotating machine in passing and own nothing of
it: PD7 `network` says `compressor` three times (as a boundary condition on a
network), PD9 `surveillance` says `centrifugal` once. **PD1 `nodal` has zero
hits for every one of the ten terms.**

### So what FC3 takes, and why it is not a second helping

1. **The whole of `compression.js`. No course touches it.** Zero `polytropic`,
   `isentropic` or `acfm` hits in any live digest. This is the tier-two and
   tier-three spine of the course.
2. **The duty point as a SOLVED INTERSECTION with a system curve.** PD3 has no
   system curve object at all: an ESP is sized on total dynamic head, which is
   a number the design computes, not a curve the machine is intersected with.
   The idea that a machine has no operating point until it is connected to
   something is FC3's, and it is the organising idea of `pumps.js`.
3. **The affinity laws where they FAIL.** PD3 teaches them where they are exact
   — a fixed-geometry ESP stage at a changed drive frequency, and its own
   digest says efficiency "does not move at all". FC3 teaches
   `impellerTrim`, the one function in the package that states the laws do NOT
   hold and prints the shortfall. **FC3 does not re-derive the laws; it cites
   that PD3 owns them and teaches the exception.** A speed change appears in
   FC3 only as the control case the trim is measured against.
4. **NPSH, available and required, and the margin rule.** Zero `npsh` hits in
   any other digest. Entirely FC3's.
5. **The Hydraulic Institute viscosity corrections.** PD3's Section 18 is
   titled "VISCOSITY, WHICH THIS ENGINE WILL NOT GUESS AT" — its engine
   deliberately refuses. FC3's engine does the correction, so FC3 owns it.
6. **Parallel and series machines, and the result that two pumps are not twice
   one pump.** Nowhere else.
7. **The preferred and allowable regions at 70/120/50/140 percent.** PD3 owns
   *what BEP is*; FC3 uses its own engine's four bands, with different
   thresholds and different names, as the place a DUTY POINT lands. **FC3 does
   not teach what a best efficiency point is; it takes it as known and states
   which course established it.**

---

## 4. What the course cannot teach from digest truth, and why

1. **Surge, recycle, anti-surge control.** Not in the package (section 1).
   Taught as a named seam, never graded.
2. **Seals and bearings.** Present only as returned prose in
   `operatingRegion.note`. The course may quote the engine's sentence; it may
   not compute a seal or bearing life, because nothing does.
3. **Machine curves, wheel selection, valve dynamics, rod loading.** The
   Compressor help guide disclaims all four.
4. **Vendor NPSHr as a function of flow.** `npshrFt` is a scalar INPUT, so the
   course cannot show NPSHr climbing with flow past 120 percent of BEP even
   though `operatingRegion`'s own note says it does. **That is a seam between
   two of this module's own returns and it is teaching material**: the engine
   warns about a curve it does not carry.
5. **Any measured machine.** All sixteen published goldens are synthetic.

---

## 5. The measurement routes for the unexported constants, proven before the digest

`pumps.js` exports no constants and names none internally, so every one of
these is measured by asking the engine a question about itself. All proven by
probe before the digest was built:

| constant | route | measured |
| --- | --- | --- |
| the ft-per-psi packaging | `psiToHeadFt({ psi: 1, sg: 1 })` | 2.31 |
| the water density it implies | `144 / psiToHeadFt({ psi: 1, sg: 1 })` | 62.33766233766234 lb/ft3 |
| the horsepower packaging | `1 / pumpPower({ qGpm: 1, headFt: 1, sg: 1, efficiency: 1 }).hydraulicHp` | 3960 |
| the water density IT implies | `(33000 / 3960) * (1728 / 231)` from the measured 3960 | 62.33766233766234 lb/ft3 |
| kW per hp | `motorInputKw / brakeHp` at `motorEfficiency: 1` | 0.7457 |
| the default motor efficiency | `brakeHp / motorInputHp` with `motorEfficiency` omitted | 0.94 |

**The two packagings imply the SAME water density to the last printed digit,
and that is a computed result rather than a claim** (the digest prints both and
their difference). Comparing that density to a published water density is a
HELD item, because no publication is in this repository to compare it to.

`compression.js`'s three internal constants are measurable through the returns:

| constant | route | measured |
| --- | --- | --- |
| `LBMOL_SCF` | `1e6 / 24 / massLbHr * MW_AIR` at `gasSg: 1, qMMscfd: 1` | 379.49 |
| `MW_AIR` | `massLbHr * 379.49 * 24 / 1e6` at `gasSg: 1, qMMscfd: 1` | 28.9625 |
| `R_UNIVERSAL_FT_LBF` | `headPoly / (zAvg * T1 * (1/e) * (r^e - 1)) * MW` | 1545.349 |
| the horsepower-minute packaging | via `gasHp` at a known head and mass | 33000 |
| the Btu-per-hp-hour figure | `driverFuel({ heatRateBtuHpHr: 100 }).thermalEfficiencyPct / 100 * 100` | 2544.43 |

---

## 6. Files

| what | where |
| --- | --- |
| engine, pumps | `packages/engines/engines/facilities/pumps.js` |
| engine, compression | `packages/engines/engines/facilities/compression.js` |
| gas properties it composes | `packages/engines/engines/production/gasProperties.js` |
| published goldens | `packages/engines/test-data/facilities/goldens/{pumps,compression}_cases.json` |
| engine oracles (not FC3's) | `packages/engines/tools/validation/facilities/oracle_{pumps,compression}.py` |
| engine gates | `packages/engines/__tests__/facilities.{pumps,compression}.test.js` |
| FC3 oracle | `/root/fc-wip-rotating/oracle_rotating.py` |
| FC3 goldens | `tools/course-waves/rotating/goldens/` in the NextGen repo |
| teaching digest | `/root/fc-wip-rotating/digest.txt` via `build_digest.sh` -> `fc3_dump.mjs` |
| apps | `src/pages/apps/{PumpStationDesigner,CompressorStationDesigner}.jsx` (Suite) |
| app state | `src/contexts/{PumpStudioContext,CompressorStudioContext}.jsx` (Suite) |
