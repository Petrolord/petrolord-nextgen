# A ratio that needs no pressure

{{panel:fc-chemistry-explorer}}

Which corrosion product governs the surface is decided here by one number: the
ratio of the H2S partial pressure to the CO2 partial pressure. The single most
useful thing about that number is that it does not need a pressure at all.

Both arguments are partial pressures. A partial pressure is the total pressure
multiplied by a mole fraction, so when you divide one by the other the total
pressure cancels and the ratio equals the ratio of the two mole fractions at any
pressure whatsoever.

| total pressure bar | CO2 mol fraction | H2S mol fraction | ratio from partial pressures | ratio from mole fractions | difference |
| --- | --- | --- | --- | --- | --- |
| 10.000000 | 0.020000 | 0.000800 | 0.040000000000 | 0.040000000000 | 0 |
| 50.000000 | 0.020000 | 0.000800 | 0.040000000000 | 0.040000000000 | 0 |
| 137.400000 | 0.020000 | 0.000800 | 0.040000000000 | 0.040000000000 | 0 |
| 250.000000 | 0.020000 | 0.000800 | 0.040000000000 | 0.040000000000 | 0 |
| 400.000000 | 0.020000 | 0.000800 | 0.040000000000 | 0.040000000000 | 0 |

The last column is zero at every pressure, and that is the whole claim. A ratio
that moved with pressure would have been built from the wrong quantity.

## Why this course checks it that way

Reaching the same number by two routes catches two specific mistakes. The first
is an H2S partial pressure built from the total pressure with the mole fraction
dropped. The second is an H2S partial pressure that has been handed a CO2
fugacity where a partial pressure belongs. Neither could ever be caught by
writing the engine's own ratio out a second time, because a copy of an
expression agrees with the expression whatever either of them is doing.

That is the general shape of an independent check. Two routes that share a step
cannot test the step they share.

## What the ratio is for

The regime word the next lesson covers is what this ratio produces. It does not
enter the rate and it does not move the wall shear. Its job is to say whether a
CO2 rate model is still the right model for the surface, and through that it
decides whether the band label and the remaining life are issued at all, which
the next lesson shows.

Because it needs no pressure, the ratio is also the one chemistry number on this
form you can form from the two mole fractions in your head. Two mole percentages
out of a gas analysis are enough. Everything else on the chemistry panel needs at
least a total pressure before it means anything.

## Partial pressure and fugacity are different quantities here

The rate is driven by the CO2 FUGACITY, which is the CO2 partial pressure times
a coefficient. This ratio, and the H2S screening threshold in the next lesson
but one, are driven by PARTIAL PRESSURES. No fugacity correction is applied to
H2S at all, and the engine declares that in a field of its own rather than
leaving it as a convention a reader has to infer. The Fluid Properties course at
its Expert tier owns the thermodynamics of fugacity and partial pressure; what
is specific here is which quantity drives which answer.

On the studio's shipped default case the H2S to CO2 ratio is 0.033333333333.

## Exercise

Record the ratio the engine returns at total pressures of 10.000000, 137.400000
and 400.000000 bar with the mole fractions held fixed. Then form the ratio of
the two mole fractions by hand and compare. State what the agreement between
your figure and the engine's tells you about which quantity the ratio is built
from.
