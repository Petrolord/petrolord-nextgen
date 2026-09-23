# Far out values and the outer fences

{{panel:dq-outliers-explorer}}

Tukey drew two sets of fences. The inner fences sit 1.5 IQR outside the quartiles. The outer fences sit 3 IQR outside them, and a value beyond an outer fence is what Tukey called far out. The engine builds both from one function: `iqrFences` takes k as an input, 1.5 by default, and a caller who wants the outer fences passes 3.

EKENE-7's water sand gamma ray, entries 130 to 199, R7 quartiles:

| setting, stated | Q1 | Q3 | IQR | lower fence | upper fence | entries flagged |
| --- | --- | --- | --- | --- | --- | --- |
| R7, k 1.5 (the defaults) | 31.947500 | 38.642500 | 6.695000 | 21.905000 | 48.685000 | 170 |
| R7, k 3 | 31.947500 | 38.642500 | 6.695000 | 11.862500 | 58.727500 | 170 |

## Reading the table

The quartiles and the IQR are the same in both rows, because k does not touch them. Only the fences move. At k 3 the upper fence rises from 48.685000 to 58.727500 gAPI and the lower falls from 21.905000 to 11.862500. The planted spike at entry 170, 90.590000 gAPI, is beyond both upper fences. It is far out.

## Two grades of flag

The two settings together sort a flag into two grades. A value between an inner and an outer fence stands apart from the middle half of the data. A value beyond an outer fence stands very far apart. On the water sand there is nothing in the first grade: the one entry flagged at 1.5 is also flagged at 3.

Grading helps when a long log throws up many inner fence flags: the far out values put the largest departures first. Neither grade says the data are wrong. Both are flags from a stated rule.

## Why k is an input

The engine exports 1.5 as `TUKEY_K`, the inner fence multiplier, and uses it when k is left unset. A caller may pass any k above zero. A k of zero or less has no meaning for a fence, and the engine refuses it by name:

> k must be a finite number above zero

The refusal names the field `k`.

Keeping k an input lets the caller state the grade of flag being asked for. A report can then say "Tukey fences, R7 quartiles, k 3" and every reader knows exactly which boundary was used. Any other k is allowed and has to be stated just as plainly.

## Choosing between them

For a first screen of a sand interval the inner fences are the usual choice; for a long, noisy log the outer fences pick out the few samples that most need attention. Either way k only moves the line, and the line has to be written down.

## Exercise

Open the explorer's fences view with the water sand gamma ray at R7. Run it at k 1.5, then at k 3, and confirm the fences in the table and the single flag at entry 170 both times. Then compute by hand Q1 - 3 IQR from the table's quartiles and check it against the lower fence of 11.862500. Finally, type a k of 0 and read the engine's refusal.
