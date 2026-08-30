# Working the capstone

Six numbers at a fracture gradient the lessons did not use.

{{panel:wc-tolerance-explorer}}

## What is asked

1. The MAASP on the SLANT well.
2. Its kick tolerance.
3. Its shoe headroom.
4. Its tolerance in the circulated case, the influx at the shoe.
5. The MAASP on the HORIZONTAL well.
6. The kill mud density for the capstone's kick on the horizontal well.

## The settings

**Fields 1 to 5** use a fracture equivalent mud weight of **1820 kg/m3** and a kick intensity of **45 kg/m3**. Neither is the 1750 and 60 the lessons run on, and the change is deliberate: every graded number is one you have to produce.

**The mud is 1440 kg/m3** and the influx density for the tolerance calculation is the engine's default of 240 kg/m3.

**Field 6** is a kill sheet field rather than a tolerance one, and it uses the SAME kick as the Professional capstone: a shut-in drill pipe pressure of 1400000 Pa, on the HORIZONTAL well this time.

## The order

Field 1 first: it is one subtraction and it needs no tolerance run.

Fields 2, 3 and 4 from one tolerance run on the slant well. Field 3 is an intermediate quantity of the same run and it checks the other two.

Field 5 is a second subtraction, on the other well's shoe TVD.

Field 6 is a different calculation entirely and it needs the horizontal well's TVD at the bit.

## The traps

**The fracture gradient is 1820, not 1750.** Every one of fields 1 to 5 moves, and the lessons' values are all plausible-looking wrong answers.

**The kick intensity is 45, not 60.** It affects fields 2, 3 and 4 and not fields 1 and 5, because MAASP does not depend on the formation pressure at all.

**Field 2 is the TOLERANCE, which is the smaller of the two cases. Field 4 is the CIRCULATED case specifically.** On the slant well the circulated case is the larger of the two, so field 4 is bigger than field 2. If yours are the other way round, you have swapped them.

**Field 6 is on the HORIZONTAL well**, and the Professional capstone's field of the same name was on the slant one. Same kick, different well, different answer.

**Field 3 is a pressure in pascals**, not a volume.

## What to notice while you work

Field 1 is larger than the lessons' 1750 value, because a higher fracture gradient gives more headroom. Field 5 likewise.

Field 2 is larger than the lessons' value for the same well, for two reasons at once: more fracture gradient and less kick intensity.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives.

## Exercise

Compute fields 1 and 5 by hand from the two shoe true vertical depths, the mud weight and 1820.

Then predict whether field 2 will still be bound by the shut-in case at the new settings, and check.
