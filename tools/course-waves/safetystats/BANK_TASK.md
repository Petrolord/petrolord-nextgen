# H1 Safety Performance Statistics & KPIs: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `h1<b|i|a>_<m01..m06|exam>.py` and `.json`.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## WHAT MAKES A GOOD H1 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the base.** 0.776317 per 200,000 hours and 3.881586 per 1,000,000 are the
   same 9 recordables in 2318640 hours.
2. **hours against headcount.** Two crews of 40 read 2.500000 and 1.717033 per
   200,000 hours and the same per head.
3. **sum then divide against the mean of rates.** KWALE: 0.968312 against
   1.754760.
4. **a rolling window against the mean of the monthly rates.** AKASO's first
   window: 1.208038 against 2.026485.
5. **the rule of three against the central interval at zero events.** 14.527845
   against 17.863823 per 200,000 hours on the ABO hours.
6. **the central p-value against the minlike one.** UTOROGU: 0.051759 against
   0.025879.
7. **the centre line against the mean of the monthly u.** EGBEMA: 2.893273
   against 3.202958.
8. **a signal against a cause.** A month set aside needs a found cause; EGBEMA's
   revised centre is 2.389523.

## THE CAPSTONES ARE NOT YOURS

The three capstone workplaces live in `h1_capstone.mjs` and NOTHING ABOUT THEM IS
IN `digest.txt`: no workplace name, no count series, no hours, no answer. A
question that wants the capstone's subject teaches the METHOD with the digest's
own streams. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option
and explanation for every capstone name, input and graded answer at four
renderings.

## NO FORWARD REACH

An Associate question never needs an interval or a p-value; a Professional
question never needs a u-chart. The kit's `leakage.mjs` judges a reach by which
section owns the figure.

## THE VOCABULARY AND THE COPY RULE

Digest section 28 is binding on every prompt, option and explanation: "Poisson
distribution" or "Poisson count model", "severity rate", no P label on a
confidence interval, "observed FAR" where it matters. No em dashes, no en
dashes, no "X, not Y" contrastive. When you quote an engine message, quote it
verbatim and say it is the engine's own words.
