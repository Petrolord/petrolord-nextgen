# End year and mid year

A row's cash arrives at one instant, and the convention says which instant: the last day of the year, or the middle of it.

{{panel:ec-time-explorer}}

## Two conventions

The end-year convention discounts each row by the whole number of years between it and the valuation year. The mid-year convention shifts every exponent by half a year, on the argument that cash flows through the year. The engine offers both through discounting_convention, and nothing else.

The published mid_year_discounting case shows the shift on two rows. Base year 2030, a 2030 flow of minus 12500000.00 and a 2031 flow of 37500000.00, 10 percent, nominal. Under end-year the same rows give an NPV of 21590909.09 in jv_analytic_decision_kpis. Under mid-year the 2030 row discounts to minus 11918282.37, the 2031 row to 32504406.45, and the NPV is 20586124.09. The relation is exact: the mid-year NPV is the end-year NPV divided by the square root of 1.1. Every exponent moved by half, so every row, and therefore the sum, was scaled by one factor.

## AKATA under all four combinations

| basis | convention | applied rate, percent | NPV |
| --- | --- | --- | --- |
| nominal | end_year | 10.000000 | 72534830.66 |
| nominal | mid_year | 10.000000 | 69159247.46 |
| real | end_year | 6.796117 | 72534830.66 |
| real | mid_year | 6.796117 | 70188970.32 |

Row by row on the nominal basis, mid-year takes 2029 from minus 121123680.00 to minus 115486897.55, 2030 from 28860006.55 to 27516936.57, and 2035 from 17161022.43 to 16362392.88. The two conventions differ less on the real basis than on the nominal, because half a year at 6.796117 percent is a smaller division than half a year at 10 percent.

## What it does not move

The IRR is 29.2361 percent under all four combinations. The discounted payback is 3.961607 years under all four. The published mid-year case reports a DPI of 0.431818 and a discounted take of 82.2761 percent, identical to its end-year twin. A uniform scaling of every discounted row cannot move the rate at which their sum is zero, the year in which their running total crosses zero, or a ratio of two present values that were both scaled. Mid-year moves NPV and nothing that is a ratio or a crossing.

## The mistake

The natural reading of mid-year is that only the later years move by half. The engine shifts the valuation year row too. AKATA's 2029 capex, which was not discounted at all under end-year, is discounted by half a year under mid-year: minus 115486897.55 rather than minus 121123680.00. That makes the capex cheaper in present value and partly offsets the shrinking of the revenue rows, so the gap between 72534830.66 and 69159247.46 is smaller than a reader who shifted only the revenue years would compute, and a hand check that leaves the base year row whole will not reconcile.

The second mistake is to compare two projects, one run end-year and one run mid-year, and rank them by NPV. Between 72534830.66 and 69159247.46 there is no new information about AKATA, only a convention, and a comparison is valid only with the same convention on both sides.

## What the convention refuses

It refuses a third choice. There is no start-of-year convention, no quarterly timing and no separate timing for capex against revenue in the same year. It refuses to touch the undiscounted columns: total net cash flow is 141637829.18 nominal and 117362408.71 real under either convention. And it refuses to move the payback, which is 3.461632 years however the rows are timed.

## Exercise

Read the nominal NPV under end-year and under mid-year and note the direction of the change. Then read the discounted payback under both and explain, without arithmetic, why it did not move.
