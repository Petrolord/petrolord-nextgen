# What the inverse refuses

Two of the targets you can ask for are impossible, and they are impossible for different reasons. `uForArrivalTemp` says which, in words, and gets both right.

{{panel:pd-line-explorer}}

## The wall at ambient

Derived runs on the published fluid, 180.0 degF in against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5 over 26400.0 ft. A 40.00 degF target and a 39.00 degF target are both refused with the same reason: a line cannot arrive above ambient (40 F) no matter how well it is insulated, the target has to be above it. That is not a numerical guard. The logarithm of a ratio with zero or a negative number under it has no answer, and ambient is where an infinitely long line ends up and no wall reaches past it.

## The other wall, at the inlet

A 180.00 degF target and a 185.00 degF target are refused too, with a different sentence: the fluid already enters below the target, so insulation is not the problem. Read those two rows against the 40.00 and 39.00 rows. One refusal says the target is unreachable, the other says the question was the wrong one. A caller who catches only `ok = false` and prints a generic failure has thrown away the difference.

## What it will happily return

Between those two walls it refuses nothing. The 45.00 degF target returns 4.769573431949 Btu/(hr ft2 degF), the 41.00 degF target returns 7.073253258346 at an implied ntu of 4.941642422609, and both come back `ok = true`. Nothing in either return says whether a wall like that exists or could be built. The function answers a question about arithmetic and the buildability question is nobody's inside this module.

## What no refusal covers

It does not check the reference diameter of the U it is about to produce. It does not check whether the mass rate it was handed is one the field will sustain. It does not know that the target it was given came from a laboratory, or that a laboratory number carries its own error, and it will invert a boundary quoted to the nearest degF into a U quoted to twelve figures without comment.

## The careful mistake

Treating the two refusals as one error class. The first is a hard physical limit and the answer is that the target is wrong. The second means the line is already colder than the target at the inlet, so the design problem is heating or rate, and no amount of insulation touches it. Same `ok = false`, opposite corrective actions, and the message is the only thing that separates them.

## Exercise

Ask the published fluid over 26400.0 ft for a 39.00 degF arrival, then for a 185.00 degF arrival, and record both messages.

Then say what you would do next in each case, and why the answer is different.
