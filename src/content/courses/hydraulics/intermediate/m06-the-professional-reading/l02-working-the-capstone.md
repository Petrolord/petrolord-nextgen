# Working the capstone

Six numbers on two wells, with the new mud.

{{panel:hy-cleaning-explorer}}

## What is asked

1. The equivalent circulating density at total depth on the SLANT well.
2. The worst annular velocity on that same run.
3. The equivalent circulating density at total depth on the HORIZONTAL well.
4. The worst transport ratio on the horizontal well.
5. The worst cuttings concentration on the horizontal well, as a percentage.
6. The flow rate that reaches a transport ratio of 0.80 on the horizontal well.

## The settings

**The same new mud as the Associate capstone**: dial readings 52, 33, 6 and 5, at a density of 1320 kg/m3. Not either of the muds the lessons run on.

**The flow rate is 0.030 m3/s** for fields 1 through 5, which is also not one the lessons run.

**Field 6 solves FOR a flow rate** and therefore does not use 0.030 at all.

**Everything else** is the fixture's own: the same two wells, the same string, the same hole geometry, cuttings at 2600 kg/m3 and 6 mm, and a rate of penetration of 0.005 m/s.

## The order

Fields 1 and 2 first, from one hydraulics run on the slant well.

Field 3 next, from one hydraulics run on the horizontal well. Compare it against field 1 and notice which is larger and why.

Fields 4 and 5 from one hole cleaning run on the horizontal well.

Field 6 last, because it is a solve rather than a run.

## The traps

**Field 2 does not depend on the mud at all.** Annular velocity is flow rate over area. It is the same number for either mud and for either well, because the annulus geometry is shared. That is a check rather than a trap: if it moves when you change the mud, something is wrong.

**Field 3 will be LARGER than field 1** even though the horizontal well is shallower in measured depth, because the equivalent circulating density divides by TRUE VERTICAL depth.

**Field 5 is a percentage**, so it is a number below one on these settings, not a fraction below 0.01.

**Field 6 is a target of 0.80**, not 0.5 or 0.9. The lessons quote 0.5, 0.9 and 0.95, and none of them is the answer.

**Fields 4 and 5 are on the HORIZONTAL well.** The slant well would give exactly the same transport ratio, because the model has no inclination term, so getting the well wrong here would not be detected by the answer looking implausible.

## What to notice while you work

Field 4 will be identical to the slant well's value. That is the limitation module 3 established, seen one more time in a graded field.

The new mud is thinner than kcl_polymer, so field 4 should be below what the lessons printed for the heavy mud and above what they printed for the light one.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives.

## Exercise

Before running anything, predict whether the new mud's transport ratio will be closer to the heavy mud's or the light mud's, using the dial readings alone.

Then check, and say which of the two rheology parameters your prediction was actually based on.
