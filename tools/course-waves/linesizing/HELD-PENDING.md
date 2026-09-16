# FC2 linesizing: items HELD by the coordinator, and what to do when the hold lifts

Written 2026-09-16 by the digest-correction pass (Suite commits 2881b799 and
f0c0ebc4). Every item below was FOUND and DELIBERATELY NOT FIXED. None is a
guess: each was examined and the reason for holding it is recorded.

## THE HOLD, and why it is the Section-7-or-later constraint running backwards

The correction pass was constrained to land every change at Section 7 or later,
so that no line number in Sections 1 to 6 moved while an Associate auditor was
citing them. The items below are the mirror image: they sit IN Sections 1 to 6
and fixing them ADDS lines there, which would move every line number in
Sections 7 to 18 while the Professional and Expert audits are reading those.

**Do not touch any of this until the coordinator releases the hold, which is
when BOTH the FC2 Professional and Expert audits have reported.** They were
launched against the 557 line build whose Sections 1 to 6 hash to
`d1fc57a873931e01ca41dd0b1b5fadc6` over lines 1 to 215.

When the hold lifts, rebuild with `sh build_digest.sh > digest.tmp && mv
digest.tmp digest.txt`, re-run `harvest_digest.py`, re-run the lab test
(`linesizingLab.test.js` rebuilds the digest byte for byte and will need the
same edits mirrored into it), and re-run
`node /root/dc-wavekit/digestheadings.mjs digest.txt --rules .`.

## ITEM 1. Six UNCOMPUTED comparisons in Sections 1 to 6

None is FALSE. Each characterises a relationship between two figures that the
file does not itself compute and print, which is the rule the rest of the
digest was brought up to in this pass: a sentence may name a figure the file
computes, and may NOT characterise the relationship between two figures unless
that relationship is itself computed and printed.

| digest line | the claim | what is missing |
| --- | --- | --- |
| 87 | "A rough pipe stops caring about the Reynolds number and a smooth one never does" | a claim about two printed COLUMNS, with nothing computed across them. Print the ratio of the two f columns on each row |
| 119 | "a share of 0.313805" | the figure is correct and is the only share in the file carrying no `(derived)` attribution. Add the attribution |
| 127 | "the friction term is identical in all three rows and the elevation term is symmetric about zero" | two sameness claims over a printed table. Print the spread of the friction column and the sum of the two elevation terms |
| 164 | "the velocity the erosional check reads, 2.244621 ft/s, is the same velocity the pressure drop read" | one figure printed, the equality asserted. Print the difference |
| 173 | "by the square root of the density ratio" | the ratio 3.532704 IS printed; the square-root relation to the two densities is not. Print sqrt of the density ratio beside it |
| 194 | "The erosional velocity is the same on every row, 13.545709 ft/s" | a sameness claim over a printed column. Print the spread of that column |

## ITEM 2. The one repair-history sentence left in the digest. STRIKE IT.

Digest Section 10, in the `THE CONTROL.` paragraph:

> "Both answers come out of the same bisection, and the one that used to be
> wrong was the one whose answer sat outside the bracket rather than the one
> the solver could not converge."

This pass left it, arguing it teaches why the control exists. **THE
COORDINATOR OVERRULED THAT AND ORDERED IT STRUCK**, and the Professional audit
then CONFIRMED IT IS THE ANCESTOR OF THREE LESSON DEFECTS, while confirming it
is not inherited anywhere in the Professional tier as it now stands. Its own
upstream is `lineHydraulics.js` lines 333 to 350, headed "THE BRACKET IS THE
WHOLE OF THIS FUNCTION'S HISTORY", which names the pre-repair symptom verbatim.
That comment is CORRECT AS A COMMENT and needs no engine change: the defect is
that nothing stops a writer reading it, which is why "engine source comments
are provenance, not teaching truth" is now a briefing rule in the kit. For
consistency: writers
are told repair history is forbidden to lessons and that the digest is the one
file which is teaching truth, so a single history sentence in the digest
invites exactly the confusion FC3 hit this morning, where a writer had to
refuse a digest line. FC3's equivalent was struck the same day.

**Keep what the control DOES and why it CAN fail. Drop what the code USED TO
do.** Something of this shape:

> "Both answers come out of the same bisection. A search whose answer lies
> outside its bracket and a search that cannot converge look identical from a
> single case, and only a case with its answer inside the bracket tells the
> two apart."

Section 10 is at or after Section 7, so this edit is legal under the original
constraint and is held only because it would be rebuilt alongside Item 1.
`digestheadings.mjs` carries a `repair-history` rule; it does not fire on this
line because the history is in PROSE rather than in the heading, and the prose
sweep is what has to catch it.

## ITEM 2b. Digest line 386. AN "X, NOT Y" CONTRASTIVE. STRIKE IT.

Found by `digestprose.mjs`, missed by the copy-rule sweep that fixed five other
lines in this wave, and confirmed independently by the Professional audit.

> "Class 4 asks for 1.800000 times the pressure wall of Class 1 on the same
> pipe at the same pressure (derived from the two rows above). **The route, not
> the fluid, is what moved it.**"

The owner rule bans "X, not Y" contrastives. Section 13 is at or after Section
7, so this is legal under the original constraint and is held only because it
rebuilds alongside the rest. Something of this shape:

> "What moved it is the route rather than the fluid."

## ITEM 2c. Nine BACKWARD REACHES into Section 1 constants, from Professional lessons

Reported by the Professional audit. Professional lessons quote figures that
resolve only inside Section 1: `5280.000000000` with its `9.095e-13` step,
`96619638.0494`, and the base and atmospheric pair.

**The fix is ADDITIVE and has already been done once in this wave**, for the
three Expert constants: derive each inside the Professional sections rather
than moving anything out of Section 1, so no line already pinned by another
reader moves. Section 9 or 10 is the natural home for the mile and Section 7
for the base and atmospheric pair. `litsweep.py --strict-range` reports them.

## ITEM 3. Eleven over-length Professional lessons. NOT A SEPARATE JOB.

On the `lengths.py` counter, 11 of the 26 Professional lessons exceeded the
420 to 560 prose-word band BEFORE any of this work, and this pass made no net
addition: the set is unchanged except `m02/l03-general-flow-and-its-iteration`
(591 to 570, improved, because the correction it received was paid for by
cutting padded tails) and `m06/l02-working-the-capstone` (564 to 563).

The coordinator folded the trim into the Professional audit, which reads all
26 lessons in full, so the cuts are made by someone who knows which sentences
are load-bearing. **Do not trim these in isolation.**

## ITEM 4. NOT OURS: nine forward tier-range leaks in FC1 separation

`litsweep.py` found nine literals in FC1's MERGED Associate banks that resolve
only on an Expert page, which is a leak in a live course: `0.850000` in
`fc1b_m01` Q4 three times and Q11 once and in `fc1b_m02` Q9 three times,
`0.200000` in `fc1b_exam` Q30, and `30000.000000` in `fc1b_m04` Q4. FC1 has
its own agent. Reported, not touched.

## ITEM 5. NOT OURS: one duplicate left in the Associate tier

`dupaxes.py` module-versus-module, 0.48 on an explanation: `fc2b_m04` Q7
against `fc2b_m06` Q9. It is the only duplicate left in the wave, over 103752
field comparisons. The `beginner` tier belongs to the Associate auditor.
Reported, not touched.
