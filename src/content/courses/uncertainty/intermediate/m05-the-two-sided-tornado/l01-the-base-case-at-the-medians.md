# The base case at the medians

A tornado measures every bar from one price: the breakeven with each input at its stated median. On ISIALA that price is 71.6277 USD per bbl, and the whole chart is a picture of distances from it.

{{panel:ec-breakeven-explorer}}

## The case the bars start from

ISIALA's beliefs are capex 150 / 180 / 220 million USD, opex 16 / 20 / 26 million USD a year and efficiency 85 / 91 / 96 percent, each a 10th percentile, a median and a 90th percentile. The base case takes the middle number of each, capex 180, opex 20 and efficiency 0.91, and bisection to an NPV of zero gives 71.6277.

| oil price | NPV through the breakeven engine |
| --- | --- |
| 60 | -47.0648 |
| 70 | -6.5653 |
| 80 | 33.6477 |

## The stated medians and the fitted modes

The fitted triangles have modes of 168.6738 for capex, 17.4160 for opex and 92.0352 for efficiency. None of them enters the base case. The engine uses the numbers you stated, and a base case built from the modes solves a different project.

The base case is not the median of the sample either. The 5000 iteration run at seed 20260829 has a median of 73.3297, because the capex and opex triangles reach further up than down. The tornado ignores that number. Every low side and high side is a distance from 71.6277.

## The screening case is another case

ISIALA also exists as a quick screening case, and there it earns an NPV of 81.0464 million USD at an oil price of 70 USD per bbl, where the breakeven engine reads -6.5653. Both are right, because they are different cases. The quick form splits capex 50/50 over the first two years and charges fixed opex of 2.5 million USD a year plus variable opex of 13 USD per bbl. The Breakeven Analyzer puts all capex in year 1, expensed there, holds opex flat at 20 million USD a year, and scales production by efficiency.

So 71.6277 says nothing about the price at which the screening NPV of 81.0464 falls to zero.

## What the base case refuses

It holds every other input at its median while one moves, so no bar ever sees two inputs away from their medians at once, and it knows nothing about correlation. And it is one solve, unchanged at any seed, which makes it a steady anchor.

## The mistake

The careful mistake is reading a tornado bar's end as a breakeven price. The capex bar's high side reads 9.4067, a distance from 71.6277. Quoting 9.4067 as a price, or measuring it from the sample median of 73.3297, mixes two anchors. The second is wondering why a field worth 81.0464 million USD at 70 USD per bbl needs more than 70 to break even.

## Exercise

Write ISIALA's three stated medians and the base breakeven they give, and the NPV through the breakeven engine at 70 and 80 USD per bbl. Then name two differences between the Breakeven Analyzer's case and the quick screening case that explain why the screening NPV at 70 USD per bbl is positive.
