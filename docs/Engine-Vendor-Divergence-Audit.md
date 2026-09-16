# Engine vendor divergence audit: NextGen vendored engines vs canonical

Audit date: 2026-09-16. Author: Claude Opus 5 (1M context), on owner
delegation ("decide, record, never stop to ask").

**This document is an audit. No engine file was changed, pulled or
reconciled in producing it. The deliverable is a plan.**

## References measured

| Tree | Ref measured | Files |
|---|---|---|
| Canonical engines | `/root/petrolord-engines` at `709172f` (= `origin/main`) | 738 tracked |
| Suite vendored | `petrolord-suite` `origin/main` `4b160e204`, `packages/engines/` | 738 |
| NextGen vendored | `petrolord-nextgen` `origin/main` `dfa98dd7`, `packages/engines/` | 520 |

Method: every tracked path in each tree was listed with its git blob
hash (`git ls-tree -r`), the vendored prefix `packages/engines/` was
stripped, and the three lists were joined path by path. This is a
file-for-file identity comparison over the complete tree, not a range
diff and not a marker spot check. Both of those have already failed on
this programme, which is why neither was used.

A note on method that matters: the local working checkouts of both
repos were **stale** against `origin/main` when this audit began
(NextGen local `main` was at the EC2 commit, eleven commits behind).
Measuring those would have produced wrong numbers. Everything below is
measured against fetched `origin/main`.

## 1. The exact divergence

### Suite vs canonical: identical

**0 missing, 0 extra, 0 differing across all 738 files.** The Suite's
vendored tree is byte-for-byte canonical `709172f`. The Suite's
production apps run exactly the canonical engines.

This corrects a note in `hostinger-deploy-procedure.md` (the
"CANONICAL ... BOTH the Suite and NextGen vendored trees have 11"
paragraph) which records the Suite as missing
`engines/economics/irrContract.js` and
`engines/economics/fiscalConventions.js`. The Suite has both. That note
described a state since repaired, most likely by Suite #486
(`feat/engines-batch-ec-d1-fc1`).

### NextGen vs canonical: diverged

Whole vendored tree: **221 missing, 3 extra, 132 differing.**

| Area | Canonical | NextGen | Missing | Differing | Extra |
|---|---|---|---|---|---|
| `engines/` | 273 | 211 | **62** | **55** | 0 |
| `__tests__/` | 179 | 107 | 74 | 31 | 2 |
| `test-data/` | 172 | 130 | 43 | 22 | 1 |
| `tools/` | 84 | 45 | 39 | 19 | 0 |
| `lib/` | 24 | 21 | 3 | 4 | 0 |
| root files | 6 | 6 | 0 | 1 | 0 |

The 3 extra files are NextGen-authored and never upstreamed:
`__tests__/sim.ekene.test.js`, `__tests__/waterflood.ekene.test.js`,
`test-data/ekene-dynamic/sim.json`. These are the same class of
Suite-only file that the 2026-09-14 subtree pull silently deleted from
the Suite. A naive `git subtree pull` into NextGen would delete them.

### Which inherited figures were wrong

| Inherited claim | Verdict | Measured |
|---|---|---|
| "missing 30 engine files" | **WRONG** | 62 under `engines/`, 221 across the tree |
| "differs in 55" | **CORRECT** for `engines/` | 55 engine files, but 132 tree-wide |
| "11 `engines/facilities` modules" | **WRONG** | 13 facilities modules |
| "whole directories including `engines/downstream`" | **INCOMPLETE** | FOUR whole directories: downstream (11), facilities (13), stratigraphy (11), wellsite (11) |
| `earthmodeling/adjust.js`, `petrophysics/conditioning.js` missing | CORRECT | both confirmed |
| differing `cashflow.ts`, `montecarlo.ts`, `portfolio.js`, `voi.js`, "all seven `economics/fdp/*`" | CORRECT | 7 of the 12 fdp files differ |

## 2. Blast radius: what live courses actually use

NextGen `src/` imports 147 engine paths directly. Following relative
imports inside the vendored tree adds 18 more, for a **reachable
closure of 165 engine files**.

- **Missing files reachable from a live course: 0.** There are no
  broken import edges in the vendored tree today. Nothing is missing
  that NextGen currently calls.
- **Differing files reachable: 50 of 55.** The 5 unreachable ones are
  hygiene only: `economics/montecarlo.ts`,
  `petrophysics/digitizer.js`, `petrophysics/pipeline.js`,
  `seismolord/horizonAmplitude.js`, `seismolord/segyScan.js`.
- **24 of the 44 live courses import at least one differing engine
  file.** 18 live courses import engines but none that differ.
  2 (`reservoircalc`, `rockphysics`) import no engine directly.

### The 62 missing files split cleanly in two

**46 are out of NextGen's teaching scope** and their absence is
consistent with how NextGen vendors. Every NextGen vendoring commit is
per-domain by name ("re-vendor the production domain at engines
`5733550`", "vendor the welltest domain, opening the RC7 gate"). The
four wholly absent directories (downstream, facilities, stratigraphy,
wellsite) have **no NextGen course and no panel**. The live catalogue
is 44 courses across drilling 12, geoscience 10, production 9,
reservoir 7, economics 6. None of them teach those domains.

**16 are in-scope gaps**, and these are genuine partial-pull damage:

```
engines/earthmodeling/adjust.js          engines/petrophysics/perm.js
engines/earthmodeling/derived.js         engines/petrophysics/probabilistic.js
engines/economics/irrContract.js         engines/petrophysics/scanTrace.js
engines/petrophysics/conditioning.js     engines/petrophysics/swClay.js
engines/petrophysics/matrix.js           engines/petrophysics/temperature.js
engines/petrophysics/mineral.js          engines/seismolord/flatten.js
engines/petrophysics/normalize.js        engines/welldata/checkshots.js
                                         engines/welldata/lasBlocks.js
                                         engines/welldata/lasWrite.js
```

Of these, exactly one is load-bearing for a future pull:
**`economics/irrContract.js` is imported by three canonical economics
siblings** (`cashflow.ts`, `screening.js`, `fiscalRegime.js`). Pulling
any of those three without it breaks the build. The other 15 are
imported by nothing NextGen has.

## 3. The behavioural question: run it, do not read it

Two full runs of NextGen's own 107 vendored engine test suites, using
canonical's `node_modules` and the vendored `jest.config.cjs`:

| Run | Engines under test | Result |
|---|---|---|
| Control | NextGen vendored `engines/` + `lib/` | 24 failed / 3519, 2 suites |
| Experiment | canonical `709172f` `engines/` + `lib/` | 375 failed / 3584, 18 suites |

Everything else (the test files, the goldens in `test-data/`) was held
constant at NextGen's vendored copy, because those goldens are what
NextGen teaches.

Test-by-test transition analysis:

- **352 tests pass on the vendored engines and fail on canonical.**
  These are the value-moving differences: canonical produces something
  other than what NextGen currently teaches.
- **1 test fails on vendored and passes on canonical**: `golden:
  schedule empty schedule: no window, so the duration is null`.
  Canonical fixes a defect NextGen currently ships.
- **23 fail on both**, so they are pre-existing breakage, not a
  divergence effect.
- 65 test cases exist only in the canonical run (canonical's
  `smoke.test.js` globs more engine files, because there are more).

### The control run is itself a finding

**The NextGen vendored tree is not self-consistent today.** 24 of its
own tests fail against its own engines, in
`economics.fdp.test.js` (22) and `economics.screening.test.js` (2).
NextGen has pulled newer tests and goldens for those two areas than the
engine code beside them. Nothing catches this, because these tests
never run (see section 6).

### Where the 352 moves are, and what kind

| Suite | Moves | Character of the change |
|---|---|---|
| `economics.cashflow.test.ts` | 132 | `ENGINE_VERSION` 3.9.0 to 3.10.0; CIT allowance carryforward added; `irr()` replaced by `irrResult()` on the IRR band contract |
| `economics.fiscal.test.js` | 56 | IRR now returns `null` where NextGen returns a number; tier tables ordered and duplicate thresholds refused; golden cashflow disagreement of 124.58 on `flat_test_project` |
| `economics.afe.test.js` | 36 | `itemForecast` split into `itemForecastCheck`; metrics return `null` where NextGen returns `1`; progress above 100 now throws |
| `economics.portfolio.test.js` | 30 | typed input guards throw where NextGen coerced; knapsack optimum 6002 to 5995 |
| `production.liftscreening.test.js` | 20 | **return shape changed** (`got.map is not a function`) |
| `production.liftadvisor.test.js` | 19 | plunger GLR 300 to 3000, a 900 percent move; rod ladder field removed |
| `economics.fdp.test.js` | 13 | empty schedule window 0 to `null`; `abex` added to cash flows; screening recovery per well stated |
| `production.esp.test.js` | 12 | `ampacityOk` renamed to `ampacityChecked` **with its meaning inverted** |
| `production.gaswell.test.js` | 9 | real-gas density 28.9647 to 28.9625; loading-fluid field removed |
| `production.surveillance.test.js` | 7 | exception ordering changes (`P-1` becomes `P-2`) |
| `production.flowassurance.test.js` | 7 | JT arrival temperature 16.0 to 10.42, a 34.9 percent move |
| others (gaslift, nodal, network, intervention, decision, screening, seismolord) | 9 | guard and ordering changes |

### Differences that are NOT value-moving

Read in full and confirmed cosmetic, all of them instances of the
owner's no-dash copy rule being applied upstream:
`aquifer/aquiferInflux.js`, `waterflood/waterflood.js`,
`seismolord/segyScan.js` (warning strings only).

Display precision only, the computed value does not move:
`drilling/cementing.js` (ECD printed to 1 dp, standoff to 2 dp),
`waterflood/vrrLedger.js` (allocation sums printed to 6 dp).

Comment and documentation only in every hunk inspected:
`production/pipeSchedule.js`, `production/gasProperties.js`.

Purely additive, existing values unchanged: `economics/fiscalConventions.js`
(adds `formatMillionUSD`), `wellcorrelation/section.js` (accepts a new
`{fwd, inv}` shift mapping alongside the old numeric shift).

## 4. The graded-value question

Production holds **132 active capstones across the 44 live courses, 793
graded fields**, three tiers each at six fields.

**The decisive finding: live graded values today match the VENDORED
engines, not canonical.** Verified by reading production directly
(read-only):

- `cashflow` beginner still holds `jv_2033_gross_revenue_usd =
  83024596.47999997`, `jv_total_boe = 6788275.2`,
  `jv_government_take_pct = 80.07659344822196`; intermediate holds
  `jv_dpi = 0.14002119133320534`. These are the **pre-recut** values.
- `fiscal` advanced still holds `cmp_psc_capex_loss_seven_point_musd =
  140.9798310836312`, the field the EC2 recut retires.
- `uncertainty` advanced still holds `um_mc_low_case_p90_npv_musd =
  22.343849110253952`, the EC3 pre-recut value.

So NextGen is internally coherent right now: the labs run the vendored
engines and the graded answers were computed from them. A learner today
can reproduce the graded answer in the lab. **What a learner cannot do
is reproduce it in the Suite production app, which runs canonical.**
That is the real defect, and it is live.

Three recut migrations are already written in this repo and are **NOT
applied to production**:

| Migration | Fields moved | Published before -> after |
|---|---|---|
| `20260920_ec1_recut_cashflow_capstone.sql` | 4 | gross revenue 83024596.48 -> 66419677.18; total boe 6788275.2 -> 5430620.16; take 80.0766 -> 75.0957; dpi 0.140021 -> 0.175026 |
| `20260920_ec2_recut_fiscal_capstone.sql` | 1 retired, 1 added | `cmp_psc_capex_loss_seven_point_musd` 140.9798 retired; `cmp_psc_capex_loss_last_tenth_musd = 28.127858185420223` added |
| `20260919_ec3_recut_uncertainty_capstone_and_structure.sql` | 4 | p90 22.3438 -> -9.4588; p10 70.7747 -> 103.7214; emv 46.5105 -> 44.9074; floor 22.3505 -> -9.4434 |

These nine field movements are already quantified and guarded. They are
the known, prepared part of the reconciliation.

### Graded fields at risk, by course and tier

Every tier of these courses grades six fields, and each course imports
at least one engine file that the experiment proved value-moving.
Fields are at risk until recomputed, not proven to move.

**Economics, 108 fields (6 courses x 3 tiers x 6):**

| Course | Tiers | Engine files driving the risk | Prepared? |
|---|---|---|---|
| `cashflow` | all 3 | `economics/cashflow.ts` | yes, EC1 recut, 4 fields |
| `fiscal` | all 3 | `fiscalRegime.js`, `fiscalConventions.js` | yes, EC2 recut, 1 field |
| `uncertainty` | all 3 | `economics/screening.js` | yes, EC3 recut, 4 fields |
| `decision` | all 3 | `decisionTree.js`, `voi.js` | **no** |
| `portfolio` | all 3 | `portfolio.js`, `afe.js` | **no** |
| `fdp` | all 3 | all 7 differing `economics/fdp/*` | **no** |

EC4 (`decision`), EC5 (`portfolio`) and EC6 (`fdp`) went live on
2026-09-15 with **no recut prepared**, and their suites show 2, 30 and
13 moves respectively.

**Production and other, 162 fields (9 courses x 3 tiers x 6):**

| Course | Concrete risk |
|---|---|
| `esp` | `ampacityOk` to `ampacityChecked` with inverted meaning. This is a **code break, not just a value move**: `espLab.js` reads `c.ampacityOk` at four sites and `espLab.test.js` asserts a whole teaching claim, "selectCable ampacityOk is true by construction on the shipped table". Advanced grades `cable_drop_pct`, `cable_loss_kw`, `motor_amps_a`, `surface_kva`. |
| `surveillance` | `allocation.js` zero-cap semantics reversed. Grades `alloc_oil_factor_last_day`, `alloc_oil_factor_last_day_with_invalid_tests`. |
| `rodpump` | `rodString.js` resonance grid bug fixed upstream. Grades `string_natural_freq_spm` directly. |
| `flowassurance` | JT arrival temperature moves 34.9 percent. Grades `jt_arrival_temp_f`, `arrival_temp_f`. |
| `gaswell` | plunger and critical-rate fields; density move. |
| `gaslift`, `nodal`, `network`, `intervention` | guard and ordering moves, 1 to 2 each |
| `seismolord` | Irap rotation refusal removed upstream; import guard only, no graded field identified |
| `cementing` | printed precision only, **no graded value moves** |
| `waterflood`, `mbal`, `mapping`, `petrophysics`, `welldata`, `welldesign`, `welltest`, `wellcorrelation` | their suites did not fail; differences are cosmetic or additive |

## 5. Reconciliation plan, ordered by risk

**Group 0. Keep deliberately, and record it.** The 46 engine files in
downstream, facilities, stratigraphy and wellsite, plus their tests,
goldens and oracles. NextGen has no course in those domains. Vendoring
them adds four domains of dead code to a learner-facing bundle for no
teaching benefit. Recommendation: **do not pull them.** Declare them in
a vendor manifest as an intentional domain allow-list so the absence
stops reading as damage. Work: 1 hour, inside Group 1.

**Group 1. Pull now, zero blast radius.** The 5 unreachable differing
files (`montecarlo.ts`, `petrophysics/digitizer.js`,
`petrophysics/pipeline.js`, `seismolord/horizonAmplitude.js`,
`seismolord/segyScan.js`) and the 15 in-scope missing files that
nothing imports. No course reaches them, so nothing can move. Ship with
the vendor manifest and the CI check from section 6. Work: half a day.
Risk: none.

**Group 2. Cosmetic and additive, pull with a copy pass.**
`aquifer/aquiferInflux.js`, `waterflood/waterflood.js`,
`drilling/cementing.js`, `waterflood/vrrLedger.js`,
`production/pipeSchedule.js`, `production/gasProperties.js`,
`economics/fiscalConventions.js`, `wellcorrelation/section.js`. No
graded value moves. Lesson text that quotes a warning string verbatim
must be re-read, and `cementing` intermediate prose that quotes the ECD
figure must match the new precision. Work: 1 to 2 days. Risk: low,
falsifiable by re-running the course guard tests.

**Group 3. Production domain, re-vendor plus recut.** The 22 differing
`engines/production/*` files behind `esp`, `surveillance`, `rodpump`,
`flowassurance`, `gaswell`, `gaslift`, `nodal`, `network`,
`intervention`. 80 test moves. Requires, per course: re-vendor, rerun
the lab, recompute the 18 graded values, write a guarded recut
migration in the EC1 pattern, and re-read the lesson text that quotes a
moved number. **`esp` additionally needs a source change** to
`espLab.js` and `espLab.test.js` for the `ampacityChecked` rename and
its inverted meaning, and one ESP teaching claim is now false and must
be rewritten rather than recut. Work: 2 to 3 days per course, so 3 to 4
weeks. Risk: high, 162 graded fields in scope.

**Group 4. Economics domain, the largest and most prepared.** The 16
differing `engines/economics/*` files plus `irrContract.js`, which must
land in the same commit as `cashflow.ts`, `screening.js` and
`fiscalRegime.js` or the build breaks. 271 test moves.
- EC1, EC2, EC3: recuts already written and guarded. Apply them in the
  same deploy window as the pull. Work: 2 days including the upload
  gate.
- EC4, EC5, EC6: no recut exists. Each needs the full EC1 treatment.
  Work: 2 to 3 days each.
- Fix the 24 pre-existing control failures first, since `fdp` and
  `screening` are already inconsistent before anything is pulled.
Work: 2 weeks. Risk: highest, and it carries live graded fields.

**Ordering rule.** Group 4 before Group 3 despite being harder, because
its recuts are already written and because Economics is where the live
inconsistency with the Suite is provable today. Within any group, never
pull an engine file without applying its recut migration in the same
deploy window: the labs and the graded answers must move together or
learners see a lab that disagrees with its own grader.

**What not to do.** Do not `git subtree pull` the whole tree. It would
add four out-of-scope domains, delete the 3 NextGen-only ekene files,
and move roughly 270 graded fields in one commit with no recut.

## 6. How this happened, and the check that stops it

Three causes, all procedural:

1. **NextGen vendors per domain, by hand.** Every vendoring commit
   names one domain and one engines SHA. There is no record in the repo
   of which canonical commit the tree as a whole corresponds to, so
   "did the pull bring everything" has never had an answer to check
   against.
2. **The vendored engine tests never run.** NextGen's `npm test` is
   `vitest run`, and `vitest.config.js` sets
   `include: ['src/**/*.test.{js,jsx}']`. The 107 jest suites under
   `packages/engines/__tests__` are outside that glob. They are not run
   anywhere. This is why 24 already-failing tests sat unnoticed.
3. **CI does not look.** `.github/workflows/deploy.yml` runs `npm ci`,
   `npm run lint --if-present`, `npm run build`. A partial pull builds
   fine, so it looks successful.

The recorded procedure in `hostinger-deploy-procedure.md` already
carries the right rule from the 2026-09-14 incident ("after EVERY
subtree pull, diff `git diff --name-status <pre-pull> HEAD` against the
engines range diff; any extra path is damage"). That rule catches
**deletions during a pull**. It cannot catch **a file that was never
pulled**, which is this failure, nor can it catch drift that accumulates
between pulls. A range diff compares two canonical commits; it never
compares the vendored tree to canonical.

### Proposed check

Add `packages/engines/VENDOR.json`:

```json
{
  "canonical": "git@github.com:Petrolord/petrolord-engines.git",
  "commit": "709172f162e1063fb9958204ced726dbf66010fc",
  "excludedDomains": ["downstream", "facilities", "stratigraphy", "wellsite"],
  "localOnly": [
    "__tests__/sim.ekene.test.js",
    "__tests__/waterflood.ekene.test.js",
    "test-data/ekene-dynamic/sim.json"
  ]
}
```

Add `tools/check-vendored-engines.mjs`, which:

1. reads `VENDOR.json`;
2. runs `git ls-tree -r <commit>` against a canonical clone or fetch;
3. hashes the vendored tree with `git ls-files -s packages/engines`;
4. joins path by path and **fails** on any path that is missing,
   differing, or extra, unless it is covered by `excludedDomains` or
   `localOnly`;
5. prints the offending paths.

It is a tree listing and a hash join. It runs in well under a second
against a local clone, needs no build, and is exactly the comparison
this audit ran. Wire it into `.github/workflows/deploy.yml` before
`npm run build`, and make it the last step of every vendoring pass.

Second, cheaper still: add the vendored engine suites to CI with
`npx jest --config packages/engines/jest.config.cjs`. That alone would
have surfaced the 24 failures the moment they were vendored, and it is
the only check that catches a pull that is complete but internally
inconsistent.

Either check on its own would have caught this. The manifest check
catches missing and extra files; the test run catches incoherent ones.
Both are worth having, and neither is expensive.

## Appendix A. The 55 differing engine files

The 50 marked `*` are reachable from a live course.

```
* engines/aquifer/aquiferInflux.js      * engines/production/allocation.js
* engines/drilling/cementing.js         * engines/production/data/espCatalog.js
* engines/drilling/profileDesign.js     * engines/production/espDesign.js
* engines/earthmodeling/properties.js   * engines/production/espMotorCable.js
* engines/economics/afe.js              * engines/production/espPump.js
* engines/economics/cashflow.ts         * engines/production/flowlineThermal.js
* engines/economics/decisionTree.js     * engines/production/gasLiftDesign.js
* engines/economics/fdp/costCalculations.js      * engines/production/gasProperties.js
* engines/economics/fdp/economics.js             * engines/production/gasWellLoading.js
* engines/economics/fdp/facilitiesCalculations.js * engines/production/hydrateInhibition.js
* engines/economics/fdp/fdpCalculations.js       * engines/production/interventionDiagnostics.js
* engines/economics/fdp/scenarioCalculations.js  * engines/production/liftAdvisor.js
* engines/economics/fdp/scheduleCalculations.js  * engines/production/liftScreening.js
* engines/economics/fdp/wellCalculations.js      * engines/production/networkSolve.js
* engines/economics/fiscalConventions.js         * engines/production/nodal.js
* engines/economics/fiscalRegime.js              * engines/production/pipeSchedule.js
  engines/economics/montecarlo.ts                * engines/production/plungerLift.js
* engines/economics/portfolio.js                 * engines/production/pumpingUnit.js
* engines/economics/screening.js                 * engines/production/rodDynamics.js
* engines/economics/voi.js                       * engines/production/rodPumpDesign.js
* engines/mapping/surface.js                     * engines/production/rodString.js
* engines/mbal/mbalEngine.ts                     * engines/production/surveillance.js
* engines/petrophysics/crossplot.js                engines/seismolord/horizonAmplitude.js
  engines/petrophysics/digitizer.js                engines/seismolord/segyScan.js
  engines/petrophysics/pipeline.js               * engines/waterflood/vrrLedger.js
* engines/petrophysics/rw.js                     * engines/waterflood/waterflood.js
                                                 * engines/wellcorrelation/section.js
                                                 * engines/welldata/lasParse.js
                                                 * engines/welltest/derivative.js
```

## Appendix B. The 62 missing engine files

Out of NextGen scope, recommend keeping absent (46):
`engines/downstream/*` (11), `engines/facilities/*` (13),
`engines/stratigraphy/*` (11), `engines/wellsite/*` (11).

In-scope gaps (16): listed in section 2.

## Appendix C. Reproducing this audit

```bash
# three-way file-for-file compare
git -C /root/petrolord-engines ls-tree -r 709172f --format='%(objectname) %(path)' | sort -k2
git -C <repo> ls-tree -r origin/main --format='%(objectname) %(path)' -- packages/engines \
  | sed 's# packages/engines/# #' | sort -k2
# join on path, compare hashes

# behavioural experiment
cp -a <nextgen>/packages/engines T_base && cp -a T_base T_swap
rm -rf T_swap/engines T_swap/lib
git -C /root/petrolord-engines archive 709172f engines lib | tar -x -C T_swap
ln -s /root/petrolord-engines/node_modules T_base/node_modules   # and T_swap
(cd T_base && npx jest --ci --json --outputFile=base.json)
(cd T_swap && npx jest --ci --json --outputFile=swap.json)
# a test passing in base and failing in swap is a value-moving difference
```

All production queries used in section 4 were read-only
(`supabase db query --linked`, `select` only).
