# The overall coefficient

`overallU` returns one headline number and four things around it, and the four are what make it usable.

{{panel:pd-thermal-explorer}}

## What comes back

A flag, `ok`. The coefficient in Btu/(hr ft2 degF). The total resistance in hr ft degF/Btu per foot of pipe. A `referenceIdIn`, the diameter the coefficient is expressed against. And an array of terms, each with a resistance and a share of the total.

On the published insulated build that is U 1.3348791131, total resistance 0.4718007538, `referenceIdIn` 6.065 in, and 4 terms.

## U is the stack inverted, per unit of area

U is one divided by the product of the total resistance, pi, and the reference diameter in ft. The total and the coefficient are never independent readings of a pipe: the coefficient is the total, divided by an area and turned upside down. Every term that raises the total lowers U, by an amount that depends on how big the total was already.

## Two roads to the same three numbers

The goldens for this pipe were cut by an independent oracle working in SI throughout, watts and metres and kelvin, converting only at the boundary. The engine stacks the same resistances in field units and never leaves them.

| Build | Golden U | Engine U | Relative difference |
| --- | --- | --- | --- |
| Bare | 105.9799308356 | 105.9799311355 | 2.829978e-9 |
| Insulated | 1.334879072040 | 1.334879113149 | 3.079607e-8 |
| Buried 4.0 ft | 0.713200015595 | 0.713200037662 | 3.094143e-8 |

The residual is the round trip, not a disagreement about physics. The oracle publishes the insulated total resistance as 0.272601445462 K m / W where the engine reports 0.471800753818 hr ft degF/Btu per foot, and it carries the factor between those units as 1.7307346000 against an exact 1.7307346664, a relative difference of 3.834868e-8. That is the size of the gap in the U column, and where it comes from.

## The mistake

Reading ten agreeing figures as ten figures of accuracy. Two routes agreeing to 3.079607e-8 have agreed about arithmetic on inputs they share, and both inherit the film coefficients, the one genuinely uncertain entry in the calculation and exposed as an input for that reason. On the bare build the two films carry 42.39197245 percent and 48.51081376 percent between them, and the catalog offers a swept seabed at 200.0000 Btu/(hr ft2 degF) against still water at 50.0000. Choosing is a judgement.

## What it refuses, and what it never asks

A pipe with no layers is refused: `ok = false`, "A pipe needs at least one layer: its own wall." A layer that cannot be resolved is refused as well, and the message names what a layer needs: an inside diameter, a larger outside diameter and a positive conductivity.

What it never asks for is a fluid, a rate, a temperature or a length. `overallU` is geometry and materials, so one U describes the line at any rate, and anything that depends on how fast the fluid moves happens elsewhere.

## Exercise

Build the bare pipe, then the insulated one, then the buried one, recording U and the total resistance for each.

Then change the outside film on the bare build to still water, and say whether the change is larger or smaller than the 2.829978e-9 separating the two computational routes.
