# Conventions that are choices

{{panel:materials-spares-calculator}}

Every model makes choices where its sources leave room. The engine states each of its choices in its basis, its reasons or its readings, and the course teaches each one as a choice, with the alternative beside it. This lesson gathers the conventions that shape whole calculations, as distinct from the edge readings of the previous module.

## The seven conventions

| convention | the engine's choice | the alternative |
| --- | --- | --- |
| ties | two figures that agree to 12 significant digits tie | exact comparison |
| rounding | a stated rule; the nearest takes halves upward | halves downward, or to even |
| holding cost | stated directly, or as a rate on the unit cost (exactly one), charged on the units held | a holding charge that also carries interest on the set-up cost, as Harris 1913 writes it |
| the lead-time spread | enters on the lead time only; the review period is fixed | a spread on the review period too |
| lead-time risk | one demand rate held for the whole lead time | a fresh demand draw every day |
| insurance spares | the one-for-one pipeline, one unit down a waiting failure, holding on every spare bought | a repair loop, partial loss, or holding on spares in stock only |
| the print rule | money to the cent and computed figures to six decimals inside a message; stated inputs as given | fixed decimals everywhere |

## Reading the Expert rows

Three rows touch this tier directly. The insurance model is one for one: every failure is replaced by a new order, one unit is down for each failure waiting, and the holding charge falls on every spare bought. A plant that repairs units, loses part of its production when one unit is down, or charges holding only on spares sitting on the shelf needs a different model, and the course names each one and computes none.

Lead-time risk holds one demand rate for a whole lead time. A busy spell stays busy until the order lands, which widens the spread of the lead-time demand; a fresh draw every day would let quiet days offset busy ones.

The print rule decides what a learner reads. Inside a reason the ESP motor's total prints as 160003.73, money to the cent; the field is 160003.732064. The course reasons with the field and quotes the reason only verbatim.

## Reading the rows from the lower tiers

The holding-cost row reaches back to the Associate tier. Harris wrote his carrying charge to include interest on the set-up cost as well; the engine charges holding on the units held, stated directly or as a rate on the unit cost, exactly one of the two. The lead-time spread row reaches back to the Professional tier: the spread enters on the lead time, and the review period is taken as fixed.

## Why state a choice

A stated choice can be checked and changed. A planner who prefers holding on spares in stock only can see the engine's reading line, name the difference, and adjust the cost by hand with the difference written down. An unstated choice cannot be argued with. The engine's validation record, FINDINGS-inventory.md, lists every choice with its alternative.

## No graded figure moves

Each capstone field is the same number under every reading the engine states and under the alternative it names. The conventions shape what a calculation means; the capstones are built so that no answer turns on one.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Find the reading line and name the convention it states. Find the reason and compare its total with the "Total cost a year at the cheapest stock" tile: name the print rule at work. Then switch to the view "Lead-time risk by Monte Carlo (ungraded)", start from "The mechanical seal on the Ekene register", and find the words in the sampling line that state the lead-time risk convention. For each of the three, write one sentence naming the alternative.
