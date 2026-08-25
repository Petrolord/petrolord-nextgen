# The four wells

The golden model carries four wells, and the tier's arithmetic runs on their fixtures, so it is worth having them by heart before any trajectory is built.

## The roster

Each well has a surface location, a kelly bushing height, a survey, three top picks and two zone intervals.

| Well | Head (x, y) | KB (m) | Survey | TopA (MD) | TopB (MD) | BaseB (MD) |
| --- | --- | --- | --- | --- | --- | --- |
| W1 | 1100, 2100 | 25 | vertical | 1530 | 1565 | 1595 |
| W2 | 1400, 2200 | 30 | 45 degree build | 1580 | 1700 | 1760 |
| W3 | 1900, 2700 | 20 | vertical | 1580 | 1625 | 1655 |
| W4 | 2050, 2150 | 28 | vertical | 1584 | 1630 | 1660 |

All depths in the table are measured depths, in metres along the hole from the kelly bushing. The zone intervals follow the picks: zone A runs from the TopA pick to the TopB pick, zone B from TopB to BaseB.

## Three vertical wells and one real one

W1, W3 and W4 each carry a survey of a single station at zero inclination, which is the fixture's way of saying the hole is straight and vertical. For them, every conversion in this tier collapses to arithmetic you can do in your head.

W2 is the reason the tier exists. Its survey has three stations: at 1200 m MD the hole is still vertical, at 1500 m it has built to 45 degrees inclination with an azimuth of 090, due east, and at 1900 m it still holds 45 degrees east. So the hole has three parts: a vertical section to 1200, a build section from 1200 to 1500 in which the inclination climbs from 0 to 45 degrees, and a tangent, or hold, section beyond 1500.

Notice where W2's picks sit relative to those parts. Its TopA pick at 1580 m MD is just past the end of the build. Its TopB at 1700 and BaseB at 1760 are well into the hold. Every one of W2's picks therefore lands somewhere east of the wellhead, and the deeper the pick, the further east.

## What the wells log that the model must match

Every well logs 30 m of zone B in measured depth: W1 from 1565 to 1595, W3 from 1625 to 1655, W4 from 1630 to 1660, and W2 from 1700 to 1760, which is 60 m of hole but, as you will compute in module two, about 42 m of vertical rock at 45 degrees. Keep the 30 m figure in mind. The framework's zone B, by contrast, is pinched to zero thickness over 180 of the 500 nodes by the clamp you studied in the Associate tier. Where a well that logged zone B meets a model that pinched it, something in the tie table has to give, and module four is about exactly that.

## Worked example

Place W2's TopB pick within the well's three parts, without computing anything. The pick is at 1700 m MD. The build ended at 1500 m MD, so the pick is 200 m of hole into the hold section. In the hold, the hole makes a constant 45 degree angle with the vertical and heads due east. So relative to where the hole was at 1500 m MD, the pick sits deeper and further east in equal measure, since at 45 degrees the sine and cosine are equal. No other well in the set requires this kind of reasoning, which is exactly why W2 anchors the capstone.

## Exercise

Using only the table above: which well has the highest kelly bushing, and which well's TopA pick is deepest in measured depth? Then compute the horizontal distances between the W1 and W2 wellheads and between the W3 and W4 wellheads, say which pair is closer, and state why closeness of wellheads does not imply closeness of the rock each well sampled once deviation enters.
