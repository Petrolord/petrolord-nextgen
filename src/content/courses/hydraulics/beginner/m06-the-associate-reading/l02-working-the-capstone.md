# Working the capstone

Six numbers on a mud you have not seen.

{{panel:hy-rheology-explorer}}

## What is asked

1. The power-law flow behaviour index n.
2. The Herschel-Bulkley yield stress in pascals.
3. The pipe pressure loss.
4. The annulus pressure loss.
5. The bit pressure drop.
6. The pump pressure.

## The settings

**The mud is new.** Dial readings of 52 at 600 rpm, 33 at 300, 6 at 6 rpm and 5 at 3 rpm, at a density of 1320 kg/m3.

That is NOT either of the two muds the lessons run on, and the change is deliberate: every graded number here is one you have to produce rather than one a lesson printed. The same new mud is used at all three tiers.

**The well is the SLANT one**, the 40 degree well to 3000 m, with its own survey, the shared string and the shared bit at 0.000461814 m2 of total flow area.

**The flow rate is 0.030 m3/s**, which is also not one of the three the lessons run.

**Everything else** is the fixture's own: the same hole geometry, the same discharge coefficient of 0.95, and no surface loss.

## The order

Fields 1 and 2 first, from the dial readings alone. They need no well at all, and getting them right confirms the rheology before anything downstream depends on it.

Then fields 3, 4 and 5 from one hydraulics run.

Field 6 last, and check it against the sum of the other three. If they do not add, one of them is wrong.

## The traps

**Field 1 is the POWER LAW n, not the Herschel-Bulkley n.** They are different numbers on the same mud, and the Herschel-Bulkley one is larger.

**Field 2 is the Herschel-Bulkley YIELD STRESS, not the Bingham yield point.** The Bingham value is more than twice it, and both are in pascals, so the units do not distinguish them.

**The pressure losses are in pascals.** They are megapascal-scale numbers and quoting them in MPa is a factor of a million.

**Use the Herschel-Bulkley fit for the pressure calculation**, which is what the engine does. Using the power-law fit gives a different and lower annulus loss.

**The mud density is 1320, not 1440 or 1200.** It enters every one of the four pressure terms.

## What to notice while you work

Field 6 is the sum of 3, 4 and 5 exactly, because the surface loss is zero. That is a free check on all four.

The new mud is thinner than kcl_polymer and lighter, so every pressure should come out below the corresponding number the lessons printed for that mud at a comparable rate. Confirm that before submitting.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives: the grader is checking the calculation was run rather than estimated.

## Exercise

Compute fields 1 and 2 by hand from the four dial readings and the two conversion constants.

Then predict, before running anything, whether the new mud's pump pressure at 0.030 m3/s will be above or below kcl_polymer's at 0.035, and say why.
