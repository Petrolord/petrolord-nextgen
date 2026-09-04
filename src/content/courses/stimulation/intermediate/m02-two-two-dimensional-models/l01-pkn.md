# PKN

A fracture that is long, contained in height, and elliptical in every vertical slice you cut through it.

{{panel:st-frac-explorer}}

## The picture

Perkins, Kern and Nordgren describe a fracture that has grown well beyond its own height. The height is fixed, held by stress barriers above and below, and the fracture extends by getting longer rather than taller.

Cut a vertical slice across it and you see an ellipse, widest at mid height and tapering to zero at top and bottom. Take slices further from the well and the ellipses shrink towards the tip.

Each slice is held by its neighbours along the length, so each deforms in plane strain in its own vertical plane, and the compliance of the fracture is set by its height.

## The equations the engine uses

    w_max = 2.31 [ qi mu xf / E' ]^(1/4)
    w_avg = (pi/5) w_max
    p_net = E' w_max / (2 hf)

Read them in that order, because that is the order the engine works in. Width first, from rate, viscosity, half-length and the plane strain modulus. Then the average from the maximum by a fixed shape factor. Then the net pressure from the width and the height.

The maximum width is the width at the wellbore at mid height. The shape factor pi over 5 covers two taperings at once, elliptical across the height and declining towards the tip.

Note where the height is and is not. It does not appear in the width equation at all. It appears only in the net pressure, in the denominator, through the vertical compliance.

## The published case

| Quantity | Value |
| --- | --- |
| Half-length | 150 m |
| Fracture height | 30 m |
| Injection rate | 0.053 m3/s |
| Fluid viscosity | 0.2 Pa.s |
| Maximum width | 6.391634 mm |
| Average width | 4.015982 mm |
| Net pressure | 2.889736 MPa |
| Treating pressure | 41.021687 MPa |

Four millimetres of average width on a wing that reaches 150 m from the well. That ratio is worth carrying with you. Fractures are extremely thin things.

## The one quarter power

Everything inside the bracket is raised to one quarter. Double the rate and the width rises by the fourth root of two. Double the viscosity and it rises by the same factor. Double the half-length and the same again.

Rate, viscosity and length are interchangeable levers in PKN, all of them weak. This is the most important structural fact about both models, and the next module takes it apart properly.

## Exercise

Set the panel to PKN at the published conditions and confirm the maximum and average widths above.

Then change the fracture height and watch which of the four outputs move. Explain the ones that did not.
