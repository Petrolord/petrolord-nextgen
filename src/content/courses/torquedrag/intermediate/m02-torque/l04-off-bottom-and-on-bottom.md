# Off bottom and on bottom

Two rotating operations, and the difference that is not the bit torque.

{{panel:td-string-explorer}}

## The comparison

| well | off bottom | on bottom | difference |
|---|---|---|---|
| vertical | 0 N.m | 2700 N.m | 2700 N.m |
| slant | 20814.495681873374 N.m | 22207.551686410312 N.m | 1393.0560045369384 N.m |
| build and hold | 26357.98350914472 N.m | 26934.19951651723 N.m | 576.2160073725099 N.m |
| horizontal | 18817.84540858303 N.m | 24324.87703304575 N.m | 5507.031624462717 N.m |
| three-dimensional turn | 15018.461098709557 N.m | 15657.408635706728 N.m | 638.9475369971715 N.m |

The bit torque applied is 2700 N.m in every case. The difference column is 2700 only on the vertical well, and it ranges from 576 to 5507 elsewhere.

## Why

Going on bottom does two things at once. It adds 2700 N.m of bit torque, and it puts 89000 N of compression into the bottom of the string.

That compression changes the tension everywhere below the neutral point, which changes the side force there, which changes the friction torque. The net difference is 2700 plus whatever the side-force change contributed, and the second part has either sign.

## The wells where it is less than 2700

Slant, build and hold, and the three-dimensional turn. On those, putting weight on bit REDUCED the friction torque.

That is the tension-times-curvature term. Lower tension near the bit means less side force in the curved sections down there, so less friction, so less torque. The reduction partly offsets the bit torque going in.

On the build-and-hold well it offsets almost 80 percent of it.

## The well where it is more than 2700

The horizontal one, at 5507 N.m. There the compression from the weight on bit did not reduce side force; it INCREASED it, because in a horizontal section the side force is dominated by the weight term, and a buckling string presses outward rather than lying on the low side.

Once the string starts buckling the contact force goes up, not down, and the torque follows.

## What this means for interpretation

You cannot subtract a known bit torque from a measured surface torque and get the friction torque. The two are coupled.

The right way to separate them is to compare an off-bottom reading with an on-bottom reading at the same depth, taken minutes apart, which is exactly what a driller does when they pick up off bottom and take a reading before drilling ahead.

## The off-bottom reading is the useful one

Because it has no bit torque in it at all, so it is pure friction, and it is the number to calibrate a friction factor against.

An on-bottom torque contains a bit torque that depends on the bit, the formation, the weight on bit and the rate of penetration, none of which this model knows anything about.

## Exercise

For each of the five wells, compute the difference between on-bottom and off-bottom torque and subtract 2700 N.m.

Four of the five results are negative. Explain the one that is positive, and say what you would conclude if a real well showed the same sign.
