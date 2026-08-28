# The design case

This lesson runs the forecast on the Ekene element at a design injection rate and reads the result end to end. It is the tier's reference case and the source of two of the capstone numbers.

## The inputs

| input | value | source |
|---|---|---|
| area | 208.8040473397547 acres | half the mapped oil leg |
| net thickness | 34.585155812896204 ft | NG5 net rock volume over the oil area |
| porosity | 0.2 | NG5 booking |
| $B_o$, $B_w$ | 1.21584, 1.02 | the flood ledger's frozen set |
| injection rate | 2000 rb/d | the design rate |
| $E_V$ | 0.5146907350993352 | Dykstra-Parsons coverage at first breakthrough |
| $S_{gi}$ | 0 | the reservoir never went below its bubble point |
| water oil ratio limit | 25 | economic limit |
| horizon | 30 years | |
| displacement | Ekene Corey set, 0.5 cp water against 1.8 cp oil | the SCAL course |

## The result

| output | value |
|---|---|
| mobility ratio | 1.2 |
| areal sweep at breakthrough | 0.6573574366303985 |
| water to breakthrough | 1253957.5213374475 rb |
| **breakthrough** | **639.1875 days** |
| cumulative oil at stop | 1709784.4164781766 stb |
| recovery factor of flooded oil in place | 0.5545614215589451 |
| final water oil ratio | 31.119000015950355 |
| elapsed | 2221.9375 days |
| stopped by | the water oil ratio limit |
| steps | 73 |
| flooded oil in place | 3083129.0277490774 stb |

## Reading it

Water breaks through after 639.1875 days, a little over 21 months. Before that the element produces at 2000 reservoir barrels a day of oil, by the pre-breakthrough identity.

At breakthrough the areal sweep is 0.6626589306987115, just past its breakthrough value because the step lands slightly beyond. The oil rate is 1307.6879936579292 stb/d and the water rate 402.0202252852385 stb/d, a surface water cut of 0.23513966934880953.

Note that the reservoir fractional flow at the outlet at that moment is 0.8704820124322751, far higher than the surface water cut. The difference is the formation volume factors: 87 percent of the RESERVOIR stream is water, and after shrinkage the surface stream is only 24 percent water. Reporting one when you meant the other is a mistake that survives review easily because both are legitimate numbers.

The run then continues for another 1583 days, the water cut climbing, and stops at a surface water oil ratio of 31.119000015950355.

## The overshoot

The limit was 25 and the run stopped at 31.119000015950355. The engine tests after each step, so it reports the first step at which the limit has been exceeded, not the moment it was crossed.

That is worth more than a footnote. The last step of this run takes the water oil ratio from below 25 to above 31, so the crossing itself is inside one month. That is not a coarse time step problem so much as a real feature of the forecast near its end: once the areal sweep saturates at 1, no new rock enters the flood, the oil rate collapses, and the water oil ratio goes vertical.

The practical consequence is that the economic limit is very insensitive to where you set it. Setting the limit at 10 instead of 25 gives EXACTLY the same answer: the same 2221.9375 days, the same 1709784.4164781766 stb, the same final water oil ratio. Both limits are crossed in the same step.

Setting it at 50 does move the answer, to 2952.4375 days and 1744591.1985350684 stb, a 2 percent gain in oil for a 33 percent gain in time and a final water oil ratio of 52.33279393821437.

## What the case is and is not

It is a screening forecast of one element at a design rate, on published correlations, with piston layers, no crossflow, no interference between patterns, constant injectivity, and an enforced production balance.

It is NOT a prediction of what Ekene will do, for one overwhelming reason that the next module takes up: the field is not injecting at 2000 reservoir barrels a day into this element. It is injecting at 104.68747061689818.

{{panel:wf-design-explorer}}

Switch to forecast mode and set the injection rate to 2000 with the EV toggle on. Read the breakthrough marker on the chart and the tiles against the table above.

## The misconception to avoid

"The design case shows the flood recovers 55 percent." It shows a recovery factor of 55 percent OF the flooded oil in place, which is already reduced by the vertical sweep. Of the element it is 0.2854276257199057. The previous module's lesson on which volume a recovery factor is of exists because this exact number is the one people misquote.

## Exercise

First, verify the water to breakthrough from $Q_{i,bt} \times PV \times E_{Abt}$ using $PV = 5767063.995536059$ rb, and then verify the breakthrough time from it and the injection rate.

Second, compute the cumulative oil at breakthrough from the pre-breakthrough identity, and compare it with the value the forecast reports at that step, 1041168.0645321244 stb. Explain the difference.
