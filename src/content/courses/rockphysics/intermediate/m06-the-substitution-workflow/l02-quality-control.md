# Quality control

Five checks, three of which cost one line each, and two things none of them can see.

## The round trip

Substitute the new fluid in, then substitute the original fluid back, and compare against the log.

At Ekene the gas case returns 3200.0000 m/s, 1800.0000 m/s and 2250.0000 kg/m3, exactly the input.

This is the strongest check in the tier because it tests the whole chain at once: the conversion into moduli, inverse Gassmann, the forward relation, the density bookkeeping and the conversion back. Any error in any of them breaks it.

It is also the check people skip, because the answer is known in advance. That is exactly why it is worth automating rather than performing.

## The grain density

$$\rho_{grain} = \frac{\rho - \phi \rho_{fl}}{1 - \phi}$$

At Ekene this is 2660.7 kg/m3, consistent with a 70/30 quartz and clay mixture. It tests the porosity, which is the most leveraged assumption in the tier, against an independent expectation, and it costs one line.

Anything outside roughly 2600 to 2750 for a clastic reservoir deserves an explanation.

## The Biot coefficient

$$\alpha = 1 - \frac{K_{dry}}{K_{min}} = 0.80$$

This says whether the answer should be fluid sensitive at all. Near 1 the fluid matters greatly, near 0 it does not. A substitution that produces almost no velocity change in a rock whose Biot coefficient is 0.8 has an error in it, and a substitution that produces a huge change in a rock at 0.3 has one too.

## The shear modulus

It must be identical in both fluid cases. If it is not, the implementation is wrong, because nothing in Gassmann's relation can move it.

## The directions

Four sign checks that catch transposed inputs.

Replacing brine with gas must lower the bulk modulus, lower the density, lower the compressional velocity and raise the shear velocity. Any of those going the other way means the two fluids have been swapped somewhere.

## What none of them can see

Two failures pass every check above.

The first is a wrong fluid state for the interval. If the log was recorded in a gas bearing zone and the study treats it as brine, every check passes, the round trip returns the log exactly, and every number is wrong.

The second is a violated Gassmann assumption. Unconnected porosity, strong anisotropy, a reactive frame or a high frequency measurement all produce a clean run with a quietly wrong answer.

Both of those are established outside the substitution, from petrophysics and geology, which is the honest limit of what a rock physics quality control can do.

## Reading it off the panel

The round trip tile exists for the first check.

{{panel:rp-substitution-explorer}}

Move the saturation anywhere and it reads 3200.0000 and 1800.0000 every time. Change the porosity and it still does, because the round trip tests internal consistency rather than the correctness of the assumption.

That last point is worth sitting with: a check that passes at every porosity is not testing the porosity. The grain density check is the one that does.

## Worked example

Run the whole set on the Ekene gas case and record each result.

Round trip: 3200.0000, 1800.0000, 2250.0000. Exact. Pass.

Grain density: 2660.7 kg/m3, inside the clastic range. Pass.

Biot coefficient: 0.80, strongly fluid sensitive, consistent with a 17.7 percent impedance change. Pass.

Shear modulus: 7.29 GPa in both cases. Pass.

Directions: bulk modulus 13.32 down to 7.4930, density 2250 down to 2038.71, compressional velocity 3200 down to 2905.70, shear velocity 1800 up to 1891.0. All four correct. Pass.

Five passes, and the model could still be describing the wrong fluid state, which is the note to end on.

## Exercise

A substitution reports a gas case with a lower shear velocity than the brine case. State what has gone wrong and which check catches it.

Self check: the shear velocity must rise, because the shear modulus is fluid blind and the density falls. A falling shear velocity means either the densities have been swapped between the two fluid cases or the shear modulus has been recomputed from the substituted velocities rather than carried through. The direction check catches it immediately, and the shear modulus check identifies which of the two causes it is.
