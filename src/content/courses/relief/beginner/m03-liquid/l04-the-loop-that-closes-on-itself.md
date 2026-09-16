# The loop that closes on itself

{{panel:fc-sizing-explorer}}

An iterative answer is a different kind of object from a closed form one. A closed form is right or it is wrong. An iterative answer is right, or wrong, or unfinished, and the third state is the one that gets shipped by accident. This engine reports which of the three you have.

## What the report says

Every liquid call comes back with three fields about the loop beside the area itself: the number of passes, whether it converged, and the residual it stopped on. Reading the area without reading those three is how an unfinished answer gets treated as a finished one.

## How hard the loop works

The pass count across the viscosity sweep is the engine's own report.

| viscosity cp (stated) | Kv | iterations |
| --- | --- | --- |
| 0.000000 | 1.000000 | 0 |
| 1.000000 | 1.000000 | 1 |
| 5.000000 | 1.000000 | 1 |
| 20.000000 | 0.995950 | 5 |
| 85.000000 | 0.984776 | 6 |
| 300.000000 | 0.965548 | 7 |
| 1200.000000 | 0.921543 | 8 |
| 5000.000000 | 0.801154 | 12 |

Zero passes with no viscosity, because the loop never runs. One pass at the two lowest viscosities, because the correction comes back at exactly one and the loop sees nothing left to move. After that the count climbs steadily as the liquid thickens.

That is a useful diagnostic to carry into a plant. A liquid relief case that takes a dozen passes to settle is a case where the correction is doing real work, and it is a case where a hand calculation done in one pass is furthest from the converged answer.

## What the residual actually measures

The residual is the amount the correction moved on the final pass. It is not an error bar on the area, and it is not a distance from any true answer. It says only that the loop has stopped moving to within that much, which is a statement about the loop rather than about the valve.

On AKASO the residual is 0.000000000000 at the precision this course prints residuals at, and the call is reported as converged. The digest behind this course asserts that flag against what each call actually did, so a row calling itself converged came from a loop the engine reported as converged.

## The edge where the method stops claiming anything

The engine carries a second warning on this route, and it is about the certified test envelope rather than about convergence. Below a correction of 0.500000000000 it attaches a notice that the service is far off the envelope the valve was certified on, and suggests a different device.

None of the rows in the sweep above reaches that edge. The lowest correction printed there is 0.801154, and the published liquid cases do not reach it either. The edge was found by walking the engine's behaviour until the warning appeared, which is how every threshold in this course was located.

That warning is not a refusal, and it does not change the area by a single digit. The engine hands back a number and tells you the number is outside the range the correction was fitted in. Acting on it is the caller's job, and in a real project it is usually a conversation about whether a relief valve is the right device at all.

## Exercise

Name the three fields the liquid route reports about its loop and say what each one tells a caller. Then read the pass count column and say which viscosities make a one pass hand calculation least trustworthy, and why the two lowest viscosities take exactly one pass.
