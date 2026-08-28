# Corey into a table

The SCAL course produced a Corey model with six parameters. The deck carries 22 rows of numbers. This lesson is the conversion, and what it throws away.

## The six parameters

| parameter | value |
|---|---|
| connate water | 0.35 |
| residual oil | 0.25 |
| water endpoint | 0.3 |
| oil endpoint | 0.9 |
| water exponent | 2.5 |
| oil exponent | 2.0 |

Those six numbers are a complete description of the water-oil relative permeability of the Ekene sand. From them you can compute the mobility of either phase at any saturation.

## The conversion

Normalise the saturation between the endpoints, raise it to the exponent, scale by the endpoint mobility. For water:

$$S_w^* = \frac{S_w - S_{wc}}{1 - S_{wc} - S_{or}}, \qquad k_{rw} = k_{rw,\max}\,(S_w^*)^{n_w}$$

Evaluate that on a grid of 21 saturations from connate water to residual oil, add a closing row at Sw = 1, and you have the deck's 22 rows.

## Checking one row

The second row of SWOF is at Sw = 0.37, only 0.02 above connate water. Normalised:

$$S_w^* = \frac{0.37 - 0.35}{1 - 0.35 - 0.25} = \frac{0.02}{0.4} = 0.05$$

and

$$k_{rw} = 0.3 \times 0.05^{2.5} = 0.0001677050983124846$$

which is what the deck carries. Two percent of the way along the mobile range, the water has one two-thousandth of its endpoint mobility. A water exponent of 2.5 makes water very reluctant to move at low saturation, and that reluctance is a large part of why displacement works at all.

## What the tabulation throws away

The parameters. Once the table is in the deck, the six numbers that generated it are gone.

That is a real loss. A reader can see the curve but cannot see that it is a Corey curve, cannot recover the exponents without fitting them back, and cannot tell whether the shape came from a model or from laboratory points.

The fix is a comment. A deck whose SWOF block is preceded by a line naming the model and its parameters is auditable; one without it is 22 numbers.

## Why the deck does not carry the model instead

Because the format has no way to express it. A relative permeability table is a table, and every simulator interpolates between its rows. There is no keyword for "Corey with these exponents".

That is a deliberate design in the file format: it keeps the simulator independent of any particular saturation model, at the cost of losing the provenance at the boundary. The same trade appears in the PVT section, which also carries numbers rather than correlations.

## How many rows

Twenty two here, uniformly spaced across the mobile range plus the closing row. That is fine for a curve this smooth, and the Associate tier covered what happens between the rows.

The number is a judgement. Too few and the polyline departs from the curve; too many and the table is decoration. A useful test: halve the row count and see whether anything downstream moves. If it does not, the original count was generous.

## The misconception to avoid

"The table is the measurement." The table is a model evaluated on a grid. Ekene's rock curves came from a Corey fit, and behind that fit were laboratory points, and behind those was a core plug that may or may not represent the sand. Each of those steps is a place the curve could be wrong, and the table shows none of them.

## Exercise

First, verify the third SWOF row yourself: compute the normalised saturation and the water relative permeability at Sw = 0.39 from the six parameters.

Second, explain in two sentences why a deck should carry a comment naming the saturation model, given that the simulator ignores comments entirely.
