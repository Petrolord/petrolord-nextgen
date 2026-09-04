# Why a ratio history is a plot

A water-oil ratio history is a column of numbers until it goes onto log-log paper against producing time. Then it is a shape, and Chan's method reads the shape. The level is close to the least informative thing in the column.

## Four published shapes on identical axes

The golden file carries four labelled histories. Every one holds n = 40 samples, runs from t = 10.000000 to 3000.000000 days, and covers 2.477121255 log cycles. Same axes, same sampling, four different stories.

| Published history | Form | First ratio | Last ratio |
| --- | --- | --- | --- |
| channelling | a t^m, m = 1.600000000 | 0.796214341 | 7318.532456802 |
| coning | plateau t/(t+tau), tau 200.000000000 | 0.190476190 | 3.750000000 |
| displacement | a t, a = 0.050000000 | 0.500000000 | 150.000000000 |
| flat | constant | 1.200000000 | 1.200000000 |

Those are golden values out of the published case file, not a re-run and not a teaching construction.

## The level says almost nothing

Coning ends at 3.750000000, and coning is the one picture where no squeeze will ever help. Displacement, where nothing is wrong with the well, ends at 150.000000000. The wettest of the four is not the one worth spending on.

## Why both axes are logarithmic

A power law is a straight line when both axes are logarithmic, and its exponent is the gradient of that line. Channelling was built with m = 1.600000000, and the golden publishes a lateDerivativeSlope of 1.600000000000 for it over the oracle's late window, series[20:], which starts at t = 186.345364 days and holds 20 samples. Displacement was built with m = 1.000000000 and publishes 1.000000000000 over that same window. Coning is not a power law at all, and over the same 20 samples it publishes -0.555098339661.

## The idea underneath all of it

Channelling is plumbing: water down a path of its own, behind pipe or through a thief zone, and plumbing can be sealed. Coning is not: the water is pulled through the same rock as the oil by the drawdown, and shutting off the bottom perforations lets the cone re-form above them. The two want opposite treatments, so a planner who squeezes without a diagnosis is wrong about half the time.

## The mistake

Reading the last sample. A level is shared by more than one of these shapes at some point in its life. The gradient is the only thing on the plot that separates them.

## Exercise

Write down the first and last ratio of the published channelling and coning histories.

Then say why the published slope of -0.555098339661 is worth more than either endpoint, and name the window it was measured over.
