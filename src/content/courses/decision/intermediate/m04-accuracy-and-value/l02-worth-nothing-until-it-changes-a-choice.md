# Worth nothing until it changes a choice

A symmetric survey on the EKPAN lottery moves the success probability at every accuracy over 0.500000, and it is worth exactly 0.0000 until its accuracy reaches 0.645051. Until then both readings still lead to Drill, and a reading that changes no action changes no money.

{{panel:ec-information-explorer}}

## The rows where nothing is bought

| accuracy | posterior Success after reads success | posterior Success after reads dry | best action after reads success | best action after reads dry | evii |
| --- | --- | --- | --- | --- | --- |
| 0.500000 | 0.350000 | 0.350000 | Drill | Drill | 0.0000 |
| 0.550000 | 0.396907 | 0.305825 | Drill | Drill | 0.0000 |
| 0.600000 | 0.446809 | 0.264151 | Drill | Drill | 0.0000 |
| 0.650000 | 0.500000 | 0.224771 | Drill | Farm out | 0.7250 |
| 0.700000 | 0.556818 | 0.187500 | Drill | Farm out | 8.0500 |

At 0.600000 a dry reading drops the success probability from 0.350000 to 0.264151. That is a real change of belief, and evii is still 0.0000.

## The switch decides

With the drill cost of 55.0000 inside, Drill is worth 445 p - 80 and Farm out 95 p, and the two lines cross at p = 80 / 350 = 0.228571. A success probability higher than 0.228571 means Drill; a lower one means Farm out.

A success reading only pushes the probability higher than the prior of 0.350000, which already chooses Drill, so it can never change the action. Only a dry reading can, once it pushes success under 0.228571. At 0.600000 it reaches 0.264151, still on the drill side. At 0.650000 it reaches 0.224771, across the switch, and Farm out takes over after a dry reading.

## Why the value is exactly zero

When both readings lead to Drill, the value with information is Drill's value at each posterior, weighted by the chance of that reading. Drill is a straight line in p, and the posteriors weighted by their reading chances return the prior. So the weighted sum is simply Drill at 0.350000, which is the emvPrior of 75.7500. At 0.600000:

0.470000 x (Drill at 0.446809) + (1 less 0.470000) x (Drill at 0.264151) = 75.7500

and evii is 75.7500 less 75.7500 = 0.0000. At 0.550000 the engine's own subtraction leaves a residue of -1.42e-14, which prints as 0.0000. It is floating-point noise from two equal sums, and no negative value.

## Where it first changes

Bisection on the engine's own choice puts the accuracy at which a dry reading first changes the action at 0.645051. The value starts from zero there and grows with no jump: at the flip, Drill and Farm out are equal at the dry reading's posterior, so switching gains nothing yet, and the gain grows as the posterior falls further. At 0.650000 evii is 0.7250; at 0.700000 it is 8.0500.

## The mistake

The careful mistake is paying for movement: an analyst sees a dry reading at accuracy 0.600000 move success to 0.264151 and books value for it. Movement that does not cross 0.228571 buys nothing. The second mistake is assuming that a survey which changes a choice pays for itself. At the survey cost of 8.0000, accuracy 0.650000 is worth 0.7250 gross, far short of its cost. Only at 0.700000 does the gross value, 8.0500, clear 8.0000.

## What it refuses

The engine is risk neutral. A survey that spares the company a dry hole it would have drilled anyway has no value to it, because comfort is not money and the rollback maximises the mean.

## Exercise

At accuracy 0.600000, state both success posteriors and the action after each reading, and explain by weighting why evii is 0.0000. Then give the accuracy at which a dry reading first changes the action, state evii at 0.650000 and 0.700000, and say which of the two covers a survey cost of 8.0000.
