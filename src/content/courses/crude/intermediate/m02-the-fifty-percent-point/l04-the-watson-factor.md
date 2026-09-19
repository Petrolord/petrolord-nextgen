# The Watson factor

Two numbers describe where a crude sits: how dense it is and how hot it boils. The Watson characterisation factor puts them into one.

{{panel:crude-valuation-explorer}}

## What K is for

Crudes and fractions of the same density can be very different in chemistry. A paraffinic stream is light for its boiling range; an aromatic stream is dense for its boiling range. Neither density alone nor boiling point alone separates them, but the two together do. The Watson factor is the classic way of combining them, and refiners use it as a quick read on the chemical family of a stream. As a general direction, a higher K leans paraffinic and a lower K leans naphthenic and aromatic. This course does not set bands on it, and the digest prints none.

## The formula the engine uses

watsonK = Tb^(1/3) / SG, with Tb in degrees Rankine.

SG is the blend's specific gravity, blended on volume. Tb is a boiling temperature on the absolute Rankine scale.

The engine converts from Fahrenheit by adding an offset, and it gives that offset itself. The digest reads it back from the function: watsonK at 0 F and SG 1, cubed, is 459.6700. At SG 1 the division does nothing, so the cube of K is Tb in Rankine, and at 0 F that is the offset.

## The Kwale blend's K

The studio takes Tb as the blend's T50, the figure lessons 1 to 3 built. For the Kwale blend that is 587.3184 F, and the blend's SG is 0.8595.

| blend | SG | Watson K at T50 interpolated |
| --- | --- | --- |
| Kwale blend | 0.8595 | 11.8135 |
| the studio's default pair | 0.8727 | 11.7452 |

Each figure uses the blend's own T50, interpolated off the blend's own curve, and the blend's own SG. Everything upstream of K was computed on its own basis: SG through volume, T50 through the blend's curve. K inherits the care taken over both. It also inherits any error. Lesson 2 printed K at the grid reading as 12.0447 for the Kwale blend, so a wrong T50 moves the characterisation factor as well as the temperature.

## What the engine declines

The formula has a cube root of an absolute temperature and a division by a specific gravity. Neither makes sense for every input. The digest prints two probes: watsonK declines a non-physical input: at -500 F it returns no value, and at SG 0 it returns no value.

A temperature of -500 F lies below absolute zero, so there is no absolute temperature to take a root of. The second would divide by zero. In both cases the engine returns no value instead of a number that would look like a characterisation factor.

## What K is not asked to do here

K in this studio is a label on the blend. Nothing downstream in the valuation uses it: the cut yields come from the curve, and the netback in module 4 comes from the yields and prices. K is a characterisation for the reader. Lesson 5 is about the basis it is taken on, which the studio itself marks as a screening basis.

## Exercise

Read the Kwale blend's SG, its T50 interpolated and its Watson K at T50, and the offset the engine gives, 459.6700. Say which of the two inputs to K came from the blend's curve and which from its gravity, and on what basis each was blended. Then read the two probes the engine declines and say what a number returned in their place would have claimed.
