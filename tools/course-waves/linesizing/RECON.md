# FC2 recon. Line Sizing & Hydraulics.

Course `linesizing`, path_order 41, module `facilities`, the second of nine
Facilities courses. Written 2026-09-16 against engines main `709172f` and the
Suite worktree at `/opt/petrolord-studio/workspaces/dev1/projects/petrolord-suite`.

Every path below is exact and every exported name was read from the source,
not remembered. **Nothing in this file is teaching truth.** The only teaching
truth this wave has is `digest.txt`, and every line of that is an engine
return value.

---

## 1. The engine this course teaches

### `packages/engines/engines/facilities/lineHydraulics.js` (vendored at 709172f)

The flagship single-line engine. 18 exports, in four groups.

**Constants**

| export | value | note |
| --- | --- | --- |
| `BASE_CONDITIONS` | `{ tbR: 520, pbPsia: 14.65 }` | the base of the published gas forms. Note 14.65, NOT 14.7 |
| `B318_DESIGN_FACTORS` | classes 1..4 at 0.72, 0.60, 0.50, 0.40 | B31.4 uses a flat 0.72 |

**Friction**

| export | signature | returns |
| --- | --- | --- |
| `reynoldsNumber` | `{ rhoLbFt3, vFtS, idIn, muCp }` | a number, or `NaN` on bad input |
| `frictionFactor` | `{ re, relRough = 0 }` | `{ f, regime }`, regime one of `laminar` / `transitional` / `turbulent` / `invalid` |

Laminar below Re 2100 is `64/Re`. From 2100 up it is Colebrook-White solved
by **fixed-point iteration on `1/sqrt(f)`**, 60 passes, tolerance 1e-13,
returning the last iterate with no convergence flag. The band 2100 to 4000
is labelled `transitional` but is computed on the turbulent branch.

**Liquid lines**

| export | signature | returns |
| --- | --- | --- |
| `liquidLineDrop` | `{ qBpd, idIn, lengthFt, elevChangeFt = 0, rhoLbFt3, muCp, roughnessIn = 0.0018, sumK = 0 }` | `{ vFtS, re, f, regime, dpFrictionPsi, dpFittingsPsi, dpElevationPsi, dpTotalPsi, gradientPsiPerFt }` or `{ error }` |
| `liquidLineTraverse` | `{ p1Psia, qBpd, idIn, rhoLbFt3, muCp, roughnessIn, profile }` | `{ stations, p2Psia, dpTotalPsi }` or `{ error }` |

The three losses are returned SEPARATELY, which is the engine's teaching
point: friction is what a bigger pipe fixes and elevation is what no pipe
fixes. `liquidLineTraverse` has **no `sumK` parameter at all**, so a line
sized with fittings and then marched loses them silently (see FINDINGS D11).

**Gas lines**

| export | signature | returns |
| --- | --- | --- |
| `elevationAdjustment` | `{ sg, elevChangeFt, tAvgR, zAvg }` | `{ s, es, leFactor }` |
| `weymouthQ` | `{ p1Psia, p2Psia, idIn, lengthMi, sg, tAvgR, zAvg = 0.9, efficiency = 1, elevChangeFt = 0, tbR, pbPsia }` | `{ qScfd }` or `{ error }` |
| `panhandleAQ` | same | `{ qScfd }` or `{ error }` |
| `panhandleBQ` | same | `{ qScfd }` or `{ error }` |
| `generalFlowQ` | same plus `muCp = 0.011, roughnessIn = 0.0007` | `{ qScfd, fDarcy }` or `{ error }` |
| `gasOutletPressure` | `{ equation = 'weymouth', qScfd, ...rest }` | `{ p2Psia, dpPsi }` or `{ error }` |

The four published field-unit forms, with their leading constants 433.5 /
435.87 / 737 / 77.54 and their diameter exponents 8/3 / 2.6182 / 2.53 / 2.5.
The shared elevation term is `s = 0.0375 G dz / (T Z)`, the driving group
becomes `p1^2 - e^s p2^2` and the friction length is `L (e^s - 1) / s`.
`generalFlowQ` iterates its Colebrook friction factor against its own rate,
50 passes, no convergence flag. `gasOutletPressure` inverts by **bisection on
p2 bracketed [14.7, p1Psia]**, 100 halvings.

**Wall thickness (B31.4 / B31.8 Barlow)**

| export | signature | returns |
| --- | --- | --- |
| `requiredWallIn` | `{ designPsig, odIn, smysPsi, code = 'B31.4', locationClass = 1, jointFactor = 1, tempDerate = 1, corrosionAllowanceIn = 0 }` | `{ designFactor, tPressureIn, tRequiredIn }` or `{ error }` |
| `maopPsig` | `{ wallIn, odIn, smysPsi, code, locationClass, jointFactor, tempDerate, corrosionAllowanceIn }` | `{ maopPsig, designFactor }` or `{ error }` |

`t = P D / (2 S F E T) + CA`. The location class must be STATED for B31.8,
because assuming Class 1 near a school is the mistake the classes exist to
prevent. This is a DIFFERENT Barlow from `pipeSchedule.barlowPressurePsi`
(see section 4): this one carries the code design-factor families, the joint
factor, the temperature derate and the corrosion allowance.

**Pigging**

| export | signature | returns |
| --- | --- | --- |
| `lineVolumeBbl` | `{ idIn, lengthFt }` | a number, or `NaN` |
| `sweptLiquidBbl` | `{ idIn, lengthFt, holdupFrac }` | `{ sweptBbl }` or `{ error }` |
| `pigRun` | `{ lengthFt, pigSpeedFtS }` | `{ runHours, pigSpeedFtS }` or `{ error }` |
| `piggingInterval` | `{ maxSlugBbl, dropoutBpd, sweptBbl = 0 }` | `{ intervalDays }` or `{ error }` |

**The holdup is an INPUT.** The module says so in its own header: a pigging
estimate is only as honest as the holdup it is fed. That is the seam this
course has to teach rather than paper over (section 6).

**Unexported constants** (`FT_PER_MILE` 5280, `S_PER_DAY` 86400,
`CUFT_PER_BBL` 42*231/1728, `GC` 32.174, `CP_TO_LBM_FT_S` 6.7197e-4). Under
the FC1 rule that every digest number is an engine return, each of these has
to be MEASURED by asking the engine a question about itself. All five routes
were proven before the digest was built:

- `GC` = `rho v^2 / (2 * 144 * dpFittingsPsi)` at `sumK: 1` gives exactly 32.174
- `CP_TO_LBM_FT_S` = `rho v (d/12) / (mu * re)` gives exactly 0.00067197
- `CUFT_PER_BBL` = `area * L / lineVolumeBbl` gives 5.614583333333333
- `S_PER_DAY` follows from the velocity once `CUFT_PER_BBL` is known: 86400
- seconds per hour = `lengthFt / (speed * pigRun.runHours)` gives 3600

`FT_PER_MILE` is **declared and never used** anywhere in the module. It is
dead (FINDINGS D14) and cannot be measured, because nothing consumes it.

### `packages/engines/engines/production/chokePerformance.js` (already vendored, sha-identical)

API RP 14E, composed rather than copied:

| export | note |
| --- | --- |
| `EROSIONAL_C` | 3 rows: `continuous` 100, `intermittent` 125, `cleanInhibited` 175 |
| `erosionalC(id)` | **falls back to row 0 for an unknown id** rather than refusing |
| `erosionalVelocityFtS` | `{ mixtureDensityLbFt3, cFactor = 100 }` -> `C / sqrt(rho)`, `NaN` on bad input |
| `pipeAreaFt2(idIn)` | ft2 from inches |
| `mixtureVelocityFtS` | `{ inSituBpd, idIn }` |
| `erosionalCheck` | `{ ok, velocityFtS, erosionalFtS, ratio, exceeded, marginPct, cFactor }` or `{ ok: false, error }` |
| `erosionalRateBpd` | the largest in-situ rate inside the limit |

The 175 row is labelled "operator practice" and has no recommended practice
behind it. That is a HELD item for this course.

### `packages/engines/engines/production/pipeSchedule.js` (refreshed to 709172f)

`PIPE_SCHEDULE` (12 rows of ANSI B36.10), `ROUGHNESS_IN` (4 rows),
`FITTINGS` (10 K values), `LINE_PIPE_GRADES` (5 API 5L grades),
`scheduleRow`, `roughnessOf`, `fittingK`, `gradeYield`,
`equivalentLengthFt`, `barlowPressurePsi`.

**FC2 uses this table as the set of bores a sizing sweep runs over, and as
the roughness catalogue. It does NOT re-teach the table.** See section 5.

---

## 2. The Suite app this course teaches against

**Pipeline & Line Sizing Studio**, `src/pages/apps/PipelineLineSizingStudio.jsx`
(179 lines), state in `src/contexts/LineSizingContext.jsx` (557 lines), panels
in `src/components/linesizing/` (FluidPanel, PipePanel, SizingPanel,
ProfilePanel, WallPanel, PiggingPanel, SummaryPanel, LineSizingHelpGuide,
fields.jsx). Persistence `saved_linesizing_projects`. Facilities F1, shipped
2026-08-29; status doc `docs/scope/PipelineLineSizing-STATUS.md`.

**The app does not call the engine directly.** It calls a Suite-side
composition layer, `src/utils/facilities/lineSizing.js` (222 lines), whose
own header says it contains no new physics. That layer:

- re-exports the whole of `lineHydraulics` and the `pipeSchedule` tables
- adds `GAS_EQUATIONS` (the four forms as a labelled pick list)
- adds `oilDensityLbFt3(api)` and `gasDensityLbFt3({pPsia,tF,gasSg})` over
  the vendored `gasProperties.naturalGasZ`
- adds `multiphaseLine(...)` over the Suite's Beggs & Brill
  (`src/utils/nodal/correlations/beggsBrill.js`)
- adds `erosionalStatus({vFtS, rhoMixLbFt3, cFactor})` over RP 14E
- adds `sweepCandidates()` and `sizeSweep({mode, inputs, cFactor, maxLiquidVFtS})`
- adds `gasLineTraverse(...)`, the gas analogue of `liquidLineTraverse`

Its gates are `src/utils/facilities/__tests__/lineSizing.test.js` (13).

**This matters for the digest.** Six of those functions (`multiphaseLine`,
`erosionalStatus`, `sizeSweep`, `gasLineTraverse`, `gasDensityLbFt3`,
`oilDensityLbFt3`) are **Suite app code, not vendored engines**, so NextGen
cannot import them and no number they return can become a digest line. Four
real defects live in that layer (FINDINGS S1 to S4) and the course teaches
them as app behaviour in prose, with the engine-side arithmetic that exposes
each one printed from the engine.

---

## 3. The goldens

`packages/engines/test-data/facilities/goldens/linehydraulics_cases.json`,
five blocks, **37 published cases, all SYNTHETIC** (written by the SI oracle,
not measured):

| block | rows | covers |
| --- | --- | --- |
| `friction` | 6 | Re 1500 (laminar), 3000 (the transition band), 5e3, 5e4, 1e6, 1e7 at relRough 0 to 2e-3 |
| `liquid` | 4 | one plain, one with elevation and fittings, one downhill, one laminar at 400 cp |
| `gas` | 20 | 5 cases x the 4 forms, including +800 and -800 ft of elevation |
| `barlow` | 4 | B31.4 class 1; B31.8 classes 1, 3 and 4, with a corrosion allowance and a 0.967 temperature derate |
| `pigging` | 3 | line volume, swept volume and a 5 ft/s run on three bores |

**What the published goldens do NOT cover, and FC2's own goldens therefore
must:** every refusal branch, `liquidLineTraverse`, `gasOutletPressure`,
`maopPsig` round-trips, `piggingInterval`, the whole of `erosionalCheck` and
`erosionalRateBpd` in a LINE context, the transition band boundary at Re
2100, and the inclined inverse solve. That is what
`oracle_linesizing.py` produces and what `goldens/` commits.

The engine's own oracle is `tools/validation/facilities/oracle_linehydraulics.py`
(Menon SI forms, Colebrook by bisection). **FC2's oracle is a third route and
imports neither**: Colebrook by the exact Lambert-W closed form, the General
Flow constant derived from first principles rather than quoted, the three
empirical constants checked by dimensional conversion against their SI twins,
and the inverse solved in closed form where the engine bisects.

---

## 4. What this course must NOT teach, because another live course owns it

Checked against the shipped NextGen catalogue, not assumed.

| already taught | by | where |
| --- | --- | --- |
| the `PIPE_SCHEDULE` table and its `od - 2*wall` self check | PD7 `network` | Associate m02 l01, digest Section 1 |
| `pipeSchedule.barlowPressurePsi`, the grades, the bare design factor | PD7 `network` | Associate m02 l03/l04, digest Section 2 |
| `equivalentLengthFt`, the K table, the roughness table, the thirty-diameters rule | PD7 `network` | Associate m03 (5 lessons), digest Section 3 |
| `erosionalVelocityFtS` / `erosionalRateBpd` at the WELLHEAD, the C rows, the golden erosional block | PD1 `nodal` | digest lines 971 to 995 and 1364 to 1370 |
| flowline thermal, cooldown, hydrate inhibition, Joule-Thomson | PD6 `flowassurance` | 32 digest sections |

So FC2 takes: **the whole of `lineHydraulics.js`**, which no course touches;
the erosional limit **as a line-sizing criterion across a family of bores**
rather than as a wellhead bean limit; and the pipe table only as the set of
bores a sweep runs over. The B31.4/B31.8 Barlow in `lineHydraulics` is a
different function from the one `network` teaches and the contrast between
them (a code design factor family against a bare factor) is FC2's, not a
duplication.

---

## 5. What the course cannot teach from digest truth, and why

**There is no Beggs & Brill, and no two-phase correlation of any kind, in
`packages/engines`.** Grepped the whole tree for beggs / flowPattern /
segregated / holdup / payne / hagedorn / duns / orkiszewski / mukherjee: the
only hits are comments in `production/nodal.js` and `facilities/lineHydraulics.js`
pointing AT the Suite. The canonical Beggs & Brill lives at
`src/utils/nodal/correlations/beggsBrill.js` in the Suite and is not vendored.

Consequences, and they are decisions rather than observations:

1. **Two-phase flow regimes and holdup cannot be graded, and cannot be a
   digest number.** The course teaches holdup exactly as the engine frames
   it: as an INPUT to `sweptLiquidBbl`, with the seam named out loud and the
   sensitivity of a pigging estimate to it printed across a holdup sweep
   (which IS engine truth, because `sweptLiquidBbl` returns it).
2. **Slug flow, slug length and slug volume are not in this engine either.**
   `separatorSizing.vesselSlugCatcher` refuses with "a slug volume is needed
   (the line sizing studio computes it)" and FC1 teaches the catcher. The
   line sizing studio computes that volume through the Suite's Beggs & Brill
   holdup, so the slug half of the chain is app code. FC2 teaches the
   handshake and FC1 teaches the vessel; neither can grade the slug volume.
3. **Recommendation for a later wave, not for this one:** extracting Beggs &
   Brill into `engines/production/correlations/` with a golden and an oracle
   would unlock two-phase for FC2 and for PD1 at once. It is a real engines
   programme item and is out of scope here.

---

## 6. The held items, decided now so the capstone can be planned around them

Nothing graded may depend on any of these.

1. **The RP 14E c-factors.** 100 and 125 are the recommended practice's own
   conservative figures; 175 is labelled "operator practice" with no source.
   Every graded erosional field states its own c-factor as a condition.
2. **The transition band, Re 2100 to 4000.** The engine returns the turbulent
   Colebrook value there and labels it `transitional`. No honest correlation
   exists in that band. No graded liquid field sits in it; the capstone's
   liquid line is turbulent by construction.
3. **The efficiency factor E.** An unsourced multiplier on all four gas
   forms. Every graded gas field runs at E = 1 or at a stated E.
4. **The published SI / field constant pairs** (433.5 against 3.7435e-3, and
   the rest) are quoted to four or five significant figures, which is what
   sets the gas tolerance. Taught as the limit of the agreement, never graded
   as a figure.
5. **The 37 published goldens are synthetic.** No measured pipeline is in
   this course.

---

## 7. Files

| what | where |
| --- | --- |
| engine | `packages/engines/engines/facilities/lineHydraulics.js` |
| erosional | `packages/engines/engines/production/chokePerformance.js` |
| bores and roughness | `packages/engines/engines/production/pipeSchedule.js` |
| published goldens | `packages/engines/test-data/facilities/goldens/linehydraulics_cases.json` |
| engine oracle (not FC2's) | `packages/engines/tools/validation/facilities/oracle_linehydraulics.py` |
| engine gate | `packages/engines/__tests__/facilities.linehydraulics.test.js` (15 green on the vendored copy) |
| FC2 oracle | `/root/fc-wip-linesizing/oracle_linesizing.py` |
| FC2 goldens | `tools/course-goldens/linesizing/` in the NextGen repo |
| teaching digest | `/root/fc-wip-linesizing/digest.txt` via `build_digest.sh` -> `fc2_dump.mjs` |
| app | `src/pages/apps/PipelineLineSizingStudio.jsx` + `src/utils/facilities/lineSizing.js` (Suite) |
