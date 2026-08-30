# Governing drift to a depth

The single function every clearance check calls, and the property that makes it correct.

{{panel:cd-clearance-explorer}}

## The definition

The governing drift to a depth is the smallest drift of any profile segment at or above that depth.

Not the drift at the depth. The smallest one anywhere on the way there.

## Why not the drift at the depth

Because a component going to that depth has to pass everything above it. A tool that would sit comfortably at three thousand metres is of no use if it cannot get past two thousand four hundred.

This is the single most important idea in this tier, and it is easy to state and easy to forget. The constraint on a component is a property of the path, not of the destination.

## It can only fall

Because it is a running minimum from surface, the governing drift is monotone. Take any two depths, and the deeper one has a governing drift no larger than the shallower one.

That is a useful property to check. Plot it against depth in the panel and the curve is a staircase that only ever steps down. A curve that stepped up would mean a restriction had been un passed, which cannot happen.

## In the published well

Down to sixteen hundred and fifty metres the governing drift is the heavier upper casing at about two hundred and seventeen millimetres. From there to twenty four hundred it is the lighter section, a few millimetres smaller. From twenty four hundred down it is the liner, at about one hundred and fifty four.

Three values, two steps, and the second step is the one that matters: it takes a quarter off the available bore.

## Where the label comes from

The function returns the label of the segment that set the minimum, not the label of the segment at the depth. Those differ everywhere below a restriction.

A component at two thousand nine hundred metres in the published well is governed by the liner, which is also the string at that depth. A component at two thousand nine hundred metres in a well where the tightest thing was a shallow tie back would be governed by the tie back, and the label would say so even though the tie back is a kilometre above.

## Exercise

Read the governing drift at four depths from the panel: five hundred, two thousand, two thousand five hundred and three thousand metres.

Confirm the sequence is non increasing and identify the two depths where it steps.

Then construct a case where the governing drift at a depth comes from a string that is not present at that depth, and say what the label reports.
