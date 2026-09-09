# DPI and the index it is not

DPI is NPV over the present value of capex. It is not the profitability index, and it is not NPV over the capex as spent.

{{panel:ec-time-explorer}}

## The definition

The engine's discounted profitability index divides the NPV by the present value of the capex, both at the applied rate. On AKATA the PV of capex is 250909090.91: the 210000000.00 of 2029 undiscounted plus the 45000000.00 of 2030 after one year. NPV 72534830.66 over 250909090.91 is 0.289088. For every unit of capital, in present value, AKATA returns 0.289088 units of value beyond the discount rate.

| case | NPV | PV of capex | DPI |
| --- | --- | --- | --- |
| AKATA | 72534830.66 | 250909090.91 | 0.289088 |
| jv_analytic_decision_kpis | 21590909.09 | 50000000.00 | 0.431818 |
| multiyear_jv_real | 88104639.00 | 147272727.27 | 0.598241 |
| multiyear_pia_real | 203250580.21 | 510181818.18 | 0.398389 |
| zero_rates_capex_only | -69090909.09 | 50000000.00 | -1.381818 |
| jv_loss_unused_at_cessation | -50000000.00 | 50000000.00 | -1.000000 |
| single_year_positive | 35000000.00 | 0.00 | null |

## What it is for

NPV ranks by value; DPI ranks by value per unit of capital. multiyear_pia_real has the largest NPV in the table, 203250580.21, and a DPI of 0.398389; multiyear_jv_real has less than half that NPV, 88104639.00, and a higher DPI of 0.598241. If capital is the constraint, the second field does more with it. If capital is not the constraint, NPV is the ranking and DPI is only a description.

A DPI of exactly minus 1.000000 says the field lost precisely its capex in present value and nothing else, which is jv_loss_unused_at_cessation: NPV minus 50000000.00 against a PV of capex of 50000000.00. A DPI past minus one, like zero_rates_capex_only at minus 1.381818, says it lost more than its capital; the excess is opex spent with no revenue against it.

## The index it is not

The textbook profitability index divides the present value of the inflows by the present value of the outflows, and a project that exactly earns its rate scores one. The engine's DPI is on the NPV side of that: the same project scores zero. Adding one to the DPI does not recover the textbook index either, because the textbook denominator holds every outflow and this one holds only capex; AKATA's opex of 183899092.34 sits inside the NPV here and would sit in the denominator there. The engine prints no profitability index, and a DPI should never be relabelled as one.

DPI is also not NPV over capex as spent. 72534830.66 over 255000000.00 is a smaller ratio than 0.289088, and the difference is that the 2030 spend is discounted. The denominator uses the same rate and the same convention as the numerator.

## The mistake

The careful mistake is to compare DPIs computed at different rates or on different bases. The denominator moves with the rate as well as the numerator, and a DPI carries the whole convention sentence that its NPV does. Under mid-year both numerator and denominator scale by the same factor, which is why the mid_year_discounting case reports 0.431818, the same DPI as its end-year twin, while the NPVs differ at 20586124.09 and 21590909.09.

## What DPI refuses

It refuses to exist without capex: single_year_positive has a PV of capex of 0.00 and a DPI of null, and valuation_year_sunk, whose only capex year was declared sunk, reports null too. It refuses to rank by size, which is NPV's job, and it refuses to say anything about timing, which is payback's.

## Exercise

Read NPV and the PV of capex for AKATA and confirm their ratio is the reported DPI. Then say why the PV of capex is smaller than the total capex.
