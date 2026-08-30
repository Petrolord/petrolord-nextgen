# Working the capstone

Six numbers from moving the string.

{{panel:hy-surge-explorer}}

## What is asked

1. The surge pressure on the SLANT well with a CLOSED string.
2. The surge equivalent mud weight from that same run.
3. The SWAB equivalent mud weight on the same well with an OPEN string.
4. The ratio of the closed pressure to the open pressure.
5. The surge equivalent mud weight on the HORIZONTAL well with a closed string.
6. The maximum trip speed the stated window allows on the slant well with a closed string.

## The settings

**The same new mud as the other two tiers**: dial readings 52, 33, 6 and 5, at a density of 1320 kg/m3. Not either of the muds the lessons run on.

**The trip speed is 0.75 m/s** for fields 1 through 5. That is not one of the three the lessons run.

**Field 6 solves FOR a speed**, so it does not use 0.75. Its window is a fracture equivalent mud weight of 1400 kg/m3 and a pore equivalent mud weight of 1260 kg/m3, both stated.

**Everything else** is the fixture's own: the same wells, the same string, the same hole geometry, and a clinging constant of 0.45.

## The order

Fields 1 and 2 from one closed-string run on the slant well. Field 2 should be the mud weight plus field 1 divided by g times the true vertical depth, which is a free check on both.

Field 3 needs a second run, OPEN, on the same well. Note that it is the SWAB, which is below the mud weight.

Field 4 needs the open run's pressure, which you have from field 3's run, divided into field 1.

Field 5 is a third run, on the other well.

Field 6 is a solve.

## The traps

**Field 3 is swab and open**, two changes from field 2 at once. Getting either wrong gives a plausible number.

**Field 4 is closed over open, not open over closed.** It is greater than one.

**Field 5 will be much larger than field 2** even though the horizontal well is shallower in measured depth, because the equivalent mud weight divides by TRUE VERTICAL depth.

**Field 6's window is narrow.** With a mud weight of 1320, the fracture limit at 1400 gives 80 kg/m3 of room above and the pore limit at 1260 gives 60 below. The SWAB side is tighter, so it is the swab that binds.

**Field 6 is the closed string.** The open string would allow a faster trip.

## What to notice while you work

Fields 2 and 3 are on opposite sides of 1320, and the amount each is away from it is not the same, because one is a closed string and one is open.

Field 6's answer is above 1 m/s, which is a fast trip. That is what a comfortable window looks like, and the lesson is that this window is not as narrow as it appears.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives.

## Exercise

Before running anything, use the symmetry of surge and swab to predict field 3 from field 2 and the open-to-closed ratio.

Then check, and say why the prediction is not exact.
