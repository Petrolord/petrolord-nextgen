# A rate is a fraction

The discount rate enters the capital recovery factor as r, and the engine reads it as a fraction. Ten percent is typed 0.1. Every AGBOR figure in this lesson is invented for this course, and the money is in US dollars.

{{panel:carbon-abatement-explorer}}

## A percentage typed is refused

A rate typed as 10, meaning ten percent, is refused with the rule and an example:

REFUSED: The discount rate is a fraction greater than -1 and below 1 (0.1 for ten percent).

The course's rule in force states the range: a rate outside (-1, 1) is refused. A rate of 10 lies outside that range, and the example inside the refusal shows the form the engine expects: 0.1 for ten percent. A rate is typed as the fraction the percentage stands for.

## A blank rate is refused

A blank rate on a measure with capital is also refused, and the refusal says what reading it as 0 would do:

REFUSED: Measure "Heat integration project" has a capital cost, so it needs a discount rate. A blank is not read as 0, which would annualise straight-line and move the measure down the curve.

## A rate of 0 typed

A rate of 0 typed is accepted. The course says what it means: the capital recovery factor at a rate of 0 is 1/n, straight line. The lab prints all six measures at a rate of 0 beside their costs at 0.1:

| measure | cost per tonne at 0.1 USD | cost per tonne at rate 0 USD |
| --- | --- | --- |
| Tune the fired heaters | -167.4364 | -168.9474 |
| Repair failed steam traps | -156.4390 | -159.1304 |
| Heat integration project | -14.2492 | -66.6667 |
| Flare gas recovery | 78.1002 | 26.8817 |
| Solar for purchased power | 45.8573 | -13.5714 |
| Vapour recovery on the storage tanks | 35.4193 | 14.5045 |

Read the Solar for purchased power row. At 0.1 its cost is 45.8573 USD a tonne, positive, and the measure does not pay for itself. At a rate of 0 it prints -13.5714 USD a tonne, negative. The same measure, with the same capital, savings, running cost, tonnes and life, changes sign with the rate alone.

That is the movement the blank-rate refusal names. On the curve of the next module the measures are ranked cheapest first, and at 0.1 Solar for purchased power ranks fifth of six. A blank read as 0 would hand the curve the figure from the second column.

## Which rate is right

The rate is an input, and this course grades no choice of rate. The lab shows every Agbor cost at 0.1 and prints beside it the straight-line column, the engine's cost per tonne at a rate of 0. What the engine requires is that the rate be stated, and stated as a fraction. A measure with a capital of 0 typed needs no life and no rate (the previous lesson).

## Exercise

Read the cost per tonne of Solar for purchased power and of the Heat integration project at a rate of 0.1 and at a rate of 0. Say what the two pairs, read together, show about the rate as an input to the cost per tonne, and what the blank-rate refusal prevents.
