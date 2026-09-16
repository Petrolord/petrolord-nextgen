# The label that is not the sweep

The capex chart's axis promises a multiplier of 0.8 to 1.5. For a long time the loop behind it stopped at 1.4. The axis and the points agree now, and the habit the episode leaves behind is worth more than the fix.

{{panel:ec-comparison-explorer}}

## Why the last point used to be missing

The retired sweep was a for loop from a multiplier of 0.8 to 1.5 in steps of 0.1, tested with a less-than-or-equal against 1.5. Adding 0.1 repeatedly to a binary floating point number does not land on 1.5: the accumulated multiplier reached 1.5000000000000004, the test failed, and the loop exited. Seven labels came back, 0.8 through 1.4, and a reader took the last for the end of a range advertised as reaching 1.5. The engine now builds the grid from an integer step count, `CAPEX_SWEEP_MULTIPLIERS`, each multiplier written as 8 plus the step number over 10, so the eighth is exactly 1.5.

## The endpoint the engine reaches

On the default project Nigeria - PIA (2021) returns 58.5739 million USD of contractor NPV at a multiplier of 1.5, and the engine called directly at 1.5 returns 58.5739 too. That agreement holds on every regime, and it is the check that matters: a swept endpoint equal to the direct call is reached, not approached. The losses over the swept range follow, 118.3685 million USD for that regime, 88.6123 for Angola - Deepwater PSC and 267.7301 for USA - Gulf of Mexico.

## A different range, published

The published capex cases do not use the sweep's range at all. Nine of them run the Designer's own default regime at multipliers of 0.7 to 1.5 and pin the whole result, and the NPV falls from 220.1703 at 0.7 to 41.2671 at 1.5 while payback slips from year 3 to year 6 and the payout year from 2 to 4. Two ranges live in one engine, and only one is the one on the axis.

## The sentence was not false, and that was the hazard

While the loop stopped short, the resilience sentence said exactly what it had measured: contractor NPV given up between the first and last point the sweep produced, a 20 percent underspend and a 40 percent overrun. Nothing in it was wrong. It was answering a narrower question than the chart's label asked, which is harder to catch than a wrong number, and it is why the golden now pins the grid, `capexGrid`, and not only the values on it.

## What the sweep refuses

No input changes the swept range, the step, or the number of points. A reader who wants a 70 percent overrun still has to call the ledger function directly at that multiplier.

## The mistake

The careful mistake is trusting an axis against its own points, and the tell survives the repair. When a chart's last tick label sits one step short of its axis maximum, an accumulating floating point loop is the first suspect. The fix is a count of steps, and the proof is an endpoint that matches a direct call.

## Exercise

State the multiplier the retired accumulation reached instead of 1.5 and how the grid is built now. Then, for USA - Gulf of Mexico, give the contractor NPV at the last swept point and the loss over the swept range.
