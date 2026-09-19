# crude BANK TASK. The question banks.

You are writing the question banks for **`crude`, "Crude Assay & Blending"**,
path_order 48. Read LESSON_TASK.md first: every rule in it binds a question as
well as a lesson, and the digest is the only source of a number, a basis word or
an engine sentence.

## THIS FILE IS MAINTAINED. IF IT GOES STALE, SAY SO IN YOUR HAND BACK.

**CHECK: nothing is held.** `structure.py` carries `HELD = {}`. All six modules in
all three tiers have their source, and every tier exam may draw on all six of its
modules.

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

This course grades four-decimal figures in its capstones and TEACHES bases,
rules and refusals. The banks are where the bases and rules are tested. The
strongest question shapes here:

- **Which basis, and what the wrong one gives.** Give a blend from the digest
  and ask for its API, its sulfur or its CII, with distractors that are the
  figures the digest prints for the wrong basis beside it (the volume-weighted
  API mean, sulfur on volume, SARA on volume, the index on volume).
- **Which reading of the curve.** T50 interpolated against the first grid point
  past 50 percent and against the averaged component midpoints (SECTION 14);
  a cut the curve cannot answer (SECTIONS 10 and 15).
- **Which term moved.** Netback with losses on the product side against losses
  after the costs, a blank freight, an unpriced cut (SECTION 16).
- **Which specification binds, and what relief is worth.** The Apapa recipe's
  binding rows, their value of relief against their rowPrice, the marginal
  barrel against the unit cost (SECTIONS 21 to 23).
- **What the engine refuses, and what it answers.** Infeasible as an answer; a
  typed 0 against a blank maximum; a blank cost refused; a specification skipped
  with its reason (SECTION 25).

Never ask a learner to COMPUTE a figure the digest does not print. Never ask for a
capstone value.

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

## Numbers and words

- Every number in a question, an option or an explanation is a string the
  digest prints, to its four decimals. `litsweep.py` sweeps prose AND table rows.
- A distractor number must ALSO be in the digest, attached to a different row, a
  different basis or a different rule, so the question tests reading rather than
  recognising which figure looks printed. The digest prints the wrong-basis
  figures beside the right ones precisely so that distractors can be real.
- No option may equal a graded capstone value. `bankleak.py` checks it.

## Held items

L4, C12 and C13 (digest SECTION 27) are limits. A question may ask what the
engine does and what the limit is. No question may key one basis as correct
where the course holds the choice open (the Refutas basis, the Watson boiling
point). No question may be about what an engine used to do.

## Owner copy rule

No em dashes, no en dashes, no "X, not Y" contrastive in any stem, option or
explanation.

## Hand back

Per bank: the questions, the length-rank histogram, every literal and the digest
line it resolves to, and anything in the digest you believe is wrong.
