# The contour interval

The contour interval is the depth step between one contour line and the next. On the Ekene map it is 10 m, which means the drawn lines are at 1540, 1550, 1560, 1570, 1580 and 1590 m, and nothing in between.

The first thing to understand about the interval is that it is a choice. Nothing in the six picks, and nothing in the gridded surface, determines it. The data fixes what the surface is. The interval fixes how finely you look at it. Two people can grid identical data and hand you maps that look completely different, purely by choosing differently here, and neither of them has done anything wrong.

## How the engine chooses

The engine is given the range of the mapped values and a target number of lines, which defaults to about ten. It divides the range by the target to get a raw step, then rounds that raw step up to the nearest round number, meaning the nearest number of the form 1, 2 or 5 times a power of ten. So candidate steps are 1, 2, 5, 10, 20, 50, 100 and so on. It then lays the levels out on multiples of that step, starting at the first multiple at or above the shallowest mapped value and continuing until it passes the deepest.

Rounding up is the important part. It guarantees the levels land on values a human can read off a map, and it guarantees you get at most the target number of lines rather than more. It also means the actual line count can be noticeably below the target, which is exactly what happens on Ekene.

## Ekene at a 100 m cell

Work it through with the fixture numbers. The mapped surface runs from a crest of 1539.72 m to a deepest mapped value of 1590 m, so the range is about 50 m. Divide by the target of ten and the raw step is a little over 5. Round up to the nearest round number and 5 is not enough, so the step becomes 10 m.

Now lay out the levels. The first multiple of 10 at or above 1539.72 is 1540. Add the step repeatedly: 1550, 1560, 1570, 1580, 1590. That is six contour lines to cover a 50 m range that asked for ten, and the shortfall is entirely the price of round numbers. Six readable lines beat ten awkward ones at 5.03 m spacing.

That 10 m interval is one of the six numbers the capstone asks you to report, so it is worth being able to reconstruct rather than remember. Range about 50, target ten, raw step just over 5, rounded up to 10.

## The choice follows the data

The interval is not a fixed property of the Ekene field. It follows from the mapped range, and the mapped range depends on how the grid was built.

Coarsen the cell to 200 m and the frame drops to 195 nodes with only 50 of them live. The nodes now sit 200 m apart, so the sample points no longer land as close to the extremes of the surface. The crest still reads 1539.718 m, but the deepest mapped value comes in shallower than the 1590 m that the 100 m grid captured, because at 200 m spacing there is no node sitting on Ekene-4's own location. The mapped range narrows below 50 m, the raw step falls to 5 or less, and the rounding rule now returns 5 rather than 10. The same field, the same six picks, the same algorithm, and a different contour interval, purely because the grid changed.

This is not a defect. It is the interval doing its job, which is to track the range actually present in the thing being drawn. But it is a reason to state the cell size whenever you state the interval.

## Too coarse, too fine, and dishonest

Three failure modes are worth naming.

Too coarse an interval hides structure. Draw the Ekene map at 50 m and you get a single contour line for the entire field. A 20 m closure would be invisible, not because it is absent but because no line was drawn at a value that would reveal it. Low relief structures disappear first, and low relief structures are precisely the ones that need careful mapping.

Too fine an interval buries the map in ink. Draw Ekene at 1 m and you have about fifty lines crowded into the same area, the steep northeast flank becomes a solid black band, and the labels stop fitting. Detail beyond the accuracy of the underlying grid is not detail, it is noise given the dignity of a printed line.

The third failure is the one to watch for in other people's work. Comparing two maps drawn at different intervals is a standard way to be misled, and it is easy to do by accident. A prospect map at a 5 m interval looks dramatically more structured than the regional map at 25 m it came from, and a reader who does not check the legend will read that as new information. Presented on facing pages, the flank that looks twice as steep may simply have five times as many lines across it. Before comparing two maps, read both legends and confirm the interval and the cell size match. If they do not, the maps are not comparable until one is redrawn.

Try it yourself: change the cell size in the panel below and watch the contour interval change with the mapped range.

{{panel:mp-map-explorer}}

## Exercise

Suppose a mapped surface runs from 2100 m to 2340 m and you ask for about ten lines. Work out the interval the engine would choose and list the levels. As a self-check: the range is 240 m, the raw step is 24 m, rounding up to the nearest round number of the form 1, 2 or 5 times a power of ten gives 50 m, and the levels are 2100, 2150, 2200, 2250, 2300, which is five lines, half the target. Then answer in one sentence: why did asking for ten lines produce five? Because rounding the step up rather than down always produces at most the requested number, and here it nearly doubled the step.
