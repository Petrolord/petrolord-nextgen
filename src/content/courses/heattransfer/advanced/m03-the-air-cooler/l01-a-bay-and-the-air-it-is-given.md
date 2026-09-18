# A bay, and the air it is given

An air cooler has no cooling water. It has ambient air, a fan and a bundle, and the ambient temperature is the thing the design is hostage to. Everything else on the sheet follows from the duty, the two process temperatures and the rise the air is allowed to take.

{{panel:fc-rating-explorer}}

## Two bays, at their design points

| quantity | the studio bay | ANTAN |
| --- | --- | --- |
| duty, Btu an hour | 20000000.0000 | 15500000.0000 |
| process in, degF | 250.000000 | 235.000000 |
| process out, degF | 150.000000 | 158.000000 |
| design ambient, degF | 95.000000 | 98.000000 |
| air rise, degF | 30.000000 | 26.000000 |
| air outlet, degF | 125.000000 | 124.000000 |
| log mean, degF | 85.263896 | 82.901805 |
| coefficient on the bare surface | 4.500000 | 5.100000 |
| bare surface, ft2 | 52125.749338 | 36660.428319 |
| air, lb an hour | 2777777.7778 | 2483974.3590 |

The second column is ANTAN, a bay this course carries beside the studio one so that no statement rests on a single machine. The coefficient in both is given on the bare tube surface and the surface reported is a bare surface. That pairing has to be stated every time, because a coefficient quoted without the area it is referred to is not a number anyone can use. Elsewhere in this module the overall coefficient is referred to the outside tube surface and the engine says so on every answer.

## The air outlet, and the air mass behind it

The air outlet is the ambient plus the rise, which the two columns show directly. The air mass follows from the duty and the rise through a heat capacity this module declares rather than derives.

That constant can be measured out of the engine's own answer instead of being read off its source. On the studio bay, 2777777.7778 lb an hour carrying 20000000.0000 Btu an hour across 30.000000 degF implies a heat capacity of 0.240000 Btu per lb per degF, taking the duty over the air mass and the rise. Measuring a constant is worth more than quoting one, because the measurement tests the path the constant travels on.

## Why the rise is a choice

Nothing computes the air rise. It is an input, and it trades fan power against surface: a larger rise needs less air and more bundle, a smaller rise the reverse. The two bays above sit at 30.000000 and 26.000000 degF, and neither figure is derived from anything. A sheet that does not say which rise it assumed has not said what machine it describes.

The same is true of the coefficient. This module never computes an air-side coefficient from fin geometry, and it says so. The 4.500000 and 5.100000 above are given to it. So the bare surface it reports is the arithmetic of a duty, a coefficient, a driving force and nothing else, and every error in any of those three arrives in the surface unchanged.

## What a design point is and is not

A design point is one afternoon. It is the ambient the surface was chosen against, and the whole of the next module is what the same machine does when the afternoon is hotter. Read the two columns above as a pair of claims about metal rather than as a pair of performances: the surface and the air mass are what the plant owns afterwards, and the duty and the outlet are what those two deliver on the day.

## Exercise

Record the ten rows above for both bays. Show how the air outlet follows from the ambient and the rise in each column. Then reproduce the heat capacity measurement on the studio bay from the duty, the air mass and the rise, and say why measuring that constant is stronger than quoting it.
