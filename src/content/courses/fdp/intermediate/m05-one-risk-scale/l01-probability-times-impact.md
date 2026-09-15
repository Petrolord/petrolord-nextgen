# Probability times impact

A risk score is probability multiplied by impact, both on a scale of 1 to 5, and the product decides the band. Subsea tie-in slips carries a probability of 4 and an impact of 5, so its score is 20 and its band is Critical.

{{panel:ec-schedule-explorer}}

## The whole scale on one page

| probability | impact | score | band |
| --- | --- | --- | --- |
| 5 | 5 | 25 | Critical |
| 4 | 5 | 20 | Critical |
| 4 | 4 | 16 | High |
| 3 | 4 | 12 | High |
| 3 | 3 | 9 | Medium |
| 2 | 3 | 6 | Medium |
| 2 | 2 | 4 | Low |
| 1 | 3 | 3 | Low |
| 1 | 1 | 1 | Low |

Read the score column and the band column together. The thresholds are 20 and above for Critical, 12 and above for High, 6 and above for Medium, and everything below that is Low. The boundary values belong to the higher band: 20 is Critical and 12 is High.

## Four multiplications

The register works the same way every time. Hull yard delay is a probability of 3 and an impact of 4, so 12 and High. Reservoir underperformance is 2 and 4, so 8 and Medium. Logistics congestion is 2 and 2, so 4 and Low. Three different sources, one arithmetic, and nobody assigns a band by judgement after the fact.

## Impact is not money

Impact is a rank on a scale of 1 to 5. The cost impact is a separate column in currency, and the two do not move together. Subsea tie-in slips holds an impact of 5 against a cost impact of 180.0000 million USD, while Reservoir underperformance holds an impact of 4 against a cost impact of 300.0000 million USD. The larger money sits on the smaller impact rank, and that is allowed: impact ranks severity across schedule, cost, reputation and safety at once, and it is not a currency.

## What the scale accepts

A probability typed as text still finds its place in the scale, giving a register a consolidated score of 12 and an exposure of 4.0000. A fractional probability still multiplies into a score, giving a consolidated 10 at one Medium risk, but it matches nothing in the exposure factor table and contributes an exposure of 0.0000. A probability outside the range 1 to 5 also multiplies through, giving a consolidated 24 on a register of one Critical and one Low. The multiplication is more forgiving than the scale, so the discipline is at the keyboard.

## The mistake

The common mistake is reading probability as a percentage. A 4 is not 4 percent and not 40 percent. It is the fourth step of a five step scale, and the engine turns it into a likelihood only when it prices exposure, through a factor table that is nowhere near the step numbers.

## Exercise

Give the score and band for a probability of 4 with an impact of 4, and for a probability of 2 with an impact of 3. State the three thresholds and say which band a score of exactly 12 falls in. Then give the impact rank and the cost impact of Subsea tie-in slips and of Reservoir underperformance, and say why the ranks and the money run in opposite directions.
