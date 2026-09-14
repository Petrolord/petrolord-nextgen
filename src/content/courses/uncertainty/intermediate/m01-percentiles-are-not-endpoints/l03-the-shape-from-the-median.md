# The shape from the median

Where the median sits between the 10th and 90th percentiles fixes the shape of the fitted triangle, before the engine knows anything about its size.

{{panel:ec-breakeven-explorer}}

## One ratio per belief

The engine reduces each belief to its shape ratio, (50th - 10th) / (90th - 10th): how far along the stated range the median sits. The fit turns that ratio into m, the mode's position inside the fitted range.

| variable | stated 10th / 50th / 90th | shape ratio | m | min | mode | max |
| --- | --- | --- | --- | --- | --- | --- |
| capex | 150 / 180 / 220 | 0.428571 | 0.331225 | 127.2260 | 168.6738 | 252.3607 |
| opex | 16 / 20 / 26 | 0.400000 | 0.233597 | 13.3201 | 17.4160 | 30.8541 |
| efficiency | 85 / 91 / 96 | 0.545455 | 0.599919 | 80.1459 | 92.0352 | 99.9640 |

A ratio of 0.5 would put the median halfway and give a symmetric triangle. Capex at 0.428571 and opex at 0.400000 sit short of halfway, with the median close to the 10th percentile. That is a long right tail, and the fit answers it with a mode low in the range, m of 0.331225 for capex and 0.233597 for opex. Efficiency at 0.545455 sits past halfway, so its long tail runs toward low efficiency, and its mode sits at 0.599919 of the range: 92.0352, above the stated median of 91.

## Why the ratio is enough

Write the triangle in normalised coordinates, where m runs from 0 to 1. Its quantile function is

- `g(u, m) = sqrt(u * m)` for u up to m
- `g(u, m) = 1 - sqrt((1 - u) * (1 - m))` for u above m

and any real triangle is `min + range * g(u, m)`. Subtract two quantiles and the origin cancels. Divide two such differences and the range cancels too. So the ratio built from g at 0.1, 0.5 and 0.9 depends on m alone and never falls as m rises, and the engine bisects on m until it equals the stated ratio. Shape first, size afterwards.

## Mode, median and the stated number

On a skewed belief these are three different numbers. Capex has a mode of 168.6738 and a median of 180: the single most likely cost is cheaper than the middle cost, because the tail of overruns pulls the median up. Opex shows it harder, a mode of 17.4160 against a median of 20. The median is what the engineer stated. The mode is what the fit had to choose to honour it.

## What it refuses

The shape comes from one ratio, so two beliefs with the same ratio get the same shape even when the engineer knows one has a fatter tail. The fit takes no fourth percentile, no expected value and no physical bound, and it never second-guesses a median that was written as a rough midpoint.

## The mistake

Two mistakes recur. The first is entering a triangle's mode where the stated median belongs, reading 168.6738 as capex's 180. The second is judging skew by eye from the stated numbers. Capex's belief looks only mildly lopsided, yet its fitted maximum of 252.3607 sits much further past 220 than its fitted minimum of 127.2260 sits short of 150.

## Exercise

Compute the shape ratio of ISIALA's opex belief from 16, 20 and 26 and check it against the engine's 0.400000. Say whether its long tail runs toward high or low opex and what that does to the mode. Then explain, from the quantile function, why multiplying every number in a belief by the same factor leaves m unchanged.
