# Why the starting marker matters

Every prediction of a missing pick has the same shape. You take a depth the well actually has, and you add an interval borrowed from the wells that carry the surface you are after. Anchor plus borrowed interval, and nothing else. It is worth being explicit about that shape before you run the machine a second time, because the two parts behave differently and only one of them is measured in the well you are predicting.

## A prediction has two parts

The anchor is a real pick in Ekene-4. It came from that wellbore, from logs somebody read, and it is as good as any other pick in the tops table. Ekene-4 has three of them: TOP_A at 1530 m, TOP_SAND at 1590 m and BASE_SAND at 1615 m. Whatever else is uncertain about the prediction, the anchor is not the weak part.

The borrowed interval is the assumption. It comes from Ekene-1, Ekene-2 and Ekene-3, the three wells that reached TOP_B, and it says that the distance from the anchor down to TOP_B in those wells is a fair guide to the same distance in Ekene-4. That claim is never exactly true. The whole reason the Professional tier exists is that intervals in this section vary from well to well, so any interval you borrow is an average standing in for a value you do not have.

Write the two parts down separately when you report a prediction. A reader who sees only the final depth cannot tell which part they are being asked to trust.

## Ekene-4 offers more than one anchor

The previous module used TOP_A. It took the A-to-B interval in the three wells, averaged it to 141 m, and added that to Ekene-4's TOP_A of 1530 m for a predicted TOP_B of 1671 m. That is a complete and defensible prediction.

Nothing about the method required TOP_A. It required a marker Ekene-4 has, and a set of wells where the distance from that marker to TOP_B can be measured. TOP_SAND satisfies both conditions exactly as well. Ekene-4 has it at 1590 m, and all three of the other wells carry both TOP_SAND and TOP_B, so the interval between them is measurable in each.

BASE_SAND satisfies them too, in principle. This module works TOP_SAND because it is the marker that sits closest to the target while still being carried by every well in the section, and because the argument for using it generalises to any nearer marker you might have.

## Why the answer moves when the anchor moves

If the section were a stack of parallel layers, the anchor would not matter. Every route from a shallow marker down to TOP_B would arrive at the same depth, because the intervals in between would be identical in every well and the arithmetic would close.

This section is not that. The Professional tier measured the A-to-SAND interval at 48, 53, 46 and 60 m across the four wells, a growth range of 14 m. Surfaces that bound a varying interval are not parallel. Once they are not parallel, the route matters, and a prediction that travels from TOP_A is not the same prediction as one that travels from TOP_SAND.

So the choice of starting marker is not a matter of taste or of which number is handy. It is a choice about which stretch of section you are willing to assume behaves averagely in Ekene-4, and different choices give different answers. Two of those answers are exactly what this course is building towards.

## Error accumulates over the projected distance

Here is the idea that runs through the rest of the module, stated plainly before it is argued.

The borrowed interval is an average, so it is wrong in Ekene-4 by some unknown amount. That error is not a fixed quantity attached to the method. It is roughly proportional to how much section you are projecting across, because the error comes from thickness variation and there is more thickness to vary over a longer projection. Project 141 m and you inherit the variation of everything between TOP_A and TOP_B. Project a shorter distance from a lower marker and the stretch above that marker drops out of the prediction entirely, because its actual thickness in Ekene-4 is already recorded in the anchor depth.

That is the intuition behind a rule you will meet in every part of subsurface work. Extrapolate as short a distance as the data allows, from the nearest control you have. The rule is not a guarantee, and the last lesson in this module is careful about how far it can be pushed, but it is the reason a second prediction is worth computing at all.

## What this module does

Three steps, one per lesson. Measure the TOP_SAND to TOP_B interval in the three wells that carry both and average it. Add that average to Ekene-4's measured TOP_SAND. Then argue, rather than assume, why the result deserves the weight it usually gets.

The result will not agree with 1671 m. That is not a problem to be fixed in this module. It is the subject of the next one.

## Exercise

Without computing anything, list every marker in Ekene-4 that could serve as an anchor for a TOP_B prediction, and for each one state the condition the other three wells must satisfy for that anchor to be usable. Then say in one sentence what would have to be true of the section for all of those anchors to give the same predicted depth.

Self-check: the usable anchors are Ekene-4's three measured picks, TOP_A at 1530 m, TOP_SAND at 1590 m and BASE_SAND at 1615 m, since an anchor must be a depth that well actually has. The condition on the other wells is that each of them carries both the chosen anchor top and TOP_B, so that the interval between the two can be measured rather than assumed, which holds for all three wells here. All the anchors would give the same predicted depth only if every interval between them and TOP_B were constant across the wells, which is to say only if the section were a layer cake with parallel surfaces, and the growth range of 14 m measured in the tier below is direct evidence that it is not.
