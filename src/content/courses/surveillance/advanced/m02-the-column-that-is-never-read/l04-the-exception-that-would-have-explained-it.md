# The exception that would have explained it

There is a check in `detectExceptions` that reads the hours column directly. On OGUTA-6 it sits under its threshold and stays silent while the rate check reports the well.

{{panel:pd-reading-explorer}}

## The downtime branch

`downtime` averages `hoursOn` over the recent window and fires when that mean falls below `downtimeHours`, which defaults to 12 h. It is the only exception type in the module built on the uptime column at all.

On OGUTA-6, a well this course invented, the mean recent `hours_on` is 14.414285714286 h. The threshold is 12 h. The check does not fire, and the one row that would have named uptime as the cause is absent from the list.

## The near miss, priced

The baseline mean `hours_on` on the same well is 24.000000000000 h, so the hours themselves fell by 39.940476190 per cent against that baseline. That is a larger relative move than the reported change on the calendar oil volume, which is 38.825312618416 per cent read as a drop.

The downtime check never sees that comparison. It is not a baseline comparison at all: it is a single absolute threshold on the recent mean, so a well that halved its hours from a full day and still averages above 12 h passes it.

## A severity that is not a size

Even when it does fire, `downtime` is always medium, whatever the hours. The published field carries one: P-5, value 8.000000000000 against a baseline of 12.000000000000, message `Averaging 8.0 hours on stream against a 12-hour threshold.` A well averaging 8.0 h and a well averaging a fraction of that would both print medium.

The sort is severity first and then well name alphabetically, so that medium row lands among the other mediums with no regard to size.

## The dial, swept

A derived sweep on the published field moves `downtimeHours` alone. At 0, 1, 4 and 8 the field raises 8 exceptions and no `downtime` row appears in the type counts. At 12, 16, 20 and 24 it raises 9 and a `downtime` row appears. The check is a single knob, and nothing in a list that lacks a downtime row says the knob was the reason.

## The mistake

Concluding from the absence of a downtime exception that the well was on stream. Absence means the recent mean cleared 12 h, and nothing more. On OGUTA-6 the mean hours are 14.414285714286 h and the daily hours behind them run as low as 7.8 h, so the mean passing the gate says nothing about the days inside it.

## What the pair refuses to do

`rate_drop` and `downtime` are computed in the same function on the same points and are never compared with each other. Nothing asks whether a reported rate drop is accompanied by an hours drop, and no field in either row points at the other.

## Exercise

Read the OGUTA-6 recent window in the panel and record the mean `hours_on` and the downtime threshold.

Then set `downtimeHours` to a value that fires on this well, and say what the list would then have shown beside the rate drop.
