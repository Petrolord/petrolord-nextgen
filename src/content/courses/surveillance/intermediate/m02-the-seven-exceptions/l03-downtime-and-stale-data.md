# Downtime and stale data

Two of the seven exceptions do not compare a recent window against a baseline one at all. `downtime` reads a single window against a fixed number of hours, and `stale_data` reads a date against the field anchor. Both are capped, and neither cap is obvious from the list.

{{panel:pd-exception-explorer}}

## Downtime is always medium

The test is `mean < downtimeHours && mean > 0` on the mean `hours_on` over the recent window, against a `downtimeHours` default of 12 h. There is no doubling, no second threshold and no path to high. The published field raises `downtime` on P-5 at medium, value = 8.000000000000 h against a baseline of 12.000000000000 h: "Averaging 8.0 hours on stream against a 12-hour threshold."

Sweeping the mean recent hours on one constructed well, everything else held:

| Mean recent hours, h | Exceptions raised on that well |
| --- | --- |
| 24.00 | high `rate_drop`; high `watercut_rise` |
| 16.00 | high `rate_drop`; high `watercut_rise` |
| 12.00 | high `rate_drop`; high `watercut_rise` |
| 11.99 | high `rate_drop`; high `watercut_rise`; medium `downtime` |
| 6.00 | high `rate_drop`; high `watercut_rise`; medium `downtime` |
| 1.00 | high `rate_drop`; high `watercut_rise`; medium `downtime` |
| 0.10 | high `rate_drop`; high `watercut_rise`; medium `downtime` |
| 0.00 | high `rate_drop`; high `watercut_rise` |

A tenth of an hour on stream is a medium. A well that recorded itself shut for the whole window, a mean of exactly zero, is the one value the check will not report, because the `mean > 0` clause was written to keep an absent hours column out and takes a real zero with it.

## Stale data returns early and stops at medium

`stale_data` measures the days since the well's last row against the field's latest ledger date, and doubling `staleDays` moves it only from info to medium. Against a `staleDays` of 7, a gap of 8 or 14 days is info; 15, 16, 30, 60, 120 and 400 days are all medium and identical in rank. The published case reads value = 20.000000000000 against a baseline of 7.000000000000: "No data for 20 days (field ledger runs to 2025-06-30)."

It also RETURNS EARLY. Nothing else on that well is compared, because the windows would be empty. The teaching well OGUTA-17, invented for this course and neither published nor real, raises `stale_data` at medium, value = 23.000000000000, and no other exception, though its ledger simply stops while the facility keeps producing it.

## The mistake

Ranking by severity and working down. A well silent for 400 days sorts below every high `rate_drop` on the field and is ordered among the mediums alphabetically, so the row that says the data has stopped arriving is the row most likely to be read last.

## What it refuses

`downtime` cannot report a fully shut well and cannot reach high. `stale_data` cannot reach high and suppresses every other check. Between them, the two conditions an operator most wants at the top of the list are the two that cannot get there.

## Exercise

Set the mean recent hours to 12.00, 11.99 and 0.00 in the panel and record which exceptions come back at each.

Then say what a list with no `downtime` row proves about uptime.
