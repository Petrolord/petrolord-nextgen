# What dropping a term does

A missing resistance is not a small error in U. It is the whole share that term carried, and it propagates into every quantity built on U.

{{panel:pd-hydrate-explorer}}

## The error is the share, inverted

U is inversely proportional to the total resistance, so removing a term removes its share of that total and raises U by more than the share itself. On the published pipe the 3.0 ft ground term carries 44.145299 percent of the stack, and losing it moves U from 0.7455927364 to 1.3348791131 Btu/(hr ft2 degF), an error of 79.035960 percent. On TEACHING LINE AKASO SPUR, which is a teaching construct and not a published case, the trench carries 32.14809253 percent of the stack and losing it is worth 47.379792 percent on U.

Two lines, one guard, two very different error sizes, and the difference is nothing but how much of the stack the ground was carrying.

## It always errs in the same direction

A dropped term can only ever be a resistance that is no longer there, so U can only come back high. A high U means more heat leaving, a shorter relaxation length, a colder computed arrival and a shorter computed cooldown. The line reads worse than it is.

That is worth stating precisely because it is not reassuring. An answer that is wrong in the safe direction still buys insulation the line does not need, doses inhibitor the line does not need, and, on a cooldown, sends people to a valve earlier than the physics requires.

## Where it lands downstream

Relaxation length is exactly inverse in U. At 120000.0 lb/hr and Cp 0.5 on the 6.065 in bore, the published buried stack gives 52983.47772700 ft. The swallowed answer, being the published insulated U to the last figure, gives 28308.04522908 ft instead. The line is computed as though it relaxed toward the seabed in a little over half the distance it really does.

Since ntu is the length divided by the relaxation length, that error sits in an exponent. A sweep on a 180.0 degF inlet against a 40.0 degF ambient shows what an ntu error is worth: ntu 0.5000 arrives at 124.9142923598 degF, ntu 1.0000 at 91.5031217640 degF, ntu 2.0000 at 58.9469396531 degF. A factor of two in ntu is tens of degF in the middle of the exponential and almost nothing once the line is long.

## The mistake

Sanity checking the U and stopping there. A U of 1.3348791131 on a buried pipe is not obviously absurd, because it is exactly the U that pipe would have if it were lying exposed on the seabed, and a plausible number is the one kind of wrong answer no reviewer catches.

## What it refuses

The dropped ground term is refused nowhere. `overallU` reports `ok` true, an error field of none, and a resistances array whose length is the only place the loss is recorded: 4 entries where 5 were asked for, 5 where 6 were asked for.

## Exercise

Compute the buried published stack in the panel, then the same stack with the trench below its D/2 floor, and record U and the relaxation length for both.

Then say which direction the arrival temperature moved, and why that direction is still a design error.
