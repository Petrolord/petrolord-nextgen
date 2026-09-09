# Field-level tiers and working interest

The royalty tier is read on the field's barrels, and the working interest is applied to the money afterward. Scale the barrels first and you change the tier.

{{panel:ec-fiscal-explorer}}

## Three runs of one field

pia_deep_offshore_full lifts 21900000 bbl in 2025, 60000 bopd, in the 0.075000 deep offshore tier. pia_deep_offshore_wi_50 keeps the same field and sets pia_working_interest_pct 50. pia_deep_offshore_naive_30k halves the volumes in the upload instead and leaves the working interest at 100.

| case | row oil_bbl | cumulative_oil_bbl_lifetime | production_royalty | NPV | take |
| --- | --- | --- | --- | --- | --- |
| full | 21900000.00 | 21900000.00 | 131400000.00 | 890564331.93 | 42.6183 |
| wi_50 | 10950000.00 | 21900000.00 | 65700000.00 | 445282165.97 | 42.6183 |
| naive_30k | 10950000.00 | 10950000.00 | 43800000.00 | 372530915.97 | 44.8919 |

The WI 50 row carries half the barrels and half of every monetary line (gross revenue 876000000.00, royalty 86643087.46, HCDT 2550000.00, NDDC 7500000.00, capex 50000000.00), but its lifetime cumulative stays 21900000.00 and its prod_alw_eligible_bbl stays 21900000.00. The field is still a 60000 bopd field, so the royalty is still 0.075000 and half of 131400000.00 is 65700000.00. NPV halves exactly, from 890564331.93 to 445282165.97, and take does not move, because every line the ratio reads was halved together.

The naive row is a different field. At half the daily rate it is under the 50000 bopd threshold and falls into the 0.050000 tier, so the royalty is 43800000.00, and it still bears the full 100000000.00 of capex, 100000000.00 of opex, 5100000.00 of HCDT and 15000000.00 of NDDC. Its NPV is 372530915.97, below the correct share of 445282165.97, and its take is 44.8919 percent. Two errors in opposite directions, and neither cancels the other.

## AKATA at half

AKATA under the PIA at pia_working_interest_pct 50 reports NPV 21471634.00, half of 42943268.01; royalties 61196822.32, half of 122393644.64; CPR claimed 33000000.00 in 2029, half of 66000000.00; allowance 2750000.00 on 2200000.00 eligible bbl, the field's barrels. IRR 21.3196 percent and take 75.6789 percent are unchanged. Under joint venture terms the same field's take rises from 66.1723 percent at WI 100 to 79.7034 at WI 60, because the JV rows keep field-level revenue and count the partners' share as take. PIA take is invariant because the whole ledger was scaled.

## The mistake

Pre-scaling the production file to the share before upload. The engine cannot recover the field from a share, so it reads the tier, the volume cap and the lifetime cumulative on the wrong barrels, and it charges the full costs against them.

## What it refuses

There is no field-level readout of a scaled run. The row's oil_bbl is the entitlement, and only cumulative_oil_bbl_lifetime and prod_alw_eligible_bbl remember the field. And the engine cannot tell a pre-scaled upload from a small field: the naive row reports working_interest_pct not reported, exactly as the full run does.

## Exercise

Write the production royalty rate implied by each of the three runs and say which one the engine got wrong, and why it was the upload rather than the engine.
