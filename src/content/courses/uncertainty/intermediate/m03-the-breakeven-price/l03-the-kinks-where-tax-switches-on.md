# The kinks where tax switches on

The curve of NPV against price is made of straight pieces joined at twenty kinks, one per year, each at the price where that year's taxable income crosses zero.

{{panel:ec-breakeven-explorer}}

## Where each kink sits

Tax is charged year by year and only on a positive base. A year's taxable income is its revenue after royalty less its opex and the capex expensed that year, so it crosses zero at the price

`(opex + capex expensed that year) / ((1 - royalty) x volume x efficiency) x 1e6`

For ISIALA at the stated medians, with opex of 20, royalty of 15 percent, efficiency of 0.91 and all 180 of capex expensed in year 1:

| calendar year | tax switches on at, USD/bbl |
| --- | --- |
| 2027 | 160.9994 |
| 2028 | 18.2954 |
| 2029 | 20.7902 |
| 2030 | 23.6252 |
| 2031 | 26.8469 |
| 2032 | 30.5078 |
| 2033 | 34.6679 |
| 2034 | 39.3954 |
| 2035 | 44.7675 |
| 2036 | 50.8721 |
| 2037 | 57.8093 |
| 2038 | 65.6923 |
| 2039 | 74.6504 |
| 2040 | 84.8300 |
| 2041 | 96.3977 |
| 2042 | 109.5429 |
| 2043 | 124.4805 |
| 2044 | 141.4551 |
| 2045 | 160.7445 |
| 2046 | 182.6642 |

Year 1, 2027, carries the capex, so its kink sits at 160.9994. From 2028 the numerator is opex alone, and the kinks climb with the decline, from 18.2954 to 182.6642 in 2046, because a smaller volume needs a higher price to cover the same 20 million USD.

## Reading the breakeven against the kinks

ISIALA's breakeven of 71.6277 USD/bbl sits between the 2038 kink of 65.6923 and the 2039 kink of 74.6504, the kinks of years 12 and 13. At the breakeven, years 2 to 12 pay tax, and year 1 and years 13 to 20 do not. The kinks mark cash flow too. In this case a year below its kink has revenue after royalty short of its costs, so years 13 to 20 lose money at the breakeven price, and the engine, which has no economic limit, charges every one of them.

## What the kinks do to the curve

Between two kinks each year is either taxed or not, so NPV is a straight line in price. Cross a kink and one more year hands 35 percent of its extra revenue after royalty to tax, and the line bends to a shallower slope. It never turns down and never jumps, which is why bisection passes over a kink safely. All twenty kinks sit inside the 0 to 500 bracket, the highest at 182.6642.
## What it refuses

It refuses to carry a loss forward. Year 1's capex of 180 million USD is deducted in year 1 only, and below 160.9994 USD/bbl the part with no income to shelter is simply lost. Its capex timing also differs from the quick form's 50/50 split, which would put a capex kink in each of the first two years.

## The mistake

The mistake is reading the uneven steps in an NPV table as noise, or expecting a kink near the answer to break the search. The subtler one is assuming year 1's capex deduction is worth 35 percent of 180 million USD at any price. Below 160.9994 USD/bbl part of it disappears, so an engine with a loss carry-forward would report a lower breakeven than this one.

## Exercise

Give the kinks for 2027, 2028, 2038 and 2039, and say which years pay tax at ISIALA's breakeven of 71.6277. Explain why the NPV curve bends at a kink without jumping, and why the 2027 kink is so much higher than the 2028 one. Then say which years lose money at the breakeven price and what the missing economic limit does with them.
