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
| Production | -17.3893 | 81.0464 | 175.8952 |
| Oil Price | -17.3893 | 81.0464 | 175.8952 |

The OPEX bar scales opexFixed ONLY, and opexVariable is untouched. The Production bar scales oil volume ONLY, and variable opex does not follow the volume. That is why Production and Oil Price give identical NPVs: more barrels arrive with no extra variable cost, exactly as a higher price would.

`generateScenarios` behaves the same way. The Low scenario multiplies production by 0.8 and fixed opex by 1.2, and its totalOpex is 220.4887. The High scenario reverses both and reads 200.4887. The two sit the same distance either side of the Base 210.4887, and all of that distance is fixed opex, although Low produces less oil than High.

## The mistake

The careful mistake is to read the OPEX bar as the sensitivity to operating cost. Its swing of -8.6463 moves only 2.5 million USD a year, the small half of ISIALA's opex. The variable half, 20.8780 in the first year alone, is never flexed by that bar. A reader who concludes that ISIALA barely cares about opex has measured the wrong half.

The matching error is to trust a Production bar that equals the price bar. On a field with variable opex those two should differ, and here they do not, because the case holds variable opex as fixed millions per year once it has been built.

## What opex refuses

It refuses escalation, a cost per well, a cost that stops when production stops and any link between variable opex and a volume that has been scaled after expansion. Opex is never sampled by the Scenario Builder's Monte Carlo at all.

## Exercise

Write ISIALA's fixed, variable and ledger opex for 2027 and 2046, and say which half is larger in each year. Then explain why the Production and Oil Price bars both read -17.3893 at 0.7, and what the OPEX bar's -8.6463 swing leaves out.
