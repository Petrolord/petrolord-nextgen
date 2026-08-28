# Re-entries and merging

A trajectory can enter the same cell more than once. The intersector merges those visits into one connection, and knowing that it does is the difference between reading a connection list correctly and double-counting a well.

## When it happens

Three common cases.

**An undulating horizontal well.** A lateral drilled to follow a target zone rises and falls, and a cell it leaves at one point it can re-enter fifty metres later.

**A well that turns back.** A side-track that curves round can cross its own column again in the same layer.

**A path that grazes a boundary.** Numerically, a step near a cell face can land alternately either side of it, producing a rapid alternation between two cells.

## What the intersector does

It keys connections by cell, so every visit to (i, j, k) accumulates into the same entry. The length is the TOTAL length of wellbore in that cell across all visits, and the direction is decided from the accumulated components.

The order in the list is the order the cell was FIRST entered.

## Why merging is right

Because a connection is a coupling between a well and a cell, and there is only one of each. A cell has one pressure and one saturation, and the well has one pressure at that point in the string. Two connections to the same cell would be two couplings to the same pair, which double-counts the flow path.

Simulators do accept duplicate COMPDAT records for the same cell, and the result is exactly that double coupling. It is a known way to accidentally double a well's productivity.

## What merging costs

The list no longer tells you the path shape. Eleven connections in the Ekene side-track look like eleven distinct passes, and if the path had re-entered a cell you could not tell from the list.

For the well model that does not matter, because the coupling is correct either way. It matters for anyone trying to reconstruct the trajectory from the deck, which is a thing people do when the survey has been lost.

The lesson: the connection list is not a trajectory and cannot be inverted back into one.

## The grazing case

Worth separating from the other two, because it is a numerical artifact rather than a real feature of the well.

A path running almost exactly along a cell face produces a sequence of very short alternating connections, all with small lengths. Merging collapses them into two connections with sensible totals, which is the right answer.

Without merging you would get a long list of tiny connections, each with a well index near zero, and a well that appeared to be connected to twenty cells while barely producing.

## What to check

Two things on any deviated well's connection list.

**Total length.** Sum the connection lengths and compare against the length of the trajectory inside the grid. They should agree closely, and a large shortfall means part of the path fell outside the model.

**Duplicate cells.** There should be none, because merging removes them. If you find one, the list was assembled by hand or by a tool that does not merge, and the well is double-coupled to that cell.

## The misconception to avoid

"More connections means better contact." A well with many short connections may be grazing boundaries rather than contacting rock. What matters is the total length and the permeability it is in, not the number of entries in the list. The Ekene side-track's eleven connections total about 1640 ft of wellbore, and that total is the number to compare against another completion design.

## Exercise

First, sum the eleven connection lengths from the previous lesson and state the total. Compare it against the straight-line distance from heel to toe and explain any difference.

Second, describe the two checks in this lesson and say what each would catch that the other would not.
