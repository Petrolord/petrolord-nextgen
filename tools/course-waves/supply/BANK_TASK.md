# supply BANK TASK. The question banks.

You are writing the question banks for **`supply`, "Terminals, Depots & Fuel
Supply"**, path_order 50. Read LESSON_TASK.md first: every rule in it binds a
question as well as a lesson, the digest is the only source of a number, a
table row or an engine sentence, and the rate rule and the VCF rule bind every
stem, option and explanation.

## THIS FILE IS MAINTAINED. IF IT GOES STALE, SAY SO IN YOUR HAND BACK.

**CHECK: nothing is held.** `structure.py` carries `HELD = {}`. All six modules
in all three tiers have their source, and every tier exam may draw on all six
of its modules.

**CHECK: the digest's size.** `grep -c "^# SECTION " digest.txt` and `wc -l
digest.txt` are the authority. If the digest has been re-cut since the
foundation, those two commands win over any figure written here.

## Shape

- **132 questions a tier**: 15 per module bank across six modules (90) plus a
  42-question tier exam. 396 in the course.
- Four options each, one correct, an explanation on every one.
- Module banks draw only on their own module's lessons. The exam draws on the
  whole tier. The Expert exam is written LAST.

## What a good question in THIS course asks

This course grades numbers in its capstones, and the banks are where the
reading of a table, a refusal and a basis is tested. The strongest shapes:

- **Which input is missing, and what the engine says.** Give a call from
  SECTION 2, 4 or 18 and ask which refusal it returns. The options are the
  other refusals the same function can return.
- **Which base a charge bites on.** Give a line from the SECTION 18 walk and
  ask which figure it is a percent of; distractors are the other bases in
  `CHARGE_BASIS`.
- **Which figure moves.** Give a change the digest prints (a water cut raised,
  a bay added, the ocean loss swept, the exchange rate moved) and ask which of
  four printed figures changes, with the printed before and after.
- **Two things the engine keeps apart**: gross observed and standard volume;
  the volume at the water cut and the volume at the dip less the water height;
  a rack's utilisation and its probability of waiting; pumpable stock and
  stock less heel; a blank cost and a cost left out of the call; insurance on
  C&F and on CIF; a loss divided and a loss added.

Never ask a learner to COMPUTE a figure the digest does not print. Never ask
for a capstone value.

## THE ANSWER-LENGTH DEFECT. Read this before you write question one.

A shipped NextGen bank was passable WITHOUT READING: the second-longest option
scored about 80 percent, because a correct answer tends to be written carefully
and a distractor quickly.

- The correct option must not be the longest, nor the second-longest, more
  often than chance. With four options and 15 questions each length rank lands
  roughly three to four times.
- Distractors get the same care as the answer.
- Do not pad a correct option with a justifying clause. Put the justification
  in the explanation.
- **Report the length-rank histogram for every bank in your hand back.**

## Numbers and refusals

- Every number in a question, an option or an explanation is a string the
  digest prints. `litsweep.py` sweeps prose AND table rows.
- A distractor number must ALSO be in the digest, attached to a different row
  or a different rule, so the question tests reading rather than recognising
  which figure looks printed.
- No option may equal a graded capstone value. `bankleak.py` checks it.
- Every rate in a question is one of the digest's invented rates and the stem
  says it is invented.

## Held items and the MD3-0 rules

The rules in SECTION 23 are CURRENT RULES at e4d3b10 and may be keyed like any
rule: an opening stock is required, a dip below a partial table and an
unconvertible water cut are refused, bays are whole numbers, pumpable stock is
tank by tank, a loss with no density has no weight, insurance on CIF is solved
in closed form, a forward reference and an unknown stage are refused, and a
blank trucking cost is named. Ask about them in the present tense; no question
may be about what the engine used to do. H1 and H2 are limits and may be asked
about as limits only.

## Owner copy rule

No em dashes, no en dashes, no "X, not Y" contrastive in any stem, option or
explanation. The engine's "A FLOOR" sentence may appear inside quotation marks
as the engine's words.

## Hand back

Per bank: the questions, the length-rank histogram, every literal and the
digest line it resolves to, and anything in the digest you believe is wrong.
