# The 180 fixed nodes

Run the clamp on this model and it reports one count per surface. The counts are the first real diagnostic the framework produces, and on this model they read:

| surface | nodes fixed by the clamp |
|---|---|
| TopA  | 0 |
| TopB  | 0 |
| BaseB | 180 |

Written as the engine returns them, the counts are [0, 0, 180]. This lesson reads all three of those numbers.

## Nothing fixed on TopA

TopA is the top of the stack, so this zero is guaranteed by construction. There is no surface above it to be compared against, the clamp accepts whatever depth it finds, and the count can never be anything but zero. A nonzero count on the shallowest surface of a framework would mean the code had a bug rather than the data had a problem.

## Nothing fixed on TopB

This zero is earned rather than guaranteed, and it is real information. It says that at every one of the 500 nodes, the resampled TopB came out at or below the resampled TopA on its own, with no help from the clamp. Two surfaces interpreted separately, resampled from two different source grids at two different cell sizes, agreed about their order everywhere.

That is what a well behaved pair of surfaces looks like, and it is worth noticing so that you have something to compare the third count against. Zone A, which lies between these two, is the zone that never needed a repair.

## 180 fixed on BaseB

The third count is the one that carries the geology. On 180 of the 500 nodes of the frame, the resampled BaseB arrived shallower than TopB, and the clamp brought it onto TopB.

180 out of 500 is 36 percent of the model. That is not a rounding artefact, not a handful of edge nodes and not a numerical nuisance. Over a third of your model frame needed geometric repair before the framework was legal.

One caution while that number is in front of you. The 36 percent here and the 36 m mean thickness of zone A that you will meet in the next module have nothing to do with each other. They are different quantities in different units that happen to share two digits, and it is worth being careful with your labels when you write both of them into the same report.

## What the 180 nodes are

The 180 nodes are the pinch-out of zone B.

At each one of them BaseB now carries exactly TopB's depth, so the thickness of zone B there is exactly zero. Zone B is not thin at those nodes. It is absent. Elsewhere on the frame the two surfaces stay apart and the zone has real thickness, and the boundary between the two regions is a pinch-out line, which is one of the most ordinary features in stratigraphy.

You will confirm this from the other direction in the next module, where the zone B thickness grid turns out to be positive at 320 nodes and zero at the remaining 180. Those are the same 180 nodes. A clamp count and a count of zero-thickness nodes are two views of one piece of geology.

## The shared maximum

The clearest fingerprint of the clamp is in the surface statistics. Here are the three surfaces after clamping, over all 500 nodes of the model frame.

| surface | mean (m) | min (m) | max (m) | live nodes |
|---|---|---|---|---|
| TopA  | 1539.500000 | 1500 | 1579 | 500 |
| TopB  | 1575.500000 | 1530 | 1620.9999999999998 | 500 |
| BaseB | 1585.740000 | 1561 | 1620.9999999999998 | 500 |

Look at the two maxima. TopB reaches a deepest value of 1620.9999999999998 m, and BaseB reaches exactly the same deepest value, to the last digit.

For an ordinary pair of surfaces that would be a startling coincidence. Here it is a certainty, because the two numbers are the same number. Where zone B has pinched out, BaseB has been brought onto TopB, and the clamp does not compute a new value when it makes that repair. It copies TopB's depth across. Two copies of one double precision number agree to every digit they carry, which is what the table is showing you.

It also tells you where the pinch-out sits structurally. BaseB is never deeper anywhere on the frame than TopB is at its deepest point, and since BaseB has to be at least as deep as TopB at every node, the deepest part of TopB must be one of the places where zone B has gone. At least part of the pinch-out therefore sits at the structurally lowest part of the model.

## Reading the trailing digits

Do not let 1620.9999999999998 distract you. It is 1621 m. The value came out of a resampling that adds up weighted contributions from four neighbouring nodes, and double precision arithmetic leaves a residue in the final digit. The difference from 1621 lands in the thirteenth decimal place, which is a length far smaller than anything in geology.

The rule is the same one you will use everywhere in this course. Report the number at a precision the measurement supports, which here is 1621 m or 1621.0 m. Never edit the stored value to make it look tidy, because the stored value is what every check downstream compares against.

The panel below shows the three clamped surfaces on the model frame together with the framework statistics, so you can see where the clamp did its work.

{{panel:em-framework-explorer}}

## Exercise

From the counts and the statistics table, work out what share of the frame the clamp repaired, and explain in two sentences why BaseB has no value deeper than 1620.9999999999998 m anywhere on the model.

Self check: the clamp fixed 180 of the 500 nodes on BaseB, which is 36 percent of the frame, and it fixed nothing on TopA or TopB. BaseB cannot be deeper than 1620.9999999999998 m because that value is BaseB's maximum over all 500 nodes, and it is the same number as TopB's maximum, which happens because at the deepest node of TopB zone B has pinched out and BaseB is carrying a copy of TopB's depth rather than a value of its own.
