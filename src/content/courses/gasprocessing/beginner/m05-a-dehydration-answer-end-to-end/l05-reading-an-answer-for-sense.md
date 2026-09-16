# Reading an answer for sense

A dehydration answer can be arithmetically perfect and still be the wrong answer to the question you asked. Reading one for sense means checking it against something published, and then asking what the engine declined to tell you.

{{panel:fc-water-explorer}}

## Against the published cases

Three TEG cases are published with this module, and the engine is run against each.

| rate | inlet | outlet | gal/lb | water, lb/day | gpm | Btu/gal | MMBtu/hr | BTEX, lb/day |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 50.000000 | 60.000000 | 7.000000 | 3.000000 | 2650.0000 | 5.520833 | 1890.5333 | 0.626239 | 181.8261 |
| 120.000000 | 90.000000 | 4.000000 | 4.000000 | 10320.0000 | 28.666667 | 1789.7000 | 3.078284 | 1454.6084 |
| 65.000000 | 82.000000 | 3.000000 | 2.500000 | 5135.0000 | 8.914931 | 2204.0250 | 1.178924 | 457.5376 |

Engine over golden, on every field the published cases carry:

| case | water | gpm | Btu/gal | MMBtu/hr | BTEX |
| --- | --- | --- | --- | --- | --- |
| 1 | 1.000000000000 | 1.000000000000 | 1.000000000000 | 1.000000000000 | 0.999997865073 |
| 2 | 1.000000000000 | 1.000000000000 | 1.000000000000 | 1.000000000000 | 0.999997865073 |
| 3 | 1.000000000000 | 1.000000000000 | 1.000000000000 | 1.000000000000 | 0.999997865073 |

Look at the last column before the others. The mass balance columns sit at exactly one, because the check re-expresses them through kilograms and cubic metres and comes back to the same pounds. The BTEX column does not sit at one, and it is the only column in the table that is a mole balance. The Expert tier reads what that gap is and what it means for a published case.

## What the engine kept to itself

The outlet water content is a typed design input. The engine says so on every dehydration answer, in its own words: the dew point lean glycol can deliver is a chart this module does not carry.

That is the seam worth knowing. A lean glycol strength and a contactor determine what dew point can actually be reached, and that relationship is a chart. No chart is in this module. So the module takes your spec, reports the loop balance that follows from it, and declines to pretend it derived one from the other.

What it does report is the water balance round the loop. At OBIAFU's lean strength of 99.200000 weight percent, a gallon of lean solution already carries 0.074400000 lb of water before it meets the gas, and the rich glycol comes back at 95.975032510 weight percent.

## Why a published case is worth running at all

A check that restates the formula it is checking validates nothing. It will agree with the engine whatever the engine does, including when the engine is wrong. What makes the mass columns above worth having is that the check reaches the same pounds by a different route through different units, so an error in either one would show up as a ratio away from one.

That is the standard to hold every check to. Ask what the check would do if the answer were wrong, and if the honest response is that it would agree anyway, the check is decoration.

## A short checklist

Is the water content consistent with the pressure and temperature. Is the load the content less the spec. Does the circulation carry the rate. Is the Btu a gallon unchanged when only the rate changed. Is the circulation ratio inside the customary band, and if not, is the rich strength still above what the module accepts as lean. Was the spec typed or derived, and by whom.

## Exercise

Record the engine over golden ratio for the mass fields and for BTEX. Say what the mass fields at exactly one establish. Then quote what the engine reports as the basis of the outlet spec, and say what would be needed to derive that spec instead.
