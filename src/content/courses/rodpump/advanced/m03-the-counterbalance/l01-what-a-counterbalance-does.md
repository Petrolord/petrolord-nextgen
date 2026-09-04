# What a counterbalance does

A counterweight halves the work the gearbox does. On ODUMA-4 it takes the peak torque from 950041.862527 in-lb to 450016.096192 in-lb.

{{panel:pd-balance-explorer}}

## The condition, in one line

A unit is balanced when the largest torque the gearbox sees on the upstroke equals the largest it sees on the downstroke. That is one scalar condition in one unknown, and `balanceUnit` closes it by bisection on the difference between the two peaks. On ODUMA-4 with no structural unbalance and no crank offset it returns balanced, with a counterweight moment of 609641.972281 in-lb, and the two peaks differ by 0.0000e+0 in-lb.

Without a counterweight the same well and the same published linkage put 950041.862527 in-lb through the gearbox. Balancing brings that to 450016.096192 in-lb, a reduction of 52.631972 percent.

## Anchored to the bottom of the stroke

The counterweight moment is a sine anchored to the crank angle at the bottom of the polished rod stroke, which on this linkage is 359.000000000 deg, sample 359 of 360. It is not anchored to whatever angle a maker calls zero. That choice is what makes the sign right by construction: the weight is rising while the rods are being lifted and falling while they are not.

## The counterbalance effect

The number a field crew actually quotes is not the moment but the counterbalance effect, the equivalent load at the polished rod. On ODUMA-4 it is 13508.771698 lb, read a quarter turn from the bottom of the stroke where the torque factor is 45.129341579 in.

Sanity check it against the string. The buoyed rod weight is 9466.342675 lb and the effect sits 4042.429023 lb above it, which is roughly the rod weight plus half the fluid load of 2345.149829 lb. That is the rule of thumb a beam pump crew carries, and the engine lands on it without being told to.

## The mistake that looks like arithmetic

Dividing the moment by the front arm gives 5715.391704 lb. It is the obvious thing to do and it is wrong by a factor of 2.363578, because the moment acts through the crank and the torque factor, not through the beam arm. A crew set to 5715.391704 lb of counterweight would be running a unit that reads well below its own rod weight.

## What it refuses

The balance is one condition on two peaks. It does not flatten the torque curve between them, and it says nothing about the motor. Polished rod horsepower, 18.955924637 hp on this well, contains no gearbox loss, no belt loss, no motor efficiency and no counterbalance work, so a balanced unit and an unbalanced one deliver the same polished rod power and buy very different motors.

## Exercise

Read the counterbalance moment and the counterbalance effect for ODUMA-4 in the panel.

Then divide the moment by the front arm of 106.6667 in, and state in one sentence why that number is not the counterbalance effect.
