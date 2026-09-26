# The allowance and its volume cap

The production allowance is a per-barrel deduction from the hydrocarbon tax base, chosen by lease status, limited by price, and for a new lease stepped down once lifetime barrels pass a cap.

{{panel:ec-fiscal-explorer}}

## Two rates and a price limit

computeProductionAllowance on its own:

| lease | bbl | price | prior cumulative | allowance | below cap bbl | after cap bbl | cap applied |
| --- | --- | --- | --- | --- | --- | --- | --- |
| converted | 1000000 | 80 | 0 | 2500000.00 | 1000000.00 | 0.00 | false |
| converted | 1000000 | 10 | 0 | 2000000.00 | 1000000.00 | 0.00 | false |
| converted | 1000000 | 12.5 | 0 | 2500000.00 | 1000000.00 | 0.00 | false |
| new shallow | 1000000 | 80 | 0 | 8000000.00 | 1000000.00 | 0.00 | false |
| new shallow | 1000000 | 30 | 0 | 6000000.00 | 1000000.00 | 0.00 | false |
| new shallow | 1000000 | 80 | 99000000 | 8000000.00 | 1000000.00 | 0.00 | false |
| new shallow | 1000000 | 80 | 99500000 | 6000000.00 | 500000.00 | 500000.00 | true |
| new shallow | 1000000 | 80 | 100000000 | 4000000.00 | 0.00 | 1000000.00 | true |

A converted lease earns 2.50 USD/bbl on every barrel. A new lease earns 8.00 USD/bbl up to the cap and 4.00 USD/bbl on every later barrel. Each rate is limited to 20 percent of the price: at 10 USD/bbl the converted allowance falls to 2000000.00, at 12.5 the two rules meet and it is 2500000.00 either way, and at 30 the new lease gets 6000000.00 rather than 8000000.00. The eligible barrels are oil and condensate together: multiyear_pia_real reads prod_alw_eligible_bbl 6400000.00 in 2025 and an allowance of 16000000.00. The cap applied flag reads false in all three price-limited rows: it reports the volume cap only.

## The volume cap

A new shallow-water lease earns the higher rate until lifetime cumulative reaches pia_new_lease_prod_alw_cap_shallow_bbl 100000000 (onshore 50000000, deep 500000000), and the lower rate after it. prod_alw_eligible_bbl counts every barrel the allowance is computed on, 1000000.00 in all three rows; the split is in the below cap and after cap columns. allowance_cap_midyear runs it across a year boundary: 2025 lifts 2000000.00 bbl from a prior 99000000, 1000000.00 below the cap and 1000000.00 after it, allowance 12000000.00, cap applied true, cumulative_oil_bbl_lifetime 101000000.00; 2026 lifts 1000000.00, all after the cap, for 4000000.00. The year that crosses the cap is split at the crossing barrel.

## Where it lands

The allowance is subtracted from the HCT base and from nothing else. On the worked example hct_assessable_profit 1058241648.19 less the 60000000.00 capital allowance less production_allowance 45625000.00 is hct_chargeable_profit 952616648.19, while cit_chargeable_profit 998241648.19 is the CIT base less the capital allowance only. AKATA converted earns 5500000.00 on 2200000.00 bbl in 2029 and 24200000.00 over its life. As a new lease with prior cumulative 0 it earns 17600000.00 in 2029 and 77440000.00 in total; from a prior 96000000 it crosses the cap in 2030 and earns 54720000.00. Those allowances do not depend on the hydrocarbon tax rate, but a new-acreage lease also needs that rate stated, 15 or 30, because the texts do not say which applies; at a stated 30 the HCT falls from 91654840.32 to 75682840.32 and 82498840.32. The 2029 row is identical in the two new-lease runs because the cap has not yet been reached; the later years earn 4.00 USD/bbl where the fresh field earns 8.00.

## The mistake

Reading the cap applied flag as the price limit. At 10 USD/bbl that reports 2500000.00 where the engine prints 2000000.00. The second is setting the allowance to zero after the cap. The third is granting the new-lease rate to a converted lease: on AKATA's life that is 77440000.00 against 24200000.00.

## What it refuses

Zero barrels earn 0.00 whatever the lease. A new deep offshore or frontier lease earns none in an NTA year. A converted lease has no volume cap at all: the flag is only ever true for a new lease.

## Exercise

Run the allowance at 99000000, 99500000 and 100000000 prior barrels and write the below cap and after cap barrels for each. Then say what the flag reports on the 10 USD/bbl converted row and what it does not.
