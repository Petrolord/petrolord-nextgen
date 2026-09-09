# The allowance and its volume cap

The production allowance is a per-barrel deduction from the hydrocarbon tax base, chosen by lease status, capped by price, and for a new lease capped by lifetime barrels.

{{panel:ec-fiscal-explorer}}

## Two rates and a price cap

computeProductionAllowance on its own:

| lease | bbl | price | prior cumulative | allowance | eligible bbl | cap applied |
| --- | --- | --- | --- | --- | --- | --- |
| converted | 1000000 | 80 | 0 | 2500000.00 | 1000000.00 | false |
| converted | 1000000 | 10 | 0 | 2000000.00 | 1000000.00 | false |
| converted | 1000000 | 12.5 | 0 | 2500000.00 | 1000000.00 | false |
| new shallow | 1000000 | 80 | 0 | 8000000.00 | 1000000.00 | false |
| new shallow | 1000000 | 30 | 0 | 6000000.00 | 1000000.00 | false |
| new shallow | 1000000 | 80 | 99000000 | 8000000.00 | 1000000.00 | false |
| new shallow | 1000000 | 80 | 99500000 | 4000000.00 | 500000.00 | true |
| new shallow | 1000000 | 80 | 100000000 | 0.00 | 0.00 | true |

A converted lease earns pia_production_allowance_per_bbl_converted 2.5 USD/bbl; a new lease earns pia_production_allowance_per_bbl_new 8. Both are limited to pia_production_allowance_pct_of_price 20 of the price: at 10 USD/bbl the converted allowance falls to 2000000.00, at 12.5 the two rules meet and it is 2500000.00 either way, and at 30 the new lease gets 6000000.00 rather than 8000000.00. The eligible barrels are liquids, oil and condensate together: multiyear_pia_real lifts 6000000.00 bbl of oil and 400000.00 bbl of condensate in 2025, prod_alw_eligible_bbl reads 6400000.00, the allowance is 16000000.00, and the life total is 59028480.00. The cap applied flag reads false in all three price-limited rows: it reports the volume cap only.

## The volume cap

A new shallow-water lease keeps the allowance until lifetime cumulative reaches pia_new_lease_prod_alw_cap_shallow_bbl 100000000 (onshore 50000000, deep 500000000). At a prior 99000000 the whole 1000000 bbl is eligible; at 99500000 only 500000.00 bbl; at 100000000 none. allowance_cap_midyear runs it across a year boundary: 2025 lifts 2000000.00 bbl from a prior 99000000, prod_alw_eligible_bbl 1000000.00, allowance 8000000.00, cap applied true, cumulative_oil_bbl_lifetime 101000000.00; 2026 lifts 1000000.00 with eligible 0.00 and allowance 0.00. The cap is read on lifetime barrels, and the year that crosses it is split.

## Where it lands

The allowance is subtracted from the HCT base and from nothing else. On the worked example hct_assessable_profit 1054994854.24 less the 60000000.00 capital allowance less production_allowance 45625000.00 is hct_chargeable_profit 949369854.24, while cit_chargeable_profit 979994854.24 is the CIT base less the capital allowance only. AKATA converted earns 5500000.00 on 2200000.00 bbl in 2029 and 24200000.00 over its life. As a new lease with prior cumulative 0 it earns 17600000.00 in 2029 and 77440000.00 in total; HCT falls from 77020493.72 to 61048493.72 and NPV rises from 42943268.01 to 55961597.02. With prior cumulative 96000000 the cap bites inside the life: allowance 32000000.00, HCT 74680493.72, NPV 46233118.46. The 2029 row is identical in the two new-lease runs, 17600000.00 on 2200000.00 eligible bbl with the flag false, because the cap has not yet been reached; it is the later years that lose it, and only the totals show the difference.

## The mistake

Reading the cap applied flag as the price cap. A reader who sees false at 10 USD/bbl concludes no cap acted and reports 2500000.00 where the engine prints 2000000.00. The second is granting the new-lease rate to a converted lease; on AKATA's first year alone that is 17600000.00 against 5500000.00, and over the life 77440000.00 against 24200000.00.

## What it refuses

Zero barrels earn 0.00 whatever the lease. The allowance never reaches CIT, TET or the levy, and the KPI line reports it beside the taxes rather than inside them. A converted lease has no volume cap at all: the flag is only ever true for a new lease.

## Exercise

Run the allowance at 99000000, 99500000 and 100000000 prior barrels and write the eligible barrels for each. Then say what the flag reports on the 10 USD/bbl converted row and what it does not.
