# EC7 Petroleum Industry Act 2021 & Nigerian Fiscal Terms: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The audit,
the engine's FINDINGS record, the oracle and its golden, and the engine's
source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `ec7<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/cat-wip-pia/banks/ec7b_m01.json`, `/root/cat-wip-pia/banks/ec7i_exam.json`,
`/root/cat-wip-pia/banks/ec7a_m06.json` and so on, never a path built from a
variable), because the kit's check-bank-sources reads literal paths only.
`banks/` holds one stub per bank already, each writing to its literal path;
replace the stub's question list and keep its emit line.

A figure of sixteen or more significant digits (a money figure of a billion or
more at six decimals) is written comma-grouped, as the digest prints it. A
quoted text is quoted from the digest section your tier owns: the royalty
texts and the texts behind the stack are Associate material, and the rest of
the quoted texts are Professional and Expert material.

## THE ANSWER-LENGTH DEFECT

**Balance the option lengths.** The correct option must not be the longest and
must not be the second-longest more often than chance. `lengthtails.py`
measures it. Lengthen distractors; never edit the correct option to satisfy the
gate.

## THE OPENING DEFECT

**Vary the openings** of every option, the key's included: three distractors
opening the same way while the key does not is a tell.

## THE REGULATORY RULE AND THE OPEN READINGS

A question that names an Act or a regulation names it as the digest does, with
its edition. No licensed text is quoted. No threshold or rate is written that
the digest does not print. **No key rests on one open reading presented as the
law**: a question on the royalty by price base year, the new-acreage lease rate
onshore or in shallow water, or the deep offshore rate under the Nigeria Tax Act
2025 either states the reading it uses or asks about the readings side by side.
A concept-only provision is asked about as a concept (what the text says, whom
it applies to), never keyed to a number the engine does not compute.

## WHAT MAKES A GOOD EC7 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the weighted tranche against the flat terrain rate.** At 50,000 bopd in
   shallow water the weighted rate is 0.112500; the terrain rate is 12.5
   percent.
2. **the deep offshore weighted tier against a step.** At 60,000 bopd deep
   offshore pays 0.054167; the whole volume at 7.5 percent is a wrong method.
3. **the gas rate with the in-country share.** With half the gas used
   in-country the rate is 0.037500.
4. **the benchmarks on each base.** In 2025 the Regulations' low benchmark is
   54.120000 and the Act's 55.200000.
5. **the cap on crude and condensate revenue, hydrocarbon tax only.** On the
   CPR case the cost still carried at the end, 93000000.000000, is forfeited;
   companies income tax deducts opex in full.
6. **the barrels after the new-lease cap.** The new onshore lease earns
   16000000.000000 in 2026, 1000000 barrels below the cap and 2000000 after it.
7. **the framework by year.** One onshore ledger pays the tertiary education
   tax in 2024 and 2025 and the development levy from 2026, 4920525.461957 in
   2026.
8. **the escrow condition.** 2026 companies income tax is 30069497.282609 with
   the condition met and 33069497.282609 without it.
9. **the share and the take.** Ekene Alpha's take is 66.564877 at 100 and at 50
   percent.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `pia_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no term, no row, no graded value. A question that wants
the capstone's subject teaches the METHOD with the digest's own Ekene cases.
`gate_capstone_leak.mjs --banks banks` sweeps every prompt, option and
explanation for every capstone name, label, production run, figure and graded
answer at four renderings.

## NO FORWARD REACH

An Associate question never needs the deductions, the cost price ratio or the
allowances worked; a Professional question never needs the year-by-year switch,
the deep offshore readings, the escrow condition or the decomposition by
provision.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. Ekene Alpha's take at 100 and at 50
percent is equal because the digest checks it exactly.

## THE VOCABULARY AND THE COPY RULE

Digest section 25 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words. Never cite a
digest section number in a question or an explanation.
