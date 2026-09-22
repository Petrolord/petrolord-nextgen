# The capstone walkthrough

The Associate capstone for this course is short. Its brief gives you a well set of its own: every well's name, map position and TOP_SAND pick, a prospect location and a cell size. It grades six numbers, and every one of them is read off the map panel once you have typed that case into it. There is no essay and no hidden data.

The map panel opens on the Ekene wells at a 100 m cell, which is this course's teaching case. None of its numbers is a capstone answer. This lesson walks the six fields, works each one on Ekene so you can see where it is read, and points out where marks are lost.

## Setting the case

Choose "Type a well set". The box takes one well per line: name, x, y, TOP_SAND pick, BASE_SAND pick, separated by commas. It starts from the Ekene wells so it is never blank; replace every line with the brief's wells. Then type the prospect's x and y and the brief's cell size. Read the subtitle: it says how many wells the map was gridded from and at what cell.

## The six graded fields, worked on Ekene

**The grid width, 25 nodes, and the grid height, 20 nodes.** The columns and rows of the frame: the control extent plus two cells of padding on each side, at the chosen cell. Both are counts, graded exactly. Module 2 works the rule by hand; run it on the brief's wells as a check on the tiles.

**The mapped node count, 201.** The live nodes, the ones that survived the 800 m extrapolation limit and carry a depth. This number depends on the cell size in a way the well picks do not, which is why every brief states its cell.

**The crest, 1539.72 m.** The shallowest depth anywhere on the mapped, masked surface.

**The depth at the prospect, 1542.62 m at P-1.** The value the map returns at the prospect, where nothing has been drilled.

**The mean mapped depth.** The average over the live nodes, printed to four decimals. It weights by area, not by well.

## Where marks are lost

Three of the six are counts with zero tolerance. If your frame does not come out where the tiles say, the fault is in the padding rule or the cell size rather than in your arithmetic: rebuild the grid rather than nudging the number.

The live count has a second trap: it moves when the settings move. Read it with the brief's cell, not from a map you built earlier at a finer setting to see more detail.

The crest is the number most likely to be misunderstood. On Ekene a learner who reports 1541 m has quoted Ekene-3's pick. That is a real measurement and it is not the answer, because the question asks for the shallowest depth on the map rather than in the wells. A smooth surface bending through its control points rises slightly above its highest pin. On the capstone's wells, check the crest against the shallowest pick before you type it: they should differ.

The depths are graded tightly because the panel prints them to four decimals. Copy the tile.

## The order the server enforces

The capstone is the last thing you touch, and the platform makes that literal. The deep path runs in a fixed sequence and each gate is checked server side.

1. Read every lesson in a module. Lesson completion is recorded per lesson, and the module quiz does not open until the module's lessons are done.
2. Pass the module quiz at 75 percent. Three failed attempts trigger a 24 hour cooldown before you may try again, so a quiz is worth preparing for rather than probing.
3. Clear all six modules the same way.
4. Pass the final exam at 70 percent. The exam draws across the whole course, not just the last module.
5. Only then does the capstone unlock.

Passing the capstone grants the Associate certification for this course. That certification is a statement that you can take a set of well picks, build a defensible gridded surface, mask it honestly, and read specific numbers off the result.

Try it yourself: reproduce the Ekene values on the panel below, then choose "Type a well set", delete one well's line and watch every count move.

{{panel:mp-map-explorer}}

## Exercise

Without opening the app, list the six graded quantities in the order given above with the unit of each. Then answer in two sentences: why is the shallowest pick the wrong answer for the crest, and which of the six would change if the brief's cell size were halved?

As a self-check: grid width in nodes, grid height in nodes, mapped nodes as a count, crest in m, depth at the prospect in m, mean mapped depth in m. The shallowest pick is a measurement at one well, while the crest is the shallowest value of the whole mapped surface, which a smooth interpolator can push above every pin. Halving the cell changes the three counts at once and moves the mapped depths slightly; the picks themselves do not move.
