# SC4 Offshore & Marine Logistics: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and its golden, the fixture README and the
engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `sc4<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-marine/banks/sc4b_m01.json` and so on, with no path built from
a variable), because the kit's check-bank-sources reads literal paths only.
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

## THE SOURCE RULE AND THE READINGS

A question that names a source names it as the digest does, with its edition.
**No sentence of any of the six sources is quoted or closely paraphrased, in a
prompt, an option or an explanation**: cite the table, equation or example and
use the course's own words. No figure is written that the digest does not
print. **No key rests on one of the stated readings presented as the law.** A
concept-only item (a weather window, a stowage plan, a hire rate) is asked
about as a concept and not keyed to a number the engine does not compute. **No
key is a Monte Carlo figure**: a question on variability keys the method, the
draw order, the seed, the draws, the direction of an effect or a figure the
digest prints as not drawn (the plan at the modes); a sampled figure is keyed
only as an estimate with its seed and draws.

## WHAT MAKES A GOOD SC4 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the weather on the stated activities.** Port time 12.000000 hours against
   14.400000 when port is named too.
2. **the usable fraction.** A deck area capacity of 600.000000 m2 from an 800 m2
   deck at 0.75.
3. **the binding constraint.** Deck area at 0.900000 against the next highest.
4. **voyages rounded up against the average.** 10.345455 vessel-days against
   8.017727.
5. **the vessel rounding rule.** The nearest vessel short by 2.916667
   vessel-days where rounding up leaves 4.083333 spare.
6. **first-fit decreasing against first fit.** 599.229600 m2 against
   580.629600.
7. **M/M/c against M/D/c.** 3.180124 hours against 1.665786.
8. **the printed slip.** 1.53 printed where the formula gives 1.524986.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `marine_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no input, no series, no graded value. A question that
wants the capstone's subject teaches the METHOD with the digest's own Ekene
cluster. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option
and explanation for every capstone name, label, series, figure and graded
answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a fleet size, a deck plan by a rule, a queue
or a Monte Carlo; a Professional question never needs a queue or a Monte Carlo.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The decimal sum on
voyage-decimal-sum-at-capacity prints as 1.0000000000000002 and is read as at
capacity only by the twelve-digit rule, which the digest says.

## THE VOCABULARY AND THE COPY RULE

Digest section 30 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of", no "and not", no "and never". When you quote an
engine message, quote it verbatim and say it is the engine's own words. Never
cite a digest section number in a question or an explanation.
