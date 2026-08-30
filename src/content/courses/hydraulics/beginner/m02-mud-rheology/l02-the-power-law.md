# The power law

Two parameters, fitted to two readings.

{{panel:hy-rheology-explorer}}

## The model

    tau = K gamma^n

with tau the shear stress, gamma the shear rate, K the consistency index and n the flow behaviour index.

A fluid with n = 1 is Newtonian and K is its viscosity. A fluid with n below 1 is shear thinning: the faster you shear it, the less viscous it appears.

## The fit

Two parameters, two readings, so the fit is exact:

    n = log2(theta600 / theta300)
    K = tau600 / (gamma600)^n

For kcl_polymer: n = 0.7520724865564147 and K = 0.17822183097896477 Pa.s^n.
For light_wbm: n = 0.6844981742720707 and K = 0.200141764252581 Pa.s^n.

## Reading the two numbers

The light mud has the LOWER n, so it is the more shear thinning of the two. Its curve falls away from the heavy mud's more steeply as the shear rate drops.

The light mud also has the HIGHER K. That is not a contradiction: K is the stress at a shear rate of one, and the two curves cross.

Quoting K without n is meaningless, because their units depend on each other: K is in Pa.s^n, and n is in the exponent.

## What the model gets right

The high shear rate end, because that is where it was fitted. Inside the drill pipe the shear rate is in the hundreds or thousands per second, which is exactly the range the 600 and 300 rpm readings cover.

## What it gets wrong

The low shear rate end. A power law has NO yield stress: as the shear rate goes to zero the stress goes to zero.

A real drilling mud does not do that. At 3 rpm, kcl_polymer reads 3.0624 Pa and the power law predicts 0.607508444606195 Pa. That is a factor of five, and it is in the range the annulus actually runs at.

## The consequence

A power-law pressure loss in the annulus is too low, because the model thinks the mud is much thinner there than it is.

That error is usually in the unsafe direction: it underestimates the equivalent circulating density and overestimates how easily the mud is moving.

## Exercise

Compute the power-law prediction at 3 rpm for both muds from the fitted parameters.

Compare each against the measured 3 rpm reading, and express the error as a factor rather than a percentage.
