# Peak torque

Peak gearbox torque is the number a unit is bought against. On ODUMA-4 it is 450016.096192 in-lb from the card the engine returns and 461403.140996 in-lb from the card it actually marched.

{{panel:pd-balance-explorer}}

## What balanced means numerically

The largest net torque on the upstroke is 450016.096192 in-lb and the largest on the downstroke is 450016.096192 in-lb. They differ by 0.0000e+0 in-lb, which is what balanced means: the bisection drove the difference to zero, and the peak torque is whichever of the two you like.

Against the 320000 in-lb gearbox of the teaching designation that is a `torquePct` of 140.630030060 percent, and the engine raises `torqueOverload` when the balanced peak torque passes the rating.

## The card it was balanced against

`balanceUnit` takes a card load function, and the only surface card `predictCard` hands out is the decimated one. So the torque is balanced against 186 of the 6110 marched steps.

| Balanced off | Moment, in-lb | Peak torque, in-lb | Effect, lb |
| --- | --- | --- | --- |
| The default 186 point card | 609641.972281 | 450016.096192 | 13508.771698 |
| The full 6110 point march card | 601131.142443 | 461403.140996 | 13320.184195 |

The decimation moves the moment by 8510.829838 in-lb, 1.415803 percent, and the peak torque by 11387.044803 in-lb, 2.467917 percent, with the default card reading it low. The counterbalance effect moves by 188.587503 lb. Against the same gearbox, `torquePct` reads 140.630030060 percent from the default card and 144.188481561 percent from the full march.

Both are well over the rating here, so the verdict survives. On a design sitting near 100 percent, 2.467917 percent decides it.

## One return object, two opinions about the crank offset

`balanceUnit` forwards `structuralUnbalanceLb` to `counterbalanceEffect` and does not forward `crankOffsetDeg`. The effect is read a quarter turn from the bottom of the stroke, which is where the counterweight moment peaks only when the offset is zero.

With a crank offset of -30.0 deg the moment reads 891505.531225 in-lb and the peak torque 592512.645044 in-lb, both of which know about the offset. The effect is read at crank sample 89, where the torque factor is 45.129341579 in, giving 19754.454642 lb. The moment actually peaks at crank sample 119, where the torque factor is 35.142593819 in, which would give 25368.233655 lb. The difference is -5613.779013 lb, -22.129168 percent. At an offset of 0.0 deg the two agree to 0.000000 lb, which is what says this is the offset and nothing else.

## What it refuses

Peak torque is a gearbox number and nothing more. It carries no belt or motor loss and no duty cycle, and it refuses to tell you which card it was computed from.

## Exercise

Read the peak torque and the counterbalance effect for ODUMA-4 balanced off the default card, then off the full march card.

State which of the two you would send to a field crew as a counterbalance target, and why.
