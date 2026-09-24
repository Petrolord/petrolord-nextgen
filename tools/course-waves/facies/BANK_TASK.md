# D3 Electrofacies: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle, the library pins and the engine's source
comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `d3<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/dai-wip-facies/banks/d3b_m01.json`, `/root/dai-wip-facies/banks/d3i_exam.json`,
`/root/dai-wip-facies/banks/d3a_m06.json` and so on, never a path built from a
variable), because the kit's check-bank-sources reads literal paths only.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## THE OPENING DEFECT

A D1 bank showed a new tell: all three distractors opening the same way while
the key did not. **Vary the openings** of every option, the key's included.

## WHAT MAKES A GOOD D3 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the population SD against the sample SD.** On the 180 cored rows the
   factor is 1.002789, on every log.
2. **correlation against covariance.** The first component carries 0.682351 of
   the variance on the correlation matrix and 0.998581 on the covariance matrix.
3. **a loading against a unit weight.** NPHI on the first component: weight
   0.541336, loading 0.894337.
4. **one start against ten.** Seed 3 with one start stops at 58.330411; with ten
   starts it reaches 58.289042.
5. **raw against scaled distance.** 161 of the 180 cored rows have a nearest
   other row of their own facies on the raw logs; 173 on the standardised logs.
6. **the drop against the drop fraction.** At k 4 the inertia falls by
   22.942083, a fraction 0.282430 of the inertia at k 3.
7. **the clusters' silhouette against the core's.** 0.545063 for the k-means
   clusters and 0.528711 for the core facies as labels.
8. **one linkage against another.** Against the core, Ward scores an adjusted
   Rand index of 0.873388 and complete linkage 0.897678.
9. **one-to-one against majority.** The k-means accuracy under one-to-one
   matching at k 4 is 0.950000; majority matching at k 5 reads 0.983333.
10. **a grouping that knows nothing about rock.** The well names score an
    adjusted Rand index of 0.157021 against the core.
11. **a scaler fitted on the training rows against one fitted on the new
    well.** EKENE-6 held out: 0.833333 against 0.466667, and 0.633333 with no
    scaling.
12. **a tie decided by column order.** NPHI <= 0.123000 and PEF <= 4.090000
    split the root with the same decrease, 0.283413.

## THE CAPSTONES ARE NOT YOURS

The three capstone fields live in `d3_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no field name, no well, no dataset, no stated input, no answer. A
question that wants the capstone's subject teaches the METHOD with the digest's
own Ekene wells. `gate_capstone_leak.mjs --banks banks` sweeps every prompt,
option and explanation for every capstone name, run of values, stated input and
graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs an elbow, a silhouette, a tree of merges, a
match against core or an adjusted Rand index; a Professional question never
needs a neighbour rule, a classification tree, a withheld facies, a tie band or
a row cap.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. Section 9 shows the pattern: three
of the ten starts print 58.289042, and the digest prints their largest
difference from the winner before it calls them tied.

## THE VOCABULARY AND THE COPY RULE

Digest section 28 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words. Never cite a
digest section number in a question or an explanation.
