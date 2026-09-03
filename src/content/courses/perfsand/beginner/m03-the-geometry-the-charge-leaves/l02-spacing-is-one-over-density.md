# Spacing is one over density

The one conversion in this module, and the two places its result is used.

{{panel:ps-shot-explorer}}

## The conversion

Shot density arrives in shots per foot. Multiply by the feet in a metre to get shots per metre. Take the reciprocal to get the spacing in metres.

Equivalently: the spacing in metres is the length of a foot divided by the shots per foot. Four shots per foot is a spacing of a little over seven and a half centimetres; twelve shots per foot is a little over two and a half.

## Where it is used

Twice, and in opposite senses.

In the converging-flow term it appears as a dimensionless spacing, which is the spacing divided by the tunnel length, times the square root of the permeability anisotropy. A larger spacing means a longer vertical path for the fluid, and a larger converging-flow skin.

In the dimensionless perforation radius it appears in the denominator: the radius divided by twice the spacing. So a larger spacing makes the perforation look relatively smaller, which also worsens the converging-flow term.

And in the crushed-zone term it appears as the spacing divided by the tunnel length again, multiplied by the logarithm of the damage ring.

## What that means for design

Shot density is the one geometric input a designer can raise without changing the charge. More shots per foot lowers the converging-flow skin and lowers the crushed-zone skin, and touches neither the plane-flow term nor the blockage term.

So density is a lever on two of four components, and it is a lever with diminishing returns because the spacing is a reciprocal.

## A check worth doing

Multiply the spacing by the shot density in the same units. The answer must be one, exactly, at every density.

That sounds too simple to be worth doing, and it is the check that catches the most common error in this whole subject: a shot density in shots per foot used where shots per metre was wanted, which is a factor of about three and a quarter in a term that matters.

## Exercise

Convert four, six, eight and twelve shots per foot into spacings in metres.

Name the three places the spacing enters the skin calculation and say which way each one moves when the spacing rises.

Then state the unit check in one sentence and say what error it catches.
