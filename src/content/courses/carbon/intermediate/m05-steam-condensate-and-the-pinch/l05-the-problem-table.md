# The problem table

The last Isiokpo record is four process streams. Some need cooling and some need heating, and the question the engine answers is how much outside heating and cooling the plant needs at the least, if the streams exchange heat with each other as far as they can. This lesson reads the problem table the digest prints for it.

{{panel:carbon-efficiency-explorer}}

## Four streams

SECTION 17 prints the streams, all invented for this course:

| stream | supply C | target C | CP kW/K |
| --- | --- | --- | --- |
| H1 compressor aftercooler | 163 | 48 | 3.15 |
| H2 lean oil cooler | 118 | 41 | 5.7 |
| C1 rich oil preheat | 32 | 141 | 4.35 |
| C2 stabiliser feed | 57 | 104 | 2.4 |

The digest's rule for telling them apart is one sentence: a stream is hot when its supply is above its target. H1 and H2 are hot, cooling from supply to target. C1 and C2 are cold, heating from supply to target. CP is each stream's heat capacity flowrate in kW/K.

SECTION 17 prints the totals: a total hot stream duty of 801.150 kW and a total cold stream duty of 586.950 kW.

## The minimum approach

In practice, heat passes from a hot stream to a cold one only across a temperature difference, and the minimum approach is the smallest difference a design allows. The engine is given it as an input. SECTION 17 prints the targets at three:

| minimum approach C | hot utility kW | cold utility kW | pinch hot C | pinch cold C | heat recovered kW |
| --- | --- | --- | --- | --- | --- |
| 10 | 1.800 | 216.000 | 118.000 | 108.000 | 585.150 |
| 15 | 25.950 | 240.150 | 118.000 | 103.000 | 561.000 |
| 20 | 59.700 | 273.900 | 118.000 | 98.000 | 527.250 |

Every row carries a balance check of 0.000 and a threshold problem of false.

A blank approach is refused: "REFUSED: A minimum approach temperature is required and must not be negative."

## The problem table at 15 C

SECTION 17 states how the table is built: hot streams are shifted down and cold streams up by half the minimum approach, and the cascade already carries the hot utility at the top.

| top shifted C | bottom shifted C | CP hot kW/K | CP cold kW/K | surplus kW | heat flow below kW |
| --- | --- | --- | --- | --- | --- |
| 155.500 | 148.500 | 3.150000 | 0.000000 | 22.050 | 48.000 |
| 148.500 | 111.500 | 3.150000 | 4.350000 | -44.400 | 3.600 |
| 111.500 | 110.500 | 3.150000 | 6.750000 | -3.600 | 0.000 |
| 110.500 | 64.500 | 8.850000 | 6.750000 | 96.600 | 96.600 |
| 64.500 | 40.500 | 8.850000 | 4.350000 | 108.000 | 204.600 |
| 40.500 | 39.500 | 5.700000 | 4.350000 | 1.350 | 205.950 |
| 39.500 | 33.500 | 5.700000 | 0.000000 | 34.200 | 240.150 |

Each row is one shifted temperature interval, from its top to its bottom. SECTION 17 prints the cascade rule, checked on every row: each interval's surplus is (CP hot less CP cold) times its width, and the heat flow below an interval is the heat flow above it plus its surplus, starting from the hot utility at the top.

Read down the last column. It starts from the hot utility, 25.950 kW at this approach, reaches 0.000 at the bottom of the third interval, 110.500 shifted, and ends at 240.150 kW. The digest states that the heat flow out of the bottom is the cold utility, and the 15 C row prints 240.150 kW.

The shifting is why two temperatures are reported for one pinch. SECTION 17 states that the heat flow is zero at shifted 110.500 C, inside the range, and reports the pinch as 118.000 C on the hot side and 103.000 C on the cold side.

## What the balance check says

Each approach row prints a balance check of 0.000. SECTION 17 states what it is: (hot utility plus hot stream duty) less (cold utility plus cold stream duty), heat in less heat out, 0.000 when the targets close. It also prints heat recovered as the hot streams' duty less the cold utility: 801.150 less 240.150 is 561.000 kW. Lesson six reads what the zero at 110.500 shifted means, and why a zero at the end of a cascade is read differently.

## Exercise

Read the problem table at 15 C in SECTION 17. Say what the heat flow below the last interval is and which figure in the 15 C targets row it matches, at which shifted temperature the heat flow reaches 0.000, and what the digest's rule about shifting says about the two temperatures at which the pinch is reported.
