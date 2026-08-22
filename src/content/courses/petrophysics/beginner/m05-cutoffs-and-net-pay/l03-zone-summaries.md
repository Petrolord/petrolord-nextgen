# Zone summaries

The pay flags from the last two lessons compress an interval of curves into a handful of numbers that a geologist, a reservoir engineer or a reserves auditor can actually use. This lesson defines those numbers precisely, because the definitions carry traps.

## The four summary quantities

**Gross thickness.** The full interval between the zone top and base:

$$h_{gross} = \text{(thickness represented by all samples from top to base inclusive)}$$

Gross depends only on where the zone boundaries are drawn. On a regularly sampled log it is the number of samples in the zone times the sample increment.

**Net thickness.** The summed thickness of the samples flagged as pay:

$$h_{net} = N_{pay} \times \Delta z$$

with $\Delta z = 0.5$ m on the typewell.

**Net-to-gross.** The ratio

$$NTG = \frac{h_{net}}{h_{gross}}$$

a dimensionless fraction between 0 and 1. NTG is the single most quoted measure of interval quality, because it survives changes in zone thickness: a thin clean sand and a thick clean sand can both have NTG near 0.9.

**Pay-average properties.** The porosity and saturation averages computed over the pay samples only:

$$\bar{\phi} = \frac{\sum_{pay} \phi_i}{N_{pay}}, \qquad \bar{S_w} = \frac{\sum_{pay} S_{w,i}}{N_{pay}}$$

With uniform sampling, this simple mean of the pay samples is exactly the thickness-weighted average of the pay, since every sample carries the same 0.5 m weight.

## The classic mistake

Averaging $\phi$ or $S_w$ over the **gross** interval instead of over the pay samples dilutes the answer with shales and wet rock that you have already decided not to book. The result understates porosity and overstates saturation for the rock you actually intend to produce, and it is inconsistent with the net thickness sitting next to it in the same table. The rule is simple: the averages describe the same samples the net thickness counts. If the number of samples in your average is not $N_{pay}$, something is wrong.

The same discipline applies downstream. Volumetric calculations multiply net thickness by pay-average porosity and pay-average hydrocarbon saturation $(1 - \bar{S_w})$. Mixing a gross-interval porosity with a net thickness double-counts the filtering in one factor and ignores it in the other.

## A worked table

Five consecutive samples from an invented zone, sampled every 0.5 m, against the typewell cutoffs ($\phi \geq 0.08$, $V_{sh} \leq 0.5$, $S_w \leq 0.6$):

| Depth (m) | $\phi$ | $V_{sh}$ | $S_w$ | Pay? |
|---|---|---|---|---|
| 2015.0 | 0.21 | 0.05 | 0.35 | yes |
| 2015.5 | 0.19 | 0.10 | 0.42 | yes |
| 2016.0 | 0.06 | 0.15 | 0.55 | no (fails $\phi$) |
| 2016.5 | 0.18 | 0.60 | 0.50 | no (fails $V_{sh}$) |
| 2017.0 | 0.20 | 0.08 | 0.72 | no (fails $S_w$) |

Working through it:

- $N_{pay} = 2$, so $h_{net} = 2 \times 0.5 = 1.0$ m.
- Over these five samples, gross is $5 \times 0.5 = 2.5$ m, so $NTG = 1.0 / 2.5 = 0.40$.
- Pay-average porosity: $\bar{\phi} = (0.21 + 0.19)/2 = 0.20$.
- Pay-average saturation: $\bar{S_w} = (0.35 + 0.42)/2 = 0.385$.

Note what the wrong recipe would have given: averaging porosity over all five samples yields $(0.21+0.19+0.06+0.18+0.20)/5 = 0.168$, noticeably poorer than the 0.20 that describes the bookable rock. Neither number is a lie, but only one of them belongs next to $h_{net} = 1.0$ m in a summary table.

Also note that each failed sample failed for exactly one reason in this example, one per test. Real rock is messier: a wet shale fails two or three tests at once. The bookkeeping does not care. Fail one, fail all; the sample is simply not pay.

## Reading a summary line

A finished zone summary looks like one row of a table:

| Zone | Top (m) | Base (m) | $h_{gross}$ | $h_{net}$ | NTG | $\bar{\phi}$ | $\bar{S_w}$ |
|---|---|---|---|---|---|---|---|
| SAND_X | 2015.0 | 2017.0 | 2.5 | 1.0 | 0.40 | 0.20 | 0.385 |

Every number in the row is tied to the same cutoffs and the same sample set. That internal consistency is what makes the row usable by the next discipline down the line, and it is what the next lesson checks against the full typewell.

## Exercise

A 10 m zone sampled at 0.5 m contains 21 samples, of which 15 are flagged as pay. The pay samples have porosities that sum to 3.15 and saturations that sum to 5.25.

1. Compute $h_{net}$, $NTG$, $\bar{\phi}$ and $\bar{S_w}$.
2. Your software reports $\bar{\phi} = 0.12$ for the same zone. What is the most likely explanation?

Self-check: (1) $h_{net} = 15 \times 0.5 = 7.5$ m; $NTG = 7.5/10.5 = 0.714$ (21 samples represent 10.5 m); $\bar{\phi} = 3.15/15 = 0.21$; $\bar{S_w} = 5.25/15 = 0.35$. (2) It averaged porosity over all 21 gross samples rather than the 15 pay samples, pulling the average down with non-pay rock.
