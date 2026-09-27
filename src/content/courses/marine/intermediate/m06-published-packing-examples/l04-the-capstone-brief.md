# The capstone brief

{{panel:marine-voyage-calculator}}

{{panel:marine-deck-calculator}}

The Professional capstone asks this tier's question: fleet sizing and deck planning. It gives you a synthetic cluster of its own, with its own vessel, products, installations, route, demand, deck and cargo, none of which appears in these lessons, and asks for six values the engine returns. This lesson says what it asks and where each value sits in the two calculators.

## What the capstone gives you

The capstone card carries one case file with two blocks, each named for the view it belongs to: `fleetSize` and `deckPlan`. The card states in words every input a value depends on: the vessel with every capacity, tank and fuel burn; the products and their densities; the installations with their field hours, demand and minimum visits; the route and its legs; the port hours; the weather factor and the activities it slows; the fuel price; the period, the available days and both rounding rules; the deck, the item lines, the voyages stated and the packing rule.

## The six values

| value | module | where to find it |
| --- | --- | --- |
| the voyages of demand before rounding | demand over a period | the voyage and fleet calculator, the voyage set table, "voyages before rounding" |
| the vessel-days | voyages and vessel-days | the voyage and fleet calculator, the tile "Vessel-days" |
| the vessels before rounding | vessels required | the voyage and fleet calculator, the tile "Vessels before rounding" |
| the spare vessel-days | vessels required | the voyage and fleet calculator, the tile "Spare vessel-days" |
| the first voyage's area on the deck | first-fit decreasing | the deck calculator, the voyage table, "area, m2" for voyage 1 |
| the second voyage's load utilisation | first-fit decreasing | the deck calculator, the voyage table, "load utilisation" for voyage 2 |

All six are reported to six decimals, as the panels print them. Each is a return value of the engine on the card's inputs, so there is exactly one right answer, and each is the same number under every reading the engine states. None is a Monte Carlo draw. The grading tolerance is set in one place in the platform, and you never type one.

## How to load the case

Paste the whole case file into the box of the view the value belongs to: "Fleet sizing for a period" in the voyage and fleet calculator, or "The deck plan" in the deck calculator. The view offers the blocks it can read in the selector "Block of the case file"; choose the block, and every control above the box shows that block's inputs. The same case pasted into the Marine Logistics Planner gives the same figures, and the two calculators carry the whole practical for a learner without a Suite seat.

## Things to check before you copy a figure

Check each control against the card: both rounding rules; the days a vessel is available beside the period; the weather factor and the activities it slows; the usable deck fraction on each block; the voyages stated and the packing rule. Read the reasons: a shortfall or a voyage longer than the days available is printed beside the figures. If a view refuses the case, a control has been changed or mistyped: read the field the refusal names and restore the card's figure.

Shore base queues and the fleet under variability are the Expert tier's question, and this capstone asks neither.

## Exercise

Rehearse in the two calculators on figures this tier prints.

1. In "Fleet sizing for a period", start from "Ekene week, PSV milk run" and read 3.100000, 10.345455, 1.591608 and 2.654545 in the places the table names.
2. In "The deck plan", start from "Ekene deck cargo on a light deck" and read the first voyage's area, 404.505200, and the second voyage's load utilisation, 0.718667.
3. Switch the deck's packing rule to first fit in the booked order and note which of the two deck figures you would now be reading from a different plan.
