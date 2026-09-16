# Low, base and high

`generateScenarios` moves five inputs together to build a Low and a High case either side of the base. On ISIALA the NPV runs from -57.8151 through 81.0464 to 226.0140 million USD, and every other metric on the two outer cases needs reading with care.

{{panel:ec-screening-explorer}}

## How the cases are built

Low multiplies price, production and the variable opex those barrels carry by 0.8, and capex and fixed opex by 1.2. High is the mirror: price, production and variable opex by 1.2, capex and fixed opex by 0.8. Nothing else changes: royalty, tax, the discount rate and the decline stay at the base.

| metric | Low | Base | High |
| --- | --- | --- | --- |
| npv | -57.8151 | 81.0464 | 226.0140 |
| irr percent | -0.6992 | 53.7148 | null |
| irrStatus | ok | ok | no-sign-change |
| payback years | null | 3.2746 | 0.0000 |
| paybackStatus | not-recovered | ok | no-investment |
| maxExposure | -138.4263 | -44.6035 | 25.0565 |
| totalRevenue | 553.0688 | 864.1699 | 1244.4047 |
| totalCapex | 216.0000 | 180.0000 | 144.0000 |
| totalOpex | 188.3910 | 210.4887 | 232.5864 |
| totalTax | 71.4503 | 136.0307 | 238.4051 |

## Reading the columns

Revenue compounds because two multipliers act on it at once. Low's 553.0688 carries both 0.8 on price and 0.8 on volume, and High's 1244.4047 both 1.2 factors. Capex moves by the single factor, from 180.0000 to 216.0000 and 144.0000. Opex moves with the field: Low spends 188.3910 because a smaller volume carries less variable opex even while the fixed half rises, and High spends 232.5864 for the opposite reason. Before the 2026-09-15 repair the variable half stayed at the base volume, and the two cases read 220.4887 and 200.4887, with the smaller field the more expensive one.

Tax moves most in proportion. Low pays 71.4503 and High 238.4051, because tax is charged on what is left after royalty, opex and capex, and that residual swings far harder than the revenue it comes from.

## The outer cases print statuses

Low's payback is null with paybackStatus not-recovered: its cumulative never turns non-negative inside twenty years. Its IRR of -0.6992 percent carries irrStatus ok, a real negative root.

High's payback of 0.0000 carries paybackStatus no-investment, because its lowest cumulative is 25.0565 and no year of it is ever under water. Its IRR is null with irrStatus no-sign-change, because a net cash flow that never changes sign has no rate to find. Before the 2026-09-15 repair those three read 20.0000, 0.0000 and 0.0000, three plain numbers for three different situations.

## The mistake

The careful mistake is to tabulate the three cases and compare them column by column. Sorted by IRR, High has no entry at all while Low's -0.6992 sits far below Base's 53.7148, which ranks the best case last. Sorted by payback, High looks instant and Low looks impossible. Neither reading survives a look at the NPV row, and neither is a statement about High at all: they are what the engine reports for a ledger that never goes negative. Read NPV and peak exposure first, then read the status beside each of the other two.

The published 10 year base case gives the same shape in bigger numbers: Low -92.9792, Base 472.6082, High 1134.5427.

## What it refuses

The scenarios are fixed multipliers. They do not ask what anyone believes about price or capex, and they give no reason why 0.8 and 1.2 are the right corners. They carry no probability, so none of the three NPVs is a percentile, and no case is weighted above another.

## Exercise

Write ISIALA's Low, Base and High NPV, and the multipliers that build Low. Then say what Low's payback and High's IRR each report, with the status beside each, and which row you would read first.
