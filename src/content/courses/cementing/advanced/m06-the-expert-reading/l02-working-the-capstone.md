# Working the capstone

Six centralization numbers for the intermediate string.

{{panel:cm-standoff-explorer}}

## What you are given

The Associate and Professional capstones' job, centralized. The 9-5/8 inch string on the slant well: shoe at 1400 m, cased to 350 m behind 13-3/8 inch at 0.315341 m, open hole 350 to 1400 m at 12-1/4 inch, 0.31115 m.

**The casing.** Outside diameter 0.244475 m, inside 0.2204974, weight 69.9437033 kg per metre. Heavier and larger than the lessons' 7 inch at 43.16.

**The centralizer.** Bow spring, spacing 10.5 m, restoring force 11000 N, quoted at the standard 0.67. None of those three is a lesson number.

**The mud.** 1300 kg/m3, not the lessons' 1440.

**And a rigid alternative.** A 0.29 m blade, to be evaluated on the same string.

## The six

1. The **minimum standoff** with the bow springs.
2. The **standoff at the centralizer** at the interval where that minimum occurs.
3. The **required spacing** to reach the API target, in metres.
4. The **buoyed weight per metre** at the capstone mud density, in newtons per metre.
5. The **minimum standoff with the rigid 0.29 m blade** at the same spacing.
6. The **spring rate** of the 11000 N bow spring in the open hole, in newtons per metre.

## The order to do them in

Field 4 first. Everything with a load in it needs it.

Then field 6, which needs the open hole clearance. Careful: the clearance for the SPRING RATE is the nominal one, because standoffProfile runs the annulus at zero excess. The 30 percent excess in the volume sheet does not appear here at all.

Then fields 1 and 2 together, from one profile run. Then 3, by bisection. Then 5, from the blade ratio less the sag.

## The traps

**The casing is 9-5/8 inch.** Its clearance, its weight and its bending stiffness are all different from the lessons'. The stiffness in particular is much larger, which reduces the sag.

**The excess does not apply.** Thirty percent of excess appears in the Associate and Professional capstones and NOWHERE in this one. If your clearance came out at 0.042 rather than 0.033, you used the wrong bore.

**The mud is 1300, not 1440.** Lighter mud, less buoyancy, HEAVIER casing in the hole, more load. The standoff is slightly worse than the same job at 1440 would give.

**Field 5 is not the blade ratio.** The blade ratio is the standoff at the centralizer for a rigid device; the reported minimum subtracts the sag from it, exactly as it does for a bow spring.

**Field 6 has the clearance in the denominator,** so it is a large number, of the order of a million newtons per metre.

## Free checks

Field 1 must be at or below field 2, because the reported standoff is the smaller of the two terms and the sag is never negative. If field 1 exceeds field 2, one of them is from the wrong interval.

Field 3 must be LARGER than 10.5, because the job passes the target at 10.5. If your bisection returns something below the spacing being run, the profile disagrees with the verdict.

Field 4 must be smaller than the casing's air weight of 69.9437033 times 9.80665, and larger than about 85 percent of it.

Field 6 times 0.33 times the open hole clearance must give back 11000 N exactly.

## The qualitative question

Field 1 passes the API target and field 5 does not. Say why, in one sentence, and say what you would have to change about the rigid centralizer to make it pass.

## Exercise

Do the six in the panel. Then re-run field 1 at a mud density of 1440 rather than 1300 and say which way it moved and by how much.
