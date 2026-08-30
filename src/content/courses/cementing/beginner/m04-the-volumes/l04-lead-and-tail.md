# Lead and tail

One slurry volume, split at a depth, into two different cements.

{{panel:cm-volume-explorer}}

## The split

    lead = volume between the top of cement and the split depth
    tail = total slurry less the lead

So the lead is an ANNULAR volume between two depths, and the tail is everything else including the shoe track.

## On this course's wells

The split is at the previous casing shoe: 1400 m on the slant well, 1200 on the horizontal one. Both give

    lead = 200 x 0.013356688045922537 = 2.6713376091845076 cubic metres
    tail = 25.123380942966243 - 2.6713376091845076 = 22.452043333781734

So the lead is the cased annulus above the shoe and the tail is the whole open hole plus the shoe track.

## Why split at all

**Density.** The lead is lighter, 1560 kg/m3 against 1900 on this job. A lighter column in the annulus means a lower hydrostatic and a lower circulating density at the shoe above, which is often the constraint that decides whether the job can be pumped at all.

**Strength where it is needed.** The tail is the cement across the reservoir and at the shoe, where compressive strength and bond quality matter. The lead is filler across a cased section that is already isolated by the string outside it.

**Cost.** A lead slurry is extended with water and extenders and is substantially cheaper per cubic metre.

The order those three are usually given in is wrong. The density is the reason; the cost is a bonus.

## Where the split is put

At the previous shoe, almost always, and for a reason that is geometric rather than economic: the previous shoe is where the annulus changes from steel to rock, and it is the deepest point that is still protected by the casing above.

Putting the heavy tail everywhere below that point puts strength where the hole is open, which is where it is needed.

## The engine's constraint

    Lead/tail split must sit between TOC and the shoe.

And the split contributes nothing to the total: lead plus tail is the slurry volume by construction, whatever the split depth. Moving the split moves cement from one column of the sheet to the other and changes no total.

## What the split does to the placement

Everything, and the Professional tier is largely about it. Two programmes that pump the same total slurry to the same top of cement, one as a single heavy slurry and one split into lead and tail, produce different pump pressures, different peak circulating densities, and on one of this course's wells one of them free falls and the other does not.

## Exercise

Move the split on the slant well from 1400 m to 1700 m and compute the new lead and tail volumes, remembering which capacity applies to the extra 300 m.

Then confirm that lead plus tail is unchanged.
