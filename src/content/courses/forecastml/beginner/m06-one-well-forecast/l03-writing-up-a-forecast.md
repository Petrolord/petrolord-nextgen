# Writing up a forecast

{{panel:pf-smoothing-explorer}}

A forecast is only as useful as the note that goes with it. A bare number with no method and no months behind it cannot be checked, compared or reproduced. A note that names the well, the months, the method and every parameter can be rerun by anyone. This lesson sets out what an Associate forecast note names, and the words it uses.

## What the note names

Writing up a forecast names, in order:

1. the well and the months fitted;
2. the method;
3. each parameter, and whether it was fitted or given, with any bound it sits on;
4. `scoredFrom` and the MSE;
5. h, the number of steps forecast;
6. that the numbers are in-sample until the forecast has been tested on months the fit never saw.

Here is the EKENE-P4 note from the workflow lesson, written out in full.

EKENE-P4, months 0 to 47. Damped trend. alpha 0.388341, beta 0.109704 and phi 0.800000, all fitted, phi on its lower bound. Scored from index 2, MSE 4502.618003. 12 steps: 244.373345 at step 1 and 239.235397 at step 12. In-sample; not yet tested on held-back months.

Each item earns its place. The months fitted let a reader rerun the fit on the same data. The method and parameters fix the recursion. The bound tells the reader the fit ran out of room. `scoredFrom` fixes the divisor of the MSE. And the in-sample line stops anyone mistaking a fit for a test.

## The words, used as this course uses them

The course gives several words a narrower meaning than they have in conversation. Five of them matter at this tier, and a note uses them that way.

| word | as this course uses it |
| --- | --- |
| forecast | the point forecast of one fitted method, named with its method |
| error | actual minus forecast; a residual is an in-sample one-step error |
| accuracy | a named metric on named months |
| trend | the smoothed trend state b, in bbl/d per month |
| machine learning | the method named by what it is: here, exponential smoothing |

A one-step forecast inside the series is a fitted value. So "damped forecast, step 12, 239.235397" is a forecast; "Holt's fitted value for month 2" is a fitted value. A note never says a forecast is accurate without naming the metric and the months. At this tier the only metric is the in-sample MSE, over the scored months of the fit.

When the note gives a trend, it gives the state b and its unit: Holt on EKENE-P5 "ends on a trend of -0.702187 bbl/d per month". A regression slope through the rates is a different number and is not the trend.

## A given parameter is a judgement

If any parameter was given, the note says so and says why. A phi given from a view of how the decline will slow is a reasonable choice, and a reader deserves to know it was a choice. The engine lists given parameters in `fixed`; the note should list them too.

## What the note does not claim

An Associate note makes no claim about how the forecast will score against months to come. It reports a fit and its projection. Testing belongs to the Professional tier, and uncertainty around the forecast to the Expert tier. A note that claims either without the work behind it claims too much.

## Exercise

In the smoothing explorer choose "Fit a method", load EKENE-P3, pick damped and leave every parameter blank with h 12. Write a note that names all six items above, using only figures the panel shows. Then give phi 0.9, refit, and write a second note that says which parameter was given.
