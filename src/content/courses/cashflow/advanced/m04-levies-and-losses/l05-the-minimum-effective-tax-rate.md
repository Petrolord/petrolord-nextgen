# The minimum effective tax rate

A floor under the whole tax line of an NTA year, measured against one profit, switched off by default. PIA figures here use the Regulations (2021) price-royalty base, the engine default.

{{panel:ec-fiscal-explorer}}

## The floor, and where it applies

The Nigeria Tax Act 2025 sets a minimum effective tax rate in s.57, and the engine carries it as a project-level approximation that it labels as such: the Act tests the company on its audited profit, which a project model cannot see. The top-up applies only to years under the NTA, on its own line.

The published worked example is a 2025 year, so a PIA year: total tax 617004738.36 on a CIT assessable profit of 1058241648.19. With pia_apply_minimum_etr true, at 15 percent or at 85, nothing happens: the KPI line reads min ETR top-up not reported and NPV stays 141236909.83, because a PIA year has no floor.

Force the same year to nta_2025 and the floor can bind. At 85 percent the row grows a column, min_etr_topup, of about 271.9 million USD, and total tax becomes about 899.5 million, which is 85 percent of the assessable profit. The rule in one line: in an NTA year the top-up is the stated percentage of the CIT assessable profit less the taxes the year already pays.

## Which taxes count as paid

Only the three in the tax column of an NTA year: HCT, CIT and the development levy. Forced to nta_2025, the year pays 627587154.84 before the floor, which is 285784994.46 plus 299472494.46 plus 42329665.93 to the cent, and the royalty, the HCDT and the NDDC are outside it. Count the royalty as tax paid and the shortfall comes out smaller, a top-up the engine never charges.

## What binding does to the decision

The worked example forced to nta_2025, floor on, money in million USD:

| Minimum ETR, percent | Top-up | Total tax | Net cash flow | Take, percent | DPI |
| --- | --- | --- | --- | --- | --- |
| 15 | not reported | 627.6 | 130.7 | 86.6338 | 0.435515 |
| 85 | 271.9 | 899.5 | -141.3 | about 114.5 | -0.470879 |

The top-up is charged on a profit measured before capex, so it can exceed the cash the year generates: the 85 percent run turns a positive net cash flow into a loss, a payback in Year 0 into one beyond project life, and a take below 90 percent into one past 100.

On a ledger from 2025 into 2026 with the floor on, only the 2026 row can pay a top-up.

## The mistake

The careful mistake is applying the rate to the chargeable profit. The CIT chargeable profit on the row is 998241648.19 after the capital allowance; the floor is measured on the assessable profit of 1058241648.19 before it. 85 percent of the smaller one is a total tax the engine does not report.

The second is to look for a top-up of 0.00: the column exists only where the floor was charged.

## What the engine refuses

It refuses to apply the floor unless pia_apply_minimum_etr is true; the default is false. It refuses to apply it to a PIA year. And it refuses to cap the top-up at the year's cash, so a floor set high enough turns a profitable year into a loss.

## Exercise

State the two quantities the top-up is the difference between, and the row column each is read from. Then say why switching the floor on for the published 2025 worked example changes nothing, at any percentage.
