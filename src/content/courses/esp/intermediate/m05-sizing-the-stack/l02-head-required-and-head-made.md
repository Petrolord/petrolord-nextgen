# Head required and head made

Two heads and two powers, and each pair carries the same ratio.

{{panel:pd-lift-explorer}}

## The stack makes what its stages make

Head made is the stage count times the head per stage. The count was rounded up, so it always meets or exceeds the requirement.

| Case | Required, ft | Stages | Made, ft | Margin, ft | Margin |
| --- | --- | --- | --- | --- | --- |
| gassyOffshore | 4978.341767 | 192 | 4980.20162863 | 1.85986141 | 0.037359 percent |
| highWaterCut | 3797.140461 | 264 | 3801.31355556 | 4.17309479 | 0.109901 percent |
| QUA-IBOE-4 | 4032.187516 | 172 | 4055.59134590 | 23.40383021 | 0.580425 percent |
| IBENO-2 | 725.090193 | 33 | 743.70803232 | 18.61783944 | 2.567658 percent |

## Two powers come back, and they answer different questions

`sizePump` returns a shaft horsepower and a stack brake power. The shaft horsepower is brake power at the head the duty REQUIRES. The stack brake power is brake power per stage times the stage count, which is brake power at the head the stack MAKES.

| Case | At head required, hp | At head made, hp | Difference, hp | Difference |
| --- | --- | --- | --- | --- |
| gassyOffshore | 125.69771587 | 125.74467535 | 0.04695948 | 0.037359 percent |
| highWaterCut | 172.55965200 | 172.74929676 | 0.18964476 | 0.109901 percent |
| QUA-IBOE-4 | 95.41621294 | 95.97003263 | 0.55381969 | 0.580425 percent |
| IBENO-2 | 29.77428389 | 30.53878580 | 0.76450191 | 2.567658 percent |

The head margin and the power gap are the same percentage on each case: 0.037359 percent on gassyOffshore, 0.109901 percent on highWaterCut, 0.580425 percent on QUA-IBOE-4 and 2.567658 percent on IBENO-2.

## A third power is also returned

gassyOffshore's hydraulic power at the head required is 87.10569922 hp against a shaft horsepower of 125.69771587 hp, the two separated by the stage efficiency of 0.6929775821 at the duty. highWaterCut reads 116.39870723 hp against 172.55965200 hp at an efficiency of 0.6745418519. Three powers come out of one sizing, and only one is what a motor turns.

## The mistake

Quoting the head made where the requirement was asked for, or the reverse. On QUA-IBOE-4 those are 4055.59134590 ft and 4032.187516 ft, both correct answers to questions nobody separated.

The costlier version is mixing the two powers along a chain. Everything electrical in this package is built on the power at the head required, 95.41621294 hp on QUA-IBOE-4 and not 95.97003263 hp. A report that sizes a motor on one and takes amps from the other is inconsistent by exactly the rounding margin, 0.76450191 hp on the short teaching stack.

## What it refuses

The head made is what the stack makes at the duty rate, not at any rate: one point on a curve, not a promise the well will take that rate. And the excess head is not a design margin anybody chose. It is the remainder of an integer division.

## Exercise

For each case in the panel, multiply the stage count by the head per stage and check it against the head made.

Then write the head margin percentage and the power gap percentage side by side, and say what you notice.
