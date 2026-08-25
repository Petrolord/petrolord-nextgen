# Inverse Gassmann

The log measures a rock with a fluid in it. The substitution needs the rock without the fluid. This lesson runs that separation and looks at what it produces.

## What is being separated

A saturated rock resists compression for two reasons at once. The frame of grains resists, and the fluid trapped in the pores resists, because squeezing the rock squeezes the fluid too and the fluid pushes back.

The logged 13.32 GPa is those two contributions together. Inverse Gassmann removes the fluid's share and leaves the frame's.

## The result

$$K_{dry} = 7.350343061720982 \ \mathrm{GPa}$$

That is 55.2 percent of the saturated value. Over 44 percent of this rock's compressional stiffness comes from the brine in its pores rather than from the rock itself.

That fraction is what makes the whole exercise worth doing. If the fluid contributed a percent or two, swapping it would not be detectable and there would be no such thing as a direct hydrocarbon indicator. It contributes nearly half, which is why fluid changes show up on seismic.

## Where the number comes from

$$K_{dry} = \frac{K_{sat}\left(\dfrac{\phi K_{min}}{K_{fl}} + 1 - \phi\right) - K_{min}}{\dfrac{\phi K_{min}}{K_{fl}} + \dfrac{K_{sat}}{K_{min}} - 1 - \phi}$$

The ratio $\phi K_{min}/K_{fl}$ dominates both lines. With $\phi = 0.25$, $K_{min} = 37$ GPa and $K_{fl} = 2.6978112899395996$ GPa, that ratio is 3.4288. So a change in the fluid modulus moves both the numerator and the denominator, which is why the sensitivity of $K_{dry}$ to the fluid is milder than the size of the term suggests.

## What the dry frame is not

It is not the modulus of a rock with air in its pores in some literal sense, although that is the usual name. It is the modulus of the frame under drained conditions, meaning that if the rock were squeezed slowly enough for any pore fluid to escape without building pressure, this is the stiffness you would measure.

It is also not a quantity anyone measures on a log. It is always inferred, always through this equation, and always with an assumed porosity and mineral modulus. That is worth remembering when a report quotes a dry frame modulus to six figures, as this course is about to.

## Reading it off the panel

The dry frame tile is the third in the first row.

{{panel:rp-substitution-explorer}}

Move the saturation control across its whole range and watch that tile. It does not move. That is the point of the separation: the frame belongs to the rock, so once it is recovered it can be reused for every fluid you want to try.

Now change the porosity and watch it move a long way. The frame does not depend on the fluid, and it depends very much on what you assumed about the rock.

## Worked example

Estimate how much of the rock's stiffness the brine is supplying, and check the direction of the answer.

The saturated modulus is 13.32 GPa and the dry frame is 7.350343061720982 GPa, so the fluid's contribution is

$$13.32 - 7.350343061720982 = 5.969656938279018 \ \mathrm{GPa}$$

which is 44.8 percent of the saturated value.

Now sanity check the direction. The saturated modulus must always exceed the dry one, because adding a fluid can only stiffen a rock in compression, never soften it. If an inverse Gassmann result comes out above the saturated value, the inputs are inconsistent and the answer is meaningless.

## Exercise

The same rock is logged again in a zone where the pores hold gas rather than brine, reading a saturated bulk modulus of 7.49 GPa. Without computing anything, state roughly what its dry frame modulus should be and why.

Self check: about 7.35 GPa, the same dry frame, because the frame is a property of the rock and does not depend on what is in the pores. The gas contributes only about 0.14 GPa of stiffness against the brine's 5.97 GPa, which is another way of saying that a gas filled rock is nearly as soft as a dry one.
