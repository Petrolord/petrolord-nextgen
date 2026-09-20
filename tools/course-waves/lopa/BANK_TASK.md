# H3 Process Safety: LOPA & SIL Determination: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `h3<b|i|a>_<m01..m06|exam>.py` and `.json`.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## WHAT MAKES A GOOD H3 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **credit.** ORONI credits two IPLs for a required RRF of 13.500000; crediting
   all four gives 0.135000.
2. **a forgotten factor.** Leaving out ORONI's enabling condition takes the
   unmitigated frequency from 0.013500000000 to 0.045000000000.
3. **the band against the target.** A SIF of 0.009 is SIL 2 and misses a
   required 0.007407407407.
4. **the exact decade.** An RRF of exactly 100 is SIL1; 100.000001 is SIL2.
5. **the half in 1oo1.** 0.005256000000 against 0.010512000000.
6. **two out of two.** The typed beta factor changes nothing: 0.010576000000
   both ways.
7. **the series sum.** The teaching SIF sums to 0.001792971954, RRF 557.733208.
8. **the floor.** At a coverage of 0.7 the OBAGI valve's floor is 0.011847600000
   whatever the interval.

## THE CAPSTONES ARE NOT YOURS

The three capstone facilities live in `h3_capstone.mjs` and NOTHING ABOUT THEM IS
IN `digest.txt`: no facility name, no distinctive input, no answer. A question
that wants the capstone's subject teaches the METHOD with the digest's own
streams. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option and
explanation for every capstone name, distinctive input and graded answer.

## NO FORWARD REACH

An Associate question never computes a PFDavg from failure rates; a Professional
question never finds a longest interval. The kit's `leakage.mjs` judges a reach
by which section owns the figure.

## THE VOCABULARY AND THE COPY RULE

Digest section 32 is binding on every prompt, option and explanation: "beta
factor", "PFDavg" or "IPL PFD", never "severity", "likelihood" only in the TMEL's
name. No em dashes, no en dashes, no "X, not Y" contrastive. When you quote an
engine message, quote it verbatim and say it is the engine's own words.
