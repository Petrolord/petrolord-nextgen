# Indicator chances and posteriors

The Analyzer takes a survey the other way round from the tree engine. It asks for the chance of each indicator and the chance of each outcome given that indicator: posteriors with the prior already inside them, which must agree with the stated outcome chances.

{{panel:ec-information-explorer}}

## What is typed

In the default study, Positive Seismic comes up 40 percent of the time and leaves Success Case at 60 percent and Dry Hole at 40 percent; Negative Seismic comes up 60 percent of the time and leaves them at 10 and 90 percent. Each row sums to 100, and so do the indicator chances. The EKPAN lottery typed the same way uses its Bayes results at full precision: Bright spot 46.000000 percent, P(Success | Bright spot) 64.673913 percent, P(Success | No bright spot) 9.722222 percent.

## The prior the typing implies

Weight each indicator's outcome chance by the chance of that indicator, and the stated outcome chance must come back:

40 percent x 60 percent + 60 percent x 10 percent = 30 percent, the stated Success Case

For the EKPAN lottery, 0.460000 x 0.646739 + 0.540000 x 0.097222 returns 0.350000, the stated prior.

When an implied chance sits more than 0.005 from the stated one, the repaired Analyzer still reports the EMV without information and the EVPI, which use only the stated chances, and withholds the EMV with information, the value of information, the net value and the diagram. The EKPAN lottery typed with Bright spot at 56 percent and No bright spot at 44 percent, posteriors unchanged, is withheld: it reports 75.75 and 52.00 only. Before the repair the same inputs printed a gross value of 40.62.

## The best action after each indicator

After Positive Seismic, 0.600000 x 300.0000 + 0.400000 x -50.0000, less the cost 40.0000, is positive, so the Analyzer drills. After Negative Seismic, 0.100000 x 300.0000 + 0.900000 x -50.0000, less 40.0000, is negative, and "Do Not" wins at 0. With the survey free the EMV with information card reads 48.00; at the survey cost of 10.0000 it reads 38.00.

On the EKPAN lottery a bright spot leaves Drill at 207.7989. After no bright spot Drill is worth -36.7361, so "Do Not" wins:

0.460000 x 207.7989 + 0.540000 x 0.0000 = 95.5875

Less the survey cost of 8.0000 that is 87.5875, the root of the drawn tree, shown on the card as 87.59.

## The mistake

The careful mistake is typing a likelihood into a posterior box. The survey shows a bright spot over 0.850000 of successes; read as P(Success | Bright spot), it values Drill after a bright spot at 298.2500 in a rollback, against the posterior's 207.7989. Typed into the repaired Analyzer, the implied success chance lands far more than 0.005 from 0.350000, and the value is withheld instead of overstated.

## What it refuses

The check never repairs. It does not rescale posteriors to fit the prior or guess which box is wrong; it withholds.

## Exercise

Show that the default study's indicators imply the stated 30 percent Success Case. Then explain why the EKPAN lottery typed with Bright spot at 56 percent is withheld although its indicator chances sum to 100, and name the two values the Analyzer still reports for it.
