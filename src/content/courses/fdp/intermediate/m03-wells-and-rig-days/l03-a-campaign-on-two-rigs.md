# A campaign on two rigs

EGINA's four wells carry 182 rig days of work. On one rig the campaign takes 182 days, on two it takes 95 and on three it takes 76. The work never changes.

{{panel:ec-schedule-explorer}}

## Rig days and campaign days

| rigs | campaign days | rig days of work |
| --- | --- | --- |
| 1 | 182 | 182 |
| 2 | 95 | 182 |
| 3 | 76 | 182 |

Rig days are the sum of the well durations: 61 plus 45 plus 42 plus 34. That total is a property of the wells, and adding rigs does not reduce it by a day. Campaign days are the elapsed time rigs actually buy. The money follows the rig days: the four wells cost 141050000 USD on one rig, on two and on three.

## How the wells are dealt out

Each well goes to the rig that comes free first. Nobody chooses the split and no optimisation is run.

On two rigs, EG-01 at 61 days and EG-02 at 45 days take one rig each. EG-03 at 42 days goes to the rig free first, the one carrying 45, and EG-04 at 34 days goes to the rig carrying 61. That rig finishes at 95 and the other earlier, so the campaign is 95 days.

On three rigs the first three wells take a rig each and EG-04 joins the rig that came free at 42 days. That rig finishes at 76, later than EG-01's 61, so the campaign is 76 days.

## Why two rigs do not halve it

A well cannot be split between two rigs, so 182 rig days on two rigs comes out at 95 days rather than at half of 182. The arithmetic is a packing problem in whole wells and not a division.

The third rig buys less than the second. One rig to two takes the campaign from 182 days to 95; two to three takes it from 95 to 76. There is a floor underneath all of it, because EG-01 alone is 61 days and no number of rigs finishes this campaign in fewer than 61.

## What the layout does not decide

Nothing in the layout knows about rig moves between locations, about a rig available only from a certain date, or about a sequence the reservoir requires, such as an injector that has to be down before a producer comes on. Those belong in the schedule network, where a link can be typed between two activities. The layout answers a narrower question: how much elapsed time this much drilling occupies on this many rigs.

## The mistake

Dividing rig days by rigs. The answer is close enough to look right, it is never the engine's, and it drifts further as the wells grow more unequal.

The other mistake is quoting the wrong one of the two numbers. A schedule needs campaign days, because that is what occupies the calendar. A cost estimate needs rig days, because that is what is paid for. Reporting 95 where 182 was wanted halves the work on paper.

## Exercise

State the campaign days on one, two and three rigs and the rig days in each case. Then work the two rig assignment well by well to show where 95 days comes from, and say why no number of rigs brings this campaign below 61 days.
