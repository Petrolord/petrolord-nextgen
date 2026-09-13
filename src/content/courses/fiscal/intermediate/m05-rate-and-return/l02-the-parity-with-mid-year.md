# The parity with mid year

Two engines in one package discount the same cash flows differently, and the gap between them is not a fiscal result. It is a fixed multiplier that depends on the rate alone.

{{panel:ec-instrument-explorer}}

## One convention each

This sandbox discounts at year end: the year number is the exponent. The screening engine next door discounts mid year, at t equal to the index plus one half. On identical cash flows the mid-year figure is larger by exactly the square root of one plus the rate, and that relation is pinned by a parity gate in the engines test file rather than left as a surprise for whoever notices it.

"USA - Gulf of Mexico" on the Designer's default project, swept:

| rate percent | NPV year end | NPV mid year | ratio |
| --- | --- | --- | --- |
| 0 | 980.9313 | 980.9313 | 1.000000 |
| 5 | 598.5674 | 613.3491 | 1.024695 |
| 8 | 455.5370 | 473.4080 | 1.039230 |
| 10 | 382.0660 | 400.7142 | 1.048809 |
| 12 | 321.4390 | 340.1791 | 1.058301 |
| 15 | 248.6601 | 266.6582 | 1.072381 |
| 20 | 160.9642 | 176.3275 | 1.095445 |
| 25 | 100.4166 | 112.2692 | 1.118034 |
| 30 | 57.0224 | 65.0156 | 1.140175 |

At 0 percent the two conventions agree exactly at 980.9313 million USD and the ratio is 1.000000, because there is nothing to discount. At 10 percent the pair is 382.0660 and 400.7142, a ratio of 1.048809. At 30 percent it is 57.0224 and 65.0156, a ratio of 1.140175. The ratio column does not depend on the cash flows at all, only on the rate, which is what makes it a parity rather than a coincidence about one ledger. It also grows with the rate, from 1.024695 at 5 percent to 1.095445 at 20 and 1.118034 at 25, so the higher the rate a house uses, the more of a comparison between two engines is convention and the less of it is the field.

One published case pins the whole chain end to end. On the flat regime over the Suite test project, contractor net cash flow matches the screening engine's production sharing net cash flow row for row, and this engine's NPV of 1262.3470 million USD at 10 percent times the square root of one plus the rate reproduces that engine's mid-year figure.

## The mistake

The mistake is running a field through both engines, seeing two different present values, and reasoning about the difference as though a regime moved. Nothing moved. At 10 percent the entire gap is the factor 1.048809, and it would be the same factor on a field with no royalty, no tax and half the production. The second mistake is deciding which convention is right. Neither is; mid year is a smoothing assumption about when money arrives, year end is a conservative one, and a number quoted without its convention is not an answer.

## What it refuses

The parity holds only on identical cash flows, so it is a check on the discounting and never a check on the fiscal terms. This engine has no switch to produce the mid-year figure directly, so the mid-year column is the year-end result multiplied by the square root of one plus the rate. And neither convention carries a valuation date, so both start from the first row of a 25 row ledger.

## Exercise

Write the year-end and mid-year values at 0, 10 and 30 percent with their ratios. Then say what would happen to the ratio column if the field produced twice as much oil, and why. Finish by writing the label you would attach to 400.7142 so that nobody reads it beside 382.0660 and calls the difference a fiscal effect.
