# The area under the curve

{{panel:qr-societal}}

The F-N curve and the PLL look like two different summaries of societal risk, one a picture and one a number. They are tied together by an identity: the area under the step curve equals the expected fatalities per year. This lesson shows the identity on the JISIKE off-site set and explains why the engine's validation leans on it.

## The identity

Sum the curve step by step. Each step runs from the previous corner to the next one, and its height is F at the corner that ends it. Its area is that height times the width of the step. Added over every step, the area under the curve is the sum over scenarios of f times N, which is the expected number of deaths per year.

The reason is a counting argument. A scenario with N deaths sits under the curve on every step from zero up to its own N, so it contributes its frequency across a total width of exactly N. Adding those strips over all scenarios gives the sum of f times N.

## On the JISIKE off-site set

| quantity | per year |
| --- | --- |
| area under the step curve, summed step by step, derived | 0.000336000000 |
| expected fatalities, sum of f N, the engine | 0.000336000000 |

The two agree. For this scenario set the expected fatalities per year are also the off-site PLL, since the PLL is the same sum of f times N over the same scenarios. So the F-N curve carries the PLL inside it, and the curve shows in addition how that expected value is spread across events of different size.

## The corners it is built from

| N | F(N), N or more, per year |
| --- | --- |
| 3.000000 | 0.000049700000 |
| 12.000000 | 0.000009700000 |
| 40.000000 | 0.000001700000 |
| 300.000000 | 0.000000200000 |

The first step runs from zero to 3, the second from 3 to 12, the third from 12 to 40 and the last from 40 to 300. Beyond 300 the curve is zero.

## Why the engine checks it

No published source prints a worked F-N curve, so the engine cannot compare its curve with a printed one. It checks itself instead, and the area identity is one of those checks: if a corner were missing, a frequency attached to the wrong N, or a scenario counted twice, the area would no longer match the sum of f times N. The release that reaches no one carries N of 0, so it adds nothing to either side, which is also why keeping it out of the curve changes no total. The identity is a self-consistency check. It proves that the curve and the expected value agree with each other, and it cannot prove that either agrees with the world.

## Exercise

Multiply each corner's F(N) by the width of the step it ends, using the widths above, and add the four areas. Confirm your total is the 0.000336000000 per year the engine returns as expected fatalities. Then say which single step contributes most to the area, and which scenario that step's height is dominated by.
