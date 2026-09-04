# What an unbounded fit costs

One stage read outside the data is a small wrong number. A stack count divides by that number, so the same reading becomes a large wrong number.

{{panel:pd-stage-explorer}}

## A published design swept down in frequency

The gassyOffshore golden design, sized at 60 Hz, taken down the drive with its duty held:

| Hz | Equivalent rate, bbl/d | Head per stage, ft | Stages | In range | Warnings |
| --- | --- | --- | --- | --- | --- |
| 60 | 2750.4000 | 25.938550 | 192 | true | 0 |
| 55 | 3000.4364 | 19.901050 | 251 | true | 0 |
| 50 | 3300.4800 | 14.388550 | 346 | true | 1 |
| 46 | 3587.4783 | 10.356550 | 481 | false | 2 |
| 44 | 3750.5455 | 8.466550 | 589 | false | 2 |
| 42 | 3929.1429 | 6.660550 | 748 | false | 2 |
| 40 | 4125.6000 | 4.938550 | 1009 | false | 2 |

At every row the engine returned a design, not a refusal. The stage count at 40 Hz is 5.2552 times the count at the design speed, and the head per stage there is smaller by a factor of 5.2523, because the count is the head required divided by the head per stage and nothing else.

A recorded finding on another design makes the same shape at the same frequency: 926 stages off a stage making 3.9802 ft, 5.58 times the design speed stack, three warnings, no refusal.

## Low frequency is not the cause

The highWaterCut golden design, sized at 50 Hz and taken down to 40 Hz, stays inside its published data the whole way: 264 stages at 50 Hz, 320 at 46, 354 at 44, 395 at 42 and 445 at 40 Hz, 1.6856 times the design speed count, with the range flag true throughout and no warning at all below 50 Hz. Its equivalent rate at 40 Hz is 6147.6000 bbl/d, and its distance past the end of the published data there is -3652.4000 bbl/d. Slowing the drive does not put you outside the data. Where the equivalent rate lands does.

## The mistake

Watching the frequency and not the equivalent rate. The gassyOffshore design leaves its data between 50 and 46 Hz while the highWaterCut design never leaves its data, and one was sized at 60 Hz against the other at 50 Hz. The frequency you set is not the number the curve is read at.

## What it refuses

Nothing here refuses. Stage counts of 481, 589, 748 and 1009 are all returned, all integers, all in the same field as the 192 that was correct. Nothing compares a count or a head per stage against its value at the design speed, and nothing in the sizing declines to size.

## Exercise

Write the equivalent rate and the stage count for the gassyOffshore sweep at 50, 46 and 40 Hz.

Then find the first frequency where the range flag turns false, and say how many stages the design had already gained before it did.
