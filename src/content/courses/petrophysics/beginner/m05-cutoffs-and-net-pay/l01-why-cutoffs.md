# Why cutoffs

By this point in the course you can turn raw curves into three interpreted curves: shale volume $V_{sh}$ from the gamma ray, porosity $\phi$ from the density log, and water saturation $S_w$ from resistivity through the Archie equation. Each of those is a value at every sample depth. What the business needs, though, is a much smaller set of numbers: how much of this interval is actually worth producing, and what are its average properties? Cutoffs are the bridge from sample-by-sample curves to those bookable numbers.

## Gross, net reservoir, net pay

Think of the interval as passing through a series of nested filters.

**Gross rock** is everything between the top and base of the zone you are evaluating. It includes shales, tight streaks, wet sands, everything. Gross thickness is set purely by where the geologist draws the zone boundaries.

**Net reservoir** is the subset of gross rock that could store and flow hydrocarbons if any were present. A sample fails this filter for two reasons. If its porosity is too low, there is nowhere for fluid to sit and the pore network is usually too poorly connected to flow. If its shale volume is too high, the pore space that does exist is clay-bound and effectively useless for production.

**Net pay** is the subset of net reservoir that actually contains producible hydrocarbons. A sample that passes the porosity and shale tests but sits in the water leg is good rock full of the wrong fluid. The water saturation test removes it.

Each filter is a simple threshold comparison, called a cutoff. A sample at depth $i$ is flagged as pay only when all three tests pass at once:

$$\phi_i \geq \phi_{cut} \quad \text{and} \quad V_{sh,i} \leq V_{sh,cut} \quad \text{and} \quad S_{w,i} \leq S_{w,cut}$$

Notice the directions. Porosity must be at or above its cutoff, because more porosity is better. Shale volume and water saturation must be at or below theirs, because less of each is better. Getting a direction backwards is a surprisingly common early mistake, and it produces answers that are obviously wrong the moment you compare them to the log display.

## From flags to thickness

The pay test produces a flag, pay or no pay, at every sample depth. Thickness comes from counting flags. The typewell is sampled every 0.5 m, so each flagged sample represents 0.5 m of pay:

$$h_{net} = N_{pay} \times 0.5\ \text{m}$$

where $N_{pay}$ is the number of flagged samples in the zone.

## A worked example

Take a single sample from a sand at 2020.0 m with $\phi = 0.21$, $V_{sh} = 0.00$ and $S_w = 0.35$, and apply the typewell cutoffs ($\phi_{cut} = 0.08$, $V_{sh,cut} = 0.5$, $S_{w,cut} = 0.6$):

| Test | Value | Cutoff | Pass? |
|---|---|---|---|
| Porosity | 0.21 | $\geq 0.08$ | yes |
| Shale volume | 0.00 | $\leq 0.5$ | yes |
| Water saturation | 0.35 | $\leq 0.6$ | yes |

All three pass, so the sample is pay and contributes 0.5 m to net pay.

Now a sample from deeper in the well with $\phi = 0.06$, $V_{sh} = 0.02$ and $S_w = 0.55$. The shale and saturation tests pass, but $0.06 < 0.08$ fails the porosity test. One failed test is enough: the sample is not pay, and it contributes nothing. There is no partial credit and no averaging of the three tests. The filter is a logical AND.

## Why a hard threshold?

A threshold throws information away on purpose. Rock with 7.9 percent porosity is barely different from rock with 8.1 percent, yet one is counted and the other is discarded. That sounds crude, and it is, but it buys two things. First, the result is completely reproducible: two interpreters using the same curves and the same cutoffs will book exactly the same net pay. Second, the thresholds can be tied to something physical, usually a minimum permeability measured on core, which is where the next lesson picks up.

Keep in mind what cutoffs do to your summary statistics as well. Once low-quality samples are filtered out, any averages you quote (average porosity, average saturation) are computed over the pay samples only. That makes the averages better than the gross interval would suggest, and that is exactly the point: they describe the rock you intend to produce.

## Exercise

A zone is sampled every 0.5 m. Within it, 14 samples pass all three cutoff tests, 3 samples fail only the porosity test, and 5 samples fail only the saturation test.

1. What is the net pay thickness?
2. A colleague argues the 5 samples that failed only on saturation should count as "half pay" because two of three tests passed. What has this colleague misunderstood?

Self-check: (1) only the 14 full passes count, so $h_{net} = 14 \times 0.5 = 7.0$ m. (2) The pay test is a logical AND of all three conditions; a sample in the water leg is wet rock however good its porosity, so partial credit has no physical meaning.
