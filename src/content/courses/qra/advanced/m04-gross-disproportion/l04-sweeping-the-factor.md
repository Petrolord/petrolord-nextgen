# Sweeping the factor

{{panel:qr-alarp}}

A DF is a judgement, and a judgement is best reported with its neighbours. Sweeping the DF across the range the guidance allows shows at a glance whether a verdict is robust or turns on the choice. This lesson sweeps the EDIKAN firewall, undiscounted, across five stated DFs and reads what a note should take from the result.

## The sweep

| DF, stated | cost / benefit | largest reasonably practicable cost | present value of the cost | verdict |
| --- | --- | --- | --- | --- |
| 1 | 8.750000 | 40000.00 | 350000.00 | GROSSLY_DISPROPORTIONATE |
| 2 | 8.750000 | 80000.00 | 350000.00 | GROSSLY_DISPROPORTIONATE |
| 3 | 8.750000 | 120000.00 | 350000.00 | GROSSLY_DISPROPORTIONATE |
| 5 | 8.750000 | 200000.00 | 350000.00 | GROSSLY_DISPROPORTIONATE |
| 10 | 8.750000 | 400000.00 | 350000.00 | NOT_GROSSLY_DISPROPORTIONATE |

## What changes and what stays

The cost to benefit ratio stays at 8.750000 in every row, because it does not depend on the DF. Only the verdict and the largest reasonable cost change. The limit climbs with the DF, from 40000.00 at DF 1 to 400000.00 at DF 10, while the cost stays at 350000.00. The verdict turns once, between DF 5 and DF 10: at 5 the limit of 200000.00 is below the cost, and at 10 the limit of 400000.00 is above it.

At DF 1 the limit equals the present value of the benefit itself, 40000.00. That is the smallest factor the guidance allows, where any cost above the benefit counts as gross.

## Reading the sweep for a note

For the firewall the verdict is GROSSLY_DISPROPORTIONATE at every DF from 1 to 5, and NOT_GROSSLY_DISPROPORTIONATE only at DF 10. A DF of 10 sits at the top of the range the checklist expects, since it says a DF above 10 is unlikely. An analyst who adopts the firewall on the DF 10 row is relying on the largest factor the guidance contemplates, and the note must justify that choice. An analyst who rejects it at DF 3 should show the DF 10 row as well, so a reviewer sees that the verdict depends on the factor chosen.

A sweep is cheap to run in the panel: hold every other input still, change only the DF, and copy each row at the precision the engine prints, six decimals for the ratio and two for money. Reporting the whole sweep takes a few lines of a table, and it answers in advance the first question any reviewer asks about a verdict that rests on a single judgement.

## Sweeping the convention too

The DF is one choice among several. The same firewall under the 2003 checklist limits has a ratio of 9.350247, and under R2P2 a ratio of 9.328625. Because the ratio does not depend on the DF, a two-way table of convention against DF needs only the three ratios: each can be read against any DF by the strictly greater rule. The sweep above is the undiscounted column of that table, and a full note carries the others beside it.

## Exercise

Take the checklist-limits ratio of 9.350247. Read it against each DF in the sweep, 1, 2, 3, 5 and 10, and write the verdict for each by the strictly greater rule. Then write one sentence saying whether the firewall's verdict under the checklist limits turns at the same place in the sweep as the undiscounted verdict does.
