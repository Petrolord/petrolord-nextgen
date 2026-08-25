# The two instruments

This lesson fixes the definitions and the sign conventions that the rest of the tier uses. They are simple and they are worth getting exactly right, because a residual reported with the wrong sign says the opposite of what was measured.

## The residual

$$\text{residual} = \text{predicted} - \text{actual}$$

Predicted first. That convention makes the sign easy to read once you know that depths in this course are **positive downward**.

A **positive** residual means the map predicted a **larger** depth than the well found, so the map put the horizon **too deep**. The real horizon is shallower than the map said.

A **negative** residual means the map predicted a **smaller** depth, so the map put the horizon **too shallow**. The real horizon is deeper than the map said.

On this field both cases occur, which is why the convention has to be nailed down before either number is quoted. The leave-one-out residual at Ekene-6 is $+9.84$ m, so the five-well map put that horizon nearly ten metres too deep. The blind residual at Ekene-7 is $-5.67$ m, so the six-well map put that horizon five and a half metres too shallow.

The opposite signs are not a contradiction. They are two locations where the interpolation erred in different directions, which is what interpolation between scattered control does.

## Leave-one-out, step by step

For a chosen well:

1. Remove it from the control set.
2. Grid the remaining wells, on **the same frame** and with **the same settings** as the full map.
3. Sample the resulting surface at the removed well's coordinates.
4. If a value comes back, the residual is that value minus the well's actual pick. If a blank comes back, the well cannot be cross validated and that is the result.

Step 2 is the one most easily got wrong. Regridding with a frame derived from the reduced control set changes the frame between runs, and then the residuals measure the frame as well as the interpolation. Derive the frame once, from the full control, and reuse it for every run.

Step 4 is the one this dataset makes interesting, and module 2 is about it.

## The blind test, step by step

1. Take the map that existed **before** the new well.
2. Sample it at the new well's coordinates.
3. The residual is that value minus the new pick.

There is no regridding and no frame question. The prediction is whatever the existing map said, and the only discipline required is not to rebuild the map first.

That discipline is easier to lose than it sounds. The natural instinct on receiving a new pick is to add it to the control and regrid, at which point the prediction that was about to be tested no longer exists anywhere.

**Record the prediction before the well is drilled.** On this field it is 1543.3271484375 m at (1500, 1500).

## Summarising residuals

With more than one residual, three summaries are standard and they answer different questions.

**The mean residual** measures **bias**: whether the map is systematically too deep or too shallow. A mean near zero with large individual values means the map is unbiased and imprecise.

**The mean absolute residual** measures typical error magnitude regardless of direction.

**The root mean square residual** also measures magnitude but weights large errors more heavily, so it is the more pessimistic of the two and the more common in reporting.

On Ekene there are two residuals, $+9.84$ and $-5.67$. The mean is $+2.09$ m, the mean absolute is $7.76$ m, and the root mean square is $8.03$ m. Module 2 explains why none of those three should be quoted as a field error estimate.

## Worked example

A map predicts 1620 m at a well that finds the horizon at 1608 m. State the residual with its sign and describe the error in words.

The residual is $1620 - 1608 = +12$ m. Positive, so the map put the horizon 12 m too deep, and the real horizon is 12 m shallower than the map said. If that location is on the flank of a prospect, the map has understated the structure there and the closure is larger than mapped.

## Exercise

State the residual convention, then give the sign and the plain-English reading of a prediction of 1541 m at a well that finds 1549 m. Say which of the two instruments that calculation belongs to if the well is new and the map predates it.

As a self-check: the residual is predicted minus actual, so this one is $1541 - 1549 = -8$ m, negative, meaning the map put the horizon 8 m too shallow and the real horizon is deeper than mapped. If the well is new and the map predates it, this is a blind test rather than a cross validation, because nothing was withheld and no regridding took place.
