# What a pot cannot do

The pot aquifer's equation contains a pressure, two compressibilities and a volume. Notice what is not on that list: no time, no rate, no permeability, no distance and no viscosity.

$$W_e = (c_w + c_f) W (p_i - p)$$

That is not a simplification you can relax later. It is the model's definition, and a pot aquifer applied outside its range does not degrade gracefully. It fails in a specific way.

## Influx is a function of pressure and of nothing else

Two fields drawn down to 2600 psia from an initial 3200 psia, with the same aquifer size, receive identical influx under this model. It makes no difference that the first took thirty years and the second eighteen months, that one is a 2000 md sand against the water leg and the other a 3 md silt, or how far away the water is. Everything an engineer knows about how water moves through rock is absent, and the absence is total rather than partial.

Three ordinary questions it is structurally incapable of answering:

- How much water will arrive next year if we keep producing at this rate?
- When will the first producer water out?
- If we cut offtake by a third, what happens to the pressure?

All three are rate questions. A model with no time in it does not have an opinion.

## What happens when you use it anyway

Take the weak drifting tank from module 1 lesson 3: oil in place 12000000 stb, influx lagging, true influx at the last survey 32578.3158427595 rb. Hand its six surveys to the engine with the pot model selected.

| quantity | pot result | truth |
|---|---|---|
| oil in place | 313862743.836425 stb | 12000000 stb |
| aquifer water in place $W$ | $-1023276881.56074$ rb | not a pot aquifer |
| influx at the last survey | $-7907824.55572858$ rb | 32578.3158427595 rb |
| R-squared | 0.957752669575039 | |
| final water drive index | $-22.7152438266875$ | |
| drive indices summed | 0.992344905135454 | |

The oil in place is 2515.52286530354 percent high, twenty six times the true tank. The aquifer water in place is negative, a volume of water that does not exist. The cumulative influx is negative, which says water flowed out of the reservoir while its pressure was falling. The water drive index is minus twenty two. And the indices still sum to 0.992, inside the engine's closure tolerance of 0.05, so no closure warning fires.

## Why it fails in that direction

The pot model insists that influx is proportional to drawdown. The lagged tank's influx is not: it accumulates with time, so late in the history it grows faster than the drawdown does. In the pot plot coordinates that shows up as curving points, and a straight line asked to chase them takes a slope belonging to neither end.

What makes the damage spectacular is where the answer is read. The oil in place is the intercept, and the horizontal coordinate of every survey is of order seventy thousand psi per rb/stb, so the intercept is an extrapolation a very long way back to $x = 0$ and every unit of slope error is multiplied by that distance on the way. A slope error too small to see on the plot arrives at the intercept as millions of stock tank barrels. Lesson 4 measures that lever arm exactly.

## The warning that does not come

You would hope the engine would stop you.

In the gas material balance path there is an explicit guard: if the pot regression returns a negative aquifer water in place, the engine warns that a $W$ below zero is physically impossible, that this often indicates no aquifer is present, and that you should consider switching the model to none.

The oil path has no such check. Its warning block tests two things: whether the final drive indices miss 1.00 by more than 0.05, and whether the R-squared is below 0.95. The run above passes both, returning a negative aquifer, a negative influx and an oil in place twenty six times too large with nothing in the warnings list.

Take the general lesson. **A quiet run is not a validated run.** Warnings cover what somebody thought to check, and a check present in one solver path is not always mirrored in another. Physical sanity is your job: a negative volume, a negative index, an influx exceeding the withdrawal, an oil in place an order of magnitude from the booking. Read those before the fit statistic.

## What the pot is genuinely for

None of this argues for never using it, only for using it as what it is. The pot aquifer costs one parameter, needs no dates and runs on any history you have, and it answers a screening question well: does an aquifer term want to be here at all, and if so, roughly what size of water body is implied? On a tank whose ratio column is flat but whose level does not reconcile, the signature module 1 lesson 2 identified, the pot model is the right first move and its answer will be about right.

What it must never do is carry a booking on a field whose ratio column drifts, or appear in a forecast.

## Worked example

A field's ratio column reads 9.8, 10.6, 11.7, 13.0 and 14.6 million stb across five surveys, against a volumetric booking of 9 million stb at a $B_{oi}$ of 1.2 rb/stb. An engineer runs a pot aquifer on it and reports an oil in place of 42 million stb, an aquifer water in place of 380 million rb and an R-squared of 0.981.

The column spans 49 percent and its increments grow every step, which is a lagging aquifer, the one condition under which the pot model has no chance. So the review can be written without recomputing anything: the model choice is wrong, and the reported oil in place is not an estimate of oil in place.

Then apply the sanity checks the engine did not. The reported oil in place is 2.87671232876712 times the largest entry in the ratio column, and that is impossible: every entry in that column is the true oil in place plus a positive contamination, so the column bounds the truth from above. A reported oil in place above the whole column is self contradictory before you look at anything else.

The implied aquifer is 380000000 rb against 10800000 reservoir barrels of booked oil, a ratio of 35.1851851851852. Large aquifers are ordinary, but thirty five times the oil volume deserves a sentence of justification. And the R-squared of 0.981 does no work at all.

The recommendation: rerun with a time dependent model, recover any missing survey dates first, and quote no oil in place until the ratio column has been explained.

## Exercise

Write down, in one sentence, the feature of the pot aquifer's equation that makes all three rate questions above unanswerable.

Then do the arithmetic behind the review. With the reported $W$ of 380000000 rb, $c_w = 0.000003$ and $c_f = 0.000004$ per psi, compute the influx per psi of drawdown, then the influx after 500 psi. Compare that against a field withdrawal of 3000000 rb over the same drawdown and state what fraction of the drive the reported model claims for water.

Then close the loop: that fraction is also recoverable from the ratio column, whose first survey sits only 8.9 percent above the 9 million stb booking. Say which of the two estimates of the water share you believe, and why.
