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

## Pre-existing question defects found while editing (NOT fixed here)
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
