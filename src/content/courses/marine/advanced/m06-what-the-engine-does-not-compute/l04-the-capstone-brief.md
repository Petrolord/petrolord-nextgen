# The capstone brief

{{panel:marine-base-calculator}}

The Expert capstone asks this tier's one question: the shore base as a queue. It gives you a synthetic supply base of its own, with its own berths, arrivals, working day and service terms, and asks for six values the engine returns. You work it in the course's own shore base calculator, which calls the same vendored engine every lesson of this tier has quoted. The calculator is all the capstone needs.

## What the capstone gives you

The capstone card carries one case file with three calls in it, each under a block key: the base as M/M/c with a target mean wait under `shoreBase:mmc`, the same base as M/D/c under `shoreBase:mdc`, and a Monte Carlo of its fleet under `fleetVariability`. Each call states every input its figures depend on: the berths, the arrivals a day, the working day, the fixed hours, the lifts and their rate, the bulk and its rate, the concurrent choice, the model and, for M/M/c, the target. Paste the whole file into the box of the shore base calculator and choose the block in the block selector.

## The six values

| value | what it tests | where to read it |
| --- | --- | --- |
| the M/M/c mean wait, in hours | Erlang C and eq. 5.3 | the M/M/c block, the Mean wait, hours tile |
| the M/M/c probability of waiting | the delay probability | the M/M/c block, the Probability of waiting tile |
| the M/M/c mean time at the base, in hours | the wait plus the service | the M/M/c block, the Mean time at the base, hours tile |
| the M/D/c mean wait, in hours | the Cosmetatos approximation | the M/D/c block, the Mean wait, hours tile |
| the M/D/c mean queue | Little's law on the M/D/c wait | the M/D/c block, the Mean queue tile |
| the M/M/c mean wait at the fewest berths that meet the target | the berth target | the M/M/c block, the Mean wait at those berths, hours tile |

All six are reported to six decimals, as the panel prints them. None is a Monte Carlo draw, and none depends on a reading the engine states: each is the same number under every reading and under the alternative named beside it. The fleetVariability block runs in the variability calculator on its stated seed and draws. Report what it returns in your plan with its seed and draws; none of its figures is graded.

## Things to check before you copy a figure

Check that the block selector shows the call you mean, and that the Queue model and Lifts and bulk at the same time controls read what the card states. Read the wait in hours, beside the wait in working days. Read the target figures from the target tiles, which sit apart from the wait at the stated berths.

## How your answers are checked

Every graded value is a return value of the engine on the card's inputs, so there is exactly one right answer. Each is compared with the engine's own return within a tolerance set once for the whole course. Enter each figure as the panel prints it. If the calculator refuses the case file, an input has been changed: read the field the refusal names, restore the card's input and run it again.

## Rehearse on the Ekene base

| step | Ekene figure |
| --- | --- |
| the M/M/c mean wait | 3.180124 |
| the M/M/c probability of waiting | 0.371014 |
| the M/M/c mean time at the base | 11.180124 |
| the M/D/c mean wait | 1.665786 |
| the M/M/c mean wait at the fewest berths for a one-hour target | 0.440347 |

The rehearsal base is no capstone: its figures are printed in the lessons, and the card's are not.

## Exercise

Open the shore base calculator on the view "The berth queue". Start from "Ekene supply base, M/M/c" and find the first three Ekene figures above; start from "Ekene supply base, M/D/c" for the fourth, and read the Mean queue tile there, checking it by Little's law against the Arrivals an hour tile. Start from "Ekene base, a one-hour target, M/M/c" for the last. For each figure, name the tile it came from and the lesson of this tier that taught it.
