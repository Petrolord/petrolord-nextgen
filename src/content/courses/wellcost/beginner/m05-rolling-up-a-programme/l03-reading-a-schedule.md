# Reading a schedule

A schedule is ten rows and eight columns, and there is an order to attack it in that finds the errors first.

{{panel:wc-time-explorer}}

## What a row tells you

Each row is one activity, with its productive hours, its stretched duration, a start and end time on the running clock, and a start and end depth.

The clock is cumulative. Every row starts where the one above it finished, so the schedule reads as a single unbroken timeline from spud to handover.

The golden case runs from 0 to 432 hours, and its last row ends at 432.

## The order of attack

**First, check the ends.** The end time of the last row must equal the reported total hours. The final depth must equal both the reported total depth and the drilled metres, 3,000 m here. Two identities, checked in ten seconds, and they catch an edited programme that was never re-evaluated.

**Second, find the big rows.** Sort by duration and read the top of the list. On the golden case the two deep drilling sections are 112.5 hours each, and completion and handover is 67.5. Three rows out of ten hold most of the schedule.

**Third, check the split.** Compare productive hours against duration on any single row. The ratio must be the same on every row, because the allowance is one uniform stretch. A row where it differs is a row somebody has overwritten by hand.

**Fourth, question the flat rows.** Flat durations are stated, not computed, so they are the only numbers in the schedule that no formula defends. The golden case states 24 hours for rig move and spud and 60 for completion and handover. Ask where each came from.

**Last, look at the depths.** A row whose start and end depth are equal makes no hole. If you have more of those than you expected, the programme has more non-drilling work in it than the day count suggests.

## What not to do first

Do not begin by arguing about ROP. It is the most discussed input and rarely the largest error in a first draft.

A flat duration that was guessed, an allowance that was copied from a different field, or a casing flat term left at a default will each move the total more than a plausible argument about metres per hour.

## Exercise

Run the two end identities on the golden schedule and write down both results.

List the ten rows in descending duration. State how many rows you need before you have accounted for more than half of the 432 hours.

Take the ratio of duration to productive hours on three different rows and confirm all three give the same figure.
