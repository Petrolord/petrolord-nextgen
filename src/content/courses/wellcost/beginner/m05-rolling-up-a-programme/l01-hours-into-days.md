# Hours into days

The engine works in hours and the world buys days, and the conversion is the last honest step before anyone spends money.

{{panel:wc-time-explorer}}

## One constant, applied once

Every closed form in this course returns hours. The activity durations are hours, the running clock is hours, and the allowance is applied to hours.

The rollup divides by a single constant, 24 hours per day, and that is the only unit conversion the time side of the engine performs. On the golden programme, 432 elapsed hours becomes 18 days.

The constant is not a rig calendar or a working shift. It is a day of wall clock time, because a well under way does not stop overnight.

## Days are not whole numbers

The engine returns days as a decimal and does not round. Sweeping the allowance across the golden programme gives 16, 16.8, 17.6, 18, 19.2, 20, 20.8, 22.4 and 24 days.

Rounding those to whole days would be wrong twice over. It would break the identity between hours and days, and it would hide differences that matter: 16.8 days and 17.6 days are not the same rig slot even though both round to 17.

Carry the decimal all the way through. Round only in the sentence you write for a human, and say there that you have.

## Where the day count comes from

Read the rollup as a chain, and check each link.

Productive hours are the sum of the closed forms across the activities, 384 here. The allowance stretches that to 432 elapsed hours. Twenty-four hours to a day gives 18 days.

The last activity's end time on the schedule is also 432 hours, and that is not a coincidence: the clock is cumulative, so the end of the last row is the total. If those two disagree, the schedule has been edited and the totals have not been recomputed.

## Why days rather than hours downstream

Nothing in the time model needs days. The conversion exists because the contracts do. A rig comes with a rate per day, a services spread comes with a rate per day, and both bill the elapsed calendar rather than the productive part of it.

So the day count carries a meaning that the hour count does not: it is the number a commercial line will be multiplied by.

## Exercise

Read `totalHr` and `totalDays` from the panel on the golden case and confirm the ratio is exactly 24.

Set the allowance to 0.10 and to 0.30 and record both day figures. Say which decisions would change between them.

Check the end time of the last schedule row against `totalHr` and state what a mismatch would mean.
