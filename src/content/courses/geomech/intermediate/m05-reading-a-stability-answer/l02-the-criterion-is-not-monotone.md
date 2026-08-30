# The criterion is not monotone

Why more mud eventually stops helping, and starts hurting.

{{panel:gm-stability-explorer}}

## The usual picture

Raise the well pressure and the hoop stress falls while the radial stress rises. The gap between the largest and smallest wall stress closes at one plus q per unit, so the hole gets more stable.

That is true, and it stops being true.

## Where it stops

When the radial stress becomes the LARGEST of the three wall stresses.

At low pressure the order is hoop, then axial, then radial. Keep raising the pressure and the hoop stress falls and the radial rises until they cross.

Past that crossing the roles swap: the radial stress is now sigma1 and the hoop stress is sigma3, and raising the pressure further OPENS the gap again.

## The shape of the margin

Plot the worst Mohr-Coulomb margin against well pressure and it is a V turned upside down and then right way up: it falls from a positive value, crosses zero, reaches a minimum, comes back up, and crosses zero again at a much higher pressure.

## What the second crossing means

That the mud is now shearing the rock rather than supporting it. A pressure so far above the far-field stresses that the difference between the mud and the hoop stress exceeds what the rock can carry.

In practice the fracture criterion is violated long before that happens, so the second crossing is usually academic.

## Why the engine handles it anyway

Because "usually" is not "always", and a bisection that assumes monotonicity on a function that is not can converge on the second crossing and report it as the collapse pressure.

That would be a collapse pressure ABOVE the fracture pressure, which is an inverted window, which would then be reported as a section that cannot be drilled at all. A spectacular wrong answer from a subtle numerical assumption.

## The engine's comment

The source says it plainly: the worst margin is not monotone because at very high well pressure the radial stress itself violates Mohr-Coulomb, so the crossing is found by a scan then a bisection, with the specification mirrored in the oracle.

That is the right way to document a numerical choice: what the problem is, what was done, and that the reference implementation does the same.

## The general lesson

Root finders carry assumptions. Bisection assumes a sign change and monotonicity within the bracket; Newton assumes a good starting point and a well-behaved derivative.

When a solver is applied to a function nobody plotted, the assumptions are being taken on faith. Plotting the function first is cheap.

## Exercise

For the vertical fixture, work out the well pressure at which the radial stress equals the hoop stress at the breakout angle.

Then say whether that pressure is above or below the fracture initiation pressure, and what that implies about whether the second crossing is ever reachable there.
