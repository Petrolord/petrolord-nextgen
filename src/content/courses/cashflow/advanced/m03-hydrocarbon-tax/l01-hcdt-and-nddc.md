# HCDT and NDDC

Two levies are charged before any profit is measured, both at 3 percent, on two different opex figures, and both come out of the tax bases and the cash rather than the tax column.

{{panel:ec-fiscal-explorer}}

## HCDT reads last year's opex

The host community levy is 3 percent of the prior year's opex. The worked example carries pia_prior_year_opex_usd 170000000 and prints hcdt 5100000.00 in 2025. In a second year the engine reads the first year's opex: allowance_cap_midyear has opex 20000000.00 in 2025 and hcdt 600000.00 in 2026. AKATA under the PIA sets pia_prior_year_opex_usd 0, so 2029 reads hcdt 0.00, 2030 reads 720000.00 on 2029's 24000000.00, and 2031 reads 741600.00 on 2030's 24720000.00. The levy lags the cost by a year, and the first year of a new field pays none unless somebody supplies a prior year.

## NDDC reads this year's opex, or a fixed sum

The Niger Delta levy is 3 percent of the current year's opex: pia_onshore_new_lease has opex 30000000.00 and nddc 900000.00; AKATA has 24000000.00 and 720000.00 in 2029, 24720000.00 and 741600.00 in 2030. When pia_nddc_levy_fixed_usd is set the fixed sum replaces the percentage: the worked example carries 15000000 and prints nddc 15000000.00 on opex of 182500000.00, and the deep offshore cases print 15000000.00 on 100000000.00. So AKATA's hcdt and nddc columns read the same 720000.00 and 741600.00, one year apart.

## Where they land

Neither levy is in the tax column. The worked example's tax of 604809283.90 is HCT 284810956.27 plus CIT 293998456.27 plus TET 25999871.36, and the 5100000.00 and 15000000.00 come off the cash separately. They also reduce the bases:

| case | hcdt | hct_assessable_profit | cit_assessable_profit | HCT | NPV |
| --- | --- | --- | --- | --- | --- |
| pia_worked_example | 5100000.00 | 1054994854.24 | 1039994854.24 | 284810956.27 | 135185570.34 |
| pia_prior_year_opex_zero | 0.00 | 1060094854.24 | 1045094854.24 | 286340956.27 | 137098070.34 |

Removing the levy raises both bases by exactly 5100000.00, so HCT, CIT and TET all rise, and NPV rises by less than the levy saved. The CIT base sits 15000000.00 below the HCT base in both rows: NDDC is deducted for CIT and not for HCT, and 15000000.00 is the fixed NDDC. On AKATA, a prior year opex of 20000000 gives hcdt 600000.00 in 2029 and moves NPV from 42943268.01 to 42721818.62.

## The mistake

Charging HCDT on the current year's opex, which puts 720000.00 into AKATA's 2029 row where the engine prints 0.00, and shifts every later year's levy forward by one year. The second mistake is adding the levies into the tax column, which double counts them in the take: the KPI line reports HCDT 5100000.00 and NDDC 15000000.00 beside the total tax, not inside it.

## What it refuses

HCDT needs a prior year opex and has no way to guess one; a field with pia_prior_year_opex_usd 0 pays nothing in its first year, whatever it spends. The fixed NDDC is a flat sum in every year regardless of opex, and a 3 percent field with no opex pays none.

## Exercise

Read AKATA's hcdt and nddc columns for 2029 to 2031 and write which year's opex each figure was computed on. Then say why removing HCDT raises the HCT base by exactly the levy but raises NPV by less than it.
