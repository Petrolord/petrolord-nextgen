# A circle cut by a level

ABANA-2 is a horizontal production separator built at 8.000000 ft. Liquid lies in the bottom of that circle, and the level fraction cuts the circle into the area the liquid occupies and the area the gas flows through.

{{panel:fc-slug-explorer}}

## The cut at six levels

| level fraction | liquid depth ft | liquid area ft2 | gas area ft2 | gas height ft | gas-liquid chord ft | total area ft2 |
| --- | --- | --- | --- | --- | --- | --- |
| 0.200000 | 1.600000 | 7.156723 | 43.108759 | 6.400000 | 6.400000 | 50.265482 |
| 0.300000 | 2.400000 | 12.682775 | 37.582708 | 5.600000 | 7.332121 | 50.265482 |
| 0.400000 | 3.200000 | 18.775668 | 31.489815 | 4.800000 | 7.838367 | 50.265482 |
| 0.500000 | 4.000000 | 25.132741 | 25.132741 | 4.000000 | 8.000000 | 50.265482 |
| 0.600000 | 4.800000 | 31.489815 | 18.775668 | 3.200000 | 7.838367 | 50.265482 |
| 0.750000 | 6.000000 | 40.438525 | 9.826958 | 2.000000 | 6.928203 | 50.265482 |

Every row is the same drum. The total area holds at 50.265482 ft2 because the shell has not changed, and the level fraction moves everything else on the row.

## Depth is linear and area is not

The liquid depth is the level fraction times the diameter, so 0.300000 of 8.000000 ft stands 2.400000 ft deep and 0.750000 stands 6.000000 ft deep. The areas refuse to follow that straight line. At a level of 0.300000 the liquid holds 12.682775 ft2 out of 50.265482 ft2, well under three tenths of the circle, because the bottom of a circle is narrow. At 0.750000 the liquid holds 40.438525 ft2, well over three quarters, because by then the widest part of the circle is already covered.

That is why a horizontal vessel is sized on areas. A step of one tenth in the level fraction is worth more liquid area near the centreline, where the circle is wide, than near the bottom of the drum, where it is narrow.

## The inverse is exact

Sizing asks the question in both directions: an area from a depth, and a depth from an area. The engine bisects 100 times for the second, which resolves the depth to double precision, and the two answers agree. A drum of 8.000000 ft at level 0.350000 stands 2.800000 ft deep and holds 15.678751 ft2, and 15.678751 ft2 gives the depth back as 2.800000 ft. A drum of 10.000000 ft at level 0.600000 stands 6.000000 ft deep and holds 49.202836 ft2, and that area gives back 6.000000 ft.

An area that cannot sit on the circle at all has no answer, and the engine returns one rather than inventing a depth: { error: "the area must lie between zero and the full circle" }.

## Four published segments

| case | liquid area ft2 |
| --- | --- |
| segment8ftAt0.5 | 25.132741 |
| segment10ftAt0.3 | 19.816836 |
| segment6ftAt0.75 | 22.746670 |
| segment12ftAt0.5 | 56.548668 |

The 6.000000 ft drum run at 0.750000 carries 22.746670 ft2, more liquid than the 10.000000 ft drum carries at 0.300000, which is 19.816836 ft2. A smaller vessel run high holds more than a larger one run low, and the diameter alone will not tell you that.

## The mistake

The mistake is scaling a liquid area by the level fraction: taking 0.300000 of 50.265482 ft2 and writing it down instead of 12.682775 ft2. It is wrong in both directions and it is wrong by different amounts at different levels, so the error does not cancel across a family of vessels. The second mistake is reading the depth as though it were the gas height. Both are on the same row and they add to the diameter.

## Exercise

Write the liquid area, the gas area and the gas height for the 8.000000 ft drum at levels 0.300000, 0.500000 and 0.750000, and say what the three rows share. Then take 15.678751 ft2 back to its depth on that drum, and state what the engine returns when the area asked for is larger than the circle.
