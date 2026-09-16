# promptleak: a gate that passed without examining anything

Audit date 2026-09-16. Gate under audit: `/root/dc-wavekit/promptleak.py`.
Repaired gate: `docs/gate-audit/promptleak.py` in this repo, installed back over
the toolkit copy.

A capstone prompt is the one text a learner reads while being graded. A graded
value stated in a prompt is an answer given away, and the same class of defect
as banks that were passable without reading: the learner is scored correct
without doing the work.

Every course wave for months recorded "promptleak 0" as a passing gate. This
audit establishes what that zero actually meant, repairs the gate, and re-runs
it against what production serves.

## 1. What the old gate actually did

The whole sweep was these four lines:

```python
for m in re.finditer(r"'((?:[^']|'')*)'", sql, re.S):
    body = m.group(1)
    if len(body) < 400 or 'Report' not in body:
        continue
```

It took a course migration, pulled out every single-quoted literal with a
regex, and kept only those that were **400 or more characters long** and
**contained the literal word "Report"**. Everything kept was treated as a
capstone prompt. Nothing else was ever examined.

Three independent things are wrong with that.

**It identifies prompts by prose, not by the schema.** A capstone is a row of
`public.academy_capstones`. Its prompt is a **column** named `prompt`, and its
answer key is a `fields` jsonb array of `{key,label,unit,expected,tol}`. The
prompt is therefore trivially addressable, and the old gate addressed it by
guessing at wording instead. Measured against the 132 prompts live in
production right now: **49 never use the word "Report"** (they say "Read six
values", "Give", "State", "Compute"), and **28 are shorter than 400
characters**. Prompt lengths run from 242 to 10,255 characters, so the 400
threshold is an arbitrary cut through the middle of the real distribution.

**Its quote regex mis-pairs across SQL comments.** `r"'((?:[^']|'')*)'"` has no
concept of a comment. One apostrophe in one `--` line, and these migrations are
full of them ("the engine's default straight line"), makes that apostrophe an
opening quote. Every pairing after it is shifted by one, so the "literals" the
gate extracts are the *gaps between* the real literals. Because the damage
depends on the parity of stray apostrophes upstream, it is intermittent: on 15
of the 44 courses, stripping comments changes the swept set.

**It reported success on an empty sweep.** With no literal passing both
filters, the loop body never ran, `cross` was empty, and the gate printed
`cross-tier: 0` and exited 0. That is the bug. A gate that cannot distinguish
"I examined 132 prompts and found nothing" from "I examined nothing" is not a
gate.

A fourth, smaller defect: tier was attributed by searching backwards up to 900
characters for the nearest of the words "advanced", "intermediate",
"beginner". Even on the literals it did sweep, the tier label was a guess from
nearby text rather than the row's `tier` column.

## 2. The swept-nothing table

For each of the 44 live courses, the old gate's extraction was replayed over
that course's capstone migration set, and each prompt production serves was
checked for whether it appears among the literals the gate would have kept.
Courses 1 to 41 use the migrations on `main`; `uncertainty`, `decision`,
`portfolio` and `fdp` (EC3 to EC6) are live in production but their migrations
are not yet on `main`, so their files were read from the EC6 worktree.

"Examined" counts prompts the old gate would actually have looked at. The last
three columns give the reason: prompts with no "Report", prompts under 400
characters, and whether comment mis-pairing perturbs that course's sweep.

| # | course | module | prompts | prompts the old gate examined | no 'Report' | under 400 chars | comment mis-pairing |
|---|---|---|---|---|---|---|---|
| 1 | `welldata` | geoscience | 3 | **0** | 2 | 3 | no |
| 2 | `petrophysics` | geoscience | 3 | **0** | 2 | 2 | no |
| 3 | `wellcorrelation` | geoscience | 3 | **0** | 2 | 3 | no |
| 4 | `seismolord` | geoscience | 3 | **0** | 3 | 3 | no |
| 5 | `mapping` | geoscience | 3 | **0** | 2 | 2 | no |
| 6 | `reservoircalc` | geoscience | 3 | **0** | 3 | 2 | no |
| 7 | `rockphysics` | geoscience | 3 | **0** | 1 | 3 | no |
| 8 | `porepressure` | geoscience | 3 | 1 | 2 | 1 | no |
| 9 | `earthmodel` | geoscience | 3 | 1 | 2 | 2 | no |
| 10 | `basin` | geoscience | 3 | **0** | 3 | 2 | no |
| 11 | `dca` | reservoir | 3 | **0** | 3 | 2 | no |
| 12 | `mbal` | reservoir | 3 | **0** | 3 | 3 | no |
| 13 | `scal` | reservoir | 3 | **0** | 3 | 0 | no |
| 14 | `waterflood` | reservoir | 3 | **0** | 0 | 0 | yes |
| 15 | `sim` | reservoir | 3 | 3 | 0 | 0 | no |
| 16 | `fluid` | reservoir | 3 | 2 | 1 | 0 | no |
| 17 | `welltest` | reservoir | 3 | 1 | 2 | 0 | no |
| 18 | `welldesign` | drilling | 3 | **0** | 1 | 0 | yes |
| 19 | `torquedrag` | drilling | 3 | 3 | 0 | 0 | no |
| 20 | `hydraulics` | drilling | 3 | 3 | 0 | 0 | no |
| 21 | `wellcontrol` | drilling | 3 | **0** | 0 | 0 | yes |
| 22 | `geomech` | drilling | 3 | **0** | 1 | 0 | yes |
| 23 | `casingtubing` | drilling | 3 | 3 | 0 | 0 | no |
| 24 | `cementing` | drilling | 3 | **0** | 0 | 0 | yes |
| 25 | `completion` | drilling | 3 | **0** | 0 | 0 | yes |
| 26 | `perfsand` | drilling | 3 | 3 | 0 | 0 | no |
| 27 | `stimulation` | drilling | 3 | **0** | 0 | 0 | yes |
| 28 | `integrity` | drilling | 3 | 3 | 0 | 0 | no |
| 29 | `wellcost` | drilling | 3 | 3 | 0 | 0 | no |
| 30 | `nodal` | production | 3 | **0** | 1 | 0 | yes |
| 31 | `gaslift` | production | 3 | 3 | 0 | 0 | no |
| 32 | `esp` | production | 3 | 3 | 0 | 0 | no |
| 33 | `rodpump` | production | 3 | **0** | 0 | 0 | yes |
| 34 | `gaswell` | production | 3 | **0** | 0 | 0 | yes |
| 35 | `flowassurance` | production | 3 | 3 | 0 | 0 | no |
| 36 | `network` | production | 3 | 3 | 0 | 0 | no |
| 37 | `intervention` | production | 3 | **0** | 0 | 0 | yes |
| 38 | `surveillance` | production | 3 | 3 | 0 | 0 | no |
| 39 | `cashflow` | economics | 3 | 3 | 0 | 0 | no |
| 40 | `fiscal` | economics | 3 | **0** | 0 | 0 | yes |
| 41 | `uncertainty` | economics | 3 | **0** | 3 | 0 | no |
| 42 | `decision` | economics | 3 | **0** | 3 | 0 | yes |
| 43 | `portfolio` | economics | 3 | **0** | 3 | 0 | yes |
| 44 | `fdp` | economics | 3 | **0** | 3 | 0 | yes |
| | **total** | | **132** | **44** | **49** | **28** | **15** |

**27 of the 44 live courses had zero prompts examined.** Four more were
partially examined (`porepressure` 1 of 3, `earthmodel` 1 of 3, `fluid` 2 of 3,
`welltest` 1 of 3). Only 13 courses had all three prompts examined. Across the
Academy the gate looked at **44 of 132 prompts, 33 percent**; 88 prompts have
never been checked by this gate at all, and 27 courses' recorded "promptleak 0"
was a statement about the empty set.

Note the two failure modes are not the same shape. The 14 courses whose
prompts avoid the word "Report" were invisible to every run. The courses marked
"mis-pairing yes" mostly *do* use "Report", and were lost to the quote bug
instead: `cementing`, `completion`, `wellcontrol`, `stimulation`, `rodpump`,
`gaswell`, `intervention`, `fiscal`, `waterflood`, `welldesign`, `geomech`,
`nodal`. Those courses look like they should have been swept and were not.

## 3. The repaired gate

`docs/gate-audit/promptleak.py`. The design rule is that the gate must take its
idea of a prompt from the schema, never from prose.

**Prompts are located structurally.** Two modes:

- `--db` reads the rows out of the database that actually grades learners. This
  is the authoritative mode and the one the re-run used. Wave directories drift
  from what was seeded, and demonstrably so: `/root/ec-wip-cashflow/fields.json`
  still carries `jv_total_boe = 5430620.16` where production holds
  `6788275.2`. The served row cannot drift from itself.
- `--sql FILE` parses a migration for a pre-merge check. Comments are removed
  by a lexer that walks the text once and knows what each character is: inside
  a string literal, inside a `$$` dollar-quoted block, inside a comment, or
  code. Then the INSERT's column list is read and values are mapped to columns
  **by position**, so `prompt`, `tier` and `app_slug` come from the columns of
  those names. No magic word, no length threshold.

**Apostrophes and nested quoting are handled properly.** Doubled `''` escapes
are consumed as literal content, dollar-quoted blocks are skipped whole, and an
apostrophe inside a comment can no longer open a string, because comments are
removed before any literal is read and are removed by a scanner that already
knows it is not inside a literal.

**It refuses rather than passes.** `Refused` exits **2**, distinct from 0 clean
and 1 leaks found, on: an empty sweep, zero prompts, zero numbers in any
prompt, an empty prompt, a course with no graded fields, an unknown course
name, a capstone INSERT whose column list lacks `prompt` or `fields`, a VALUES
tuple whose arity disagrees with the column list, unparseable graded fields,
and an unterminated string literal. Success on zero input is now impossible;
that is the specific defect being repaired.

**Two false-positive classes are suppressed**, both found by running the first
repaired version against production rather than by reasoning:

- A number welded to a word is a name, not a quantity. `EJULEBE-1`, `UMU-01`,
  the `01` of a `2031-01` date. The first run reported `-01`, the tail of a
  well name, as a leak of a 0.001 decline rate.
- Under a unit shifting, a loose absolute tolerance becomes a wildcard. A bare
  `180` degF matched a graded porosity of 0.17615 at x1000, because 0.18 is
  within its 0.005 tolerance. A genuine restatement in another unit *rounds*
  the value, so a shifted match must also agree relatively to 1e-4. Unshifted
  matches are still governed purely by the grader's own tolerance, because at
  scale 1 the grader would accept the literal as typed.

Findings are deduplicated to one row per (course, prompt tier, graded field),
keeping the most damning instance, and banded: accepted cross-tier, accepted
same-tier, near misses, and small-integer notes. The small-integer band follows
`goldensweep.mjs`: two small integers agreeing is a coincidence with a high
prior, a continuous value agreeing to seven figures is not.

### What `--sql` mode cannot see, and why `--db` is authoritative

Three migrations on `main` change a capstone prompt with an `UPDATE` rather
than an `INSERT`: `20260827_rc1_dca_expert_capstone_fix.sql`,
`20260828_rc5_sim_capstone_prompt_fix.sql` and
`20260904_pd1_nodal_course.sql`. `--sql` mode reads INSERTs, so it refuses
those files rather than reporting a clean pass over them. DCA is the live
example: the Expert prompt production serves does **not** appear verbatim in
`20260827_rc1_dca_course.sql`, because the `UPDATE` in the capstone-fix
migration is what installed it.

That is the concrete reason `--db` is authoritative and is the mode the re-run
used. A file-based gate, on a schema amended by `UPDATE`, is always reading a
draft. It is the same reason a go-live migration, which references
`academy_capstones` without inserting rows, is refused rather than passed:
pointed at the wrong file, the gate says so instead of returning a zero.

Where the two modes overlap they agree. `--sql` on
`20260827_rc1_dca_course.sql` reports exactly the two cross-tier leaks `--db`
reports for DCA, so both the original INSERT and the current production row
carry them and the capstone fix did not remove them.

### A positive control that was attempted and did not stand up

The kit's README records a real historical leak: PD3's Associate prompt stated
`4181.40584`, which is `intermediate.pump_intake_bpd`, at 0.00 tolerances. On
real data that would be the ideal positive control. It could not be
reproduced. In the earliest committed version of
`20260904_pd3_esp_course.sql`, `4181.40584` appears only as that field's
`expected` value and never inside a prompt, so the decoupling predates the
first commit and the leaking text is not in this repo's history. The repaired
gate reports PD3 clean today, which is consistent with the fix but is **not**
evidence that the gate would have caught it. The planted synthetic leak in the
negative control is the evidence for that, and it is stated as such rather
than dressed up as a historical catch.

## 4. The negative control

`python3 promptleak.py --selftest`, 16 checks, all passing:

```
  PASS  a clean prompt set reports no leak
  PASS  and it really did examine three prompts
  PASS  a planted cross-tier leak goes RED
  PASS  and it names the right field
  PASS  removing the planted leak goes green again
  PASS  a leak restated at another unit scale is still caught
  PASS  a number welded to a well name is not swept as a quantity
  PASS  a loose approximation under a unit shifting is not called a leak
  PASS  an empty record set is REFUSED, not passed
  PASS  a course with no graded fields is REFUSED
  PASS  an empty prompt is REFUSED
  PASS  a prompt set with no numbers at all is REFUSED
  PASS  an unknown course name is REFUSED
  PASS  an apostrophe in a -- comment no longer breaks quote pairing
  PASS  and the leak in that file is found
  PASS  a capstone INSERT missing prompt/fields is REFUSED
```

The planted leak is a synthetic three-tier course whose Associate prompt is
given the Professional tier's graded head, 98765.4321. The gate goes red and
names `i_head`; removing that sentence returns it to green. The comment case
is an end-to-end one: a real two-row `INSERT` preceded by a `--` comment
containing an apostrophe, which the old regex mis-pairs and this one reads
correctly, with a planted cross-tier leak inside that the gate then finds.

## 5. Leaks found across all 44 live courses

Command, run against production:

```
python3 promptleak.py --db --workdir <dir linked to Petrolord-NextGen>
```

```
swept 132 prompt(s) across 44 course(s): 3942 numbers against 793 graded
fields, 3 unit shiftings
cross-tier leaks: 3   self leaks: 3   near misses: 41   small-integer notes: 8
```

Ranked by whether a learner can obtain a graded answer without doing the work,
which is not the same as string similarity. Not fixed in this pass; recorded
for a recut wave.

### Rank 1 (worst). `dca` / advanced prompt / `intermediate.field_eur_stb`

- Graded field: `intermediate.field_eur_stb`, "Sum of the four closed-form EURs
  at 10 stb/d", expected `461709.132532792` stb, tol 2000.
- Offending text, in the Expert prompt: *"compute the field triangle's P90 and
  P10 (minimum 380000, **mode 461709.132532792**, maximum 580000 stb,
  petroleum convention with P90 low)."*
- What it reveals: the Professional tier's graded answer, printed to fifteen
  significant figures, as a stated input to the Expert task. A learner with the
  Expert capstone open can type it into the Professional capstone and be graded
  correct having fitted nothing. The worst of the set: exact, continuous,
  cross-tier, and unambiguous.

### Rank 2. `dca` / advanced prompt / `beginner.di_per_day` (and `beginner.qi_bpd`)

- Graded field: `beginner.di_per_day`, "Fitted nominal decline Di", expected
  `0.0012` 1/d, tol 2e-05. Also `beginner.qi_bpd` = 120, reported in the
  small-integer band.
- Offending text, in the Expert prompt: *"book the b = 1.2 EUR at **qi 120
  stb/d, Di 0.0012 per day** and a 10 stb/d limit"*.
- What it reveals: the Associate capstone asks the learner to *fit* Ekene-1's
  primary window and report "the fitted initial rate and nominal decline". Both
  fitted answers, qi and Di, are stated as given conditions in the Expert
  prompt. Two of the Associate tier's six graded fields are handed over in one
  sentence.

### Rank 3. `scal` / beginner prompt / `advanced.fitted_nw` (downward)

- Graded field: `advanced.fitted_nw`, "Fitted water Corey exponent nw",
  expected `2.4999999999999996`, tol 0.001.
- Offending text, in the Associate prompt: *"Run the Ekene displacement from
  its designed relative permeability set (Corey with Swc 0.35, Sor 0.25,
  krwMax 0.3, kroMax 0.9, **nw 2.5**, no 2.0; ...)"*.
- What it reveals: the Expert tier re-fits nw from the displacement data, and
  the data was generated from nw = 2.5, which the Associate prompt states
  outright. A downward leak, the shape the gate exists to catch: the lower
  tier's prompt carries the higher tier's answer, so it is visible to every
  learner on the ladder.

### Rank 4. `completion` / advanced prompt / own tier's `available_contraction_m`

- Graded field: `advanced.available_contraction_m`, "Available, contraction",
  expected `2.28` m, tol 5e-07.
- Offending text: *"The seal assembly runs in a POLISHED BORE RECEPTACLE of
  5.35 m and is **landed 2.28 m into it**."*
- What it reveals: the available contraction travel simply is the landing
  depth, so one of the six graded fields is answerable by copying a number out
  of the prompt. The tolerance is 5e-07, meaning it must be typed exactly, and
  it can be, exactly.
- Separate observation for the recut: this **advanced** prompt opens "Six
  space-out values for the Associate capstone completion". The Expert prompt
  describes itself as the Associate capstone, which looks like a copy-paste
  that outlived its edit. Worth checking the tier cut, not only the wording.

### Rank 5. `seismolord` / advanced prompt / own tier's `iso25_amp`

- Graded field: `advanced.iso25_amp`, expected `0.07999999821186066`, tol 0.002.
- Offending text: *"Model the SAND top and base as an equal and opposite
  reflection pair (**RC +0.08 / -0.08**) in a wedge from 0 to 60 ms"*.
- What it reveals: the isolated-reflector amplitude is by construction the
  reflection coefficient, so the graded value is the stated input. Close to
  tautological physically, which is the mitigation, but it remains a graded
  field a learner can satisfy without opening the tuning panel. The fix is
  probably to grade something the wedge actually decides, not to reword.

### Rank 6 (lowest). `reservoircalc` / advanced prompt / own tier's `phi_mean_oil`

- Graded field: `advanced.phi_mean_oil`, expected `0.20936760570720417`, tol
  0.001.
- Offending text: *"fit a porosity trend surface to the six well values (0.22,
  0.19, 0.23, 0.17, **0.21**, 0.22 for Ekene-1 to Ekene-6)"*.
- What it reveals: nothing deliberate. The mean over the oil-bearing nodes
  lands 0.00063 from one of the six stated well porosities, inside the 0.001
  tolerance, so a learner who retypes the fifth well's value scores the field.
  This is a tolerance defect rather than a prose defect, and the fix belongs in
  the tolerance or the cut of the field, not in the prompt.

### Bands below the findings

41 near misses (inside ten tolerances, outside one) and 8 small-integer notes
are printed by the gate in full. Most are honest restatements of conditions.
Three are worth a reader's eye in a recut wave, because they sit between one
and two tolerances of a cross-tier answer: `scal` beginner `0.35` against
`intermediate.sw_at_crest = 0.35062979`, `sim` advanced `12139208.107496763`
against `intermediate.deck_stoiip_stb = 12132366.897955146`, and `scal`
beginner `0.25` against `advanced.avg_refit_a = 0.24915016`. None is currently
accepted by the grader; a re-cut that moves a value slightly could make one so.

## 6. The same defect in the other wave-kit gates

Each gate was run on a wave directory containing a `wave.json`, an empty
`fields.json`, an empty `banks/`, empty tier directories and no digest, which
is the shape of "nothing to examine".

**Passes while examining nothing (exit 0):**

| gate | behaviour on empty input |
|---|---|
| `numsweep.mjs` | "literals with 7+ significant figures checked: 0 unresolved: 0", exit 0 |
| `numsweep.mjs --banks` | same, exit 0 |
| `leakage.mjs` | "fatal downward leaks: 0 same-tier answer prints: 0", exit 0, **and it accepts an empty `fields.json`, so zero graded fields is a pass** |
| `leakage.mjs --banks` | same, exit 0 |
| `wave_check.py` | "0 banks, 0 questions / wave problems: 0", exit 0 |
| `digestleak.py` | "no digest ..., nothing to gate", exit 0 |
| `digestpromise.py` | "no digest ...", exit 0 |
| `crosspair.py` | "no digest", exit 0 (this one is a report by design, never a failure) |

**Already guarded, and worth copying:**

- `collisions.py` asserts `len(fields) == 18` and dies otherwise. This is the
  only gate in the kit that refuses an input of the wrong size, and it is the
  pattern the others need.
- `bankkit.py` records `count n != expect_n` as a gate failure and `emit()`
  refuses to write the bank.
- `briefleak.py`, `digestself.mjs` and `goldensweep.mjs` exit non-zero when
  their input file is missing rather than reporting a clean pass.

**The one that matters most** is `leakage.mjs`. It is the sibling gate, it
guards the lessons against the same 18-field answer key, and it will report
"fatal downward leaks: 0" and exit 0 when handed an empty `fields.json` or a
content directory with no lessons in it. It has the same shape of hole
promptleak had: it cannot tell a clean sweep from an absent one. Recommended
follow-up, not done here: give `leakage.mjs`, `numsweep.mjs` and
`wave_check.py` the same refusal that `collisions.py` already has, and make
`digestleak.py` and `digestpromise.py` refuse a missing digest instead of
excusing it. A wave that forgot to generate its digest currently passes both.

The two known blind spots, bankkit's within-bank Jaccard and crosspair scanning
lessons only, were out of scope and are unchanged.

## 7. Corrections to the brief this audit was given

Checked rather than taken on trust, as instructed.

- **Confirmed.** The gate only sweeps quoted literals of 400+ characters
  containing "Report".
- **Confirmed.** The quote regex is mis-paired by apostrophes inside `--`
  comments, affecting 15 of the 44 courses.
- **Confirmed.** EC3's prompts say "Read six values" and contain no "Report";
  the old gate examined **0 of EC3's 3 prompts**. One refinement: EC3's
  migration set is not a *literally* empty sweep, because the gate did keep 4
  long "Report"-bearing literals out of the deep-seed files. They were lesson
  and exam text, not capstone prompts. So "swept zero prompts" is exactly
  right; "swept zero" is not, and the distinction matters because a wave
  operator watching the output would have seen a non-zero-looking run.
- **Confirmed, with a caveat worth recording.** On FC1's *course* migration the
  old regex extracts 0 qualifying literals from the raw file and 3 from a
  comment-stripped copy, exactly as reported. But when all five FC1 migrations
  are concatenated, the raw file also yields 3, because a second stray
  apostrophe downstream restores the parity. Whether the quote bug bites
  depends on the parity of stray apostrophes upstream, so concatenating or
  reordering files can mask it entirely. That intermittency is why the bug
  survived: it does not fail the same way twice.
- **Confirmed.** 44 live courses, all `status = 'available'`, each with exactly
  3 capstones: 132 prompts and 793 graded fields, no inactive rows.
- **Slight correction to the framing.** The brief says graded fields are a
  `fields` jsonb array on `academy_capstones`, which is right, and implies the
  prompts must be dug out of the migration SQL. They need not be: `prompt` is
  its own column on the same table. That is what makes the structural fix
  cheap, and it is why the repaired gate's authoritative mode reads the
  database rather than parsing files at all.

## 8. Reproducing this audit

```bash
# negative control
python3 docs/gate-audit/promptleak.py --selftest

# every live course, against what production serves
supabase link --project-ref txcsbtvcdaqmkjjbhbeg      # Petrolord-NextGen
python3 docs/gate-audit/promptleak.py --db --workdir . --json findings.json

# one course, or a migration before it is merged
python3 docs/gate-audit/promptleak.py --db --course dca
python3 docs/gate-audit/promptleak.py --sql migrations/20260908_ec1_cashflow_course.sql
```

Exit codes: 0 clean, 1 leaks found, 2 refused. Only 0 is a pass, and 2 is not
a pass however convenient it looks in a wave log.

## 9. The recut, 2026-09-16

All six findings of section 5 are closed by five migrations,
`migrations/20260916_promptleak_recut_*.sql`, with the published and recut text
of every row recorded in `docs/prompt-leak-recut/`. The principle applied
throughout: a prompt must give the learner everything needed to do the work and
nothing that substitutes for doing it.

| # | course | what was done | why that and not something else |
|---|---|---|---|
| 1, 2 | `dca` advanced | prompt states the *fit* instead of its result: the b = 1.2 booking is now taken on Ekene-1's pre-flood primary window, and the triangle's mode is now "the field's deterministic booking", to be totalled from the four closed-form EURs | both figures are real inputs, so each is replaced by the thing it was computed from. The triangle tolerates a derived mode: dP90/dmode is 0.247 and dP10/dmode 0.206, so a 2000 stb error moves each quantile by less than its own 2000 stb tolerance |
| 3 | `scal` beginner | the two Corey exponents leave the prompt; the four endpoints stay | the exponents live in the fixture the Associate loads, and every Associate answer comes out of the engine run. The endpoints stay because the first graded field, the mobility ratio, is a hand calculation from them |
| 4 | `completion` advanced | graded field replaced: `available_contraction_m` (2.28, the stated landing depth) becomes `max_insertion_both_pass_m` (4.299999999999999) | the landing depth cannot leave the prompt, so the field moved instead. The new field is the far edge of the band whose near edge was already graded, and it catches the "both edges from one design case" trap that was previously graded at one end only. The direction-swap the old field guarded still fails field 1 |
| 5 | `seismolord` advanced | graded field replaced: `iso25_amp` becomes `tune25_iso_ratio` (1.4449345270902185, tol 0.001) | as section 5 recommended, grade what the wedge decides. The ratio is scale invariant, so no statement of the reflection pair can give it away, and `wedgeLab.test.js` already pinned it independently |
| 6 | `reservoircalc` advanced | `phi_mean_oil` tolerance 0.001 to 0.0002; the prompt does not change | a tolerance defect, as recorded. The panel prints this mean to six decimals, so 0.0002 is four hundred times an honest reading error, while the copied well value 0.21 now misses by 3.2 tolerances and the two wrong-method means the lessons name miss by 7.3 and 13 |

Two leak surfaces this gate cannot see were found while doing the work, and
both were fixed in the same wave. `academy_get_capstone` serves the learner the
`dataset` string and every field's `label`, not only the `prompt`:
`dca.b12_eur_stb` was labelled "EUR at b 1.2 (qi 120, Di 0.0012, limit 10)",
which hands over the same two Associate answers the prompt did. **Extending the
sweep to `label` and `dataset` is the obvious next repair to this gate** and is
not done here.

Three residues are reported rather than hidden. The DCA Expert lesson
`m04-risked-reserves/l04-the-ekene-triangle.md` derives the mode in full and
`UncertaintyExplorer` pre-fills it as a panel default; the SCAL Associate
lessons teach nw = 2.5 and the panel's slider defaults to it. Those are lesson
and panel leaks, which is `leakage.mjs`'s job, and section 6 shows that gate
has the same swept-nothing hole this one had. `scal.advanced.fitted_nw` in
particular is a recover-the-plant field whose value the course must teach, so
no prompt wording can make it secret; redesigning it needs an engine run.

### A third false-positive class, found by re-running the gate

The re-run over the recut reported `dca` advanced leaking `beginner.di_per_day`
through "b = 1.2", because 1.2/1000 is *exactly* 0.0012 and the relative test of
section 3 cannot reject an exact agreement. It is not a restatement: an Arps
exponent is not a decline rate, and a learner typing 1.2 into that field fails.
The finding was present on the unchanged production rows too, masked by
deduplication behind the worse verbatim leak.

The gate now also requires, for a *shifted* match only, that the literal be
written precisely enough to resolve the shifted tolerance. "1.2" is written to
one decimal, so it carries ±0.05, which is ±5e-05 once shifted, against a
tolerance of 2e-05. The same value written "1.2000" or "0.0012" still matches
and is still reported, and the selftest asserts both directions. Unshifted
matches are untouched, because at scale 1 the grader itself would accept the
literal as typed.

The negative control is now **18 checks, all passing**, and the two new ones are
`a coarsely written literal is not a unit restatement of a far smaller value`
and `the same shifting written to full precision is still caught`. Run against
the unchanged production rows the patched gate still reports all six original
leaks, so the narrowing hides none of them; run against the recut rows it
reports `cross-tier leaks: 0   self leaks: 0` and exits 0.

The three near misses section 5 flagged as one to two tolerances from a
cross-tier answer were re-checked and are unmoved by the recut: `scal` beginner
0.35 at 1.3 tolerances, `sim` advanced at 1.4, `scal` beginner 0.25 at 1.7. No
near miss was converted into a leak.
