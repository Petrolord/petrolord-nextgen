# The daily contract quantity and the contract year

{{panel:gsa-quantity-calculator}}

The daily contract quantity, the DCQ, is the heart of a gas sales agreement. It is the quantity of energy the seller plans to make available on an ordinary day, and the quantity the buyer plans to take. Every other quantity in the contract is built from it. This lesson builds the first of them, the annual contract quantity.

## From DCQ to ACQ

The annual contract quantity, the ACQ, is the DCQ added up over the days of the contract year. The Commonwealth model agreement defines it that way:

> "the quantity of Gas equal to the sum of the Daily Contract Quantities determined using the" (Commonwealth model GSA (2025), definition of ACQ)

The engine's rule is the same product: ACQ = DCQ x days in the contract year. For the Ekene power plant, a DCQ of 21000 MMBtu over the 365 days of 2027 gives an ACQ of 7665000.000000 MMBtu.

| case | DCQ | days | ACQ (engine) |
| --- | --- | --- | --- |
| power plant 2027 | 21000.000000 | 365 | 7665000.000000 |
| export feed, a full year | 63000.000000 | 365 | 22995000.000000 |
| a stated count | 50000.000000 | 350 | 17500000.000000 |

## What the ACQ is for

The ACQ is the yardstick of the year. The take-or-pay quantity is a stated percentage of it, after the year's reductions. The buyer's annual obligation, the seller's annual commitment and the deficiency at the year's end are all measured against it. If the ACQ is wrong, every reconciliation that follows is wrong by the same proportion.

## The contract year

A contract year is a stated period, and it need not be a calendar year. A contract may start its year on a day that suits the plant or the pipeline, and a first contract year may be short because deliveries begin partway through the calendar. The engine therefore asks you to state the day count, in one of three ways the next lesson covers: a number of days, a calendar year, or a period with a start and an end.

## The take-or-pay quantity on the full ACQ

The quantity calculator also prints a take-or-pay quantity when you state a take-or-pay percentage. At this stage the engine applies the percentage to the full ACQ, before any reduction. For the power plant in 2027, 80 percent of 7665000.000000 gives 6132000.000000. The panel labels this tile "Take-or-pay quantity on the full ACQ" for a reason: the quantity the buyer actually owes is a percentage of the Adjusted ACQ, which the take-or-pay module builds.

## The DCQ must be positive

A contract with no daily quantity has nothing to reconcile, and the engine refuses one:

> dcq must be a finite number above 0; got 0

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Contract quantities and swing". The box holds the power plant's terms for 2028. Change `year` to 2027 and run it; read the day count, the ACQ and the take-or-pay quantity on the full ACQ. Then set `dcq` to 63000 with `maxDcqPct` 105 and `topPct` 90, and run it again. Finally set `dcq` to 0 and read the refusal.
