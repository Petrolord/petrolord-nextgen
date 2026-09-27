# SC3 Materials, Spares & Inventory Management: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and its golden, the fixture README and the
engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `sc3<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-materials/banks/sc3b_m01.json` and so on, with no path built
from a variable), because the kit's check-bank-sources reads literal paths only.
`banks/` holds one stub per bank already, each writing to its literal path;
replace the stub's question list and keep its emit line.

A figure of sixteen or more significant digits is written comma-grouped, as the
digest prints it.

## THE ANSWER-LENGTH DEFECT

**Balance the option lengths.** The correct option must not be the longest and
must not be the second-longest more often than chance. `lengthtails.py`
measures it. Lengthen distractors; do not edit the correct option to satisfy
the gate.

## THE OPENING DEFECT

**Vary the openings** of every option, the key's included: three distractors
opening the same way while the key does not is a tell.

## THE REGULATORY RULE AND THE READINGS

A question that names a text names it as the digest does, with its edition.
**No sentence of the MIT OpenCourseWare lectures is quoted or closely
paraphrased, in a prompt, an option or an explanation**: cite the lecture and
slide and use the course's own words. No cost, rate or figure is written that
the digest does not print. **No key rests on one of the stated readings
presented as the law.** **No key is a Monte Carlo figure**: a question on
lead-time risk keys the method, the seed, the draws, the draw order, the
direction of the P-labels or a closed-form figure the digest prints; a sampled
figure is keyed only as an estimate with its seed and draws.

## WHAT MAKES A GOOD SC3 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the override.** PSV-KIT is V at a weighted score of 68.000000, which by
   score alone is E.
2. **the item that crosses.** CEM-G at a cumulative share of 83.536840: B
   under at-or-below, A under include-crossing.
3. **the EOQ against the order.** 137.408584 against 140.000000.
4. **the discount type.** 349720.000000 all-units against 365590.042553
   incremental on the same schedule.
5. **the two service measures.** k 1.644854 at a cycle service level of 0.95
   against 1.026327 at a fill rate of 0.98.
6. **the rule against the print.** 339.179604 against the slide's 348.
7. **no shortage against the fill rate.** The ESP motor with 4 spares:
   0.998413 against 0.990054.
8. **the P90 of a sampled lead time is the low figure.** 83.198487 days on
   seed 20270301 and 20000 draws.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `materials_capstone.mjs` and NOTHING ABOUT THEM IS
IN `digest.txt`: no name, no input, no graded value. A question that wants the
capstone's subject teaches the METHOD with the digest's own Ekene register.
`gate_capstone_leak.mjs --banks banks` sweeps every prompt, option and
explanation for every capstone name, label, input, figure and graded answer at
four renderings.

## NO FORWARD REACH

An Associate question never needs a discount, a safety stock, a fill rate, a
Poisson level, an insurance spare or a lead-time Monte Carlo; a Professional
question never needs an insurance spare or a lead-time Monte Carlo.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The digest says so where it does:
the fill rate with n spares is the no-shortage probability with one spare
fewer, row by row.

## THE VOCABULARY AND THE COPY RULE

Digest section 30 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". When you quote an
engine message, quote it verbatim and say it is the engine's own words. Never
cite a digest section number in a question or an explanation.
