# Interpolated against the grid

The quickest way to read T50 off a table is to run down the column until it passes 50. The engine does something else, and the two readings print side by side.

{{panel:crude-valuation-explorer}}

## The grid reading

A curve stored as a table of points invites a shortcut. Scan down the volume percents, stop at the first one at or past 50, and take its temperature. That is a grid reading: the temperature of the first point of the blend's curve at or past 50 percent.

It looks finished. It is a real temperature from the real curve, it prints as a clean number, and nothing about it signals that anything was skipped. This tier's header names it as one of three traps: a grid reading of T50 gives a figure that looks finished.

## The engine's reading

temperatureAtVolumePercent does not stop at a grid point. It finds the two curve points either side of 50 percent and interpolates between them to the temperature at which the curve reaches exactly 50. That is the engine's T50.

## Side by side

The lab prints both readings for two blends.

| blend | T50 interpolated (the engine) F | first curve point at or past 50 percent F | grid reading minus the engine F |
| --- | --- | --- | --- |
| Kwale Light and Ughelli Medium, 55 and 45 | 587.3184 | 650 | 62.6816 |
| the studio's default pair, 60 and 40 (what the app opens on) | 617.1429 | 690 | 72.8571 |

The grid reading is a temperature from the crudes' measurement grid. In the Kwale blend, 650 F is Ughelli Medium's own 50 percent point, and the blend's curve reads 56.9474 percent there. The grid reading therefore reports the temperature at which the blend has passed 50 percent by whatever amount the grid happens to allow, and calls it the fifty percent point. The grid reading minus the engine is 62.6816 F for the Kwale blend and 72.8571 F for the default pair.

## Two blends, two gaps

The table prints the grid reading minus the engine for two blends: 62.6816 F for the Kwale blend and 72.8571 F for the default pair. It prints no rule that fixes the size of that gap in advance, and this course does not offer one. Each gap is read from its own row, for its own pair of curves.

The grid reading is defined by this course as "the first point of the blend's curve at or past 50 percent". The interpolated reading is temperatureAtVolumePercent(curve, 50), which uses the two curve points on either side of 50 percent and places the answer on the straight line between them. For the Kwale blend those points are 530 F at 43.6471 percent and 650 F at 56.9474 percent.

## What rides on T50

T50 is also an input. The Watson characterisation factor in lesson 4 takes the blend's T50 as its boiling point. The lab prints K both ways:

| blend | SG | Watson K at T50 interpolated | Watson K at the grid reading |
| --- | --- | --- | --- |
| Kwale blend | 0.8595 | 11.8135 | 12.0447 |
| the studio's default pair | 0.8727 | 11.7452 | 12.0043 |

So the grid reading does not stay a temperature problem. It passes straight into the one number the studio uses to characterise the blend.

## In the panel

The valuation explorer draws the engine's T50 on the blend's curve and marks the grid reading as the reading the engine does not use. Move the share slider and watch both move: the interpolated point slides smoothly along the curve, while the grid reading jumps from one measured temperature to the next.

## Exercise

For the Kwale blend, read the engine's T50, the grid reading, and the blend's volume percent at the grid temperature, 56.9474 percent at 650 F. Say what the grid reading actually reports about the blend, and then read the two Watson K figures for the same blend and say what they show about where the grid reading's effect ends.
