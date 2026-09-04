# Steel mass per foot

`pipeMassLbPerFt` takes an inside diameter, a larger outside diameter and a density, and returns lbm per foot. It is an annulus area and one multiplication, and it knows nothing else about the pipe.

{{panel:pd-thermal-explorer}}

## The published wall

The published pipe is 6.065 in bore with steel out to 6.625 in. That annulus has a cross sectional area of (pi/4)(Do2 - Di2) = 0.0387593994 ft2, and at 490.0 lbm/ft3 it comes back as 18.9921056882 lbm/ft.

The density is an input, not a lookup. The engine does ship one constant for it, `STEEL_DENSITY_LB_FT3` at 490.0 lbm/ft3, which is the value the published cooldown case supplies, but the helper never reaches for it on its own.

## It is not a steel helper

Nothing in the arithmetic mentions steel. Two diameters and a density describe any cylindrical shell, so the same call returns the mass of a foam layer, a weight coat or a liner if it is handed those diameters and that density. The name says steel because that is what the shell slot in a cooldown usually holds.

Teaching line AKASO SPUR shows the same call on a heavier wall. It is a 9.562 in bore with steel to 10.750 in, a wall of 0.5940 in, and at 490.0 lbm/ft3 that annulus is 64.4900327983 lbm/ft. AKASO SPUR is a TEACHING LINE invented for this course, not a published case and not a real line.

## What it refuses, and how quietly

Hand it an outside diameter no larger than the inside and there is no mass to compute, so it returns a NaN. That is the right answer to an impossible annulus.

It is also the whole of the refusal. There is no `ok: false`, no message and no note, because the return is a bare number rather than an object. A caller who does not test the value carries the NaN forward, and what happens to it downstream is decided by whatever receives it.

## The mistake

Taking the wall thickness from a nominal size. A 6.625 in outside diameter is a real dimension, and the 6.065 in bore that goes with it is a schedule, not a nominal label. Enter a nominal outside diameter against a measured bore, or the reverse, and the annulus is wrong by the difference, the mass is wrong in proportion, and the number that comes back is a perfectly well formed answer to ten places.

## What a mass per foot is not

It is not a weight. It carries no length, so nothing here knows how long the line is, and it is not the figure a lay barge works to, which includes coating, buoyancy and contents. It is one geometric quantity per foot of pipe, and it exists so that a heat capacity can be built on top of it.

## Exercise

In the panel, take the published 6.065 in by 6.625 in wall at 490.0 lbm/ft3 and record the mass per foot and the annulus area.

Then say what the same call returns if the two diameters are entered the wrong way round, and how you would find out that it had happened.
