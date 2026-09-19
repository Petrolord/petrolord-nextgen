# A blank box is refused

A screen that quietly reads an empty box as zero gives a confident answer to a question nobody asked. modularRefinery refuses instead, and it names the box.

{{panel:refinery-screen-explorer}}

## Blank money and size boxes

feasibilityStreams was run on OKORDIA with one input changed at a time. Every money or size box left blank came back refused by name:

| input changed | what the engine returns |
| --- | --- |
| crude cost left blank | REFUSED: "Missing crude cost. Enter 0 where the value really is zero." |
| capital cost left blank | REFUSED: "Missing capital cost. Enter 0 where the value really is zero." |
| capacity and fixed operating cost left blank | REFUSED: "Missing capacity, fixed operating cost. Enter 0 where the value really is zero." |
| variable operating cost left blank | REFUSED: "Missing variable operating cost. Enter 0 where the value really is zero." |

Two things are worth reading closely. When two boxes are blank, the refusal names both in one sentence, so you fix them together and do not discover the second one on the next run. And every refusal ends by telling you how to say zero on purpose: type 0. A blank and a zero are different statements. A blank says the value is unknown. A typed 0 says the value is known and it is nothing.

## Boxes with a range

Two inputs have a range, and the refusal states it:

| input changed | what the engine returns |
| --- | --- |
| utilisation typed as 90 | REFUSED: "Utilisation is a fraction between 0 and 1 (0.9 for 90 percent)." |
| utilisation typed as -0.1 | REFUSED: "Utilisation is a fraction between 0 and 1 (0.9 for 90 percent)." |
| on-stream days typed as 400 | REFUSED: "On-stream days must be between 1 and 366." |
| on-stream days typed as 0 | REFUSED: "On-stream days must be between 1 and 366." |
| utilisation typed as 0 | answered: annual throughput 0.00 bbl |

The last row matters. A utilisation of 0 is inside the range, so the engine answers it: a plant that runs at zero puts no barrels through, and the throughput reads 0.00 bbl. Zero on-stream days is refused, because a year with no on-stream days is outside the range the engine accepts.

## The scaling function returns nothing

scaleCapex, the function that scales capital from a quotation, behaves differently. Given a capacity of 0, or a blank reference cost, or a blank reference capacity, it returns null for the cost and null for the cost per bpd. Null is no cost at all. It is a different answer from a zero cost, and a panel that shows it as a blank field is telling the truth. The screen cannot scale a quotation it has not been given, and it cannot scale anything to a plant with no capacity, so it declines to print a cost for either.

## Valuing streams that carry a refusal

feasibilityEconomics, the call that hands the streams to the screening engine, checks what it is given. Streams refused for a blank crude cost come back with the same sentence, "Missing crude cost. Enter 0 where the value really is zero." A call that leaves out the tax rate is refused with "A discount rate and a tax rate are needed to value the project." In both cases the refusal travels forward with its words intact, so the reader of a valuation sees the same sentence the reader of the streams saw, and the box to fix is still named.

## The mistake

Clearing a refusal by typing 0 into the box it names. That makes the screen answer, and the answer is now a plant with free crude or free capital. Type 0 only where the value really is zero, which is what the engine's own sentence asks of you.

## Exercise

On the panel, blank the crude cost, then type 90 into utilisation, then type 0 into utilisation. Read what the engine returns each time. Say which of the three is a refusal about a missing value, which is a refusal about a range, and why the third produces a figure of 0.00 bbl in place of a refusal.
