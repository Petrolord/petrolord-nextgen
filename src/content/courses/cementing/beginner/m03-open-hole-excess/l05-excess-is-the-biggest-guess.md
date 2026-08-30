# Excess is the biggest guess

Every other number on the volume sheet is a measurement. This one is not.

{{panel:cm-volume-explorer}}

## The audit

Walk the inputs to a volume sheet and ask where each came from.

**Casing outside and inside diameter.** A published API table, to four decimals.

**Shoe and float collar depth.** A tally of the joints as they went in the hole, accurate to a few centimetres.

**Previous casing inside diameter.** The same published table.

**Bit size.** Stamped on the bit.

**Top of cement.** A design decision, made deliberately by an engineer who can defend it.

**Slurry yield.** A laboratory measurement on the actual blend.

**Open hole excess.** A guess.

## The size of the guess against the size of the others

A tenth of a millimetre of uncertainty on the casing outside diameter changes the annular capacity by about a tenth of a percent. Ten percentage points of excess changes it by ten percent, a hundred times more.

Every other uncertainty on the sheet is in the third or fourth significant figure. This one is in the first.

## Which means the precision of the sheet is a fiction

The engine reports 25.123380942966243 cubic metres of slurry, and every digit of that is correct arithmetic on the inputs given. Change the excess from 15 to 20 and it becomes 26.06585685408759.

So the honest statement is not 25.123 cubic metres. It is somewhere between about 23 and about 28, and the sheet says 25.123 because a purchase order needs a number.

## What to do about it

**Report the assumption next to the answer.** A slurry volume with no excess figure attached is not a result.

**Sweep it.** The volume is linear in the excess, so two runs give the whole line and a reader can see the sensitivity at a glance.

**Bias it deliberately, and say so.** The two errors are not symmetric, so the choice is not the best estimate but the one whose failure mode you would rather have.

**Get a caliper where the section matters.** It converts the first significant figure back into the third.

## The wider habit

This is the same habit the Casing and Tubing course taught in a different form: compute the gap. Any answer whose precision exceeds the precision of its worst input is quoting the arithmetic rather than the engineering.

## Exercise

Take the slurry volume at 15 percent excess and at 25.

Express the difference as a percentage of the answer, and compare it against the number of digits the engine prints.
