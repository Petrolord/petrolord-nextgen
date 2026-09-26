# Continuity at the kinks

{{panel:gsa-contract-calculator}}

An S-curve changes its slope at each kink. It must not change its level there. If the price jumped at a kink, one cent of oil could move the gas price by a whole step, and the party on the wrong side of the step would have every reason to argue over which month's average counts. This lesson proves on the engine that the curve is continuous, and names the rule that decides which segment a month sits on.

## The rule at the kink

The engine puts a month whose index equals a kink on the middle segment, where P = constant + slope x X. Each outer segment starts from the middle line's price at its kink and adds its own slope times the distance beyond it. At the kink that distance is zero, so both formulas give the same price. That is continuity, and it holds for any slopes a contract states.

## Six months either side of two kinks

The golden input is oil-indexed 0.5 + 0.12 x oil, S-curve kinks 50 and 90, slopes 0.06 and 0.03, averaging 1 month, lag 0, reset every 1 and no rounding, so each price is the formula on that month's index alone.

| index | segment | price |
| --- | --- | --- |
| 49.990000 | low | 6.499400 |
| 50.000000 | mid | 6.500000 |
| 50.010000 | mid | 6.501200 |
| 89.990000 | mid | 11.298800 |
| 90.000000 | mid | 11.300000 |
| 90.010000 | high | 11.300300 |

At the low kink the price is 6.500000. One cent of oil below it, on the low segment, the price is 6.499400: 0.06 times one cent less. One cent above it, on the middle segment, it is 6.501200: 0.12 times one cent more. Each step is the size its slope sets. At the high kink the price is 11.300000, still on the middle segment, and one cent above it the high segment adds 0.03 times one cent to give 11.300300.

## The label is no price event

The segment label changes at the kink and the price does not. A report that reads a move to the high segment as a leap in price has misread the column. The label says which slope applies to the next cent of oil.

## Refusals on the kinks

The engine refuses an S-curve that cannot be drawn, and a key it does not read. Each message starts with the field it names:

> formula.sCurve.highKink must be above formula.sCurve.lowKink 90; got 50

> formula.sCurve.highkink is not an accepted key; the accepted keys of formula.sCurve are lowKink, highKink, lowSlope, highSlope

The second matters more than it looks. A misspelt key dropped in silence would leave a contract with no high kink and a price running straight on; the engine refuses it by name.

## Exercise

Open the contract calculator on "Prices on an S-curve". Replace its inputs with the golden kinks case: oil index months 2026-01 to 2026-06 at 49.99, 50, 50.01, 89.99, 90 and 90.01, and the formula 0.5 + 0.12 x oil with kinks 50 and 90 and slopes 0.06 and 0.03. Confirm the six prices above. Then set highSlope to 0 and explain why the price at 90.01 now equals the price at 90. Finally swap the two kinks, then misspell highKink, and read each refusal.
