# Working the capstone

Six numbers from buckling, capacity and wear.

{{panel:td-buckling-explorer}}

## What is asked

1. The drill pipe's sinusoidal buckling limit at 90 degrees in the open hole.
2. The same pipe's helical buckling limit at the same conditions.
3. The maximum torsion utilization on the horizontal well rotating on bottom.
4. The total sliding distance for a two-entry rotating schedule.
5. The worst casing wear depth from that schedule.
6. The worst wall loss percentage from the same run.

## The settings

**The mud is 1500 kg/m3 throughout, not the 1440 the lessons run on.** The same change applies at every tier of this capstone. It moves the buoyed weight, so it moves the buckling limits, the side forces, the torque and the wear.

**Fields 1 and 2** use the horizontal well's drill pipe, the third string component: 0.127 m outside diameter, 0.1086104 m inside, 33.126528414 kg/m. The hole is the OPEN hole at 0.2159 m and the inclination is 90 degrees.

**Field 3** is the horizontal well rotating on bottom at the book friction factors, taken as the maximum over the whole profile.

**Fields 4, 5 and 6** run the casing wear calculation on the horizontal well's rotate-on-bottom side forces at that same 1500 kg/m3 mud, against 1200 m of casing with an inner diameter of 0.2204974 m and a wall of 0.0119888 m, tool joint radius 0.0841375 m, wear factor 2 mm3/kN.m, 30 m intervals, and a schedule of **30 hours at 150 rpm followed by 20 hours at 90 rpm**.

That schedule is NOT the one the lessons run on either. The lessons use a single entry of 50 hours at 120 rpm, and the two are deliberately different.

## The order

Fields 1 and 2 first. They need no torque and drag run at all: four inputs, one formula, and the second is the first times a constant. Getting them right confirms you have the pipe properties and the clearance right.

Field 3 next, one run.

Fields 4, 5 and 6 last, from a single wear run on the new schedule. Field 4 needs no side forces at all, so compute it first as a check that the schedule was entered correctly.

## The traps

**The clearance is against the OPEN hole.** 0.2159 m, not the 0.2204974 m casing. They differ by less than 5 mm and the limits differ by about 2.5 percent, which is far outside the tolerance.

**The buoyed weight uses the mud, not air.** The buoyancy factor here is the one at 1500 kg/m3, which is the Associate capstone's first field, and it belongs in the buckling formula.

**Field 2 is not field 1 doubled.** The constant is 2 root 2 less 1, not 2.

**Field 3 is torsion, not tension.** The tension utilization on the same run is a smaller number and both are plausible-looking fractions.

**The schedule has two entries.** A single 50 hour entry at any rpm gives a different sliding distance and different wear.

**Field 5 is in millimetres.** The engine works in metres.

## What to notice while you work

Fields 1 and 2 differ by a constant that has nothing to do with this pipe or this hole. Verify that before moving on.

Field 4's schedule has the same total hours as the teaching case but a different total sliding distance, because only the PRODUCT of rpm and hours matters and this schedule's product is different. It is also the one field the mud weight does not touch.

Field 6 is field 5 divided by the nominal wall, as a percentage. If those two do not agree, one of them is wrong.

## The precision

Full precision, tight tolerances, for the reason every capstone in this series gives: the grader is checking the calculation was run rather than estimated.

## Exercise

Compute fields 1 and 2 by hand from the four ingredients before opening the panel.

Then compute field 4 by hand from the two schedule entries, and use the agreement of both hand calculations to confirm your inputs before running anything.
