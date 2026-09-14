# Low, base and high

`generateScenarios` moves four inputs together to build a Low and a High case either side of the base. On ISIALA the NPV runs from -72.1531 through 81.0464 to 237.8860 million USD, and every other metric on the two outer cases needs reading with care.

{{panel:ec-screening-explorer}}

## How the cases are built

Low multiplies price and production by 0.8 and capex and fixed opex by 1.2. High is the mirror: price and production by 1.2, capex and fixed opex by 0.8. Nothing else changes: royalty, tax, the discount rate, the decline and variable opex stay at the base.

| metric | Low | Base | High |
| --- | --- | --- | --- |
| npv | -72.1531 | 81.0464 | 237.8860 |
| irr percent | -3.5758 | 53.7148 | 0.0000 |
| payback years | 20.0000 | 3.2746 | 0.0000 |
| maxExposure | -146.2765 | -44.6035 | 27.7707 |
| totalRevenue | 553.0688 | 864.1699 | 1244.4047 |
| totalCapex | 216.0000 | 180.0000 | 144.0000 |
| totalOpex | 220.4887 | 210.4887 | 200.4887 |
| totalTax | 62.9637 | 136.0307 | 249.6393 |

## Reading the columns

Revenue compounds because two multipliers act on it at once. Low's 553.0688 carries both 0.8 on price and 0.8 on volume, and High's 1244.4047 both 1.2 factors. Capex moves by the single factor, from 180.0000 to 216.0000 and 144.0000. Opex moves least of all: 220.4887 against 210.4887, because only the fixed 2.5 a year is scaled and variable opex holds at the base volume even while Low produces less.

Tax moves most in proportion. Low pays 62.9637 and High 249.6393, because tax is charged on what is left after royalty, opex and capex, and that residual swings far harder than the revenue it comes from.

## The outer cases print misleading metrics

Low's payback of 20.0000 is the project life, which is the engine's way of saying it never pays back. Its IRR of -3.5758 is a real negative root.

High's IRR of 0.0000 and payback of 0.0000 are not bad results. High's lowest cumulative is 27.7707, positive, so no year of it is ever under water: payback is immediate, and with no sign change in the net cash flow the engine has no IRR to find and reports 0.

## The mistake

The careful mistake is to tabulate the three cases and compare them column by column. Sorted by IRR, High ranks far below Base, 0.0000 against 53.7148, and only just above Low's -3.5758. Sorted by payback, High looks instant and Low looks slow. Neither reading survives a look at the NPV row, and neither is a statement about High at all: they are the engine's fixed returns for a ledger that never goes negative. Read NPV and peak exposure first, then check whether the IRR and payback are values or flags.

The published 10 year base case gives the same shape in bigger numbers: Low -118.6479, Base 472.6082, High 1157.5514.

## What it refuses

The scenarios are fixed multipliers. They do not ask what anyone believes about price or capex, and they give no reason why 0.8 and 1.2 are the right corners. They carry no probability, so none of the three NPVs is a percentile, and no case is weighted above another.

## Exercise

Write ISIALA's Low, Base and High NPV, and the multipliers that build Low. Then explain what Low's payback of 20.0000 and High's IRR of 0.0000 each mean, and which row you would read first.
