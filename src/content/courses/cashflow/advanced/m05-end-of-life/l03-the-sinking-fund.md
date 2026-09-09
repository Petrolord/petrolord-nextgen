# The sinking fund

The same abandonment cost paid as contributions instead of a lump sum. It rides the opex lane, it relieves the profit taxes, and it scales with the working interest when the lump sum does not.

{{panel:ec-fiscal-explorer}}

## The contribution is opex

The published jv_sinking_fund case funds 10000000.00 over its two years at 5000000.00 a year. decom_fund_contribution reads 5000000.00 on both rows, taxable income falls from 65000000.00 to 60000000.00, tax from 32500000.00 to 30000000.00, and the 2031 row prints abandonment_cost_funded 10000000.00, the spend paid from the fund with no further outflow. Total tax is 60000000.00 against the lump sum's 65000000.00, NPV 16818181.82 against 12500000.00, IRR 133.3333 against 120.0000 percent.

Under the PIA the contribution relieves the two profit taxes at their rates and nothing else. pia_sinking_fund contributes 30000000.00 in its single year: HCT falls from 284810956.27 to 275810956.27, CIT from 293998456.27 to 284998456.27, and TET stays 25999871.36. NPV falls from 135185570.34 to 123185570.34 and the unit technical cost rises from 26.438356 to 28.082192 USD per boe.

## Timing on AKATA

| Funding | Contributions | Total tax | NPV | IRR, percent |
| --- | --- | --- | --- | --- |
| lump sum in 2035 | none | 148425219.46 | 38666394.86 | 23.2570 |
| fund from 2029 | 8571428.57 a year | 124585925.52 | 44902775.54 | 21.9086 |
| fund from 2032 | 15000000.00 a year | 127157354.09 | 47415100.31 | 23.9820 |

Starting early spreads the cost thin, seven contributions of 8571428.57, and relieves the most tax; starting in 2032 pays four of 15000000.00 and gives the higher NPV, because the money leaves later. Both beat the lump sum on NPV. The early fund loses to it on IRR, 21.9086 percent against 23.2570, because money moved out of the early years hurts a rate more than a present value. NPV and IRR disagree, and neither is wrong.

## The number that scales

pia_sinking_fund_wi_50 runs the same PIA example at a 50 percent working interest. Total fund contributions read 15000000.00 while total_abandonment_cost and abandonment_cost_funded still read 30000000.00. The contribution was halved with the other monetary lines; the cost it funds was not. NPV is 61592785.17 and the unit technical cost 29.726027 against 28.082192 at full interest.

Set that beside the lump sum. On AKATA at 50 percent the fund's IRR is 21.9086 percent, the same as at 100 percent, while the lump sum's falls from 23.2570 to 12.7634. The fund moved with the share; the lump sum did not. Under one mode abandonment_cost_usd is a share-level number and under the other a field-level one, and the engine does not say which.

## The mistake

The careful mistake is to switch funding modes at a partial working interest and read the result as timing. On AKATA at 50 percent the lump sum reports NPV 2398979.53 and the fund 22451387.77. Most of that gap is 60000000 charged against a half share on one side and a half-scaled fund on the other.

## What the engine refuses

It refuses to relieve the levies with the contribution: TET is 25999871.36 with or without the fund. It refuses to reconcile contributions with the cost: 15000000.00 collected, 30000000.00 reported. And it refuses to flag the inconsistency between the modes, so the reader has to know that one is the share and the other the field.

## Exercise

Order the AKATA timing table by NPV and then by IRR, and explain why the orders differ. Then say what a 50 percent partner must do to abandonment_cost_usd before switching from a lump sum to a fund, and why.
