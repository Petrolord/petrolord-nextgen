# Axis closure

A relative permeability table has to cover the whole range of saturation the simulator might ask about. Where it should stop is different for the two tables, and getting it wrong is the classic deck error that this lesson is named for.

## SWOF closes at 1

The water-oil table runs from connate water to a water saturation of one:

    first row  Sw = 0.35
    last row   Sw = 1

The physical range of interest is 0.35 to 0.75, from connate water to residual oil. Above 0.75 the oil is immobile and nothing changes. So why carry rows up to 1?

Because the simulator may ask. A cell in the water leg is at Sw = 1, and the table has to have a value there. The deck closes the axis by carrying one final row at Sw = 1 with the water endpoint mobility held at 0.3 and the oil at zero.

{{panel:sim-deck-explorer}}

Find SWOF in PROPS and read the last two rows. Both carry krw = 0.3 and krow = 0, and the only thing that changes is the saturation.

## SGOF closes at 1 minus connate water

The gas-oil table runs from zero gas to

$$S_{g,\max} = 1 - S_{wc} = 1 - 0.35 = 0.65$$

and that is where it stops. Not at 1.

The reason is that connate water never leaves. The 35 percent of pore space it occupies is unavailable to gas, so a gas saturation above 0.65 is not a state this rock can reach. A table running to Sg = 1 describes saturations that cannot exist, and worse, it puts the gas endpoint at the wrong place, because the endpoint mobility is reached at maximum gas saturation and the table has just moved where that is.

This is the axis closure lesson, and it is the one thing about saturation tables that catches almost everybody once. The published SPE1 problem gets it right and it is worth looking at, because SPE1's SGOF also stops short of 1 for the same reason.

## The Ekene endpoints

| table | first row | last row |
|---|---|---|
| SWOF | Sw = 0.35, krw = 0, krow = 0.9 | Sw = 1, krw = 0.3, krow = 0 |
| SGOF | Sg = 0, krg = 0, krog = 0.9 | Sg = 0.65, krg = 0.8, krog = 0 |

Both tables start with the invading phase immobile and the oil at its maximum, and both end with the oil immobile and the invading phase at its endpoint. That symmetry is what a well-formed pair looks like.

## What a simulator does at the edges

Outside a table's range, a simulator does not extrapolate the curve; it holds the end value. So a table that stops at Sg = 0.55 when the rock can reach 0.65 will hold the gas mobility at whatever the 0.55 row said, across a whole tenth of the saturation range. The run completes, the numbers look plausible, and the gas is systematically too immobile.

That is the shape of the error: silent, plausible, and directional.

## The check that catches it

Add the first saturation of SWOF to the last saturation of SGOF:

$$0.35 + 0.65 = 1$$

If the two tables were built from the same rock, connate water plus maximum gas must be one. When that sum is not one, one of the two tables has the wrong axis, and you have found it in five seconds without looking at a single mobility value.

## The misconception to avoid

"Both tables should run from 0 to 1, for symmetry." They are not symmetric, because water and gas are not in the same position. Water is the phase that was always there and never fully leaves; gas is a phase that arrives. The tables reflect that, and forcing them into the same range breaks the gas one.

## Exercise

First, apply the check above to the Ekene tables and confirm it gives exactly one. Then state what you would conclude if a deck gave 0.95.

Second, a colleague's SGOF runs to Sg = 1. Describe what the simulator will do in the range 0.65 to 1, and whether the run will report a problem.
