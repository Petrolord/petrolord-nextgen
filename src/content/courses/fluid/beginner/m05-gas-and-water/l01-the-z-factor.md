# The z factor

The single number that says how far a gas is from being ideal.

## The definition

$$pV = z n R T$$

An ideal gas has z of one. A real gas does not, and z is defined as exactly the factor that makes the ideal gas law true.

That makes z a fudge factor with a precise meaning: it is the ratio of the real molar volume to the ideal one at the same pressure and temperature.

## What it does

At low pressure z approaches one, because molecules are far apart and behave ideally.

As pressure rises, attraction between molecules pulls them closer than ideal and z falls below one. For a typical natural gas the minimum sits somewhere around a reduced pressure of two to three.

At high pressure the molecules' own volume starts to dominate, they cannot be squeezed further, and z rises back through one and keeps going.

That dip and recovery is the shape of every z curve, and knowing it is the sanity check: a z of 1.4 at 500 psia is wrong, and a z of 0.4 anywhere on an ordinary natural gas is wrong.

## Corresponding states

The reason a single chart works for all natural gases is the principle of corresponding states: gases at the same REDUCED pressure and temperature behave alike.

$$p_{pr} = \frac{p}{p_{pc}}, \qquad T_{pr} = \frac{T}{T_{pc}}$$

where the pseudo-critical properties are a mixture average. For a natural gas of known gravity the engine uses Sutton (1985):

$$p_{pc} = 756.8 - 131.0\,\gamma_g - 3.6\,\gamma_g^2, \qquad T_{pc} = 169.2 + 349.5\,\gamma_g - 74.0\,\gamma_g^2$$

For Ekene's 0.75 gas gravity that gives 656.525 psia and 389.7 degrees Rankine.

## Ekene at initial pressure

At 3200 psia and 180 F:

$$p_{pr} = \frac{3200}{656.525} = 4.874147976086212, \qquad T_{pr} = \frac{180 + 459.67}{389.7} = 1.6414421349756225$$

A reduced pressure near five and a reduced temperature near 1.6 puts the gas in the region where z is well below one and climbing back. The next lesson computes it.

## The chain, again

Gas gravity gives pseudo-criticals, which give the reduced state, which gives z. Three steps, and a gas gravity error propagates through all of them.

Gas gravity is measured at surface and depends on how the fluid was separated, which the Professional tier takes up. It is not a fixed property of the reservoir fluid.

## Why 459.67 and not 460

Absolute zero is at minus 459.67 F. Rounding to 460 introduces a third of a degree, which at reservoir temperatures is about 0.05 percent of the absolute temperature.

That is negligible for most purposes and it is not negligible when you are checking whether two implementations agree. The engine uses 459.67 throughout. When two calculations of the same z differ in the fourth decimal, this is the first thing to check.

## The misconception to avoid

"A z factor near one means the gas is behaving ideally, so it can be ignored." A z of 0.86 at reservoir conditions means the gas occupies 14 percent less space than ideal, which is 14 percent more gas in the same pore volume. Nothing about a gas reservoir's inventory survives ignoring it.

## Exercise

First, compute the Sutton pseudo-criticals for a gas gravity of 0.75, then the reduced pressure and temperature at 3200 psia and 180 F.

Second, sketch z against reduced pressure at a reduced temperature near 1.6, marking where it falls below one and where it comes back through.
