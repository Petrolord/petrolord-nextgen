# The band no triangle reaches

A triangular's shape ratio can only move inside a band, and a belief whose median sits outside that band is one no triangle can honour.

{{panel:ec-breakeven-explorer}}

## The edges of the band

Push the mode to the minimum, m of 0, and the unit triangle's shape ratio is 0.381966. Push it to the maximum, m of 1, and the ratio is 0.618034. Every triangle sits between. A belief's shape ratio has to fall strictly inside that band for an exact fit, and ISIALA's three ordinary beliefs do: capex at 0.428571, opex at 0.400000, efficiency at 0.545455.

## A belief outside it

ISIALA's narrow opex belief is 16 / 17 / 26 million USD a year. Its shape ratio is 0.100000, well short of 0.381966.

| variable | stated | shape ratio | min | mode | max | m | exact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| opex, narrow belief | 16 / 17 / 26 | 0.100000 | 15.1886 | 15.1886 | 31.0000 | 0.000001 | false |

The engine clamps the ratio to the band's lower edge, fits the most left-skewed triangle there is, and says so: "the stated median sits too near the 10th percentile for any triangular to pass through all three points; the fit uses the most left-skewed triangular there is (mode at the minimum)".

The clamped triangle still passes through the stated 10th and 90th percentiles, because origin and range are solved from those two. It gives up only the median.

## The beliefs the run reports

The flag `exact` reads false, the note rides along in the run's insight, and beside them the run prints `beliefs`, the three percentiles it actually used, each marked stated or fitted. On the narrow belief they read opex 16.0000 / 19.8197 / 26.0000, fitted, and the deterministic base case and every tornado bar run at those, so the stated median of 17 is used nowhere. Before the 2026-09-15 repair the base case read the stated median whatever the fit.

## Why m reads 0.000001

The note says mode at the minimum, yet m prints as 0.000001. When m is below 0.1, the quantiles at 0.1, 0.5 and 0.9 all sit on the upper branch of the quantile function, and there the shape ratio stops changing with m. Every m in that stretch gives exactly the edge ratio, so floating point noise decides where the bisection stops, and min and mode still agree to four decimals at 15.1886.

## What it refuses

It will not reject a belief it can clamp, and it will not move the 10th or 90th percentile to rescue the median. It does refuse a belief that is not physically possible, naming the variable as it goes: "OPEX percentiles must not be negative." and "Production efficiency percentiles must lie between 0 and 100 percent."

## The mistake

The mistake is reading the run as if the belief had been honoured. A reviewer who sees opex entered as 16 / 17 / 26 assumes half of all draws cost under 17, when the fitted median the run reports is 19.8197. The other mistake is nudging the median until the flag turns true without asking whether the 90th percentile was written in a hurry.

## Exercise

Compute the shape ratio of 16 / 17 / 26, name the band edge it is clamped to, and quote the engine's note. Write the three opex beliefs the run reports and say which of them the base case uses. Then explain why the fit prints m of 0.000001 rather than 0.
