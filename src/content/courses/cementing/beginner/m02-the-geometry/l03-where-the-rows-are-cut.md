# Where the rows are cut

At the section boundaries and the shoe, and nowhere else.

{{panel:cm-volume-explorer}}

## The rule

The engine collects a set of cut depths: zero, the casing shoe, and every hole section boundary that lies above the shoe. It sorts them and makes one row between each adjacent pair.

So the number of rows is the number of hole sections the casing passes through, and the cuts are not chosen by the user.

## What is NOT a cut

**The top of cement.** The TOC can and usually does fall in the middle of a row. The volume function handles that by taking the overlap of the requested interval with each row, not by splitting the row.

On the slant well the top of cement is at 1200 m, which is 200 m into the first row of 1400.

**The lead and tail split.** Same treatment. On the slant well the split is at 1400 m, which happens to coincide with a row boundary, but the engine did not put a cut there and would not have needed one.

**The float collar.** That is an INSIDE depth, and the inside has one capacity for the whole string, so it needs no rows at all.

## The zero-length guard

If two cut depths land within a nanometre of each other the row between them is skipped rather than emitted with a length of zero. A zero-length row would contribute nothing to any volume and would divide by zero in the placement mapping, which converts volume back into depth.

## The coverage check

Once the rows are cut, the engine finds the hole section covering the MIDPOINT of each. If there is no such section it throws, naming the interval:

    Hole geometry does not cover 500-1400 m.

That refusal is worth having. A hole description with a gap in it is a data error, and a volume calculated over a gap would silently be too small.

## The fit check

For each row the engine also checks that the bore is strictly larger than the casing outside diameter, and throws if it is not:

    Casing OD does not fit the hole at 1400-3000 m.

That catches the other common data error, which is a casing size and a bit size that were never meant to go together.

## Exercise

The slant well has two hole sections and a shoe at 3000 m. Write down the cut depths the engine will collect.

Then say what would happen if a third hole section were declared from 3000 to 3400 m, below the shoe.
