# Monthly snapshot overstatement

The daily sum runs low by seven hundredths of a percent. The other sum you will be handed, the monthly snapshot, runs high by nearly two, and it runs high in a way you can state before you have seen a single row of data. The Associate tier worked the January rectangle and totalled the window. This lesson turns that arithmetic into a law, then shows the two places in a real workflow where a snapshot and an integral get added together without anybody noticing.

## The law

Take an exponential decline sampled at intervals of $\Delta t$ and held at the rate reported at the left edge of each interval. Over one interval, the rectangle divided by the exact volume is

$$\frac{q(t_0)\,\Delta t}{N_p(t_0 + \Delta t) - N_p(t_0)} = \frac{q_i e^{-D_i t_0}\,\Delta t}{\frac{q_i}{D_i}e^{-D_i t_0}\left(1 - e^{-D_i \Delta t}\right)} = \frac{D_i \Delta t}{1 - e^{-D_i \Delta t}}$$

Everything about the well cancels except the product $D_i \Delta t$. Three consequences, all of them practical:

- The overstatement does not depend on $q_i$, so it does not shrink as the well gets smaller.
- It does not depend on where in the life the interval sits. The first month and the hundredth month are wrong by the same percentage.
- It depends only on how far the rate falls within one reporting interval.

For Ekene-1's $D_i = 0.0012$ per day the law gives:

| Reporting interval | Overstatement (%) |
|---|---|
| 1 day | 0.0600120000008753 |
| 28 days | 1.68940782298368 |
| 29 days | 1.75009179630901 |
| 30 days | 1.81079976672733 |
| 31 days | 1.87153173403483 |
| 91 days (quarterly) | 5.55935225601683 |
| 365 days (annual) | 23.4936115538863 |

Ekene-1's primary window is 36 rows over 1096 days, an average interval of 30.4444444444444 days, and the law at that interval gives 1.83778878963061 percent. The measured overstatement over the actual window, 74502.9269694921 stb of snapshot against 73157.9366256283 stb of truth, is 1.83847495692304 percent. The small residual is the day-weighting of long and short months, not a new effect. Predicting a whole-window discrepancy from one line of algebra is a check worth building into your habits: it catches a mis-built cumulative before it reaches anyone else.

## Worked example: predict a single month, then check it

February 2020 is a 29-day month. The law says the snapshot rectangle will exceed the exact volume by

$$\frac{0.0012 \times 29}{1 - e^{-0.0012 \times 29}} - 1 = 1.75009179630901 \text{ percent}$$

The Associate tier computed the same month the long way, from the reported rate of 115.618010327307 stb/d and the exponential cumulative, and got 1.75009179630883 percent. Twelve digits of agreement between a formula that used no rates and an arithmetic that used nothing else.

Stop and run the 31-day case yourself. You should get 1.87153173403483 percent, and you should notice that you never needed to know which 31-day month it was.

## The direction rule, and the cheap fix

Left edge of the interval on a falling rate: the rectangle sits above the curve and the sum overstates. Right edge: the sum understates. Average the two edges, which is the trapezoid, and most of the error cancels.

The trapezoid is free when you have monthly rows, because the right edge of this month is the rate on the first of next month, which is the next row. Applied to the same 36 months of Ekene-1 it gives 73166.0847151042 stb against the exact 73157.9366256283 stb, high by 8.14808947592974 stb or 0.0111376698848531 percent. That is 165 times better than the snapshot for one extra column in a spreadsheet.

## Where this bites: the composite booking

Here is the pattern to watch for. An analyst books the history from the production database and the remaining forecast from the model. For Ekene-1 that is 74502.9269694921 stb of snapshot history to the flood start, plus the closed form's remaining 18508.7300410384 stb from day 1096 down to the 10 stb/d limit. Total: 93011.6570105305 stb, against a true 91666.6666666667 stb. The booking is over by 1344.99034386381 stb, 1.46726219330597 percent.

Every barrel of that error came in with the history. The forecast leg was exact and stayed exact. Two integration conventions were used in one number and the reader cannot see the seam, because the seam is a date, not a method note.

## Where this bites: the material balance handoff

The Ekene material balance history, which the next course on this path consumes, carries cumulative production at each pressure survey from the exact integral: 261475.039999678 stb for the field at 2023-01-01. That choice is deliberate. Material balance reads $N_p$ as measured withdrawal and infers how much energy the reservoir gave up to produce it. Hand it a cumulative that is 1.8 percent high and it does not return a slightly optimistic answer, it returns a reservoir that appears to have supported more withdrawal at the observed pressure than it did, and the inferred oil in place moves with it.

If you ever pass a snapshot-built cumulative into a material balance, say so in the same sentence. It is the difference between an assumption and a hidden bias.

## Three ways this gets excused

**"The database number is the measurement."** A monthly rate row is a rate. Many production databases also carry an allocated monthly volume, which is a different column with a different meaning and needs no multiplication at all. Check which one you are holding before you multiply anything by the days in the month.

**"It averages out over a long history."** It cannot. The law is per interval and proportional, so every month contributes its own overstatement with the same sign. Thirty six months of plus 1.8 percent is plus 1.8 percent, not zero.

**"Daily reporting fixes it."** It shrinks it in proportion to the interval, from 1.87153173403483 percent on a 31-day rectangle to 0.0600120000008753 percent on a one-day rectangle. Smaller, same sign, still there, and still on the opposite side of the truth from the engine's daily sum, which reads the right edge instead.

## Exercise

An asset team reports Ekene-1 quarterly rather than monthly. Compute the law's factor for a 91-day interval yourself, apply it to the exact primary cumulative of 73157.9366256283 stb, and state how many barrels the quarterly snapshot invents compared with the 1344.99034386381 stb the monthly snapshot invents.

Then answer in one sentence each. Does the factor change if the well's initial rate doubles, and why? And what happens to the sign of the error in a month where the rate is rising rather than falling, as it does on Ekene-6 when the flood response arrives?
