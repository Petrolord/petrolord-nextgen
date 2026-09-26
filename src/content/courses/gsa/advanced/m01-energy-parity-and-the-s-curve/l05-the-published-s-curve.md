# The published S-curve, figure by figure

{{panel:gsa-ledger-calculator}}

{{panel:gsa-contract-calculator}}

The Energy Charter Secretariat's Putting a Price on Energy: International Pricing Mechanisms for Oil and Gas (2007), read on 2026-09-26, prints an S-curve as Figure 51 in its section 4.5.3.3. The course runs that curve on the engine as a golden input, so the published figure and the engine's return can be read side by side.

## What the figure states

The figure is drawn on P = A x JCC + B with A 0.1485 and B 0.8, a floor at 15 and a cap at 30 US$ per barrel of JCC, and a price that is flat outside them. In the engine's terms that is an oil-indexed formula with slope 0.1485 and constant 0.8, and an S-curve with kinks at 15 and 30 whose outer segments are flat.

| JCC | segment | price |
| --- | --- | --- |
| 10.000000 | low | 3.027500 |
| 15.000000 | mid | 3.027500 |
| 22.500000 | mid | 4.141250 |
| 30.000000 | mid | 5.255000 |
| 40.000000 | high | 5.255000 |

The plateau levels follow from the printed parameters: 3.027500 at and below the lower kink and 5.255000 above the upper kink. Both sit inside the figure's printed price axis of 2.500000 to 5.500000.

## The curve against the straight line

Without the S-curve the same formula is a straight line, which the course's golden input prices at 2.285000 for a JCC of 10 and 6.740000 for a JCC of 40. The S-curve lifts the low end to 3.027500 and holds the high end at 5.255000; at 22.500000 the two agree at 4.141250. The flat segments protect the seller below a JCC of 15 and the buyer above 30.

A flat outer segment behaves like a floor and a ceiling, yet the engine labels those months low and high and leaves the clamped column empty, because the S-curve set them. A floor or ceiling stated in the formula is a separate term, and a month it holds is labelled clamped.

## Figure 51 beside the Ekene export feed

The Ekene export feed agreement (synthetic) uses the same idea with other numbers: 0.5 + 0.12 x oil, kinks at 55 and 90, slopes of 0.06 on both outer segments, so its price keeps moving beyond each kink at half the contract slope. It also averages the index over 6 months with a lag of 1 and resets every 3 months, where the Figure 51 golden input prices each month on that month's JCC.

## A figure is a picture of a rule

The engine lets the rule be run, which is how the course reads every published figure: take the printed parameters, run them, and compare the return with the page. Here the engine agrees with the figure's shape and axis. A later lesson reads a figure the same report prints that the engine computes more exactly.

## Exercise

Open the contract calculator on "Prices on an S-curve". It starts on Figure 51. Confirm the five prices, then add months at JCC 5, 12, 20 and 25 and state which segment each falls on and why. Next open the ledger calculator on "Contract prices month by month", paste the same inputs and read the annual row for 2026. Finally set lowSlope and highSlope to 0.06 and describe in two sentences how the curve now differs from the published one.
