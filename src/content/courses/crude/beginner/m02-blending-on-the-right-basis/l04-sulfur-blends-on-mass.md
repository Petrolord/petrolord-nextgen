# Sulfur blends on mass

Sulfur is reported in weight percent: so much sulfur per unit mass of crude. TAN is milligrams of potassium hydroxide per gram. Nitrogen is weight percent, and nickel and vanadium are parts per million by weight. Every one of them is per unit mass, so blendCrudes weights every one of them by mass fraction, and names the basis "mass".

{{panel:crude-assay-explorer}}

## Why mass is the right basis here

Think of the sulfur in a blend as a quantity of sulfur atoms. Each crude brings its mass times its sulfur weight percent. The blend holds the sum of those, spread over the total mass. That is a mass-weighted average by construction. Weighting by volume would count a barrel of a light crude and a barrel of a heavy crude as the same amount of oil, when the heavy barrel carries more mass and so more sulfur for the same weight percent.

## The shortcut beside the answer

The table below prints what the engine returns on mass, and beside it the same property weighted by volume fraction with the engine's own helper. The volume column is printed only to be read against the right answer. The engine never reports it.

| blend | property | on mass (the engine) | on volume (the shortcut) | mass minus volume |
| --- | --- | --- | --- | --- |
| Obigbo export blend | sulfur wt% | 0.2642 | 0.2590 | 0.0052 |
| Obigbo export blend | TAN mg KOH/g | 0.3915 | 0.3860 | 0.0055 |
| Obigbo export blend | nitrogen wt% | 0.1029 | 0.1015 | 0.0014 |
| Obigbo export blend | nickel ppm | 6.5980 | 6.4550 | 0.1430 |
| Obigbo export blend | vanadium ppm | 4.0673 | 3.9550 | 0.1123 |
| three crudes, 50, 30 and 20 by volume | sulfur wt% | 0.6138 | 0.5840 | 0.0298 |
| three crudes, 50, 30 and 20 by volume | TAN mg KOH/g | 0.6167 | 0.5960 | 0.0207 |
| three crudes, 50, 30 and 20 by volume | nitrogen wt% | 0.1559 | 0.1510 | 0.0049 |
| three crudes, 50, 30 and 20 by volume | nickel ppm | 14.2202 | 13.5500 | 0.6702 |
| three crudes, 50, 30 and 20 by volume | vanadium ppm | 24.0861 | 22.5100 | 1.5761 |

Every basis cell the engine returns for these ten rows reads "mass".

## Reading the difference column

On every row, mass minus volume is a positive number. In each of these blends the crude richer in sulfur, acid, nitrogen and metals is also the denser one, and the denser crude carries more of the mass than of the volume, as the last lesson showed. So the mass basis gives it more weight, and the volume shortcut understates the property.

The size of the gap depends on the blend. For sulfur in the export blend it is 0.0052 wt%. For sulfur in the three-crude blend, which carries Asarama Heavy at 20 by volume, it is 0.0298 wt%. For vanadium in the three-crude blend it is 1.5761 ppm.

## Why the small gap still matters

A sulfur gap of 0.0052 wt% looks harmless on its own. Sulfur is a specification property, though, and a cargo sold against a maximum sulfur is either on the right side of that limit or it is not. A blend that looks compliant on the volume shortcut can fail on the engine's mass basis, and the buyer's laboratory measures the real thing. The metals feed a refinery's catalyst budget, and an understated vanadium figure understates the catalyst it will consume. None of this makes the volume column a rough answer worth keeping. It is a different quantity, formed on a basis the property does not have.

## The one conversion

Every per-mass property here uses the same mass fractions the engine formed once from the volume shares. That is why the five properties of the export blend are consistent with each other: they all see Obigbo Light at 0.6346 of the mass and Egbema Medium at 0.3654.

## Exercise

Read the sulfur rows for both blends. Quote the engine's figure, the volume shortcut and the mass minus volume column for each. Then read the vanadium rows the same way. Say what the four difference figures show about the direction of the error the volume shortcut makes on these blends, and explain in terms of the crudes' densities why it runs that way.
