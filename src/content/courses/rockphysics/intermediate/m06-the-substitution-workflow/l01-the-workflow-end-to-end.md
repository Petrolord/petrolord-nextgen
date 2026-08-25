# The workflow end to end

The whole tier in one sequence, with the failure mode attached to each step.

## The nine steps

**One. Establish the fluid state of the interval.** Which fluid was in the pores when the log was recorded. Everything downstream assumes it.

**Two. Get a shear velocity.** Measured if there is one, estimated if not, and estimated on the brine case only.

**Three. Convert to moduli.** $\mu = \rho v_s^2$ and $K_{sat} = \rho v_p^2 - \tfrac{4}{3}\mu$.

**Four. Fix the porosity and the mineral modulus.** Both are assumptions. Record them, and check the porosity against the implied grain density.

**Five. Compute the fluid properties at in situ conditions.** The Associate tier's work, at the temperature, pressure, salinity and composition of this reservoir.

**Six. Recover the dry frame.** Inverse Gassmann. Check that it is positive, below the mineral modulus, and physically sensible against the Biot coefficient.

**Seven. Substitute.** Forward Gassmann for the new bulk modulus, mass bookkeeping for the new density, and the shear modulus carried through unchanged.

**Eight. Convert back to velocities.** And form impedance and the velocity ratio, which are what an interpreter uses.

**Nine. Report with the assumptions and the sensitivity.** Especially the porosity range.

## Where each step fails

Step one fails silently and expensively. A substitution run on an interval that is already hydrocarbon bearing, treated as brine, is wrong from the first line and produces no error.

Step two fails when shear is estimated from a hydrocarbon bearing compressional velocity, which the previous lesson measured at 22 percent.

Step three does not fail. It is exact arithmetic in both directions.

Step four is where the leverage is. A porosity wrong by 0.05 moves the answer by more than the entire oil to gas separation.

Step five fails when library fluid properties are used instead of properties computed at this reservoir's conditions, which the Associate tier's module five was about.

Step six fails loudly if the inputs are inconsistent, and that is a feature. It fails quietly when Gassmann's own assumptions are violated: unconnected porosity, strong anisotropy, or a reactive frame.

Step seven does not usually fail on its own.

Step eight does not fail.

Step nine fails by omission, and it is the most common failure of all: a six figure velocity quoted with no porosity beside it.

## The order that cannot change

Steps two and seven have a fixed order, for the reason the last lesson gave.

Steps four and six also have a fixed order, since the frame cannot be recovered without the porosity. That is worth noticing because it means the frame is not an independent measurement of the rock; it inherits whatever porosity you assumed.

## Worked example

Run the whole sequence on Ekene in one pass, quoting the number at each step.

One: brine, since the log was recorded below the contact. Two: measured at 1800 m/s. Three: $\mu = 7.29$ GPa and $K_{sat} = 13.32$ GPa. Four: porosity 0.25, mineral modulus 37 GPa, implied grain density 2660.7 kg/m3 which is consistent with a 70/30 quartz and clay mixture. Five: brine 2697.8113 MPa and 1017.8250 kg/m3, gas 55.7187 MPa and 172.6668 kg/m3 at 60 degC and 25 MPa. Six: dry frame 7.350343061720982 GPa, Biot coefficient 0.80, comfortably valid. Seven: gas case bulk modulus 7.492988063073051 GPa, density 2038.7104517793223 kg/m3, shear modulus unchanged at 7.29 GPa. Eight: 2905.6972280296195 m/s and 1890.9758806113214 m/s, impedance 5.9239e6, velocity ratio 1.5366. Nine: the porosity range of plus or minus 0.05 gives a velocity range of 2710 to 3034 m/s.

Nine lines. What took five modules was knowing what each is worth.

## Exercise

A colleague hands you a substituted gas velocity and asks you to check it. List the four things you would ask for, in order of how much they could change the answer.

Self check: ask for the assumed porosity first, since it is the most leveraged input by a factor of five; then whether the shear velocity was measured or estimated, and if estimated, from what; then the fluid properties and the conditions they were computed at; then the mineral modulus, which is worth the least of the four. The saturated modulus from the log is worth checking last, since it is closest to a measurement and is exact arithmetic from it.
