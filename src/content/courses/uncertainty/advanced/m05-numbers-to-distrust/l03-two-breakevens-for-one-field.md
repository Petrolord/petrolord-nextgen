# Two breakevens for one field

ISIALA is worth money at 70 USD per bbl and has a breakeven price above 70. Both numbers are right. They come from two engines that build two different cases from one field, and neither can be read off the other.

{{panel:ec-risk-explorer}}

## The screening case

The quick form builds ISIALA as 4400 bopd declining 12 percent a year at 70 USD per bbl, capex of 180 million USD split into 90 in 2027 and 90 in 2028, fixed opex of 2.5 million USD a year and variable opex of 13 USD per bbl. Its NPV at 12 percent is 81.0464. Its sensitivity sweep at 0.7 of the oil price gives -17.3893, so the price that makes this case worth zero lies somewhere below 70, and the screening engine never solves for it.

## The breakeven case

The Probabilistic Breakeven Analyzer builds its own case: capex of 180 million USD placed entirely in year 1 and expensed there, opex held flat at 20 million USD a year, and a production efficiency of 0.91. Its NPV against price:

| oil price | NPV through the breakeven engine |
| --- | --- |
| 60 | -47.0648 |
| 70 | -6.5653 |
| 80 | 33.6477 |

At 70 USD per bbl this case loses 6.5653 million USD, and its breakeven to NPV 0 is 71.6277. The screening case at the same price is worth 81.0464. Capex pulled into one year, a flat opex of 20 in place of a fixed and variable pair, and an efficiency below one separate them. The capex move shows in the tax kinks: tax switches on in year 1 only above 160.9994 USD per bbl, against 18.2954 in year 2.

## Several breakevens inside one engine

Even inside the analyzer, "the breakeven" is not one number:

| quantity | USD per bbl |
| --- | --- |
| base case at the beliefs' medians | 71.6277 |
| 10th percentile of breakeven price | 62.1713 |
| median of breakeven price | 73.3297 |
| mean | 73.6242 |
| 90th percentile of breakeven price | 85.5912 |
| breakeven to NPV 100 million USD | 96.5968 |

The base case is one solve at the beliefs' medians. The median is the middle of 5000 solves at seed 20260829, and it sits above the base. The breakeven to 100 million USD answers a different target altogether.

## A third engine

EC1's Petroleum Economics Studio reports a breakeven too. It discounts at year end on its own ledger, while this engine discounts mid-year on a screening ledger with all capex in year 1. They are different quantities, and nothing converts one into the other. The mid-year ratio of 1.058301 scales an NPV on identical rows; it is no factor between two prices.

## What the analyzer refuses

It will not take the quick form's 50/50 capex split or a variable opex. It searches only between 0 and 500 USD per bbl and returns null when no price in that bracket reaches the target. The screening engine, for its part, reports no breakeven at all.

## The mistake

The careful mistake is setting 71.6277 beside 81.0464 and concluding that ISIALA is both uneconomic and valuable at 70, or trying to reconcile the two by adjusting one of them. Each answers a question about its own case. Quote a breakeven with its engine, the case that engine built, the target NPV, and whether it is the base solve or a percentile.

## Exercise

State ISIALA's screening NPV at 70 USD per bbl and the breakeven engine's NPV at the same price, and name two differences between the cases behind them. Then give the base breakeven, the median breakeven price and the breakeven to NPV 100 million USD, and say which of the three is a percentile.
