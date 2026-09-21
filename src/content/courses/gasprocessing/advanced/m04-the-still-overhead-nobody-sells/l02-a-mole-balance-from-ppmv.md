# A mole balance from ppmv

The BTEX chain is the simplest arithmetic in the module and it is worth reading precisely for that reason. There is nowhere for a subtlety to hide, so what the answer is sensitive to is completely visible.

{{panel:fc-water-explorer}}

## The chain

A concentration in parts per million by volume is a mole fraction. Multiply by the moles of gas the plant handles and you have moles of aromatic in the inlet stream. Multiply by the fraction the glycol absorbs and you have moles going round the loop. Multiply by a molecular weight and you have a mass. Convert the time base and the mass base and you have short tons a year.

Every step in that chain is a multiplication. No step solves anything, iterates, or looks anything up.

## The surface

| ppmv in | absorbed fraction | lb/day | short tons/yr |
| --- | --- | --- | --- |
| 60.000000 | 0.100000 | 90.1857 | 16.458894 |
| 180.000000 | 0.100000 | 270.5572 | 49.376683 |
| 180.000000 | 0.150000 | 405.8358 | 74.065024 |
| 180.000000 | 0.200000 | 541.1143 | 98.753366 |
| 400.000000 | 0.150000 | 901.8572 | 164.588943 |
| 900.000000 | 0.150000 | 2029.1788 | 370.325122 |

## The table states its own linearity

Both columns are linear in both inputs, and the rows prove it rather than the prose asserting it. Tripling the concentration from 60 to 180 ppmv at a fixed absorbed fraction multiplies the pounds a day by 3.000000000000. Doubling the absorbed fraction from 0.1 to 0.2 at a fixed concentration multiplies it by 2.000000000000.

Both of those are the course dividing two rows of the table above. Neither is an estimate and neither is an assumption about what a mole balance ought to do.

A mole balance with one operating multiplier and no chemistry is exactly what those two figures describe. If either had come back as anything other than a clean whole number, something in the chain would have been doing more than multiplying.

## What the table cannot tell you

Linearity is a property of the arithmetic rather than of the plant. A real glycol loop does not absorb a fixed fraction of the aromatics at every concentration, every temperature and every circulation rate. The engine is linear because it was given one multiplier and told to apply it, and the table faithfully reports that.

So read the columns as what follows from the fraction you supplied. Read nothing in them as evidence that the fraction itself holds across the range the concentration column covers.

## What linearity is worth here

It makes the answer completely traceable. Any figure in the table can be reached from any other by multiplying the ratio of the concentrations and the ratio of the fractions, so there is no state, no memory and no path dependence.

It also makes the uncertainty easy to state, which is the honest use of it. The absorbed fraction is a typed operating value, so whatever relative uncertainty you attach to it lands unchanged on the pounds a day and on the short tons a year. There is no damping anywhere in the chain to soften a bad input.

## Exercise

Write out the chain from a concentration in ppmv through to a mass, naming each multiplication in order. Record the two linearity figures the lesson prints, naming the two rows each was formed from. Then pick any row of the table and reach any other row from it using only those ratios.
