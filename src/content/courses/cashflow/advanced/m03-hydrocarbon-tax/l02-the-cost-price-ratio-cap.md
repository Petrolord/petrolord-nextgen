# The cost price ratio cap

The PIA lets a year claim only so much cost against its crude oil and condensate revenue for the hydrocarbon tax. What is refused is deferred, and what is still deferred when the field stops is lost.

{{panel:ec-fiscal-explorer}}

## The cap

cpr_cap is pia_cpr_limit_pct of the crude oil and condensate revenue, 65 percent by default (PIA Sixth Schedule para 2; NTA Sixth Schedule para 2). On the worked example 65 percent of 1460000000.00 is 949000000.00; on cpr_forfeiture 65 percent of 80000000.00 is 52000000.00; pia_cpr_carry_two_years states a limit of 30 percent, and 30 percent of 160000000.00 is 48000000.00. The claim is the year's opex plus the year's capital allowance plus anything deferred from earlier, the carried pool and the opex first. The worked example claims 182500000.00 of opex and 60000000.00 of allowance on 300000000.00 of capex: cpr_costs_claimed 242500000.00, deferred 0.00.

The cap limits the hydrocarbon tax only. Companies income tax deducts its full costs whatever the cap does, and with gas in the stream the shared costs enter the claim at the crude-plus-condensate share. AKATA in 2029 has a cap of 117260000.00, 65 percent of its 180400000.00 of oil revenue, and claims 64001892.15, which is its 24000000.00 of opex plus a fifth of the 210000000.00 capex taken at the oil share. In 2030 the cap is 100577100.00 and the claim 73427625.35, as the second year's 45000000.00 of capex starts its allowance.

## When it binds

| case and year | cpr_cap | cpr_costs_claimed | cpr_deferred_to_next | forfeited at cessation |
| --- | --- | --- | --- | --- |
| cpr_forfeiture 2025 | 52000000.00 | 52000000.00 | 8000000.00 | 8000000.00 |
| pia_cpr_carry_two_years 2025 | 48000000.00 | 48000000.00 | 22000000.00 | |
| pia_cpr_carry_two_years 2026 | 48000000.00 | 48000000.00 | 44000000.00 | |
| pia_cpr_carry_two_years 2027 | 48000000.00 | 48000000.00 | 66000000.00 | 66000000.00 |

cpr_forfeiture has 40000000.00 of opex and a 20000000.00 first-year allowance against a 52000000.00 cap; 8000000.00 defers and, with no later year, is forfeited. pia_cpr_carry_two_years adds 22000000.00 to the deferred pool in every year, because the claim is always 48000000.00 against 30000000.00 of opex plus the allowance, and the deferred amount is never a tax loss: hct_loss_carryforward reads 0.00 on every row while cpr_deferred_to_next reads 66000000.00. A cap that binds on a flat field binds forever.

## AKATA

At 65 percent the cap binds twice. In 2032 the cap is 73531102.32 and 1356394.56 defers; in 2033 the cap is 62886061.20 and the deferral grows to 14120774.92; in 2034 the cap is 54139706.27, the claim is 49828572.67 and the deferral clears. Set pia_cpr_limit_pct to 40 and the deferral starts in 2030 and grows every year to the end: HCT rises from 91654840.32 to 121989085.43, CIT stays 102166298.31, and NPV falls from 59766796.57 to 37056190.44. The cap on a declining field is a tax on the decline.

## The mistake

Reading the cap as 65 percent of the costs. It is 65 percent of the liquids revenue, and on a fat year it does nothing: the worked example swept from 30 to 100 percent keeps cpr_costs_claimed 242500000.00 and NPV 141236909.83 at every setting, because even a cap of 438000000.00 is above the claim. The second mistake is treating the deferral as a loss carried forward; a loss survives cessation as a number, the deferral does not.

## What it refuses

A deferred cost does not earn interest, does not become a loss, and does not survive cessation. The KPI block reports CPR forfeited at cessation only where something was forfeited; the worked example reads not reported.

## Exercise

Write AKATA's cpr_cap, cpr_costs_claimed and cpr_deferred_to_next for 2032 to 2034 and say why the deferral grew in 2033 and vanished in 2034.
