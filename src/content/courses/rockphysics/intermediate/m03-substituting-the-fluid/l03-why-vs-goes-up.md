# Why vs goes up

Replace brine with gas and the compressional velocity falls by 294 m/s. The shear velocity rises by 91 m/s. Two velocities in the same rock moving in opposite directions from one change is worth understanding properly, because it is the most useful diagnostic the tier produces.

## The two numbers

| | logged (brine) | substituted (gas) |
| --- | --- | --- |
| $v_p$ | 3200 | 2905.6972280296195 |
| $v_s$ | 1800 | 1890.9758806113214 |

## The reason, in one line each

The compressional velocity depends on both moduli and the density:

$$v_p = \sqrt{\frac{K + \tfrac{4}{3}\mu}{\rho}}$$

The bulk modulus collapsed from 13.32 to 7.4930 GPa, which pulls the numerator down hard. The density also fell, which pushes back. The modulus wins and the velocity falls.

The shear velocity depends only on the shear modulus and the density:

$$v_s = \sqrt{\frac{\mu}{\rho}}$$

The numerator did not move, because fluids have no shear stiffness. The denominator fell. There is nothing to oppose it, so the velocity rises.

## The arithmetic

$$v_s' = \sqrt{\frac{7.29 \times 10^9}{2038.7104517793223}} = 1890.9758806113214 \ \mathrm{m/s}$$

That is the whole calculation. No Gassmann relation appears in it. The shear velocity of the substituted rock is the logged shear modulus over the substituted density, and both of those come from elsewhere.

## Why this is the useful part

Because it separates two effects that the compressional velocity mixes together.

A compressional velocity drop can be caused by a fluid change, by higher porosity, by a lithology change, or by overpressure. Any of those softens a rock.

A simultaneous shear velocity rise is much more specific. Higher porosity lowers both velocities. A shale lowers both. Overpressure lowers both. Only a drop in pore fluid density with the frame intact raises the shear velocity while lowering the compressional one.

That is why the ratio of the two is the quantity interpreters reach for, and why the next lesson is about it.

## What it is not

It is not evidence that gas stiffens rock. The rock's resistance to shear is identical in both cases, at 7.29 GPa. A reader who sees a faster shear velocity and concludes the rock got stronger has read a density observation as a stiffness one.

It is also not large in absolute terms. The shear velocity moves 5 percent while the compressional velocity moves 9 percent. It is the sign that carries the information, not the size.

## Reading it off the panel

Watch the two velocity tiles together as you move the saturation.

{{panel:rp-substitution-explorer}}

From Sw 1.00 to Sw 0.00, vp goes 3200 down to 2905.70 while vs goes 1800 up to 1890.98. Now watch what happens in between. The shear velocity climbs smoothly and almost linearly, because it tracks the density, which is linear in saturation. The compressional velocity does something much stranger, which is module four.

That difference in shape is itself diagnostic: the shear response is a density response and the compressional response is a fluid modulus response, and the two behave nothing alike.

## Worked example

Show that the shear velocity is linear in the gas fraction to a good approximation, which the panel's smooth climb suggests.

The density is exactly linear in saturation, since $\rho' = \rho + \phi S_g(\rho_{gas} - \rho_{brine})$ with $S_g = 1 - S_w$. At $S_g = 0.5$ that gives $2250 - 0.5 \times 211.2895 = 2144.36$ kg/m3.

Then $v_s = \sqrt{7.29 \times 10^9 / 2144.36} = 1844.1$ m/s, which sits almost exactly halfway between 1800 and 1891.

The square root makes it slightly non-linear, but over a 10 percent density range the curvature is tiny. So shear velocity is, for practical purposes, a direct reading of pore fluid density.

## Exercise

A gas sand and a brine sand of the same lithology and porosity are logged. State which of the two has the higher shear velocity, which has the higher compressional velocity, and which quantity a lithology change would move in the same direction as the fluid change.

Self check: the gas sand has the higher shear velocity and the lower compressional velocity. A lithology change, such as more clay, lowers both velocities together, so it moves the compressional velocity in the same direction as the fluid change and the shear velocity in the opposite direction. That is precisely why the two together separate fluid from lithology when either alone cannot.
