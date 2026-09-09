# The minimum effective tax rate

A floor under the whole tax line, measured against one profit, switched off by default. When it binds it does not add a tax; it adds whatever is missing.

{{panel:ec-fiscal-explorer}}

## The floor

The published worked example pays HCT 284810956.27, CIT 293998456.27 and TET 25999871.36 in 2025, a total tax of 604809283.90 on a CIT assessable profit of 1039994854.24, beside a royalty of 217405145.76, HCDT of 5100000.00 and NDDC of 15000000.00 that the tax column does not carry. With pia_apply_minimum_etr true at 15 percent nothing happens: the KPI line reads min ETR top-up not reported, total tax stays 604809283.90 and NPV 135185570.34, because the cascade already collects far more than the floor asks.

At 85 percent the floor binds. The row grows a column, min_etr_topup, reading 279186342.20, and total tax becomes 883995626.10, which is 85 percent of 1039994854.24. The rule in one line: the top-up is 85 percent of the CIT assessable profit less the taxes paid.

## Which taxes count as paid

Only the three in the tax column: HCT, CIT and TET. The 604809283.90 the floor is measured against is 284810956.27 plus 293998456.27 plus 25999871.36 to the cent, and the royalty of 217405145.76, the HCDT and the NDDC are outside it. Count the royalty as tax paid and the shortfall comes out smaller than 279186342.20, a top-up the engine never charges.

## What binding does to the decision

| Minimum ETR, percent | Top-up | Total tax | Net cash flow | Take, percent | DPI |
| --- | --- | --- | --- | --- | --- |
| 15 | not reported | 604809283.90 | 135185570.34 | 86.1703 | 0.450619 |
| 85 | 279186342.20 | 883995626.10 | -144000771.86 | 114.7315 | -0.480003 |

The top-up is charged on a profit measured before capex, so it can exceed the cash the year generates: the 85 percent run turns a net cash flow of 135185570.34 into -144000771.86, a payback in Year 0 into one beyond project life, and a take of 86.1703 percent into 114.7315. A take past 100 percent is not a display fault. The government collected more than the year's pre-take value.

## The mistake

The careful mistake is applying the rate to the chargeable profit. The CIT chargeable profit on the row is 979994854.24 after the two-thirds restriction; the floor is measured on the assessable profit of 1039994854.24 before it. Both sit in the row, and 85 percent of the smaller one is a total tax the engine does not report.

The second is to look for the column when the floor does not bind. There is no min_etr_topup of 0.00 on the 15 percent run; the column exists only where the floor was charged.

## What the engine refuses

It refuses to apply the floor unless pia_apply_minimum_etr is true; the default is false, and every other published PIA case in the digest runs with it off. It refuses to report a zero top-up. And it refuses to cap the top-up at the year's cash, so a floor set high enough turns a profitable year into a loss.

## Exercise

State the two quantities the top-up is the difference between, and the row column each is read from. Then say why the 15 percent floor cannot bind on any year whose CIT alone, at 30 percent of the chargeable profit, exceeds 15 percent of the assessable profit.
