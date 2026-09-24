# D2 Machine Learning on Well Data: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle, the library pins and the engine's source
comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `d2<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/dai-wip-mlcore/banks/d2b_m01.json` and so on), because the kit's
check-bank-sources reads literal paths only.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## THE OPENING DEFECT

A D1 bank showed a new tell: all three distractors opening the same way while
the key did not. **Vary the openings** of every option, the key's included.

## WHAT MAKES A GOOD D2 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the population SD against the sample SD.** On 180 rows the factor is
   1.002789.
2. **training centre against all-rows centre.** GR 59.844500 against 60.250741.
3. **the test mean against the training mean.** A test R-squared of 0.815322
   against 0.816151.
4. **a random-row split against a group split.** At seed 5 with the
   attributes, 5.311723 against 16.999672.
5. **a random split that flatters nothing.** On the logs alone the optimism is
   -1.747549 at seed 5.
6. **lambda and its effective degrees of freedom.** 7.000000 at lambda 0 and
   0.965695 at lambda 1000.
7. **the best fold mean.** The logs at lambda 10 read 5.826789; the attributes
   at their best, lambda 100, read 6.773053.
8. **precision against recall.** Pay on the test wells: precision 0.857143,
   recall 1.000000, F1 0.923077.
9. **AUC against accuracy.** AUC 0.997475 while the accuracy at 0.5 is
   0.955556.
10. **raw against scaled condition number.** The attribute design reads
    7608.495043 scaled; centred, 8.661304.
11. **the converged coefficient against an early stop.** RT 0.241141 converged
    against 0.196989 after 3 updates.
12. **an importance with its seed.** CALI ranks last at -0.031931.

## THE CAPSTONES ARE NOT YOURS

The three capstone fields live in `d2_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no field name, no well, no dataset, no stated input, no answer. A
question that wants the capstone's subject teaches the METHOD with the digest's
own Ekene wells. `gate_capstone_leak.mjs --banks banks` sweeps every prompt,
option and explanation for every capstone name, run of values, stated input and
graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a penalty, a fold, a classifier or a
condition number; a Professional question never needs a condition number, a
separation test, a Newton trace, an importance or a learning curve.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. Section 8 shows the pattern: the
two test RMSE rows print alike and the two R-squared values differ.

## THE VOCABULARY AND THE COPY RULE

Digest section 26 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words. Never cite a
digest section number in a question or an explanation.
