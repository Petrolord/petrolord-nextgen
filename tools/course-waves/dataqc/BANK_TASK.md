# D1 Oilfield Data Quality: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's FINDINGS record, the oracle,
the library pins and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `d1<b|i|a>_<m01..m06|exam>.py` and `.json`.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## WHAT MAKES A GOOD D1 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the sentinel against missing.** EKENE-7's gamma ray: completeness 1.000000
   with -999.25 in place, 0.983333 with it converted.
2. **maxStep inclusive.** An index 0, 1, 2 with maxStep 1 reads coverage
   1.000000.
3. **the last present value.** Day 70 falls 7496.700000 bbl against day 68.
4. **the tolerance on the total.** Day 40: a difference of -36.500000 against an
   allowed 8.870000.
5. **a run against its first value.** The slow drift finds 0 runs at tolerance
   0.15; a previous-value rule would chain all 7 readings.
6. **the digit rule.** EKENE2 and EKENE12 are 1 edit apart and not near
   duplicates.
7. **the sample SD and its ceiling.** At ten readings: 2.846050.
8. **0.6745 against its reciprocal.** The gauge glitch reads 186.162000 as the
   engine computes it and 186.159450 with 1 / 1.4826.
9. **R6, R7, R8.** The water sand first quartile: 31.817500, 31.947500,
   31.825833.
10. **masking.** Two high plugs: G 2.275359 against a critical 2.507321.
11. **a standard or the data.** Phase two on its own averages centres at
    609.960000; against phase one, 611.380000.
12. **k and h in stated units.** Read as psi, the same k and h give 45 flags
    against 28.

## THE CAPSTONES ARE NOT YOURS

The three capstone fields live in `d1_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no field name, no series, no stated input, no answer. A question
that wants the capstone's subject teaches the METHOD with the digest's own
Ekene data. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option
and explanation for every capstone name, run of values, stated input and graded
answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a z-score, a fence or a chart; a Professional
question never needs a control chart or a scorecard.

## THE VOCABULARY AND THE COPY RULE

Digest section 32 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words.
