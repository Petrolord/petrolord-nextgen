# The time dependent route

{{panel:lp-proof-test}}

The Annex B equations are an approximation, and an engineer is entitled to ask by how much. The golden behind this engine carries the answer, because the oracle that wrote it computed every case a second way. That second way is the TIME DEPENDENT route: the unavailability of the subsystem as a function of time, averaged over the interval by numerical quadrature, with nothing linearised and no equivalent down time. It is a different piece of arithmetic aimed at the same quantity, and setting the two side by side measures the published form itself.

## Five cases read both ways

| golden case | engine PFDavg | route B, golden | engine over route B minus one, derived |
| --- | --- | --- | --- |
| dolan-pt-2oo3 | 0.000235764375 | 0.000235575925 | 8.000e-4 |
| dolan-valve-1oo2 | 0.001048767640 | 0.001043789195 | 4.770e-3 |
| tr84-2oo2 | 0.017520000000 | 0.017317146501 | 1.171e-2 |
| 2oo3-beta0 | 0.000306950400 | 0.000300316807 | 2.209e-2 |
| 1oo1-long-interval | 0.219000000000 | 0.190241513373 | 1.512e-1 |

## The direction is always the same

Across 28 golden cases the engine sits at or above the time dependent route every time. The simplified equations are first order in the failure rate times the interval, and they use equivalent down times, and both of those choices err high. That is the conservative direction for a PFDavg: a form that overstates the average probability of failure on demand understates the risk reduction factor, so a safety instrumented function that passes against Annex B would also have passed against the exact average.

The size of the departure tracks how far the case is from the assumptions. The smallest here is the pressure transmitter 2oo3, at 8.000e-4, a case with a short interval and low rates. The largest is the deliberately long interval 1oo1, at 1.512e-1, which is 15.12 percent above the time dependent value. Its failure rate times its interval is 0.438000, well past the 0.1 at which the engine warns that the linearised equations overstate.

## Why a second route is worth building at all

A test that recomputes the same equations a second time checks the typing and nothing else. A second ROUTE starts from a different description of the same physical situation and arrives at the same quantity by different arithmetic, so it can disagree in a way that means something. Here it does disagree, by a small and consistent amount, and the disagreement has an explanation: the published forms make approximations that the time dependent average does not. A route that agreed exactly everywhere would have told us only that it had been derived from the same algebra.

## Route B is provenance and is never graded

The time dependent values are recorded beside the golden as evidence about the published forms. They are provenance. No capstone in this course grades one, no question asks a learner to compute one, and a verification note that reports a time dependent value has left the standard the site is being assessed against. What the route buys is confidence about direction and size: it says the Annex B answer is high by a fraction of a percent on well behaved cases and by rather more when the rare event assumption is being strained.

## Exercise

Take the tr84-2oo2 pair, 0.017520000000 against 0.017317146501, and the 1oo1-long-interval pair, 0.219000000000 against 0.190241513373. Work out the absolute difference in each pair. Then state, for each pair, whether the choice of route would change the verdict against a required PFDavg of 0.2, and write one sentence on why a form that always errs high is safe to be assessed against even when it is 15.12 percent high.
