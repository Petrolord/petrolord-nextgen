# Uptime and who is in it

`uptimePct` is a per cent, and it is the mean of an hours column over whichever wells happened to fill that column in. Which wells those were is not in the return.

{{panel:pd-ledger-explorer}}

## How the slots are counted

`computeKpis` walks the well series, skips anything typed injector, and for every remaining point that carries a finite `hours_on` it counts one slot and adds those hours. The uptime is the hours summed over the slots, as a fraction of twenty-four, expressed as a per cent. A point with no hours recorded is not a zero, it is not a slot at all.

On the published surveillance case, anchored at 2025-06-30, the committed uptime is 44.444444444 per cent over a 7-day window and 88.333333333 per cent over 30 days. A derived sweep on the same field gives 72.222222222 per cent at 14 days and 93.055555556 per cent at 60 days. The field did not change: the window did.

## The well that produces nothing and reports perfect hours

The teaching field OGUTA was invented for this course and is neither real nor published. One of its eight wells, OGUTA-21, is typed observation, and by construction it books every volume as zero and records 24 hours on stream on all 70 of its days. `computeKpis` skips injectors from the uptime and reads everything else, so a well that made no oil at all is averaged in alongside the wells that did.

| windowDays | With the observation well | With it dropped | Difference |
| --- | --- | --- | --- |
| 7 | 92.011904762 per cent | 90.014880952 per cent | 1.997023810 points |
| 30 | 98.136111111 per cent | 97.670138889 per cent | 0.465972222 points |

The `wellCount` beside those figures is 8 against 7.

## And the wells that record no hours are not in it either way

Two wells on that field carry a null `hours_on` on every row. They contribute no slots, so they are absent from the uptime whatever they produced. Of the 7 series read for uptime on OGUTA, only 5 carry an `hours_on` on even one row.

## The mistake

Reading `uptimePct` as field availability, then multiplying a production figure by it. It is an average over an unstated membership: injectors out, observation wells in, and any well that left the column blank silently excluded. A field could raise its reported uptime by adding a well that never produces, provided that well fills in its hours.

## What it refuses

To say who was in it. There is no slot count, no well list and no membership figure anywhere in the returned object. A field day of all zeroes returns an uptime of null rather than zero.

## Exercise

Write down the published uptime at `windowDays` of 7 and of 30, and say which is larger and why the field itself did not change between them.

Then say what happens to a well that produces oil and never records an hours value.
