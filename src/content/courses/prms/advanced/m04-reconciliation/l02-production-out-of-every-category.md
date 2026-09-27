# Production out of every category

{{panel:prms-aggregation-calculator}}

Production is the one movement every Reserves reconciliation carries while a field is on stream. It is also the one movement the engine treats differently from all the others: production is a single quantity, and it comes out of every Reserves category alike.

## One quantity, three categories

The barrels produced in a year are the same barrels whichever category they are counted in. They were inside the 1P, so they were inside the 2P and the 3P as well, because the categories are cumulative. When they are produced, each cumulative category loses the same quantity. On the Ekene field, one year of production of 1.100000 MMbbl comes out of each, verbatim:

> production (one quantity, subtracted from every category): 1P -1.1, 2P -1.1, 3P -1.1

That is a reading the engine states in its basis:

> opening + movements = closing, category by category; production comes out of every Reserves category alike (the movement headings are the engine's stated convention)

The engine offers no alternative to this reading. A production movement stated by category is refused, verbatim:

> movements[0].low must be left out for production (one quantity applies to every category); got 1

The calculator makes the shape visible: a movement whose type control reads production shows one quantity control, where every other type shows three.

## In incremental terms

The cumulative form hides a point the incremental form shows. If the 1P, 2P and 3P each lose 1.100000, the Proved (P1) loses 1.100000 and the Probable (P2) and Possible (P3) lose nothing. Produced barrels come out of the Proved slice. The engine returns the incremental form of every reconciliation beside the cumulative one, so the learner can read that directly.

## Production belongs to Reserves

Contingent Resources are not commercial, so nothing is produced from them as Contingent Resources. The engine refuses production in a Contingent reconciliation and says where such quantities go, verbatim:

> movements[0].type must be one of "revisions", "improved-recovery", "extensions-and-discoveries", "acquisitions", "divestments", "transfers" for Contingent Resources (produced quantities come out of Reserves; sub-economic production moves from Contingent Resources to production and is shown as a revision, PRMS 3.1.3.5); got "production"

In the course's words: a quantity produced before a project is commercial reaches production through a revision of the Contingent Resources. The Contingent reconciliation of the golden case "rec-contingent" closes at 7.600000, 12.400000 and 21.100000 with no production movement at all.

## The replacement ratio needs production

Production is also the denominator of the replacement ratio and the life index, which the last lesson of this module reads. On the Ekene field Reserves, production of 1.100000 over 1 year gives a 2P life index of 23.272727 years. A reconciliation with no production prints neither figure: the golden case "rec-no-production" returns none for both.

## Exercise

Open the aggregation calculator on the view "Reconciliation" and start from "The Ekene field Reserves, one year". Find the production movement, read its type control and its one quantity control, and read the Production tile. Add the key low with a value of 1 to that movement in the box and read the refusal. Then switch to the start "Contingent Resources", set the first movement's type control to production, and read that refusal. Finally open "No movement at all" and read the two tiles that need production.
