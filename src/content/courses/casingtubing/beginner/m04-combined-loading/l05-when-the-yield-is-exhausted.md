# When the yield is exhausted

What the engine does at the end of the curve, and why it says so out loud.

{{panel:ct-rating-explorer}}

## The edge case

Push the axial stress up to the yield strength and the adjusted yield goes to zero. There is no strength left over to resist anything else.

Push it past the yield strength and the formula would take the square root of a negative number.

## What the engine returns

    { collapsePa: 0, regime: 'yield-exhausted' }

Zero, and a regime name that is not one of the four. It does not throw, it does not return a small positive number, and it does not silently clamp to the elastic value.

## Why that is the right behaviour

Because the three wrong answers are each worse in a different way.

**Throwing** would abort a whole string evaluation because one depth in one section on one load case went past the yield. A design tool has to be able to report a failure rather than refuse to run.

**A small positive number** would flow into a safety factor and produce a very large or very small ratio that looks like a computed result. It would be a number with no meaning wearing the clothes of one.

**Clamping to elastic** would be the most dangerous of the three, because it is plausible: the answer would look like a normal collapse rating and it would be entirely wrong.

## The named regime is the point

Four regimes are physical. The fifth name is a flag, and it is a flag that travels with the answer instead of being logged somewhere and lost.

Anything downstream that reports the regime, and the string check in the next tier does, will show yield-exhausted next to a collapse safety factor of zero, and the reader will know at once that the problem is axial rather than radial.

## The wider habit

An engine that computes a number for every input is not more useful than one that refuses. It is less useful, because the caller cannot tell the two situations apart.

Every engine in this suite is built to say which of the two it is doing, and this is the smallest and clearest example of it.

## Exercise

In the panel, take any pipe up to an axial fraction of 0.8 and read the regime. Then reason about what the collapse rating would be at a fraction of 1.0 and at 1.1.

Say what a safety factor computed from that rating would look like, and what a design report should print instead of it.
