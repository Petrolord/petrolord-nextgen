# Half full, and why that case is special

{{panel:fc-fire-drum-explorer}}

One level on a horizontal vessel has an answer you can work out on the back of an envelope, and it is exactly half full. There the wetted shell is half the cylinder's lateral surface, which is a diameter, a length and pi. Everywhere else the answer needs the segment.

## The identity, printed rather than asserted

| the same vessel at half full | value |
| --- | --- |
| level | 6.000000 ft |
| wetted area from the segment route | 848.2300 ft2 |
| half the lateral surface of the cylinder | 848.2300 ft2 |
| ratio of the two | 1.000000000000 |

The ratio is printed because a ratio nobody computed reads exactly like one somebody did. This one is computed, it is unity to twelve decimals, and that is the whole claim.

## Why one exact point is a weak test

Here is the trap, and it is the reason the teaching sweep walks the level from empty to full rather than stopping at the middle. Any geometry that is wrong away from half full can still be exactly right there. Swap the segment for something that happens to agree at the midpoint and the half-full check passes, cheerfully, while every other level is wrong.

So half full is a useful sanity check and a poor gate. It tells you the constants are in the right place. It cannot tell you the arc is.

## A sanity check and a gate

Both uses are legitimate and only one is a test.

As a sanity check, half full is excellent. It takes seconds, it needs no tooling, and it catches a family of gross errors: a radius used where a diameter belongs, a length left out, a factor of two in the wrong place.

As a gate it is nearly worthless, for a reason that generalises far beyond this route. A gate has to be able to fail. One point of agreement between two expressions is a single equation, and a great many wrong expressions satisfy any single equation you care to write down. Before trusting a check, ask what wrong answer it would have caught.

## The level walked end to end

| level ft | level as a fraction of the diameter | horizontal wetted ft2 |
| --- | --- | --- |
| 0.600000 | 0.050000 | 243.5545 |
| 1.200000 | 0.100000 | 347.4906 |
| 2.400000 | 0.200000 | 500.7394 |
| 4.200000 | 0.350000 | 683.6960 |
| 6.000000 | 0.500000 | 848.2300 |
| 7.800000 | 0.650000 | 1012.7640 |
| 9.600000 | 0.800000 | 1195.7206 |
| 10.800000 | 0.900000 | 1348.9694 |
| 12.000000 | 1.000000 | 1696.4600 |

Read the column and two things stand out. It rises the whole way, which it must. And the steps are uneven: near the bottom a little more liquid buys a lot more wetted shell, and near the top it buys less.

The last row is the other analytic point. At a level of 12.000000 ft the area is 1696.4600 ft2, the whole lateral surface of the cylinder. Two levels on this vessel have closed-form answers, at the middle and at the top.

## What the table does not license

The table prints levels and areas. It prints no ratio between any two of its rows, and that is deliberate. Divide the half-full area by the tenth-of-a-diameter area and you get a number this engine never computes and nothing stands behind. Where a ratio belongs in this course it is printed, as it is for the identity above. Where it is absent, forming one is the reader's invention.

That is the more useful habit than any single figure here. Before comparing two quantities, ask whether the comparison is one the engine makes.

## Exercise

Record the half-full level, the two areas and the printed ratio between them. Then explain in two sentences why an exact agreement at half full is a weak test of the geometry, and name the other level on this vessel that has a closed-form answer.
