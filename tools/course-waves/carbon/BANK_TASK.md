# carbon BANK TASK. The question banks.

You are writing the question banks for **`carbon`, "Carbon & Energy
Efficiency"**, path_order 52. Read LESSON_TASK.md first: every rule in it binds
a question as well as a lesson, the digest is the only source of a number, a
table row or an engine sentence, and the GWP rule and the rate rule bind every
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

- **Which input is missing, and what the engine says.** Give a call from
  SECTIONS 2, 12 to 17 or 19 and ask which refusal it returns. The options are
  the other refusals the same function can return.
- **Which set, which basis.** Give a methane line and ask which of the four
  printed set values produced it (SECTION 8); give an efficiency and ask
  which basis it is on (SECTION 13).
- **Computed or reportable.** Give a step from SECTION 9 and ask why the
  engine calls the inventory not reportable, with the engine's own reasons as
  the options.
- **Which figure moves.** Give a change the digest prints (a destruction
  efficiency, a GWP set, a radiation loss, a target oxygen, an exponent, a
  minimum approach, a discount rate) and ask which of four printed figures
  changes, with the printed before and after.
- **Two things the engine keeps apart**: CO2 and escaped methane; a set's
  fossil and non-fossil methane; computed and reportable; an LHV and an HHV
  efficiency; the ratio saving and the percentage-point shortcut; a threshold
  and a pinch; a levelised cost and capital set against one year; a verdict
  that stands, one labelled an upper bound, and one not assessed.

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
- Every factor, cost and efficiency in a question is one of the digest's
  invented figures and the stem says it is invented; every GWP is named with
  its set.

## Held items and the MD5-0 rules

The rules in SECTION 25 are CURRENT RULES at f0aef14 and may be keyed like any
rule. Ask about them in the present tense; no question may be about what the
engine used to do. H1 to H4 are limits and may be asked about as limits only:
no question may key a "right" choice between AR5 and AR6.

## Owner copy rule

No em dashes, no en dashes, no "X, not Y" contrastive in any stem, option or
explanation. Since MD45-1 no engine string the digest quotes carries a
contrastive, so none is exempt.

## Hand back

Per bank: the questions, the length-rank histogram, every literal and the
digest line it resolves to, and anything in the digest you believe is wrong.
