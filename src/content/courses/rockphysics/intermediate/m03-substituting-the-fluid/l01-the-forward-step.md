# The forward step

The frame is recovered. This lesson puts a new fluid into it and gets a new saturated modulus, which is the only quantity in the substitution that Gassmann's relation actually has to compute.

## The relation

$$K_{sat}' = K_{dry} + \frac{\left(1 - \dfrac{K_{dry}}{K_{min}}\right)^2}{\dfrac{\phi}{K_{fl}'} + \dfrac{1 - \phi}{K_{min}} - \dfrac{K_{dry}}{K_{min}^2}}$$

The first term is the frame on its own. The second is what the fluid adds. Everything interesting is in that second term.

The numerator is the square of the Biot coefficient, 0.8013 for this rock, so 0.6421. That factor says how much of a fluid's stiffness the frame can transmit: a compliant frame in a stiff mineral passes most of it on, a stiff frame passes little.

The denominator is dominated by $\phi / K_{fl}'$, the compliance the fluid contributes. A soft fluid makes that term large and the whole fraction small.

## The Ekene gas case

With gas at 55.71865290286663 MPa:

$$\frac{\phi}{K_{fl}'} = \frac{0.25}{55.71865290286663 \times 10^6} = 4.487 \times 10^{-9} \ \mathrm{Pa^{-1}}$$

The other two denominator terms are $0.75/37\times10^9 = 2.03\times10^{-11}$ and $-7.35\times10^9/(37\times10^9)^2 = -5.37\times10^{-12}$, both around two hundred times smaller. So the gas term is the denominator, near enough.

The result is

$$K_{sat}' = 7.492988063073051 \ \mathrm{GPa}$$

against 13.32 GPa with brine. The rock lost 44 percent of its bulk stiffness, which is exactly what the last module said the brine had been supplying.

## The gas adds almost nothing

Compare the two saturated moduli against the frame. With brine, the fluid adds $13.32 - 7.350343061720982 = 5.9697$ GPa. With gas, it adds $7.492988063073051 - 7.350343061720982 = 0.1426$ GPa.

Forty two times less. A rock with gas in its pores is very nearly a dry rock as far as compressional stiffness is concerned, which is the physical content of every gas anomaly ever interpreted.

## Why the fluid modulus enters as a compliance

The denominator holds $\phi / K_{fl}$ rather than $K_{fl}$ itself, and that inversion is the reason the response is so lopsided.

A soft fluid is a compliant one, and compliances add. Wood's equation at the tier below did the same thing when mixing brine and gas: the mixture's compliance is the volume weighted sum of the components' compliances, so a little gas dominates the mixture.

Here the same structure appears one level up. The rock's fluid contribution is governed by the fluid's compliance, so a soft fluid contributes almost nothing to the stiffness and the frame is left to carry the rock on its own.

Module four is about what that does across a range of saturations, and it follows from this one line.

## Reading it off the panel

Set the saturation to 1.00 and then to 0.00 and watch the pore fluid modulus tile alongside the vp tile.

{{panel:rp-substitution-explorer}}

The fluid modulus tile falls from 2697.8113 MPa to 55.7187, a factor of 48. The velocity tile falls from 3200 to 2905.6972, a factor of 1.10. A 48-fold change in the fluid produces a 10 percent change in the rock, because the frame is carrying most of the load either way.

## Worked example

Predict the gas case velocity from the new modulus and density, closing the loop from module one.

$$v_p' = \sqrt{\frac{K_{sat}' + \tfrac{4}{3}\mu}{\rho'}} = \sqrt{\frac{7.492988063073051 \times 10^9 + 9.72 \times 10^9}{2038.7104517793223}}$$

$$= \sqrt{\frac{17.212988063073051 \times 10^9}{2038.7104517793223}} = 2905.6972280296195 \ \mathrm{m/s}$$

which is the fourth capstone value. Note that the shear term $\tfrac{4}{3}\mu = 9.72$ GPa is the same in both cases and is now the larger part of the numerator: in the gas case the rock's compressional stiffness is more shear than bulk.

## Exercise

State what the forward relation would return if you fed it a fluid with zero bulk modulus, and say whether that is physically sensible.

Self check: with $K_{fl}' \to 0$ the term $\phi / K_{fl}'$ goes to infinity, the fraction goes to zero, and $K_{sat}'$ returns $K_{dry}$ exactly. That is sensible and is the definition of the dry frame: a fluid with no stiffness at all contributes nothing, so the saturated rock is the dry rock. It also shows why the gas case sits so close to the dry case, since gas is only 55.7 MPa against the frame's 7350 MPa.
