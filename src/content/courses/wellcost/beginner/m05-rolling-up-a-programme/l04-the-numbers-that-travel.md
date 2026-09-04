# The numbers that travel

The rollup reports six totals, and only two of them cross into the cost side of the engine.

{{panel:wc-time-explorer}}

## The six totals

Evaluating the golden programme returns productive hours 384, non-productive hours 48, elapsed hours 432, elapsed days 18, drilled metres 3,000 and total depth 3,000 m.

The cost rollup is a separate function, and it takes only two of those: elapsed days and drilled metres. It never sees the schedule, the split, the depths or the hours.

## Why those two

Because they are the only quantities a cost line can be multiplied by. Every item in this model carries one of three bases.

| Basis | Multiplied by |
| --- | --- |
| per-day | Elapsed days |
| per-meter | Drilled metres |
| lump | Nothing |

A per-day line needs a day count. A per-metre line needs a metre count. A lump line needs neither, because it is already a number.

There is no fourth basis, so there is no fourth quantity to carry. Eighteen days and three thousand metres are sufficient to price the whole programme.

## What is thrown away at the boundary

This is the part worth noticing. The productive and non-productive split does not cross. The cost side is handed 18 days and cannot tell that 16 of them were work and 2 were trouble.

Total depth does not cross either, even though it equals drilled metres here. Nothing is bought by how deep the well is, only by how much hole was made.

The consequence is that all the care of the previous two modules lands in one scalar. Every argument about ROP, every flat duration, every judgement about what counts as trouble time, all of it arrives at the cost side as a single day count.

That is a good reason to get the day count right and a good reason to quote the split alongside it. The split is what makes 18 days challengeable. Once it has been converted, it is just a multiplier.

## The two numbers to carry forward

Elapsed days, 18. Drilled metres, 3,000. If you remember two numbers from this tier, remember that these are the two the rest of the model consumes.

## Exercise

List the six totals from the panel and mark the two that travel.

For each of the three bases, name one real cost item and state which quantity it would be multiplied by.

Change the allowance and record what happens to each of the two travelling numbers. Explain the difference in one line.
