# Individual risk along a transect

{{panel:qr-event-tree}}

So far each place has been a single point: the process deck, the control room, the accommodation. A plot plan needs more than three points. The engine's `lsirTransect` computes the LSIR at a list of distances along a line from a release, using the same sum as before: at each distance, the sum over scenarios of the scenario frequency times the probability of death at that distance. The probability of death at each distance is a stated input, supplied from the consequence course, one value per scenario per distance.

## Two scenarios along one line

The frequencies are stated: jet fire 5e-5 per year and explosion 2e-5 per year.

| LSIR per year | distance m | Pd jet fire, stated | Pd explosion, stated |
| --- | --- | --- | --- |
| 0.000070000000 | 0 | 1 | 1 |
| 0.000061000000 | 50 | 0.9 | 0.8 |
| 0.000025500000 | 100 | 0.35 | 0.4 |
| 0.000004500000 | 150 | 0.05 | 0.1 |
| 0.000000600000 | 200 | 0.004 | 0.02 |
| 0.000000020000 | 300 | 0 | 0.001 |
| 0.000000000000 | 400 | 0 | 0 |

## Reading the profile

At the release itself both stated probabilities of death are 1, so the LSIR there is simply the sum of the two frequencies, 0.000070000000 per year. Moving outward, each stated Pd falls, and the LSIR falls with it. At 300 m the jet fire has a stated Pd of 0, so only the explosion contributes. At 400 m neither reaches and the LSIR is 0.000000000000.

The two scenarios fall off at different rates. Close in, the jet fire dominates because its frequency is higher. Further out, the explosion reaches where the jet fire does not, so the far end of the transect belongs to the explosion alone. That shift is the transect's version of the contribution fractions you read at a single place.

## The same sum, many times

Nothing new happens in the arithmetic. Each row is one LSIR, computed exactly as at the process deck: frequency times stated Pd for each scenario, then the sum. The transect is a convenience that runs the sum at many distances in one call.

The engine checks the inputs that make a transect a transect. Distances must increase strictly along the line:

> distancesM[2]: distances must increase strictly

And every scenario needs one probability of death per distance:

> scenarios[0].fatalityProbabilities: 'fire' needs one probability of death per distance (2)

A missing value would leave the engine to guess, and it never guesses.

## What the transect does not do

A transect runs along one line. A full assessment would sweep every direction with a wind rose and a grid, and the engine does no grid or wind rose bookkeeping. The caller supplies each scenario frequency and each stated probability of death. A transect is therefore a profile you choose to draw, along the line that matters to the question.

## Exercise

At 100 m the stated probabilities of death are 0.35 for the jet fire and 0.4 for the explosion. Multiply each by its stated frequency, 5e-5 and 2e-5 per year, add the two products, and confirm that you reach the LSIR of 0.000025500000 per year. Then say which scenario contributes more at that distance.
