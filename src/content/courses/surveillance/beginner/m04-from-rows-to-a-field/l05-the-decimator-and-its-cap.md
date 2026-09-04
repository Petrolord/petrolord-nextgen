# The decimator and its cap

`decimate` takes a series and a `maxPoints` and thins the series so a chart can draw it. The argument names a maximum and the function does not enforce one.

{{panel:pd-ledger-explorer}}

## One integer stride, computed once

The stride is `Math.ceil(n / maxPoints)`, an integer, applied from index zero, with the last point always kept. The published case in `surveillance_cases.json` is n = 3200 at `maxPoints` = 1500: the stride comes out at 3, the output is 1068 points, the first indices kept are 0, 3, 6, 9 and 12, and the last index kept is 3199.

1068 is not 1500. Nothing rescales the stride afterwards to fill the budget, so the returned count lands wherever the integer rounding puts it.

## Where the rounding puts it

Derived sweep, `maxPoints` held at 1500 throughout:

| n | Stride | Points out | Out over maxPoints |
| --- | --- | --- | --- |
| 1500 | 1 | 1500 | 1.000000000 |
| 1501 | 2 | 751 | 0.500666667 |
| 1600 | 2 | 801 | 0.534000000 |
| 2000 | 2 | 1001 | 0.667333333 |
| 2999 | 2 | 1500 | 1.000000000 |
| 3000 | 2 | 1501 | 1.000666667 |
| 3001 | 3 | 1001 | 0.667333333 |
| 3200 | 3 | 1068 | 0.712000000 |

Two rows in that column are the whole finding. Asking for at most 1500 points off a 1501-point series returns 751, half the budget, because one extra point pushes the stride from 1 to 2. Off a 3000-point series it returns 1501, which is one more than the maximum the argument names, and the always-keep-the-last rule is what puts it over.

## What it does to a reading

Decimation drops points, and a dropped point is a day. A peak that fell on an index the stride skipped is not in the output, and no member of the returned array says a point was removed or how many. The series that comes back is a valid series of real points and it is not the series that went in.

## The mistake

Sizing a plot budget or a download from `maxPoints` and treating the returned length as known. On these eight sweep rows the returned length ranges from 751 to 1501 for the same argument of 1500, and only the input length decides which.

## What it refuses

Nothing. `decimate` raises no diagnostic, has no threshold and reports no loss. The cap is a hint to an integer division, and the integer division is the only rule in the function.

## Exercise

Take the published 3200-point case in the panel and write down the stride, the output length and the last index kept.

Then say why a 1501-point series returns 751 points while a 2999-point series returns 1500, and which of the two used the larger stride.
