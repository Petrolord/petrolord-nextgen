# Vessels required as a distribution

{{panel:marine-variability-calculator}}

A single plan says the Ekene week needs 10.345455 vessel-days and 2 vessels. Twenty thousand sized weeks say something richer: how far the requirement spreads, where most weeks fall, and how often the fleet has to grow. The engine summarises the draws in two tables, one for the vessel-days and one for the whole vessels.

## The summaries

On the Ekene week, seed 20260927 and 20000 draws, every figure an estimate and none graded:

| statistic | vessel-days (engine) | vessels required (engine) |
| --- | --- | --- |
| mean | 10.239206 | 2.001400 |
| P90 (low) | 7.977705 | 2.000000 |
| P50 | 10.412277 | 2.000000 |
| P10 (high) | 11.908677 | 2.000000 |
| min | 6.757591 | 2.000000 |
| max | 16.024716 | 3.000000 |

| whole vessels (engine) | share of the draws (engine) |
| --- | --- |
| 2 | 0.998600 |
| 3 | 0.001400 |

## P90 is the low figure

For a requirement or a cost, the P90 is the figure met or exceeded in 90 percent of the draws, which is the low one: the 10th percentile of the sorted draws, at index floor(0.1 n). The P10 is the high figure, the 90th percentile. The engine returns the sentence that fixes the convention, verbatim:

> P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.

So the Ekene P90 of 7.977705 vessel-days is the requirement nine weeks in ten will meet or exceed, and the P10 of 11.908677 the one only one week in ten will reach. A plan that must cover most weeks reads toward the P10, and quotes both with the seed and the draws.

## Why the vessel-days jump

The vessel-days do not spread smoothly. Each draw rounds its voyages up to whole voyages, so the requirement comes in steps of one voyage. In a light week the deck area ratio drops below three and the minimum visits of three set the count; in a normal week the count is four, as in the plan; only heavy weeks with bad weather climb higher. The P90 sits on the three-voyage step and the P50 on the four-voyage step, which is why the P90 lies well below the plan while the P50 lies a little above it.

## Whole vessels

The vessels required round the vessel-days over 6.5 available days up to whole vessels, draw by draw. In 0.998600 of the draws that is 2 vessels, and in 0.001400 it is 3. Every summary of the vessels required is 2 except the max and the mean. The fleet question at the Ekene week is therefore almost settled by the plan. Almost is the word the distribution adds.

## Exercise

Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Ekene week, PSV milk run, weather and demand". Read both tables and the sentence beneath them, and check each against this lesson. Then switch the start to "Ekene week, AHTS dedicated" (seed 11, 5000 draws) and read its P90 and P10 of the vessel-days and its whole vessels table. Say which week is closer to needing a third vessel, and quote both runs with their seeds and draws.
