# Volume shares become mass shares

A cargo is measured in barrels, and half the properties of a crude are per unit of mass. So blendCrudes converts the shares once, through a step called resolveFractions, and every per-mass property uses the result.

{{panel:crude-assay-explorer}}

## The conversion

Each crude's mass share is its volume share times its specific gravity, over the sum of those products. Which way a share moves is decided against the blend itself. A crude denser than the blend carries more of the mass than of the volume, and a crude lighter than the blend carries less.

| blend | crude | share typed | volume fraction | SG | mass fraction | mass fraction minus volume fraction |
| --- | --- | --- | --- | --- | --- | --- |
| Obigbo export blend | Obigbo Light | 65 | 0.6500 | 0.8408 | 0.6346 | -0.0154 |
| Obigbo export blend | Egbema Medium | 35 | 0.3500 | 0.8990 | 0.3654 | 0.0154 |
| three crudes, 50, 30 and 20 by volume | Obigbo Light | 50 | 0.5000 | 0.8408 | 0.4775 | -0.0225 |
| three crudes, 50, 30 and 20 by volume | Egbema Medium | 30 | 0.3000 | 0.8990 | 0.3063 | 0.0063 |
| three crudes, 50, 30 and 20 by volume | Asarama Heavy | 20 | 0.2000 | 0.9516 | 0.2162 | 0.0162 |

Read the last column. In the export blend, Obigbo Light loses 0.0154 of share going from volume to mass and Egbema Medium gains 0.0154. The fractions still add to one on both bases, so what one crude loses the other gains.

In the three-crude blend the last column prints -0.0225 for Obigbo Light, 0.0063 for Egbema Medium and 0.0162 for Asarama Heavy. The engine prints this blend's specific gravity as 0.8804. Egbema Medium's mass fraction gains 0.0063 here. The sign is decided by comparing each crude with the blend as a whole, so read each SG in the table beside 0.8804.

## Shares typed by mass

A crude can also be given by mass. When every crude carries a mass share and none a volume share, the engine runs the conversion the other way.

| crude | mass share typed | volume fraction | mass fraction |
| --- | --- | --- | --- |
| Obigbo Light | 50 | 0.5223 | 0.5000 |
| Egbema Medium | 30 | 0.2931 | 0.3000 |
| Asarama Heavy | 20 | 0.1846 | 0.2000 |

The same three numbers, 50, 30 and 20, make two different blends depending on which basis they are typed on. The engine gives the blend typed by mass an API of 29.6100 and the blend typed by volume at 50, 30 and 20 an API of 29.2240. The other properties move with it:

| three crudes, 50, 30 and 20 | blend SG | blend API | blend sulfur wt% |
| --- | --- | --- | --- |
| by volume | 0.8804 | 29.2240 | 0.6138 |
| by mass | 0.8783 | 29.6100 | 0.5840 |

A share is a number with a basis, and the basis is part of the recipe. When a recipe says 50, 30 and 20, the first question to ask is whether those are volume shares or mass shares.

## One basis at a time

Because the basis matters this much, the engine will not accept a recipe that mixes the two. Give one crude a volume share and another a mass share and blendCrudes refuses: "Give every crude a volume share, or give every crude a mass share. The two cannot be mixed." A recipe with a share on one crude and none on another is refused too: "Give every crude a volume share or a mass share."

## Why convert once

The engine forms the mass shares in one place and every per-mass property reads them from there. It does not recompute them property by property, and it does not ask you to type them. Sulfur, TAN, nitrogen, nickel and vanadium all use the same mass fractions, so they cannot disagree with each other about how much of each crude is in the blend.

## Exercise

Read the three-crude rows of the first table. Quote each crude's specific gravity and its mass fraction minus volume fraction. Set them beside the blend's specific gravity of 0.8804 and say what these figures show about which crudes gain share when the basis moves from volume to mass. Then quote the two blend APIs for 50, 30 and 20 typed by mass and by volume, and say what they show about typing a share without its basis.
