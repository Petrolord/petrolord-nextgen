# Capex over two years

The quick form takes one capex figure and spends half of it in each of the first two years. Those two years also produce oil, so development cost and first revenue share the same rows.

{{panel:ec-screening-explorer}}

## The split

ISIALA's capex of 180 million USD becomes 90.0000 in 2027 and 90.0000 in 2028, and 0.0000 in every year after. OKPOMA's 260 becomes 130.0000 and 130.0000. There is no development year: oil flows in 2027 at 1606000.0000 bbl while the first half of the capex is spent.

| year | grossRevenue | capex | tax | ncf | cumulativeNCF |
| --- | --- | --- | --- | --- | --- |
| 2027 | 112.4200 | 90.0000 | 0.0000 | -17.8210 | -17.8210 |
| 2028 | 98.9296 | 90.0000 | 0.0000 | -26.7825 | -44.6035 |
| 2029 | 87.0580 | 0.0000 | 19.3660 | 35.9654 | -8.6381 |

The cumulative bottoms out at -44.6035 in 2028, which is the engine's maxExposure. Revenue from the first two years has already paid for most of the 180 by then. Tax is zero in both capex years because each 90.0000 is expensed in the year it is spent.

## A case with a development year

The published 10 year base case is built year by year instead of through the quick form. Its 2027 row carries capex of 400.0000 against grossRevenue of 0.0000, a net cash flow of -400.0000, and then 200.0000 more in 2028. Its maxExposure is -400.0000. The quick form cannot express that shape.

## The mistake

The careful mistake is to trust a payback on a split. OKPOMA earns enough in 2027 to cover the first 130.0000, so its cumulative after year 1 is 9.2498. The second 130.0000 in 2028 takes the cumulative to -2.2287. The engine reads payback where the cumulative is first non-negative, at index 0, and reports a payback of 0.0000 years. That payback is never revisited, although the project was under water after its second year.

The second mistake is to compare breakevens across engines as if capex were timed the same way. The Probabilistic Breakeven Analyzer places all capex in year 1 and expenses it there. Its year 1 tax kink, the price at which that year's taxable income crosses zero, is 160.9994 USD per bbl because the whole capex sits in one year. The quick form never builds a year like that.

## What the split refuses

It refuses any schedule except 50/50 over the first two years. There is no pre-production period, no phasing over three years, no later infill well and no abandonment spend at the end of the life. When the Low scenario raises ISIALA's capex to a total of 216.0000, or the High scenario lowers it to 144.0000, the new figure is split the same way.

## Exercise

Write ISIALA's capex, net cash flow and cumulative for 2027 and 2028, and state the maxExposure the engine reports. Then explain, using OKPOMA's cumulatives of 9.2498 and -2.2287, why a payback of 0.0000 years does not mean the project never had money at risk.
