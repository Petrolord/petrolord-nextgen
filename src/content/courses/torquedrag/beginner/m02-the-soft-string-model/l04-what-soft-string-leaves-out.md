# What soft string leaves out

Four things the model does not have, and how much each one costs.

## Bending stiffness

The big one, and the one the model is named after.

A real pipe passing through a dogleg does not conform to it smoothly. It bridges the curve, touching at discrete points and standing off the wall in between. At each contact point the force is higher than the smeared soft-string value, and between them it is lower.

The total is similar. The distribution is not, and the distribution is what matters for casing wear, for local buckling and for fatigue.

The rule of thumb is that stiffness matters when the dogleg severity is high, when the pipe is large relative to the hole, and when the component is short and stiff. Drill collars in a tight build are the worst case; drill pipe in a gentle build is where soft string is closest.

## Dynamics

The model computes a steady state. A real string is doing none of these things steadily.

**Stick-slip.** The bit stops, the string above keeps turning and winds up, then the bit breaks free and spins fast. Surface torque oscillates by a large fraction of its mean, and the model reports the mean.

**Whirl.** The string orbits inside the hole instead of spinning about its own axis, which multiplies the contact force and the wear.

**Axial oscillation.** The string bounces. Instantaneous weight on bit swings.

Every one of those makes the real loads higher than the computed ones, sometimes by a lot.

## The difference between static and kinetic friction

The model has one friction factor. Real contact has a higher static coefficient than a kinetic one, which is why a string that has been stationary takes more force to start moving than to keep moving.

That is what a driller is watching for when the string will not break over. It is outside the model.

## Hydraulic and thermal effects

Pressure inside and outside the string produces piston forces at every change of diameter and a ballooning effect along the length. Temperature changes the length of the string. Both are real, both are second order for a drill string, and both are first order for a completion string, which is why completion analysis uses a different model.

## What that adds up to

Soft string is not an approximation with a small known error. It is a model with a defined scope: steady state, thin pipe, one fluid, and friction as a single constant.

Inside that scope it is very good, and it is checked against an independent implementation in module 5. Outside it, the answer is not slightly wrong; it is answering a different question.

## Exercise

For each of the four omissions above, name one field observation that would tell you the omission is biting on the well you are actually drilling.

They are all observations a driller can make at the console, which is the point.
