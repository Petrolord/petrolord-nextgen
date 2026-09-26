# The tier that is chosen

One tier is selected each year and one rate is charged. Knowing which tier the engine picked, and how to prove it from the ledger, is the whole of reading a sliding royalty.

{{panel:ec-instrument-explorer}}

## The selection

`getSlidingScaleRoyalty` sorts a copy of the tier list by threshold, then keeps the rate of the highest threshold the oil price has reached. Where the price has reached no threshold at all it charges the lowest tier's rate. The order the tiers were typed in cannot change the answer, and two tiers sharing one threshold are refused by name rather than resolved quietly.

Two consequences follow. Below every threshold a rate still applies, so a sliding royalty is never zero unless a tier says so. And a price that reaches two thresholds pays the rate of the higher one, with no sum and no blend.

## Where the step falls

The tier the engine chose is not printed. What is printed is royalty and gross revenue, and their ratio names it. On the tiered teaching regime's tiers of 0 USD/bbl at 7.5 percent and 50 USD/bbl at 10 percent, swept across the price multiplier on the Designer's default project:

| price multiplier | applied year 1 oil price | year 1 grossRevenue | year 1 royalty | implied rate |
| --- | --- | --- | --- | --- |
| 0.600000 | 42.000000 | 169.7889 | 12.7342 | 0.075000 |
| 0.700000 | 49.000000 | 195.3389 | 14.6504 | 0.075000 |
| 0.710000 | 49.700000 | 197.8939 | 14.8420 | 0.075000 |
| 0.720000 | 50.400000 | 200.4489 | 20.0449 | 0.100000 |
| 0.800000 | 56.000000 | 220.8889 | 22.0889 | 0.100000 |

The implied rate steps between the multipliers 0.710000 and 0.720000, which is where the applied price crosses 50 USD per bbl. A sweep brackets a threshold. It never lands on one, so it cannot say which side the threshold itself belongs to.

## Which side the threshold belongs to

The comparison in the engine is `oilPrice >= tier.threshold`, so the threshold belongs to the tier above it. Three probe decks priced at and around 50, with no multiplier at all and the Designer's default project in every other respect, settle it:

| deck oil price, USD/bbl | year 1 grossRevenue | year 1 royalty | implied rate |
| --- | --- | --- | --- |
| 49.990000 | 198.9524 | 14.9214 | 0.075000 |
| 50.000000 | 198.9889 | 19.8989 | 0.100000 |
| 50.010000 | 199.0254 | 19.9025 | 0.100000 |

A price one cent below the threshold pays 7.5 percent. A price exactly on it pays 10 percent, and so does a price one cent above.

## The mistake

Read a sweep's printed price column as a rounding of the price the engine used, never as the price itself. A multiplier chosen to hit 50 exactly does not: 70 times 50 divided by 70 is 49.99999999999998 in binary floating point, strictly below the threshold, and it still prints as 50.000000 at six decimals. A reader who trusts that print will conclude the threshold belongs to the lower tier, which is the opposite of the rule. The implied rate is the measurement. It says which side the engine was actually on, and the printed price does not.

## What it refuses

Selecting a rate is the whole of what the function does. It has no memory of last year's tier, so the rate can move up in one year and back down in the next. It cannot key a threshold on anything but the oil price.

## Exercise

Name the two multipliers the step falls between and the rate either side. Then state what the three probe decks pay at 49.990000, 50.000000 and 50.010000, and say which tier owns the threshold.
