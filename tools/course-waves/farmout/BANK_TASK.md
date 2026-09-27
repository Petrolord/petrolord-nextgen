# EC10 Farm-ins, Farm-outs & Asset Valuation: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle and its golden, the fixture README and the
engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `ec10<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-farmout/banks/ec10b_m01.json` and so on, with no path built
from a variable), because the kit's check-bank-sources reads literal paths
only. `banks/` holds one stub per bank already, each writing to its literal
path; replace the stub's question list and keep its emit line.

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

A question that names an Act, a regulation or a guide names it as the digest
does, with its edition. No licensed text is quoted, and no Penn State sentence
is quoted: its figures are cited as figures. No rate, share or day count is
written that the digest does not print. **No key rests on one of the stated
readings presented as the law.** A concept-only item (which consideration
counts in the value of the transaction, the Commission's metrics, the
application fee, a decommissioning share, the tax on a deal, a subordinated
interest, a market value) is asked about as a concept and not keyed to a
number the engine does not compute. **No key is a Monte Carlo figure**: a
question on the risk view keys the method, the seed, the draws or a closed
form figure the digest prints; a draw estimate is keyed only as an estimate.

## WHAT MAKES A GOOD EC10 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the promote against the interest held after the event.** The appraisal
   well's ratio is 1.285714 on the cumulative 35.000000.
2. **the carry inside the promote.** The Ekene carry is 4400000.000000 on the
   success well.
3. **the consideration.** 10000000.000000: carry, bonus and reimbursement.
4. **the overrun rule.** FIN pays 18400000.000000 or 16000000.000000 on the
   same excess.
5. **the dry-hole cost in an EMV.** FIN's EMV is -1806224.721864.
6. **the break-even promote on the farminee's EMV.** 35.594574 percent.
7. **the fee on the stated value.** 392000.000000 on 5600000.000000.
8. **the value of information to one side.** 6745331.458602 to FIN.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `farmout_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no term, no series, no graded value. A question that
wants the capstone's subject teaches the METHOD with the digest's own Ekene
Deep prospect. `gate_capstone_leak.mjs --banks banks` sweeps every prompt,
option and explanation for every capstone name, label, series, figure and
graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs a cap, a drill-to-earn event, an EMV, a
break-even or a fee figure; a Professional question never needs the value of
information, a price per percent, a development carry or a back-in.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. The transfer identity of the deal
value is keyed within the digest's stated bound because the digest checks it
that way.

## THE VOCABULARY AND THE COPY RULE

Digest section 28 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive, no "rather than", no
", never", no "instead of". When you quote an engine message, quote it verbatim
and say it is the engine's own words. Never cite a digest section number in a
question or an explanation.
