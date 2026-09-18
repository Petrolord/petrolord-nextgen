# The smaller capacity rate governs

Two capacity rates go into a balance and they are almost never equal. On the studio case the hot stream is 27500.0000 Btu an hour per degF against the cold stream at 80000.0000. The smaller of the two is the one that governs a rating, and this lesson is about what that sentence means before any rating has been done.

{{panel:fc-exchanger-explorer}}

## The smaller one moves further

The same duty passes through both streams. Whatever heat leaves the hot side arrives on the cold side, so the two temperature changes cannot both be small. The stream with the smaller capacity rate needs more degrees to carry the same Btu an hour, so it is the stream whose temperature moves further.

On the studio case the hot stream falls from 300 F to 200.000000 degF while the cold stream rises from 100 F to 134.375000 degF. The hot drop is the larger of the two, and the hot stream is the one with the smaller capacity rate. That is not a coincidence about this case. It follows from the same duty dividing by two different capacity rates.

## The capacity ratio

The engine reports the smaller capacity rate over the larger as a dimensionless group. On the studio case it is 0.343750, which is 27500.0000 over 80000.0000. It has no units and it is never above one, because it is defined smaller over larger rather than hot over cold.

That ratio is the second thing a rating needs, after the surface. It does not appear in the sizing chain at all. Sizing needs a duty, a driving force and a coefficient, and it never asks which stream is the smaller. Rating asks, every time.

## On ORON, name the direction and stop there

ORON's hot stream is 45880.0000 Btu an hour per degF and its cold stream is 110880.0000, so on ORON too the hot stream is the smaller one and the hot stream is the one that governs. That much is readable straight off the capacity rate table.

Do not go further than that. This course does not print a capacity ratio for ORON, because the engine was not asked for one there, and a figure you produce by dividing two numbers off a table is a figure nothing in this module stands behind. Write down the direction, which is what the table shows, and leave the ratio to the case that has one.

## What this tier does not do with it

Knowing which stream governs is where the rating question begins. What the maximum heat transfer is, how an effectiveness is defined against it, and why some arrangements cannot reach one at any area, all belong to the tier that rates machines. This tier stops at identifying the governing stream and carrying its capacity rate forward.

## Exercise

For the studio case and for ORON, write down the two capacity rates, circle the smaller one, and say which stream it belongs to. Then state the studio capacity ratio and the two figures it came from. Finally, write one sentence on why you are not writing a capacity ratio for ORON.
