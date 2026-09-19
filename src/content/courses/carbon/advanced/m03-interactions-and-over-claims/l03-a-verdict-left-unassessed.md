# A verdict left unassessed

A target verdict can come back as true, as false, or as none. This lesson is about the third answer: what it means, how the engine says why, and the rules SECTION 21 prints for it. The AGBOR figures are invented for this course, and money is in US dollars.

{{panel:carbon-abatement-explorer}}

## None is an answer

On the curve where Flare gas recovery claims 9400 t a year, SECTION 21 prints:

| output | value |
| --- | --- |
| total abatement t | 18660.000 |
| target t | 16830.083 |
| meetsTarget | none |
| targetBasis | not assessed: claims exceed what a source emits |
| residual to target t | 0.000 |
| over-claims | flare: claimed 9400.000 against 7562.133 emitted |

meetsTarget none is the engine declining to say whether the target is met. targetBasis gives the reason in words, "not assessed: claims exceed what a source emits", and the over-claims entry names the source. A verdict of none is read with its basis.

## The rule in force

SECTION 25 lists the over-claim case among the rules in force: a curve with a claim above what its source emits returns meetsTarget none and says why. The "says why" is the targetBasis text, and the two are read together. The MD45-1 table adds the second case: a curve verdict is none while any claim acts on a source with no computed emission passed, and the basis names the sources.

## The residual beside it

The same row prints a residual to target of 0.000 t. SECTION 26 lists the curve's residual to target among the outputs no oracle recomputes, taught from the engine and never graded. On an unassessed row, the residual rests on a total that includes tonnes the source does not emit. Read it with the verdict beside it.

## The rules SECTION 21 prints

A verdict on a target is a statement that the tonnes on the curve are enough. It can only be made on tonnes that were checked against what their sources emit. SECTION 21 prints the rule for this case: "Where a claim exceeds what its source emits, the curve adds up tonnes that do not exist, and the verdict is none." The 9400 t row is that case: the claim was checked, it exceeds the flare's emission, and the verdict is none.

The next lesson is the other case: a claim against a source whose emission is not passed to the curve, so there is nothing to check it against. SECTION 21 says of it: "Where a claim acts on a source whose emission is not passed, it cannot be checked, the verdict is none and the basis names the source."

## Where the upper bound label fits

An unassessed verdict and an upper bound are different labels. SECTION 21: "Where measures only interact and every claim is checked, the verdict stands and is labelled an upper bound." Interaction is two measures on one source, counted in full. An over-claim is a single claim beyond its source. The first leaves a verdict that stands with its label, when every claim is checked. The second leaves none.

## What a reader does with none

The over-claims entry says which source, what was claimed and what it emits. In practice a none sends the reader back to those inputs, and the corrected record is run again. A none is never read as met, and never read as unmet.

## Exercise

Read meetsTarget, targetBasis, the residual to target and the over-claims entry on the 9400 t curve, and SECTION 26's note on the residual. Say what the four outputs, read together, show about why this course reads no verdict and no residual from that row.
