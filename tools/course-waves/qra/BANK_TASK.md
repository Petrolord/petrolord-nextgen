# H5 Quantitative Risk Assessment: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `h5<b|i|a>_<m01..m06|exam>.py` and `.json`.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## WHAT MAKES A GOOD H5 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the conditional branch.** EREMOR's explosion frequency is 0.000054000000;
   delayed ignition taken as unconditional gives 0.000060000000.
2. **the pooled outcome.** The two pool fire leaves, 0.000007000000 and
   0.000007500000, pool into 0.000014500000.
3. **the sum of f times Pd.** The process deck LSIR is 0.000148150000; the
   largest contribution alone is 0.000081000000.
4. **the occupancy.** The operator IRPA is 0.000017541379; no occupancy gives
   0.000154803000 and hours over 8766 give 0.000017529373.
5. **f times N.** The JISIKE PLL is 0.002420000000; f over N gives
   0.006421666667.
6. **the crew's hours.** FAR 2.016667 over the crew's hours, 121.000000 over
   one person's.
7. **N or more.** F(12) is 0.000009700000; "more than N" gives 0.000001700000.
8. **the lower band.** 0.1 x 0.1 x 0.1 is 0.0010000000000000002 in double and
   stays TOLERABLE for workers.
9. **undiscounted fatalities.** The EDIKAN ICAF at the checklist limits is
   8026550.41; dividing by discounted fatalities gives 9350246.71.

## EVERY KEY RESTS ON A LINE THE DIGEST PRINTS

Added 2026-09-21 for every wave that copies this file. The Commercial & Trading
and Energy Transition key-truth audits (2026-09-19) found **12 to 22 keys per
tier resting on a lesson sentence rather than on a digest line**, and replaced
every one. The KEY of every question must be provable from a line `digest.txt`
PRINTS: never a lesson sentence the digest does not print (a gloss, a
rationale, a definition, an "In practice" aside, course routing), never a
reading the digest does not draw, never learner arithmetic or a derived count.
If the only support for a key is a lesson sentence, the question goes. Every
distractor must be provably false by a printed line. Quote every number with
the sign the digest prints: `litsweep.py` is sign-aware since 2026-09-21. Hand
back, per question, the digest line its key rests on.

## THE CAPSTONES ARE NOT YOURS

The three capstone facilities live in `h5_capstone.mjs` and NOTHING ABOUT THEM IS
IN `digest.txt`: no facility name, no distinctive input, no answer. A question
that wants the capstone's subject teaches the METHOD with the digest's own
streams. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option and
explanation for every capstone name, distinctive input and graded answer, and
direction 11 sweeps them for every graded answer of the courses that own this
course's seams.

## NO FORWARD REACH

An Associate question never computes a PLL, a FAR, an F-N figure, an ALARP band
or a cost-benefit figure; a Professional question never bands an individual risk
or weighs a measure. The kit's `leakage.mjs` judges a reach by which section owns
the figure.

## THE SEAMS, THE VOCABULARY AND THE COPY RULE

A probability of death is always a stated input: never ask a learner to compute
one, and every sentence that names a probit, a dose or a plume says it belongs
to the consequence course. Digest section 34 is binding on every prompt, option
and explanation: "risk" qualified, never "severity", "likelihood", "NPV" or
"IRR". No em dashes, no en dashes, no "X, not Y" or "X and not Y" contrastive.
When you quote an engine message, quote it verbatim and say it is the engine's
own words.
