# gasvalue BANK TASK. The question banks.

You are writing the question banks for **`gasvalue`, "Flare Gas to Value &
LPG/CNG"**, path_order 51. Read LESSON_TASK.md first: every rule in it binds a
question as well as a lesson, and the digest is the only source of a number, a
basis word or an engine sentence.

## THIS FILE IS MAINTAINED. IF IT GOES STALE, SAY SO IN YOUR HAND BACK.

**CHECK: nothing is held.** `structure.py` carries `HELD = {}`. All six modules
in all three tiers have their source, and every tier exam may draw on all six of
its modules.

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

The capstones grade engine figures; the banks test the rules, bases and
refusals behind them. The strongest shapes here:

- **Which rule, and what the other one gives.** The flare's methane from the
  methane against every unburned carbon counted as methane (SECTION 10 prints
  both and the ratio); the heating value on moles against on mass (SECTION 5);
  the fill limit on its basis against the other basis (SECTION 26); the latent
  heat on mass against on volume (SECTION 25); the gauge reading typed as
  absolute against gauge plus atmosphere (SECTION 30). Distractors are the
  figures the digest prints for the rule the engine does not use.
- **Which efficiency moves which species.** The stand-in row moves the CO2 and
  leaves the methane (SECTION 11); the all-CO2 probe leaves the flare as CO2 at
  every efficiency (SECTION 10).
- **Which share is avoided, and against what.** Avoided equals the flare times
  the recovery; three counterfactuals give three nets on one flare (SECTION 21).
- **Which price is the breakeven.** The breakeven, the lowest tested price that
  clears and the first price typed that clears are three figures (SECTION 22).
- **Which verdict, and why the best is not named.** passes, fails and not fully
  screened (SECTION 17); no route is ranked best until one passes (SECTION 23).
- **What the engine refuses, and what it answers.** A blank efficiency, a yield
  above the ceiling, a boiling point below the inlet, fewer than one working
  position, a stage with no duration, 2.5 dispensers: each is a REFUSED line.
  An overloaded forecourt is an answer (SECTION 33). A blank cost is taken as
  zero and named (SECTION 19). A blank lead time leaves the reorder point unstated
  (SECTION 26).

Never ask a learner to COMPUTE a figure the digest does not print. Never ask
for a capstone value. Never key a sentence the digest does not print (the
crude and supply audits replaced sixty questions that did: LESSON_TASK.md).

## THE ANSWER-LENGTH DEFECT. Read this before you write question one.

A shipped NextGen bank was passable WITHOUT READING: the second-longest option
scored about 80 percent, because a correct answer tends to be written carefully
and a distractor quickly.

- The correct option must not be the longest, nor the second-longest, more
  often than chance. With four options and 15 questions each length rank lands
  roughly three to four times.
- Distractors get the same care as the answer.
- Do not pad a correct option with a justifying clause. Put the justification in
  the explanation.
- **Report the length-rank histogram for every bank in your hand back.**

## Numbers and words

- Every number in a question, an option or an explanation is a string the
  digest prints, at its printed precision (three decimals for tonnes and
  cascade kilograms, two for dollars of revenue, cost, margin and capital, four
  otherwise). `litsweep.py` sweeps prose AND table rows. Keep the sign the
  digest prints (a "net minus the gross flare" of -25913.573 is not 25913.573).
- A distractor number must ALSO be in the digest, attached to a different row,
  a different basis or a different rule, so the question tests reading rather
  than recognising which figure looks printed.
- No option may equal a graded capstone value. `bankleak.py` checks it.

## Held items

H1 to H4 (digest SECTIONS 14 and 35) are limits. A question may ask what the
engine does and what the limit is. No question may key a flare efficiency tier,
a GWP edition, a credit price or a code fill limit as correct. No question may
be about what an engine used to do.

## Owner copy rule

No em dashes, no en dashes, no "X, not Y" contrastive in any stem, option or
explanation.

## Hand back

Per bank: the questions, the length-rank histogram, every literal and the
digest line it resolves to, and anything in the digest you believe is wrong.

## LEAD RULINGS (2026-09-19): what the Commercial & Trading key-truth audits found

Every one of the nine C&T tiers had 12 to 22 questions replaced at audit. Write
them right the first time:

1. **A key must rest on a PRINTED digest line.** Never on a lesson sentence the
   digest does not print (a gloss, a rationale, a definition, "In practice"
   context, course routing, which tier or wave teaches what), never on a
   reading the digest does not draw, never on learner arithmetic, never on a
   derived count. If the only support is a lesson sentence, the question goes.
2. **Every distractor must be provably false by a printed line.** A distractor
   the digest cannot refute, or one that is defensibly true, makes two answers.
3. **Signs.** Quote every number with the sign the digest prints. (When
   this was written litsweep compared absolute values, so a figure with its
   sign stripped passed it; it is sign-aware since 2026-09-21.)
4. **No throwaway distractors** ("Nowhere.", "Phase one."): the strategy "drop
   the short options, pick the shortest remaining" must stay near chance, as
   must lengthtails' strategies (refused above 40 percent).
5. **Cross-tier duplicates.** Run dupaxes over ALL banks of all three tiers
   that exist, yours and every other tier's.
6. **No "why" keys** unless the digest prints the reason.
7. **Parts and totals.** Never assert that printed parts sum to a printed total
   unless the digest prints that relation (rounding).
