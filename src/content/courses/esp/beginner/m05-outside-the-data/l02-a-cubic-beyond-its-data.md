# A cubic beyond its data

Nothing snaps. That is the whole difficulty: the answers degrade smoothly, and smooth degradation is invisible.

{{panel:pd-stage-explorer}}

## The published curve, read out past its own end

The golden vendor curve at 60 Hz on a 0.90 specific gravity fluid, published range high 3500 bbl/d.

| Rate, bbl/d | Head, ft | Efficiency | hp | In range |
| --- | --- | --- | --- | --- |
| 3000 | 24.05714286 | 0.72228571 | 0.66301667 | true |
| 3400 | 20.09714286 | 0.66820571 | 0.67853339 | true |
| 3500 | 18.98571429 | 0.64942857 | 0.67894058 | true |
| 3600 | 17.82571429 | 0.62870857 | 0.67727997 | false |
| 3800 | 15.36000000 | 0.58176000 | 0.66573153 | false |
| 4000 | 12.70000000 | 0.52800000 | 0.63840747 | false |
| 4200 | 9.84571429 | 0.46806857 | 0.58621268 | false |
| 4400 | 6.79714286 | 0.40260571 | 0.49290964 | false |
| 4600 | 3.55428571 | 0.33225143 | 0.32652128 | false |
| 4800 | 0.11714286 | 0.25764571 | 0.01448112 | false |

Read the head column down. It falls, it flattens, and no row differs in kind from the row before it. No step, no exception, no discontinuity at 3500 bbl/d. The only field that changes there is the boolean.

The efficiency column does the same thing, and the horsepower column is worse than either, because it rises to a maximum well outside the data before turning down.

## It is not the cubic's fault

A reference stage model fits a quadratic rather than a cubic, over points generated from a shape so that the fit recovers them to machine precision. It behaves identically. The 540 series 2500 bbl/d reference stage, published range high 3500 bbl/d, reads 18.59200000 ft at 3500, 15.15808000 at 3800, 11.44192000 at 4100, 7.44352000 at 4400 and 3.16288000 ft at 4700 bbl/d, the range flag turning false between 3500 and 3800.

A perfect fit extrapolates as confidently as an imperfect one. The behaviour belongs to extrapolation, not to the polynomial degree and not to the residual.

## The mistake

Expecting a numerical method to announce its own failure. Every instinct trained on software says a bad input produces an error, a warning, an obviously wrong number or a crash. A least squares fit produces none of those. It produces 15.36000000 ft, a plausible head for a stage of this size, at a rate where the vendor published nothing.

The reading at 3600 bbl/d is very nearly right. The reading at 4800 bbl/d is worthless. They arrive by the same code path, in the same format, with the same flag.

## What it refuses

The fit refuses to have a domain. Rate goes in, head comes out, at any rate, forever. The published range is metadata carried alongside the coefficients and compared against afterwards, and the comparison is reported rather than enforced.

## Exercise

Read the published curve at 3400, 3600, 4000 and 4400 bbl/d at 60 Hz and write head, efficiency and horsepower at each.

Then mark the row where the range flag turns false, and say in one sentence what changed in the other three columns at that row.
