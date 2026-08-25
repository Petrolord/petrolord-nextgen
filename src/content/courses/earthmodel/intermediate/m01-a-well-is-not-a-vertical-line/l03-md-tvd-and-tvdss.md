# MD, TVD and TVDSS

Three depths describe every point on a well path, and the tie table only works because the engine keeps them straight. Mixing them is the classic error of this subject, so this lesson fixes the conventions before any curvature appears.

## The three depths

Measured depth, MD, is distance along the hole, starting at zero at the kelly bushing. It is the only depth a driller or a wireline tool directly measures, which is why picks are recorded in it. MD always increases as the tool goes deeper into the hole, whatever the hole's shape.

True vertical depth, TVD, is the vertical component of that journey: how far below the kelly bushing the point sits, ignoring all sideways travel. For a vertical hole TVD equals MD. For any deviated hole TVD is less than MD, because some of the hole's length was spent going sideways.

TVDSS is TVD referenced to sea level instead of the bushing: TVDSS equals TVD minus KB, metres below mean sea level, positive downward. This is the model's datum. Every surface in the framework is stored in TVDSS, which is why every tie must convert to it.

$$\mathrm{TVDSS} = \mathrm{TVD} - \mathrm{KB}$$

## Why the bushing height matters

The kelly bushing is the rig floor reference the depths are measured from, and it sits some height above sea level: 25 m at W1, 30 m at W2, 20 m at W3, 28 m at W4. Two wells that pick the same formation at the same measured depth but from different bushing heights have found it at different depths below sea level. The subtraction is trivial and forgetting it shifts every tie in a well by the same amount, which is exactly the signature to look for when a whole well's residuals share one unexplained offset.

At the top of the hole the convention produces a number worth pausing on: at MD 0 the TVDSS is minus KB. W2's path starts at TVDSS of minus 30, which reads as 30 m above sea level. That is correct, not a bug: the bushing genuinely is above the datum, so depth below datum there is negative.

## The vertical shortcut, stated once

For a vertical well the whole chain collapses:

$$\mathrm{TVDSS} = \mathrm{MD} - \mathrm{KB}$$

W1's BaseB pick at 1595 m MD is at 1595 minus 25, or 1570 m TVDSS. W3's BaseB at 1655 is at 1635. W4's BaseB at 1660 is at 1632. Those three numbers go straight into the tie table with no trajectory at all, and the engine's answers agree with the hand answers exactly, to the last digit, because nothing in the arithmetic ever leaves integers.

For W2 the shortcut is wrong, and wrong by an amount that grows with depth: at its BaseB pick the shortcut says 1730 m TVDSS while the true trajectory says 1623.9426579556343, an error of 106.05734204436567 m. Module five measures that cost properly; here it is enough to see that the shortcut is not a small-angle approximation you can get away with. At 45 degrees, sideways travel is as fast as downward travel.

## Worked example

Convert all three of W4's picks to TVDSS. KB is 28 m. TopA: 1584 minus 28 is 1556. TopB: 1630 minus 28 is 1602. BaseB: 1660 minus 28 is 1632. Now read the intervals: zone A occupies 1556 to 1602, which is 46 m of vertical rock, and zone B occupies 1602 to 1632, which is 30 m. For a vertical well the MD interval and the TVD interval are identical, and this is the last tier in which you may assume that without checking the survey first.

## Exercise

W2's TopA pick is at 1580 m MD with KB 30 m. Compute what the vertical shortcut would give in TVDSS, then state, without computing it, whether the true TVDSS must be shallower or deeper than that and why. Finally, say which single input the shortcut ignores.
