# One frame, two surfaces

Two grids can only be combined if they agree, node for node, about where they are. This lesson is about what that agreement requires, how this course guarantees it, and what goes wrong when it is assumed rather than checked.

## What a frame is

The Associate tier called it the grid frame and it is five numbers: an origin $(x_0, y_0)$, a cell size $(dx, dy)$, and a node count $(n_x, n_y)$. For the Ekene capstone those are $(400, 800)$, $(100, 100)$ and $(25, 20)$, giving 500 nodes covering 2400 m east to west and 1900 m north to south.

Node $(r, c)$ of that grid sits at $x_0 + c\,dx$ and $y_0 + r\,dy$, and nowhere else. The frame is what turns an array of numbers into a map.

## Why both surfaces must share it

Subtracting two grids means subtracting element $i$ of one array from element $i$ of the other. The arithmetic does not know or care what those elements mean. If the two grids have different origins, element $i$ of the first is a different place on the ground from element $i$ of the second, and the difference is the thickness between two locations that have nothing to do with each other.

The result of that mistake is not an error message. It is a smooth, plausible, entirely contoured map of nothing, and it will pass every visual inspection because a spline surface minus a shifted copy of another spline surface still looks like a map.

Three things must match, and all three matter.

**The origin.** A half-cell offset between two grids puts the whole isochore 50 m out of place and biases every value by the local gradient times 50 m.

**The cell size.** Different cell sizes give different node counts, so the arrays are not even the same length. That one usually fails loudly.

**The node count.** Same origin and cell size but a different extent, and the arrays are different lengths again, or worse, the same length by coincidence and misaligned by whole rows.

## How this course guarantees it

The teaching workflow computes the frame once, from the TOP_SAND control points, and passes **the same frame object** to both gridding calls. It does not compute a frame for the top, compute a frame for the base, and compare them.

That distinction is worth dwelling on. Computing two frames and checking that they agree is a test that can pass by luck and fail on the day a well is added. Computing one frame and reusing it is a construction that cannot disagree with itself.

On this dataset the two would in fact agree, because the frame is derived from the control point locations and the six wells carry both picks at the same coordinates. But that is a property of this dataset rather than of the method. A base pick missing from one well would shrink the base surface's own frame while leaving the top's alone, and the two maps would silently stop being comparable.

## The general rule

> Derive the frame once, from the union of everything you intend to combine, and reuse it.

In a real project that means deciding the frame at the start of the mapping campaign, from the full well set and the intended area, and gridding every surface onto it. It is a small amount of discipline that removes an entire family of undetectable errors.

## Worked example

A colleague grids TOP_SAND on a frame with origin (400, 800) and a 100 m cell, and BASE_SAND on a frame with origin (400, 900) and the same cell size and node count, having built the second frame from a well set that omitted Ekene-1. They subtract the arrays and report a mean thickness of about 32 m. Is the answer usable?

No. The origins differ by 100 m in $y$, exactly one cell, so every subtraction pairs a base node with the top node one row to the south of it. The mean can still come out near the right value, because the surfaces are smooth and a one-cell shift is small compared with the interval thickness, which is exactly what makes the error dangerous. Local values are wrong by the north-south gradient of the top surface times 100 m, which on this field reaches several metres, and the thickest and thinnest spots move.

The check that catches it is to compare the two frames field by field before subtracting, and the construction that prevents it is not to build two frames at all.

## Exercise

State the five numbers that define the Ekene capstone frame, then explain in two sentences why subtracting grids with different origins produces a map that looks correct but is not.

As a self-check: the frame is origin (400, 800), cell 100 m by 100 m, and 25 by 20 nodes, giving 500 nodes over 2400 m by 1900 m. Subtracting misaligned grids pairs each node of one surface with a node of the other that sits somewhere else on the ground, so every value in the result is a difference between two unrelated locations; it looks correct because a smooth surface minus a shifted smooth surface is still smooth, so the output contours cleanly and nothing about its appearance announces the problem.
