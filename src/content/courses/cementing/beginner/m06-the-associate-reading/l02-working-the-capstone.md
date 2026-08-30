# Working the capstone

Six volumes for the casing string this course's well was drilled through.

{{panel:cm-volume-explorer}}

## What you are given

The SAME slant well trajectory the lessons use, and a completely different casing job on it: the 9-5/8 inch INTERMEDIATE string, one hole section up from the 7 inch production string the lessons cement.

**The casing.** 9-5/8 inch 47 lb/ft, outside diameter 0.244475 m, inside diameter 0.2204974 m. Shoe at 1400 m of measured depth, float collar at 1352.

**The hole.** Cased from surface to 350 m behind 13-3/8 inch 68 lb/ft casing, bore 0.315341 m. Open hole from 350 to 1400 m at 12-1/4 inch, bore 0.31115 m.

**The programme.** Top of cement at 250 m, open hole excess 30 percent, spacer 6 cubic metres, lead and tail split at 350 m, slurry yield 0.0402 cubic metres a sack, pump rate 0.028 cubic metres a second.

Not one of those numbers is a lesson number. The trajectory is, because it is the module's own well.

## The six

1. The **annular slurry** volume, in cubic metres.
2. The **shoe track** volume.
3. The **total slurry** volume.
4. The **displacement** volume.
5. The **sacks**.
6. The **effective bore of the open hole** after the excess, in metres.

## The order to do them in

Field 6 first, because everything below the previous shoe depends on it. Inflate the open hole capacity by 30 percent, then back-solve the bore from the inflated capacity. Do not inflate the diameter.

Then the two capacities, cased and open hole. Then fields 1, 2 and 4, which are three sums over those capacities. Then 3 and 5.

## The traps

**The casing is 9-5/8 inch, not 7.** Every capacity in the lessons is wrong for this job. Both of them: the annulus AND the inside.

**Field 4 is measured to the float collar at 1352 m, not to the shoe at 1400.** The 48 m between them is field 2, and adding it to field 4 is the classic error.

**The excess is 30 percent, not 15.** And it applies to the open hole row only, so the 250 to 350 m section inside the 13-3/8 inch casing is untouched by it.

**The bore around the casing changes at 350 m,** so field 1 spans two capacities: 100 m of cased annulus and 1050 m of open hole.

**Field 6 is a DIAMETER in metres,** somewhere around a third of a metre. If your answer is an area, you stopped one step early.

## Free checks

Field 1 plus field 2 is field 3, exactly. If it is not, one of the three was computed on the wrong capacity.

Field 5 times 0.0402 is field 3. That is the yield definition and it catches a slurry volume error.

Field 6 must be LARGER than 0.31115 and smaller than the 13-3/8 inch bore of 0.315341. If it is outside that range, the excess was applied to the diameter rather than to the area.

Field 4 divided by the inside capacity must be exactly 1352. That is the fastest way to check both at once.

## The size check

This job is a bigger casing in a bigger hole over a shorter interval than the lessons'. So expect a LARGER annular slurry than the lessons' 24.35 despite the shorter interval, because 12-1/4 inch hole around 9-5/8 inch casing at 30 percent excess is a much bigger annulus than 8-1/2 around 7 at 15.

## Exercise

Do the six in the panel. Then re-run the job at 15 percent excess instead of 30 and write down how much each of the six moved.

Three of them will not have moved at all. Say which three, and why.
