# The effective wellbore radius

If you had to buy the same production without a fracture, this is the hole you would have to drill.

{{panel:st-pack-explorer}}

## Turning a skin back into a length

A skin can be absorbed into the wellbore radius. The engine does exactly that, taking the drilled radius and multiplying it by the exponential of the negative pseudo-skin. A negative skin therefore produces a radius larger than the real one, and a positive skin produces a smaller one.

The result is called the effective wellbore radius. It is the radius an unstimulated well would need in order to deliver the same rate at the same drawdown, in the same rock, under stabilised radial flow.

## The published comparison

The published well was drilled at a radius of 0.108 m. Its pseudo-skin is -5.3116380662677045. The effective wellbore radius is 21.889652014700083 m.

| Quantity | Value, m |
| --- | --- |
| Drilled wellbore radius | 0.108 |
| Effective wellbore radius | 21.889652014700083 |
| Drainage radius | 300 |

Stand that up in your head. The real hole is narrower than a dinner plate. The equivalent hole is a shaft you could drop a house into, and it sits inside a drainage radius of only 300 m. The fracture has taken a well that saw three and a half decades of radial squeeze between hole and drainage boundary and left it with barely more than one.

That is where the production increase comes from, and it is why the exponential matters. The skin sits inside an exponential, so every unit of extra negative skin multiplies the effective radius again. There is no linear intuition to fall back on here.

## What the number is for

The effective radius is the cleanest way to hand a fracture design to someone working in nodal analysis or in a material balance model. They do not need the pack, the width or the correlation. They substitute one radius for another and everything downstream carries on unchanged.

It is also the honest way to compare a fracture against a matrix treatment, because both end up expressed as one number in the same inflow equation.

## Exercise

Confirm from the panel that applying the exponential of the negative published pseudo-skin to the drilled radius returns 21.889652014700083 m.

Work out how many times larger the effective radius is than the drilled radius, and say what a further one unit of negative skin would do to it.

Compare the effective radius with the 300 m drainage radius and comment on how much radial flow path is left.
