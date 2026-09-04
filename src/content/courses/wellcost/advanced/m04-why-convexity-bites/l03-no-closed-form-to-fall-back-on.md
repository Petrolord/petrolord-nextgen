# No closed form to fall back on

The fixture in the panel publishes an exact mean and an exact variance. A real rate driven case cannot, and the reason is worth understanding rather than accepting.

{{panel:wc-risk-explorer}}

## Why the fixture closes

The Monte Carlo fixture is uncertain in three flat activity durations and one lump cost. A flat duration enters the schedule by addition. The schedule enters the cost through a single per-day spread rate of 120,000 USD per day, which is multiplication by a constant. The lump enters by addition.

Add and multiply by constants, and nothing else. That makes the total cost a linear combination of the four uncertain inputs.

Linear combinations have textbook moments. The mean of a sum is the sum of the means, whatever the shapes. The variance of a sum of independent terms is the sum of the variances, scaled by the squares of the coefficients. You never need a sample.

## The fixture proves it

Rebuild those moments by hand from the four input distributions and compare them with the published analytic values. The mean days and mean cost agree with an error of exactly zero. The cost variance agrees with an error of exactly zero. The days variance and the standard deviation agree to about one part in ten billion, which is floating point noise and nothing more.

| Quantity | Analytic | Rebuilt from the inputs |
| --- | --- | --- |
| Mean days | 6.75 | 6.75 |
| Mean cost (USD) | 1,530,000 | 1,530,000 |
| Cost variance | 4079166666.6666665 | 4079166666.6666665 |

That is not a lucky fixture. It is a fixture deliberately built to be linear so the closed form can be checked.

## Why a rate driven case does not close

Change one uncertainty from a duration to a rate of penetration and the structure breaks. Time is now the interval divided by the sampled rate, so the cost depends on one over the rate.

The expectation of one over a random variable is not one over its expectation. Put the mean rate in and you get the wrong mean time, always, and the error is in the same direction every time.

Worse, there is no convenient moment to reach for. The variance of the total would need the expectation of one over rate squared, and once two sections both carry uncertain rates and share a per-day exposure, you are asking for moments of a sum of reciprocals of different triangulars. No standard result covers it.

The golden case has exactly that structure. Two of its four uncertainties are rates of penetration, on the intermediate hole and on the production hole.

## Exercise

List the four uncertainties in the fixture and mark each one as entering the cost by addition or by multiplication by a constant.

Then do the same for the golden case and identify the two that break linearity. Say in one sentence what quantity you would need to know to write the variance in closed form.
