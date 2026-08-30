# Heavier mud helps

The one result in this tier that runs against the instinct.

{{panel:cm-standoff-explorer}}

## The numbers

| mud density (kg/m3) | buoyancy factor | slant | horizontal |
|---|---|---|---|
| 1030 | 0.8687898089171975 | 0.72587771 | 0.573541422 |
| 1200 | 0.8471337579617835 | 0.73271067 | 0.584171621 |
| 1440 | 0.8165605095541402 | 0.742357202 | 0.599178961 |
| 1700 | 0.7834394904458599 | 0.752807612 | 0.615436913 |
| 2000 | 0.7452229299363058 | 0.764865778 | 0.634196088 |

Standoff RISES monotonically with mud density, on both wells.

## Why

Because the lateral load is the BUOYED weight, and buoyancy rises with the density of the fluid.

    buoyancy factor = 1 - mud density / 7850
    buoyed weight = air weight x buoyancy factor

At 1030 the casing weighs 367.71964273630573 N per metre in the hole. At 2000 it weighs 315.4193416433121.

Fourteen percent lighter, so fourteen percent less lateral load, so less deflection at the centralizer AND less sag.

## The size of the effect

Going from a light brine at 1030 to a heavy mud at 2000, which is about the whole realistic range, buys about four points of standoff on the slant well and six on the horizontal one.

Small compared with what spacing does. Going from 12 m to 9 m on the horizontal well buys twenty one points.

## So it is a real effect and not a lever

Nobody chooses a mud weight to improve standoff. It is chosen by the pore pressure and the fracture gradient, and the standoff consequence is a side effect.

What it IS good for is knowing which direction an error moves you. Run the standoff calculation at the wrong mud weight and you know the sign of the error: too light an assumption is conservative.

## And it is the fluid in the hole at the time

Which is the mud, during the run-in and while the casing is being landed, not the cement. The engine takes `mudDensityKgM3` as an input to `standoffProfile` for exactly that reason.

The standoff at the moment of cementing is the standoff the mud gave it, because the casing does not move once it is landed.

## The one place it could mislead

A job run with a very light completion fluid or with the hole partly empty would have a heavier casing and a worse standoff than the calculation assumed, and nothing about the input would warn you.

## Exercise

Compute the buoyed weight per metre of this casing at a mud density of 1300 kg/m3.

Then say by how much it differs from the 1440 figure of 345.6133299031847 N per metre, and in which direction the standoff moves.
