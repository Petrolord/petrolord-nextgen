# Why the vent capacity is refused by name

{{panel:fc-withheld-explorer}}

This is the lesson the tier is built around. The engine computes the fire heat input on this tank and then declines to turn it into a required emergency vent capacity. It returns no zero, no estimate and no empty field. It returns a reason.

## What comes back

| quantity | value |
| --- | --- |
| wetted area, ft2 | 5881.0614 |
| effective wetted height, ft | 30.000000 |
| heat input band | above 2800 ft2 |
| fire duty, Btu/hr | 25892440.2513 |
| environment factor | 1.000000 |
| required vent capacity, scfh of air | null |
| the vent is withheld | true |

The duty is there. The vent capacity is null and a flag beside it says the vent is withheld, so a reader can see the calculation ran, produced a duty, and then refused the next step on purpose.

## The refusal, in the engine's own words

> the required vent capacity is withheld. Turning this duty into scfh of air equivalent needs the API 2000 air-equivalence relation, and this package does not carry it. The relation that used to be here divided by the square root of an absolute temperature beside a packaged field constant, which cannot both be right, and the two plausible forms of it differ by a factor of about 24. An emergency vent sized 24 times too small is how a tank is destroyed, so no figure is offered here. Size the vent from API 2000 against the heat input above, or from the vent manufacturer's certified capacity curve

Read that message as four moves. It names the relation it needs, says the package does not carry it, says what is wrong with the candidate it will not use, and tells the reader where to get the answer instead.

## Why a null with a reason beats a number

The argument turns on the size of the disagreement. Two forms of a relation that differ in the last few percent are a tolerance question, and a package can pick one and say which. Two that differ by a factor of about 24 are a different thing, because picking one means being wrong by that factor whenever the other form is right, on a device whose job is to stop a tank being destroyed in a fire.

A number in that situation is worse than no number, because a number gets used. It goes into a datasheet and gets quoted to a vendor, and every reviewer downstream assumes a figure in a result field came from somewhere. A refusal cannot be used by accident.

## The sentence is a named export

The engine exports that sentence as a named constant, so a screen cannot print a blank where the vent should be. The exported constant and the returned reason are the same string, so a user interface showing the reason and the engine returning it cannot drift apart.

That matters because of how the alternatives read. A blank looks like a tool that broke. A zero looks like a vent of no capacity. A dash looks like a field nobody filled in. Only the sentence reads as a deliberate refusal with a route attached to it.

## What is and is not graded

Nothing in this course grades a required emergency vent capacity in any tier. An exercise asking for one would be asking a learner to invent it.

## Exercise

Read the withholding message in digest SECTION 28 and list the two routes it gives for getting a vent capacity. Then say which returned figure from the same result each of those routes would start from.
