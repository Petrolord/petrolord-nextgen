# End year and mid year

A row's cash arrives at one instant, the last day of the year or the middle of it. Either way the valuation date is 31 December of the valuation year.

{{panel:ec-time-explorer}}

## Two conventions

The end-year convention discounts each row by the whole years between its 31 December and the valuation date. The mid-year convention takes each year's cash to arrive half a year before its 31 December, so every exponent is half a year smaller and every row is discounted less. The engine offers both through discounting_convention.

The published mid_year_discounting case shows the shift on two rows: base year 2030, a 2030 flow of minus 12500000.00 and a 2031 flow of 37500000.00, 10 percent, nominal. End-year, the same rows give an NPV of 21590909.09 in jv_analytic_decision_kpis. Under mid-year the 2030 row becomes minus 13110110.60, the 2031 row 35754847.10, and the NPV is 22644736.49. The relation is exact: the mid-year NPV is the end-year NPV times the square root of 1.1, every row and so the sum scaled by one factor.

## AKATA under all four combinations

| basis | convention | applied rate, percent | NPV |
| --- | --- | --- | --- |
| nominal | end_year | 10.000000 | 72534830.66 |
| nominal | mid_year | 10.000000 | 76075172.20 |
| real | end_year | 6.796117 | 72534830.66 |
| real | mid_year | 6.796117 | 74959094.51 |

Row by row on the nominal basis, mid-year takes 2029 from minus 121123680.00 to minus 127035587.31, 2030 from 28860006.55 to 30268630.22, and 2035 from 17161022.43 to 17998632.17. Mid-year NPV is the larger, 1.048809 times end-year on the nominal basis and 1.033422 on the real, because half a year at 6.796117 percent is a smaller factor than half a year at 10 percent.

## What it does not move

The IRR is 29.2361 percent under all four combinations. The discounted payback is 3.961607 years under all four. The published mid-year case reports a DPI of 0.431818 and a discounted take of 82.2761 percent, identical to its end-year twin. A uniform scaling of every discounted row cannot move the rate at which their sum is zero, the year in which their running total crosses zero, or a ratio of two present values that were both scaled. Mid-year moves NPV and nothing that is a ratio or a crossing.

## The mistake

The natural reading of mid-year is that only the later years move by half. The engine moves the valuation year row too. AKATA's 2029 capex, undiscounted under end-year, is spent half a year before the valuation date under mid-year and is compounded forward: minus 127035587.31 rather than minus 121123680.00. That makes the capex dearer and partly offsets the lift of the revenue rows, so the gap between 72534830.66 and 76075172.20 is smaller than a reader who moved only the revenue years would compute; a hand check that leaves the base year row whole will not reconcile.

The second mistake is to compare two projects, one run end-year and one run mid-year, and rank them by NPV. Between 72534830.66 and 76075172.20 there is no new information about AKATA, only a convention, and a comparison is valid only with the same convention on both sides.

## What the convention refuses

It refuses a third choice. There is no start-of-year convention, no quarterly timing and no separate timing for capex against revenue in the same year. It refuses to touch the undiscounted columns: total net cash flow is 141637829.18 nominal and 117362408.71 real under either convention. And it refuses to move the payback, which is 3.461632 years however the rows are timed.

## Exercise

Read the nominal NPV under end-year and under mid-year and note the direction of the change. Then read the discounted payback under both and explain, without arithmetic, why it did not move.
