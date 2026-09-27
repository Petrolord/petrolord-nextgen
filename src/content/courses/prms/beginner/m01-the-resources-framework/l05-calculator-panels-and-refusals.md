# The calculator panels and the refusals

{{panel:prms-classification-calculator}}

This is an engine course, and there is no Suite app for it. The practicals run in the course's own calculator panels, which call the same engine the lessons quote. This tier uses the classification calculator; the later tiers add the reserves and aggregation calculators.

## The classification calculator

The calculator has two views. "The class, the sub-class and the chance of commerciality" is a thin route to the engine function `classify`, and "The categories of a set of estimates" is a route to `categorize`. Each view takes its inputs as JSON in a box. A start selector loads an Ekene project or a small teaching case. Above the box, a visible control shows every stated input, or "not stated", and writes your choice into the box. You can also paste a whole case file and pick one of its calls in the block selector, which is how the capstone is worked.

## What is graded

Every graded number in this course is a return value of the engine on fixed inputs. The same inputs give the same number on any machine, so there is exactly one right answer. The capstone of each tier runs its own synthetic field, which the lessons never print.

## When the engine refuses

A refusal returns no figures. Its message starts with the name of the input it refused and states the condition that failed, with the value given. A discovery status the engine does not accept is refused:

> discovery must be one of "discovered", "undiscovered"; got "appraised"

An input with no default is refused when it is missing. Set the Discovery control to "not stated" on EKN-1 and the engine answers:

> discovery must be one of "discovered", "undiscovered"; got nothing

A key the function does not read is refused wherever it sits, with the full list of keys it does read, so a misspelt fact is never dropped silently. At the top level:

> maturity is not an accepted key; the accepted keys at the top level are name, discovery, recoveryProject, subClass, commerciality, economicStatus, projectStatus, reservesStatus, chances, nigeria

And inside the commerciality block:

> commerciality.markets is not an accepted key; the accepted keys of commerciality are developmentPlan, financialAppropriations, timeFrame, market, facilities, approvals, firmIntention

Every function checks its accepted keys before it reads any input, so a box with an unknown key and a missing input is refused on the unknown key first.

## A refusal and a reason

A result with a reason is still a result. EKN-4 comes back as Contingent Resources with the criteria that hold it back; that list is a finding about the project. A refusal says the box itself cannot be read, and names the field to fix.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The class, the sub-class and the chance of commerciality", and start from "EKN-1 Ekene Main waterflood". Set the Discovery control to "not stated" and read the refusal, then restore "a known accumulation (discovered)". In the box, rename the key `market` inside `commerciality` to `markets`, run it and read the field the refusal names. Restore it. Finally add a top-level key `maturity` and set the Discovery control to "not stated" again, and check which of the two problems the engine names first.
