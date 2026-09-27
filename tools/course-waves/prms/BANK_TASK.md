# EC11 Reserves & Resources under SPE-PRMS 2018: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and its golden, the fixture README and the
engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `ec11<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-prms/banks/ec11b_m01.json` and so on, with no path built from
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

## THE REGULATORY RULE AND THE READINGS

A question that names a standard, an Act, a regulation or a guide names it as
the digest does, with its edition. **No sentence of SPE-PRMS 2018, the PRMS
FAQs or the 2011 Guidelines is quoted or closely paraphrased, in a prompt, an
option or an explanation**: cite the section and use the course's own words.
No rate, year or figure is written that the digest does not print. **No key
rests on one of the stated readings presented as the law.** A concept-only
item (a Nigerian booking rule, the Commercial Regulations' status report, a
price deck, a regulator's decision) is asked about as a concept and not keyed
to a number the engine does not compute. **No key is a Monte Carlo figure**: a
question on probabilistic aggregation keys the method, the seed, the draws, the
direction of the portfolio effect or a closed-form figure the digest prints (an
arithmetic sum, a sum of means, a risked mean); a sampled figure is keyed only
as an estimate with its seed and draws.

## WHAT MAKES A GOOD EC11 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **Pc as the product.** EKN-7: 10.500000 percent, against its Pg alone.
2. **P90 as the low estimate.** The 1P of 8.890000 carries the P90 label.
3. **increments against cumulative.** A Probable of 7.760000 against the 2P of
   16.650000.
4. **1P = 0 when the low case fails.** 1P 0.000000 and 2P 7000000.000000.
5. **the reporting basis.** 18873554.166667, 13211487.916667 and
   11229764.729167 BOE.
6. **the arithmetic sum against the sampled P90.** 15.809794 against 17.300834
   (seed 20271112, 20000 draws).
7. **the risked mean.** 10.114488, against 20.637674 with no chance applied.
8. **production out of every category.** The Ekene Reserves close at
   18.300000, 25.600000 and 33.900000.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `prms_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no input, no series, no graded value. A question that
wants the capstone's subject teaches the METHOD with the digest's own Ekene
field. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option and
explanation for every capstone name, label, series, figure and graded answer
at four renderings.

## NO FORWARD REACH

An Associate question never needs an economic limit, an entitlement basis, an
aggregation or a reconciliation; a Professional question never needs an
aggregation, a risked mean or a reconciliation.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The net entitlement under a
production tax and the working-interest figures are keyed equal because the
digest checks them equal exactly; the Ekene reconciliation's 2P difference
prints as 0.000000 and is not exactly 0, which the digest says.

## THE VOCABULARY AND THE COPY RULE

Digest section 31 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of". When you quote an engine message, quote it verbatim
and say it is the engine's own words. Never cite a digest section number in a
question or an explanation.
