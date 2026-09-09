# CIT and the two-thirds restriction

Companies income tax is the second profit tax on the same cash, on a base that includes gas and excludes the production allowance, with a capital allowance that is capped at two thirds of the profit and never carried.

{{panel:ec-fiscal-explorer}}

## The base

cit_assessable_profit is gross revenue less royalty, HCDT, NDDC and opex. On the worked example it is 1039994854.24, 15000000.00 below the HCT base of 1054994854.24 because NDDC is deductible here and not there, and 15000000.00 is the fixed NDDC. Then the capital allowance comes off: 300000000.00 of capex over 5 years is 60000000.00 a year, so cit_chargeable_profit is 979994854.24, and CIT at pia_cit_rate_pct 30 is 293998456.27. The production allowance of 45625000.00 never enters; it is an HCT deduction only. AKATA in 2029 runs the same way: cit_assessable_profit 134762247.64 less the 42000000.00 fifth of its 210000000.00 capex gives cit_chargeable_profit 92762247.64, and CIT 27828674.29.

## Recovery years

| pia_capex_recovery_years | cpr_costs_claimed | cit_chargeable_profit | cit_tax | NPV |
| --- | --- | --- | --- | --- |
| 1 | 482500000.00 | 739994854.24 | 221998456.27 | 279185570.34 |
| 2 | 332500000.00 | 889994854.24 | 266998456.27 | 189185570.34 |
| 5 | 242500000.00 | 979994854.24 | 293998456.27 | 135185570.34 |
| 10 | 212500000.00 | 1009994854.24 | 302998456.27 | 117185570.34 |

On a one-year field the recovery years are the whole answer: at 1 the entire 300000000.00 is claimed and NPV more than doubles; at 10 a tenth is claimed and NPV falls to 117185570.34. On a field that stops before the years run out, the rest is never claimed.

## The restriction

cpr_forfeiture has cit_assessable_profit 7987389.27, and its recoverable costs are 40000000.00 of opex plus the year's fifth of 100000000.00 of capex. The full allowance would take the base below zero. The engine restricts it to two thirds of the assessable profit, so cit_chargeable_profit is 2662463.09, one third of 7987389.27, and cit_tax is 798738.93. What the restriction disallowed is not carried anywhere: cit_loss_carryforward reads 0.00, cpr_deferred_to_next reads 8000000.00 for a different reason, and the extraction's findings record that the disallowed amount has no carryforward in this engine, where the Act carries it. HCT on the same row is 2546216.78 on 8487389.27, unrestricted.

## The mistake

Reading the two thirds as a floor on tax of one third of profit in every year. It is a cap on the allowance, and it only acts in a year where the allowance is large against a thin profit; the worked example's 60000000.00 against 1039994854.24 is nowhere near it. The other is expecting the disallowed amount next year.

## What it refuses

CIT has no production allowance, no terrain and no reading; its rate is 30 in every published case. And a company that hits the restriction has lost that allowance for good in this engine.

## Exercise

Write the CIT on cpr_forfeiture from its assessable profit and say why the chargeable profit is exactly one third of it. Then find the row in which the disallowed allowance reappears.
