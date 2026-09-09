# Discounted payback

Payback is the year the running total turns positive. Discounted payback asks the same question of the discounted column, and it is always later.

{{panel:ec-time-explorer}}

## Two crossings on AKATA

| year | net_cash_flow | cumulative_nominal | discounted_cash_flow |
| --- | --- | --- | --- |
| 2029 | -121123680.00 | -121123680.00 | -121123680.00 |
| 2030 | 31746007.20 | -89377672.80 | 28860006.55 |
| 2031 | 64468245.07 | -24909427.73 | 53279541.38 |
| 2032 | 53959532.44 | 29050104.71 | 40540595.37 |
| 2033 | 44874457.77 | 73924562.48 | 30649858.46 |

The undiscounted running total crosses zero during 2032: minus 24909427.73 at the end of 2031, 29050104.71 at the end of 2032. Three whole years have passed, and the crossing sits at the fraction of 2032 that the shortfall of 24909427.73 is of that year's flow of 53959532.44. The engine reports payback_years 3.461632 and the label "3.46 years".

The discounted running total starts at the same minus 121123680.00 and adds 28860006.55, then 53279541.38, and is still short at the end of 2031. The 2032 row of 40540595.37 closes it, but only near the end of the year: discounted payback 3.961607 years. Half a year later than the undiscounted crossing, on the same rows, because every row after 2029 has been reduced.

## Other fields

jv_analytic_decision_kpis pays back at 1.333333 years and discounted at 1.366667. multiyear_jv_real at 2.889357 and 3.165997. multiyear_pia_real at 2.892034 and 3.154942. The discounted figure is never earlier, and the gap between the two grows with the rate and with how much of the recovery sits in later years.

Discounted payback is unmoved by the discounting convention and by the basis. AKATA reports 3.961607 years under nominal end-year, nominal mid-year, real end-year and real mid-year alike. The mid-year shift scales every discounted row by one factor, and a crossing does not move when everything is scaled together.

## The mistake

The careful mistake is to read payback from the wrong cumulative column. AKATA's ledger prints cumulative_cash_flow, which on the real basis equals cumulative_real: minus 29534809.71 at the end of 2031 and 19845806.34 at the end of 2032. Interpolating there gives a crossing later in 2032 than 3.461632, and it will not reconcile. The payback the engine reports is read on the nominal running total, minus 24909427.73 to 29050104.71, against the nominal 2032 flow of 53959532.44. A real total, a nominal total and a discounted total each cross in a different place, and only one of them is the reported payback.

The second mistake is to treat "3.46 years" as a date. It is a duration from the start of the first row, 2029, so it lands in 2032; a reader who adds it to the valuation year of a later run gets a different calendar year for the same crossing.

## What payback refuses

Payback refuses to see anything after the crossing. AKATA's 2033, 2034 and 2035 rows, 44874457.77, 37311468.65 and 30401798.05 nominal, are invisible to it; a field with those years deleted would pay back at exactly 3.461632 years too. Discounted payback shares the blindness. Both refuse to report a number when the total never crosses: zero_rates_capex_only and jv_loss_unused_at_cessation report "Beyond project life" with payback_years null and discounted payback null, and the label does not say how far beyond. Both report "Year 0" and 0.000000 when the first row is already positive, as in single_year_positive, and also in valuation_year_sunk, where the only negative row was declared sunk and the metric never saw it.

## Exercise

Read the undiscounted and the discounted payback for AKATA and state which row closes each. Then switch the convention to mid-year and say what happens to the discounted figure.
