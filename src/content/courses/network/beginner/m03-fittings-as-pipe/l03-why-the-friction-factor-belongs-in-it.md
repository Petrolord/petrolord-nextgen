# Why the friction factor belongs in it

A fitting costs K velocity heads. A length of pipe costs the friction factor times that length over the bore, in velocity heads. Setting those two equal is the whole of the equivalence, and it cannot be done without the pipe's own friction factor.

{{panel:pd-trunk-explorer}}

## The published pair

Four long radius elbows and two gate valves, sum K 1.500000, on a 6.065 in bore. At a friction factor of 0.018 the equivalent length is 42.118056 ft. On a smoother line, at 0.012, the same six fittings on the same bore are 63.177083 ft, which is 1.500000 times as long.

## The smoother line is worth more feet

That reads backwards until you remember what is being equated. The fittings did not get worse. The pipe got cheaper per foot, so it takes more feet of it to lose what the fittings lose. The friction factor sits in the denominator for that reason and no other, and a fitting therefore has no equivalent length until a pipe has been named. The bore works the same way from the other side of the fraction: at a friction factor of 0.018 that list is 14.354167 ft on a 2.067 in bore and 104.166667 ft on a 15 in bore, because a wider pipe also loses less per foot.

## The same fittings across a friction factor sweep

| Friction factor | Length, ft | Diameters of pipe |
| --- | --- | --- |
| 0.010 | 75.812500 | 150.000000 |
| 0.014 | 54.151786 | 107.142857 |
| 0.018 | 42.118056 | 83.333333 |
| 0.020 | 37.906250 | 75.000000 |
| 0.025 | 30.325000 | 60.000000 |
| 0.030 | 25.270833 | 50.000000 |

Same six fittings, same 6.065 in bore, nothing moving but the friction factor, and every row is a sweep point rather than a published case. Read as diameters of pipe the answer runs from 150.000000 down to 50.000000. There is no single diameters count for that fitting set. There is one per friction factor, and the coarsest row is as honest as the finest.

## What the module will not do about it

It will not produce a friction factor. The calculation asks for one and refuses without it, An equivalent length needs a bore and a friction factor. The module ships absolute roughnesses, 0.0018 in for new commercial steel and 0.006 in for steel in service, and never turns one into a friction factor, because nothing in the file iterates and a friction factor correlation is an iteration. The number arrives from the caller, which makes it the input most often inherited from another line.

## The mistake

Quoting one line's equivalent length against another line's pipe. Carry 42.118056 ft, the answer at 0.018, onto a line running at 0.012, and the correct answer there is 63.177083 ft, 1.500000 times what was written. Nothing about the elbows or the valves changed, and the whole of the error sits in a number that describes the pipe.

## Exercise

In the panel, run four long radius elbows and two gate valves on a 6.065 in bore at friction factors of 0.010 and of 0.030, and write both lengths.

Then say which is the better pipe, and why it scores the larger number of feet.
