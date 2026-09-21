# The Babrauskas burning flux

{{panel:cq-fire}}

The first number in any pool fire is how fast the pool burns. The engine's default is the Babrauskas correlation, printed in the Yellow Book, which ties the burning flux of a pool to its diameter through two constants for each fuel. This lesson reads the formula, the table behind it and the one refusal it can return.

## The formula and its two constants

The correlation is `m" = m"inf (1 - exp(-k beta D))`. Here m" is the burning flux in kg/(m2 s), D is the pool diameter in metres, m"inf is the burning flux a very large pool of that fuel reaches, and k beta is a single product per metre that sets how quickly the pool approaches it. The engine reads both constants from Yellow Book Table 6.5 and exports them as `POOL_FIRE_FUELS`. The product k beta is always read as one constant; the course never splits it.

## Table 6.5 as the engine carries it

| fuel key | m"inf kg/(m2 s) | k beta per m |
| --- | --- | --- |
| liquid-hydrogen | 0.169 | 6.1 |
| lng | 0.078 | 1.1 |
| lpg | 0.099 | 1.4 |
| heptane | 0.101 | 1.1 |
| gasoline | 0.055 | 2.1 |
| kerosene | 0.039 | 3.5 |
| methanol | 0.015 | none, independent of the diameter |
| ethanol | 0.015 | none, independent of the diameter |

The full export carries thirteen fuels; butane, hexane, benzene, xylene and jp-5 complete it. Liquid hydrogen burns fastest per square metre, and the two alcohols slowest.

## A burning flux is a mass rate per area

The unit sits in the argument name, `burningFluxKgM2S`, as it does for every input the engine reads. Multiply a burning flux by the pool area and you have the mass of fuel the fire consumes each second. Every later step reads the burning flux: the flame length through the Thomas correlation, the characteristic wind speed that scales the wind, and the surface emissive power when it is made from the radiative fraction. An error here travels the whole chain.

## Fuels whose diameter does not matter

Methanol and ethanol carry no k beta product. The table says their burning rate is independent of the diameter in the turbulent regime, so the engine returns 0.015000 kg/(m2 s) for either alcohol at every diameter it is given. A clean flame of this kind has no sooty core to build up as the pool grows.

## A fuel the table does not carry

Ask for a fuel outside the thirteen and the engine refuses, naming the field `fuel`:

> fuel: must be one of liquid-hydrogen, lng, lpg, butane, hexane, heptane, benzene, xylene, gasoline, kerosene, jp-5, methanol, ethanol, or give massBurningFluxInfKgM2S and kBetaPerM

The refusal tells you the way forward: supply your own m"inf and k beta product, stated and cited, and the engine uses them in the same formula.

## Exercise

In the fire panel, set a 2 m pool and read the burning flux for heptane, gasoline and methanol. Check the three values against the digest row at 2 m (0.089809, 0.054175 and 0.015000). Then explain, from the k beta products in the table, why gasoline at 2 m sits closer to its own m"inf than heptane does to its own.
