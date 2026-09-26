# The S-curve and its kinks

{{panel:gsa-ledger-calculator}}

{{panel:gsa-contract-calculator}}

A straight oil-indexed line passes every swing in oil straight through to the gas price. An S-curve softens the line at both ends. Between two stated oil prices, the kinks, the price follows the contract slope. Below the low kink and above the high kink it follows gentler slopes, so the buyer is shielded when oil is high and the seller when oil is low.

CLDP and US DOE, Understanding Natural Gas and LNG Options (edition current as of October 2017, read on 2026-09-26), describe the S-curve as a concept. The course computes it through `priceSeries`.

## The three segments

The engine's rule, for an oil-indexed price with an `sCurve` block of lowKink, highKink, lowSlope and highSlope:

* Below the low kink, P = constant + slope x lowKink + lowSlope x (X - lowKink).
* Above the high kink, the same shape with highKink and highSlope.
* Between the kinks, and AT either kink, P = constant + slope x X.

X is the month's index average. Each outer segment starts from the price the middle line gives at its kink, so the curve does not jump there; the next lesson proves it. The engine labels every priced month with its segment: low, mid or high.

## The golden kinks

The course's golden input for the kinks is oil-indexed 0.5 + 0.12 x oil, with kinks at 50 and 90 and slopes of 0.06 below and 0.03 above:

| index | segment | price |
| --- | --- | --- |
| 49.990000 | low | 6.499400 |
| 50.000000 | mid | 6.500000 |
| 89.990000 | mid | 11.298800 |
| 90.010000 | high | 11.300300 |

Below 50 each dollar of oil moves the price by 0.06, half the contract slope; above 90 by 0.03, a quarter of it.

## The Ekene export feed curve

The Ekene export feed agreement (synthetic) carries an S-curve at 55 and 90 US$ per barrel, with slopes of 0.06 below and 0.06 above, on 0.5 + 0.12 x the oil index averaged over 6 months ending 1 month before the priced month, reset every 3 months from 2027-01. In its first eighteen priced months every index average sits between the kinks: the 2027-01 block averages 76.925000 and prices 9.731000, and the 2028-01 block averages 56.488333 and prices 7.278600, both on the mid segment. Whether a later block leaves the middle is for the engine to say.

## A kink is no floor

A kink is a change of slope. A floor or a ceiling holds the price at a stated level whatever the index does, and the engine labels a month held there as clamped. A contract can carry both, and the engine reports the segment and the clamp in separate columns.

## Exercise

Open the ledger calculator on "Contract prices month by month". It starts on the Ekene export feed price. Read the segment and index average columns for every priced month, find the lowest index average and the highest, and state how far each sits from the kink nearest to it. Then open the contract calculator on "Prices on an S-curve", paste the same price inputs, raise lowKink to 60 and list every month that moves to the low segment, with its old and new price. State in one sentence which party the low segment protects in those months, and why the 2028 annual average moves less than the 2028-01 price.
