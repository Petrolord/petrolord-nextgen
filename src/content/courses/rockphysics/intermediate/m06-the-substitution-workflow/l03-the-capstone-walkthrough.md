# The capstone walkthrough

The capstone asks for six numbers on a logged sand of its own. Its brief states the log point, the porosity, the mineral modulus and the fluid conditions, and asks for a full gas substitution plus one shear estimate. This lesson walks through each field, works it on the Ekene teaching case, and gives the checks worth running before submitting.

## The task, in general

A logged sand is brine saturated at a stated vp, vs and density, with a stated porosity and mineral modulus, and its fluids sit at a stated temperature, pressure, salinity and gas gravity. Recover the dry frame with inverse Gassmann, substitute to gas, and report the panel. Where the sonic has no shear, predict the shear velocity at a stated compressional velocity with Greenberg-Castagna for a stated sand and shale split.

## The settings

The substitution panel opens on the Ekene sand: 3200 m/s, 1800 m/s and 2250 kg/m3, porosity 0.25, mineral modulus 37 GPa, fluids at 60 degC and 25 MPa, and Sw 0. For the capstone, type every one of those over with the brief's case. The shear block at the foot of the panel takes the target vp and the sandstone fraction.

{{panel:rp-substitution-explorer}}

## The six fields, worked on Ekene

**Shear modulus, 7.29 GPa.** Exact from $\rho v_s^2$, needing no panel at all.

**In situ saturated bulk modulus, 13.32 GPa.** Exact from $\rho v_p^2 - \tfrac{4}{3}\mu$.

**Dry frame bulk modulus, 7.350343061720982 GPa.** The inverse Gassmann tile.

**Gas case compressional velocity, 2905.6972280296195 m/s.** The vp tile at Sw 0.

**Gas case density, 2038.7104517793223 kg/m3.** The bulk density tile, and reachable by hand from the density bookkeeping.

**Greenberg-Castagna shear velocity at 3000 m/s for 70/30, 1521.197276567149 m/s.** The shear block, or four lines by hand. This one is not about the substitution at all; it is the shear estimator, run at a different velocity.

The capstone case moves every one of these. The method does not move.

## What each tests

The first two test the conversion from a log point into moduli, which is where every substitution begins. They are exact, so they are graded tightly.

The third tests the inverse step and, with it, whether the porosity and mineral modulus were entered correctly. It is the value most sensitive to a wrong input: on Ekene it would be 5.356 at a porosity of 0.20 and 8.546 at 0.30.

The fourth and fifth test the forward step and the density bookkeeping, which are separable, so getting one right and the other wrong tells you which half failed.

The sixth tests whether you noticed that the shear estimator is a separate tool, evaluated at the velocity the brief names rather than at the logged one. On Ekene, running it at the logged 3200 gives 1679.9458454651794 against 1521.197276567149 at 3000.

## The most common errors

Reporting the Greenberg-Castagna value at the logged velocity rather than at the one the brief names, or on the wrong sand and shale split. Read the task twice on that field.

Leaving one input at its Ekene value. The fluid conditions matter as much as the log point: the brine and the gas both move with temperature, pressure and salinity, and so does every substituted number.

Entering the mineral modulus in the wrong units. The panel takes it in GPa, while the engine works in pascals.

## Checks before submitting

Confirm that $\tfrac{4}{3}\mu$ plus the saturated bulk modulus equals $\rho v_p^2 / 10^9$. On Ekene, $\tfrac{4}{3} \times 7.29 = 9.72$ and $13.32 + 9.72 = 23.04$. That single line validates the first two values against the log.

Confirm the density by hand: the logged density plus the porosity times the gas density less the brine density. On Ekene, $2250 + 0.25(172.66679461728904 - 1017.8249875) = 2038.7104517793223$.

Confirm that the dry frame is below the mineral modulus and above zero.

And confirm the direction of the shear velocity: the gas case vs must read higher than the logged vs.

## Worked example

Derive the gas case velocity from the three moduli, so the tile is confirmed rather than copied. On Ekene the gas case saturated bulk modulus is 7.492988063073051 GPa and the shear modulus is unchanged at 7.29 GPa, so

$$K + \tfrac{4}{3}\mu = 7.492988063073051 + 9.72 = 17.212988063073051 \ \mathrm{GPa}$$

and the density is 2038.7104517793223 kg/m3, so

$$v_p = \sqrt{\frac{17.212988063073051 \times 10^9}{2038.7104517793223}} = 2905.6972280296195 \ \mathrm{m/s}$$

which is the tile to every digit. Run the same line on your own case.

## Exercise

Type a case of your own into the panel (any log point and fluid conditions), record the six values and run all four checks. State what each check confirmed.

Self check: the modulus check confirms that the shear and saturated bulk moduli are consistent with the logged velocities and density. The density check confirms the pore fluid swap. The dry frame check confirms the inverse step is physically sensible. The shear velocity direction check confirms the substitution ran the right way round, since a gas case must have a higher shear velocity than the brine case it came from.
