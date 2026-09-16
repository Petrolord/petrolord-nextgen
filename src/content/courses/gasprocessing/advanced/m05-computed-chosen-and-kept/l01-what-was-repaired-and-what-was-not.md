# What was repaired, and what was not

Everything in this lesson is history. It describes what this engine did before it was repaired, and each item is a general lesson that happens to have an example here. Nothing in this lesson describes the engine you are using, and nothing else in this course is history.

{{panel:fc-water-explorer}}

## The frame, stated once

This module was repaired after a recon found 49 findings in it, its published cases and the studio that composes it. Four are worth teaching. Read every paragraph below as an account of a former state.

## An error whose shape hid it

The Joule-Thomson relation carries no compressibility in its denominator, and this module divided by one. The discrepancy was exactly a factor of one over the compressibility: nothing in the ideal-gas limit, growing with pressure.

That is the shape that hides an error. It is smallest exactly where a sanity check is easiest, and largest where a reader has least intuition. The repaired engine's own compressibilities show the shape, with the last column one over each of them.

| psia | z the engine reports | 1 over z, which is what the error was |
| --- | --- | --- |
| 20.000000 | 0.997251744 | 1.002755830 |
| 600.000000 | 0.919606033 | 1.087422183 |
| 1000.000000 | 0.871027147 | 1.148069844 |
| 2500.000000 | 0.789943160 | 1.265913867 |

The lesson is the shape rather than the factor. Ask of any candidate error where it would be smallest, and check somewhere else.

## A check loose enough to admit both candidates

The routine had no published case at all. Its only check was that the answer fell in a band of 5 to 9 degF per 100 psi. Both the wrong answer and the right one sit inside it, so the check could not fail.

A gate that restates the formula it is checking, or bounds an answer loosely enough to admit both candidates, is not a check. Ask of any check whether it could discriminate, before asking whether it passed.

## An input validated and then read by nothing

The lean glycol strength was range checked and refused outside 90 to 100 weight percent, and then read by nothing. A validated input that moves no output is worse than an absent one, because the validation asserts that it matters. It now drives the loop water balance, and the Associate tier teaches what it does and what it leaves alone.

## One fluid with two densities

Two numbers for one glycol, and a standard cubic foot defined at one pressure and converted at another. Neither gap was large. Both are defects whatever their size, because nothing downstream can tell which of the two it is holding.

## Where the rest of it lives

The engine's own source comments record what changed. There are 9 such comment lines in this module, counted by reading gasProcessing.js for a comment line carrying "used to", "no longer" or the repair's own name. Widen the rule to the nine keywords the digest also sweeps with and the same module reads 18, which is why the rule is stated beside the count.

The digest quotes no count across the whole vendored tree, and says why. It carried one once. The figure then moved because two other courses vendored three more engines of their own, so a number printed in this course answered to work in another module. A number whose tree can change under it is not a fact about this engine and should not be quoted.

Those comments are provenance. A sentence lifted out of one and into a lesson arrives with no frame around it, and a writer cannot frame what they did not know was history.

## Exercise

Name the four items above and write the general lesson each carries, without reference to this engine. Record the four compressibilities and the four reciprocals. Then say what you would have to establish about a sentence found in an engine source comment before putting it in front of a learner.
