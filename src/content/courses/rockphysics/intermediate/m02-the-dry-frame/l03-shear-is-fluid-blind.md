# Shear is fluid blind

Gassmann's relation says nothing about the shear modulus. That silence is not an omission and it is the single most useful fact in the tier.

## Why a fluid has no shear stiffness

Shear is a change of shape at constant volume. Push the top of a cube sideways while holding the bottom, and the cube becomes a parallelogram.

A solid resists that because its atoms are bonded in place. A fluid does not resist it at all: a fluid at rest has no restoring force against a change of shape, which is what being a fluid means. Its static shear modulus is exactly zero, not approximately zero.

So filling the pores of a rock with brine, oil, gas or nothing at all leaves the rock's resistance to shape change untouched:

$$\mu_{sat} = \mu_{dry}$$

That is an exact statement within Gassmann's assumptions, not an approximation.

## What that buys

It buys a fixed point. In a problem where the bulk modulus, the density and both velocities are moving, one quantity stays still, and any measurement that depends only on that quantity stays still with it.

It also buys a check. If somebody's substitution returns a different shear modulus for the two fluid cases, they have made an error, because nothing in the method can produce one.

And it buys the surprising result that the next module opens with. Since $v_s = \sqrt{\mu/\rho}$ and the density falls when gas replaces brine, the shear velocity must rise.

## Where the assumption comes from

It is worth knowing that this is an assumption about the rock as well as about the fluid.

Gassmann's derivation assumes the pore fluid is free to move within a connected pore space, that the rock is isotropic, that no chemical reaction takes place between fluid and frame, and crucially that the loading is slow enough for pore pressure to equilibrate everywhere. That last condition is why Gassmann is called a low frequency theory.

At high frequencies, such as a sonic log at 10 kHz or an ultrasonic core measurement at 1 MHz, the fluid cannot equilibrate between pores during a wave cycle. The rock then behaves stiffer than Gassmann predicts, and the shear modulus can move a little, usually upward. That effect is called dispersion.

For seismic frequencies of tens of hertz Gassmann is a good description. For the sonic log this tier's input came from, it is already slightly optimistic, which is a caveat this course states rather than hides.

## Reading it off the panel

The shear modulus tile is the first one.

{{panel:rp-substitution-explorer}}

Move the saturation control from 1.00 to 0.00 in every step available and watch it. It reads 7.2900 GPa the whole way. Change the porosity and it still reads 7.2900, because the shear modulus was computed from the log alone and no assumption in the tier can touch it.

Now watch the vs tile alongside it. It changes at every step even though the shear modulus does not, and the only reason is the density in the denominator.

## Worked example

Compute the shear velocity of the gas case from the fixed modulus and the new density, without using the substitution at all.

$$v_s' = \sqrt{\frac{\mu}{\rho'}} = \sqrt{\frac{7.29 \times 10^9}{2038.7104517793223}} = 1890.9758806113214 \ \mathrm{m/s}$$

which is exactly what the engine returns.

That is worth noticing: the substituted shear velocity needs no Gassmann arithmetic whatsoever. It follows from the log's own shear modulus and a density that is pure bookkeeping. The whole of Gassmann's relation is spent on the compressional velocity.

## Exercise

A sonic tool records shear velocities in a sand at two depths, 1800 m/s where the log reads brine and 1890 m/s where it reads gas. A colleague concludes that the gas has stiffened the rock in shear. State what is actually happening.

Self check: the rock has not stiffened at all. The shear modulus is the same in both zones; the gas zone has a lower bulk density because gas is far lighter than brine, and $v_s = \sqrt{\mu/\rho}$ rises when the denominator falls. A higher shear velocity in a gas sand is a density observation wearing a stiffness disguise.
