# Deferments and the loss book

`summarizeDeferments` rolls up lost production by category, worst first by oil. It is also the only function in `surveillance.js` that can give a different answer tomorrow on the same data.

{{panel:pd-exception-explorer}}

## The roll-up, and the order it chooses

The published case at asOf 2025-06-30 holds 5 events, 1 of them open, 21 days and 10850.000000 stb of oil. That is a volume over the events and not a rate.

| Category | Events | Days | Oil, stb |
| --- | --- | --- | --- |
| Well integrity | 1 | 10 | 5100.000000 |
| Facility | 2 | 6 | 4600.000000 |
| Power | 2 | 5 | 1150.000000 |

The sort is by oil descending and then by days, so the category that cost the most oil leads whatever its event count. That is right for a loss review and wrong for a maintenance backlog: Facility has twice the events of Well integrity and sits below it.

## The day count is inclusive and clamped at one

The count is the end day minus the start day plus one, floored at 1. An event that starts and ends on 2024-06-10 is 1 day, and 2024-06-01 to 2024-06-30 is 30 days. An event running 2024-06-10 to 2024-06-09 is 1 day, and one running 2024-06-10 back to 2024-05-10 is also 1 day, with nothing saying the dates were the wrong way round.

## The open event, and the clock it reads

An open event accrues days to asOf, and when asOf is omitted the function substitutes today's date. Every other window in the module anchors on the field's latest ledger date so an old dataset surveils honestly. This one does not.

| Anchor | Days | Oil, stb |
| --- | --- | --- |
| 2024-06-30 | 30 | 3200.000000 |
| 2024-08-31 | 92 | 3200.000000 |
| 2024-11-20 | 173 | 3200.000000 |
| 2025-06-30 | 395 | 3200.000000 |

The oil is a filed volume and never moves. Only the days do.

## The mistake

Reading a deferment book against production without naming the two quantities. On the teaching field OGUTA, invented for this course and neither real nor published, the deferments at asOf 2024-11-20 are 29 days and 12800.000000 stb of oil over the whole ledger, against a field oil at a 7 day window of 1869.584074327 stb/d. The deferred volume is worth 6.846442573 days of current field production, and that sentence works only because it names which of the two is a volume and which is a rate.

## What it refuses

It will not validate a date order, will not distinguish a one day event from a reversed one, and will not say when its day count came from the wall clock rather than the data.

## Exercise

Write the open deferment's day count anchored at 2024-11-20 and at 2025-06-30, and its oil at each.

Then say which column would change if the same run were made a week later with asOf omitted.
