# The sinking fund

The same abandonment cost paid as contributions instead of a lump sum. It rides the opex lane, it relieves the profit taxes, and it changes what a field is worth without changing what it costs.

{{panel:ec-fiscal-explorer}}

## The contribution is opex

The published jv_sinking_fund case funds 10000000.00 over its two years at 5000000.00 a year. decom_fund_contribution reads 5000000.00 on both rows, taxable income falls from 65000000.00 to 60000000.00, tax from 32500000.00 to 30000000.00, and the 2031 row prints abandonment_cost_funded 10000000.00, the spend paid from the fund with no further outflow. Total tax is 60000000.00 against the lump sum's 65000000.00, NPV 16818181.82 against 12500000.00, IRR 133.3333 against 120.0000 percent.

Under the PIA the contribution is a deduction in both profit tax bases. pia_sinking_fund contributes 30000000.00 in 2025, a year under the PIA: the assessable profit falls from 1058241648.19 to 1028241648.19 on both bases, HCT from 285784994.46 to 276784994.46, CIT from 299472494.46 to 290472494.46, and TET, charged on the CIT assessable profit at 3 percent, from 31747249.45 to 30847249.45. NPV falls from 141236909.83 to 130136909.83 and the unit technical cost rises from 26.438356 to 28.082192 USD per boe.

## Timing on AKATA

| Funding | Contributions | Total tax | NPV | IRR, percent |
| --- | --- | --- | --- | --- |
| lump sum in 2035 | none | 148425219.46 | 38666394.86 | null |
| fund from 2029 | 8571428.57 a year | 124585925.52 | 44902775.54 | 21.9086 |
| fund from 2032 | 15000000.00 a year | 127157354.09 | 47415100.31 | 23.9820 |

Starting early relieves the most tax; starting in 2032 pays four contributions of 15000000.00 and gives the higher NPV, because the money leaves later. The early fund loses to the late one on IRR as well, 21.9086 percent against 23.9820, because money moved out of the early years hurts a rate more than a present value. The lump sum offers no rate to compare: its terminal negative leaves the engine returning null.

## The number that is the share under both modes

pia_sinking_fund_wi_50 runs the same PIA example at a 50 percent working interest. Total fund contributions read 30000000.00, and total_abandonment_cost and abandonment_cost_funded read the same 30000000.00: the fund collects what was entered. NPV is 59518454.92 and the unit technical cost 29.726027 against 28.082192 at full interest, because one bill is spread over half the barrels.

The rule behind that row: the engine grosses the fund by one over the working interest before the monetary lines are scaled, so the contribution lands at exactly the amount entered, and abandonment_cost_usd is the share under both modes. On AKATA at 50 percent the fund collects the whole 60000000.00 and reports NPV 7713047.81 with IRR 14.1861 percent, against the lump sum's 2398979.53 and null.

## The mistake

The careful mistake is to read the gap between the modes at a partial interest as an artefact of scaling. On AKATA at 50 percent the lump sum reports 2398979.53 and the fund 7713047.81, and both charge the same 60000000.00 against the same half share. The gap is timing and tax relief, 74212609.73 against 52007248.47.

## What the engine refuses

It relieves only what the profit bases carry, so a levy stated as a fixed sum, like this example's NDDC, does not move. It refuses to earn anything on the money set aside. And it reports the mode nowhere but the KPI line.

## Exercise

Order the AKATA timing table by NPV and then by IRR, and explain why the orders differ. Then say what a 50 percent partner must enter for abandonment_cost_usd under each mode, and why the answer is the same.
