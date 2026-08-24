# The crest moves

One of the six capstone fields is the crest of the map with Ekene-7 included. This lesson reads it, compares it against the Associate tier's crest, and connects the change to a problem that tier identified and could not resolve.

{{panel:mp-validation-explorer}}

## The two crests

| Control set | Crest depth | Location |
| --- | --- | --- |
| Six wells | 1539.7181396484375 m | (1400, 2000) |
| Seven wells | 1540.70556640625 m | (1400, 2200) |

The crest moved **0.9874 m deeper** and **200 m north**, from a node 300 m from Ekene-3 to one only 100 m from it. The capstone grades the seven-well figure to 0.1 m.

The deepest point did not move at all: it is 1590 m on both maps, because that is Ekene-4's own pick and an exact interpolator does not move a control point.

## Why this particular change matters

The Associate tier established that the six-well crest is a **spline overshoot**. Its 1539.7181 m is 1.2819 m shallower than the shallowest pick on the field, Ekene-3 at 1541 m, and it sits 300 m away from that well. No pick anywhere is as shallow as the crest the map claims.

That tier could describe the overshoot and could not do anything about it. It showed that refining the cell size does not remove it, and that changing the extrapolation limit does not either, because it is a property of the fitted surface rather than of the display.

Now one well has been added, and the overshoot has shrunk from 1.2819 m to **0.2944 m**, a reduction of 77 percent.

$$1541 - 1539.7181 = 1.2819 \qquad 1541 - 1540.7056 = 0.2944$$

## Why a well 700 m away fixed it

Ekene-7 at (1500, 1500) is about 510 m from the old crest node at (1400, 2000).

The overshoot exists because a minimum-bending surface, given a shallow pick at Ekene-3 and deeper picks in most directions around it, curves up past the shallow pick to reduce its bending energy. It is filling an information gap with curvature.

Ekene-7 puts a measurement into that gap, at 1549 m. That is a relatively deep value for the interior, and it constrains the surface between Ekene-3 and the south, removing much of the room the spline had to curve upward.

So the fix was not a better interpolator or a better setting. It was **data in the gap where the artefact lived**.

The migration of the crest says the same thing. On six wells the shallowest point of the map sat 300 m away from the shallowest well; on seven it sits 100 m away. As the room to overshoot shrinks, the mapped high moves back toward the pick that justifies it.

## The general result

> Spline overshoot is an information deficit, and it shrinks when control is added near it.

That is a more useful statement than the Associate tier could make, and it has an immediate practical use: if a mapped crest is an overshoot and the closure depends on it, the well that most reduces the uncertainty is one drilled between the crest and its nearest control, not one on the crest.

## What is still an overshoot

Nought point two nine metres of it. The seven-well crest is still shallower than any pick on the field, and the artefact is smaller rather than gone.

It will not go entirely. Any exact interpolator with a bending penalty will curve past its control somewhere, and the only question is by how much. Reporting the residual overshoot with the crest is the honest form: *crest 1540.71 m, which is 0.29 m shallower than the shallowest pick and therefore still partly an artefact of the fit.*

## Worked example

A prospect's mapped closure is 4 m and its crest is a spline overshoot of 1.3 m. What is the closure worth?

At most 2.7 m of it is supported by control, and the remaining 1.3 m is the interpolator. Since the blind test on this field showed a 5.67 m error at an interior location, even the 2.7 m is inside the demonstrated uncertainty.

The honest statement is that the mapped closure is not resolvable by this map, and that a well between the crest and its nearest control would both reduce the overshoot and test the closure directly.

## Exercise

State the crest of the seven-well map and by how much it moved, compute the remaining overshoot against the shallowest pick, and explain in one sentence why adding a well 700 m away reduced it.

As a self-check: the seven-well crest is 1540.70556640625 m at (1400, 2200), 0.9874 m deeper than the six-well crest of 1539.7181396484375 m at (1400, 2000) and 200 m closer to Ekene-3. Against the shallowest pick of 1541 m at Ekene-3 the remaining overshoot is 0.2944 m, down from 1.2819 m, a reduction of 77 percent. It shrank because the overshoot was the spline curving upward to fill an unconstrained gap about 510 m away, and Ekene-7's pick of 1549 m put a measurement into that gap, leaving the fit much less room to curve.
