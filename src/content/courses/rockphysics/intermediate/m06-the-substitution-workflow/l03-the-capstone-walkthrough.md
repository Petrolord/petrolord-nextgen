# The capstone walkthrough

The capstone asks for six numbers. This lesson walks through each, says what it tests, and gives the checks worth running before submitting.

## The task

The logged Ekene sand is brine saturated at 3200 m/s, 1800 m/s and 2250 kg/m3, with a porosity of 0.25 and a mineral modulus of 37 GPa. Recover the dry frame with inverse Gassmann, substitute to gas, and report the panel. Where the sonic has no shear, predict the shear velocity at a compressional velocity of 3000 m/s with Greenberg-Castagna for the 70/30 sand and shale mix.

## The settings

Set the saturation to 0.00, the porosity to 0.25 and the mineral modulus to 37 GPa, which is the panel's default configuration.

{{panel:rp-substitution-explorer}}

## The six values

**Shear modulus 7.29 GPa**, tolerance 0.01. Exact from $\rho v_s^2$, needing no panel at all.

**In situ saturated bulk modulus 13.32 GPa**, tolerance 0.01. Exact from $\rho v_p^2 - \tfrac{4}{3}\mu$.

**Dry frame bulk modulus 7.350343061720982 GPa**, tolerance 0.01. The inverse Gassmann tile.

**Gas case compressional velocity 2905.6972280296195 m/s**, tolerance 1.

**Gas case density 2038.7104517793223 kg/m3**, tolerance 0.5. Reachable by hand from the density bookkeeping.

**Greenberg-Castagna shear velocity at 3000 m/s, 1521.197276567149 m/s**, tolerance 1. This one is not about the Ekene substitution at all; it is the shear estimator, run at a different velocity.

## What each tests

The first two test the conversion from a log point into moduli, which is where every substitution begins. They are graded tightly because they are exact.

The third tests the inverse step and, with it, whether the porosity and mineral modulus were entered correctly. It is the value most sensitive to a wrong input: at a porosity of 0.20 it would be 5.356 and at 0.30 it would be 8.546, both far outside the tolerance.

The fourth and fifth test the forward step and the density bookkeeping, which are separable, so getting one right and the other wrong tells you which half failed.

The sixth tests whether you noticed that the shear estimator is a separate tool, evaluated at 3000 m/s rather than at the logged 3200. Running it at 3200 gives 1679.9458454651794, which fails by a wide margin.

## The most common error

Reporting the Greenberg-Castagna value at the logged velocity rather than at 3000 m/s.

The task says at 3000, the panel's substitution runs at 3200, and the two are 158.7 m/s apart against a tolerance of 1. Read the task twice on that field.

The second most common is entering the mineral modulus in the wrong units, since it is quoted as 37 GPa and the engine works in pascals.

## Checks before submitting

Confirm that $\tfrac{4}{3} \times 7.29 = 9.72$ and that $13.32 + 9.72 = 23.04$, which is $\rho v_p^2 / 10^9$. That single line validates the first two values against the log.

Confirm the density by hand: $2250 + 0.25(172.66679461728904 - 1017.8249875) = 2038.7104517793223$.

Confirm that the dry frame is below the mineral modulus and above zero, and that the Biot coefficient is 0.80.

And confirm the direction of the shear velocity: it should read 1890.9758806113214 on the panel, higher than the logged 1800.

## Worked example

Derive the gas case velocity from the three moduli, so the tile is confirmed rather than copied.

The gas case saturated bulk modulus is 7.492988063073051 GPa and the shear modulus is unchanged at 7.29 GPa, so

$$K + \tfrac{4}{3}\mu = 7.492988063073051 + 9.72 = 17.212988063073051 \ \mathrm{GPa}$$

and the density is 2038.7104517793223 kg/m3, so

$$v_p = \sqrt{\frac{17.212988063073051 \times 10^9}{2038.7104517793223}} = 2905.6972280296195 \ \mathrm{m/s}$$

which is the graded value to every digit.

## Exercise

Record the six capstone values from the panel and run all four checks. State what each check confirmed.

Self check: the modulus check confirms that 7.29 and 13.32 are consistent with the logged velocities and density, since they sum with the shear term to 23.04 GPa. The density check confirms the pore fluid swap. The Biot check confirms the dry frame is physically sensible at 0.80. The shear velocity direction check confirms the substitution ran the right way round, since a gas case must have a higher shear velocity than the brine case it came from.
