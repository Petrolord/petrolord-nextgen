# compliance BANK TASK. The question banks.

You are writing the question banks for **`compliance`, "Compliance, Audit &
Quality"**, path_order 60. Read LESSON_TASK.md first: every rule in it binds a
question as well as a lesson, and the digest is the only source of a number, a
date, a status word or an engine sentence.

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

This course grades whole numbers in its capstones and TEACHES words, verdicts and
dates. The banks are where the words and verdicts are tested. The strongest
question shapes here:

- **Which gate refuses, and why.** Give a record from the digest and ask which
  requirement stops it (a hold point with no verifier; a Major NCR with a
  corrective action complete and unchecked; a critical item answered
  Nonconformant with no finding). The options are the other requirements the
  same gate checks, in the order the engine checks them.
- **Which status, and which date drove it.** Give an obligation row from SECTION
  3 and ask for its status, with distractors that are the statuses a reader gets
  by using the due date instead of the earlier date, the default lead time
  instead of the recorded one, or a filing from an earlier period.
- **Which count moves.** Give a change from the digest (a certificate expiry
  moved, a plan marked Closed, an audit cancelled with a reason) and ask which of
  four printed counts changes.
- **Two words the engine keeps apart**: On track and Compliant; covered, stale
  and never examined; a correction and a corrective action; a hold point and a
  witness point; resolved and decided.

Never ask a learner to COMPUTE a day count or a percent the digest does not
print. Never ask for a capstone value.

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

## Numbers, dates and statuses

- Every number, date and status in a question, an option or an explanation is a
  string the digest prints. `litsweep.py` sweeps prose AND table rows.
- A distractor number must ALSO be in the digest, attached to a different row or
  a different rule, so the question tests reading rather than recognising which
  figure looks printed.
- No option may equal a graded capstone value. `bankleak.py` checks it.

## Held items and recorded findings

R1 to R5 (digest SECTION 23) may be asked about as LIMITS: "what does this
engine say about X, and why is it not graded". None may be keyed as a figure the
learner should rely on. Never key the negative "next due in" reason (R4) as a
correct reading of an obligation.

## Owner copy rule

No em dashes, no en dashes, no "X, not Y" contrastive in any stem, option or
explanation. The one verbatim engine string with that shape may appear inside
quotation marks as the engine's words.

## Hand back

Per bank: the questions, the length-rank histogram, every literal and the digest
line it resolves to, and anything in the digest you believe is wrong.
