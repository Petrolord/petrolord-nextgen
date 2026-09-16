# The contract read on one export

A contract is worth nothing unless it holds at every door. This module's error contract is read on one export, from five directions, and what the five readings establish is that a caller never has to ask which door it is standing at.

{{panel:fc-absorber-explorer}}

## Five calls into one function

The Kremser removal takes an absorption factor and a stage count and returns the fraction the column removes. Here it is asked four questions it cannot answer and one it can.

| call | absorption factor | stages | returns |
| --- | --- | --- | --- |
| kremserFractionRemoved | 0.000000 | 5.000000 | { error: "absorption factor must be a finite number above zero (got 0)" } |
| kremserFractionRemoved | -1.000000 | 5.000000 | { error: "absorption factor must be a finite number above zero (got -1)" } |
| kremserFractionRemoved | 2.000000 | 0.000000 | { error: "theoretical stages must be a finite number above zero (got 0)" } |
| kremserFractionRemoved | 2.000000 | -3.000000 | { error: "theoretical stages must be a finite number above zero (got -3)" } |
| kremserFractionRemoved | 1.600000 | 6.000000 | { fractionRemoved: 0.976783371 } |

## Read the last row against the four above it

The same call shape returns a fraction or a refusal. The caller tells them apart by asking for a property rather than by inspecting a type, checking a sentinel or catching an exception.

That is what the contract buys. A guard downstream cannot be written wrongly, because there is only one way to write it. Read the error key; if it is there, report it; if it is absent, read the answer key. The same four lines work against every export in the module.

## Why one export can carry the reading

The contract is whole across the module. Every export answers with an object, and every one that cannot answer puts a named string on an error key. So a reading at one door is a reading of the contract, provided the door was chosen for the variety of its faults.

This one qualifies. It takes two arguments, and the four refusals cover both of them at two kinds of bad value each.

## What a bare number would cost

Suppose one export in a module returned a bare number and used a non-finite value to signal a fault. Every caller guarding on an error property would sail straight past it. The failure would surface far downstream as an empty field, and an empty field looks exactly like a field nobody filled in.

That is why uniformity matters more than the individual message. A contract with one exception is not a contract a caller can rely on, because relying on it means knowing the exception, and the point of a contract is not having to.

## Reading it in the studio

The same reading is available from the app rather than from a test. Type an absorption factor of zero into the absorber tab and the studio has a named fault to render. Type one that works and it has a fraction. The user interface never has to decide what a blank means, because the engine never hands it a blank.

That is worth doing whenever you meet a new module. Ask it a question it cannot answer and look at what comes back. A module that answers a bad question with a plausible number is telling you something about its good answers too.

## Exercise

Record the five calls above with their arguments and their returns. Write the four lines of caller code the contract implies. Then say what would have to be true of a module for a caller to need more than one way of checking a result, and what that would cost the caller.
