# Range and origin in closed form

Once the bisection has found the mode's position, the rest of the triangle follows from the 10th and 90th percentiles by plain arithmetic, with no second search.

{{panel:ec-breakeven-explorer}}

## Four lines after the bisection

With m fixed, `fitTriangularToPercentiles` computes, in order:

- `range = (p90 - p10) / (g(0.9, m) - g(0.1, m))`
- `min = p10 - range * g(0.1, m)`
- `max = min + range`
- `mode = min + m * range`

Here `p10` and `p90` are the engine's keys for the stated 10th and 90th percentiles, and `g` is the quantile function in normalised coordinates. The first line says the stated stretch from 10th to 90th percentile covers a fraction of the full range fixed by the shape alone. The second backs the minimum out of the 10th percentile. The last two are definitions.

## ISIALA's three fits

| variable | stated 10th / 50th / 90th | m | min | mode | max |
| --- | --- | --- | --- | --- | --- |
| capex | 150 / 180 / 220 | 0.331225 | 127.2260 | 168.6738 | 252.3607 |
| opex | 16 / 20 / 26 | 0.233597 | 13.3201 | 17.4160 | 30.8541 |
| efficiency | 85 / 91 / 96 | 0.599919 | 80.1459 | 92.0352 | 99.9640 |

Push the fitted capex triangle back through `triInvCDF` at 0.1, 0.5 and 0.9 and it returns 150.0000, 180.0000 and 220.0000, the stated belief to four decimals. That is what `exact` true promises.

## Which branch each check uses

The lower branch serves u up to m, the upper branch u above it. Capex has m of 0.331225, so its 0.1 check uses the lower branch and its 0.5 and 0.9 checks the upper. Opex, at 0.233597, splits the same way. Efficiency has m of 0.599919, so its 0.1 and 0.5 checks both fall on the lower branch and only 0.9 uses the upper. A hand check that pushes all three points through one formula gets at least one of them wrong.

## Why closed form matters

Only m needed a search, and the ratio it searches on never falls as m rises, so the bisection cannot settle on a wrong shape. Given the shape, exactly one origin and one range put the 10th and 90th percentiles where they were stated.

## What it refuses

The arithmetic never inspects what it produces. Nothing stops `min` falling below zero on a wide cost belief, or `max` passing 100 on an efficiency belief whose 90th percentile sits near the top. ISIALA's efficiency maximum of 99.9640 stays under 100 because of the belief, not because of any guard, and a negative capex or an efficiency above 100 percent would be sampled like any other value.

## The mistake

The careful mistake is verifying a fit by checking that the mode sits between the stated 10th and 90th percentiles with the ends outside them. Plenty of triangles pass that test and honour none of the three points. The real test is the engine's own: read the fitted triangle back at 0.1, 0.5 and 0.9 and compare. The other mistake is copying min, mode and max into a tool that takes a low and a high meant as percentiles, which quietly brings the endpoints error back.

## Exercise

Using capex's m of 0.331225, name the branch each of its three checks uses, and do the same for efficiency. Quote the values the fitted capex triangle returns at 0.1, 0.5 and 0.9. Then say which of the four lines lets a wide opex belief produce a negative minimum, and what the engine does with that minimum.
