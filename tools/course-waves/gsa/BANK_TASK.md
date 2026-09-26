# EC8 Gas Commercialisation & Gas Sales Agreements: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle and its golden, the fixture README and the
engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `ec8<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-gsa/banks/ec8b_m01.json` and so on, with no path built from a
variable), because the kit's check-bank-sources reads literal paths only.
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

A question that names an Act, a regulation or a model agreement names it as the
digest does, with its edition. No licensed text is quoted. No rate or floor is
written that the digest does not print. **No key rests on one of the four stated
readings presented as the law**, and no key is a reported domestic base price.
A concept-only item (excess gas, a price review's outcome, the 90-day
investigation, the flare fine) is asked about as a concept and not keyed to a
number the engine does not compute.

## WHAT MAKES A GOOD EC8 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the Adjusted ACQ against the ACQ.** In 2027 the power plant's force
   majeure of 42000.000000 and seller shortfall of 6300.000000 come off the ACQ
   before the take-or-pay percentage applies.
2. **make-up after the Adjusted ACQ against make-up first.** The three orders on
   the same years are tabled side by side.
3. **the last year of a make-up period.** Make-up is usable in year y + N and
   none remains in the year after.
4. **the carry-forward cap.** The export 2029 credit is 3219250.000000, half the
   deficiency of 6438500.000000.
5. **the averaging window and its lag.** The export price for January 2027
   averages July to December 2026: 76.925000, a price of 9.731000.
6. **the four-decimal rule.** A fifth decimal of five or more rounds up.
7. **the commercial price.** On the reported 2026 base price of 2.180000 the
   commercial price is 2.680000.
8. **the excuses in their order.** Each s.110(10) excuse applies only up to the
   undelivered quantity.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `gsa_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no term, no series, no graded value. A question that
wants the capstone's subject teaches the METHOD with the digest's own Ekene
agreements. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option
and explanation for every capstone name, label, series, figure and graded
answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a multi-year ledger, a carry-forward credit
or a price formula; a Professional question never needs the S-curve, the NPV or
the four readings side by side.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The January 2027 identity is keyed
as equal because the digest checks it exactly.

## THE VOCABULARY AND THE COPY RULE

Digest section 24 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of". When you quote an engine message, quote it verbatim
and say it is the engine's own words. Never cite a digest section number in a
question or an explanation.
