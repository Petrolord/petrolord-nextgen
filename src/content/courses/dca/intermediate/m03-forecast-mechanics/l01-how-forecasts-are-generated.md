# How forecasts are generated

At the Associate tier you booked wells with closed forms, on paper. In production software the number almost always arrives from a forecast table instead, and the two do not agree to the last digit. Every convention argument you will ever have about a booking is settled by what the forecast loop actually does, so this module opens it and reads it line by line.

## The loop

`generateForecast` takes three things: the fitted parameters (`qi`, `Di`, `b`, `modelType`), a config (`forecastDurationDays`, `economicLimit`, `stopAtLimit`) and a start date. Then it runs one loop:

1. `day` starts at 1 and runs to the total days requested.
2. The rate for that day is evaluated from the model. The exponential branch is taken when `modelType` is Exponential **or** `b` is exactly 0; the harmonic branch when `modelType` is Harmonic **or** `b` is exactly 1; the hyperbolic branch otherwise. The `b` test wins over the label, so a row labelled Hyperbolic carrying `b = 0` is forecast exponentially, which is the correct behaviour and worth knowing before you debug a mismatch.
3. If `stopAtLimit` is on and the day's rate is strictly below the economic limit, the loop records `timeToLimit = day` and breaks.
4. Otherwise the day's rate is added to a running cumulative and a row is pushed.
5. The return carries `rates` (one row per produced day), `eur` (that running cumulative) and `timeToLimit` (the breaking day, or the total days requested if no break happened).

Five consequences follow, and all five show up in real bookings.

**The table starts at day 1.** There is no day-zero row, so `qi` itself never appears in the output. Ekene-1's first forecast row is not 120 stb/d, it is $120 e^{-0.0012 \times 1} = 119.856086365450$ stb/d.

**Every row is a one-day rectangle read at the end of the day.** The `eur` field is literally a sum of daily rates, each standing for a full day of production at the rate the model reaches when that day is over.

**The breaking day is reported but never produced.** The order of operations matters: check the limit, then accumulate. Forecast Ekene-1 at `qi` 120, `Di` 0.0012 per day, limit 10 stb/d with stop-at-limit on, and the engine returns `timeToLimit` 2071 with 2070 rows in the rates array. The last accumulated day is 2070, at 10.0090706091916 stb/d, still above the limit. Day 2071's rate of 9.99706692810967 stb/d is computed, trips the break, and is thrown away.

**`timeToLimit` is a whole number.** It is the first whole day on which the model rate is strictly below the limit. Ekene-1's exact crossing is at 2070.75554149000 days, three quarters of the way through the day that follows day 2070, and the loop has no way to say so. It reports 2071.

**`timeToLimit` is not always a limit crossing.** If the horizon is reached without a break, the field returns the horizon. A 3650-day run with `stopAtLimit` off comes back with `timeToLimit` 3650, a number that looks like an answer and is only a setting. The tell is the array length: when a break really happened, the rates array is shorter than the horizon.

## Worked example: reproduce the stop by hand

Take the three days around the break and run the exponential by hand. The chain is always the same: form $D_i t$, exponentiate the negative, multiply by $q_i$.

| day | $D_i t$ | $e^{-D_i t}$ | $q$ (stb/d) |
|---|---|---|---|
| 2069 | 2.48280000000000 | 0.0835090725278080 | 10.0210887033370 |
| 2070 | 2.48400000000000 | 0.0834089217432634 | 10.0090706091916 |
| 2071 | 2.48520000000000 | 0.0833088910675806 | 9.99706692810967 |

Day 2070 clears the 10 stb/d limit by nine thousandths of a barrel a day and is produced. Day 2071 misses it by three thousandths and is not. Stop and run day 2070 on a calculator now: 0.0012 times 2070, negate, exponentiate, multiply by 120. Landing on 10.009 tells you that you can reproduce the engine's decision rather than take it on trust, and that is the whole point of reading the loop.

Notice how thin the margin is. The forecast's reported life turns on a rate difference smaller than a rounding error in any field measurement. This is arithmetic about a model, not a statement about when the well will actually quit.

## What the loop costs

Summing those 2070 rows gives 91604.1233600709 stb. The closed form for the same fit and the same limit gives 91666.6666666667 stb. The gap is not a bug and not noise. It is the direct consequence of the five points above, and the next lesson takes it apart into its two separate causes and shows you how to predict each one before running anything.

## Exercise

Ekene-3 carries $q_i = 150$ stb/d, $D_i = 0.002$ per day and $b = 0.5$, and its closed-form crossing of the 10 stb/d limit is at 2872.98334620742 days. Predict the integer `timeToLimit` the engine will report and the number of rows the rates array will hold. Check your reasoning against the model rates $q(2872) = 10.0050799125743$ stb/d and $q(2873) = 9.99991400073959$ stb/d, and note how narrowly day 2873 falls below the limit.

Then answer two questions in one sentence each. If you ran the same well with `forecastDurationDays` set to 2000 and `stopAtLimit` on, what would `timeToLimit` come back as, and how would you know from the returned object alone that it was not a limit crossing? And if a colleague reports "the engine says Ekene-1 dies on day 2071", what have they stated that the closed form would state differently?
