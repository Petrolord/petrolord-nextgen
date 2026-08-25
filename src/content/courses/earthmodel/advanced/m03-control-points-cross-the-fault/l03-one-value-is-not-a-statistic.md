# One value is not a statistic

Block 1's control set is W1 alone, and so block 1's zone A porosity "is" 0.315. This lesson is about the quotation marks: what a single-well block can and cannot support, and how an engine and a report should each behave about it.

## The arithmetic of one

Every averaging method collapses at n equals 1. The weighted mean of one value is the value: block 1's porosity is 0.315 exactly, and the graded phi_block1 field... does not exist; the capstone grades only block 0's mean, precisely because block 1's is a lookup, not a computation. A plane cannot fit through one point; the trend method is undefined. Kriging technically runs, as module five will show, and produces the constant 0.315 everywhere in the block. Whatever the method dial says, block 1's map is the number 0.315 painted over 174 nodes.

## What is actually known about block 1

One well's zone A porosity, at one location, plus whatever regional knowledge migrates in from OUTSIDE the statistics: the field-wide west-to-east decline of porosity that all four wells trace, the fact that W1 sits at that trend's high end, the tie table's verdict that block 1's geometry is uncontested. None of that enters the engine, which is honest about knowing only the one point.

The distinction to hold: the VALUE 0.315 has real support, a logged well; the UNIFORMITY of 0.315 across 174 nodes has no support at all. It is the default of a method with nothing to vary on. If the regional trend continued across the fault, block 1's southern nodes would run higher than its northern; the model paints them identical because assuming the trend crosses the fault is exactly the assumption a sealing-fault model refuses. Between "refuse the trend" and "have no spatial information", the block map ends up flat, and flatness is an ABSENCE, not a finding.

## The provenance discipline

This is why the population engine records provenance per block: which method actually ran, how many wells fed it, whether a fallback fired. Block 1's provenance under the trend method reads: method constant, wells 1, fell back true. In a report, that line IS the porosity map's pedigree, and the number 174 nodes times one well is the sample-support statement a reviewer needs. The panel's provenance tile with its fallback star exists to make this impossible to miss. An engine that silently fell back would let a one-well constant masquerade as a fitted model; the star is the difference between a model and an apology.

## What would change the situation

Three things, in rising order of value: W2's zone B point, at x 1674.5, is ALSO block 0, so no help; a re-survey of W2 shifting its zone A midpoint 51 m shallower in MD would move its point into block 1, instantly making block 1 a two-point block with a fittable trend along the line between them, an improvement in machinery and a discontinuous jump in every number; and an actual new well in block 1's north, where no data exists within 500 m, would convert the uniformity assumption into a tested claim. Ranking data acquisition by which statistics it UNLOCKS, not just which values it refines, is a habit this fixture rewards.

## Worked example

Write block 1's porosity for a volumetric report, Expert style, in one sentence: "Zone A porosity in block 1 is 0.315, carried as a constant from the block's single well (W1); the value is well-supported at the well and unsupported in its uniformity, with no control in the block's northern arm." Twenty-nine words, three claims, each labelled with its support. Compare the alternative that a hurried report would print, "phi 0.315", and note that both round-trip to the same number while only one survives review.

## Exercise

The engine COULD be extended to borrow strength across the fault: for instance, kriging block 1 with all four wells but an added "fault discontinuity" term. In two sentences, state one benefit and one danger of such borrowing, and name the assumption the current per-block design refuses to make.
