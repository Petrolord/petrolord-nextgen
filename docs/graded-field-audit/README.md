# B5 graded-field audit

Every graded capstone field on the 65 live NextGen courses was checked: 195 capstones and 1171 fields.
The baseline is prod, which equals NextGen main 76cd1f35e. Everything was measured on a LOCAL scratch replay of main.
Production was never read.

A field is typed by the learner, and the grader passes it when `abs(answer - expected) <= tol`.
The audit asks three questions of each field. Together they are one question: can a learner who does the work get the mark, and can one who does not?

1. **Tolerance.** Is `tol <= 0` or near zero honest? Does the tolerance admit the precision the prompt itself asks for?
2. **Guessable.** Is the answer space so small that guessing beats working?
3. **Display.** Can the learner obtain the value within `tol` from what the app or panel actually prints?

Each field gets one class:
- `none`: honest as it stands.
- `tolerance`: the fix is a tolerance change.
- `display`: the fix is a print or input change in a panel or Suite app.
- `redesign`: the field is guessable, or ungradable as posed.

## Files

| File | What it is |
|---|---|
| `dump_fields.sh` | Dumps every live capstone from a local scratch container (`SCRATCH=b5-scratch`) into `caps.json`. It has no production path. |
| `caps.json` | The baseline dump: 195 capstones and 1171 fields, identical to main 76cd1f35e. |
| `probe/probe.audit.jsx` + `vitest.probe.config.js` | The panel probe. It renders every course panel in jsdom and replays every select and button one and two deep. It records every number the learner can see, with its context and printed precision. Output for all 65 courses is under `/root/b5/probe/`. It is an audit harness, so it runs on its own config and never in CI. |
| `annot/<course>.json` | Per-field annotation with evidence: the source (`suite-app`, `nextgen-panel`, `hand-calc`, `prompt-given` or `unobtainable`), the formatter's `path:line`, the printed precision, the display scale, the precision the prompt asks for, the answer space, the class, the fix and any owner decision. |
| `normalize.py` | Folds the reviewers' raw annotations into `annot/`, applying the lead review (see "Normalisation"). It also records the fixes this PR ships. |
| `audit.py` | The gate. It writes `fields.json` and `fields.csv`. |
| `fields.json` / `fields.csv` | The machine-readable per-field table: class, mechanical flags, rounding miss, leak, shipped fix and evidence. |
| `signhits.json` | Triage of the litsweep SIGN hits from #180. |

### The gate (`audit.py`)

`audit.py` computes each flag mechanically from the DB value and the annotated source precision:

- `zero_tol`
- `nonint_zero`: tol 0 on a non-integer.
- `prompt_short`: the value, rounded as the prompt instructs, misses by more than tol.
- `display_miss`: `|round(expected * scale, d) / scale - expected| > tol` at the precision the source prints.
- `guessable`: guess_p >= 0.5.

Any flag answered by class `none` fails the gate. So does an unannotated live field, or an annotation that names no live field.

    python3 audit.py                         # GATE GREEN, writes fields.json/csv
    python3 audit.py --selftest              # negative controls (below)
    python3 audit.py --post after.json       # after the recut, on the scratch replay

**Controls.** `--selftest` plants each defect in a copy of the input, and the gate must go red on every one:

- a non-integer zero tolerance
- the irrReason shape (-43.2259 printed to 1 dp against tol 0.01)
- a prompt asking for four decimals with a tighter tol
- a coin flip
- an unannotated live field
- an annotation for a field that is not live

It also runs the post-recut check three ways:

- every shipped fix applied: must be green
- one shipped fix missing: must be red
- an unnamed field moved: must be red

An empty sweep (no fields, or no annotations) exits 2. All controls hold.

**Re-running the probe.**

    npm i --prefix /tmp/b5jsdom jsdom
    B5_JSDOM=/tmp/b5jsdom/node_modules/jsdom/lib/api.js B5_OUT=/root/b5/probe B5_COURSES=welltest \
      npx vitest run --config docs/graded-field-audit/probe/vitest.probe.config.js

## Counts

| Class | Fields |
|---|---|
| none | 851 |
| display | 227 |
| redesign | 76 |
| tolerance | 17 |
| **total** | **1171** |

**Mechanical flags:**
- `display_miss`: 86
- `zero_tol`: 40 (all integers; 34 honest, 6 in redesigns)
- `guessable`: 14
- `prompt_short`: 3

Of the non-`none` fields, 310 carry an owner decision (319 before the round-off below took nine of them).

**Where a learner gets the number:**
- hand-calc: 450
- NextGen panel: 405
- **unobtainable: 188**
- Suite app: 121
- stated in the prompt: 7

**Leak.** For 295 fields in 21 courses, the answer itself is printed by the tier's own walkthrough lesson or by a panel's default state. This is not one of the three classes. It is reported as `leak` (see finding 3).

The per-course table is at the end.

## Ranked findings

### 1. 188 fields grade data or computations the learner has no route to (source `unobtainable`)

The prompt says the case is "supplied", or the value needs an engine-only step (DAK z, a pressure march, a turbulent network solve, a Monte Carlo sample). No panel can be set to the capstone case, and the Suite app either cannot take it or prints far too coarsely.

The worst cases are whole capstones:
- **integrity** (all 18): the KESTREL A-7 rosters, annulus ratings, TVDs and P&A depths exist only in the generator `/root/dr-wip-integrity/dr11_fields.mjs`. The beginner prompt also gives four of its six counts away. The advanced prompt is factually wrong on `program_slurry_takeoff_m3`: the engine sums designed plugs only (`plugAbandonment.js:248`).
- **wellcost** (all 18): the MERLIN A-12 programme exists only in `/root/dr-wip-wellcost/dr12_fields.mjs`.
- **gaslift** (all 18)
- **gaswell** (16), **hydraulics** (15), **producedwater** (14), **torquedrag** (13), **geomech** (12), **nodal** (12), **network** (11), **rodpump** (11), **cementing** intermediate (6).

**Recommendation (owner):** per course, choose between two routes.
- (a) Publish the inputs in the prompt. This is enough where a spreadsheet then reproduces the key: nodal's tubing constants 3835 / 600 / 0.000238, cementing's E x I = 12266792.85346564 N m2, stimulation's two pressures, producedwater's 15.56 C reference, the ADANGA yard coordinates, integrity and wellcost.
- (b) Give the tier's panel a typed "your case" mode that prints at the graded precision. This is needed wherever the value is engine-only: gaslift, gaswell, hydraulics, network, rodpump, geomech, torquedrag (a mud density box; the lab already accepts `mudDensityKgM3`), cementing placement, producedwater and perfsand.

Nothing here can be fixed by loosening a tolerance. There is no printed value to loosen towards.

Costed follow-on plan: [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) §1 (route per course, decision D1).

### 2. 86 fields: the source prints the value too coarsely for its tolerance (`display_miss`)

This is mostly the Suite apps, which print product-style precision against course-style tolerances:

| Suite app | Fields | What it prints |
|---|---|---|
| rotating (Pump and Compressor Station Designers) | 12 | 0 to 1 dp |
| portfolio | 10 | $MM as whole numbers; CPI 2 dp; SPI pinned to today |
| decision (tree and Decision Studio) | 8 | 0 to 2 dp; the prompt asks for 4 |
| separation | 7 | 1 to 3 dp; the prompt asks for 4 |
| crude (Product Blending Optimizer) | 6 | |
| uncertainty | 6 | compact "$45M" cards, 2 dp breakevens |
| fdp | 5 | irrReason 1 dp, facilities $M 1 dp, well cost $M 1 dp, SPI 2 dp with as-of pinned to today |
| relief | 5 | areas 3 dp |
| gasprocessing, linesizing, carbon, heattransfer, refinery | 11 | |

In the course panels:
- casingtubing: MPa to 3 dp against tol 50 Pa, and the 0.55 tension fraction cannot be selected.
- consequence: the view factor is chained through six-decimal flame inputs.

Where the lessons teach a hand route that reproduces the key (decision's rollback, portfolio's EMV, refinery utilisation, fdp well costs), no learner is locked out today. They are still graded against a number the named app cannot show them.

**Recommendation (owner):** where the prompt names an app and states a precision, the app should print that precision. The FDP irrReason is fixed here (Suite #553). For the rest, choose per course between a Suite print change (it reaches every Suite user) and the FC6 tolerance rule (see finding 5). The fiscal Designer's 8 fields already have reviewer-proposed tolerances.

Costed follow-on plan: [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) §2 (per-app pick, decision D3).

### 3. 295 fields in 21 courses: the answer is printed before the learner works

The tier's own "capstone walkthrough" or "story so far" lesson prints every graded value. Sometimes it is a table of field, value and tolerance, as in `reservoircalc/beginner/m06.../l03-the-capstone-walkthrough.md:9-16`. In other courses a panel opens on the capstone case and shows the answer on first render; the probe confirms these.

**All 18 fields:** basin, reservoircalc, sim, wellcorrelation, welldata, waterflood, dca, porepressure, earthmodel, mapping, rockphysics (19), petrophysics, fluid.

**Partly:** scal (14), mbal (13), welltest (9), welldesign (8), seismolord (8), perfsand (5), completion (2), wellcontrol (1).

These are the older Ekene and typewell courses. The newer FC, EC and H waves are guarded by `panelCapstoneGuard` and leakage gates, and the probe found no collisions on them.

**Recommendation (owner):** either re-case each capstone onto a case the panels do not preload and strip answers from the walkthroughs (the FC-wave pattern), or accept these capstones as open-book reading checks and say so. Removing them is a course rewrite, not a B5 fix.

Costed follow-on plan: [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) §3 (per-course pick, decisions D4 and D5).

### 4. 17 guessable or answer-by-construction fields

| Course / tier | Field | Guess probability | Why |
|---|---|---|---|
| seismolord / intermediate | `bulk_shift_ms` | 1.0 | the prompt and the panel subtitle say "arriving 8 ms late" |
| seismolord / intermediate | `corr` | 1.0 | exactly 1 by construction |
| petrophysics / intermediate | `pickett_a_rw` | 1.0 | the fit returns the given Rw 0.05 |
| petrophysics / intermediate | `pickett_m` | 1.0 | the fit returns the given m 2 |
| petrophysics / advanced | `sw_waterleg_mean` | 1.0 | 1 passes |
| mbal / beginner | `r_squared` | 0.5 | exactly 1 |
| mbal / advanced | `a111_index_sum` | 0.5 | exactly 1 by definition |
| mbal / intermediate | `pot_r2` | 0.5 | a guess of 1 passes at tol 0.002 |
| mapping / intermediate | `iso_live` | 0.5 | re-grades the beginner answer 201 |
| mapping / advanced | `live_with_e7` | 0.5 | re-grades the beginner answer 201 |
| integrity / beginner | four as-found counts | 1.0 | given in the prompt |
| rockphysics / advanced | `gas_class` | 0.25 | answer space 1 to 4; the lesson slug says "gas-is-class-three" |
| wellcorrelation / beginner, intermediate | two well counts over 4 wells | 0.25 | |

Also noted:
- **scal** advanced `fitted_nw`: the fit recovers its own plant, 2.5.
- **rodpump** beginner `string_natural_freq_spm`: the product of two prompt numbers.
- **sim** `validator_rules_refused` equals the fixture count.

Each annotation proposes a measured replacement the learner reads in the same panel, never an opaque label:
- `corr` becomes the zero-lag correlation, 0.621742, printed to 6 dp.
- `r_squared` becomes Eo at the last survey.
- `a111_index_sum` becomes `a111_ddi`.
- `gas_class` becomes the largest brine Shuey error.
- The Pickett fit is graded over a 2072 to 2078 m window.

**Owner decision:** every one of these re-keys a live field. The regrade impact for each is listed under "Regrade impact".

Costed follow-on plan: [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) §4 (wave W1).

**Also found:**
- **petrophysics** beginner: the whole capstone is auto-submitted. `PetrophysicsLearningPage.jsx:130` sends `capstoneAnswers(workflow)`, computed from pre-filled parameters, instead of typed answers, so one click passes. Recommendation: typed answers, like every other tier.
- **seismolord**: `tune25_amp` and `tune40_amp` have identical answers.

### 5. Tolerance

**Shipped here** (`migrations/20261022_b5_graded_tolerances.sql`, all loosenings to half a unit of the instructed precision, which is the FC6 rule):

| Course / tier | Field | Old tol | New tol | Why |
|---|---|---|---|---|
| separation / beginner | `ejulebe1_terminal_velocity_fts` | 1e-5 | 5e-5 | the prompt says "to four decimals" |
| separation / beginner | `ejulebe1_velocity_margin` | 1e-5 | 5e-5 | the prompt says "to four decimals" |
| separation / intermediate | `ejulebe2_gas_velocity_fts` | 1e-5 | 5e-5 | 0.5342 failed |
| separation / advanced | `ejulebe3_interface_height_ft` | 1e-5 | 5e-5 | 3.5273 failed |
| cashflow / intermediate | `jv_breakeven_oil_price_usd_bbl` | 0.001 | 0.005 | the prompt says "to the cent"; 66.10 failed by 0.00101 |
| completion / beginner | `drift_surface_casing_m` | 5e-8 | 1e-7 | 0.31137225 sits exactly on the 7th-decimal boundary; half-up rounding failed |

**Owner decisions:**
- **fiscal:** 8 Designer-read fields, from 0.001 or 0.0001 to 0.05 or 0.1, because the Designer prints `toFixed(1)`. The alternative is a full-precision export. **Shipped in the round-off** (`20261023c_ro_fiscal_tolerances.sql`, see below).
- **Tightenings** (these can turn a past pass into a fail, so check attempts first):
  - petrophysics `phind_avg_sand_a` and `phiw_avg_sand_a`: 0.005 to 0.002. A wrong-method value one click away passes today.
  - petrophysics `rw_arps` and `rwe_ssp`: 0.0005 to 0.00005. The known 0.05 passes today.
  - petrophysics `sw_waterleg_mean`: 0.005 to 0.0005.
  - mbal `pot_r2`: 0.002 to 1e-4.
  - earthmodel `krige_probe`: 0.001 to 0.0002. The naive mean shown by default passes today.
  - waterflood `hall_ratio_e4`: a default tile sits within tol.

  Costed follow-on plan: [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) §4 (decision D6).

**The 40 zero-tolerance fields are all genuine integers** (counts, grid sizes, a zero-based index, depths on a sample grid). They are honest wherever the source prints the integer (34). Six sit inside redesigns for guessability, not for their tolerance.

About 480 fields have a relative tolerance below 1e-6. That is honest only where the value is a taught closed form worked at full precision (hand-calc, 450 fields). The reviewers checked each by reproducing the key from the prompt inputs.

### 6. Content errors found on the way

- **cementing** advanced `min_standoff_rigid`: the graded value is the cased-hole blade ratio, while the prompt and lesson (l02:44) say the sag is subtracted in the open hole. Following them gives 0.65431, which fails. Owner: correct the copy, or regrade to the open-hole minimum. **Copy corrected in the round-off** (the engine is right; see below).
- **riskchange** intermediate `okomu_register_ratification_overdue` = 3: the engine returns "Not required" for an Emergency change that is not yet in effect (`managementOfChange.js:249-262`), and no lesson teaches it, so a learner following the lessons answers 4. Recommendation: keep 3 and add the rule to intermediate m05 l05 and m06 l02.
- **welldata** intermediate walkthrough still documented the retired `irregular_uniform (1 yes / 0 no)` field after its 2026-09-16 redesign to `irregular_samples = 121`. **Fixed here** (lesson copy).
- **gaswell**: the prompt says field 3 is the only hand-reachable value, but liquid per day is too. **Prompt corrected in the round-off.**
- **wellcontrol**: the dataset metadata says the shoe is at 1500 m, while the fixture and lesson use 1400 m. **Corrected in the round-off** (`20261023b_ro_capstone_wellcontrol_dataset.sql`).
- **compliance**: beginner m01 l02:35 says "you are not asked to count days on a calendar", but the capstone requires exactly that.
- **casingtubing**: g = 9.80665 is never stated, and `helical_limit_N` moves 45 N at 9.81 against tol 0.5 N. State g in the prompt. **Stated in the prompt and the capstone lesson in the round-off.**
- **welltest, welldesign**: values of 1000 or more print with a thousands comma, which the answer box rejects when pasted.

## Shipped in this PR and the Suite PR

1. `migrations/20261022_b5_graded_tolerances.sql`: the six loosenings.
   - Content-addressed: each field is guarded on its published tolerance and expected value.
   - Idempotent.
   - Proven on the scratch replay: 6 updated, re-run 0, `audit.py --post` CLEAN.
   - Logged PENDING in MIGRATIONS.md.
   - Owner script: `/root/b5-apply/apply.sh`.
2. **Suite PR #553**: FDP `irrReason` prints each IRR root to 4 dp (`-43.2259%`, 2.8e-5 from the key, where `-43.2%` missed by 0.0259). It reaches production with the next Suite zip.
3. The welldata intermediate walkthrough now matches the live field. It reaches production with the next NextGen zip.

## Round-off (2026-09-21)

The owner closed the B4/B5 stream with "fix the small items with the lead's best pick on each". The capstone half of that round-off:

| File | What | Rows |
|---|---|---|
| `20261023b_ro_capstone_cementing.sql` | advanced prompt: field 5 is the smallest rigid standoff over both bores, the blade ratio of each interval's bore less that interval's sag, zero where the well is vertical | 1 prompt |
| `20261023b_ro_capstone_casingtubing.sql` | advanced prompt: g taken as 9.80665 m/s2 | 1 prompt |
| `20261023b_ro_capstone_gaswell.sql` | advanced prompt: field 6 is the second hand-reachable value alongside field 3 | 1 prompt |
| `20261023b_ro_capstone_wellcontrol_dataset.sql` | beginner `dataset` text: the slant shoe 1500 m corrected to 1400 m, the fixture and lesson value (nothing reads `dataset`, so no answer moves) | 1 dataset |
| `20261023c_ro_fiscal_tolerances.sql` | the 8 Designer-read fiscal fields LOOSENED to what the Designer prints: 0.05 for a single toFixed(1) reading, 0.1 for a difference of two | 8 tolerances |

All five are generated by `roundoff_capstones.py` from a scratch replay, guarded like `20261022` (a prompt must hold its current or its corrected md5 and `fields` must equal the live value; a tolerance must hold its old or new value and its expected value), idempotent, and applied by `/root/roundoff-apply/apply.sh`, which refuses until the B4 fixes batch and `20261022` are applied. `normalize.py` records them as shipped, so `audit.py --post` checks the eight fiscal tolerances on the replay.

**The cementing decision.** The engine (`cementing.js` `standoffProfile`) is physically right, so nothing is regraded. It evaluates every 30 m interval as the blade ratio in that interval's bore less that interval's mid-span sag. The cased 13-3/8 inch bore (0.315341 m) is wider than the open hole (0.31115 m), so a 0.29 m blade stands the pipe off less there, (0.29 - 0.244475)/(0.315341 - 0.244475) = 0.6424096181525695, and the slant well is vertical to 500 m, so no sag is subtracted there. The open-hole minimum, 0.6827896512935882 less its sag, is 0.6543142173967237. The graded minimum is therefore the cased value, which is what a rigid spacer in a vertical, wider bore does. The prompt and advanced m06 l02 now say so in method terms without naming the answer. The lesson that teaches it already exists (advanced m04 l03, "it is worse for a rigid centralizer").

The bank half (sign hits, the crude gloss, earthmodel and seismolord) is in `docs/answer-length-audit/README.md` under "Round-off".

## W1 (grade integrity), 2026-09-21

The first wave of [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md). `w1_capstones.py` generates every file from `w1/<course>.json` (one spec per course, with the measured replacement, its annotation and the evidence) and its own `TIGHTEN` list, on a scratch replay of the post-20261023 state.

| Files | What |
|---|---|
| `20261024a_w1_<course>.sql` (13) | 15 re-keys, 8 tightenings (D6), and prompt copy: integrity beginner publishes both rosters, rodpump beginner drops the two figures whose product was the answer, seismolord intermediate stops stating the lag |
| `20261024b_w1_openbook_<course>.sql` (21) | D4 C: the open-book label as the first sentence of 57 capstone briefs; the same note heads each tier's capstone lesson |

Replacements, where they differ from the plan:
- `pickett_m_2072_2078` tol 0.0002: at 0.002 the NTG 0.878 printed in the lessons passes. The panel now prints m to 4 dp.
- `depth_at_p1_with_e7_m` tol 0.01: the drop-Ekene-4 reading sits 0.105 away.
- `fault_jump_y2200` tol 5e-5: every other method, nugget and range setting then fails.
- gasprocessing beginner is keyed `tegReboilerMMBtuHr`, because `reboilerMMBtuHr` is already an intermediate key.

Some replacements leak on arrival. Each one's spec records it and the open-book label covers it:
- seismolord intermediate `corr_zero_lag` (lessons and the panel's default state)
- mbal `eo_last_rb_stb` and `a111_ddi`
- rockphysics `brine_max_shuey_err`
- mapping `iso_nodes_above_well_mean` and `depth_at_p1_with_e7_m`
- earthmodel `fault_jump_y2200`

W5 re-cases or strips them with the rest of section 3.

**Guards.** Every row is addressed by its prompt md5 and its exact `fields` jsonb. It must hold its published form, which is rewritten, or its W1 form, which is left alone. A file that will write first checks the round-off post-state. A 20261024a file that moves a key or tolerance counts `academy_capstone_attempts` on each tier it writes and refuses if any exist. The exception is a tier that the D5 allowlist names with its exact attempt ids, and any other id still refuses. The allowlist is empty in W1. Stored scores are never touched.

**Gate.** `normalize.py` records each W1 fix with `wave: w1`:
- A re-key carries its replacement field and annotation.
- A key that survives with a prompt or panel fix moves class.

`audit.py --post after.json --wave w1` checks three things:
- every re-key is in place;
- every tightening is applied;
- each replacement is class `none` with no flag.

Without `--wave w1`, the same state is red. The round-off dry run, which runs before W1, is unaffected.

## W2 (publish inputs in prompts and lessons), 2026-09-22

The second wave of [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md): every section 1 row routed (a). **No key, expected value or tolerance moves**, so nobody is re-scored and no file carries the attempts guard.

| Course / tier | What is now published | Where |
|---|---|---|
| integrity int, adv | the D1 survey, both annuli row by row, the displacement case, g and the psi conversion; the five plugs, three geometries, zones and annular cement. The false field 6 sentence (the takeoff sums designed plugs only) and the single "35 percent excess" are corrected | prompt |
| wellcost beg, int, adv | the seventeen MERLIN A-12 activities; the ten line items and the cost per metre inputs; the items with the activity each lump is booked at, the five declared risk ranges, and W3's Suite case file with the Risk tab Full precision switch for the three seeded fields | prompt |
| nodal int, adv | `bhp(q) = pWh + 3835 / (1 + q/600) + 0.000238 q^2`, the 49 rates from one thousandth of the open flow, the inflow; the 900-point grid brackets exact crossings | prompt |
| gaswell beg | the Sutton pseudo-criticals and the Dranchuk and Abou-Kassem equation with its eleven constants (read from the vendored engine). z at the wellhead IS field 1, so it is not printed | prompt |
| gaswell int, adv | z at the four stations below the wellhead and at the plunger conditions, ten decimals (vendored `naturalGasZ`); the "only two values reachable by hand" sentence is corrected | prompt |
| cementing adv | E x I = 12266792.85346564 N m2 (vendored `stringProperties`) | prompt |
| stimulation beg | the frac and reservoir pressures at 2033.000 m TVD, the acid viscosity, the mD conversion | prompt |
| separation adv | the ADANGA yard as offsets from the datum, the Mapper scale factors and haversine radius; the fraction asked to six decimals (it failed at "four or better"); W3's sentence naming the Separator Studio and Mapper Full precision switch | prompt |
| producedwater beg | the crude chain with its 15.56 C reference | prompt and beginner m02 l04 |
| linesizing int | the Weymouth, Panhandle B and General Flow forms, base conditions, elevation group, Colebrook and the loop | intermediate m02 l01, l02, l03 |
| heattransfer int | the shells-in-series conversion and its R = 1 limit | intermediate m02 l01 |

**How the numbers are made.** `w2/build_specs.mjs` reads each capstone's own fixture (the `/root/dr-wip-*` generator, the committed course-wave generator or the course lab's capstone block) and the vendored engines, renders the prompt and lesson text from those values, and refuses to write a spec (`w2/<course>.json`) whose published inputs do not reproduce the live key through the engines (`w2/reproduce.mjs`). Where it prints an equation (DAK, the crude chain, the transmission forms, the shells-in-series conversion) it also evaluates the printed text independently and refuses if that misses the key. `w2_capstones.py` turns the prompt edits into `migrations/20261025a_w2_<course>.sql` (8 files, 14 prompts), guarded like W1: each row's prompt md5 and exact `fields` jsonb, or its W2 form; W1's post-state checked first; re-run writes nothing. Owner script `/root/w2-apply/apply.sh`.

**Gates.** `src/lib/w2PublishedInputs.test.js` (CI) re-runs the engines on every committed spec, checks every published number is in the prompt the migration writes and every lesson insertion is in its file, and carries two negative controls (a perturbed input breaks the reproduction on every tier; a number dropped from a prompt is caught). `audit.py` gains the `no_route` flag (source `unobtainable`; class `none` with it is an error, a new selftest control), and `--post --wave w2` requires each W2 prompt to carry its published text (a selftest control and the dryrun both prove the pre-W2 state is red).

**What moves class.** 68 fields: 63 from `unobtainable` to `hand-calc` class `none` (gaswell 16, wellcost 15, integrity 12, nodal 10, linesizing 4, cementing 2, separation 2, stimulation 1, heattransfer 1); the three wellcost advanced seeded fields from `unobtainable` to `suite-app` (W3's case file, Suite #568); producedwater beginner `ogulagha_oil_density_kgm3` (redesign); and linesizing `brass_outlet_pressure_psia` (the Weymouth inversion is now a hand step). `no_route` falls from 185 to 119. The four linesizing BRASS fields that have no Suite surface rest on the lessons alone, and `audit.py --post --wave w2` checks each lesson carries its printed form (a selftest control drops one).

**Suite gate.** The separation and wellcost files name W3's Suite Full precision switch (and the case file), so `/root/w2-apply/apply.sh apply --prod` holds them until `SUITE_W3_LIVE=yes`, after the Suite zip carrying #554 to #568. The other six files can go at once.

**Left for later waves.** nodal intermediate `liftgas_valve_pwf_psia`, `liftgas_mid_pmf_psia`: a 20-step Cullender and Smith march with z at trial pressures, which the (a) route does not reach; W4 panel mode. W4b also edits the producedwater beginner prompt: whichever of W2 and W4b merges second regenerates its file on the other's post-state.

Lessons reach learners with the next NextGen zip: linesizing intermediate m02 l01, l02, l03; heattransfer intermediate m02 l01; producedwater beginner m02 l04.
## D2: the panel guard policy for typed modes (W4)
Owner decision D2 (2026-09-21) changes what `panelCapstoneGuard` forbids. The old rule was "no panel can reach the capstone case". The rule now is "no panel DEFAULT state lands on a graded answer". A route (b) tier gets a typed "your case" mode, and a learner who types the capstone's inputs reads its answers: that is the work the capstone asks for.
The rules live in one place, `src/components/course/panels/typedCaseGuard.js`, and every course guard that covers a typed mode imports them:
1. **Default state.** Each typed mode is run at its default inputs through the function the panel calls, and everything it returns is swept against every graded answer at ten grading bands (absolute tolerance), in the five shiftings (as graded, x1000, x0.001, psia/psig).
2. **Preload detection (kept).** The mode's defaults, and every preset bundle a panel offers, share no capstone-distinguishing input with the capstone case. The key list is itself checked: each key must be a capstone input that no published teaching case shares. A single-input option (0.55 among the axial fractions) is typing; a bundle that sets the case is a preset.
3. **Naming and literals (unchanged).** No panel source names a capstone reader or prints a graded answer as a decimal literal at six significant digits or more.
The route itself is proved too: `typedRouteMiss` types the capstone's stated inputs and reads the graded answer at the panel's print precision. `typedCaseGuard.test.js` carries a negative control for every rule (a capstone default, a coincident default, a unit-shifted default, a preset carrying one capstone input, a renamed input, a coarse print, a named reader, a literal) and runs the rules on the live rod pump typed string view from W1.

## W4a (typed-case panel modes, drilling rows), 2026-09-22

Section 1 route (b) for the drilling rows, and the section 2 casingtubing panel row, built under D2 (see the section above). One PR per course, stacked: #202 (D2 policy), #204 (casingtubing, welldesign, and the `audit.py` route check), #206 (torquedrag, `w4a_capstones.py`), #208 (perfsand), #214 (geomech), #218 (hydraulics), #226 (cementing).

| Course | Tiers | Panel change | Fields leaving no-route or display |
|---|---|---|---|
| casingtubing | beg | 0.55 axial fraction; ratings in whole Pa; D over t to 10 dp | 4 |
| welldesign | int | north-north variance tile; opens on station 180 (was 267, the capstone station) | 1 |
| torquedrag | beg, int, adv | mud density box on all three explorers; N to 2 dp, N.m to 3 dp; three-row wear schedule | 13 |
| perfsand | adv | Top and Bottom boxes on the Sanding view; zero-margin boost to 8 dp | 4 |
| geomech | int, adv | a box per parameter (and UCS) on the stability and window views; collapse and fracture initiation at the tightest point | 12 |
| hydraulics | beg, int, adv | Your mud boxes (four readings, density) on all three explorers; MPa to 6 dp; open swab tile; yield rule taught in beg m02 l04 | 15 |
| cementing | int | Your job view: every placement input as a box, rate window bisected | 6 |

Each course has a `panelCapstoneGuard.test.js` on the D2 rules. `w4a/<course>.json` records each field's new annotation and its `route`; `normalize.py` folds them in with `wave: w4a`, and `audit.py` fails a field that ships a route but is still `unobtainable`, is not class none, or records no printed precision (two new selftest controls). Where a brief had to point to the new view, `w4a_capstones.py` writes a prompt-only `20261027a_w4_<course>.sql` (5 files, 10 tiers), applied by the owner with `/root/w4a-apply/apply.sh` after W1. No key, expected value or tolerance moves.

Findings on the way, both pre-existing and pinned as the only known exceptions in their guards:
- perfsand advanced `gauge_margin_m` (87 um) is an entry of the discrete gauge series that the Gravel view's table prints by default.
- hydraulics beginner `hb_tau_y_Pa` equals the light mud's measured 3 rpm stress (4 dial degrees) in the rheology explorer's default residual table, because the capstone mud's 2 x theta3 less theta6 is also 4 degrees. Fixing it needs a re-key.
## W5, builder D (section 3 pick B: strip), 2026-09-22
Pick B keeps every key, expected value and tolerance on a tier. It removes the places that printed the answers before the learner worked, then takes the W1 open-book label off the brief (`20261028d_w5_<course>.sql`, generated by `w5d_capstones.py`) and off the tier's capstone lesson. Each brief becomes its pre-W1 text again. Nothing re-grades, so there is no attempts guard, but every row is still content-addressed. Owner script: `/root/w5d-apply/apply.sh`, near-simultaneous with the NextGen zip.
**The gate.** `src/components/course/panels/<course>/capstoneLeak.test.jsx`, built on `panels/leakStripGate.js`. For every stripped tier it proves:
- no lesson of the course prints a graded answer, in any tier (module 1 of every tier is open to every learner);
- no panel of the course prints one on first render, rendered as the host renders it;
- the page intro prints none;
- the capstone lesson carries no open-book note.
The graded answers come from the lab's `capstoneValues()`, which runs the vendored engine, and the engine is checked against the published values first. A printed number counts as a leak when a learner could copy it and pass: it sits within the grader's own tolerance, in either sign, in the unit shiftings the graded unit allows. Each gate has negative controls: the panel rendered at the default it shipped with, the page figure at its old precision, and a graded answer planted in a lesson. Each must be caught.
`normalize.py` records a stripped tier on every field as `stripped` (wave `w5d`) with `leak: false`. `audit.py --post after.json --wave w5d` then checks that the brief carries no label and equals its pre-W1 text, and `--selftest` plants a still-labelled brief and a drifted one.
| Course | Tiers stripped | What printed the answers | Fix |
| welldesign | beginner, advanced | the survey listing opened on the feet golden well; the clearance ladder opened on offset 10; the page intro printed offset 10's separation factor to 3 dp (-0.607, inside tol 0.0005; found by this build) | listing opens on the 131-station teaching well; ladder on offset 05; the intro prints 2 dp |
| completion | beginner | the string explorer's drift table opened on every catalog row and printed both graded casing drifts to 7 dp | the table opens on the tubing class; placing each casing in its class is what the capstone tests |
| wellcontrol | beginner | three Expert module 1 lessons printed the slant shoe and bit TVDs (two graded Associate answers) to 12 dp; the audit's single flag (a panel readout) was not the leak | the lessons round the slant depths to 1 dp and say why; the volume explorer already opened on the horizontal well |
| perfsand | advanced | nothing, re-measured: four of the five B5 flags came from a sentence saying the lessons print no stress or strength numbers, and the gauge margin is one row of the seven-row gauge table (choosing the row is the work) | label and lesson note removed; no lesson or panel change needed |
**Held:** welldesign intermediate. `UncertaintyExplorer.jsx` opens on station 267, the capstone station, and the file belongs to W4a's typed-mode work. The gate asserts that tier still leaks and keeps its label.
**After a strip, the W1 open-book file for that course reads the stripped tier as its published form and would put the label back.** It is SUPERSEDED. Do not re-run `/root/w1-apply/apply.sh apply --prod` after a W5d file is applied.
## W5 (leak re-case and strip): shared tooling
Section 3 of [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md). W5 is built course by course by several agents (W5a, W5b, ...). They share one generator and one audit path, added before any course lands:
| File | What |
|---|---|
| `w5_capstones.py` | Writes each course's migration from `w5/<course>.json` on a scratch replay of the post-W1 state. Pick A (re-case) replaces a tier's prompt, title, dataset and every field; the new fields are read from the course's engine-generated `fields_file`, never typed. Pick B (strip) edits the prompt only (the open-book label comes out). Rows are content-addressed; a file that moves a key carries the attempts guard with the D5 allowlist (`ALLOW`, empty). `--check` fails if a committed file differs from a regeneration. |
| `normalize.py` `w5_shipped()` | Records each pick-A re-key with its wave and `closes_leak`. A live key that W1 had already re-keyed (rockphysics `brine_max_shuey_err`, earthmodel `fault_jump_y2200`, the mapping pair, seismolord `corr_zero_lag`) is traced back to its baseline key, and W1's fix is kept as `prior`. |
| `audit.py` | `--post --wave w1 --wave w5x` walks each field's chain back to the newest fix whose wave is named, so a W1-only dry run still checks the W1 state and a W5 dry run checks the W5 keys. A re-key that keeps its key name no longer trips the duplicate-annotation check. A `closes_leak` replacement whose annotation still says a lesson or a panel prints it fails the gate. |
The per-field `leak` flag in `annot/` and `fields.json` stays as the baseline found it, because `w1_capstones.py` reads it for the open-book tiers it generated (its `--check` must stay green). A closed leak shows as `shipped.closes_leak` with `rekey_annot.leak: false`.


`--selftest` adds five controls for this: a chained re-key applied and checked with both waves (green); the earlier wave's state checked without the later wave (green); the later wave named but its re-key missing (red); a leak-closing replacement still printed (red); a chained re-key that keeps its key name (green).

## Regrade impact

The scratch replay has 0 capstone attempts. Production held 9 at the baseline (the cleanslate record). When the lesson-leak recut was written, the 7 that existed then were all welldata/beginner. `apply.sh attempts --prod` lists them read-only.

- The six shipped changes only loosen, so no stored or future answer can go from pass to fail. Attempt scores are stored and never re-scored.
- Every tightening and every redesign above must list attempts on its course and tier before it is written. The precedent, `20260921_lesson_leak_grader_tolerances.sql`, refuses if any attempt exists.

## Litsweep SIGN hits from #180 (`signhits.json`)

The hits were re-measured rather than copied. There are 51: the PR said 50, and one fdp lesson line quotes -2250.0000 twice.

| Class | Count | What |
|---|---|---|
| A: real content defect | 1 | linesizing fc2i_m03 Q1 option3 invents a "-1.0000000000 and 1.0000000000" bound on s |
| B: correct figure the digest prints only unsigned or in words | 16 | consequence 1, hygiene 3, linesizing 5, supply 1, riskchange 5, fiscal 1 |
| C: legitimate recap (back reach) | 28 | no change |
| D: forward reach | 6 | decision 4, portfolio 2 |

No hit is a wrong number. None is fixed in this PR, because bank text is live and a sibling programme (B4) is rewriting distractor lengths in the same banks. Each item names its seed row, `(app_slug, tier, scope, module_key, ord)`, and a length-rank-preserving rewording, so it can be folded into a B4-composed recut.

**Owner decisions:**
- the m06 "onward" preview lessons: exempt them from the forward-reach rule, or strip the next-tier figures (76 existing forward reaches follow the same pattern)
- whether the gate should accept a sign-flipped distractor whose magnitude the digest prints
- re-cutting the fiscal digest from `ec2_dump.mjs` (it predates the EC2-5 IRR repair)

## Normalisation (lead review)

The annotations were written by separate reviewers, course by course. `normalize.py` makes two things uniform:

- **Leak-only redesigns become `none`.** Any field classed `redesign` only because a lesson or panel prints its answer is reclassed `none`, with `reclassed_from` and `leak: true` recorded. This affected 49 fields: reservoircalc 18, sim 15 and wellcorrelation 16.
- **Leak is a separate flag.** `leak` is recorded from a course list of reviewer-reported leaks. It is a pointer for the owner, not a gate input.

## Per course

| Course | none | tolerance | display | redesign | unobtainable | display miss | answer printed (leak) |
|---|---|---|---|---|---|---|---|
| basin | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| carbon | 17 | 0 | 1 | 0 | 0 | 1 | 0 |
| cashflow | 17 | 1 | 0 | 0 | 0 | 0 | 0 |
| casingtubing | 14 | 0 | 4 | 0 | 1 | 4 | 0 |
| cementing | 10 | 0 | 6 | 2 | 8 | 0 | 0 |
| completion | 17 | 1 | 0 | 0 | 0 | 0 | 2 |
| compliance | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| consequence | 16 | 0 | 2 | 0 | 0 | 0 | 0 |
| corrosion | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| crude | 12 | 0 | 6 | 0 | 0 | 6 | 0 |
| dca | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| decision | 10 | 0 | 8 | 0 | 0 | 8 | 0 |
| earthmodel | 16 | 0 | 1 | 1 | 1 | 0 | 18 |
| esp | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| fdp | 11 | 0 | 7 | 0 | 2 | 6 | 0 |
| fiscal | 9 | 8 | 1 | 0 | 1 | 8 | 0 |
| flowassurance | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| fluid | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| gaslift | 0 | 0 | 18 | 0 | 18 | 0 | 0 |
| gasprocessing | 12 | 0 | 5 | 1 | 2 | 5 | 0 |
| gasvalue | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| gaswell | 2 | 0 | 16 | 0 | 16 | 0 | 0 |
| geomech | 6 | 0 | 12 | 0 | 12 | 0 | 0 |
| heattransfer | 16 | 0 | 2 | 0 | 1 | 1 | 0 |
| hydraulics | 3 | 0 | 15 | 0 | 15 | 0 | 0 |
| hygiene | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| integrity | 0 | 0 | 0 | 18 | 14 | 0 | 0 |
| intervention | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| linesizing | 10 | 0 | 8 | 0 | 4 | 3 | 0 |
| lopa | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| mapping | 16 | 0 | 0 | 2 | 0 | 0 | 18 |
| mbal | 15 | 1 | 0 | 2 | 0 | 0 | 13 |
| metering | 17 | 0 | 1 | 0 | 0 | 0 | 0 |
| network | 7 | 0 | 11 | 0 | 11 | 0 | 0 |
| nodal | 6 | 0 | 2 | 10 | 12 | 0 | 0 |
| perfsand | 11 | 0 | 7 | 0 | 4 | 0 | 5 |
| petrophysics | 5 | 5 | 0 | 8 | 0 | 0 | 18 |
| porepressure | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| portfolio | 8 | 0 | 10 | 0 | 0 | 10 | 0 |
| producedwater | 3 | 0 | 14 | 1 | 14 | 0 | 0 |
| qra | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| refinery | 17 | 0 | 1 | 0 | 0 | 0 | 0 |
| relief | 10 | 0 | 8 | 0 | 3 | 5 | 0 |
| reservoircalc | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| riskchange | 17 | 0 | 0 | 1 | 0 | 0 | 0 |
| rockphysics | 18 | 0 | 0 | 1 | 0 | 0 | 19 |
| rodpump | 4 | 0 | 13 | 1 | 11 | 2 | 0 |
| rotating | 6 | 0 | 12 | 0 | 0 | 11 | 0 |
| safetystats | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| scal | 17 | 0 | 0 | 1 | 0 | 0 | 14 |
| seismolord | 16 | 0 | 0 | 2 | 0 | 0 | 8 |
| separation | 8 | 1 | 7 | 2 | 2 | 9 | 0 |
| sim | 15 | 0 | 0 | 3 | 2 | 0 | 18 |
| stimulation | 17 | 0 | 1 | 0 | 1 | 1 | 0 |
| supply | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| surveillance | 18 | 0 | 0 | 0 | 0 | 0 | 0 |
| torquedrag | 5 | 0 | 13 | 0 | 13 | 0 | 0 |
| uncertainty | 4 | 0 | 14 | 0 | 1 | 6 | 0 |
| waterflood | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| wellcontrol | 18 | 0 | 0 | 0 | 0 | 0 | 1 |
| wellcorrelation | 16 | 0 | 0 | 2 | 0 | 0 | 18 |
| wellcost | 0 | 0 | 0 | 18 | 18 | 0 | 0 |
| welldata | 18 | 0 | 0 | 0 | 0 | 0 | 18 |
| welldesign | 17 | 0 | 1 | 0 | 1 | 0 | 8 |
| welltest | 18 | 0 | 0 | 0 | 0 | 0 | 9 |

## W3 (Suite Full precision), 2026-09-22

The third wave of [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) (section 2 and the section 1 Suite rows, D3). The Suite gains one shared "Full precision" switch (Suite #554), off by default so product cards print exactly as before; with it on, graded quantities print at 6 decimals (money in million USD at 4, more where a tolerance needs it) with no digit grouping. It is wired per app in Suite #555 to #568. Two apps also gained the as-of date the section 1 rows needed (AFE Cost Control Manager, Project Management Pro), the NPV Scenario Builder gained its Monte Carlo settings and a sorted sample export, and the Relief and Flare Studio a flare back pressure input (its blowdown call ignored the back pressure, so the choked floor at 16.5 psia could not be read).

`w3_capstones.py` generates `migrations/20261026_w3_<course>.sql` from `w3/<course>.json`: one sentence appended to 25 capstone briefs in 15 courses, naming the app and the switch. Prompt only (fields asserted identical before and after), content-addressed on the post-W1 row, refuses without W1. They apply only after the Suite zip carrying the switch is live (`/root/w3-apply/apply.sh markers <zip>` checks it). `normalize.py` folds each `annot_updates` entry into `annot/` (the print the switch gives, class `none`, `printed_before` keeps the old print); `audit.py --post --wave w3` checks every W3 brief ends with its sentence, and `--selftest` gains two controls: a W3 brief without its sentence, and a W3 class move put back on the Suite print it replaced (both go red).

Not in W3: the separation advanced brief (W2 publishes the ADANGA offsets there, so the Full precision sentence is handed to W2; the class move for `ejulebe4_preferred_height_ft` is recorded here), wellcost (W2's prompt; Suite #568 adds the studio's Full precision and the downloadable MERLIN A-12 case file with its seed), fiscal FC6 (already shipped by the round-off, verified on the scratch replay), and the NextGen panel rows (W4).
## W5b (re-case, section 3 pick A), 2026-09-22
Courses: reservoircalc, porepressure, dca, sim, waterflood, fluid, every tier. These courses use the shared W5 generator and audit path above. Each capstone moves off the teaching case that the panels open on and the lessons work. The brief now states a case of its own, and the learner types it into the panels. W1's open-book label comes off the brief and the lesson. W5b adds two files:
| File | What |
|---|---|
| `w5_keys.mjs` | `npx vite-node --config vitest.config.js docs/graded-field-audit/w5_keys.mjs <course> [--write]` regenerates every value in the course's `fields_file` from the vendored engine. It does this through the spec's `keys_module`, which calls the same teaching function the panel calls, on the `case` each tier states. Nothing is hand-typed. |
| `src/components/course/panels/w5CaseGuard.js` | The gate each W5b course's `panelCapstoneGuard.test.js` runs in CI. |
The guard checks five things:
1. Every committed value equals the engine's value on the stated case.
2. No panel, rendered with no props (what the learner sees before typing), prints a graded answer (D2).
3. No lesson in any tier prints one.
4. No panel, lab or page source carries one as a literal.
5. The brief carries no open-book label and prints no answer.
A printed number counts as a leak when typing it would pass: it lies within the grader's own tol. A fraction is also checked as a percentage. A zero-tolerance count counts only where the words around it name what it counts. The FC waves used ten tolerances under five unit shifts. That works at their 1e-6 relative tolerances. At these courses' percent-level tolerances it would flag most numbers in the course. Positive controls plant a value inside each band, and it must fire.
| Course | Tiers | Case (what the brief states) |
|---|---|---|
| reservoircalc | all | beginner: contact 1563 m, NTG 0.72, porosity 0.22, Sw 0.25, Bo 1.25. intermediate: fault at 2100 m, contacts 1553 m west and 1572 m east. advanced: six new well porosities, contact 1562 m. |
| porepressure | all | the same golden logs at an appraisal setting: 250 m of water, pore fluid 1040 kg/m3. beginner: Gardner at 1750 m/s, the trend at 2750 m, fit matrix 210 us/m. intermediate: Eaton n 2.2, onset threshold 0.25 MPa, Poisson's ratio 0.35. advanced: the same prognosis to EMW, Bowers A 11 and B 0.72 at 8 MPa and from 2900 m/s (sigma max 45 MPa, U 3.5), second exponent 1.5. The NCT-at-TD field became overburden minus hydrostatic at TD (budget_td_mpa), because the trend at TD does not depend on the setting. |
| dca | all | beginner: Ekene-5 fitted from 2021-04-01, booked at 8 stb/d, Np to 2022-10-01. intermediate at 8 stb/d: Ekene-3 Di from 2021-11-01, Ekene-5 EUR, Ekene-6 Di from 2021-05-01, Ekene-6 R2 across the flood (2020-01 to 2023-12), the E3 + E5 type curve applied to Ekene-3, the field total. advanced: Ekene-1 and Ekene-6 fitted from 2024-10-01, b 1.1 at 8 stb/d, triangle 400000 to 620000 with the mode at 8 stb/d. New Di, qi and R2 fields tighten to 2e-6, 0.05 and 0.001 (the tiles print 7, 4 and 6 dp), because at 2e-5 a Di band covers most harmonic Di values the course prints. |
| sim | all | the Ekene deck rebuilt at a setting. beginner: regional mean 1566.5 m; the tops of columns (24, 6), (6, 26), (18, 3) and of Ekene-2's column, the EQUIL datum, and the columns above the contact. intermediate: mean 1573.2 m and contact 1562 m; deck STOIIP, gap, oil cells, the Ekene-2 top, and Standing's correlation on a 35 API / 0.80 / 195 F / 2200 psia / 3400 psia / 450 scf/stb oil. advanced: side-track toe (1500, 1300), calibration to a revised booking of 11500000 stb, the 2024 history periods, W1's validator message count re-computed on the calibrated deck, and the datum at the calibrated mean. `simLab.specAt()` rebuilds the deck the way the fixture generator built it, and at the teaching setting it equals the committed spec byte for byte. |
| waterflood | all | beginner: factor set Bo 1.17 / Bw 1.01 / Rs 360, band 0.95 to 1.15, June 2024. intermediate: a revised allocation matrix, target 1.10 over two periods, the Ekene-4 Hall ratio on rows to 2025-06-30 (W1's tolerance of 0.0005 kept), the Ekene-6 Chan slope at 5-point smoothing. advanced: permeabilities 140/520/230/95/410 md, M 1.5, 1600 rb/d, a 2.4 cp oil, and the Ekene-1 breakthrough (2025-06-01) for the back-out. The panels gain typed factors, band and month, a typed matrix and target, a surveillance diagnostics block, a typed layer column, M, rate and oil, and a channel back-out block. |
| fluid | all | beginner: a second oil (34 API, gas gravity 0.70, 195 F, 480 scf/stb, initial 3600 psia) through the correlations. intermediate: Good Oil on its 200 psig separator test, saturation at 180 F, a plus-fraction sensitivity (MW 205, SG 0.840); the saturation-pressure bias becomes the GOR bias, because the lab measured the bubble point at 220 F only. advanced: the regression against the 200 psig test; the tuned saturation pressure becomes the tuned Bo, because every regression lands it within a fraction of a psi of the target. The study and tuning explorers gain a separator-test choice, and the study explorer gains a saturation temperature and plus-fraction boxes. |
## W5c (section 3 re-case and strip: welldata, scal, petrophysics, mbal, welltest)
Part c of W5 in [FOLLOW-ON-PROGRAMME.md](FOLLOW-ON-PROGRAMME.md) section 3. `w5c_capstones.py` generates `migrations/20261028c_w5_<course>.sql` from `w5c/<course>.json` on a scratch replay of the post-W1 state (production today).
- **Pick A (re-case).** The tier moves to a case no panel preloads. The course's case module (`w5c/<course>/case.mjs`) builds the case and regenerates every key through the panel lab functions, which call the vendored engine; `gen_case.mjs` writes the case and `fields.json`. The prompt and dataset are replaced and the W1 open-book label goes. Every field is re-keyed, so the file carries the attempts guard with an empty D5 allowlist.
- **Pick B (strip).** The lessons and panels stop printing the answers; keys, expected values and tolerances stay. The W1 open-book label goes from the brief (prompt only, no guard).
- **Gate.** Each course's `src/components/course/panels/<course>/w5cRecase.test.js` (kit: `src/lib/w5cGuardKit.js`) proves the migration's fields equal the engine's regeneration, sweeps the course's panels, learning page and every lesson for each graded value in every string shape, checks that the panels' default states land on no graded value and that the W1 lesson note is gone, with a negative control for each check. `normalize.py` records each re-key with `wave: w5c` and keeps any W1 fix on the same key as `prev`; `audit.py --post --wave w1 --wave w5c` checks the W5c state and `--wave w1` alone stays green on the W1 state.
- **welldata** (A, all tiers): the ODUMA campaign, six LAS files in `src/content/capstone-cases/welldata/`, downloaded from the capstone card and opened in the panels with "Open your own LAS files". `w5c/welldata/oracle_lasio.py` re-reads them with lasio as a second opinion. The beginner file is `20261028c_w5_welldata_beginner.sql` on its own: welldata beginner holds capstone attempts in production, so it refuses until the owner signs the ids off (D5) and is HELD in `/root/w5c-apply`.

- **scal** (A beginner; B intermediate, advanced): beginner moves to the OKORO sand, stated in the brief and typed into the displacement explorer's own-case mode. The stripped tiers work the Ahmed chain on the Sw 0.4 row, the Ekene capillary chain on a 180 md teaching sand, dip at 5 degrees and 500 rb/d, polymer at a multiplier of 2 and the averaged refit at Swirr 0.2; the J-function and design explorers open on those teaching settings. Residual: the book's printed J at Sw 0.2, a stated input of the reservoir Pc field, sits inside the J field's tolerance by the original design.
- **petrophysics** (A, all tiers): the IKPO-3 well, a 201-sample analytic well in the typewell's construction, delivered as a LAS file and opened in the page's well picker (typewell or a LAS file, with the zones and water leg typed from the brief); the four panels and the net-pay workflow run on whichever well is open. `w5c/petrophysics/oracle.py` re-derives the closed-form keys with numpy and lasio.

The owner applies with `/root/w5c-apply/apply.sh` (verify, dryrun, attempts, prod-status, apply --prod, rows). Lessons, panels and the case files reach learners with the NextGen zip, near-simultaneous with the apply.
