# What it refuses

There is exactly one place in the fitting path where this module says no. Everywhere else it either hands back NaN or hands back a number with a flag on it.

## The one outright refusal

Given two points, `fitStageCurve` returns ok false with the message "A stage curve needs at least three points from the vendor curve." and no head fit at all. Nothing downstream can read a curve that does not exist, so the failure stops where it started.

## The partial refusal, which is more dangerous

Give it head points and no efficiency points and it returns ok true, with the warning "No efficiency points given, so brake power comes from the vendor power points or cannot be computed." The head fit is built and works, still reading 27.914286 ft at 2500 bbl/d. What is gone is everything that needed efficiency: the best efficiency rate comes back NaN and so does the brake power per stage. A curve missing half its data is accepted with two holes in it, and the holes show up only in the fields that use them.

## What NaN is doing

| Call | Condition | Result |
| --- | --- | --- |
| `brakeHp` | efficiency zero | NaN |
| `bepOf` | no efficiency fit | rate NaN, head NaN |
| `stageCount` | head per stage zero | NaN |
| `stageCount` | head per stage negative | NaN |
| `totalDynamicHead` | gradient zero | NaN |
| `motorCurrent` | nameplate power zero | NaN |
| `stagePerformance` | zero frequency | head NaN, region `invalid` |

NaN is arithmetic falling over, not a decision, and it propagates with no message attached. `totalDynamicHead` with a gradient of zero still returns its pressure difference of 2000.0 psi alongside the NaN, so part of the answer looks healthy.

## The refusal to guess

Above 10 cSt this module says a pump curve correction is normally needed and then does nothing about it. At 20 cp on a 58 lbm/ft3 fluid the kinematic viscosity is 21.517241 cSt, correction required comes back true, factors applied comes back false, and the head and efficiency handed back are the water curve unchanged. The note is explicit: the water curve overstates head and efficiency, and Hydraulic Institute factors must be entered before the stage counts are used. The chart is ANSI/HI 9.6.7 and it is not reproduced here from memory, because invented factors would be worse than none.

## The mistake

Reading a NaN as protection. Below about half load, `motorCurrent` at a fifth of plate returns a load fraction of 0.2000 and a current of 9.8000 A with the estimate flagged weak, because the real current flattens toward the magnetising current. That is a flag on a number, not a refusal, and it is the pattern this whole module follows.

## Exercise

List the three conditions that make `stageCount` or `totalDynamicHead` return NaN, and say for each whether anything is printed alongside it.

Then say which of the refusals here would still let a full design run to a stage count.
