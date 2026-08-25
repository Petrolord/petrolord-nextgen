# Normal incidence first

Before any angle dependence, the simplest case: a wave arriving straight down. It is worth doing separately because it is exact, it is intuitive, and it already contains the surprise this tier is built on.

## The relation

At normal incidence a reflection coefficient is a contrast in acoustic impedance:

$$R_0 = \frac{\rho_2 v_{p2} - \rho_1 v_{p1}}{\rho_2 v_{p2} + \rho_1 v_{p1}} = \frac{I_2 - I_1}{I_2 + I_1}$$

No shear velocity appears. At normal incidence the wave produces no shear motion at the interface, so the shear properties of neither rock matter.

## The two cases

Brine: $R_0 = 0.034457$. A positive reflection, meaning the sand is harder than the shale above it.

Gas: $R_0 = -0.062991$. A negative reflection, meaning the sand is softer.

The magnitude nearly doubles as well as changing sign, which is why gas sands are often the brightest reflectors in a section.

## The surprise

The obvious explanation for a sign change would be that the gas has made the sand slower than the shale. It has not.

The gas sand runs at 2905.70 m/s against the shale's 2743. It is still 162.70 m/s faster, by 5.9 percent.

What flipped the sign is the density. The gas sand is 2038.71 kg/m3 against the shale's 2450, which is 16.8 percent lighter.

Impedance is the product, so the 5.9 percent velocity gain is overwhelmed by the 16.8 percent density loss, and the product comes out 11.9 percent below the shale's.

## Why that matters

Because the density change is the half of the substitution that needed no Gassmann relation at all.

Module three of the tier below computed it by counting what a cubic metre of rock weighs when its pore brine is swapped for gas: $2250 + 0.25(172.6668 - 1017.8250) = 2038.7105$. Arithmetic a bookkeeper would recognise.

That arithmetic is what flips the sign of the reflection, which is what changes the AVO class, which is the headline result of the whole ladder. The most consequential number in three tiers is the one that required no theory.

It also means the result is robust in a specific way. The density calculation depends only on the porosity and the two fluid densities, and it involves none of Gassmann's assumptions about pore connectivity, frequency or anisotropy. Whatever else is uncertain about this model, the density change is not.

## The impedance of the shale

Worth stating explicitly, since it is the reference both cases are measured against:

$$I_{shale} = 2450 \times 2743 = 6{,}720{,}350$$

The brine sand at 7,200,000 sits 7.1 percent above it. The gas sand at 5,923,875 sits 11.9 percent below.

Notice that the gas case is the larger contrast. A prospect with this pairing gives a stronger reflection when it is charged than when it is wet, which is the ordinary situation and the reason bright spots are looked for at all.

## Worked example

Test how firm the sign is by asking whether any assumed porosity could keep the gas reflection positive.

The gas case impedance depends on the porosity through both factors: a higher porosity gives a softer frame but also a lighter rock, and the two fight. Sweeping it gives

| $\phi$ | $v_p$ (m/s) | $\rho$ (kg/m3) | $I$ |
| --- | --- | --- | --- |
| 0.15 | 2319.43 | 2123.23 | 4,924,682 |
| 0.20 | 2709.64 | 2080.97 | 5,638,675 |
| 0.25 | 2905.70 | 2038.71 | 5,923,875 |
| 0.30 | 3033.82 | 1996.45 | 6,056,875 |
| 0.40 | 3210.41 | 1911.94 | 6,138,096 |
| 0.50 | 3344.89 | 1827.42 | 6,112,518 |

The gas impedance rises with porosity, peaks at 6,138,917 near a porosity of 0.413, and falls again. It never reaches the shale's 6,720,350 at any porosity the calculation will accept.

So the sign of this reflection is robust. The magnitude is not: across the plausible range of 0.20 to 0.30 the contrast against the shale runs from 16.1 percent to 9.9 percent, a factor of 1.6. That is the tier below's finding restated at the interface, and it is worth keeping separate from the sign, which nothing in the porosity assumption can change.

## Exercise

A sand and its overlying shale have the same impedance when the sand is brine filled. State what the normal incidence reflection would be in that case, and what it would become with gas.

Self check: with equal impedances the brine case gives a reflection of exactly zero, so the interface is invisible on a stacked section. With gas the sand's impedance falls, so the reflection becomes negative and the interface appears. That is the cleanest possible direct hydrocarbon indicator and it is also a warning: an absent reflection is not evidence of an absent interface.
