# The lifetime, inferred from four rows

{{panel:lp-proof-test}}

The published paper carries a second table in which the same five subsystems are recomputed with imperfect proof test coverage. Coverage below one means uncovered failures, and uncovered failures wait for the lifetime, so the lifetime is an input the coverage table cannot do without. The paper does not print it. That left a choice: abandon the coverage rows as unreproducible, or work out what lifetime the printed figures imply and say openly that it was worked out. The second course was taken, and this lesson shows the evidence it rests on.

## The four coverage rows against a sweep of lifetimes

Each row is the paper's printed value, then the engine's value at five stated lifetimes, everything else held at the paper's inputs.

| golden case | printed | T2 5 years | T2 8 years | T2 10 years | T2 12 years | T2 15 years |
| --- | --- | --- | --- | --- | --- | --- |
| dolan-valve-1oo2-ptc85 | 2.71E-03 | 1.75E-03 | 2.31E-03 | 2.71E-03 | 3.13E-03 | 3.78E-03 |
| dolan-pt-2oo3-ptc90 | 6.76E-04 | 4.89E-04 | 6.00E-04 | 6.76E-04 | 7.53E-04 | 8.70E-04 |
| dolan-cpu-1oo2-ptc98 | 6.12E-07 | 5.68E-07 | 5.94E-07 | 6.12E-07 | 6.29E-07 | 6.55E-07 |
| dolan-do-1oo2-ptc98 | 7.76E-07 | 7.16E-07 | 7.52E-07 | 7.76E-07 | 8.00E-07 | 8.36E-07 |

## Why four rows is a strong argument

One row matching at a lifetime of ten years would prove little, because a single figure can be hit by accident. Four rows match, and they are four different subsystems with three different coverages and failure rates more than two orders of magnitude apart. Look along any other column and at least one row misses the printed value at the third figure. The valve at eight years gives 2.31E-03 against a printed 2.71E-03; at twelve years it gives 3.13E-03. The transmitters behave the same way. Only the ten year column reproduces all four.

A ten year lifetime is also a round figure, which is worth saying plainly. This course makes no claim that it is the value the paper's authors used; the golden labels it INFERRED because it is the one lifetime that brings all four rows back at once. A verification note that relies on it should say so.

## Strong evidence and its honest label

That is strong evidence and it is not proof. Some other combination of lifetime and unstated input could in principle land on the same four figures, and the sweep only tested five lifetimes. So the golden records the lifetime as INFERRED, in its own source line, and the word travels with the value everywhere it is used. A reader who disagrees with the inference can see exactly what it rests on and recompute the rows at a different lifetime.

## This never reaches a graded answer

The inference is a fact about the published SOURCE. Every capstone in this course STATES its lifetime as an input, so no learner is ever graded on a number that depends on somebody's inference about a paper. The reason to teach it is the discipline it models. When a reproduction needs an input the source did not print, the note says which input, says what the alternatives produce, and labels the chosen value as inferred. That is also why the lifetime deserves attention in your own work: under imperfect coverage the lifetime sets the floor that no proof test interval can reach below.

## Exercise

Take the valve coverage row at a lifetime of eight years, 2.31E-03, and at twelve years, 3.13E-03, with the printed 2.71E-03 between them. Work out how far each is from the printed value as a percentage. Then decide whether a reader who believed the plant lifetime were eight years should treat the paper's coverage table as reproduced, and write one sentence giving your reason.
