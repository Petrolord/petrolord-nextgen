# Two residuals, two signs

The tier now has both of its measurements. This lesson puts them together and extracts the one inference two numbers genuinely support.

## The pair

$$+9.8438720703125\ \mathrm{m} \quad \text{at Ekene-6} \qquad -5.6728515625\ \mathrm{m} \quad \text{at Ekene-7}$$

One positive, one negative. One from a five-well map, one from a six-well map. Both at interior locations, both a few hundred metres from their nearest control.

## What two same-signed residuals would have meant

Suppose both had been positive, at $+9.84$ m and $+5.67$ m. That would point at something systematic, and there is a short list of candidates.

**A datum error.** Every pick shifted by a constant would make the map read uniformly deep or shallow. It would not show up at the control, where the map honours the shifted picks exactly, but it would show up in every prediction if the tested wells were on a different datum from the rest.

**A pick bias.** If the interpreter picks TOP_SAND consistently at the top of the transition rather than at the sand, every pick carries the same offset in the same direction.

**A trend the interpolator misses.** A regional dip that the spline flattens would produce residuals of the same sign on one side of the field.

Any of those would be worth chasing, and the chase would be specific: check the datums, re-pick two wells blind, or fit a trend before gridding the residual.

## What two opposite-signed residuals mean

None of those. A systematic effect does not reverse sign between two interior locations 500 m apart.

What produces opposite signs is **local structure the control does not resolve**. At Ekene-6 the real surface culminates above what its neighbours imply, so the map read too deep. At Ekene-7 the real surface sits below what the fitted surface reached, so the map read too shallow. Both are the same phenomenon: relief at a scale shorter than the well spacing, smoothed away by an interpolator that has no evidence for it.

That is a genuine finding from a sample of two, and it is the only one.

## Why it is a useful finding

Because it changes what would improve the map.

If the residuals were systematic, the fix would be **corrective**: find the datum error, re-pick, or de-trend. Cheap, and no new data required.

Because they are local, the fix is **more control**, at a spacing shorter than the features being missed. That is expensive, and knowing it is expensive before proposing it is worth something.

It also rules out an approach that would otherwise look attractive. A constant shift applied to the map to remove an apparent bias would improve one location and worsen the other by the same amount, because the errors point in opposite directions.

## The scale of the problem, stated properly

| Quantity | Value |
| --- | --- |
| Structural relief across the six picks | 49 m |
| Larger residual | 9.84 m, 20 percent of relief |
| Smaller residual | 5.67 m, 12 percent of relief |
| Mapped closure at P-1 relative to the crest | 2.9 m |

The last row is the uncomfortable one. The prospect's mapped position relative to the crest is smaller than either measured error.

## What can and cannot be written

**Can:** two interior tests produced errors of 9.84 m and 5.67 m with opposite signs; no bias is demonstrated; errors of that order should be expected at interior locations away from control.

**Cannot:** the map has a mean error of 2.09 m; the map is accurate to about 8 m; the map is unbiased.

The middle one is the subtlest. Quoting a root mean square of 8.03 m from two values implies a distribution that has not been measured, and a reader will treat 8.03 m as an error bar. Two numbers are two numbers, and reporting them individually costs one extra line.

## Worked example

A colleague proposes shifting the map down by 2.09 m to remove the apparent bias. What happens to each residual?

The Ekene-6 residual becomes $9.84 + 2.09 = 11.93$ m and the Ekene-7 residual becomes $-5.67 + 2.09 = -3.58$ m. One gets worse by 2.09 m and the other better by the same amount, and the sum of absolute errors rises from 15.51 m to 15.51 m, unchanged.

Shifting a map to remove a mean of opposite-signed residuals moves error around without removing any. It is only worth doing when the residuals share a sign, which is the case this pair rules out.

## Exercise

State the two residuals with their signs, name the single inference the pair supports, and say what fix that inference implies as against the fix that same-signed residuals would have implied.

As a self-check: $+9.84$ m at Ekene-6 and $-5.67$ m at Ekene-7. The pair supports the inference that the errors are local rather than systematic, since no datum error, pick bias or missed regional trend reverses sign between two interior locations 500 m apart. That implies the map is limited by structure at a scale shorter than the well spacing, so it can only be improved by additional control, whereas same-signed residuals would have implied a correctable systematic cause such as a datum, a pick convention or a trend to be removed before gridding.
