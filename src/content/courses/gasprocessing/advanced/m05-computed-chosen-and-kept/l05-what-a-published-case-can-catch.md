# What a published case can catch

A check that restates the thing it is checking validates nothing. This module's published cases come from an oracle that says, route by route, which of its routes are independent of the engine and which are not, and that distinction is the whole of this lesson.

{{panel:fc-absorber-explorer}}

## The independent routes

The evidence that a route is independent is that it does not agree exactly.

The water content is checked against a different published vapour-pressure equation from the one the engine uses. Across the 4 published cases the largest departure from one is 0.006379500. Two published fits of one physical curve meeting inside their shared band is a result. Two copies of one fit agreeing exactly is not.

The Kremser relation is checked against a stage cascade solved as a linear system by elimination, which is different arithmetic reaching the same number. The largest departure from one across 5 cases is 0.000000000000.

The Joule-Thomson coefficient is checked against a molar volume built from a compressibility the oracle solves itself, with a different root-finder, and differentiated numerically. The identity the engine derives is never used on the checking side.

The balances are carried through kilograms, cubic metres, joules and watts, and the standard molar volume is built from the SI gas constant where the engine builds it from the package figure in field units.

## The signature that last one leaves

Every quantity that passes through the standard molar volume carries the gap between the two gas constants, and every quantity that does not carries none of it.

| published case | engine over golden | what the quantity is |
| --- | --- | --- |
| TEG case 1, water a day | 1.000000000000000 | a MASS balance, no molar volume in it |
| TEG case 1, BTEX a day | 0.999997865073155 | a MOLE balance, the molar volume is in it |
| amine case 1, circulation | 0.999997865073155 | a MOLE balance end to end |
| contactor case 1, gas density | 0.999997865073155 | the gas law, which carries the gas constant |

The molar rows all carry the same number to the last place double precision holds: the largest minus the smallest of them is 4.441e-16, which is a few units in the last bit. The mass rows carry none of it, and their largest departure from one is 0.000e+0.

So the signature is 0.999997865073155, the ratio of two gas constants. A quantity that shows it went through a mole. A quantity that does not, did not. That is a check telling you something about the arithmetic it just did.

## The shared values

The dehydration and sweetening balances turn on customary densities and a customary overhead, and nothing in this repository checks any of them. The oracle holds a second copy under a name that says so, so changing one of them breaks the published cases and makes the change a reviewed act.

That is a tripwire and it is worth having. It is not a validation, and the oracle says as much in its own comment.

## The rule to leave with

Agreement to twelve decimals between two things that share their arithmetic is a weaker result than agreement to six between two things that do not. The first says a transcription was faithful. The second says two roads met.

When a published case agrees exactly, the question to ask is not how close it came but how far apart the two sides were to begin with.

## Exercise

Name the four checking routes and say what each is independent of. Record the largest departure from one on the water cases and on the Kremser cases, the molar signature, and the spread across the molar rows. Then say what the shared values in the oracle do and do not do.
