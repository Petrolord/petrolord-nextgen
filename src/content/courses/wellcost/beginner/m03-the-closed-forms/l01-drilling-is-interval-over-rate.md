# Drilling is interval over rate

One division, and a curve shape that decides where your schedule risk lives.

{{panel:wc-time-explorer}}

## The form

Drilling hours are the interval divided by the rate of penetration. The interval is the bottom depth minus the top depth, the rate is metres per hour, and the answer is hours.

Straight in the interval, and a hyperbola in the rate. Those two behaviours are not the same and the difference is the whole lesson.

## Straight in the interval

Hold the rate at 15 m per hour and lengthen the section:

| Interval, m | Hours |
| --- | --- |
| 250 | 16.666666666666668 |
| 500 | 33.333333333333336 |
| 1000 | 66.66666666666667 |
| 1500 | 100 |
| 2000 | 133.33333333333334 |
| 3000 | 200 |

Twice the metres, twice the hours. No surprises here, and this is the half of the formula that people estimate well.

## A hyperbola in the rate

Now hold the interval at 1,500 m and sweep the rate:

| Rate, m per hour | Hours | Days |
| --- | --- | --- |
| 5 | 300 | 12.5 |
| 8 | 187.5 | |
| 10 | 150 | 6.25 |
| 15 | 100 | |
| 20 | 75 | 3.125 |
| 25 | 60 | 2.5 |
| 30 | 50 | |
| 40 | 37.5 | |

Every row multiplies out to the same 1,500. The product of rate and hours is invariant at fixed interval, which is the definition of a hyperbola.

Read the extremes. At 5 m per hour the rate is one third of 15 and the hours are exactly three times 100. At 40 m per hour the rate has multiplied by 2.6666666666666665 and the hours have fallen to 0.375 of the baseline.

## Why the shape matters

The curve is steep on the slow side and nearly flat on the fast side. Going from 30 to 40 m per hour saves 12.5 hours. Falling from 10 to 5 m per hour costs 150 hours.

So your schedule risk is almost entirely on the downside. An optimistic rate assumption in a hard section will hurt you far more than a pessimistic one in an easy section will help.

## Exercise

In the panel, halve the production hole rate from 10 m per hour and record the new total in days.

Then double it and record that total. Confirm the two changes are not symmetric and say by how much they differ.
