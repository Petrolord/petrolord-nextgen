# Landing a horizontal

The most depth-sensitive thing in directional drilling.

## The problem

A horizontal well has to arrive at a target depth, at a target inclination near 90 degrees, heading in a target direction, at a target position. That is a lot of constraints for the last few hundred metres of a build.

And the geometry works against you. Near 90 degrees, TVD changes very slowly with measured depth: at 89 degrees, a metre of hole adds under two centimetres of TVD. So the last part of the landing has almost no depth control left.

Conversely, at 89 degrees, an error of a few metres in the depth you thought you were at translates into hundreds of metres of measured depth to correct.

## Why the window is small

A horizontal lateral has to stay inside the reservoir. In a thin reservoir the target window can be two or three metres of TVD, and the well has to arrive inside it and stay inside it for a kilometre or more.

That is the reason for geosteering: the landing is refined against formation evaluation while drilling, because the seismic depth prediction is not good enough on its own.

## The engine's solver

The horizontal landing solver takes the landing point and the attitude to arrive with, and works backwards to the profile that gets there from the tie-on. It is the same arc-and-line construction as the other profiles, with the constraint applied at the far end instead of the near one.

What it produces is a PLAN. The landing that actually happens is steered, and the plan is the thing the steering is compared against.

## The build rate trade at the bottom

A soft landing, built at a low rate over a long interval, gives good depth control and uses a lot of hole. A hard landing, built at a high rate, saves hole and arrives with less margin to correct.

Most operators build at a moderate rate to about 80 to 85 degrees, then land the last few degrees slowly, because that is where the depth control is needed and where the geosteering information is arriving.

## The heel and the toe

The **heel** is where the well reaches its final inclination and the lateral starts. The **toe** is total depth.

A lateral is rarely exactly 90 degrees: it is usually planned slightly up or slightly down to follow the reservoir, and a small deliberate inclination is used to keep the well inside a dipping bed.

Those few tenths of a degree accumulate: 89.5 degrees over 1500 m of lateral drops about 13 m of TVD, which is more than most target windows.

## What the survey cannot tell you

At 90 degrees, azimuth is well determined and TVD is barely determined. A one degree inclination error at 90 degrees is a TVD rate error that accumulates over the whole lateral.

That is why the Professional tier's error model matters here specifically: it shows the along-hole and highside uncertainties separately, and in a lateral the one that matters for staying in the reservoir is the highside, which is the vertical one.

## The misconception to avoid

"Landing is a geometry problem." The geometry is the easy part and the solver does it in closed form. Landing is a DEPTH PREDICTION problem: the uncertainty is in where the reservoir top actually is, not in where the well is going, and the plan is revised against logs the whole way down.

## Exercise

A lateral is planned at 89.4 degrees inclination for 1400 m from the heel.

Compute the TVD change from heel to toe. Then compute the inclination that would keep the well at constant TVD, and say how precisely the inclination would have to be held to stay within a 3 m window over that length.
