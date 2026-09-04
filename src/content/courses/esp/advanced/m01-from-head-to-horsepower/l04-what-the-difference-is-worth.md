# What the difference is worth

Run the cable selection twice on one design, changing only which of the two brake powers it is handed. A different conductor comes out of the same table under the same limit.

{{panel:pd-power-explorer}}

## One number, two defensible readings, two cables

The teaching well IBENO-2 on a teaching cable string of 3300 ft at 140 degF, into its 60 hp, 1000 V, 38 A plate. The two runs differ only in the horsepower at the top.

| | On shaftHp | On stack brake power |
| --- | --- | --- |
| Power, hp | 29.77428389 | 30.53878580 |
| Motor current, A | 18.857046 | 19.341231 |
| 6 AWG drop, percent | 4.938649 | 5.065457 |
| 6 AWG passes | true | false |
| Cable chosen | 6 AWG | 4 AWG |

The limit is 5.0 percent on both runs. The first stops at the first conductor in the table. The second finds it over the limit and takes the next, at 3.185403 percent, where the first run left 4 AWG unused at 3.105660 percent.

## Nothing on the way damps it

Current is plate amps times shaft power over plate power. Drop is 1.7320508076 times current times resistance times length in thousands of feet. Both are linear, so the 2.503380 percent understatement on this stack reaches the drop percentage at full size, and that percentage is what the limit sees.

## Four cases where the pick did not move

The flip is not universal. A pick moves only when the winning drop falls between the limit divided by the power ratio and the limit itself, a window the rounding margin wide.

The published gassyOffshore design has a power ratio of 1.000373590543, so its window is thousandths of a point: on a teaching cable string it takes 2 AWG both ways, at 3.320627 and 3.321868 percent. The published highWaterCut design and the teaching well QUA-IBOE-4 return no cable on either run. The teaching well IBENO-2 on its own 2100 ft string takes 6 AWG both ways.

The case that moved has a ratio of 1.025676584275 on 33 stages, against 1.000373590543 on 192.

## What it refuses

It refuses to say the decision was close. Neither run reports its distance to the limit or the drop of the size below, and IBENO-2 raises 0 warnings on the sizing that produced both powers. It does not flag the disagreement either: both runs are internally consistent, and either alone reads as settled.

## The mistake

Sizing the exposure by the horsepower. On a 60 hp plate 0.76450191 hp looks like nothing, and a designer who stops there concludes the choice cannot matter. What decides is the margin it is spent against, and 4.938649 percent against 5.0 percent has almost none.

## Exercise

Run the teaching well IBENO-2 on the 3300 ft string twice, once on each power, and record the current, the 6 AWG drop and the cable chosen for both.

Then say what would have to be true of the drop for the pick to move on the published gassyOffshore design.
