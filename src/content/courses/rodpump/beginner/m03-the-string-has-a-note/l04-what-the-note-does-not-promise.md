# What the note does not promise

The fundamental is found by scanning for a sign change, and a scan's guarantee is worth exactly its spacing.

{{panel:pd-string-explorer}}

## What the scan means to do

Take 400 evenly spaced steps from a twentieth of the base note up to four times it, evaluate an end force at each of the 401 points, and bisect the first interval where the sign flips. On the published taper that range runs from 2.443302 to 195.464155 spm, an intended spacing of 0.482552133 spm.

## What the grid actually does

The increment is added to the running position rather than to the lower bound, so the spacing grows by one increment every step. The first twelve intervals, contiguous from the start, are 0.482552, 0.965104, 1.447656, 1.930209, 2.412761, 2.895313, 3.377865, 3.860417, 4.342969, 4.825521, 5.308073 and 5.790626 spm, each a whole multiple of the intended one.

Of those 401 points, 28 land inside the intended range. The widest interval inside it is 13.028907601 spm, from 171.819101 to 184.848008 spm, which is 27.000000 times the intended spacing. The last point evaluated is 3.870312e+4 spm, 1.9801e+2 times the top of that range. ODUMA-4 gives the same picture, 28 of 401 inside and a widest interval of 13.572382588 spm.

## The answer is right

The fundamental of the published taper, 53.362124006 spm, falls in an interval 7.238282000 spm wide, from 53.111276 to 60.349558 spm. One root inside an interval still flips the sign at its ends, so the bisection that follows lands on it exactly. A dense mode scan on a two million point grid returns 53.362124006 spm and so does the engine, and ODUMA-4 agrees on both routes as well.

What the coarse grid costs is the guarantee, not the answer.

## What the guarantee was for

Two roots inside one interval leave the sign unchanged at both ends. The scan walks past both, returns a higher mode as the fundamental, and sets no unresolved flag: on the published taper that flag reads false, which is what a clean answer looks like too.

Nothing like that happens here. The second mode stands 90.364754474 spm above the first on the published taper and 93.437045323 spm above it on ODUMA-4, and no interval in either grid approaches those widths. The comparison to make is the worst spacing against the smallest gap between roots, 13.028907601 spm against 90.364754474 spm.

Since a design is refused at or above the fundamental, a wrong one would be a wrong refusal or a wrong permission, and it would be quiet. One character changes it: add the increment to the lower bound.

## Exercise

Write the intended spacing and the widest interval inside the range for the published taper, and say how many of the scan's points land inside that range.

Then state the comparison that decides whether the scan can be trusted on a string, with both numbers for the published taper.
