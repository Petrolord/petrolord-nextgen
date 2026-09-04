# One history, many windows

`lateFraction` decides which part of the plot the diagnosis is read on. It has a default, and the module says nothing else about it anywhere.

{{panel:pd-candidate-explorer}}

## The dial

`chanDiagnosis` takes `lateFraction` with a default of 0.5. There is no guidance about how to pick it, no sweep helper, and no field in the return object that names its effect. The user who touches nothing gets 0.5, which is also the window the oracle reads its four published histories on, opening at t = 186.345364 days on each.

Teaching well ELELENWO-4 holds 38 samples from t = 15.000000 to 3600.000000 days. It is a teaching case, not a published one. Every row of the derived sweep is those same 38 samples with not one datum changed.

## The sweep

| lateFraction | Window starts, days | Late samples | Derivative slope | Mechanism |
| --- | --- | --- | --- | --- |
| 0.20 | 1276.416078 | 8 | 1.600276347 | indeterminate |
| 0.30 | 705.784525 | 12 | 1.544046342 | channelling |
| 0.40 | 390.258164 | 16 | 1.485563987 | channelling |
| 0.50 | 250.242976 | 19 | 1.442132492 | channelling |
| 0.60 | 138.369943 | 23 | 1.387035000 | channelling |
| 0.70 | 76.510604 | 27 | 1.336892539 | channelling |
| 0.80 | 42.305954 | 31 | 1.292632524 | displacement |
| 0.90 | 23.392754 | 35 | 1.254360095 | displacement |
| 1.00 | 15.000000 | 38 | 1.229355999 | displacement |

Every slope is fitted only on the late samples whose derivative is positive, which is 4 fewer than the late count on every row. Across the whole range of the dial the derivative slope moves by 0.370920348, from 1.229355999 to 1.600276347.

The coarse row at 0.20 stays in. Its window holds 8 samples, of which 4 are positive, and the reading comes back indeterminate with no span reported at all even though a slope of 1.600276347 was computed at an r-squared of 0.999944740.

## Why the slope falls as the window widens

A wide window reaches back into early life, where the ratio is small and climbing gently, and those samples pull the fitted line flatter. A narrow window sees only the steep late climb. Nothing about the well changed across the sweep: the analyst chose a different stretch of the same plot.

## The mistake

Reporting a derivative slope without the window it was taken over. On this history the same series supports 1.229355999 and 1.600276347, and both are correct readings of the window each was measured on.

## What it refuses

The return object carries `lateFromT` in days, so the window start is recoverable. It does not carry the fraction that produced it and does not warn when a small change of fraction would change the mechanism.

## Exercise

Run ELELENWO-4 at `lateFraction` 0.30, 0.60 and 1.00 and record the derivative slope and mechanism at each.

Then say which single number a reader would need alongside a slope of 1.387035000 to know what it describes.
