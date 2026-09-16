# Fixed and variable opex

Operating cost in the quick form has two halves. Fixed opex is a flat sum every year, variable opex is a rate per barrel on that year's volume, and the ledger adds them into one opex column.

{{panel:ec-screening-explorer}}

## Two halves, one column

ISIALA carries fixed opex of 2.5 million USD a year and variable opex of 13 USD per bbl. The variable half is oil volume times 13 divided by 1e6, so it declines with the field. The fixed half does not move.

| year | oil bbl | opexFixed | opexVariable | ledger opex |
| --- | --- | --- | --- | --- |
| 2027 | 1606000.0000 | 2.5000 | 20.8780 | 23.3780 |
| 2031 | 963110.7482 | 2.5000 | 12.5204 | 15.0204 |
| 2036 | 508264.2812 | 2.5000 | 6.6074 | 9.1074 |
| 2046 | 141552.0984 | 2.5000 | 1.8402 | 4.3402 |

Across twenty years the ledger charges totalOpex of 210.4887 million USD. In 2027 the variable half is most of the column. By 2046 the fixed 2.5000 is larger than the variable 1.8402, and it is the fixed half that decides whether a late year pays. On OKPOMA, with fixed opex of 4 million USD a year, 2046 opex of 4.5718 exceeds gross revenue of 4.4603 and the year's net cash flow is -0.5576.

## What the range tools scale

The two halves are stored as separate arrays, and the tools that vary a case touch them differently. `runSensitivityAnalysis` names four inputs.

| input | NPV at 0.7 | base NPV | NPV at 1.3 |
| --- | --- | --- | --- |
| OPEX | 85.3696 | 81.0464 | 76.7233 |
| Production | 4.1176 | 81.0464 | 156.4596 |
| Oil Price | -17.3893 | 81.0464 | 175.8952 |

The OPEX bar scales opexFixed ONLY, and opexVariable is untouched. The Production bar scales oil volume AND the variable opex those barrels carry. That is why Production is the narrower of the two revenue bars: at 0.7 the field keeps 4.1176 because part of its variable cost left with the volume, where the price bar loses the same revenue and still pays every barrel's cost, reaching -17.3893. Before the 2026-09-15 repair the Production bar scaled volume alone and printed the price bar's pair, -17.3893 and 175.8952.

`generateScenarios` moves the two halves the same way. The Low scenario multiplies production and variable opex by 0.8 and fixed opex by 1.2, and its totalOpex is 188.3910. The High scenario mirrors it and reads 232.5864, above the Base 210.4887 because High lifts more oil. Before the repair the two cases held variable opex at the base volume and read 220.4887 and 200.4887.

## The mistake

The careful mistake is to read the OPEX bar as the sensitivity to operating cost. Its swing of -8.6463 moves only 2.5 million USD a year, the small half of ISIALA's opex. The variable half, 20.8780 in the first year alone, is never flexed by that bar. A reader who concludes that ISIALA barely cares about opex has measured the wrong half.

The matching error is to read the Production bar as a pure volume effect. It carries the operating cost with it, so 4.1176 is a smaller field with a smaller opex bill, and a shortfall that leaves the cost where it was is worth less.

## What opex refuses

It refuses escalation, a cost per well and a cost that stops when production stops. Fixed opex is never sampled by the Scenario Builder's Monte Carlo, and the variable half moves only as a passenger of the reserves factor.

## Exercise

Write ISIALA's fixed, variable and ledger opex for 2027 and 2046, and say which half is larger in each year. Then explain why the Production bar reads 4.1176 at 0.7 where the Oil Price bar reads -17.3893, and what the OPEX bar's -8.6463 swing leaves out.
