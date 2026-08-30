# Working the capstone

Six safety factors on a string this course has not run, in a mud it has not used.

{{panel:ct-loadcase-explorer}}

## What is different

Everything about the string and its environment.

**The string.** Two sections of 9-5/8 inch, break at 1200 m of true vertical depth, shoe at 2200. On top, 53.5 lb/ft at T-95 on a buttress connection. Below, 47 lb/ft at C-90 on a SHORT THREAD connection. Neither grade is one the lessons ran.

**The mud.** 1620 kg/m3, not 1440.

**The test pressure.** 28000000 Pa, not 35000000.

**The gas gradient.** 1900 Pa per metre, not 2300.

**The shoe fracture equivalent mud weight.** 1950 kg/m3, not 1800.

**The seawater backup.** 1025 kg/m3, not 1030.

**The evacuation fraction.** 0.7, not 0.4.

**The cement.** 1870 kg/m3, not 1900.

**The overpull.** 620000 N, not 445000.

**The dogleg.** 3.5 degrees per 30 m, not 2.

Design factors are unchanged: 1.1, 1.0, 1.6, 1.25.

## The six

1. **Gas kick, section 1, burst safety factor.**
2. **Pressure test, section 2, burst safety factor.**
3. **Full evacuation, section 2, collapse safety factor.**
4. **Partial evacuation, section 2, collapse safety factor.**
5. **Running, section 2, tension safety factor.**
6. **Pressure test, section 2, triaxial safety factor.**

## The traps

**The grid has changed.** The shoe is 2200 m over 50 intervals, so the spacing is 44 m exactly. The section break at 1200 m is not a grid point: the last point in section 1 is 1188 m and the first in section 2 is 1232.

**The evacuation level has moved above the break.** At a fraction of 0.7 the level sits at 660 m, which is INSIDE section 1. So the identity between full and partial evacuation on the top section, which held on the published run, does NOT hold here. Field 4 is a genuinely different calculation from field 3 on both sections, and if you assume otherwise you will get the wrong section right.

**Field 5 is on section 2, not section 1.** The overpull hurts the lower section proportionally more, and 620000 N is 39 percent more overpull than the lessons used on a shorter, lighter string.

**Field 6 is triaxial at a dogleg of 3.5.** The bending stress scales linearly with the dogleg, so it is 75 percent larger than the lessons' term on a pipe with the same outside diameter.

**The connection on section 2 is short thread.** That is 0.75, and it affects field 5 directly.

## Free checks

Field 1 should govern at exactly 0 m of true vertical depth, because the gas gradient of 1900 is still far below the seawater gradient. If your answer came from anywhere else, you have the sign of the slope wrong.

Field 2 should govern at exactly 2200 m, for the same reason in reverse.

Field 3 should be the SMALLEST of your six by a wide margin. This string has a problem, and one of the six numbers should tell you where.

Fields 3 and 4 should differ substantially, and field 4 should be the larger.

## One more thing to notice

Exactly one of the fourteen section evaluations on this string is not a PASS. Find it before you submit. If you cannot say which case and which section without checking, you have computed six numbers rather than checked a string.

## Exercise

Run all seven cases on the capstone string in the panel and write down the fourteen verdicts.

Then say, in one sentence, what you would change about the string, and which of your six numbers would move as a result.
