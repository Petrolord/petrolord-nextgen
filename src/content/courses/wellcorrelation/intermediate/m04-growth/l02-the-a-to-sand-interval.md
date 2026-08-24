# The A to SAND interval

One interval carries this tier. It runs from TOP_A down to TOP_SAND, it is present in all four wells, and it is the interval the flattening datum was chosen to display. Across the Ekene section it measures 48, 53, 46 and 60 m. Ekene-4 carries the thickest at 60 m, which is one of the six graded readings, and Ekene-3 the thinnest at 46 m.

## What the interval represents

TOP_A is a correlatable surface above the reservoir sand. TOP_SAND is the top of the sand itself. The section between them is whatever accumulated at each well location between the time the TOP_A surface formed and the time the sand began to arrive. Its thickness is a record of how much room there was to fill at that spot over that stretch of the section.

This is the interval to work with for two reasons that have nothing to do with geology. It is complete, present in all four wells including Ekene-4, so nothing has to be excluded or caveated. And it sits directly beneath the flattening top, so its variation appears on the panel as the position of a single line.

## The four numbers

Compute each one from the pick table as TOP_SAND measured minus TOP_A measured.

| well | TOP_A measured | TOP_SAND measured | A-to-SAND interval | TOP_SAND displayed |
|---|---|---|---|---|
| Ekene-1 | 1500 | 1548 | 48 | 1498 |
| Ekene-2 | 1512 | 1565 | 53 | 1503 |
| Ekene-3 | 1495 | 1541 | 46 | 1496 |
| Ekene-4 | 1530 | 1590 | 60 | 1510 |

Ekene-4's 60 m is graded to 0.01 m, so reproduce it cold: 1590 minus 1530. It is the largest of the four. Ekene-3's 46 m is the smallest. The two are 14 m apart, which is the subject of the next lesson.

Read the last column against the third and the relationship from the previous lesson is visible: 1450 plus 48 is 1498, 1450 plus 53 is 1503, 1450 plus 46 is 1496, and 1450 plus 60 is 1510. The displayed sand line is the interval, drawn from the datum.

## The shape across the section

The wells sit left to right in the order Ekene-1, Ekene-2, Ekene-3, Ekene-4, so the interval reads 48, 53, 46, 60 across the panel. That is not a one-way trend. It rises from Ekene-1 to Ekene-2, falls to its minimum at Ekene-3, then jumps to its maximum at Ekene-4. Two things follow.

The first is a caution about language. Saying "the interval thickens towards Ekene-4" is a fair description of where the maximum is, but it is not a description of a gradient, because Ekene-3 sits between the second and fourth wells and is the thinnest of all. If you want to describe a direction of thickening you need more than four points, or you need to say which pairs of wells you are comparing.

The second is a caution about the space between wells. Four wells give four samples of a continuous quantity. Nothing in this data says whether the interval changes smoothly from 46 m at Ekene-3 to 60 m at Ekene-4 or steps abruptly somewhere between them, and nothing says what it does beyond the ends of the section. The four numbers are honest and the curve through them is a choice.

## Why this interval and not the sand itself

The sand, from TOP_SAND down to BASE_SAND, is also present in all four wells and also varies: 32, 36, 29 and 25 m for Ekene-1 through Ekene-4. It is a perfectly good interval to study, and in a reservoir context it is the one that pays. It is not the one this datum displays, because flattening on TOP_A puts the sand top on the moving line rather than on the datum line, so the sand's variation has to be computed rather than seen. Choose the flattening top to suit the interval you want to look at, and here that interval is A-to-SAND.

## Two ways this reading goes wrong

**Reading the displayed column as the interval.** The displayed depths, 1498 to 1510, are four-digit numbers in the 1500 band and the intervals are two-digit numbers in the 50 band, so the confusion is rarely silent. It becomes silent when someone takes the displayed spread, 1510 minus 1496, and calls that the interval. It is not the interval. It is the spread of the intervals, which is a different quantity with a different meaning, and the next lesson is about it.

**Mixing wells.** The subtraction has to stay inside one column. Take Ekene-4's TOP_SAND at 1590 and Ekene-3's TOP_A at 1495 and you get 95, a number that means nothing. On a panel where the wells are side by side and the picks are aligned by name, this is easier to do than it sounds, particularly when reading with a cursor rather than from a table.

The defence for both is to write the two measured picks down, with the well name, before subtracting anything.

The panel below flattens on the top and datum you choose and lists each well's interval next to its shift and displayed depths.

{{panel:wc-flatten-explorer}}

## Exercise

Compute all four A-to-SAND intervals from the measured picks without looking at the table, then name the well with the thickest and the well with the thinnest. Then compute, for each well, the displayed depth of TOP_SAND as 1450 plus that well's interval, and check the four answers against the table.

Self-check: Ekene-1 gives 1548 minus 1500, which is 48 m. Ekene-2 gives 1565 minus 1512, which is 53 m. Ekene-3 gives 1541 minus 1495, which is 46 m. Ekene-4 gives 1590 minus 1530, which is 60 m, the graded value. The thickest is Ekene-4 at 60 m and the thinnest is Ekene-3 at 46 m. Adding each to the datum gives 1498, 1503, 1496 and 1510 m displayed, matching the table in every row. If one row disagrees, the shift used for that well was not 1450 minus its own TOP_A.
