# Doglegs and tension

The product, and what each factor contributes.

## The expression again

    side force from curvature = T x (angle change per unit length)

Both factors are needed and neither is sufficient.

## What a dogleg costs, per unit of tension

A dogleg severity of 3 degrees per 30 m is 0.1 degrees per metre, which is 0.001745 radians per metre.

So each newton of tension passing through it contributes 0.001745 N per metre of side force. At 400 kN of tension that is 698 N per metre, which is the right order for the build-and-hold well's hump.

Double the dogleg and you double the side force at the same tension. Double the tension and you double it again.

## The design consequence

A trajectory designer has a choice about where to put the build. Putting it shallow means the string above it is short, so the tension there is low, so the side force is low.

Putting the same build deep means the whole string above it is pulling through it. That is why a deep kick-off with a hard build is expensive in torque and drag even when the geometry closes.

The Well Design and Surveys course treats the kick-off depth as a geometric trade. This course is the other half of that trade.

## Where the tension comes from

At any point, the tension is the buoyed weight of the string BELOW that point resolved along the hole, plus whatever friction has accumulated below it, plus or minus the bit boundary condition.

So the tension at the top of a build is roughly the weight of everything below the build. On a well where the build is at 1500 m and total depth is 3500 m, that is 2000 m of string, which is most of the string's weight.

## The interaction that makes long wells hard

The deeper the well, the more tension at any given dogleg. The more tension, the more side force. The more side force, the more friction, which adds more tension above.

That compounding is why torque and drag grow faster than linearly with measured depth on a deviated well, and why extended reach drilling has a limit rather than just being expensive.

## The one place it does not compound

A vertical hole. No curvature, so no matter how much tension accumulates, no side force is produced by it. That is why the vertical section of a well is essentially free, and why deep vertical wells are limited by pipe strength rather than by drag.

## Exercise

Take a well with a build of 3 degrees per 30 m through which 600 kN of tension passes, and compute the side force per metre from the curvature term.

Then compute what it would be if the same build were placed 1000 m shallower, assuming the string weighs 265.26806749988424 N per metre buoyed and the hole there is at 45 degrees.
