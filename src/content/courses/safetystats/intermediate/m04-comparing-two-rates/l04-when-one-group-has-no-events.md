# When one group has no events

{{panel:ss-intervals-explorer}}

Two golden cases, each with one empty group:

| golden case | count1, hours1 | count2, hours2 | rateRatio | lower | upper | upperUnbounded | pValue |
| --- | --- | --- | --- | --- | --- | --- | --- |
| compare-first-zero | 0, 180000 | 6, 210000 | 0.000000 | 0.000000 | 0.990863 | false | 0.048748 |
| compare-second-zero | 4, 90000 | 0, 150000 | null | 1.100207 | null | true | 0.039551 |

The first case has an answer for the ratio. The second has none, and the engine says so.

## When the first group is empty

In compare-first-zero the first group recorded 0 events in 180000 hours and the second 6 in 210000. The ratio of the first rate to the second is 0 over something, which is 0, and the engine returns 0.000000. The lower limit is 0.000000 too, because a ratio cannot go below zero. The upper limit is 0.990863.

That upper limit is below 1, so at 95 percent the data rule out equal rates: the first group's rate is lower. The central p-value of 0.048748 is below 0.05 and agrees.

## When the second group is empty

In compare-second-zero the first group recorded 4 events in 90000 hours and the second 0 in 150000. Now the ratio is something over 0. There is no number for that, so the engine returns null for the rate ratio and null for its upper limit, sets `upperUnbounded` to true, and gives its reason in its own words:

> count2 is zero: the rate ratio and its upper limit are unbounded

The lower limit still exists. It is 1.100207, which is above 1, so at 95 percent the data rule out equal rates in the other direction: the first group's rate is higher. The central p-value of 0.039551 is below 0.05 and agrees again.

## Why the engine returns null

A program could return Infinity for a ratio over zero, and JavaScript would print it happily. The engine returns null with a reason instead. Infinity looks like a number. It can be sorted, compared and copied into a report as though it were a finding. A null with a reason cannot be mistaken for a measurement, and the flag `upperUnbounded` tells a program what kind of absence it is holding.

A ratio with no events underneath it is unbounded, and the honest output says exactly that and keeps whatever part of the interval does exist. Here that is the lower limit of 1.100207, which carries the whole finding.

## The order shapes the output

The two cases are mirror images in structure. Put the empty group first and you get a ratio of zero with a finite upper limit. Put it second and you get an unbounded ratio with a finite lower limit. The conclusion about which rate is higher is the same either way. The order decides the shape of the output and nothing more. When you set up a comparison, choose the order that makes the report read naturally, and expect the unbounded flag when the empty side is second.

## Exercise

Open the comparison view and enter 4 events in 90000 hours as the first group and 0 in 150000 as the second, at confidence 0.95. Copy the engine's reason and record the lower limit. Then swap the groups, record the new rate ratio and upper limit, and check that the new upper limit is one over 1.100207.
