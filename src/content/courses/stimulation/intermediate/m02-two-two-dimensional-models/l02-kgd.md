# KGD

A fracture that is taller than it is long, opening over its whole height at once.

{{panel:st-frac-explorer}}

## The picture

Khristianovich, Geertsma and de Klerk describe the opposite extreme to PKN. The fracture is short relative to its height, so the dimension resisting the opening is no longer the height, it is the length.

Cut a vertical slice across it and you do not see an ellipse. You see a rectangle. The whole height opens together, the same width top to bottom, because the height is not what holds it shut.

Look at it in plan view and there is the ellipse, widest at the well and tapering to zero at the tip. The horizontal plane is where the elastic problem lives.

## Plane strain, turned on its side

This is the definition that matters. KGD assumes plane strain in the HORIZONTAL plane. Every horizontal slice solves the same two dimensional problem, and the slices stack with nothing varying between them.

That is a Griffith through crack, a crack of finite length in an infinite plate opened by internal pressure. Its compliance is set by its length. Height here is only a multiplier saying how many identical slices you have.

## The equations the engine uses

    w_max = 3.22 [ qi mu xf^2 / (E' hf) ]^(1/4)
    w_avg = (pi/4) w_max
    p_net = E' w_max / (4 xf)

Three things differ from PKN and all three follow from turning the plane strain on its side.

The half-length enters squared inside the bracket, so width goes with the square root of length rather than the fourth root. Height now appears in the width equation, in the denominator, because the fixed injected rate is being shared out over more slices. And the net pressure is divided by the length, not the height.

The shape factor is pi over 4, the plain area factor of an ellipse, because there is only one direction of taper. PKN needed pi over 5 because it tapers twice.

## The published case

| Quantity | Value |
| --- | --- |
| Maximum width | 13.322885 mm |
| Average width | 10.463769 mm |
| Net pressure | 0.602344 MPa |
| Treating pressure | 38.734295 MPa |

These are the same rock, the same rate, the same fluid and the same target half-length of 150 m as the PKN case in the previous lesson. Only the model changed.

## The honest caveat

The published conditions put a half-length of 150 m against a height of 30 m, five times over, which is PKN territory. The KGD row is what the engine computes when you ask it, not what the geometry deserves. The next lessons deal with that.

## Exercise

Set the panel to KGD at the published conditions and confirm the two widths above.

Then change the fracture height and note which outputs move now. Compare that with what happened in PKN.
