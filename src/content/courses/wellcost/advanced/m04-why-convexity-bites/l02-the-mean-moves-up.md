# The mean moves up

Sample a symmetric range of rates and you do not get a symmetric range of costs. The average cost lands above the cost at the average rate.

{{panel:wc-risk-explorer}}

## Two separate lifts, and they are not the same thing

There are two reasons an expected cost sits above a deterministic one, and mixing them up is a common error.

The first is skew in the input. A triangular distribution with a long right tail has a mean above its mode, and that shifts the answer even when everything downstream is linear.

The second is curvature in the map. Time goes as one over rate, so cost is a convex function of any rate you sample. Convexity lifts the mean on its own, even if the rate distribution is perfectly symmetric.

## The linear fixture isolates the first lift

The golden's Monte Carlo fixture is uncertain in three flat durations and one lump value, all of which enter the cost linearly. Its input means sit at 32, 18 and 12 hours against modes of 30, 20 and 10, so the duration shifts are plus 2, minus 2 and plus 2 hours. The uncertain lump has a mean of 220,000 USD against a mode of 200,000.

Run the engine at the modes and the schedule is 160 hours and the base is 1,500,000 USD. The analytic mean is 6.75 days and 1,530,000 USD, a gap of 30,000 USD, which is a fraction of 0.02 of the modal base.

Every dollar of that 30,000 is input skew. Nothing in that fixture bends.

## The second lift, on a rate

Now take the intermediate section, planned at 15 m/hr over 1,500 m, with a symmetric window of plus or minus 5 m/hr around the plan.

| Rate of penetration (m/hr) | Hours | Change from 100 |
| --- | --- | --- |
| 10 | 150 | plus 50 |
| 15 | 100 | zero |
| 20 | 75 | minus 25 |

The downside is exactly twice the upside, from a window that was symmetric in the variable you actually sampled. Widen it to plus or minus 10 m/hr and it gets worse: 5 m/hr gives 300 hours and 25 m/hr gives 60, so 200 hours lost against 40 gained.

Cost then follows time linearly, so it inherits that asymmetry untouched. On the golden estimate one extra day of elapsed time costs 160,000 USD through the per-day lines, and that rate applies equally to hours lost and hours saved. All the bending happened in the step from rate to time.

## What this means for a deterministic estimate

Put most likely rates into the engine and you get the cost of the most likely rates. That is not the most likely cost, and it is certainly not the expected cost.

The number is optimistic, structurally, before anybody has been careless with a single assumption.

## Exercise

In the panel, read the hours at 10, 15 and 20 m/hr on the 1,500 m section and write the two changes from 100 hours side by side.

Then, using the golden's 160,000 USD per extra day, state in one sentence why the cost asymmetry is the same shape as the time asymmetry rather than a worse one.
