# A known accumulation

{{panel:prms-classification-calculator}}

The first fact the engine reads about any project is whether the petroleum has been found. A known accumulation is discovered; one that is only expected from the geology is undiscovered (PRMS 2.1.1.1). That single stated fact splits the framework in two, and it decides which questions the engine asks next.

## Discovered and undiscovered in the Ekene field

| discovery (stated) | Ekene projects | classes they reach (engine) |
| --- | --- | --- |
| discovered | EKN-1, EKN-2, EKN-3, EKN-4, EKN-5, EKN-8 | Reserves, Contingent Resources, Discovered Unrecoverable |
| undiscovered | EKN-6, EKN-7 | Prospective Resources |

Six Ekene projects sit on accumulations a well has found, and two sit on accumulations still to be drilled. The engine prints the first step of every classification in its reasons. For EKN-1 it reads:

> discovery: discovered: a known accumulation (PRMS 2.1.1.1)

## What changes once an accumulation is known

For a discovered accumulation with a recovery project, the engine runs the commerciality test: the criteria of PRMS 2.1.2.1, each stated true or false. Passing every one with established technology gives Reserves; falling short on any gives Contingent Resources. A discovered project carries a chance of development and no chance of geologic discovery, because the discovery has already happened.

For an undiscovered accumulation, the commerciality test does not apply, since nothing has yet been found to develop. The project is Prospective Resources and carries two stated chances, the chance of geologic discovery and the chance of development. The next lessons take each side in turn.

## The status is a stated fact

The engine does not decide whether a well found oil. It reads the stated discovery status and checks that it is one of the two it accepts. Anything else is refused:

> discovery must be one of "discovered", "undiscovered"; got "appraised"

An appraised accumulation is simply discovered, and the appraisal shows up in other facts, such as a development plan. Leaving the status out is refused as well, because there is no default. The engine also refuses facts that do not fit the status: a commerciality block stated for an undiscovered accumulation, or a chance of geologic discovery stated for a discovered one.

## Why a report names the status

Two projects can carry the same best estimate and mean very different things if one is discovered and the other is not. A reader needs the status to know which chances apply and which classes are open. So a report quotes each class with the facts behind it, and the discovery status is the first of them.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-4 Ekene North appraisal". Read the first reason line. Set the Discovery control to "a potential accumulation (undiscovered)" and read what the engine returns: which field does it name, and why does that fact not fit an undiscovered project? Restore "a known accumulation (discovered)". Then start from "EKN-7 Ekene Shallow lead", read its first reason line, and list the inputs in the box that EKN-4 has and EKN-7 lacks.
