# Choosing a cell size

The frame in the previous lesson followed from the control points and one number you chose: the cell size. That choice is not a display preference and it is not a performance setting. It is an interpretation decision, and it changes what the map says.

The trade is simple to state. Finer cells give a smoother-looking map, more nodes to store and more arithmetic to do. Coarser cells are faster and blockier. The interesting part is which numbers move when you change the setting and which ones do not.

## Three settings on the same six wells

Nothing about the Ekene control changes below. The same six picks, the same interpolation, the same extrapolation limit. Only the cell size changes.

| Cell size | Frame | Total nodes | Live nodes | Crest |
| --- | --- | --- | --- | --- |
| 50 m | 45 by 35 | 1575 | 794 | 1539.691 |
| 100 m | 25 by 20 | 500 | 201 | 1539.718 |
| 200 m | 15 by 13 | 195 | 50 | 1539.718 |

Check the frames against the rule from the previous lesson. In x the control spans 2000 m, so at 50 m that is 40 intervals, plus 1 for the fence-post, plus 4 for the two-cell pad on each side, which is 45. In y the control spans 1500 m, so 30 plus 1 plus 4 is 35. At 200 m the x direction gives 10 plus 1 plus 4, which is 15. The y direction is the interesting one: 1500 divided by 200 is 7.5, which is not a whole number, so the engine rounds up to 8, then adds 1 plus 4 to reach 13. The frame always covers the control, even when the cell size does not divide the span evenly.

Multiply the counts to confirm the totals: 45 times 35 is 1575, 25 times 20 is 500, and 15 times 13 is 195.

## The first lesson from the table

Look at the crest column. Across a factor of four in cell size, the shallowest depth on the map moves from 1539.691 to 1539.718, a difference of 0.027 m. Under 3 cm, in the third decimal place, on a surface that spans about 50 m of relief.

That is the expected result, and understanding why is the point of the table. The underlying surface is the same surface, defined by six control points and one interpolation rule, and neither of those changed. All that changed is how densely you sampled it. The fine grid puts a node closer to the true high point and reads a slightly shallower value; the coarse grid samples a little to the side and reads a hair deeper. The geology did not move.

## The second lesson from the table

Now look at the node columns, where the behaviour is completely different. Total nodes go from 1575 to 195, and live nodes from 794 to 50. The 50 m grid carries roughly sixteen times as many live values as the 200 m grid, for exactly the same amount of measured data.

So node counts are a property of the grid, not of the geology. This matters because node counts look like results. A summary panel reporting 794 live nodes reads as though something substantial was established, when the same field at a coarser setting reports 50. Neither number tells you anything about how well the field is understood. Six wells produced both.

The live fraction is worth a glance too: 794 of 1575 is about 50 percent, 201 of 500 is about 40 percent, and 50 of 195 is about 26 percent. The fractions differ because the extrapolation limit is a fixed distance in metres, so the same supported area gets chopped into different numbers of nodes.

## Presentation follows too

The effect reaches the drawn map. The app chooses a contour interval from the range of values present on the grid, aiming for about ten contours. At 50 m and at 100 m it settles on a 10 m interval. At 200 m it drops to 5 m.

The reason is the coarse lattice itself. At 200 m no node lands exactly on Ekene-4, the deepest well, so the deepest value the grid carries falls well short of that 1590 m pick. The range of values on the map is narrower, ten contours across a narrower range means a finer step, and the level chooser halves the interval. Nobody asked for a different contour interval. It fell out of a cell size decision made several steps earlier.

## The rule of thumb

Two bounds bracket a sensible choice.

Choose a cell noticeably finer than your control spacing. The Ekene wells sit roughly 1 km apart, so a 100 m cell puts about ten cells between neighbouring wells, which is plenty to render the shape of the surface between them without wasting effort. A cell close to the well spacing would blur the structure into a few blocks.

Never choose a cell so fine that the map implies detail the data cannot support. A 5 m grid over these six wells would produce hundreds of thousands of nodes and a beautifully smooth image, and every extra node would be interpolation. Fine cells do not add information. They only add places to write the same inference down.

Between those bounds the choice is yours, and the capstone fixes it at 100 m so that everyone's numbers agree. In your own work, state the cell size next to any node count you quote.

Try it yourself: set the cell size in the panel below to 50, then 100, then 200 m, and watch the node counts move while the surface stays where it is.

{{panel:mp-map-explorer}}

## Exercise

Predict the frame at a 250 m cell size for the Ekene control, then say which of the crest depth and the live node count you would expect to move most if you rebuilt the map at 50 m instead of 100 m.

As a self-check: in x, 2000 divided by 250 is 8, plus 1 is 9, plus 4 for the pad is 13 nodes. In y, 1500 divided by 250 is 6, plus 1 is 7, plus 4 is 11 nodes, so 13 by 11, which is 143 total nodes. The crest barely moves, from 1539.718 to 1539.691, because the surface is unchanged and only its sampling differs. The live count moves enormously, from 201 to 794, because it counts lattice positions rather than geology.
