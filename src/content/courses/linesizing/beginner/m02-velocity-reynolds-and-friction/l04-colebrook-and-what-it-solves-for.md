# Colebrook, and what it solves for

Above a Reynolds number of 4000 the engine uses the turbulent law, which takes the Reynolds number and the relative roughness. On OGBIA that is 48431.2523 and 0.0002255356, giving 0.0218149625.

{{panel:fc-liquid-explorer}}

## The relative roughness is the second axis

The absolute roughness is a height on the wall, 0.001800 in for commercial steel. Divided by the bore of 7.981000 in it becomes 0.0002255356, and that fraction is what the correlation reads.

So the pipe reaches the friction factor as a proportion rather than as a length. The same steel in a narrower bore is hydraulically rougher, because the same bumps occupy more of the passage.

## It is solved rather than evaluated

The friction factor appears on both sides of the turbulent expression, so it cannot be rearranged into an answer. The engine iterates until the value stops moving and returns the settled figure, which is why this is the one step in the tier that does not simply substitute. Its two coefficients are measured by isolating each one: 2.510000 on a smooth pipe, where the roughness term is exactly zero, and 3.700000 in the fully rough limit, where the Reynolds term falls away.

The published cases show it converging to the oracle's answer digit for digit, at 0.037504518014, 0.021926421295, 0.019943465840 and 0.010859745054 across four widely separated conditions. From 5000.0000 to 10000000.0000 in the Reynolds number, and no disagreement in the printed digits.

## Roughness alone, at two Reynolds numbers

| relative roughness | f at Reynolds 100000.0000 | f at Reynolds 100000000.0000 |
| --- | --- | --- |
| 0.000000 | 0.017989773084 | 0.005940466352 |
| 0.000100 | 0.018513866077 | 0.011999050555 |
| 0.001000 | 0.022174535945 | 0.019638632837 |
| 0.010000 | 0.038503543527 | 0.037904323387 |
| 0.050000 | 0.071780929441 | 0.071550904091 |

That table is the vertical axis of the Moody chart. Read the two columns against each other down the rows: a rough pipe stops caring about the Reynolds number and a smooth one never does.

## What that convergence means for design

On the roughest row the two columns are nearly the same number, so on a rough pipe the flow rate barely affects the friction factor and the loss follows the velocity head alone. On the smoothest row the two columns are far apart, so the answer stays sensitive to the rate throughout.

A designer reads that as a question about which input deserves care. On a rough line the roughness is worth measuring. On a smooth one the rate and the viscosity carry more of the answer.

## Reading the smooth row

The smooth row is the floor the others sit above. It falls from 0.017989773084 at a Reynolds number of 100000.0000 to 0.005940466352 at 100000000.0000, and it keeps falling because no roughness is there to set a limit.

Every other row flattens out. On the 0.010000 row the two columns are 0.038503543527 and 0.037904323387, so a thousandfold change in the Reynolds number barely moves the answer, and the wall has taken over from the flow.

## The mistake

Quoting a friction factor without the pair of numbers behind it. A figure of 0.0218149625 is the answer for one Reynolds number at one relative roughness, and neither of those survives a change of bore, because the bore is in both of them.

## Exercise

Give the two inputs the turbulent law takes and say how the relative roughness is formed. Then say why this step iterates, and what the two columns of the roughness table say when read against each other.
