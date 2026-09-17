# FC9 Corrosion & Integrity: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The wave's
`RECON.md` and `FINDINGS.md`, the engine's source comments and the vendored repair
record are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four options
each, one correct, and an explanation that says WHY the wrong ones are wrong.

## THE ANSWER-LENGTH DEFECT, AND IT IS THIS PROGRAMME'S WORST ONE

A shipped bank was passable **without reading the question**, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. The bank gate measures this and it is the
first thing to check.

## WHAT MAY NOT BE AN ANSWER, AND IN THIS COURSE IT IS MOST OF THE ENGINE

Digest section 21 lists eleven held items and one withdrawal. **No question may
require any of them as an answer, and no option may state one as a fact.** In
particular:

* **no corrosion rate the correlation produced.** Not as an answer, not as an
  option, not as a figure a learner must compute. Every de Waard-Milliams constant
  is unsourced.
* no rate category word, because the bands are held.
* no sour severity region and no material choice, because both are WITHDRAWN.
* no inspection interval, minimum thickness, retirement thickness or
  fitness-for-service verdict, because all four are NOT PROVIDED.
* no published film onset temperature, no published validity band, no threshold
  VALUE as a thing to recall.

**What a question MAY do with a held item is ask the learner to recognise that it
is held.** "Which of these four numbers does the engine say is not sourced in the
repository" is a good question. "What is the film-stripping threshold" is not.

## WHAT MAKES A GOOD FC9 QUESTION

The engine's own distinctions, all of them in the digest:

1. **partial pressure against fugacity**, and which one drives the rate.
2. **a typed zero against a blank box**, which the engine treats differently.
3. **efficiency against availability**, and which one limits the result. A 95
   percent corrosion inhibitor at 80 percent availability delivers 76.000000
   percent effective protection and 4.800000 times the datasheet metal loss.
4. **a computed onset against a quoted one.** The onset moves by 96.443771 degrees
   Celsius across the swept fugacities.
5. **a refusal against a least-limiting default.** Below the pH reference the
   engine refuses rather than returning a factor of one.
6. **a withheld answer against a zero one.** At 1 mol percent H2S the regime is
   sulphide, the rate is unchanged at 0.754524 mm/yr and the category and the life
   are WITHHELD.
7. **the shear verdict acting on the rate.** At 60 ft/s the rate is 13.080024
   mm/yr against a credited 1.896603 mm/yr, a ratio of 6.896552.
8. **which of the module's own limits governs**, which is the binding constraint.

## THE THREE VOCABULARY COLLISIONS, AND THEY BITE HARDEST HERE

Digest section 22 is binding on every prompt, every option and every explanation.

* **Never write bare "inhibitor" in a prompt, an option or a heading.** Always
  "corrosion inhibitor". A learner who has taken Flow Assurance will read the bare
  word as methanol or monoethylene glycol.
* **Never write bare "erosion".** Always "mechanical erosion" or "erosional wall
  loss", and never as though this module measured it.
* **Never present a friction factor or a Reynolds number as the platform's single
  answer.** Say it is this module's, and say the line sizing course has its own.

A sibling course shipped one word carrying three different quantities and it had
to be gated out afterwards. These three are named before you meet them.

## THE CAPSTONE CONDITIONS, AND THE DECISION IS SETTLED: YOU DO NOT RESTATE THEM

The three capstone scenarios live in `fc9_capstone.mjs` and NOTHING ABOUT THEM IS
IN `digest.txt`. Not a plant name, not a temperature, not an allowance, not a
design life. That is deliberate, it is gated, and this section exists because the
Expert lesson writer hit it and asked.

**It was considered and rejected to add a stated-conditions section to the
digest.** `gate_capstone_leak.py` fails on two separate directions if anyone
does: direction one fails a digest carrying any condition value out of the three
frozen scenarios, and direction four fails a digest naming any of the three
plants. Both were re-run against this digest while this decision was taken and
both are clean. A digest that carried the conditions would be a digest a learner
could work the graded capstone out of.

**AND THE BANKS THEMSELVES ARE SWEPT NOW, WHICH THEY WERE NOT WHEN THIS WAS
WRITTEN.** Directions one and four above are digest-facing, and for most of this
wave that was the whole of `gate_capstone_leak.py`: it read `digest.txt`, the
generator, the vendored golden and the sibling waves, it had no `--banks` path
and no argument parsing at all, and its clean result therefore said NOTHING
WHATEVER about the 396 questions. Three writers were told otherwise. The Expert
writer built the bank-side sweep by hand rather than trusting the claim, and got
0 condition hits, 0 plant-name hits and 0 graded hits across 792 field texts.
DIRECTION SEVEN is that sweep, folded in: every condition, every graded value at
all four renderings and every plant name against every prompt, option and
explanation, with three plants proved on each run and a clean control that trips
none of them. Run it as `python3 gate_capstone_leak.py`, which defaults to
`<wave>/banks`, and `--no-banks` is the deliberate declaration that a run is not
sweeping them.

**AND THE THREE VOCABULARY COLLISIONS ARE GATED NOW TOO.** Section 22 says the
copy gate catches a breach and `gate_copy_rule.py` checks dashes and
contrastives and nothing else. `gate_vocabulary.py` is the check the lab already
ran over the panels, promoted to run over all 78 lessons and all 396 questions:
never bare "inhibitor" in a prompt, an option or a heading, "corrosion
inhibitor" on first use everywhere, and never the bare geological "erosion". It
carries 16 negative controls, it unwraps hard-wrapped markdown before it matches,
and it clears the engine's own verbatim messages by finding them in the digest.

**And the fallback does not exist either, so do not reach for it.** The lesson and
bank sweeps have no stated-inputs path. `sweep_literals.py` USED TO PROMISE ONE
in its docstring, listing "a stated input of the bank's own tier" as its third
resolver. There was never any such path: it tests a literal against the small
integers, the digest and the declared constants and against nothing else, and
that docstring is corrected rather than implemented. `litsweep.py` resolves a literal by
verbatim whole-number presence in `digest.txt` and by nothing else; its only
escape hatch is the `constants` block of `wave.json`, which in this wave holds
held correlation constants and not one capstone condition. A figure stated in
your own prompt resolves against nothing and is reported as a bad literal. That
was checked by reading the gate rather than assumed.

**So: no question in any of the three banks names a capstone plant or carries a
capstone condition at any precision.** A question that wants the capstone's
subject teaches the METHOD with the digest's own worked cases, which is what the
merged FC1 separation banks and its Professional capstone lesson do: the order of
the chain, what each step needs from the one before it, what a complete answer
contains, and which of the module's own limits governs. The shipped default case
in section 19, the corrosion inhibitor arithmetic in section 9, the shear
coupling in sections 11 and 19 and the sulphide withholding in section 13 are all
in the digest and all fair game.

The conditions reach the learner on the capstone surface itself, authored from
`fc9_capstone.mjs`, which is where the capstone states them in the engine's units.
That is a later phase and it is not the bank's business.

## NO LEAKS

No question may carry a graded capstone answer at any precision.
`sweep_literals.py` in this directory sweeps every PROMPT, every EXPLANATION and
every OPTION for exactly that, and its `--selftest` plants one in each of the
three and requires all three found. An earlier version of that gate swept the
field NAMES rather than the field TEXTS, so roughly forty five percent of a live
corpus was never examined. Read the counts line.

No question may reach FORWARD into a later tier's digest sections either. The
kit's `leakage.mjs` judges that by which section owns the figure.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive, in a prompt, an option, an
explanation or a title. When you quote an engine message, quote it verbatim and
say it is the engine's own words.
