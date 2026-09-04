# Two powers for one pump

One duty, one stage curve, one stack, and two brake horsepowers come back with different values. Both are correct arithmetic. They answer different questions.

{{panel:pd-power-explorer}}

## Integers are the reason there are two

The stage count is the head required divided by the head per stage, rounded up. The published gassyOffshore design needs 191.92829740 stages and gets 192, so 0.07170260 of a stage is rounded away and the stack makes 4980.20162863 ft against a requirement of 4978.341767 ft. That is 1.85986141 ft of margin, or 0.037359 percent.

`shaftHp` is brake power at the head REQUIRED. `stack.bhpTotal` is brake power at the head the stack MAKES. The extra stage is steel and it turns, so the second is larger.

| Case | Shaft, hp | Stack, hp | Gap, hp | Gap, percent |
| --- | --- | --- | --- | --- |
| Published gassyOffshore | 125.69771587 | 125.74467535 | 0.04695948 | 0.037359 |
| Published highWaterCut | 172.55965200 | 172.74929676 | 0.18964476 | 0.109901 |
| Teaching well QUA-IBOE-4 | 95.41621294 | 95.97003263 | 0.55381969 | 0.580425 |
| Teaching well IBENO-2 | 29.77428389 | 30.53878580 | 0.76450191 | 2.567658 |

## The identity that fixes the gap

Brake power is linear in head at a fixed rate and efficiency, so the ratio of the two powers IS the ratio of the two heads. On gassyOffshore the power ratio is 1.000373590543 and the head ratio is 1.000373590543, and their difference is -0.0000000000000004. On highWaterCut both read 1.001099009857. On IBENO-2 both read 1.025676584275 and the difference is exactly zero.

The identity holds on every published design and teaching case in the set, so the gap is never a mystery. It is the rounding, expressed twice.

## The margin is bounded by one stage, not by a percentage

The published gassyOffshore stack is 192 stages and its slack is 0.07170260 of a stage, worth 0.037359 percent. The teaching well IBENO-2 stack is 33 stages, its slack is 0.82611546 of a stage, and that is worth 2.567658 percent. What differs is what the slack is a percentage of.

Sweeping the IBENO-2 requirement shows the sawtooth. At 720 ft it takes 32 stages, makes 721.171425 ft and carries 0.162698 percent of margin. At 725 ft it takes 33, makes 743.708032 ft and carries 2.580418 percent.

## What it refuses

The engine refuses to tell you which of the two powers you should use. Both come back under different names, with no flag and no warning. The published gassyOffshore design raises 0 warnings while carrying both.

It also refuses to round a stage count it cannot form: a head per stage of zero returns NaN, and so does a negative one.

## The mistake

Calling the two the same to three figures and moving on. On the tall published stacks it is nearly true. On the teaching well IBENO-2 the two differ by 0.76450191 hp, 2.567658 percent of a 33 stage design, and a short stack is where a designer is least likely to check.

## Exercise

Read stages before rounding, stages after rounding, head required and head made for the teaching well IBENO-2, and form the head ratio.

Then read both brake powers and show that their ratio is the same number to the digits the panel prints.
