# What the engine needs from you

Four inputs, and two of them are not yours to invent.

{{panel:wc-afe-explorer}}

## The four arguments

`afeCosts` takes the item list, a total day count, a drilled length in metres, and a contingency fraction which defaults to zero. That is all of it. There is no schedule inside the cost function and no cost inside the schedule function.

The items are yours. The days and the metres are handed over from the time model you built in the tier below, and the contingency fraction is a policy decision rather than an estimate.

## The day count is elapsed, not productive

On the golden programme the activities take 384 productive hours. The non-productive allowance stretches every duration, adding 48 hours, so elapsed time is 432 hours and the day count is 18.

Eighteen is the number `afeCosts` wants. Sixteen, the productive figure, is the number that will quietly under-price every per-day line on the sheet, because the rig is on hire during non-productive time exactly as it is during drilling.

The allowance is a stretch on productive time, so a fraction of 0.125 is 48 hours on 384 and lands at 11.11 percent of the elapsed 432. Reading the allowance as a share of elapsed time gives you fewer days than the schedule actually has.

## The metres are drilled metres

The golden drills 3,000 m and its deepest measured depth is also 3,000 m, so the distinction is invisible here. It will not always be.

Drilled metres is the length actually cut by drill activities. Total depth is how deep the hole reaches. A sidetrack, a redrill or a cement plug drilled out adds to the first and not to the second, and a per-metre line bills on the first. Hand the engine a total depth where drilled length was wanted and every per-metre line is short.

## Where it refuses you

The engine rejects a day count below zero, a drilled length below zero, a contingency fraction below zero, and an items argument that is not an array. Inside a line it rejects a negative rate and a negative value.

None of these are style checks. A negative day count would produce a negative rig cost that still summed cleanly into the base, and the AFE would balance while describing a rig that pays you.

## Exercise

Read the golden's productive hours, non-productive hours and elapsed hours from the panel, and confirm the day count the cost run is using.

Then price the rig line twice, once on the productive day count and once on the elapsed one, and state the gap in dollars.
