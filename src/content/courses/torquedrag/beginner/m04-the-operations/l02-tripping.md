# Tripping

The two operations with no rotation, and the largest numbers in the course.

## The simplification

With rpm at zero, the tangential velocity is zero, so:

    fa = 1,  ft = 0

All the friction is axial. There is no torque at all. The recursion reduces to

    T(above) = T(below) + w cos(theta) ds  +/-  mu N

with the sign positive tripping out and negative tripping in.

## Why pick up is the biggest hookload in the well

Because it is the only operation where friction and weight both act in the same direction on the hook.

On the build-and-hold well pick up is 1063113.0483217717 N against a buoyed string weight of 1130213.5695338733 N. Even here it is below the total buoyed weight, because the hold section at 65 degrees carries a good deal of the string's weight on the wall rather than in the string.

On the slant well pick up is 1103695.4071581454 N against a buoyed weight of 997579.5357839314 N, so there it EXCEEDS the free-hanging weight. A 40 degree hold is shallow enough that the cosine term still carries most of the weight axially, and the friction is pure addition on top.

That crossover between the two wells is worth remembering: as a well gets more deviated, more of the string's weight is supported by the wall, so the pick-up hookload eventually stops rising and starts falling even though the drag keeps growing.

## Why the derrick rating is set by pick up

The worst axial load the rig sees on a routine trip is pulling out of the hole, and that number goes in the rig contract.

The worse case is pulling on a stuck string, which is not a torque and drag calculation at all; it is limited by the pipe's tensile capacity and the derrick's rating, and it is planned separately as an overpull margin above the free pick-up hookload.

## Trip speed

The model's trip speed is 0.3 m/s and it appears only in the direction cosines. With no rotation the ratio `va / hypot(va, vt)` is 1 for ANY nonzero speed.

So in this model tripping faster does not change the drag. That is a genuine limitation: real friction has a velocity dependence, surge and swab pressures are strongly speed dependent, and neither is here.

## The stationary case

At exactly zero speed both velocities are zero and the direction cosines are indeterminate. The engine returns zero for both, which means no friction, which means the hookload is the free-hanging weight.

That is defensible as a convention and it is not what a real string does when it stops: static friction holds it wherever it was left. The gap between those two is exactly what a driller feels when a string will not break over.

## Exercise

Compute the difference between the slant well's pick-up hookload and its buoyed string weight, and the same difference for the build-and-hold well.

One is positive and one is negative. Explain the sign change in terms of the hold angle, and predict the sign for the horizontal well before checking it.
