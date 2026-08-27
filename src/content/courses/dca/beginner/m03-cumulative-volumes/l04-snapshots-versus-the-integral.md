# Snapshots versus the integral

Every method in this module so far has been exact. This lesson is about the methods that are not, because those are the ones you will actually be handed. A production database gives you one rate per well per month. A forecasting tool gives you a table of daily rates. Neither is an integral, and both of them get the volume wrong in a direction you can predict before you compute anything.

## The monthly snapshot

The most common way an engineer turns rates into volume is the snapshot: take the rate reported for the month, multiply by the days in the month, add up the months. It is fast, it needs no formula, and on a declining well it overstates.

Work one month of Ekene-1. The well starts 2020-01-01 at exactly 120 stb/d, and January has 31 days:

$$120 \times 31 = 3720 \text{ stb}$$

The exact volume, from the exponential cumulative, is $N_p(31) = 3651.65806057785$ stb. The snapshot is high by 68.3419394221546 stb, or 1.87153173403480 percent.

Nothing went wrong in the arithmetic. The problem is the assumption. Holding 120 stb/d for the whole month means claiming the well flowed at its January 1 rate on January 31, and it did not: it flowed at 115.618010327307 stb/d, which is where February's row starts. Every day after the first was credited with more oil than it produced.

February shows the same story with different numbers. The rate on 2020-02-01 is 115.618010327307 stb/d, and 2020 is a leap year, so the snapshot is $115.618010327307 \times 29 = 3352.92229949189$ stb against an exact 3295.25235830158 stb, high by 57.6699411903091 stb or 1.75009179630883 percent. March, another 31 day month, comes back to 1.87153173403458 percent. On an exponential decline the percentage overstatement depends only on how long the rate is held constant, so 31 day months are always worse than 29 day months, and a quarterly snapshot would be far worse than either.

Stop and run March for yourself before reading on. The rate on 2020-03-01 is 111.663707497345 stb/d and the month has 31 days. Compare your rectangle with the exact 3397.98064630572 stb.

## Over the whole primary window

Ekene-1's primary window is 36 monthly rows, 2020-01-01 through 2022-12-01. Sum the 36 snapshots and you get 74502.9269694921 stb. The exact cumulative at the flood start is 73157.9366256283 stb. The snapshot method has invented

$$74502.9269694921 - 73157.9366256283 = 1344.99034386381 \text{ stb}$$

out of nothing. That is more than a thousand barrels of oil that exist only because somebody multiplied instead of integrating, on a well with no noise, no downtime and no allocation problem. Scaled to a field of a hundred wells it is a number an auditor will find.

Work out what that difference is as a percentage of the true volume and keep your answer. You will meet the same quantity again at the Expert tier, where the size of the snapshot error becomes something you are asked to defend rather than something you are shown.

## The sign rule

Here is the piece worth memorising, because it turns a vague worry into a prediction.

Approximating an area by rectangles means choosing which point in each interval sets the rectangle's height. Use the value at the **left** edge of each interval and, for a decreasing function, every rectangle sits above the curve, so the sum **overstates**. Use the value at the **right** edge and every rectangle sits below the curve, so the sum **understates**. The closed form uses neither edge; it is the area itself, and it is exact.

A monthly snapshot is a left-endpoint sum with intervals a month wide. That is why it runs high, and why it runs high by almost 2 percent rather than a rounding error: the intervals are enormous.

## The engine's daily sum runs the other way

The Suite's forecast engine builds a table of daily rates and accumulates them, one day at a time, taking the rate at day 1, day 2, day 3 and so on. That is a right-endpoint sum, so by the rule above it must understate, and it does.

Forecasting Ekene-1 to the 10 stb/d economic limit, the engine accumulates 91604.1233600709 stb. The closed form gives 91666.6666666667 stb. The daily sum is short by 62.5433065957332 stb, or 0.0682290617407998 percent. Run the same well for ten years with no limit and the engine returns 98688.2275091051 stb against the closed form's 98747.4641378926 stb, short by 59.2366287875047 stb or 0.0599880000004771 percent.

Two sums of the same well, one high by 1.8 percent and one low by 0.07 percent. The difference is entirely the width of the rectangle. Watch it happen on January 2020 alone:

| Method | Volume for January 2020 (stb) | Error versus exact |
|---|---|---|
| One monthly rectangle, left edge | 3720.00000000000 | over by 68.3419394221546 |
| 31 daily rectangles, left edge | 3653.84949361315 | over by 2.19143303530745 |
| 31 daily rectangles, right edge | 3649.46750394046 | under by 2.19055663738618 |
| Closed form | 3651.65806057785 | exact |

Slicing the same month into 31 rectangles instead of 1 cuts the error by a factor of about 31. That is the general behaviour of this family of sums, and it is why a daily engine sum is a nuisance at the fourth decimal while a monthly snapshot is a real booking error.

## Which number goes in the memo

The closed form, whenever a closed form exists. For an Arps decline one always does, and you have now derived all three of them.

The Ekene material balance history, the cumulative production handed to the next course in this path, uses the exact integral at every pressure survey for exactly this reason. Material balance reads $N_p$ as a measured volume and infers reservoir energy from it. Feeding it a cumulative that is 1.8 percent high does not produce a slightly optimistic answer, it produces a reservoir that appears to have supported more withdrawal than it did.

## Two ways engineers talk themselves into the wrong number

**"The monthly rate is the monthly volume."** It never is on a declining well. A monthly average rate multiplied by the days in the month is a fair volume; the rate on the first of the month multiplied by the days in the month is not, and production databases hand you both without labelling which is which.

**"More decimal places means more accuracy."** The engine's daily sum prints 91604.1233600709, fifteen significant figures of a number that is 0.068 percent wrong. Precision is how finely a number is written. Accuracy is how close it is to the truth. The sign rule tells you about accuracy; the digits tell you nothing.

## Exercise

Take Ekene-1's fourth month, April 2020. Its rate row is the model rate at $t = 91$ days and the month has 30 days. Without computing the exact integral, state the direction and rough size of the snapshot error you expect, using the January result as your anchor. Then say what would happen to that percentage if the same well were reported quarterly instead of monthly, and whether reporting it daily would remove the error or only shrink it.
