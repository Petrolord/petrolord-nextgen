# HCDT and NDDC

Two levies are charged before any profit is measured, both at 3 percent, on two different cost figures, and both come out of the tax bases and the cash rather than the tax column.

{{panel:ec-fiscal-explorer}}

## HCDT reads last year's opex

The host community levy is 3 percent of the prior year's opex (PIA s.240(2)). The worked example carries pia_prior_year_opex_usd 170000000 and prints hcdt 5100000.00 in 2025. AKATA under the PIA sets pia_prior_year_opex_usd 0, so 2029 reads hcdt 0.00, 2030 reads 720000.00 on 2029's 24000000.00, and 2031 reads 741600.00 on 2030's 24720000.00. The levy lags the cost by a year, and the first year of a new field pays none unless somebody supplies a prior year.

## NDDC reads this year's whole budget, or a fixed sum

The Niger Delta levy is 3 percent of the year's total annual budget, opex plus capex. pia_onshore_new_lease has opex 30000000.00 and capex 50000000.00, and its nddc reads 2400000.00. AKATA reads 7020000.00 in 2029, on 24000000.00 of opex and 210000000.00 of capex; 2091600.00 in 2030, on 24720000.00 and 45000000.00; and 763848.00 in 2031, when capex has stopped. The opex base is a stated option, never the default: set it on AKATA and the 2029 levy falls to 720000.00. When pia_nddc_levy_fixed_usd is set the fixed sum replaces the percentage: the worked example carries 15000000 and prints nddc 15000000.00 on opex of 182500000.00. So AKATA's two columns share nothing: HCDT follows last year's opex and NDDC this year's spend.

## Where they land

Neither levy is in the tax column. The worked example's total tax of 617004738.36 is made of HCT 285784994.46, CIT 299472494.46 and TET 31747249.45, the TET at the 3 percent a 2025 year carries, and the 5100000.00 and 15000000.00 come off the cash separately. Both levies also reduce both bases, because the hydrocarbon tax deducts them as well as companies income tax (PIA s.263(1)(f), (h)):

| case | hcdt | hct_assessable_profit | cit_assessable_profit | HCT | NPV |
| --- | --- | --- | --- | --- | --- |
| pia_worked_example | 5100000.00 | 1058241648.19 | 1058241648.19 | 285784994.46 | 141236909.83 |
| pia_prior_year_opex_zero | 0.00 | 1063341648.19 | 1063341648.19 | 287314994.46 | 143123909.83 |

Removing the levy raises both bases by exactly 5100000.00, so HCT, CIT and TET all rise, and NPV rises by less than the levy saved. The two bases agree because this field sells only oil; with gas in the stream, shared deductions enter the hydrocarbon tax at the crude-plus-condensate share. On AKATA, a prior year opex of 20000000 gives hcdt 600000.00 in 2029 and moves NPV from 59766796.57 to 59545347.19.

## The mistake

Charging HCDT on the current year's opex, which puts 720000.00 into AKATA's 2029 row where the engine prints 0.00, and shifts every later year's levy forward by one year. The second mistake is charging NDDC on opex alone, which reads 720000.00 where the engine prints 7020000.00. The third is adding the levies into the tax column, which double counts them in the take: the KPI line reports HCDT 5100000.00 and NDDC 15000000.00 beside the total tax and outside it.

## What it refuses

HCDT needs a prior year opex and has no way to guess one; a field with pia_prior_year_opex_usd 0 pays nothing in its first year, whatever it spends. The fixed NDDC is a flat sum in every year regardless of spend.

## Exercise

Read AKATA's hcdt and nddc columns for 2029 to 2031 and write which year's costs each figure was computed on. Then say why removing HCDT raises the HCT base by exactly the levy but raises NPV by less than it.
