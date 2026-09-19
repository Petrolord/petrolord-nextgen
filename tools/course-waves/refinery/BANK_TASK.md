# refinery BANK TASK. The question banks.

You are writing the question banks for **`refinery`, "Refinery Feasibility &
Planning"**, path_order 49. Read LESSON_TASK.md first: every rule in it binds a
question as well as a lesson, and the digest is the only source of a number, a
date, a flag or an engine sentence.

## THIS FILE IS MAINTAINED. IF IT GOES STALE, SAY SO IN YOUR HAND BACK.

**CHECK: nothing is held at the tier level.** `structure.py` carries `HELD = {}`.
All six modules in all three tiers have their source, and every tier exam may
draw on all six of its modules. The three STOPPED recon items (RECON.md 3b, 3c,
3d) are not in the digest and no question may touch them.

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

The capstones grade dollars, barrels and rates. The banks test READING: which
row, which rule, which sign. The strongest shapes here:

- **Which row answers it.** Give a question the digest answers in one row (the
  crude unit's utilisation in SECTION 11, the Forcados line's unexplained in
  SECTION 20) and offer the neighbouring rows' figures as distractors.
- **Blank or zero.** A limit left blank and a limit typed as 0 give different
  plans (SECTIONS 9 and 13); a money box left blank is refused (SECTIONS 2 and
  10). Ask which of four printed outcomes follows from which entry.
- **Which sign.** A positive total variance on a cost line is bad for margin and
  on a revenue line good (SECTION 20). Ask for the margin effect of a printed line
  with the opposite sign as a distractor.
- **Which law.** Below the reference size the modular law is cheaper, above it
  dearer, equal at it (SECTION 3's flags and ratio). Ask at a printed capacity.
- **What the stream is worth and why.** A stream's value equals its product's
  price, exceeds its export price through a unit, or is zero with a surplus
  (SECTION 14). Ask which stream shows which, from the printed values.
- **Carried or thrown away.** SECTION 23 prints the tax with the loss carried
  forward and with the option off, year by year.

Never ask a learner to COMPUTE a figure the digest does not print. Never ask for
a capstone value. Never ask for an NPV or an IRR as a calculation; the NPV may
appear as a printed reading.

## THE ANSWER-LENGTH DEFECT. Read this before you write question one.

A shipped NextGen bank was passable WITHOUT READING: the second-longest option
scored about 80 percent, because a correct answer tends to be written carefully
and a distractor quickly.

- The correct option must not be the longest, nor the second-longest, more often
  than chance. With four options and 15 questions each length rank lands roughly
  three to four times.
- Distractors get the same care as the answer.
- Do not pad a correct option with a justifying clause. Put the justification in
  the explanation.
- **Report the length-rank histogram for every bank in your hand back.**

## Numbers, dates and refusals

- Every number, date and refusal in a question, an option or an explanation is a
  string the digest prints, at the digest's precision. `litsweep.py` sweeps prose
  AND table rows.
- A distractor number must ALSO be in the digest, attached to a different row or
  a different rule, so the question tests reading rather than recognising which
  figure looks printed.
- No option may equal a graded capstone value. `bankleak.py` checks it.

## Held items and owner decisions

H1 and H2 (SECTION 24) are limits and may be asked about as limits only. The
three owner decisions (loss carried forward for a refinery, no royalty, a
feedless unit is the crude unit) are current rules and may be keyed like any
rule, in the present tense.

## Owner copy rule

No em dashes, no en dashes, no "X, not Y" contrastive in any stem, option or
explanation. The schedule note (SECTION 15) may appear inside quotation marks as
the engine's words.

## Hand back

Per bank: the questions, the length-rank histogram, every literal and the digest
line it resolves to, and anything in the digest you believe is wrong.
