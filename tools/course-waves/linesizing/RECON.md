# FC2 recon. Line Sizing & Hydraulics.

Course `linesizing`, path_order 41, module `facilities`, the second of nine
Facilities courses.

**Written 2026-09-16 against engines main `709172f`. REVISED the same day
against the FC2-0 repairs (engines PR #196, vendored at NextGen `27de8d90`,
eight paths sha-identical with the engines branch) and the FC2-0b Suite
repair.** Section 8 records exactly what moved. Where this file says
"repaired", the behaviour described in `FINDINGS.md` Part 1 no longer exists.

Every path below is exact and every exported name was read from the source,
not remembered. **Nothing in this file is teaching truth.** The only teaching
truth this wave has is `digest.txt`, and every line of that is an engine
return value.

---

## 1. The engine this course teaches

### `packages/engines/engines/facilities/lineHydraulics.js` (vendored at 27de8d90, engines PR #196)

The flagship single-line engine. 18 exports, in four groups.

**Constants**

| export | value | note |
| --- | --- | --- |
| `BASE_CONDITIONS` | `{ tbR: 520, pbPsia: 14.65 }` | the base of the published gas forms. Note 14.65, NOT 14.7 |
| `B318_DESIGN_FACTORS` | classes 1..4 at 0.72, 0.60, 0.50, 0.40 | B31.4 uses a flat 0.72 |

**Friction**

| export | signature | returns |
| --- | --- | --- |
| `reynoldsNumber` | `{ rhoLbFt3, vFtS, idIn, muCp }` | a number, or `NaN` by documented contract |
| `frictionFactor` | `{ re, relRough = 0 }` | `{ f, regime }`, regime one of `laminar` / `transitional` / `turbulent` / `invalid` |

Laminar below Re 2100 is `64/Re`. From 2100 up it is Colebrook-White solved
by **fixed-point iteration on `1/sqrt(f)`**, 60 passes, tolerance 1e-13,
returning the last iterate with no convergence flag. The band 2100 to 4000
is labelled `transitional` but is computed on the turbulent branch.

**Liquid lines**

| export | signature | returns |
| --- | --- | --- |
| `liquidLineDrop` | `{ qBpd, idIn, lengthFt, elevChangeFt = 0, rhoLbFt3, muCp, roughnessIn = 0.0018, sumK = 0 }` | `{ vFtS, re, f, regime, dpFrictionPsi, dpFittingsPsi, dpElevationPsi, dpTotalPsi, gradientPsiPerFt }` or `{ error }` |
| `liquidLineTraverse` | `{ p1Psia, qBpd, idIn, rhoLbFt3, muCp, roughnessIn, profile }` | `{ stations, p2Psia, dpTotalPsi }` or `{ error }` carrying its evidence |

The three losses are returned SEPARATELY, which is the engine's teaching
point: friction is what a bigger pipe fixes and elevation is what no pipe
fixes. `liquidLineTraverse` still has **no `sumK` parameter**, so a line
sized with fittings and then marched loses them silently (G5, deliberately
not repaired: a signature change with callers in two repositories). It now
guards its inlet pressure and refuses a march that would cross zero
absolute, attaching the stations it stands behind, the distance it died at
and the pressure the arithmetic produced.

**Gas lines**

| export | signature | returns |
| --- | --- | --- |
| `elevationAdjustment` | `{ sg, elevChangeFt, tAvgR, zAvg }` | `{ s, es, leFactor }` or `{ error }` |
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
50 passes, no convergence flag.

**`gasOutletPressure` now brackets at `[14.7, p1 / sqrt(es)]`**, the upper
end being the outlet at which the driving group vanishes. That ceiling is
the inlet only on a flat line: a descent puts it ABOVE the inlet and a climb
puts it BELOW. A descent's answer is a NEGATIVE `dpPsi`, which is the
physics and not an error state; a climb whose static column alone spends the
inlet is refused by name. This is the single biggest change from the
original recon and it is digest Section 10.

**Wall thickness (B31.4 / B31.8 Barlow)**

| export | signature | returns |
| --- | --- | --- |
| `requiredWallIn` | `{ designPsig, odIn, smysPsi, code = 'B31.4', locationClass = 1, jointFactor = 1, tempDerate = 1, corrosionAllowanceIn = 0 }` | `{ designFactor, tPressureIn, tRequiredIn }` or `{ error }` |
| `maopPsig` | `{ wallIn, odIn, smysPsi, code, locationClass, jointFactor, tempDerate, corrosionAllowanceIn }` | `{ maopPsig, designFactor }` or `{ error }` |

`t = P D / (2 S F E T) + CA`. The location class must be STATED for B31.8,
because assuming Class 1 near a school is the mistake the classes exist to
prevent. This is a DIFFERENT Barlow from `pipeSchedule.barlowPressurePsi`
(see section 4). The joint factor, the temperature derate and the corrosion
allowance are now all guarded; `maopPsig` still over-rates if the caller
omits the allowance (G7, not repairable by a guard, see section 8).

**Pigging**

| export | signature | returns |
| --- | --- | --- |
| `lineVolumeBbl` | `{ idIn, lengthFt }` | a number, or `NaN` by documented contract |
| `sweptLiquidBbl` | `{ idIn, lengthFt, holdupFrac }` | `{ sweptBbl }` or `{ error }` |
| `pigRun` | `{ lengthFt, pigSpeedFtS }` | `{ runHours, pigSpeedFtS }` or `{ error }` |
| `piggingInterval` | `{ maxSlugBbl, dropoutBpd, sweptBbl = 0 }` | `{ intervalDays }` or `{ error }` |

**The holdup is an INPUT.** The module says so in its own header: a pigging
estimate is only as honest as the holdup it is fed. That is the seam this
course has to teach rather than paper over (section 5).

**Unexported constants** (`S_PER_DAY` 86400, `CUFT_PER_BBL`, `GC` 32.174,
`CP_TO_LBM_FT_S` 6.7197e-4, and `FT_PER_MILE` 5280). Under the FC1 rule that
every digest number is an engine return, each has to be MEASURED by asking
the engine a question about itself. All five routes are proven and in the
digest:

- `GC` = `rho v^2 / (2 * 144 * dpFittingsPsi)` at `sumK: 1` gives exactly 32.174
- `CP_TO_LBM_FT_S` = `rho v (d/12) / (mu * re)` gives exactly 0.00067197
- `CUFT_PER_BBL` = `area * L / lineVolumeBbl` gives 5.614583333333333
- `S_PER_DAY` follows from the velocity once `CUFT_PER_BBL` is known: 86400
- seconds per hour = `lengthFt / (speed * pigRun.runHours)` gives 3600
- **`FT_PER_MILE`**: the original recon recorded it as declared, unused and
  therefore unmeasurable. **FC2-0 resolved that as a side effect**: the new
  gas elevation guard compares a rise against `lengthMi * FT_PER_MILE`, so
  the constant is live, and the digest measures it by finding where that
  refusal begins. 5280.000000000 ft is accepted on a one-mile line and the
  next representable value above it, 9.095e-13 ft higher, is refused.

`lib/units/fieldUnits.js` is new in the vendored tree and is where the
barrel now lives for both modules.

### `packages/engines/engines/production/chokePerformance.js` (vendored at 27de8d90)

API RP 14E, composed rather than copied:

| export | note |
| --- | --- |
| `EROSIONAL_C` | 3 rows: `continuous` 100, `intermittent` 125, `cleanInhibited` 175 |
| `erosionalC(id)` | **still falls back to row 0 for an unknown id** rather than refusing (G6, deliberately not repaired) |
| `erosionalVelocityFtS` | `{ mixtureDensityLbFt3, cFactor = 100 }` -> `C / sqrt(rho)` |
| `pipeAreaFt2(idIn)` | ft2 from inches |
| `mixtureVelocityFtS` | `{ inSituBpd, idIn }`, now on the exact barrel |
| `erosionalCheck` | `{ ok, velocityFtS, erosionalFtS, ratio, exceeded, marginPct, cFactor }` or `{ ok: false, error }` |
| `erosionalRateBpd` | the largest in-situ rate inside the limit, now on the exact barrel |

The 175 row is labelled "operator practice" and has no recommended practice
behind it. That is a HELD item for this course.

### `packages/engines/engines/production/pipeSchedule.js`

`PIPE_SCHEDULE` (12 rows of ANSI B36.10), `ROUGHNESS_IN` (4 rows),
`FITTINGS` (10 K values), `LINE_PIPE_GRADES` (5 API 5L grades),
`scheduleRow`, `roughnessOf`, `fittingK`, `gradeYield`,
`equivalentLengthFt`, `barlowPressurePsi`. Untouched by FC2-0.

**FC2 uses this table as the set of bores a sizing sweep runs over, and as
the roughness catalogue. It does NOT re-teach the table.** See section 4.

---

## 2. The Suite app this course teaches against

**Pipeline & Line Sizing Studio**, `src/pages/apps/PipelineLineSizingStudio.jsx`
(179 lines), state in `src/contexts/LineSizingContext.jsx` (557 lines), panels
in `src/components/linesizing/`. Persistence `saved_linesizing_projects`.
Facilities F1, shipped 2026-08-29; status doc
`docs/scope/PipelineLineSizing-STATUS.md`.

**The app does not call the engine directly.** It calls a Suite-side
composition layer, `src/utils/facilities/lineSizing.js`, whose own header
says it contains no new physics. That layer re-exports the whole of
`lineHydraulics` and the `pipeSchedule` tables, and adds `GAS_EQUATIONS`,
`oilDensityLbFt3`, `gasDensityLbFt3`, `multiphaseLine` (over the Suite's
Beggs & Brill), `erosionalStatus`, `sweepCandidates`, `sizeSweep` and
`gasLineTraverse`.

**This matters for the digest.** Those functions are **Suite app code, not
vendored engines**, so NextGen cannot import them and no number they return
can become a digest line. That is still true after FC2-0b, which added
`bindingVmFtS`, `bindingRhoMixLbFt3`, `bindingAtFt` and
`erosionalStatusAlongLine` to that same Suite layer. The course teaches the
composition as app behaviour in prose, with the engine-side arithmetic
printed from the engine.

The four defects originally recorded here (S1 to S4) were **all repaired by
the FC2-0b Suite wave**; see section 8.

---

## 3. The goldens

`packages/engines/test-data/facilities/goldens/linehydraulics_cases.json`,
**45 published cases, all SYNTHETIC** (written by the SI oracle, not
measured). It was 37; FC2-0 added an `outlet` block of 8 and changed none of
the original 37.

| block | rows | covers |
| --- | --- | --- |
| `friction` | 6 | Re 1500 (laminar), 3000 (the transition band), 5e3, 5e4, 1e6, 1e7 |
| `liquid` | 4 | one plain, one with elevation and fittings, one downhill, one laminar at 400 cp |
| `gas` | 20 | 5 cases x the 4 forms, including +800 and -800 ft of elevation |
| `barlow` | 4 | B31.4 class 1; B31.8 classes 1, 3 and 4 |
| `outlet` | 8 | NEW in FC2-0: the corrected inverse, both signs of elevation |
| `pigging` | 3 | line volume, swept volume and a 5 ft/s run |

FC2's own goldens, produced by `oracle_linesizing.py`: **192 cases across 13
files**, counted from the files themselves. The refusal block grew from 33
to 45 and the outlet block from 7 to 13 under the repairs. *A commit message
on this branch cites 201; my count of the committed files is 192 and the
command that produces it is in section 8. The discrepancy is recorded rather
than silently resolved.*

FC2's oracle is a third route, importing neither the engine nor the engine's
own oracle: Colebrook by the exact Lambert-W closed form, the General Flow
constant derived from first principles, Weymouth's constant AND its 8/3
exponent derived from that plus its own fully-rough friction assumption, the
inverse solved in closed form, and a refusal sweep.

---

## 4. What this course must NOT teach, because another live course owns it

Checked against the shipped NextGen catalogue, not assumed.

| already taught | by | where |
| --- | --- | --- |
| the `PIPE_SCHEDULE` table and its `od - 2*wall` self check | PD7 `network` | Associate m02 l01, digest Section 1 |
| `pipeSchedule.barlowPressurePsi`, the grades, the bare design factor | PD7 `network` | Associate m02 l03/l04, digest Section 2 |
| `equivalentLengthFt`, the K table, the roughness table, the thirty-diameters rule | PD7 `network` | Associate m03 (5 lessons), digest Section 3 |
| `erosionalVelocityFtS` / `erosionalRateBpd` at the WELLHEAD, the C rows | PD1 `nodal` | digest lines 971 to 995 and 1364 to 1370 |
| flowline thermal, cooldown, hydrate inhibition, Joule-Thomson | PD6 `flowassurance` | 32 digest sections |

So FC2 takes: **the whole of `lineHydraulics.js`**, which no course touches;
the erosional limit **as a line-sizing criterion across a family of bores**
rather than as a wellhead bean limit; and the pipe table only as the set of
bores a sweep runs over. The B31.4/B31.8 Barlow in `lineHydraulics` is a
different function from the one `network` teaches.

---

## 5. What the course cannot teach from digest truth, and why

**There is no Beggs & Brill, and no two-phase correlation of any kind, in
`packages/engines`.** Grepped the whole tree: the only hits are comments in
`production/nodal.js` and `facilities/lineHydraulics.js` pointing AT the
Suite. The canonical Beggs & Brill lives at
`src/utils/nodal/correlations/beggsBrill.js` in the Suite and is not
vendored. **FC2-0b did not change this**: its binding-point work also lives
in the Suite layer.

Consequences, and they are decisions rather than observations:

1. **Two-phase flow regimes and holdup cannot be graded, and cannot be a
   digest number.** The course teaches holdup exactly as the engine frames
   it: as an INPUT to `sweptLiquidBbl`, with the seam named out loud and the
   sensitivity of a pigging estimate to it printed across a holdup sweep.
2. **Slug flow, slug length and slug volume are not in this engine either.**
   FC2 teaches the handshake with FC1 and neither can grade the slug volume.
3. **Recommendation for a later wave:** extracting Beggs & Brill into
   `engines/production/correlations/` with a golden and an oracle would
   unlock two-phase for FC2 and for PD1 at once.

---

## 6. The held items. Unchanged by FC2-0.

Nothing graded may depend on any of these.

1. **The API RP 14E c factors.** 100 and 125 are the recommended practice's
   own conservative figures; 175 is labelled "operator practice".
2. **The transmission-form efficiency E.** An unsourced multiplier. It is now
   GUARDED to (0, 1], but guarding a value is not sourcing it.
3. **The transition band, Re 2100 to 4000.** No honest correlation exists
   there, and FC2-0 deliberately did not invent one.
4. **The Weymouth fully-rough friction assumption.**
5. **All 45 published goldens are synthetic.** No measured pipeline is in
   this course.

**No graded capstone value touches any of these, re-confirmed after FC2-0.**
Every c factor, efficiency, roughness, resistance sum, location class and
holdup in `fields.json` is a STATED condition of its tier, every capstone
Reynolds number is above 20000, and no graded field reads a table. **No
capstone field moved under the repairs**, verified twice by the repair wave.

---

## 7. Files

| what | where |
| --- | --- |
| engine | `packages/engines/engines/facilities/lineHydraulics.js` |
| erosional | `packages/engines/engines/production/chokePerformance.js` |
| shared units | `packages/engines/lib/units/fieldUnits.js` |
| bores and roughness | `packages/engines/engines/production/pipeSchedule.js` |
| published goldens | `packages/engines/test-data/facilities/goldens/linehydraulics_cases.json` (45) |
| engine oracle (not FC2's) | `packages/engines/tools/validation/facilities/oracle_linehydraulics.py` |
| engine gates | `facilities.linehydraulics.test.js` **28 green**, `production.choke.test.js` **18 green**, **46 together** |
| FC2 oracle | `oracle_linesizing.py` |
| FC2 goldens | `goldens/` in the wave, mirrored at `tools/course-waves/linesizing/goldens/` |
| teaching digest | `digest.txt`, 530 lines, 18 sections, via `build_digest.sh` -> `fc2_dump.mjs` |
| app | `src/pages/apps/PipelineLineSizingStudio.jsx` + `src/utils/facilities/lineSizing.js` (Suite) |

---

## 8. What changed on 2026-09-16, and three corrections to my own record

### The repairs, and what they do to the plan

`FINDINGS.md` Part 2 is the authority. In summary: the ten fails-open and
the ten fails-silent are repaired, the outlet bracket is corrected in both
directions, and the barrel is unified on the exact definition.

**On the refusal count, corrected against the digest rather than inherited.**
Earlier drafts of this file and of several briefs said "twenty-one inputs now
return a named error". That figure appears nowhere in the digest and should
not be repeated. What the file actually carries, counted from it: **Section 1
lists 18 states the method has no answer for**, and **Section 16 is a separate
catalogue of 24 rows carrying 18 DISTINCT messages** (six messages appear
twice, because three guards have two entry points and three catch two
different bad values). 18 and 24 are different counts of different things and
neither is 21.

### REPAIR HISTORY IS NOT TEACHING TRUTH. Do not quote these to a writer.

Everything in this section 8 is true of the WORK and is not printed by
`digest.txt`. That distinction cost a writer real effort once already, so it
is marked here rather than left to be rediscovered. A figure that is not a
digest line is not available to a lesson, a bank question or a panel,
whatever its provenance. The following are all repair history:

- the 75 psi ascent error and the 10 to 50 psi descent errors of the old
  bracket;
- the claim that the corrected solve matches the closed-form inverse to about
  3e-16;
- the old code's mechanism, the `[14.7, p1]` bracket and its NaN branch;
- the refusal key names `{ error, stations, diedAtFt, diedAtPsia }`;
- the statement that the traverse "used to return a number";
- the 21 named refusals corrected immediately above.

**The digest-grounded replacement is better than any of them**, and it is what
a writer should reach for: Section 10's ceiling table prints the ceiling
falling **65.035343 psi BELOW the inlet up 3000 ft** and rising **70.423606
psi above it down 3000 ft**, on the same trunk. An inlet-capped bracket is
therefore too short on a descent and too long on a climb, and both halves of
that sentence are engine values on one printed row. **Not repaired, and still teaching
material:** G1 the transition discontinuity, G2 the missing convergence
flags, G3 Colebrook past its roughness, G5 the traverse's absent `sumK`, G6
`erosionalC`'s wrong label (it belongs to a table PD1 and the wellhead studio
also read), and G7 `maopPsig` without the allowance.

`structure.py` and `wave.json` were re-cut against this: **Expert m04** moved
from "What It Accepts and Should Not" to "What a Refusal Is" on digest
Section 16, **Professional m04** was rebuilt around the ceiling with the
ascent promoted to its own lesson, and **Professional m05 l04** was retitled
because the traverse now refuses with its evidence rather than returning a
number. Lesson counts are unchanged at 6 modules and 26 lessons a tier.

### Three corrections to figures I recorded

1. **Test counts.** My original report said "33 engine tests". That was the
   line-hydraulics suite's 15 plus `production.choke.test.js`'s 18, conflated
   into one figure and attributed to one suite. Re-run and counted here: the
   line-hydraulics suite is now **28**, choke is **18**, **46 together**.
2. **An eleventh fail-silent existed and I missed it.** `liquidLineTraverse`
   had no inlet-pressure guard and returned NaN stations with no error. My
   section B listed ten.
3. **`fiscalConventions.js` is present-but-stale in the NextGen vendored
   tree, not missing** (it matches engines `ab93fdd9`). `irrContract.js` IS
   missing from NextGen, and both are missing from the Suite's vendored tree.
   This did not appear in my own recon and is recorded here so the correction
   is not lost.

A fourth correction, on my own analysis rather than a count: **my D1 finding
said the outlet bracket failed on descents only. It also failed on ascents,
and worse** — the old NaN branch walked the lower bound up through a ceiling
that sits below the inlet, so any rate a climbing line could carry returned
the inlet with `dpPsi: 0`, 75 psi wrong at 1e6 scfd up 3000 ft on the
finding's own line. An ordinary uphill gathering line, silently wrong. The
ascent is now the better teaching example and Professional m04 l05 is built
on it.

### Recorded, not acted on: three pieces of live PD1 `nodal` prose

The barrel unification moves `erosionalRateBpd` and `mixtureVelocityFtS` by
5.94e-8 **onto** their goldens. **Nothing graded moves anywhere** — no
capstone field in any course is an erosional rate. But three pieces of LIVE
PD1 `nodal` content (two lessons and one applied migration) quote erosional
rates that are now stale at the eighth significant figure. **This belongs to
a later PD1 recut and must not be actioned inside FC2.**

### Reproducing the golden count

    python3 -c "import json,glob; print(sum(len(json.load(open(p))) if isinstance(json.load(open(p)),list) else 1 for p in glob.glob('tools/course-waves/linesizing/goldens/*.json')))"
