# The take-or-pay quantity

{{panel:gsa-quantity-calculator}}

The take-or-pay quantity is the least the buyer must pay for in a contract year, whether it takes the gas or not. It is the core of the buyer's bargain: the seller commits its gas and facilities to the buyer, and in return the buyer commits to pay for a stated share of the gas on offer.

## A stated percentage of the Adjusted ACQ

The Commonwealth model agreement leaves the percentage blank for the parties to fill in:

> "quantity of Gas equal to [## INSERT] percent (##%) of the Adjusted Annual Contract Quantity for that Contract Year." (Commonwealth model GSA (2025), definition of Take or Pay Quantity)

The engine takes it as `topPct`, with no default, and computes TOPQ = topPct % of Adjusted ACQ. The Ekene power plant states 80 percent and the export feed 90 percent.

| case | Adjusted ACQ | take-or-pay percent | take-or-pay quantity (engine) |
| --- | --- | --- | --- |
| single year | 1000.000000 | 90 | 900.000000 |
| exactly met, 2027 | 1000.000000 | 80 | 800.000000 |
| force majeure and seller shortfall, 2027 | 800.000000 | 80 | 640.000000 |

## Two take-or-pay quantities in the panel

The quantity calculator shows a take-or-pay quantity in two views, and they answer different questions. In "Contract quantities and swing" it is the percentage of the full ACQ, before any reduction: for the power plant in 2027, 6132000.000000. In "One take-or-pay year" it is the percentage of the Adjusted ACQ, after the year's reductions. The second is the one the buyer owes. The first is a planning figure, useful before the year starts, when the reductions are not yet known.

## The percentage must be a percentage

The engine refuses a take-or-pay percentage above 100:

> topPct must be a number from 0 to 100; got 101

A percentage of 0 is accepted, and gives a take-or-pay quantity of zero.

## What the percentage expresses

A high take-or-pay percentage, such as the export feed's 90, gives the seller a steady revenue it can finance a development on. A lower one, such as the power plant's 80, gives the buyer more room to take less gas in a bad year without paying for it. The percentage is negotiated alongside swing, and effective swing combines the two into one measure of the seller's exposure.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "One take-or-pay year". Run the starting case and read the Adjusted ACQ and the take-or-pay quantity for 2027. Change `topPct` to 90 and run it; read the take-or-pay quantity again. Set `topPct` to 101 and read the refusal. Then switch to "Contract quantities and swing", run the power plant's 2027 terms, and compare the take-or-pay quantity on the full ACQ with the one you would expect after a year's reductions.
