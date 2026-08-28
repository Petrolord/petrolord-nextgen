# The Hall plot

The ledger knows how much water went into a well. It does not know how hard it was to put there. That second question is injectivity, it lives entirely in the injection pressure, and the classical tool for reading it is the Hall plot.

## The construction

Two running sums, taken over the injection history of one well:

$$I = \sum p \,\Delta t \qquad \text{the Hall integral, psi-days}$$
$$W = \sum q \,\Delta t \qquad \text{cumulative injection, barrels}$$

Plot $I$ against $W$. The local slope is

$$\frac{dI}{dW} = \frac{p \,\Delta t}{q \,\Delta t} = \frac{p}{q}$$

pressure over rate, which is a resistance. A well that needs more pressure to take the same water has a steeper slope.

## Why integrate at all

Because $p/q$ computed point by point is noisy. Daily injection rates jump around with facility operations, and the ratio of two noisy series is noisier than either. Integrating both before differencing is a smoothing operation that keeps the physical meaning: the slope of the integral curve over any interval is the average $p/q$ over that interval, weighted by time.

It also makes a change of behaviour visible as a change of SLOPE rather than a change of level, and slopes are easier to see and to fit than levels.

## Reading the shape

**A straight line** means constant injectivity. The well is behaving.

**A steepening curve** means rising resistance: plugging, scale, fines migration, rising skin. The well needs more pressure for the same water.

**A flattening curve** means falling resistance: the well is taking water more easily than it was. That sounds good and often is not, because the usual causes are the formation parting and taking a fracture, or a channel opening behind casing into a thief zone.

## What the engine computes

Rather than asking a human to eyeball a curve, the engine fits two straight lines and compares them.

It divides the points into thirds. It fits an ordinary least squares slope to the first third, calling that the baseline. It fits another to the last third, calling that the recent slope. It reports both and their ratio:

$$\text{slope ratio} = \frac{\text{recent slope}}{\text{baseline slope}}$$

A ratio at or above 1.2 raises a declining-injectivity alert. A ratio at or below 0.8 raises an improving-injectivity alert. Between those it says nothing.

## The data requirement

A point enters the sums only if BOTH pressure and rate are present for that date. An injector with no pressure data produces no Hall plot at all; it is returned in a separate list of injectors without pressure, rather than being given a plot built on an assumed pressure.

There is also a minimum: fewer than ten usable points and the well is excluded. Ekene's injectors have 36 monthly points each, comfortably above it.

That minimum matters because the thirds construction needs enough points in each third for a least squares fit to mean anything. Twelve points per third on Ekene is reasonable. Four points per third would give slopes dominated by whichever point sits at the end.

## A caution about the time step

The engine computes $\Delta t$ from the gap between consecutive dated points, with a floor of one day. On Ekene's monthly rows the gaps are 28 to 31 days, so the integrals accumulate in month-sized steps.

That is correct, and it means the Hall integral's absolute magnitude depends on the reporting cadence. A well reported daily and the same well reported monthly give the same SLOPES, because both integrals scale together, but very different absolute values of $I$ and $W$. Never compare Hall integrals between wells reported at different cadences without checking; compare slopes.

## The misconception to avoid

"A rising Hall integral means declining injectivity." The integral always rises, because pressure is positive. What carries the information is the SLOPE, and specifically the slope compared against its own earlier value. An eye reading the height of the curve rather than its gradient will call every well in the field a problem.

## Exercise

First, a well injects at a constant 500 barrels per day against a constant 2500 psi for 100 days. Compute the Hall integral, the cumulative injection, and the slope, and state the units of each.

Second, the same well then plugs so that it needs 3000 psi for the same rate, for another 100 days. Compute the new local slope and the ratio against the baseline, and say whether the engine would raise an alert.
