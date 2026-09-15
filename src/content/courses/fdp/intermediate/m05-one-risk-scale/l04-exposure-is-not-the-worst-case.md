# Exposure is not the worst case

Risk exposure is an expected monetary value: each risk's cost impact multiplied by a probability factor, summed across the register. EGINA's register returns 269.0000 million USD, and no single thing in the plan is expected to cost that.

{{panel:ec-schedule-explorer}}

## The factors the engine uses

| probability | factor |
| --- | --- |
| 1 | 0.05 |
| 2 | 0.20 |
| 3 | 0.40 |
| 4 | 0.60 |
| 5 | 0.85 |

Those five factors are the entire likelihood model. A probability of 4 is priced at a factor of 0.60 and a probability of 5 at 0.85, so even the top of the scale is not treated as certain. The factors are not the step numbers rescaled by any simple rule, and they are the only place in the register where a rank becomes a likelihood.

## Working one row by hand

Subsea tie-in slips carries a probability of 4 and a cost impact of 180.0000 million USD. A probability of 4 keys a factor of 0.600000, so the contribution is 0.600000 times 180.0000, which is 108.0000 million USD. That is the largest single contribution to the register's exposure of 269.0000 million USD. The other three scored rows are worked the same way, each with its own factor and its own cost impact, and the four contributions are what the 269.0000 adds up from.

## The row that contributes nothing

Host government approval carries a cost impact of 400.0000 million USD, the largest figure in the register, and contributes 0.0000 to the exposure. Its probability is missing, so no factor can be keyed, so the money never enters. The single largest number in the register sits outside the single number that claims to summarise the register's money.

## Why it is not the worst case

The worst case is every risk landing in full, which on this register means the cost impacts of 180.0000, 240.0000, 300.0000, 25.0000 and 400.0000 all arriving. Exposure is a probability-weighted figure well below that, and it is also not a floor, because nothing here is a distribution. Two published registers make the point from the other side: one returns a consolidated score of 43 with an exposure of 0.0000, and another with every risk Critical, a consolidated 75 and a health of 0, returns an exposure of 2.5500. A register can be as unhealthy as the scale allows and still price at almost nothing, because exposure reads the cost impacts somebody typed and health does not read them at all.

## The mistake

The mistake is taking 269.0000 million USD to a finance meeting as a contingency. Expected value is the right basis for comparing registers and the wrong basis for funding any one risk, because no risk costs its expected value: it costs its cost impact or it costs nothing. The second mistake is reading an exposure of 0.0000 as a safe register, when it usually means the cost impact column is empty.

## Exercise

Give the five probability factors. Work the contribution of Subsea tie-in slips by hand from its factor and its cost impact, then work the other three scored rows the same way and show that they add to 269.0000 million USD. Say what Host government approval contributes and why.
