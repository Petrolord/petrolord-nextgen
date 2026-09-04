# What a rule of thumb assumes

A fitting is thirty diameters of pipe is not a fact about fittings. It is a friction factor written in a disguise, and it is right at one value of it.

{{panel:pd-trunk-explorer}}

## Two answers for the same six fittings

Four long radius elbows and two gate valves, sum K 1.500000, on a 6.065 in bore. The thirty diameters rule gives 15.162500 ft. The engine at a friction factor of 0.018 gives 42.118056 ft. Both claim to be a length of that pipe for that fitting list, and the rule's figure is a sweep this course computed rather than something the module ships: there is no rule of thumb in the file.

## What the rule gets right

The bore. A diameters rule and the engine both scale with it, so the same six fittings run 14.354167 ft on the smallest published schedule 40 bore of 2.067 in, 42.118056 ft on the 6.065 in gate case and 104.166667 ft on the largest at 15 in, all at a friction factor of 0.018. Geometry is the half of the problem a rule of thumb can carry.

## What it cannot carry

The friction factor, and it is the whole of the difference. Read as diameters of pipe, the same fitting list is 150.000000 at a friction factor of 0.010, 107.142857 at 0.014, 83.333333 at 0.018, 75.000000 at 0.020, 60.000000 at 0.025 and 50.000000 at 0.030. Those are sweep points on one bore. A fixed diameters count is exactly one of them and it never says which, so quoting a rule of thumb is quoting a friction factor without admitting to it.

## What the module does instead

Nothing convenient, and on purpose. There is no default friction factor and no default bore: omit either and the answer is a refusal, An equivalent length needs a bore and a friction factor. The K values themselves are round because they are approximations that vary between manufacturers, so the module is exact about the inputs it demands and honest about the precision of what it publishes.

## The mistake

Checking an engine answer against a diameters rule and concluding the engine is wrong. On that published list the rule says 15.162500 ft and the engine says 42.118056 ft at a friction factor of 0.018, a gap far too large to be rounding in either. Neither number is an error. The way to settle it is to say out loud what friction factor the rule assumed, and ask whether it is the one on the line in front of you.

## Exercise

In the panel, run four long radius elbows and two gate valves on a 6.065 in bore at friction factors of 0.010 and of 0.030, and write both answers in diameters of pipe.

Then say what friction factor a thirty diameters rule would have to be assuming to agree with either.
