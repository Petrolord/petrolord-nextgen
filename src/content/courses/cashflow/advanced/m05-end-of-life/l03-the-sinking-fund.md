# The sinking fund

The same abandonment cost paid as contributions instead of a lump sum. It rides the opex lane, it relieves the profit taxes, and it changes what a field is worth without changing what it costs.

{{panel:ec-fiscal-explorer}}

## The contribution is opex

The published jv_sinking_fund case funds 10000000.00 over its two years at 5000000.00 a year. decom_fund_contribution reads 5000000.00 on both rows, taxable income falls from 65000000.00 to 60000000.00, tax from 32500000.00 to 30000000.00, and the 2031 row prints abandonment_cost_funded 10000000.00, the spend paid from the fund with no further outflow. Total tax is 60000000.00 against the lump sum's 65000000.00, NPV 16818181.82 against 12500000.00, IRR 133.3333 against 120.0000 percent.

Under the PIA the contribution relieves the two profit taxes at their rates and nothing else. pia_sinking_fund contributes 30000000.00 in its single year: HCT falls from 284810956.27 to 275810956.27, CIT from 293998456.27 to 284998456.27, and TET stays 25999871.36. NPV falls from 135185570.34 to 123185570.34 and the unit technical cost rises from 26.438356 to 28.082192 USD per boe.

## Timing on AKATA

| Funding | Contributions | Total tax | NPV | IRR, percent |
| --- | --- | --- | --- | --- |
| lump sum in 2035 | none | 148425219.46 | 38666394.86 | null |
| fund from 2029 | 8571428.57 a year | 124585925.52 | 44902775.54 | 21.9086 |
| fund from 2032 | 15000000.00 a year | 127157354.09 | 47415100.31 | 23.9820 |

Starting early spreads the cost thin and relieves the most tax; starting in 2032 pays four contributions of 15000000.00 and gives the higher NPV, because the money leaves later. The early fund loses to the late one on IRR as well, 21.9086 percent against 23.9820, because money moved out of the early years hurts a rate more than a present value. The lump sum offers no rate to compare: its terminal negative leaves the engine returning null.

## The number that is the share under both modes

pia_sinking_fund_wi_50 runs the same PIA example at a 50 percent working interest. Total fund contributions read 30000000.00, and total_abandonment_cost and abandonment_cost_funded read the same 30000000.00: the fund collects what was entered. NPV is 55592785.17 and the unit technical cost 29.726027 against 28.082192 at full interest, because one bill is spread over half the barrels.

That row read differently until engines 3.10.0. The contribution was halved with the other monetary lines while the cost it funded was not, so the fund collected 15000000.00 against a reported 30000000.00 and NPV read 61592785.17. The repair grosses the fund by one over the working interest, so abandonment_cost_usd is the share under both modes. On AKATA at 50 percent the fund now collects the whole 60000000.00 and reports NPV 7713047.81 with IRR 14.1861 percent, against the lump sum's 2398979.53 and null.

## The mistake

The careful mistake is the one the old behaviour taught: reading the gap between the modes at a partial interest as an artefact of scaling. On AKATA at 50 percent the lump sum reports 2398979.53 and the fund 7713047.81, and both charge the same 60000000.00 against the same half share. The gap is timing and tax relief, 74212609.73 against 52007248.47.

## What the engine refuses

It refuses to relieve the levies: TET is 25999871.36 with or without the fund. It refuses to earn anything on the money set aside, so a fund is a timing device and not an investment. And it reports the mode nowhere but the KPI line.

## Exercise

Order the AKATA timing table by NPV and then by IRR, and explain why the orders differ. Then say what a 50 percent partner must enter for abandonment_cost_usd under each mode, and why the answer is the same.
