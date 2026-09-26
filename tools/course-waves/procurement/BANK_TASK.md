# SC2 Procurement, Tendering & Contracting: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle and its golden, the fixture README and
writer, and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `sc2<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-procurement/banks/sc2b_m01.json`,
`/root/cat-wip-procurement/banks/sc2i_exam.json`,
`/root/cat-wip-procurement/banks/sc2a_m06.json` and so on, never a path built
from a variable), because the kit's check-bank-sources reads literal paths
only. `banks/` holds one stub per bank already, each writing to its literal
path; replace the stub's question list and keep its emit line.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## THE OPENING DEFECT

**Vary the openings** of every option, the key's included: three distractors
opening the same way while the key does not is a tell.

## THE REGULATORY RULE

A question that names an Act, a regulation or a guidance names it as the digest
does, with its edition. No licensed text is quoted. No threshold or rate is
written that the digest does not print. A question on s.14 states the reading
it uses, or asks about the two readings side by side; no key rests on one
reading presented as the Act's settled meaning.

## WHAT MAKES A GOOD SC2 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the technical percentage against weighted points.** WS1 scores
   82.500000 percent and 330.000000 weighted points.
2. **the unit rate against the quoted amount.** WS2's corrected price is
   867400.000000 where its quoted total is 849400.000000.
3. **the average against the uncited highest.** WS3's nitrogen is priced at
   35400.000000 by the cited average; the uncited option gives 37200.000000.
   Only the average is ever a key.
4. **the discount deducted.** WS1's corrected price is 943200.000000 and its
   evaluated cost 928200.000000.
5. **lowest-ratio against linear.** WS2 scores Sc 97.353920 by the lowest ratio
   and 75.552171 by the linear method, and the award moves from WS3 to WS5.
6. **relative against absolute technical scores.** WS1's St is 97.058824
   relative to the top bid; its technical percentage is 82.500000.
7. **with and without the life cycle.** MS4's evaluated cost is 546244.982386
   with the life cycle and 519709.475000 without.
8. **the population against the sample standard deviation.** On Annex I Example
   1 the population figure is 315974.537496 and the sample figure
   326337.099079; the Guidance's own limit uses the population figure.
9. **points against relative.** The s.14 lead of MS2 over MS4 is 4.541020
   percentage points, or 7.960608 percent of MS4's content.
10. **s.16 protects and does not select.** MS3 sits 6.445634 percent above the
    lowest evaluated cost and is protected; the award does not move to it.
11. **P90 against P10 of a cost.** The day rate's P90 cost is 837897.131515 and
    its P10 1029964.481686; P90 is the LOW figure.
12. **who carries the overrun.** Under the day rate the company pays
    71671.875955 of the expected overrun and the contractor absorbs
    35329.377418.
13. **the estimate against its base.** The should-cost estimate is
    895361.041667; the base before contingency is 813964.583333.
14. **printed against exact.** The Guidance prints Company D's combined score as
    98.34; the engine's is 98.333333.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `sc2_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no bid code, no scope, no price, no stated seed, no
graded value. A question that wants the capstone's subject teaches the METHOD
with the digest's own Ekene tenders. `gate_capstone_leak.mjs --banks banks`
sweeps every prompt, option and explanation for every capstone name, code,
scope, unit-rate run, price, seed and graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a life-cycle cost, the weighting band, an
abnormally low test, a content percentage or an s.14 lead; a Professional
question never needs a contract-type comparison, a cost percentile, a
should-cost or the boundary table.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The tie section shows the pattern:
the costs 1000000.0000001 and 1000000 print alike at six decimals and tie only
because the twelve-digit key agrees.

## THE VOCABULARY AND THE COPY RULE

Digest section 25 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words. Never cite a
digest section number in a question or an explanation.
