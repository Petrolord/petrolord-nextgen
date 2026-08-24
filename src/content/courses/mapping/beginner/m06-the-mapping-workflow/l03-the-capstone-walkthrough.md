# The capstone walkthrough

The Associate capstone for this course is short. It grades six numbers, and every one of them is read off the map panel with the grid built at a 100 m cell on the Ekene control set. There is no essay, no free interpretation and no hidden data. If you have worked the five previous modules, the six numbers are already familiar.

This lesson walks each one, says where it comes from, and points out where learners lose marks.

## The six graded quantities

**The control-point count: 6.** The number of wells carrying a TOP_SAND pick and a map position. It comes from step 1 of the workflow, before any gridding happens, and it does not change with cell size or frame. This is a count, so it is graded exactly.

**The grid width: 25 nodes.** The number of columns across the frame at a 100 m cell, the frame being the control extent plus two cells of padding on each side. The companion number is 20 rows, and the product is the 500 node total. Also a count, also graded exactly.

**The mapped node count: 201.** The live nodes, meaning the nodes that survived the 800 m extrapolation limit and carry a depth. The other 299 are masked and blank. Notice that this number depends on the cell size in a way the first two do not, which is exactly why the capstone fixes the cell at 100 m.

**The crest: 1539.72 m.** The shallowest depth anywhere on the mapped, masked surface. Graded to a tolerance of 0.5 m, so anything between roughly 1539.2 and 1540.2 is accepted.

**The depth at prospect P-1: 1542.62 m.** The value the map returns at (1600, 1600), where nothing has been drilled. Also graded to 0.5 m.

**The contour interval: 10 m.** The spacing between contour lines on the map as drawn at this cell size, chosen to put a readable number of lines across the relief.

## Where marks are lost

Two of the six are counts with zero tolerance: the control-point count and the grid width. There is no partial credit on a count. Twenty four columns is wrong, and so is twenty six. If your frame does not come out at 25 by 20 at a 100 m cell, the fault is in the padding rule or the cell size rather than in your arithmetic, and it is worth rebuilding the grid rather than nudging the number.

The mapped node count behaves the same way but has a second trap. It is a count, so it must be exact, and it is the one number of the three counts that moves when the settings move. Read it from the panel with the cell at 100 m, not from a map you built earlier at a finer setting to see more detail.

The crest is the number most likely to be misunderstood, and it is worth being blunt about why. A learner who reports 1541 m has quoted Ekene-3's pick. That is a real measurement, carefully made, and it is not the answer, because the question asks for the shallowest depth on the map rather than the shallowest depth in the wells. The mapped crest is 1539.72 m, about 1.28 m shallower, because a smooth surface bending through six control points rises slightly above its highest pin. Reporting 1541 m is not a rounding error that the 0.5 m tolerance will absorb. It is the wrong quantity, and it falls outside the tolerance anyway.

The two depths are the only numbers where a tolerance exists, and 0.5 m is generous enough that reading carefully off the panel will always clear it. There is no need to chase decimal places.

## The order the server enforces

The capstone is the last thing you touch, and the platform makes that literal. The deep path runs in a fixed sequence and each gate is checked server side.

1. Read every lesson in a module. Lesson completion is recorded per lesson, and the module quiz does not open until the module's lessons are done.
2. Pass the module quiz at 75 percent. Three failed attempts trigger a 24 hour cooldown before you may try again, so a quiz is worth preparing for rather than probing.
3. Clear all six modules the same way.
4. Pass the final exam at 70 percent. The exam draws across the whole course, not just the last module.
5. Only then does the capstone unlock.

The cooldown is the rule most worth planning around. It exists so that the quizzes test understanding rather than persistence, and it means the cheapest strategy is also the intended one: read the lesson, work the exercise, then sit the quiz.

Passing the capstone grants the Associate certification for this course. That certification is a statement that you can take a set of well picks, build a defensible gridded surface, mask it honestly, and read specific numbers off the result. It is the foundation the Professional and Expert tiers build on.

Try it yourself: all six graded numbers are readable from the panel below with the cell size at 100 m.

{{panel:mp-map-explorer}}

## Exercise

Without opening the app, list the six graded quantities in the order given above and write the value and tolerance for each. As a self-check: control points 6, exact; grid width 25 nodes, exact; mapped nodes 201, exact; crest 1539.72 m, tolerance 0.5 m; depth at P-1 1542.62 m, tolerance 0.5 m; contour interval 10 m. Then answer in two sentences: why is 1541 m the wrong answer for the crest, and what would have to be true for the capstone to unlock at all? It is Ekene-3's measured pick rather than the shallowest mapped value of 1539.72 m; and the capstone unlocks only after every lesson is read, all six module quizzes are passed at 75 percent, and the final exam is passed at 70 percent.
