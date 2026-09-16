# FC4 BANK TASK. 396 questions, and the one defect that got past this before.

You are writing the question banks for **FC4 `gasprocessing`**, path_order 42.

## Shape

- **132 questions a tier**: 15 per module bank across six modules (90) plus a
  42-question tier exam. 396 in the wave.
- Four options each, one correct, an explanation on every one.
- Module banks draw only on their own module's lessons. The exam draws on the
  whole tier.

## THE ANSWER-LENGTH DEFECT. Read this before you write question one.

A shipped NextGen bank was passable WITHOUT READING: the **second-longest
option** scored about 80 percent across the banks measured, because a correct
answer tends to be written carefully and a distractor tends to be written
quickly. Twenty-five live courses still carry it.

So, mechanically, for every bank:

- **The correct option must not be the longest option more often than chance,
  and must not be the second-longest more often than chance.** Measure it.
  With four options and 15 questions, each length rank should land roughly
  three to four times.
- Distractors get the same care as the answer. A distractor that is obviously
  a throwaway is a free mark.
- Do not pad a correct option with a justifying clause. Put the justification
  in the explanation, which is where it belongs and where it cannot be
  counted.
- Report the length-rank histogram for every bank in your hand-back. A bank
  without that histogram is not finished.

## Numbers

**Every numeric literal in every prompt, option and explanation must resolve
against `digest.txt`.** There are two sweeps and you run both:

1. the wave's `numsweep`, which SKIPS round literals whose significant
   figures fall below seven once trailing zeros are stripped, which on a
   digest rendered to six decimals is most of the round figures in it;
2. a **FULL-LITERAL substring sweep against `digest.txt` with no
   significant-figure floor at all**, matching on float value so that 880
   resolves against the digest's `880.000000`.

Run both. Report both counts. **"The gate went green" and "the gate examined
my files" are two separate claims and both need a number beside them.**

## SECTION 14 IS WITHHELD AND THREE EXPERT MODULE BANKS ARE HELD WITH IT

Expert m01, m02 and m03 have no lessons, because the Joule-Thomson chain is
under repair and digest Section 14 prints nothing. **Do not write those three
module banks, and do not write any exam question that touches the
Joule-Thomson coefficient, the marched let-down, the cold separator
temperature or the water the cold gas can hold.** That is 45 module-bank
questions and however many exam questions would have drawn on them.

The Expert exam is written LAST, after those three modules exist.

## Do not leak the capstone

No question may state, imply or let a reader derive a capstone condition or a
graded value. The capstone streams are IKOT ABASI, OTUMARA and ESCRAVOS, and
nothing about any of them is in the digest, which is how it stays. If you
find yourself wanting a number that is not in the digest, that is the
mechanism working.

## Question quality

- A question whose answer can be reached by eliminating three absurdities has
  not tested anything. Every distractor should be something a learner who
  half-understood the lesson would actually pick.
- Prefer questions that turn on WHICH number answers WHICH question, because
  that is this course's thesis. "The circulation is 6.4 gpm" and "the duty
  per gallon is 1815.85 Btu" answer different questions and one of them does
  not know the rate exists.
- The three scope seams are fair game as questions about BOUNDARIES: what
  this engine hands to Flow Assurance, what Separation already owns, what
  the published cases can and cannot catch. They are not fair game as
  questions about the other course's content.

## Owner copy rule

No em dashes and no "X, not Y" contrastives, in prompts, options or
explanations.

## Hand back

Per bank: the question count, the length-rank histogram of the correct
option, both sweep counts with the number of literals examined, the number of
unresolved literals, and any question you are unsure of.
