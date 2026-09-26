# EC9 Joint Ventures, Operating Agreements & Cost Recovery: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle and its golden, the fixture README and the
engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `ec9<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-joa/banks/ec9b_m01.json` and so on, with no path built from a
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

A question that names an Act, a model contract or an accounting agreement
names it as the digest does, with its edition. No licensed text is quoted. No
rate, tolerance or multiple is written that the digest does not print. **No key
rests on one of the three stated readings presented as the law.** A
concept-only item (the compensation on an assignment, cover in kind, interest
on cash balances, the expert determination, the haircut, a sliding scale of
profit shares) is asked about as a concept and not keyed to a number the
engine does not compute.

## WHAT MAKES A GOOD EC9 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **paying against beneficial interest.** NOC's paying interest is 0.000000 on
   a beneficial 20.000000 under the Ekene carry.
2. **the reconciliation lag.** The January 2027 over-call of 400000.000000 is
   credited in March under a lag of two months.
3. **the lower of two tolerances.** The Ekene 2027 budget's allowed overrun is
   3000000.000000, held by the amount.
4. **a marginal scale against the whole base at one rate.** The Ekene 2031
   operating base of 58000000.000000 is charged 1455000.000000.
5. **an uplift on the opening balance.** The Ekene carry is recovered in 2033
   with its compound uplift and in 2031 under the Act with none.
6. **the Act's refundable kinds.** The back-in refund is 98000000.000000 with
   156000000.000000 excluded.
7. **cover among the paying parties.** EKO covers 1230769.230769 of PB's unpaid
   2000000.000000.
8. **the premium base.** PB's premium is 10800000.000000 on its proportionate
   share of 2700000.000000.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `joa_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no term, no series, no graded value. A question that
wants the capstone's subject teaches the METHOD with the digest's own Ekene
joint venture. `gate_capstone_leak.mjs --banks banks` sweeps every prompt,
option and explanation for every capstone name, label, series, figure and
graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a year's reconciliation ledger, a carry
recovery, a default or a PSC; a Professional question never needs a
non-consent premium, a buy-in or the three readings side by side.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The closing identity of the cash
call ledger is keyed within the digest's stated bound because the digest checks
it that way.

## THE VOCABULARY AND THE COPY RULE

Digest section 25 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of". When you quote an engine message, quote it verbatim
and say it is the engine's own words. Never cite a digest section number in a
question or an explanation.
