# Limit sensitivity

Lesson 1 argued that EUR is a booking rather than a property of the rock. This lesson measures the claim. Take the four Ekene producers, hold every fitted parameter fixed, and move only the economic limit: 5 stb/d, 10 stb/d, 20 stb/d. Nothing about the reservoir changes. Nothing about the decline changes. Only the rate at which somebody decides to stop paying.

Here is what the closed forms of lessons 2 and 3 return.

| Well | EUR @ 5 (stb) | EUR @ 10 (stb) | EUR @ 20 (stb) |
|---|---|---|---|
| Ekene-1 (exponential) | 95833.3333333333 | 91666.6666666667 | 83333.3333333333 |
| Ekene-3 (hyperbolic, b 0.5) | 122613.872124742 | 111270.166537926 | 95227.7442494834 |
| Ekene-5 (harmonic) | 199715.484903599 | 153505.672866270 | 107295.860828940 |
| Ekene-6 (hyperbolic, b 0.35) | 117307.074530524 | 105266.626461929 | 86373.1382895878 |

| Well | Time @ 5 (d) | Time @ 10 (d) | Time @ 20 (d) |
|---|---|---|---|
| Ekene-1 | 2648.37819195662 | 2070.75554149000 | 1493.13289102338 |
| Ekene-3 | 4477.22557505166 | 2872.98334620742 | 1738.61278752583 |
| Ekene-5 | 12666.6666666667 | 6000.00000000000 | 2666.66666666667 |
| Ekene-6 | 5000.22946009119 | 3307.62651421312 | 1979.63715882399 |

## Read the swings, not the levels

Levels invite you to compare wells. What matters here is how far each well's own booking travels as the limit moves, so express every change against that well's booking at the 10 stb/d base case.

Halving the limit from 10 to 5 stb/d adds 4.54545454545454 percent to Ekene-1, 10.1947412678217 percent to Ekene-3, 11.4380487655780 percent to Ekene-6 and 30.1029995663981 percent to Ekene-5. Doubling it from 10 to 20 stb/d takes away 9.09090909090908 percent from Ekene-1, 14.4175413658381 percent from Ekene-3, 17.9482223448802 percent from Ekene-6 and 30.1029995663981 percent from Ekene-5.

Put the two together as a full spread from the 5 stb/d booking down to the 20 stb/d booking, stated as a fraction of each well's own EUR at 10:

| Well | Spread, EUR @ 5 minus EUR @ 20 (stb) | As % of that well's EUR @ 10 |
|---|---|---|
| Ekene-5 | 92419.6240746594 | 60.2059991327962 |
| Ekene-6 | 30933.9362409359 | 29.3862711104582 |
| Ekene-3 | 27386.1278752583 | 24.6122826336598 |
| Ekene-1 | 12500.0000000000 | 13.6363636363636 |

Ekene-5 is the headline. A four-fold move in a commercial threshold, from 20 stb/d to 5 stb/d, moves its booking by more than sixty percent of the base case. Ekene-1, given the same treatment, moves by under fourteen. Two engineers who agree completely about Ekene-5's decline and disagree only about operating cost can book volumes 1.86135311614679 times apart and neither of them is wrong about the reservoir.

## Why the harmonic well swings hardest

Because its tail is the fattest, and the limit is a decision about how much of that tail you get to count.

Look at where the barrels actually sit. Between 20 stb/d and 10 stb/d, Ekene-5 delivers 46209.8120373297 stb. Between 10 stb/d and 5 stb/d it delivers 46209.8120373297 stb again, the same number to the last digit. That is the signature of a logarithm: the harmonic EUR is $(q_i/D_i)\ln(q_i/q_{limit})$, so every halving of the limit adds the same block of barrels, $(q_i/D_i)\ln 2 = 66666.6666666667 \times 0.693147180559945$. There is no ceiling coming to stop it. The well keeps handing over another forty six thousand barrels for every halving, forever, and only the limit decides how many of those blocks you book.

Now the exponential well, where a ceiling does exist. Ekene-1 can never deliver more than $q_i / D_i = 100000$ stb no matter where you set the limit, so the whole argument about the limit is an argument about the 16666.6666666667 stb that still lie below 20 stb/d, on a well that has already delivered 91.6666666666667 percent of its ceiling by the time it reaches 10 stb/d. The band from 20 down to 10 stb/d is worth 8333.33333333333 stb, and the next halving is worth only 4166.66666666667 stb. Each halving buys less than the one before. That is what a converging integral feels like from the inside.

One honest complication, and it is worth noticing rather than smoothing over. Ekene-6 swings more than Ekene-3, 29.3862711104582 percent against 24.6122826336598 percent, even though Ekene-6 carries the smaller exponent at $b = 0.35$ against 0.5. Sensitivity is not read off $b$ alone. It depends on how much of the booking sits in the low-rate band the limit is moving through, and that depends on $q_i$, $D_i$, $b$ and the limit together. Ekene-6 holds 18893.4881723416 stb between 20 and 10 stb/d, which is 17.9482223448802 percent of its base booking; Ekene-3 holds 16042.4222884424 stb in the same band, 14.4175413658381 percent of its own. Compute the sensitivity, do not infer it from the exponent.

{{panel:dca-fit-explorer}}

## Worked example: a price cut, in full

The Ekene operator's planning case assumes 10 stb/d for every producer. A budget review halves the assumed oil price, and lesson 1's arithmetic doubles the limit to 20 stb/d. Report the effect on Ekene-5.

The booking falls from 153505.672866270 stb to 107295.860828940 stb, a loss of 46209.8120373297 stb or 30.1029995663981 percent. The economic life falls from 6000.00000000000 days to 2666.66666666667 days, so the well is scheduled for abandonment 3333.33333333333 days earlier, which is 9.13242009132419 years sooner. The decline curve on the plot has not moved by one pixel, the fit is the same fit, and R2 is still 1. Every changed number in that paragraph came out of the price deck.

Stop and do the same exercise on Ekene-1 from the tables before reading on. You should be reporting a loss of 8333.33333333333 stb and 577.622650466620 days, and you should be able to say in one sentence why the same price move costs Ekene-5 5.54517744447957 times as many barrels.

## What to write down

Never publish an EUR without the limit that produced it, and when the booking matters, publish the sensitivity beside it. A line reading "EUR 153505.672866270 stb at a 10 stb/d limit; 199715.484903599 at 5 and 107295.860828940 at 20" is not clutter. It is the difference between a number a reader can audit and a number a reader must trust.

## Exercise

An asset team is comparing two candidates for the same workover budget: Ekene-1 and Ekene-5. Using the tables above, rank them by EUR at a 20 stb/d limit, then rank them again at a 5 stb/d limit, and note whether the ranking held. Now suppose the workover would not change the decline at all but would cut operating cost enough to move the limit from 10 stb/d to 5 stb/d on whichever well receives it. Compute the incremental barrels booked on each well, state which well the budget should go to on that basis alone, and then write one sentence on what this comparison deliberately ignores, remembering that valuing barrels is the Economics course's job and not this one's.
