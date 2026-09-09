# A dollar next year

A cash flow has a size and a date, and until the date is stated the size is not a value.

{{panel:ec-time-explorer}}

## The factor

Discounting takes a flow that arrives in a later year and states what it is worth in the valuation year. At a discount rate of 10 percent a flow one year out is divided by 1.1 once, a flow two years out is divided twice, and so on. The exponent is the number of years between the row and the valuation year, which on AKATA is its base year, 2029.

The 2029 row of AKATA is minus 121123680.00 USD of net cash flow, and its discounted cash flow is minus 121123680.00. The 2030 row is 31746007.20 and discounts to 28860006.55. The 2035 row, six years out, is 30401798.05 and discounts to 17161022.43, a little over half of itself.

| year | net_cash_flow | discounted_cash_flow |
| --- | --- | --- |
| 2029 | -121123680.00 | -121123680.00 |
| 2030 | 31746007.20 | 28860006.55 |
| 2031 | 64468245.07 | 53279541.38 |
| 2032 | 53959532.44 | 40540595.37 |
| 2033 | 44874457.77 | 30649858.46 |
| 2034 | 37311468.65 | 23167486.48 |
| 2035 | 30401798.05 | 17161022.43 |

Those are the nominal basis, end-year rows at the applied rate of 10.000000 percent. Each row loses a larger share than the one before it, because it is one more division further from 2029.

## Why it matters to a field

Oil fields spend first and earn later. AKATA spends 210000000.00 of capex in 2029 and 45000000.00 in 2030, then earns for six years. The undiscounted total of the nominal column is 141637829.18 USD. The total of the discounted column is the NPV, 72534830.66 USD. Roughly half the undiscounted profit is the price of waiting for it.

The capex tells the same story on its own. The two capex years sum to 255000000.00, and their present value at the same rate is 250909090.91: the 2029 spend is undiscounted and only the 2030 spend shrinks. Spend arrives early and is barely discounted; revenue arrives late and is discounted hard.

The two-row published case shows the sum whole. jv_analytic_decision_kpis has a 2030 flow of minus 12500000.00 and a 2031 flow of 37500000.00, base year 2030. The first is not discounted; the second is divided by 1.1 once and becomes 34090909.09; the sum is the NPV of 21590909.09 USD against an undiscounted 25000000.00.

## The mistake

A careful reader who has been taught that year one is discounted once divides the base year row too. On AKATA that shrinks the largest negative row and inflates the NPV. The engine's exponent is the distance from the valuation year, and the valuation year row carries an exponent of zero. If a hand sum of the discounted column does not land on 72534830.66, the base year row is the first place to look.

## What the factor refuses

It cannot see inside a year. Every flow in a row is treated as arriving at one instant, so a January capex and a December capex in the same year are worth the same. It cannot tell you the rate, which is an input. And it cannot tell you what basis the flows are on: 10.000000 percent is the applied rate for nominal flows, and the same rows on the real basis are discounted at a different rate to the same column.

## Exercise

Read the discounted cash flow for 2031 and 2034 and confirm that both are smaller than their nominal rows. Then say why the 2029 row is not.
