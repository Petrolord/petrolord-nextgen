# The cost price ratio cap

The PIA lets a year claim only so much cost against its revenue. What is refused is deferred, and what is still deferred when the field stops is lost.

{{panel:ec-fiscal-explorer}}

## The cap

cpr_cap is pia_cpr_limit_pct of gross revenue: 65 percent of 1460000000.00 is 949000000.00 on the worked example, 65 percent of 80000000.00 is 52000000.00 on cpr_forfeiture, 30 percent of 160000000.00 is 48000000.00 on pia_cpr_carry_two_years. The claim is opex plus the year's capital allowance (capex over pia_capex_recovery_years) plus anything deferred from earlier, claimed opex first. The worked example claims 182500000.00 of opex and 60000000.00 of allowance on 300000000.00 of capex over 5 years: cpr_costs_claimed 242500000.00, deferred 0.00. AKATA in 2029 has a cap of 120920800.00 on 186032000.00 of gross revenue and claims 66000000.00, its 24000000.00 of opex plus a fifth of the 210000000.00 capex; in 2030 the cap is 103717068.00 and the claim 75720000.00, because the second year's 45000000.00 of capex has started its own five-year recovery.

## When it binds

| case and year | cpr_cap | cpr_costs_claimed | cpr_deferred_to_next | forfeited at cessation |
| --- | --- | --- | --- | --- |
| cpr_forfeiture 2025 | 52000000.00 | 52000000.00 | 8000000.00 | 8000000.00 |
| pia_cpr_carry_two_years 2025 | 48000000.00 | 48000000.00 | 22000000.00 | |
| pia_cpr_carry_two_years 2026 | 48000000.00 | 48000000.00 | 44000000.00 | |
| pia_cpr_carry_two_years 2027 | 48000000.00 | 48000000.00 | 66000000.00 | 66000000.00 |

cpr_forfeiture has 40000000.00 of opex and 100000000.00 of capex over 5 years against a 52000000.00 cap; 8000000.00 defers and, with no later year, is forfeited. pia_cpr_carry_two_years adds 22000000.00 to the deferred pool in every year, because the claim is always 48000000.00 against 30000000.00 of opex plus the allowance, and the deferred amount is never a tax loss: hct_loss_carryforward reads 0.00 on every row while cpr_deferred_to_next reads 66000000.00. A cap that binds on a flat field binds forever, and the pool it builds grows by the same step every year.

## AKATA

At 65 percent the cap binds twice. In 2032 the cap is 75826707.47 against opex 26225448.00 and 51000000.00 of allowance, and 1398740.53 defers; in 2033 the cap is 64849333.35 and the deferral grows to 14561618.62; in 2034 the cap is 55829921.49, the claim is 51384196.40 and the deferral clears. Set pia_cpr_limit_pct to 40 and HCT rises from 77020493.72 to 107354738.83, CIT from 86274711.53 to 117121931.63, and NPV falls from 42943268.01 to -1723561.25. The cap on a declining field is a tax on the decline.

## The mistake

Reading the cap as 65 percent of the costs. It is 65 percent of the revenue, and on a fat year it does nothing: the worked example swept from 30 to 100 percent keeps cpr_costs_claimed 242500000.00 and NPV 135185570.34 at every setting, because even a cap of 438000000.00 is above the claim. The cap only exists where costs approach revenue, which is exactly where a reader stops expecting a fiscal surprise. The second mistake is treating the deferral as a loss carried forward; a loss survives cessation as a number, the deferral does not.

## What it refuses

A deferred cost does not earn interest, does not become a loss, and does not survive cessation. The KPI block reports CPR forfeited at cessation only where something was forfeited; the worked example reads not reported.

## Exercise

Write AKATA's cpr_cap, cpr_costs_claimed and cpr_deferred_to_next for 2032 to 2034 and say why the deferral grew in 2033 and vanished in 2034.
