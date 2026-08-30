# The borehole frame

Rotating the uncertainty into the well's own directions.

{{panel:wd-uncertainty-explorer}}

## The three directions

**Along hole**, the direction the well is pointing at that station.

**Highside**, perpendicular to the hole, in the vertical plane containing it, pointing up. In a vertical well this is undefined; in a horizontal well it is straight up.

**Lateral**, perpendicular to both, so pointing horizontally across the hole.

Those three are what the industry calls HLA, and they are a right-handed frame that rotates with the well.

## The rotation

The transformation from north-east-vertical to highside-lateral-along is a pure rotation built from the inclination and the azimuth:

    H = ( cos(i)cos(a),  cos(i)sin(a), -sin(i) )
    L = ( -sin(a),        cos(a),       0      )
    A = ( sin(i)cos(a),   sin(i)sin(a), cos(i) )

Note the lateral row: it has no vertical component at all, so lateral uncertainty is always horizontal. That is a consequence of defining highside in the vertical plane, and it is why the lateral direction is the one anti-collision cares about most.

The covariance transforms as R C R transpose, which the engine provides in both directions.

## Why this frame

Because the three components mean different things operationally.

**Along-hole uncertainty** is depth uncertainty along the well. It affects where a formation top is picked and where a shoe is set, and it is largely driven by the depth error sources.

**Highside uncertainty** is vertical uncertainty across the hole. In a horizontal lateral it is the number that decides whether the well is in the reservoir.

**Lateral uncertainty** is horizontal uncertainty across the hole. It is the number that decides whether you hit the target and whether you hit the neighbour.

A single scalar uncertainty cannot answer any of those three questions. The frame is what separates them.

## What the validation well shows

At total depth, in a horizontal well heading at 75 degrees, the three sigmas are strikingly different.

The along-hole sigma is 10.554140502828378 m, the smallest of the three.

The highside sigma is about twice that.

The lateral sigma is more than four times the highside one, and it is the largest by a wide margin.

Read the panel for the exact numbers. The RATIO is the lesson: the well's position is known far better along its own axis than across it, and far better vertically than sideways.

## Why lateral dominates

Because lateral position comes from AZIMUTH, and azimuth is the badly measured one.

An azimuth error swings the whole well sideways about the point where the error entered. Over kilometres of horizontal displacement, half a degree is tens of metres, and the error sources that cause azimuth errors are the systematic and global ones that accumulate linearly.

Along-hole position comes from depth, which is counted and is comparatively good. Highside position comes from inclination, which the accelerometers measure well.

So the ordering of the three sigmas is a direct consequence of the ordering of the three measurements' quality, propagated through the geometry.

## The vertical singularity again

In a vertical well the highside direction is undefined, because there is no vertical plane containing the hole in any particular direction.

The frame is therefore only meaningful once the well has some inclination, and near vertical the highside and lateral components swap around freely as the azimuth wanders. That is a property of the coordinates, not of the uncertainty.

## The misconception to avoid

"Rotating the covariance loses information." A rotation is invertible and loses nothing: the same six numbers, expressed in a frame where they mean something. The engine provides both directions precisely so the covariance can be rotated in for interpretation and back out for accumulation.

## Exercise

Open the panel at total depth and read the three borehole-frame sigmas.

Compute the ratio of lateral to along-hole. Then move to the shallow vertical station and read them again, and say why the highside and lateral values there should be treated with caution.
