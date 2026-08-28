# Relative permeability tables

PVT says how each fluid behaves alone. Relative permeability says how they interfere with each other when they share the same pore space, and it is given as a table of saturations against mobility.

## The two tables

**SWOF** is the water-oil table: water saturation, water relative permeability, oil relative permeability in the presence of water, and the oil-water capillary pressure.

**SGOF** is the gas-oil table: gas saturation, gas relative permeability, oil relative permeability in the presence of gas, and the gas-oil capillary pressure.

Between them they describe a three-phase system, and the simulator combines them when all three phases are present.

## The Ekene SWOF

Twenty two rows. The first three and the last two:

| Sw | krw | krow |
|---|---|---|
| 0.35 | 0 | 0.9 |
| 0.37 | 0.0001677050983124846 | 0.81225 |
| ... | ... | ... |
| 0.75 | 0.3 | 0 |
| 1 | 0.3 | 0 |

Read the ends. At Sw = 0.35 the water is completely immobile, krw is exactly zero, and the oil is at its maximum mobility of 0.9. That 0.35 is the connate water saturation: water is present, it fills 35 percent of the pore space, and none of it can move.

At Sw = 0.75 the oil has become immobile, krow is zero, and the water is at its endpoint mobility of 0.3. The remaining 0.25 of oil is the residual oil saturation. It is still there and it does not flow.

## Where the curve came from

The SCAL and Displacement course fitted a Corey model to the Ekene sand: connate water 0.35, residual oil 0.25, water endpoint 0.3, oil endpoint 0.9, water exponent 2.5, oil exponent 2.0. The 22 rows in the deck are that model evaluated on a saturation grid.

So the deck contains no new physics. It contains the SCAL course's answer, tabulated.

## Reading the shape

The two exponents control the curvature and they say something physical. The water exponent of 2.5 means krw rises slowly at first: the second row, only 0.02 of saturation above connate, has a water mobility of 0.000168, which is essentially nothing. Water has to build up substantially before it flows at all.

The oil exponent of 2.0 makes krow fall faster than linearly, so the oil loses mobility quickly as water invades.

Together those two shapes are what makes displacement inefficient, and that inefficiency is the whole subject of the SCAL course.

## Capillary pressure

Both tables carry a capillary pressure column, and in this deck both are zero throughout.

That is a modelling choice and it is worth naming. Ekene has a real capillary pressure curve, which the SCAL course built from a Leverett J-function and used to explain why the crest is drier than the flanks. Setting it to zero in the deck says: the transition zone is not being modelled, contacts are sharp, and saturation depends only on which side of the contact a cell sits.

For a field with 49 ft of structural relief and a transition zone of a few feet that is defensible. For a low-permeability field with a transition zone taller than the oil column it would be badly wrong.

## The misconception to avoid

"The endpoints are the same as the table's first and last rows." They are the same here because this table runs exactly from connate water to full water saturation. A table that starts above connate water, or that stops below Sw = 1, has endpoints inside its range and the rows at the edges are not the endpoints. The next lesson is about exactly that.

## Exercise

First, from the first and last rows of SWOF, state the connate water saturation, the residual oil saturation and the movable oil saturation.

Second, this deck sets capillary pressure to zero. Write down one field observation that would tell you that choice was unsafe.
