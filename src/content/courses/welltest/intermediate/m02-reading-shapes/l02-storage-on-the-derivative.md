# Storage on the derivative

The one regime that is unmistakable, and the transition after it that is not.

{{panel:wt-diagnostic-explorer}}

## The unit slope

During pure wellbore storage, the pressure change and its derivative are the SAME quantity:

    dp = q B t / (24 C)     and     d(dp)/d(ln t) = t d(dp)/dt = q B t / (24 C)

They are identical. On a log-log plot the pressure curve and the derivative curve lie exactly on top of each other, both on a line of slope 1.

That coincidence is the most reliable diagnostic feature in well testing. When the two curves overlie at early time on a unit slope, the well is storage-dominated and the storage coefficient can be read straight off:

    C = q B t / (24 dp)

taken anywhere on the unit slope.

## The hump

After the unit slope, the derivative rises above the pressure curve, peaks, and falls towards the radial plateau. That hump is the transition out of storage and it is not a regime.

Its height depends on the skin. A damaged well makes a tall, sharp hump; an undamaged one makes a low, broad one. The classical type-curve matching methods of the 1970s and 1980s used exactly this: the shape of the hump, parameterised by a dimensionless group combining storage and skin, was matched against a family of curves to get both.

The engine's model catalog carries the same physics in its Laplace-space solutions, and the Expert tier's regression fits the hump directly rather than matching it by eye.

## How long the transition lasts

Long. The classical rule is that radial flow does not begin until roughly one and a half log cycles after the end of the unit slope, and on a well with a large storage coefficient and a large skin it can be more.

On the buildup in this course, differentiated against equivalent time, the derivative does not settle until several hours of shut-in. Out of 40 recorded points, twelve are on the plateau.

That is the quantitative version of the Associate tier's window problem. Three quarters of the data in a well-run test can be unusable for a semilog analysis, and the engineer under pressure to report a number has all of it in front of them.

## What the falling transition does to a classifier

Here is the part that matters for the next lesson.

Between the top of the hump and the radial plateau, the derivative FALLS. On a log-log plot that fall has a steeply negative local slope.

The classifier's constant-pressure band is "slope at or below minus 0.35". The storage-to-radial transition sits squarely inside it.

So on the buildup and the drawdown fixture, which are infinite-acting reservoirs with no boundary of any kind, a slope band alone would call that fall a constant-pressure boundary. It is not a boundary. It is the well emptying its own transition, and the engine now says so: it reports the stretch as a transition, because a constant-pressure boundary with radial flow AFTER it is a contradiction. The next two lessons are about that rule and the one case it cannot reach.

## Reading the storage coefficient

Worth doing at least once by hand, because it is the one parameter a derivative plot gives you directly.

Take the earliest point of the drawdown fixture: at 0.01 hours the pressure change is 14.964533738662812 psi. If that point is on the unit slope,

    C = 450 x 1.25 x 0.01 / (24 x 14.964533738662812) = 0.01566 bbl/psi

against a planted 0.015. Close, and slightly high, because even the first recorded point is not on the pure unit slope: the reservoir has already begun to contribute.

That is the general shape of every early-time reading in this course. The asymptote is approached, not reached, and the direction of the error is predictable.

## The misconception to avoid

"The storage period is the unit slope." The storage period is the unit slope PLUS the transition, and the transition is the longer of the two. Choosing a semilog window that starts where the unit slope ends is a standard error and it lands you squarely in the steepest part of the transition, which is exactly the data that inverted the skin in the Associate tier.

## Exercise

Open the panel on the drawdown fixture and find the time at which the pressure and derivative curves stop lying on top of each other.

Then find the time at which the derivative becomes flat. State both, take the ratio, and compare it against the classical rule of one and a half log cycles.
