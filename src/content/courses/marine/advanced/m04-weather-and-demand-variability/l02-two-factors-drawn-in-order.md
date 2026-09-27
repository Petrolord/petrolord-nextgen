# Two factors drawn in order

{{panel:marine-variability-calculator}}

Two things vary in the engine's Monte Carlo: the weather factor and the demand factor. Each is stated either as a plain number, which holds it fixed, or as a triangular { min, mode, max }, which lets it vary. The engine's order is fixed and stated in its basis: in each draw the weather factor is drawn first, then the demand factor, and each only when it varies.

## Why the order is stated

All the draws come from one mulberry32 stream on the stated seed. If the weather factor varies, it takes the first uniform number of each draw and the demand factor the second. If the weather is fixed, it takes none, and the demand factor takes the first. Stating the order is what lets anyone with the same inputs and the same seed get every draw back exactly. A triangular with its max equal to its min does not vary, and draws nothing.

## What each factor does

The weather factor multiplies the time of the activities the call names, as the Associate tier taught, and fuel follows time. The demand factor multiplies every installation's demand in the period, deck area, deck weight and every bulk product alike. The minimum visits do not scale: they are a count of visits, stated.

## One factor at a time

| golden input | weather factor | demand factor | seed / draws | mean vessel-days | P90 (low) | P10 (high) |
| --- | --- | --- | --- | --- | --- | --- |
| variability-fixed-factors-equal-fleet-size | 1.2 | 1 | 1 / 50 | 10.345455 | 10.345455 | 10.345455 |
| variability-weather-only | 1, 1.2, 1.6 | 1 | 3 / 3000 | 10.803806 | 9.747707 | 12.018460 |
| variability-demand-only-fractional | 1.2 | 0.85, 1, 1.3 | 5 / 3000 | 8.465681 | 7.759091 | 9.450642 |

Every figure is a seeded estimate on the seed and draws shown, and none is graded. With both factors fixed every draw is the fleetSize week, 10.345455 vessel-days. With the weather alone varying, the mean sits above the plan: the triangular's long side runs up to 1.6, so its average lies above its mode of 1.2. The demand-only run leaves its voyages unrounded, so its vessel-days move smoothly with the factor, down to a floor: its P90 of 7.759091 is three voyages of 2.586364 days, because in the low-demand draws the minimum visits of three hold the count up.

## A triangular the engine refuses

A triangular must keep min at or below mode at or below max, verbatim:

> demandFactor must have min <= mode <= max; got min 1, mode 0.9, max 1.3

The weather factor keeps its calm floor of 1 inside a triangular too, verbatim:

> weather.factor.min must be at or above 1; got 0.9

A key a triangular does not read is refused, verbatim:

> demandFactor.mean is not an accepted key; the accepted keys of demandFactor are min, mode, max

## Exercise

Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Both factors fixed"; read the statistics table. Switch the start to "Weather alone", then to "Demand alone, voyages not rounded", and compare the spread of each with the table. On the "Ekene week, PSV milk run, weather and demand" start, set Demand factor: min (stated) to 1 and Demand factor: mode (stated) to 0.9, and read the refusal.
