# The Monte Carlo underneath

{{panel:marine-variability-calculator}}

The Professional tier sized the Ekene week from one weather factor and one week of demand. A real rainy season is not one factor, and a real week's cargo is not the plan. The engine's `fleetVariability` function lets both vary and sizes the fleet again and again, once per draw, to show the spread of the requirement around the plan.

## One sampler, shared

The engine carries no sampler of its own. It draws through the academy's canonical Monte Carlo in lib/stats: one mulberry32 stream on the stated seed, each value taken from the triangular inverse CDF (triInvCDF) of its uniform draw, and the summaries from basicStats. The percentile labels come from lib/conventions/percentile.js. Monte Carlo as a subject, with its distributions and percentiles, belongs to the uncertainty course; this course applies the canonical sampler to the fleet and teaches only what it needs to read the results.

## Each draw is a fleetSize week

In every draw the engine takes a weather factor and a demand factor, multiplies every installation's demand by the demand factor, applies the weather factor to the activities the call names, and sizes the fleet exactly as fleetSize does: voyages from the largest demand ratio and the minimum visits, rounded by the stated rule, vessel-days, and vessels over the available days. Nothing about the sizing changes. Only its inputs move.

## The Ekene week

The Ekene week on the PSV milk run states a triangular weather factor of min 1, mode 1.2 and max 1.6 on sailing and field time, a triangular demand factor of min 0.85, mode 1 and max 1.3, 2 planned vessels, and 20000 draws on seed 20260927.

| figure | Ekene week |
| --- | --- |
| weather factor at the mode | 1.2 |
| demand factor at the mode | 1 |
| vessel-days at the modes (not a draw) | 10.345455 |
| vessels at the modes (not a draw) | 2 |

The plan at the modes is the figure fleetSize returns for the same week, and it is no draw. The sampled figures around it are estimates on the stated seed and draws, and none of them is graded.

## No seed, no run

A Monte Carlo run that cannot be repeated cannot be checked. The engine therefore takes no seed of its own, and a call without one is refused, verbatim:

> seed must be a whole number from 0 to 4294967295 (there is no default, so every run can be reproduced); got nothing

## Exercise

Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Ekene week, PSV milk run, weather and demand". Read the four Plan at the modes tiles and check them against the table above. Clear the Seed (stated) control and read the refusal, then restore 20260927 and note the seed and the draws printed in the column headings of the statistics table.
