# The contour interval changes

The depth map in this course is contoured at 10 m. The thickness map built from it is contoured at 2 m. This lesson explains where those intervals come from, why the difference is not a statement about precision, and how the same rule produces a genuinely misleading result on a coarse grid.

## Where the interval comes from

The panel does not choose 10 m or 2 m by judgement. It runs a rule: take the range of the surface, divide by ten, and round that **up** to the next nice number, one of 1, 2 or 5 times a power of ten.

On TOP_SAND the range is $1590 - 1539.7181 = 50.28$ m. A tenth of that is 5.03, which rounds up to 10, giving six levels from 1540 to 1590.

On the isochore the range is $35.8977 - 25 = 10.90$ m. A tenth of that is 1.09, which rounds up to 2, giving five levels: 26, 28, 30, 32 and 34.

## What the difference does and does not mean

The isochore's 2 m interval is five times finer than the depth map's 10 m interval, and it is tempting to read that as the thickness map being five times better resolved. It is not.

Both maps come from the same six wells, the same spline and the same mask. The thickness map has no extra information in it, and it certainly has no extra precision: it is the difference of two surfaces, so if anything its errors are the combination of theirs.

The interval is finer for one reason only: the range is smaller. Thickness varies over 11 m where depth varies over 50 m, so ten intervals across the thickness range are naturally narrower.

> A contour interval describes the range of the map, not the quality of the map.

That sentence is worth carrying, because a fine contour interval reads as authority on a printed map and a reader who has not thought about it will grant the thickness map a confidence it has not earned.

## The five-interval surprise

Count the isochore contours: 26, 28, 30, 32, 34. That is five levels, not ten, over a range the rule targeted at ten intervals.

Nothing is broken. The rule rounds the interval **up**, so the realised interval is always at least as wide as the target and the realised count is always at or below ten. Rounding 1.09 up to 2 nearly doubled the interval, which nearly halved the count.

How far below ten the count lands depends entirely on where the range happens to fall relative to the nice-number ladder of 1, 2, 5, 10 and so on. A range that gives a tenth of 1.01 rounds up to 2 and loses almost half its contours; a range that gives a tenth of exactly 2 keeps all ten. The rule delivers a readable map, not a fixed number of contours.

## The trap on a coarse grid

Now change the cell size to 200 m and re-read.

The isochore range shrinks, because the coarse grid loses Ekene-4's node and with it the 25 m minimum, so the map now runs from 26.733 to 35.898, a range of **9.16 m** rather than 10.90 m. A tenth of 9.16 is 0.92, which rounds up to **1**, and the map is contoured at 1 m intervals: 27, 28, 29 and so on up to 35, nine levels in all.

So the **coarsest** grid, the one with 50 live nodes instead of 201 and the least information in it, gets the **finest** contour interval and the most contour lines.

That is the same trap the Associate tier met when a 200 m cell produced a finer depth interval than a 100 m one. It is worth meeting twice, because the visual impression is exactly backwards: the map that looks most detailed is the one built from the fewest nodes.

## The defence

Two habits.

**Quote the interval and the cell size together.** A map contoured at 1 m from a 200 m grid and a map contoured at 2 m from a 100 m grid are not comparable, and only the pair says which is which.

**Fix the interval by hand when maps are to be compared.** Two vintages of the same horizon contoured by an automatic rule will differ in interval whenever the range changes, and a reader will see the difference in line density as a difference in the geology.

## Worked example

A thickness map runs from 12.4 m to 41.8 m. What interval will the rule choose, and how many levels will it draw?

The range is 29.4 m and a tenth of it is 2.94, which rounds **up** to 5. Levels run 15, 20, 25, 30, 35 and 40, which is six levels rather than the ten the rule targeted. The loss is worse than on the Ekene isochore, because 2.94 sits just above 2 and is pushed almost all the way to 5, nearly doubling the interval.

## Exercise

State the contour interval of the Ekene isochore and of the TOP_SAND map at the capstone cell size, explain in one sentence why they differ, and say what happens to the isochore interval at a 200 m cell.

As a self-check: the isochore is contoured at 2 m and TOP_SAND at 10 m, and they differ only because the isochore's range of 10.90 m is about a fifth of the depth map's 50.28 m, so ten intervals across it are five times narrower. At a 200 m cell the isochore loses the node at Ekene-4, its range falls to 9.16 m, a tenth of that rounds to a nice 1, and the coarsest grid ends up with the finest 1 m contour interval.
