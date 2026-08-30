# The case that settles it

A third source, and what it says about the residual.

{{panel:td-string-explorer}}

## The problem

Two implementations converge on answers 32.65 N apart. Refinement does not close the gap. Neither can be preferred over the other by any comparison between them.

That is where most model comparisons stop, with a statement that the two agree to five significant figures and a shrug about the sixth.

## The third source

The vertical well.

No curvature, no inclination, therefore no side force, therefore no friction. The hookload is the buoyed weight of the string, and that is arithmetic:

    896824.4970405255 x 0.8165605095541402 = 732311.468284047 N

Nobody has to integrate anything.

## The verdict

| source | hookload | error against the closed form |
|---|---|---|
| closed form | 732311.468284047 N | 0 |
| this engine | 732311.4682840434 N | -3.6088749766349792e-9 N |
| the oracle | 732354.090721511 N | 42.6224374640733 N |

The engine reproduces the closed form to four nanonewtons at every step size tested, including 10 m.

The oracle is 42.6 N away, which is six parts in a hundred thousand.

## What that establishes

That the oracle carries a discretisation error of a few tens of newtons even on a case with no friction in it, and that error is the same order as the residual disagreement on the slant and build wells.

So the most likely explanation of the residual is the oracle's own integration, and the engine is the more accurate of the two.

## What it does NOT establish

That the engine is right on the FRICTION terms, because the vertical well has none.

The vertical case exercises the weight integral, the buoyancy factor, the string composition lookup and the depth grid. It touches nothing else. So it settles the residual only if the residual comes from the weight integral, which is plausible and is not proved.

Saying so is the honest position, and it is a better one than either "the engine is right" or "we do not know".

## The general lesson

When two implementations disagree and neither has a closed form, look for a degenerate case that does.

Zero friction, zero inclination, zero rate, infinite time: models usually have one, and the one they have is usually cheap to run. It will not settle everything, and it settles more than a comparison between the two can.

## Exercise

List the parts of the calculation the vertical well does NOT exercise.

Then propose a second degenerate case that would exercise the friction terms and have a closed-form answer, and say whether the fixture set in this course contains one.
