# Payback

Payback is the year in which the cumulative cash flow crosses zero, counted from the first row of the ledger and interpolated inside the crossing year.

{{panel:ec-ledger-explorer}}

## Reading it

AKATA's cumulative is -29534809.71 USD at the end of 2031 and 19845806.34 at the end of 2032. The crossing is in 2032, the fourth row, so three whole years have passed since the first row began and the field pays back part of the way through the fourth. The engine prints payback "3.46 years" and payback_years 3.461632.

The hand-derived case: -12500000.00 after 2030, 25000000.00 after 2031, payback "1.33 years", payback_years 1.333333. One whole year, then a third of the second, because 12500000.00 of the 37500000.00 earned in 2031 is needed to fill the hole.

| case | last negative cumulative | first positive cumulative | payback | payback_years |
| --- | --- | --- | --- | --- |
| AKATA | -29534809.71 | 19845806.34 | 3.46 years | 3.461632 |
| jv_analytic_decision_kpis | -12500000.00 | 25000000.00 | 1.33 years | 1.333333 |
| multiyear_jv_real | -40339805.83 | 1742002.07 | 2.89 years | 2.889357 |
| multiyear_pia_real | -140433273.28 | 6104035.92 | 2.89 years | 2.892034 |

## Which column the fraction comes from

The whole-year part is the same whichever cumulative you read, because the nominal and real columns change sign in the same year. The fraction is not. On AKATA the nominal cumulative is -24909427.73 after 2031 and the nominal 2032 flow is 53959532.44, and that is the pair the fraction of 3.461632 comes from. Interpolating the real column instead, -29534809.71 against a 2032 real flow of 49380616.06, gives a different fraction and does not land on 3.461632. So the engine's payback walks the nominal running sum while its cumulative_cash_flow column shows the real one. Same year, different decimal. Quote the engine's payback_years and say which column it is read from.

## The two labels

When the first row is already positive the engine prints "Year 0" and payback_years 0.000000: single_year_positive, one 35000000.00 year, and every one-row published case whose only year nets positive. When the cumulative never turns positive it prints "Beyond project life" and payback_years null: zero_rates_capex_only ends at -70000000.00, jv_loss_unused_at_cessation at -50000000.00. Neither label is a number, and a spreadsheet that returns 0 for the second one is lying.

## The mistake

Counting from the wrong start. Payback is measured from the first row of the ledger, 2029 on AKATA, not from first oil, not from the last capex year and not from the trough. Measured from the 2030 tranche the same crossing reads a year shorter, and the field looks faster than the engine says. The second mistake is to stop at the whole year: 2032 is a year, 3.461632 is a payback, and two fields that cross in the same calendar year can be nearly a year apart in payback_years.

## What it refuses

Payback sees nothing after the crossing. AKATA earns 30401798.05 in 2035 and the payback does not know it; a field that stops the day after payback gets the same 3.46 years. It is undiscounted, so it treats the 2032 cash that fills the hole as the same money as the 2029 cash that dug it. It reports the first crossing only, so a cumulative that dips negative again late is not flagged. The engine also prints a discounted payback, 3.961607 years on AKATA, and that number belongs to the Professional tier.

## Exercise

Write the last negative and first positive cumulative for AKATA and name the crossing year. Then explain why the engine's 3.461632 cannot be recovered from the cumulative_cash_flow column alone, and which pair of numbers recovers it.
