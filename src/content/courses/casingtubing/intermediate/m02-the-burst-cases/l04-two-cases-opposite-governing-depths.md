# Two cases, opposite governing depths

One string, one section, and the worst point is at either end depending on the case.

{{panel:ct-loadcase-explorer}}

## The result

On section 1 of the published string:

| case | governing depth (m TVD) | safety factor |
|---|---|---|
| gas kick | 0 | 1.6904923854809817 |
| pressure test | 1454.59342559458 | 1.5933625591003786 |

The two governing depths are the two ends of the section. There is no depth in between that governs anything.

## Why it has to be one end or the other

Because both differentials are LINEAR in depth. A linear function on an interval takes its extremes at the endpoints, always.

Every one of the seven cases in this course produces a linear or piecewise linear differential, because every column in every case is a constant-density hydrostatic. So every governing depth in this course is an endpoint of a section, and the only question is which one.

## The rule, in one line

    inside gradient greater than outside gradient  ->  governs at the bottom
    inside gradient less than outside gradient     ->  governs at the top

## Applied to all seven

| case | inside gradient | outside gradient | burst governs |
|---|---|---|---|
| gas kick | 2300 | 10100.8495 | top |
| pressure test | 14121.576 | 10100.8495 | bottom |
| full evacuation | 0 | 14121.576 | no burst |
| partial evacuation | 0 or 11277.6475 | 14121.576 | no burst |
| cementing | 10100.8495 | 18632.635 | no burst |
| running | 14121.576 | 14121.576 | no differential |
| custom gradient | 4903.325 | 15690.64 | top |

The collapse column is the mirror image of the same table, because collapse is the same subtraction with the other sign.

## Where the linearity breaks

Partial evacuation. There is a kink at the fluid level, because the inside gradient is zero above it and 11277.6475 below it.

That case is piecewise linear with two pieces, so its extremes are at three candidate points rather than two, and one of them is inside the interval.

## The thing to carry

A single-depth check on a string is not a check. Which end you would have checked depends on a comparison of two gradients that most people never write down, and getting it wrong does not produce an error, it produces a comfortable number.

## Exercise

For the custom gradient case, inside 500 kg/m3 with a 5000000 Pa surface pressure and outside 1600 kg/m3, find the depth at which the burst differential reaches zero.

Then say what happens to the check below that depth.
