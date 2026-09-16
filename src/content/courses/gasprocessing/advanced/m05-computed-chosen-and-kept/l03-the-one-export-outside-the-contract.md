# The contract read on one door

A contract is worth nothing unless it holds at every door. This module's error contract is read here on one door, from five directions, and the five establish that a caller never has to ask which door it stands at.

{{panel:fc-absorber-explorer}}

## Five calls into one function

The Kremser removal takes an absorption factor and a stage count and returns the fraction removed. Here it is asked four questions it cannot answer and one it can.

| call | absorption factor | stages | returns |
| --- | --- | --- | --- |
| kremserFractionRemoved | 0.000000 | 5.000000 | { error: "absorption factor must be a finite number above zero (got 0)" } |
| kremserFractionRemoved | -1.000000 | 5.000000 | { error: "absorption factor must be a finite number above zero (got -1)" } |
| kremserFractionRemoved | 2.000000 | 0.000000 | { error: "theoretical stages must be a finite number above zero (got 0)" } |
| kremserFractionRemoved | 2.000000 | -3.000000 | { error: "theoretical stages must be a finite number above zero (got -3)" } |
| kremserFractionRemoved | 1.600000 | 6.000000 | { fractionRemoved: 0.976783371 } |

## Read the last row against the four above it

The same call shape returns a fraction or a refusal. The caller tells them apart by asking for a property rather than by inspecting a type or catching an exception.

That is what the contract buys. A guard downstream cannot be written wrongly, because there is one way to write it. Read the error key; if it is there, report it; if it is absent, read the answer key. Those four lines work at every door in the module.

## Why one door can carry the reading

The contract is the doors. All nine exports called with an object of named arguments answer with an object, and every one that cannot answer puts a named string on an error key. So a reading at one door is a reading of the contract, provided the door was chosen for the variety of its faults.

It qualifies: it takes two arguments, and the four refusals cover both at two kinds of bad value each.

## The four exports that are not doors

Four exports take a single positional value and answer like the scalars they are. waterSatPsia and solutionLbPerFt3 hand back a bare number, and a bare NaN where they have none. amineOf hands back one row of the amine table, and a null; amineSolutionLbPerFt3 a bare number, and a null.

None is a defect, because each is consumed by a door and the door is where the no-answer gets its name. The saturation fit's NaN becomes the Magnus band refusal, the lookup's null becomes the unknown amine refusal, and either density's no-answer becomes the liquid density refusal at the contactor.

A helper read from a studio tab would be the real defect: a bare NaN passes an error check and surfaces far downstream as an empty field that looks exactly like a field nobody filled in. So the audit asks which exports are doors, which are helpers, and whether anything reads a helper where a door belonged.

## Reading it in the studio

The same reading is available from the app. Type an absorption factor of zero into the absorber tab and the studio has a named fault to render. Type one that works and it has a fraction. The interface never has to decide what a blank means, because no door hands it one.

Whenever you meet a new module, ask it a question it cannot answer and look at what comes back. A module that answers a bad question with a plausible number is telling you about its good answers too.

## Exercise

Record the five calls above with their arguments and their returns. Write the four lines of caller code the contract implies. Then name the four exports that are not doors, what each hands back with no answer, and the door that names each refusal.
