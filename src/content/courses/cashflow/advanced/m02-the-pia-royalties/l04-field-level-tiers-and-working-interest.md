# Field-level tiers and working interest

The royalty tranche is read on the field's barrels, and the working interest is applied to the money afterward. Scale the barrels first and you change the tranche. PIA figures here use the Regulations (2021) price-royalty base, the engine default.

{{panel:ec-fiscal-explorer}}

## Three runs of one field

pia_deep_offshore_full lifts 21900000 bbl in 2025, 60000 bopd, a weighted deep offshore rate of 0.054167: 50000 bopd at 5 percent and 10000 at 7.5 percent. pia_deep_offshore_wi_50 keeps the same field and sets pia_working_interest_pct 50. pia_deep_offshore_naive_30k halves the volumes in the upload instead and leaves the working interest at 100.

| case | row oil_bbl | cumulative_oil_bbl_lifetime | production_royalty | NPV | take |
| --- | --- | --- | --- | --- | --- |
| full | 21900000.00 | 21900000.00 | 94900000.00 | 907723685.14 | 41.5126 |
| wi_50 | 10950000.00 | 21900000.00 | 47450000.00 | 453861842.57 | 41.5126 |
| naive_30k | 10950000.00 | 10950000.00 | 43800000.00 | 369073842.57 | 45.4033 |

The WI 50 row carries half the barrels and half of every monetary line (gross revenue 876000000.00, total royalties 68395011.09, HCDT 2550000.00, NDDC 7500000.00, capex 50000000.00), but its lifetime cumulative stays 21900000.00 and its prod_alw_eligible_bbl stays 21900000.00. The field is still a 60000 bopd field, so the rate is still 0.054167 and half of 94900000.00 is 47450000.00. NPV halves exactly, from 907723685.14 to 453861842.57, and take does not move, because every line the ratio reads was halved together.

The naive row is a different field. At half the daily rate it sits under the 50000 bopd tranche boundary and pays 0.050000 on every barrel, so the royalty is 43800000.00, and it still bears the full 100000000.00 of capex, 100000000.00 of opex, 5100000.00 of HCDT and 15000000.00 of NDDC. Its NPV is 369073842.57, below the correct share of 453861842.57, and its take is 45.4033 percent. Two errors in opposite directions, and neither cancels the other.

## AKATA at half

AKATA under the PIA at pia_working_interest_pct 50 reports NPV 29883398.29, half of 59766796.57; royalties 30162435.44, half of 60324870.87; costs claimed under the cost price ratio cap 32000946.07 in 2029, half of 64001892.15; allowance 2750000.00 on the field's 2200000.00 barrels. IRR 25.8412 percent and take 70.6449 percent are unchanged. Joint venture terms behave the same way: every JV monetary line and the volumes are at the share as well, and AKATA under JV reads take 66.1723 percent at a working interest of 100, 75, 60, 40 and 25 alike. Take is invariant under both regimes for the same reason in each: the whole ledger is scaled.

## The mistake

Pre-scaling the production file to the share before upload. The engine cannot recover the field from a share, so it reads the tranche, the allowance volume cap and the lifetime cumulative on the wrong barrels, and it charges the full costs against them.

## What it refuses

There is no field-level readout of a scaled run. The row's oil_bbl is the entitlement, and only cumulative_oil_bbl_lifetime and prod_alw_eligible_bbl remember the field. The daily rate the tranches read, royalty_liquids_bopd, stays 60000 on the WI 50 run and reads 30000 on the naive one. And the engine cannot tell a pre-scaled upload from a small field: the naive row reports working_interest_pct not reported, exactly as the full run does.

## Exercise

Write the production royalty rate implied by each of the three runs and say which one the engine priced on the wrong barrels, and why it was the upload rather than the engine.
