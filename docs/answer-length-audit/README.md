# B4: answer-length recut (2026-09-21)

## The defect
A four-option question gives its correct option a length rank: 0 when it is the
longest option, 3 when it is the shortest. In 29 of the 65 served courses one
rank held most of a bank's answers, so a candidate who never read a question
could pass by always choosing, say, the second-shortest option. On the worst
drilling courses that read-nothing score was above 0.90.

The rule (the wave kit's bankkit band): in every served bank (one tier's final,
or one module's quiz pool) each rank holds between 12 and 40 percent of the
correct answers.

## What changed
Distractor text only. No prompt, correct option, answer_index, option order or
explanation changed, and no edit adds a number the option did not already
print (the tooling refuses any of these, plus em or en dashes, a new
"X, not Y" contrastive, and internal-source wording).

Lengthening was preferred three to one: a distractor was lengthened by naming
the mechanism it wrongly invokes, which makes it more tempting while keeping it
wrong. Shortenings were used only where lengthening cannot reach the rank the
band needs.

## Before and after
Measured by `tools/answer-length-audit/audit.py` over every active row of a
local scratch copy of production (main 76cd1f35e), before and after applying
all 29 migrations. Read-nothing is the question-weighted mean, over banks, of
the best score from always choosing one length rank in that bank (ties
credited fractionally). Full per-bank tables: `banks-before.csv`,
`banks-after.csv`.

| Course | Banks failing before | After | Read-nothing before | After | Questions changed | Option edits | Lengthened | Shortened |
|---|---|---|---|---|---|---|---|---|
| basin | 14/21 | 0 | 0.523 | 0.365 | 68 | 90 | 68 | 22 |
| casingtubing | 21/21 | 0 | 0.922 | 0.399 | 207 | 247 | 91 | 156 |
| cementing | 21/21 | 0 | 0.924 | 0.396 | 209 | 260 | 105 | 155 |
| completion | 21/21 | 0 | 0.938 | 0.399 | 214 | 267 | 107 | 160 |
| dca | 10/21 | 0 | 0.397 | 0.351 | 23 | 34 | 12 | 22 |
| earthmodel | 17/21 | 0 | 0.496 | 0.392 | 54 | 68 | 43 | 25 |
| fluid | 12/21 | 0 | 0.398 | 0.337 | 26 | 36 | 36 | 0 |
| geomech | 21/21 | 0 | 0.849 | 0.405 | 176 | 215 | 83 | 132 |
| hydraulics | 21/21 | 0 | 0.883 | 0.404 | 190 | 237 | 95 | 142 |
| integrity | 21/21 | 0 | 0.828 | 0.396 | 178 | 225 | 176 | 49 |
| mapping | 3/21 | 0 | 0.324 | 0.319 | 3 | 4 | 2 | 2 |
| mbal | 12/21 | 0 | 0.449 | 0.363 | 43 | 60 | 37 | 23 |
| perfsand | 21/21 | 0 | 0.943 | 0.396 | 220 | 271 | 177 | 94 |
| petrophysics | 21/21 | 0 | 0.707 | 0.412 | 118 | 215 | 215 | 0 |
| porepressure | 13/21 | 0 | 0.457 | 0.350 | 50 | 68 | 57 | 11 |
| reservoircalc | 3/21 | 0 | 0.327 | 0.320 | 3 | 5 | 2 | 3 |
| rockphysics | 5/21 | 0 | 0.330 | 0.321 | 6 | 7 | 3 | 4 |
| scal | 14/21 | 0 | 0.403 | 0.358 | 23 | 31 | 28 | 3 |
| seismolord | 7/21 | 0 | 0.402 | 0.318 | 35 | 67 | 67 | 0 |
| sim | 17/21 | 0 | 0.434 | 0.356 | 35 | 40 | 39 | 1 |
| stimulation | 21/21 | 0 | 0.823 | 0.397 | 173 | 218 | 157 | 61 |
| torquedrag | 21/21 | 0 | 0.918 | 0.400 | 205 | 250 | 109 | 141 |
| waterflood | 11/21 | 0 | 0.423 | 0.368 | 22 | 24 | 22 | 2 |
| wellcontrol | 21/21 | 0 | 0.891 | 0.399 | 197 | 236 | 117 | 119 |
| wellcorrelation | 7/21 | 0 | 0.358 | 0.306 | 23 | 41 | 41 | 0 |
| wellcost | 21/21 | 0 | 0.826 | 0.390 | 183 | 227 | 179 | 48 |
| welldata | 6/21 | 0 | 0.390 | 0.315 | 30 | 67 | 67 | 0 |
| welldesign | 21/21 | 0 | 0.886 | 0.394 | 195 | 241 | 100 | 141 |
| welltest | 5/21 | 0 | 0.335 | 0.323 | 8 | 9 | 9 | 0 |
| **total (29 courses)** | 429 | 0 | | | 2917 | 3760 | 2244 | 1516 |

Whole estate (25738 questions, 1365 banks):

| | before | after |
|---|---|---|
| banks out of band | 429 (29 courses) | 0 |
| always pick rank 0 / 1 / 2 / 3 | 0.212 / 0.277 / 0.330 / 0.182 | 0.228 / 0.264 / 0.278 / 0.230 |
| best single rank per bank (exposure ceiling) | 0.439 | 0.329 |

The per-bank ceiling cannot reach 0.25: the band permits a rank to hold up to
40 percent, and a bank of 15 needs whole questions. The estate-wide
"always pick rank k" score is now 0.23 to 0.28 for every k.

A wording check found no new tell: the share of correct and wrong options
containing since, because, so, which, always or only moved by under one point,
and an "odd one out" rule on those words scores the same as before.

## Why 1516 of the 3760 edits are shortenings
Every shortening sits in a bank that needed questions at rank 0 or rank 1.
Those ranks require the correct option to be longer than all (rank 0) or all
but one (rank 1) of the distractors. The correct option may not be edited, so
where the long distractors sat above it the only move is to trim them below it.

* The twelve drilling and completion courses (casingtubing, cementing,
  completion, geomech, hydraulics, torquedrag, wellcontrol, welldesign, and to
  a lesser degree perfsand, stimulation, integrity, wellcost) were written with
  the correct option second-shortest in 80 to 100 percent of questions: one
  short distractor, two long ones. Lengthening can only move such a question
  to rank 3. Each 15-question module needs at least 2 questions at rank 0 and
  2 at rank 1, and each 42-question final 6 and 6, so those moves are
  shortenings by construction (two cuts for rank 0, one for rank 1). The
  agents set ranks 0 and 1 at or near that floor and took the rest of the band
  by lengthening.
* integrity, wellcost and stimulation had the correct option second-longest;
  the rank-0 floor needs the single longer distractor trimmed.
* In the geoscience and reservoir courses shortenings are few and each one is
  a rank-0 or rank-1 floor move.

Every shortening cuts hedges or restatement and keeps the distractor's wrong
claim intact; the validator warns if a cut drops words the explanation relies
on (none remain). Six courses (fluid, petrophysics, seismolord,
wellcorrelation, welldata, welltest) needed no shortening at all.

## Pre-existing question defects found while editing

FIXED in the follow-on (see "Follow-on" below and `FIXES.md`); this list is kept as the record of what was flagged.
Reported by the editors; each needs an owner or author decision because the
fix would touch a prompt, a correct option or an explanation.

* stimulation advanced m02-from-slurry-to-pack ord 14: the CORRECT option says
  the pseudo-skin "halves" with the damage factor; it passes through a
  nonlinear correlation and a logarithm, so it does not halve.
* wellcontrol advanced m02-kick-tolerance ord 7: the explanation ("the shut-in
  limit is generous") contradicts the keyed shut-in case.
* perfsand beginner m01-what-this-course-decides ord 12: the prompt (entering a
  thirty degree phasing) does not match its options.
* hydraulics beginner m06 ord 13: the explanation's "the first" points at a
  distractor in the stored order.
* A distractor that is arguably also correct (double-key risk):
  cementing adv m02 14, adv m04 15, adv m05 11, beg final 22 and 23, beg m01
  12, beg m03 12, beg m04 9, int final 19, 23 and 35, int m03 7 and 15, int m04
  15, int m05 11; casingtubing beg final 28, adv m04 11, beg m05 14, int m01 7,
  int m04 9 and 15, int m05 9, int m06 7, int final 34 and 41; stimulation adv
  m06 10, int m02 10, int m03 14, int m05 12, int m06 10 and 15; torquedrag beg
  final 31, beg m06 10, int final 39 and 40, adv m03 14, int m02 15; completion
  adv final 35, int m03 14, beg final 29; geomech beg final 41, beg m06 9;
  integrity adv final 38 and 42; wellcost adv m05 13, adv m01 13, int final
  30; welldata beg m06 13; welltest adv m04-gas 15; earthmodel int m02 13
  (distractor prints the correct coordinate); reservoircalc int m02 12.
* Near-duplicate questions: geomech adv final 31 = adv m04 9, adv final 38 =
  adv m05 11, int final 33 = int m04 7; hydraulics beg m04 11 = int m04 11,
  adv final 27 = int final 29; perfsand beg final 40 against beg m06 14.
* Length cannot be tuned on questions whose options are bare numbers or file
  names (welldata beg m01 10 and 11, seismolord final 37 and m03 13,
  petrophysics beg m03 14, int m03 9); those were left alone and other
  questions moved instead. The seismolord beginner bank's correct options run
  far longer than its distractors, so its lengthened distractors are wordy; a
  rewrite of the correct options would read better.

## Files
* `migrations/20261020_b4_len_<course>.sql`, one per course, generated by
  `tools/answer-length-audit/recut.py sql <course>` from
  `tools/answer-length-audit/edits/<course>.json` (old and new text side by
  side). Each row is guarded by md5 of prompt and explanation, answer_index,
  and options equal to either the published or the recut list; anything else
  raises and rolls back. Re-running writes nothing.
* Owner apply: `/root/b4-apply/apply.sh` (README alongside): verify, scratch
  dryrun, prod-status, apply --prod.

## Follow-on: question fixes (owner instructions 2026-09-21)

After B4 was applied, the owner asked for every flagged item above to be
resolved, plus near-duplicates, the seismolord beginner correct options, tier
parity and anything else the editors had noted. Each item was checked against
its explanation, the course's lessons and, where a number or mechanism was at
stake, the engine. Each item now has one verdict and a one-line reason.
`FIXES.md` lists every item with its old and new text.

| Course | Fixed | Judged fine | Owner decision |
|---|---|---|---|
| cashflow | 1 | 0 | 0 |
| casingtubing | 11 | 0 | 0 |
| cementing | 16 | 0 | 0 |
| completion | 5 | 0 | 0 |
| corrosion | 2 | 0 | 0 |
| dca | 1 | 0 | 0 |
| decision | 1 | 0 | 0 |
| earthmodel | 1 | 0 | 0 |
| fdp | 1 | 0 | 0 |
| fluid | 42 | 0 | 0 |
| gasprocessing | 1 | 0 | 0 |
| gaswell | 1 | 0 | 0 |
| geomech | 8 | 4 | 0 |
| heattransfer | 1 | 0 | 0 |
| hydraulics | 8 | 3 | 0 |
| integrity | 2 | 0 | 0 |
| mapping | 1 | 0 | 0 |
| mbal | 0 | 1 | 0 |
| perfsand | 3 | 0 | 0 |
| petrophysics | 17 | 5 | 0 |
| porepressure | 1 | 0 | 0 |
| qra | 1 | 0 | 0 |
| reservoircalc | 34 | 0 | 0 |
| rockphysics | 72 | 8 | 0 |
| rotating | 1 | 0 | 0 |
| scal | 2 | 0 | 0 |
| seismolord | 63 | 2 | 0 |
| sim | 35 | 0 | 0 |
| stimulation | 7 | 0 | 0 |
| torquedrag | 11 | 4 | 0 |
| uncertainty | 1 | 0 | 0 |
| waterflood | 1 | 1 | 0 |
| wellcontrol | 5 | 0 | 0 |
| wellcorrelation | 27 | 21 | 0 |
| wellcost | 3 | 0 | 0 |
| welldata | 5 | 3 | 0 |
| welltest | 1 | 0 | 0 |
| **total (37 courses)** | **393** | **52** | **0** |

By category (fixed / judged fine / owner decision):

| Category | Result |
|---|---|
| the four owner-named defects | 4 / 0 / 0 |
| further defects found while fixing (reservoircalc tolerance, torquedrag sliding torque) | 2 / 1 / 0 |
| arguably-correct distractors (the README list plus ones found on the way) | 52 / 0 / 0 |
| near-duplicates | 258 / 43 / 0 |
| seismolord beginner tightening | 61 / 0 / 0 |
| bare-number and file-name options (review only) | 0 / 6 / 0 |
| tier parity (petrophysics beginner final 40 to 42) | 2 inserts |
| other editor notes | 14 / 2 / 0 |

### The four named defects
* stimulation advanced m02-from-slurry-to-pack ord 14: the key said halving the
  damage factor halves the pseudo-skin. The engine (`fracDesign.js`
  fracProductivity, Cinco-Ley and Samaniego) passes the dimensionless
  conductivity through a logarithmic correlation. On the published case the
  pseudo-skin moves from -5.31 to about -4.77, so it rises toward zero and
  does not halve. The key and explanation are corrected, and so is the lesson
  (m02 l05), which made the same claim. answer_index is unchanged.
* wellcontrol advanced m02-kick-tolerance ord 7: the explanation now gives the
  lesson's mechanism for why the shut-in case binds on the slant well. The key
  is unchanged.
* perfsand beginner m01 ord 12: the prompt now asks which condition the engine
  refuses outright, which is what its options and explanation were about. The
  key is unchanged.
* hydraulics beginner m06 ord 13: the explanation no longer points at "the
  first" option by stored order. The key is unchanged.

### Where the correct option or prompt changed
The correct option or the prompt changed in these cases, and each item
carries its reason:
* the stimulation key above;
* every rewritten duplicate, since each is a new question at the same
  answer_index and the same length rank;
* the 58 tightened seismolord beginner correct options, under the owner's
  authority for that bank only;
* prompt sharpenings where that was the honest single-answer fix: completion
  advanced final 35 and beginner final 29, geomech beginner final 41 and
  beginner m06 9, integrity advanced final 42, sim beginner and intermediate
  m06 4, and torquedrag beginner final 34.

No answer_index moved anywhere.

### Lessons corrected alongside
Lesson copy ships in the NextGen bundle, so these three need an upload:
* stimulation advanced m02 l05: the lesson said halving the damage factor
  halves the pseudo-skin, the same error as the key.
* reservoircalc intermediate m03 l05: the lesson said "the gap has widened
  from twelve points to ten".
* wellcorrelation beginner m06 l03: the lesson said four answers are graded to
  0.01 m where the capstone grades five.

### Tier parity
The petrophysics beginner final held 40 questions and every other final holds
42. Ords 41 and 42 are added, written from the beginner lessons and kept in
band. All 18 petrophysics module banks already held 15 questions each.
`academy_serve_quiz` draws 25 questions at random from the active pool and
grades against the attempt's stored question_ids, so a larger pool changes
nothing else. Nothing in the repo hard-codes 40.

### Attempts
Attempts store `question_ids`, and a submitted attempt keeps the score it was
graded with. An OPEN attempt is graded at submit against the row as it stands
then. So a learner midway through a quiz that holds a rewritten question would
answer the old text and be graded against the new key. No answer_index moved,
so this only matters for rewritten questions. The scratch mirror holds no
learner data, so it cannot count them. `apply.sh attempts` runs a read-only
count on production; run it before applying.

### Owner decisions raised (not fixed here)
* **Finals that restate module questions.** The duplicate heuristic caught the
  closest pairs. The editors found that in several courses (sim, fluid,
  rockphysics, reservoircalc, geomech, wellcorrelation, corrosion) most final
  questions restate a module question in new words. They fixed the ones listed
  and any clear same-concept, same-answer copy they met; in rockphysics and
  wellcorrelation that became a sweep. Whether finals should be module
  reprises at all is a curriculum decision. A full rewrite of every final is a
  programme of its own.
  Costed options and a pick: [../graded-field-audit/FOLLOW-ON-PROGRAMME.md](../graded-field-audit/FOLLOW-ON-PROGRAMME.md) §5 (decision D7).
* completion beginner m02 l02 says casing drift mandrels are "twelve inches
  long for most sizes". API 5CT uses 6 in below 9-5/8 in and 12 in from
  9-5/8 in up. Check this against the spec before editing the lesson. The
  question no longer depends on it.
* seismolord beginner lessons print 3603.96 and 8189.64 where the unrounded
  values give 3603.95 and 8189.63. The questions mix both, and every key is
  still unambiguous. **Fixed in the round-off** (below): the engine gives
  3603.96 and 8189.64.
* heattransfer capstone lesson: the "two routes usually disagree" wording
  could be sharpened.
* earthmodel intermediate m02 ord 13 option 3: its arithmetic does not match
  its own description. It is still wrong, and the correct figure is not
  printed in the lessons. **Fixed in the round-off** (below).

## Round-off (2026-09-21)

The owner closed the B4/B5 stream ("fix the small items with the lead's best
pick on each"). The bank half is eight migrations, one per course, each a
`tools/answer-length-audit/fixes/ro_<course>.json` group generated by
`fix.py sql` and guarded exactly like the follow-on files. They run after the
37 follow-on files and `20261022`; `/root/roundoff-apply/apply.sh` refuses
until those are applied. `fix.py` gained two rules for them: a distractor that
already tied the correct option at the same width (a bare figure) may be
reworded without the tie counting as new, and a figure an edit introduces may
be `derived_numbers` if its derivation uses only figures the lessons print.

| File | Rows | What |
|---|---|---|
| `20261023a_ro_bank_linesizing.sql` | 1 | class A sign hit: intermediate m03 ord 1 option 3 invented a "-1.0000000000 and 1.0000000000" bound on s; it now says s never exceeds one in size, still wrong, same length rank |
| `20261023a_ro_bank_consequence.sql` | 1 | class B: the explanation states exp(-k beta D) with k beta 1.1 per m, as the course prints it |
| `20261023a_ro_bank_hygiene.sql` | 1 | class B: "one tenth of 8 h" in words for 8 x 10^(-1) |
| `20261023a_ro_bank_supply.sql` | 1 | class B: the sign-flipped distractor is a "cap surplus of 34.8249" |
| `20261023a_ro_bank_riskchange.sql` | 5 | class B: the five sign-flipped day counts carried in words ("181 days past", "45 back", "92 back", "30 days have passed", "30 back") |
| `20261023a_ro_bank_crude.sql` | 1 | advanced m01 ord 9: the explanation drops the "claim about a problem nobody posed" gloss #182 cut from the lessons, in the lesson's own words |
| `20261023a_ro_bank_earthmodel.sql` | 1 | intermediate m02 ord 13 option 3: x 1623.753937146834 = 1400 + 2 x 111.87696857341697, which is what "adding a second build increment" gives; still wrong |
| `20261023a_ro_bank_seismolord.sql` | 3 | beginner final 13 and 37, m02 5: 3603.96 and 8189.64 throughout, and the explanations name the stored DT |

Every change is distractor or explanation text: no prompt, correct option or
answer_index moved. Each bank stays in the length band
(`audit.py` on the replay: 1365 banks, 0 failing).

**Seismolord.** The engine divides the DT the LAS stores, 277.4726 (float32
277.4725952), not the three-decimal 277.473 the lessons print. That gives
3603.9595 m/s and an impedance of 8189.6372, so 3603.96 and 8189.64 are the
correctly rounded values, and the lessons already printed them. 3603.95 and
8189.63 only come from dividing 277.473 by hand. The bank's two stray
3603.95 / 8189.63 (final 13 explanation, final 37 option 2 and explanation)
and final 13's 2605.14 (engine 2605.1455) are corrected, and the three lessons
that show the division (m01 l04, m02 l01, m02 l03) now divide 277.4726 and say
it is the stored value, so a learner's hand arithmetic lands on the printed
figure. Every other anchor depth rounds the same either way.

**Sign hits that were not bank edits.** The two hygiene `-300` hits and the
five linesizing `-30.000000` hits named a digest line, not a rewording. Both
lines are added (`h2_dump.mjs`, `fc2_dump.mjs`), the digests re-cut with the
in-repo engines (the only diff is the added line) and re-pinned in
`waves.json`. Both litsweeps are now clean. The fiscal `-100` hit needs the
full fiscal digest re-cut, which stays an owner item.

The bank source pairs under `tools/course-banks/` carry the same text, so a
re-cut does not revert it (`check-bank-sources.py`: 126 pairs reproduce).
