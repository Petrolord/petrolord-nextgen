# The maximum daily quantity and swing

{{panel:gsa-quantity-calculator}}

A buyer's demand for gas is rarely flat. A power plant burns more on a hot afternoon and less at night; a fertiliser plant stops for a turnaround. A gas sales agreement gives the buyer room to vary its daily take above the DCQ, up to a ceiling. That ceiling is the maximum daily contract quantity, MaxDCQ, and the room it gives is called swing.

## MaxDCQ is a stated percentage of the DCQ

The Commonwealth model agreement leaves the percentage for the parties to insert:

> "a quantity of Gas equal to [## INSERT] percent (##%) of the applicable DCQ." (Commonwealth model GSA (2025), definition of MaxDCQ)

The engine takes it as `maxDcqPct` and computes MaxDCQ = maxDcqPct % of DCQ. The swing factor is MaxDCQ divided by the DCQ.

| case | DCQ | MaxDCQ percent | MaxDCQ (engine) | swing factor (engine) |
| --- | --- | --- | --- | --- |
| power plant | 21000.000000 | 110 | 23100.000000 | 1.100000 |
| export feed, first contract year | 63000.000000 | 105 | 66150.000000 | 1.050000 |

## What swing buys and what it costs

For the buyer, swing is flexibility: on a peak day it can nominate up to MaxDCQ and expect the seller to make that gas available. For the seller, swing is a cost: its wells, processing and pipeline must be sized to deliver MaxDCQ on any day, while it is paid, over the year, for gas actually taken. A contract with high swing and a low take-or-pay level asks a great deal of the seller. The next lesson measures exactly that.

## MaxDCQ cannot sit below the DCQ

A ceiling below the ordinary daily quantity would make every ordinary nomination improper, so the engine refuses a percentage below 100:

> maxDcqPct must be a number at or above 100 when given; got 90

MaxDCQ is optional. Without it the engine prints no MaxDCQ, no swing factor and no effective swing, and in the daily balance every nomination counts as properly nominated. A percentage of exactly 100 is accepted and means no swing at all: MaxDCQ equals the DCQ.

## Where MaxDCQ acts

MaxDCQ does its work day by day. When a buyer nominates above it, the part above MaxDCQ is not properly nominated, and the seller owes nothing for failing to make it available. In the power plant's January 2027, the nomination of 24150 on 2027-01-25 is trimmed to 23100.000000. The engine's reason, verbatim:

> 2027-01-25: nominated 24150 is above the MaxDCQ 23100; 1050 is not properly nominated

The daily balance module returns to this rule.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Contract quantities and swing". Run the starting case and read the MaxDCQ and the swing factor. Set `maxDcqPct` to 105 and `dcq` to 63000, and run it. Set `maxDcqPct` to 90 and read the refusal. Then remove `maxDcqPct` altogether and note which tiles the panel leaves empty. Finally switch to "The daily balance", run the January 2027 case, and find the row for 2027-01-25.
