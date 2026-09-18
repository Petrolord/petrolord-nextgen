# A pin and a validation are different claims

There is a category of number in this module that looks validated and is not. Knowing which numbers those are, and what the test around them actually asserts, is one of the most transferable things this course teaches.

## What a pin is

Every number in this module that is a CHOICE rather than a derivation lives in one frozen `DECLARED_CONSTANTS`, and the engine reads each one from there rather than inlining it. The jest suite then PINS them, by literal, with an exact key-set match, so adding or removing one fails until the pin is updated.

That is a real and useful guarantee. It means moving one of these numbers is a REVIEWED act rather than a silent one, and it means a constant cannot quietly appear or disappear between releases.

It is not a validation. The module's own comment says pinning is all any gate can do with these, and the test says in as many words that a pin is not a validation. Nothing in this repository establishes that the plate pack efficiency factor of 0.7 is the right number. The pin establishes only that it is still 0.7.

## The oracle pins too

Here is the part that catches people. The independent oracle holds its OWN second copy of the declared constants. For those numbers it is a PIN rather than a validation, and both the code and the test say so.

Think about what that means. On the constants, the oracle and the engine are not two arguments. They are two copies. If the value is wrong, both are wrong together, and the agreement between them is worth nothing at all.

The planting battery measured exactly how much of the module is in that position. Six of the eight defects planted in the engine and the oracle together are caught by that pin and by nothing else. That is a statement about how much of this module a pin is carrying.

## Three claims, kept apart

A DERIVATION follows from something else stated on the page, so there is nothing to check.

A VALIDATION is an independent route arriving at the same answer, and it can fail.

A PIN is a record that a chosen value has not moved. It cannot fail for being wrong, only for having changed.

A reader who can sort every number in a model into those three has the most useful map of it there is, and the sorting is usually possible from the code alone.

## What to do with a pinned number

Quote it as a choice. Say who chose it and at what conditions it was chosen. Never present it as a published value, and never let an agreement between two files that both hold it be offered as evidence.

## Exercise

Pick three declared constants in this module and, for each, say what would have to exist in this repository for it to become a validation rather than a pin.

Then find a figure elsewhere in your own work that is pinned and is being reported as though it were validated.
