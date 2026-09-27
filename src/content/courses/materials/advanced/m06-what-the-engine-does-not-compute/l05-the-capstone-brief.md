# The capstone brief

{{panel:materials-spares-calculator}}

The Expert capstone asks the tier's one question: spares, lead-time risk and the limits. It gives you a synthetic register of its own, with its own items, failure rates, lead times, costs and demands, and asks for six values the engine returns. It is worked in the course's own spares calculator, which calls the same vendored engine every lesson has quoted; the Materials & Spares Planner in the Suite runs the same engine.

## What the capstone gives you

The capstone card carries one case file with three calls in it, each under a block key: an insurance spares call under `insuranceSpares`, a Poisson stock call under `poissonStock`, and a lead-time risk call under `leadTimeRisk`. Each call states every input its figures depend on. Paste the whole file into the box of the view you need and choose the call in the block selector.

## The six values

| value | what it tests | view and where to read it |
| --- | --- | --- |
| the total cost a year at the cheapest stock of spares | holding against downtime | Insurance spares, the total cost tile |
| the downtime cost a year at the cheapest stock | expected units down, priced | Insurance spares, that row of the table |
| the probability of no shortage at the cheapest stock | the Poisson anchor | Insurance spares, that row of the table |
| the fill rate at the cheapest stock | the chance a failure finds a spare | Insurance spares, that row of the table |
| the expected units short a cycle of the Poisson stock | the loss at the chosen level | A slow-moving spare on Poisson demand, its tile |
| the achieved fill rate of the Poisson stock | the fill rate against its target | A slow-moving spare on Poisson demand, its tile |

All six are reported to six decimals, as the panel prints them. None is a Monte Carlo draw, and none depends on a reading the engine states. The lead-time risk block is there to work with its seed and draws; none of its figures is graded.

## Things to check before you copy a figure

Check the block selector shows the call you mean. Read the "Stopped at the search limit" tile: the card's limit is stated, and the flag tells you whether the cheapest stock sits on it. Read the row of the table for the cheapest stock, which is not always the last row. For the Poisson stock, check the service measure is the fill rate and the order quantity is stated.

## How your answers are checked

Every graded value is a return value of the engine on the card's inputs, so there is exactly one right answer. Each is compared with the engine's own return within a tolerance set once for the whole course. Enter each figure as the panel prints it, with no rounding of your own. If a view refuses the case file, an input has been changed: read the field the refusal names, restore the card's input and run it again.

## Rehearse on the Ekene register

| step | Ekene figure |
| --- | --- |
| the total cost a year at the ESP motor's cheapest stock | 160003.732064 |
| the downtime cost a year at that stock | 12003.732064 |
| the probability of no shortage at that stock | 0.998413 |
| the fill rate at that stock | 0.990054 |
| the PSV kits at a fill rate of 0.95 with an order quantity of 6: expected units short a cycle | 0.218018 |
| the same call: the achieved fill rate | 0.963664 |

The rehearsal register is no capstone: its figures are printed in the lessons, and the card's are not.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Find the first four Ekene figures above and name the tile or row each came from. Switch to the view "A slow-moving spare on Poisson demand", start from "The PSV kits on the Ekene register", set "Service measure (stated)" to the fill rate and "Order quantity (stated; needed for a fill rate)" to 6, and find the last two. For each figure, name the lesson of this tier that taught it.
