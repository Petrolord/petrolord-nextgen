# Half full, and why that case is special

{{panel:fc-fire-drum-explorer}}

One level on a horizontal vessel has an answer you can work out on the back of an envelope, and it is exactly half full. There the wetted shell is half the cylinder's lateral surface, a diameter, a length and pi. Everywhere else needs the segment.

## The identity, printed rather than asserted

| the same vessel at half full | value |
| --- | --- |
| level | 6.000000 ft |
| wetted area from the segment route | 848.2300 ft2 |
| half the lateral surface of the cylinder | 848.2300 ft2 |
| ratio of the two | 1.000000000000 |

The ratio is printed because a ratio nobody computed reads exactly like one somebody did. This one is computed, unity to twelve decimals, and that is the claim.

## A good sanity check and a poor gate

Both uses are legitimate and only one is a test.

As a sanity check it is excellent. It takes seconds, needs no tooling, and catches a family of gross errors: a radius used where a diameter belongs, a length left out, a factor of two misplaced.

As a gate it is nearly worthless, for a reason that generalises far beyond this route. A gate has to be able to fail, and one point of agreement is a single equation that many wrong expressions satisfy. Swap the segment for anything agreeing at the midpoint and the check passes while every other level is wrong. Before trusting a check, ask what wrong answer it would have caught.

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

It rises the whole way, which it must. The last row is the other analytic point: at 12.000000 ft the area is 1696.4600 ft2, the whole lateral surface. Two levels here have closed-form answers.

What the column cannot tell you is where it rises fastest, because its levels are spaced unevenly and a steepness read off unevenly spaced rows is a steepness nobody computed.

## What a foot of level buys

So the course walks it again in equal bands of a tenth of the diameter.

| band ft | horizontal wetted gained ft2 | gained per foot ft2 |
| --- | --- | --- |
| 0.000000 to 1.200000 | 347.4906 | 289.5755 |
| 1.200000 to 2.400000 | 153.2488 | 127.7073 |
| 2.400000 to 3.600000 | 125.2715 | 104.3929 |
| 3.600000 to 4.800000 | 113.4858 | 94.5715 |
| 4.800000 to 6.000000 | 108.7333 | 90.6111 |
| 6.000000 to 7.200000 | 108.7333 | 90.6111 |
| 7.200000 to 8.400000 | 113.4858 | 94.5715 |
| 8.400000 to 9.600000 | 125.2715 | 104.3929 |
| 9.600000 to 10.800000 | 153.2488 | 127.7073 |
| 10.800000 to 12.000000 | 347.4906 | 289.5755 |

The column is a mirror. The bottom band gains 347.4906 ft2 and so does the top, at a printed ratio of 1.000000000000. The flat part is the middle, where the two middle bands gain 108.7333 ft2 each, at a printed end-to-middle ratio of 3.195807278241.

That is the arc doing what an arc must: it grows fastest where the circle wall is steepest, at the bottom and the top in equal measure. Eyeballing the level sweep instead invites the conclusion that the gains tail off towards the top, because its rows up there sit closer together. They do not. They are the largest in the vessel.

## What the tables do and do not license

The level sweep prints no ratio between any two of its rows, and that is deliberate. The band table is the other case, and the difference is the point: a comparison the course wants you to make is computed and printed.

So before comparing two quantities, ask whether the comparison is one the engine makes. If it matters and nobody has, compute it rather than estimate it off a table printed for another purpose.

## Exercise

Record the half-full level, the two areas and the printed ratio. Explain why agreement at half full is a weak test of the geometry, and name the other level with a closed-form answer. Then, from the band table, give the bands that gain most and least and the printed ratio between the ends.
