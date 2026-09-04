# Adding them up

The stack is a sum. One pipe published in three builds gives three totals, and the arithmetic between them is addition.

{{panel:pd-thermal-explorer}}

## Three builds of one pipe

One bore of 6.065 in, one steel outside diameter of 6.625 in, one pair of films. Bare is the steel wall alone, insulated adds 2.0 in of syntactic polypropylene foam out to 8.625 in, and buried puts that coated pipe in a 4.0 ft trench in wet soil at k 1.2.

| Build | Terms | Total resistance, hr ft degF/Btu per foot | U, Btu/(hr ft2 degF) |
| --- | --- | --- | --- |
| Bare | 3 | 0.0059426060 | 105.9799311355 |
| Insulated | 4 | 0.4718007538 | 1.3348791131 |
| Buried 4.0 ft | 5 | 0.8830579621 | 0.7132000377 |

The foam adds its 0.4665266247 to the bare total and the trench adds a ground term of 0.4112572083 to the insulated total. Nothing already in the stack is recomputed.

## The terms that never move, and the one that does

The inside film stays at 0.0025191879 across all three builds and the steel wall stays at 0.000540611570. The outside film is the exception: 0.0028828065 bare, then 0.0022143296 once the foam is on, because the outside face is now the 8.625 in coated diameter rather than the 6.625 in steel and a film resistance carries an area.

Each entry carries its own `sharePct`, and on every build those shares sum to 100.00000000 percent.

## Equal additions, unequal effect

The foam and the trench are close in size, 0.4665266247 against 0.4112572083, and they do very different things. The foam divides U by 79.39290539, because it was added to a total of 0.0059426060. The trench divides it by a further 1.87167561, because by then the total was already 0.4718007538. Bare to buried is 148.59776436 in all.

That is the behaviour of every series stack: the first large resistance is worth an order of magnitude and the second one of the same size is worth less than a factor of two.

## The mistake

Reasoning with U values instead of resistances. U values do not add and do not average. The resistances add, and U is what you get after inverting the sum. Price a trench by taking a difference of U values and you conclude that burying the line was almost free, when the ground term it added is 46.57193819 percent of the finished stack.

## What the sum leaves out

The total is over the terms the call actually built, and nothing in the return names a term that was not entered. `overallU` refuses a pipe with no layers, `ok = false` and "A pipe needs at least one layer: its own wall.", but it cannot know that a coating you meant to enter is missing from the list you handed it.

## Exercise

Build the insulated pipe, record the total resistance, then add the 4.0 ft trench in wet soil and record it again.

Write down the difference between the totals, then say why it divided U by 1.87167561 when a similar number divided it by 79.39290539.
