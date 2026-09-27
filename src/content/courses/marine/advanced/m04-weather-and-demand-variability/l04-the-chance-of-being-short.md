# The chance of being short

{{panel:marine-variability-calculator}}

A fleet manager commits to a number of vessels before the week happens. The engine takes that commitment as a stated input, the planned vessels, and reports how often the sampled weeks need more than the planned fleet can give, and by how much on average.

## Capacity, short and the expected shortfall

The planned capacity in vessel-days is the planned vessels times the available days a vessel. A draw is short when its vessel-days are strictly above that capacity, compared at twelve significant digits. The probability short is the share of draws that are short. The expected short vessel-days is the shortfall averaged over every draw, the draws that are not short counting as zero.

On the Ekene week with 2 planned vessels at 6.5 available days, the capacity is 13.000000 vessel-days (engine). On seed 20260927 and 20000 draws, 0.001400 of the draws are short and the expected shortfall is 0.000686 vessel-days: rare, and small when it comes. What a short day costs, a spot charter or a deferred cargo, is a commercial question the procurement course takes up; this course reports the days.

## The same number twice

The probability short, 0.001400, equals the share of draws that need 3 whole vessels. That is no coincidence here. The vessels are rounded up, so a draw needs a third vessel exactly when its vessel-days pass the 13.000000 two vessels give. Under the nearest rule the two figures can part, since a draw a little above 13.000000 still rounds to 2 vessels, and with no vessel rounding there is no whole vessel table at all. The calculator prints both figures for that reason.

## More runs

Every figure below is a seeded estimate on the seed and draws shown, and none is graded:

| golden input | planned vessels | seed / draws | mean vessel-days | probability short | expected short vessel-days |
| --- | --- | --- | --- | --- | --- |
| variability-at-capacity-is-not-short | 2 | 4 / 20 | 14.000000 | 0.000000 | 0.000000 |
| variability-one-vessel-short-always | 1 | 4 / 20 | 14.000000 | 1.000000 | 7.000000 |
| variability-planned-zero | 0 | 9 / 500 | 10.235579 | 1.000000 | 10.235579 |
| ekene-variability-ahts-dedicated | 2 | 11 / 5000 | 11.846782 | 0.085000 | 0.025759 |

On the first two rows both factors are fixed, so every draw needs 14.000000 vessel-days. Two vessels give exactly that, and a need equal to the capacity is not short, because short means strictly above. One vessel fewer and every draw is short, by 7.000000. With no vessels planned every draw is short by its whole requirement, so the expected shortfall equals the mean. The AHTS on dedicated voyages is short in 0.085000 of its draws: the same two vessels, a much thinner margin.

## The planned fleet is a whole number

The planned vessels are a count the planner commits to, and a fraction is refused, verbatim:

> plannedVessels must be a whole number from 0 to 1000; got 1.5

## Exercise

Open the variability calculator on the view "The fleet under weather and demand variability" and start from "Ekene week, PSV milk run, weather and demand". Read the Planned capacity, Probability short and Expected short vessel-days tiles. Set Planned vessels (stated) to 3 and read them again; then set it to 1. Start from "A need exactly at the planned capacity" and then "One vessel fewer", and read the probability short on each. Quote every figure with its seed and draws.
