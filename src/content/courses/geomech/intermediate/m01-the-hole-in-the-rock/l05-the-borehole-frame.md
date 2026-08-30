# The borehole frame

Two rotations, and why a deviated hole needs them.

{{panel:gm-stability-explorer}}

## The problem

The far-field stresses are given in the frame of the earth: a vertical one and two horizontal ones, with the larger horizontal one pointing along a stated azimuth.

The wall stresses are needed in the frame of the hole: along the axis, and around the circumference.

Those two frames are different unless the hole is vertical and pointed along a principal direction.

## The first rotation

From the principal stress frame into geographic coordinates, north, east and down.

That is a rotation about the vertical by the SHmax azimuth. After it, the stress tensor has off-diagonal terms unless the azimuth was zero or ninety.

## The second rotation

From geographic into the borehole frame.

The borehole frame is defined by three directions: the hole axis pointing downhole, the HIGH SIDE of the hole perpendicular to it, and a third completing a right-handed set.

That rotation depends on the inclination and the azimuth of the hole, and it is where the shear terms come from.

## The result

A three by three effective stress tensor in the borehole frame with six independent components: three normal and three shear.

The Kirsch formulas take those six and produce the wall stresses at any angle.

## Why a vertical hole is easy

Because the hole axis is already a principal direction. The rotation into the borehole frame leaves the tensor diagonal, all three shear components are zero, and the hoop stress reduces to the textbook two-dimensional form.

That is why a vertical well has closed-form answers and a deviated one does not.

## Why a deviated hole is not

Because the hole axis is not a principal direction, so the tensor in the borehole frame has shear in it.

Shear on the plane of the hole wall means the hoop and axial stresses are no longer principal, and they have to be combined before the failure criteria can be applied. That is the extra step, and it is the whole reason this engine does a full tensor treatment rather than a two-dimensional one.

## The practical consequence

A vertical well's stability can be worked out on paper. A deviated well's cannot, and the intuitions built on the vertical case do not all survive.

The clearest example is where the breakout forms: on a vertical well it is a fixed angle from a known direction, and on a deviated well it moves with the trajectory in a way that has to be computed.

## Exercise

Name the inclination and azimuth combinations for which the borehole axis IS a principal direction in this stress field.

Then say how many of them a real well would ever be drilled at.
