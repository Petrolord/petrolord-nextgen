# Final circulating pressure

The second endpoint, and why it is a ratio.

{{panel:wc-killsheet-explorer}}

## The expression

    FCP = slow circulating rate pressure x (kill mud density / original mud density)

A scaling rather than a sum, and that difference is worth understanding.

## Why a scaling

Because at the end of the string displacement the pipe is full of KILL mud, which balances the formation on its own.

So no surface pressure is needed to hold the bottom hole pressure: the SIDPP contribution has gone to zero. All that is left is the friction of circulating.

And the friction is larger than it was, because the mud is heavier. The scaling by the density ratio is the approximation the engine uses for that.

## The numbers

| well | scenario | kill mud | ratio | FCP |
|---|---|---|---|---|
| horizontal | moderate | 1607.873978399 | 1.1165791516661647 | 5024606.182497741 Pa |
| horizontal | small | 1507.149591360 | 1.0466316606664658 | 4709842.472999097 Pa |
| slant | moderate | 1521.319686054 | 1.0564720042041036 | 4754124.018918467 Pa |
| slant | small | 1472.527874422 | 1.0225888016816413 | 4601649.607567387 Pa |

Read the ratios. All four are close to one, because the mud weight change is modest, so the FCP is close to the slow circulating rate pressure in every case.

## Why the density scaling is an approximation

Because the pressure loss inside the string is not exactly proportional to density.

The friction factor depends on the Reynolds number, which depends on the viscosity as well as the density, and weighting a mud up with barite raises both. The Drilling Hydraulics course computes it properly; this scaling is the standard field approximation.

It is good to a few percent for a modest weight-up and it gets worse for a large one.

## The one that is exact

The ICP. It is a sum of two measured pressures and there is no model in it.

So of the schedule's two endpoints, one is exact and one is approximate, and the approximate one is at the end where the surface pressure is smallest and matters least.

## What happens if the FCP is wrong

The bottom hole pressure at the end of the string displacement is wrong by the same amount.

Too low an FCP means the choke is held too closed at the end and the bottom hole pressure is above the formation pressure, which is safe and may fracture the shoe. Too high means underbalance and more influx.

Since the FCP is usually below the ICP, the error is small in absolute terms, and it is the direction that matters.

## Exercise

Compute the FCP for all four combinations from the slow circulating rate pressure and the two mud weights.

Then say which of the four has the largest density ratio, and check that it also has the largest gap between its ICP and its FCP.
