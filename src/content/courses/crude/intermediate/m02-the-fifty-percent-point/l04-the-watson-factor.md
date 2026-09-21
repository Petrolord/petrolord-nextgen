# The Watson factor

The Watson characterisation factor takes two figures the blend already has, a boiling temperature and a specific gravity, and forms one number from them.

{{panel:crude-valuation-explorer}}

## What the digest says about K

The course says three things about K and no more. It gives the formula. It says the studio takes Tb as the blend's T50, "a SCREENING basis: the strict basis is the mean average boiling point, which the studio does not compute". And it says "the page labels K as the screening figure". It prints no bands on K and no reading of what a given K means, so this course sets none.

## The formula the engine uses

watsonK = Tb^(1/3) / SG, with Tb in degrees Rankine.

SG is the blend's specific gravity, blended on volume. Tb is a boiling temperature on the absolute Rankine scale.

The engine converts from Fahrenheit by adding an offset, and it gives that offset itself. The course reads it back from the function: watsonK at 0 F and SG 1, cubed, is 459.6700. At SG 1 the division does nothing, so the cube of K is Tb in Rankine, and at 0 F that is the offset.

## The Kwale blend's K

The studio takes Tb as the blend's T50, the figure lessons 1 to 3 built. For the Kwale blend that is 587.3184 F, and the blend's SG is 0.8595.

| blend | SG | Watson K at T50 interpolated |
| --- | --- | --- |
| Kwale blend | 0.8595 | 11.8135 |
| the studio's default pair | 0.8727 | 11.7452 |

Each figure uses the blend's own T50, interpolated off the blend's own curve, and the blend's own SG. Everything upstream of K was computed on its own basis: SG through volume, T50 through the blend's curve. K inherits the care taken over both. It also inherits any error. Lesson 2 printed K at the grid reading as 12.0447 for the Kwale blend, so a wrong T50 moves the characterisation factor as well as the temperature.

## What the engine declines

The formula has a cube root of an absolute temperature and a division by a specific gravity. Neither makes sense for every input. The course runs two probes: watsonK declines a non-physical input: at -500 F it returns no value, and at SG 0 it returns no value.

Tb is F plus the offset of 459.6700, and at -500 F that is below zero on the Rankine scale. An SG of 0 is the divisor of the formula. In both cases the engine returns no value, and no figure is printed for K.

## What K is not asked to do here

The engine's rules for the valuation leave K out. Cut yields are the curve at the cut's upper bound minus the curve at its lower bound. The netback formula in module 4 is written in cut yields, product prices, losses, processing cost and freight, and K is not among its terms. Lesson 5 is about the basis it is taken on, which the studio itself marks as a screening basis.

## Exercise

Read the Kwale blend's SG, its T50 interpolated and its Watson K at T50, and the offset the engine gives, 459.6700. Say which of the two inputs to K came from the blend's curve and which from its gravity, and on what basis each was blended. Then read the two probes the engine declines and quote what it returns for each.
