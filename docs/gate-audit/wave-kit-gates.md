# Six wave-kit gates that passed without examining anything

Audit date 2026-09-16. Gates under audit: `numsweep.mjs`, `leakage.mjs`,
`wave_check.py`, `digestleak.py`, `digestpromise.py` and `crosspair.py` in
`/root/dc-wavekit/`. Repaired gates: `docs/gate-audit/` in this repo, installed
back over the toolkit copy and verified byte-identical.

This is the second audit of this shape. The first, [promptleak.md](promptleak.md),
repaired a gate that examined 44 of 132 live capstone prompts and reported
clean for months. It ended by naming these six as sharing the defect. They do.
All six were confirmed empirically before a line was changed, and the two that
matter most were examining far less than even that suggested.

The headline is not the empty-input bug, which is easy to fix. It is what the
repaired gates found once they were pointed at what production actually serves:
**94 cross-tier answer leaks and 179 full-precision self-prints, every single
one of them in a course the wave kit had never been able to run against at
all.** The gates were sound where they ran. Sixteen live courses were outside
the reach of the entire kit, and nothing recorded that.

## 0. What production holds

Read from the linked NextGen database (`txcsbtvcdaqmkjjbhbeg`), not from wave
directories, which demonstrably drift. Lesson content read at the production
commit `fcfe1022`, not at `main`, which is ahead by one unshipped course.

| | |
|---|---|
| live courses (`academy_apps.status = 'available'`) | 44 |
| capstones (`academy_capstones`, active) | 132 |
| graded numeric fields | 793 |
| live questions (`academy_quiz_questions`, active) | 17,422 |
| lesson files at `fcfe1022` | 3,433 |
| live courses that have a wave directory | **28** |
| live courses with **no wave directory at all** | **16** |
| wave directories carrying a `digest.txt` | 17 of 31 at sweep time, 18 now |
| live gated courses with **no digest** | **13 of 28** |

One caveat on reproducing any of this. The wave directories under `/root` are
live working space and other agents write to them: `fc-wip-rotating` gained a
63 KB `digest.txt` at 02:11 while this audit was running, taking the digest
count from 17 to 18 between two measurements an hour apart. Every wave-directory
figure below is therefore as-of the sweep. The database and the production
commit are stable references and the figures drawn from them are not subject to
this. It is one more reason the gates that matter should read the database.

Those last three rows are the finding behind the finding. Five of the six gates
take a wave directory as their only entry point, and three of them take a
digest. For 16 live courses there was never a wave directory to point them at,
and the kit has no way to say so: a gate that is never run leaves exactly the
same trace as a gate that ran and found nothing.

## 1. The claim, verified

Every gate was run on a wave directory holding a `wave.json`, an empty
`fields.json`, an empty `banks/`, empty tier directories and no digest, which is
the shape of "nothing to examine". The brief's claim held for all six.

| gate | before | after |
|---|---|---|
| `leakage.mjs` | `fatal downward leaks: 0`, **exit 0** | REFUSED, **exit 2** |
| `leakage.mjs --banks` | same, **exit 0** | REFUSED, **exit 2** |
| `numsweep.mjs` | `checked: 0 unresolved: 0`, **exit 0** | REFUSED, **exit 2** |
| `wave_check.py` | `0 banks, 0 questions / wave problems: 0`, **exit 0** | REFUSED, **exit 2** |
| `digestleak.py` | `no digest ..., nothing to gate`, **exit 0** | REFUSED, **exit 2** |
| `digestpromise.py` | `no digest ...`, **exit 0** | REFUSED, **exit 2** |
| `crosspair.py` | `no digest`, **exit 0** | REFUSED, **exit 2** |

`leakage.mjs` is the one the brief singled out and it deserved to be: handed an
**empty `fields.json`** it printed `sweeping 78 lesson files against 0 graded
fields` and then `fatal downward leaks: 0`, and exited 0. It is the gate that
stands between a lesson and the graded answer key, and it would report success
against no answer key at all.

Exit codes are now 0 clean, 1 findings, 2 refused, in all six. Only 0 is a pass,
and 2 is not a pass however convenient it looks in a wave log.

## 2. Per gate: what it actually swept, and what it sweeps now

### `leakage.mjs`

**Before.** Read `fields.json` from the wave directory and swept
`src/content/courses/<slug>` from the repo, validating neither. Three further
ways it examined less than it appeared to, all confirmed:

* **It gated against a stale answer key.** `fields.json` is a copy. Compared
  against the live `academy_capstones.fields` today, **6 of the 28 wave
  directories disagree with what production grades**: `cashflow`, `fdp` and
  `uncertainty` differ in the **value** of graded fields (cashflow's
  `jv_total_boe` is 5,430,620.16 in the wave and 6,788,275.2 live);
  `fiscal` has a renamed key; `linesizing` and `separation` are not live at all.
  A sweep against the wrong answers reports clean.
* **Its number regex split digit-grouped literals.** `1,234,567.89` was swept as
  `1`, `234` and `567.89`, so the longest and most obviously copied numbers in a
  lesson were invisible.
* **34 of the 793 live graded values can never be matched**, because literals of
  fewer than two significant figures are skipped. Every one is a single-digit
  count or a round decimal: `mapping.n_control_points = 6`,
  `welldata.converted_curves = 2`, `mbal.r_squared = 1`,
  `waterflood.dykstra_parsons_v = 0.5`. Silent before; printed as `NOT COVERED`
  now, and `--integers` sweeps them on demand.

**After.** `--db --all --content-root DIR` reads the answer key from the
database and sweeps every live course, needing no wave directory, which is what
brought the 16 unreachable courses into range for the first time. Refuses on:
zero or malformed graded fields, a missing content directory, zero lesson files,
zero numeric literals, and a `--banks` run in which nothing is a question array.
One course's refusal no longer blinds the rest of the run.

One change was made for signal rather than coverage. Matches that hold **only
under a physical unit conversion** (psi, feet) are now reported as notes and do
not fail the gate. The evidence: on `basin`, a lesson's 15.38095238095238 degC/km
gradient landed inside tolerance of a graded vitrinite reflectance of 4.6880
purely because 15.381 / 3.28084 = 4.6881, and reflectance has no feet in it.
Those four conversions produced 202 of 1,700 raw cross-tier hits and not one
survived reading. Powers of ten stay fatal, because a graded 0.0381 m printed as
"38.1 millimetres" is the same answer (DR9). `--physical-scales` restores them.

### `numsweep.mjs`

**Before.** Exit 0 on zero source files, on a resolver built from nothing, and
on source files holding no literal long enough to check. Digit-grouped literals
were split and therefore never checked, which is the same regex hole as above
and bites hardest here, where the whole question is about long numbers.

**After.** Refuses on all three empty states, on a golden named in `wave.json`
that does not exist (previously skipped in silence, quietly shrinking the
resolver), and on a missing content directory. Round literals skipped because
`sigFigs` strips trailing zeros are now **counted and reported** rather than
silently dropped; on `decision` that is 514 literals the gate never looks at.

### `wave_check.py`

**Before.** Globbed `<wave>/banks/<prefix>*.json` and exited 0 when the glob
matched nothing. `LETTER_TIER[name[plen]]` raised `KeyError` on any file without
a b/i/a in that position, so a stray JSON crashed the run with a traceback
rather than refusing. And it read the banks in the **wave directory**, which is
not what production serves.

**After.** `--db --all` reads the 17,422 served rows from
`academy_quiz_questions` and groups them into banks by `module_key` and `scope`.
Refuses on an empty glob, a non-array bank, a filename with no tier letter, zero
questions, a question with no prompt or no answer index, and a wave missing a
whole tier. A new **tier-parity** check compares the three tiers of one course
against each other, which nothing did before; it found a real defect on its
first run. When no tier has two banks the near-duplicate check is announced as
**not applied** instead of passing in silence.

### `digestleak.py`

**Before.** Its first two statements excused a missing digest and returned 0.
For the **13 live courses with a wave directory and no digest**, that is all
this gate has ever done. It also passed on an empty `fields.json`, on a digest
that is entirely commentary, and on a digest with no numbers.

**After.** Refuses all four. A shifted match must now agree **relatively** as
well as absolutely, which is the rule that removed 46 false flags from EC3 in
the sibling gate; digit-grouped literals are one number; and `--db --course`
loads the live answer key instead of the drifting copy.

### `digestpromise.py`

**Before.** A gate written because a generator died silently died silently
itself: no digest, exit 0. Its third check, module coverage, was **skipped in
silence** whenever there was no `BRIEF.md`, so a wave with no brief ran two
checks of three and reported the same "0 completeness problems".

**After.** Refuses a missing or empty digest, and refuses a run in which none of
the three checks could be applied. Which checks ran is printed every time, and
the missing-brief skip is stated out loud.

### `crosspair.py`

**Before.** Returned 0 unconditionally, and excused a missing digest first. Two
ways it examined less than it appeared to:

* **Its sentence splitter was guarded against the wrong thing.** It split on
  `(?<!\d)[.!?](?:\s+|$)`, refusing to split after a digit so that a decimal point
  could not cut a figure in half. The `(?:\s+|$)` already guarantees that: the
  dot in `3.14` is followed by a digit, never by whitespace. All the lookbehind
  did was refuse to end a sentence that ends in a number, which in engineering
  prose is most of them. Measured over the 3,433 lesson files production serves,
  it **merged 6,975 sentence boundaries across 2,229 files**. This gate's whole
  question is whether two figures are in the *same* sentence, and the guard was
  silently answering yes for pairs that were not. Removed.
* **It only ever sees five or more decimal places.** Across the 17 digests on
  disk when this was measured, that is 20,248 of 40,302 decimal literals:
  **half of every digest is invisible** to the pairing check. Kept as the default for signal, but the run
  now prints what it could not see and `--min-decimals` lowers it.

**After.** Refuses a missing digest, a missing content directory, zero lesson
files, a digest with no indexable literal, a digest in which no two rows share a
signature, and a lesson set with no multi-figure sentence. Candidates still exit
0, because crossing rows is often legitimate; only examining nothing is exit 2.

## 3. The negative controls

Each gate carries `--selftest`: red on a planted defect, green when it is
removed, and a refusal asserted on every empty or malformed input. All six pass
from the repository copy and from the installed toolkit copy.

| gate | checks | result |
|---|---|---|
| `leakage.mjs` | 24 | ALL PASS |
| `numsweep.mjs` | 15 | ALL PASS |
| `wave_check.py` | 17 | ALL PASS |
| `digestleak.py` | 14 | ALL PASS |
| `digestpromise.py` | 13 | ALL PASS |
| `crosspair.py` | 14 | ALL PASS |

Two of the controls were wrong on their first run and are worth recording,
because a negative control that passes for the wrong reason is the same class of
defect as the gates being repaired here:

* numsweep's planted "hand-typed" number was `9876543.21`, which **is** the
  fixture's head value at x1e2, so the resolver resolved it and the control
  failed correctly. A planted defect has to be checked against the resolver it
  is testing.
* wave_check's clean fixture tripped its own near-duplicate threshold, because
  all its prompts shared a template. The two banks now draw from disjoint word
  pools.

One control documents a limit rather than a capability. The EC3 coincidence, a
breakeven price of 73.3297 USD/bbl agreeing with a graded NPV of 22.35046
million USD under `per foot`, agrees to two parts in a hundred thousand. No
relative rule can separate that from a real restatement; only `leakScales` can.
Both halves are asserted: it fires with every scale allowed, and `leakScales`
suppresses it.

## 4. What the repaired gates found

### 4.1 The distribution, which is the main result

`leakage.mjs --db --all` swept 43 of 44 live courses (one refusal, below) and
found, after deduplicating to one row per course, tier pair and graded field:

* **94 exact-literal downward leaks** across **15 courses**
* **179 full-precision (10+ figure) same-tier answer prints** across **14 courses**

Every one of them is in a course with **no wave directory**. The 27 gated
courses that were swept have **zero** of either.

| | gated (27) | never gated (16) |
|---|---|---|
| exact downward leaks | **0** | **94** |
| full-precision self prints | **0** | **179** |

The never-gated 16 are `basin`, `dca`, `earthmodel`, `fluid`, `mapping`, `mbal`,
`petrophysics`, `porepressure`, `reservoircalc`, `rockphysics`, `scal`,
`seismolord`, `sim`, `waterflood`, `wellcorrelation`, `welldata`. They are the
Reservoir and Geoscience courses, built before the wave kit existed. The gate
works. It was never pointed at a third of the estate.

### 4.2 Ranked by whether a learner can score without doing the work

**Rank 1. `porepressure` Professional lesson hands over an Expert graded answer
to seventeen figures.**
`porepressure/intermediate/m06-the-prognosis-workflow/l04-onward-to-expert.md:31`
prints `Self check: 47408579.625 / (9.80665 x 4100) = 1179.1048116553065 kg/m3`.
`advanced.pp_emw_td` is 1179.1048116553065, tolerance 0.5. The lesson explicitly
frames it as "before starting the Expert tier, make its first computation
yourself" and then prints the result. A learner copies the digits.

**Rank 2. `rockphysics` Associate lesson tabulates the Professional answers.**
`rockphysics/beginner/m06-the-rock-physics-workflow/l04-onward-to-professional.md:19`
is a table whose rows include `dry frame bulk modulus | 7.350343061720982 GPa`
(`intermediate.kdry_gpa`, tol 0.01) and `gas case compressional velocity |
2905.697 m/s` (`intermediate.gas_vp`, tol 1). Two graded answers of the next
tier, in one table, at full precision.

**Rank 3. `welldata`, twelve leaks, and the pattern is structural.** Its
"onward to the next tier" and "capstone walkthrough" lessons print the next
tier's counts outright: `campaign_curves = 24`, `wrapped_samples = 161`,
`nullheavy_nulls = 272`, each with **tolerance 0**, each stated in an Associate
or Professional lesson and graded at the tier above. Tolerance 0 means the
grader wants that exact integer and the lesson supplies it.
(`welldata/intermediate/m06-the-import-workflow/l04-onward-to-expert.md:15-16`.)

**Rank 4. `reservoircalc`, ten leaks, same shape.**
`beginner/m04-the-properties/l02-constants-are-a-simplification.md` prints
`12.796077`, which is `advanced.stoiip_trend_mmstb` (tol 0.05), and
`0.656868` = `advanced.stoiip_delta_mmstb`. The Associate lesson gives away two
Expert volumetric answers.

**Rank 5. `dca`, six leaks.**
`beginner/m02-the-three-models/l03-hyperbolic-and-b.md:58` says the fit returns
"a $b$ tile reading 0.49999999999999994 rather than a tidy 0.5";
`intermediate.e3_b` is 0.5, tol 0.02. Also
`intermediate/m01-the-b-problem/l04-forcing-the-wrong-model.md` prints
`0.00133821021526847` = `advanced.e6_oil_di` (tol 2e-05).

**Rank 6. `scal` intermediate prints a value the Expert grader accepts.**
`intermediate/m05-saturation-height/l03-the-transition-zone.md:11` tabulates
`0.48353582519437843 m`; `advanced.sw_avg_crest_column` is 0.48345033394940007
with tolerance 0.002, so the grader accepts the lesson's number. This is a
tolerance overlap rather than a verbatim leak, and it still scores.

**Lower band, reported for completeness.** `mbal`'s
`beginner/m04-drive-indices/l02-computing-the-indices.md:44` prints
`1.0000000000000013`, which satisfies `advanced.a111_index_sum = 1`. The Expert
answer is that four drive indices sum to one, which is true by construction and
taught in the Associate tier; the leak is real and the consequence is near zero.
The same literal also satisfies `intermediate.pot_r2 = 0.999485673716372` at
tolerance 0.002, which is not a leak but a **grading weakness**: a learner who
types `1` scores that Professional field. That is a `collisions.py` finding that
`collisions.py` cannot see, because the colliding value is not another graded
field.

### 4.3 Two live courses whose lessons contain no numbers

**`completion` is the only refusal in the 44-course sweep, and the refusal is
the finding.** Its 78 lesson files across all three tiers contain **not one
digit**. Not a rounded figure, not a count. An 18-field graded capstone sits on
top of lessons that quote nothing, and both `leakage.mjs` and `numsweep.mjs` now
refuse rather than certify it. Under the old gates this course reported clean
twice over.

`perfsand` is the near neighbour: 67 digit-runs in 78 files and no literal of
seven significant figures, so `numsweep` refuses it too. For contrast,
`cementing` has 2,327 digit-runs and 518 long decimals.

### 4.4 `numsweep`: 163 untraceable numbers in a live Economics course

`fdp` checks 461 literals of 7+ significant figures and **163 of them resolve to
nothing** the wave derived: not a truth file, not a golden, not a declared
constant. They are concentrated in
`m03-what-a-sensitivity-says/l04-what-a-tornado-is-not.md`, whose tornado table
(`501.5628`, `3593.5679`, `3092.0051`, `1.510089`, `627.7671`, `3467.3636`, ...)
is entirely unaccounted for. Either the wave lost a truth file or a whole table
of engine figures was typed. `uncertainty` has 5 more
(`-118.6479`, `1157.5514`, `109.9036` in three lessons). The other 24 wave
directories are clean.

### 4.5 `wave_check` on the served banks: 330 problems, and 29 of 44 courses clean

Run against `academy_quiz_questions` rather than wave directories:

* **20 exact duplicate prompts**, all in two courses: `rockphysics` (13) and
  `reservoircalc` (7). In every case a **final-exam question is character-for-
  character a module question** of the same tier: rockphysics exam#21 is
  m04-the-gas-effect#1, reservoircalc exam#16 is m03-three-means#2. A learner
  who has done the module quizzes has seen the exam.
* **306 near duplicates**, of which **25 at Jaccard 1.00** (the verbatim ones
  above plus `fluid` 2 and `wellcorrelation` 1). Worst courses: `rockphysics` 73
  problems, `fluid` 62, `reservoircalc` 51, `sim` 45.
* **Tier parity, a new check, found `petrophysics` short**: its Associate tier
  serves **130** questions where its other two tiers serve 132, and its
  Associate final exam serves **40** where theirs serve 42. Two questions never
  landed. Nothing in the kit compared tiers before.
* **2 key imbalances**, both `porepressure`: answer index 3 carries 15/132 of
  the Expert tier and 18/132 of the Professional tier, under the 15 percent
  floor. A candidate who never picks the fourth option loses almost nothing.

### 4.6 `digestleak`, `digestpromise`, `crosspair`

* **`digestleak`: 17 digests swept, zero leaks.** The gate is sound and its
  subject matter is clean. Its problem was never false negatives on the waves it
  ran on; it was the 14 waves it excused.
* **`digestpromise`: 12 clean, 5 with problems.** `esp` names five modules its
  brief assigns that no digest section covers (Expert m01, m02, m03, m05,
  Professional m02), which is the PD6 shape that the gate exists for; `nodal`
  and `gaslift` one each. `gaswell` and `rodpump` carry unnumbered forward
  promises ("the closure residual printed below") that need a human to confirm.
* **`crosspair`: 15 live waves, 2,710 multi-figure sentences, 422 candidate row
  crossings** (nodal 96, gaslift 52, decision 45, esp 45, rodpump 37). These are
  candidates by design, not failures. Roughly 20,000 shorter decimal literals
  across those digests remain outside the index at the default five-decimal
  floor.

## 5. Corrections to the brief this audit was given

Checked rather than taken on trust, as instructed.

* **Confirmed.** All six gates exit 0 while examining nothing, each on its own
  empty-input path, reproduced before any change.
* **Confirmed.** `leakage.mjs` reports "fatal downward leaks: 0" on an empty
  `fields.json`. It is the most serious of the six.
* **Confirmed.** `collisions.py` asserts 18 fields and `bankkit.py` refuses to
  write a failed bank; both are the pattern the others needed.
* **Wrong in its specifics, right in its shape.** The brief warned of "a sweep
  pattern using `[^.]` as a sentence guard, which a decimal point terminates".
  There is **no `[^.]` anywhere in the wave kit**; grepped the whole directory.
  The defect of that shape is real but it is a different pattern: crosspair's
  `(?<!\d)` lookbehind, which fails in the opposite direction, merging sentences
  rather than splitting them. Measured at 6,975 merged boundaries.
* **Did not arise.** The brief noted that three migrations amend prompts by
  `UPDATE`, so the seed SQL gives a draft. This audit read the database for
  every answer key and every question bank and never parsed a seed, so the
  hazard did not apply. It is a good reason the `--db` modes added here should
  be the default.
* **Refinement.** The brief frames the problem as six gates that fail open on
  empty input. That is true and it is the smaller half. The larger half is that
  five of the six can only be *entered* through a wave directory, and 16 live
  courses have none, so the empty-input bug was never even reached for them. The
  fix that mattered was giving `leakage.mjs` and `wave_check.py` a database mode
  that needs no wave directory.

## 6. Not done, deliberately

* **No content was fixed.** Every leak in section 4 is reported for a later
  recut, as instructed.
* `bankkit.py`'s within-bank Jaccard and the question of whether a served bank
  still matches the bank file that seeded it are untouched.
* `briefleak.py`, `digestself.mjs`, `goldensweep.mjs`, `digestrepro.sh` and
  `harvest_digest.py` were read but are out of scope; the first three already
  exit non-zero on a missing input.
* Nothing was merged, applied or deployed. Production access was read-only.

## 7. Reproducing this audit

```bash
# negative controls, all six
for g in leakage numsweep; do node docs/gate-audit/$g.mjs --selftest; done
for g in wave_check digestleak digestpromise crosspair; do python3 docs/gate-audit/$g.py --selftest; done

supabase link --project-ref txcsbtvcdaqmkjjbhbeg      # Petrolord-NextGen

# every live course, against what production serves
node docs/gate-audit/leakage.mjs --db --all \
  --content-root <checkout of fcfe1022>/src/content/courses --workdir .
python3 docs/gate-audit/wave_check.py --db --all --workdir .

# the wave-directory gates, per wave
node   docs/gate-audit/numsweep.mjs      <wave_dir> --content <course dir>
python3 docs/gate-audit/digestleak.py    <wave_dir> --db --course <slug>
python3 docs/gate-audit/digestpromise.py <wave_dir>
python3 docs/gate-audit/crosspair.py     <wave_dir> --content <course dir>
```

Exit codes: 0 clean, 1 findings, 2 refused. **A 2 is not a pass.** If a wave log
records a 2 as success, the defect this audit exists to remove has come back.
