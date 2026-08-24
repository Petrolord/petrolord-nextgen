# The top of the ladder

This is the last lesson of the Well Data Manager ladder. There is no tier above the Expert tier, so this lesson closes the app rather than pointing at the next rung. It is worth spending a few hundred words on what you can now do, what well data management can and cannot guarantee, and where these skills feed next.

## What three tiers have given you

**From the Associate tier, you can read a file's health.** You can walk a LAS file's section structure, read the header line grammar, and tell version 1.2 from version 2.0 and wrapped from unwrapped. You can read the declared null flag rather than assuming the common value, count what is missing per curve, and recognise a dead curve as a different finding from scattered nulls. You can compute statistics over finite samples only, treat every header entry as a claim to be verified, and run a fixed checklist in a fixed order on every file that arrives.

**From the Professional tier, you can bring a file into the project's units and vocabulary.** You can convert a depth column with the right factor, and you know that unit trouble lives curve by curve rather than file by file, so a sonic in US/F gets converted alongside the depth column while a gamma ray in GAPI does not. You can assign a kind to each curve from its mnemonic, keep the index curve out of the kind count, and test a depth step against the column rather than trusting the header's claim about it. And you record the provenance, so that a depth in metres that came from a file in feet is labelled as converted wherever it is quoted.

**From this tier, you can run a delivery as a campaign and report the exceptions.** On these six files that means 24 curves imported with the depth index excluded, 1 file needing a depth unit conversion, 1 dead curve, 5 files of 6 with a uniform depth step, 161 depth samples in the wrapped LAS 1.2 file, and 272 flagged nulls in `nullheavy_20.las`. You attach a file name to every exception. You break every aggregate into its composition, so 272 becomes 71 scattered nulls in GR and 201 samples of a dead NPHI. You reconcile what can be checked twice, so 6 files at 4 curves each confirms the 24, and 805 numeric tokens over 5 declared curves confirms the 161. And you know the mechanism behind that last number, which is a flatten-and-reshape with no wrap branch in it, along with the conditions under which the mechanism is sound.

That is a complete skill set for the discipline. There is no fourth move.

## What well data management can guarantee

It can guarantee that a file was read the way its own declarations say it should be read, and that the reading is arithmetically consistent with those declarations.

It can guarantee that what reached the registry is in the project's units, with the conversion recorded and reversible, so that nobody downstream has to guess whether a depth is native or derived.

It can guarantee that what is missing is counted rather than averaged away, that a curve with no data is named as such, and that a depth column with no uniform step is recorded as having none rather than filled in with a plausible number.

And at delivery scale it can guarantee that the exceptions in a batch were found by a method that does not degrade at the fifth file, along with a list of what can be published today and what is waiting on the sender.

Those are real guarantees, and every one of them is a statement about handling.

## What it cannot guarantee

It cannot guarantee that the numbers are true. A gamma ray curve that parses cleanly, converts correctly and carries no nulls can still be the output of a badly calibrated tool. Nothing in this course inspects the measurement, only the record of it.

It cannot guarantee that the file describes the well it names. Identity is checked against a header, and a header is a claim somebody typed.

It cannot recover a dead curve. Reporting NPHI as dead in `nullheavy_20.las` is the whole of what can be done with it here, and the fix is a redelivery rather than an interpolation.

It cannot catch damage that preserves the arithmetic it checks. Module 5 was explicit about that, and the defence sits in the cross-checks rather than in the parser.

And a campaign can only find the exceptions somebody thought to count. Six readings found three exceptions in this delivery. A seventh reading might have found a fourth.

## Where these skills feed next

Everything above this course consumes what you let through, and each consumer takes a different part of it.

Petrophysics takes the curves and their units, because a sonic in the wrong unit fed to a porosity transform returns an answer that is wrong and plausible at once, and because a shale volume computed across nulls is a number invented from absence.

Well correlation and mapping take the depth column. One well left in feet plants a false structural feature in every section drawn through it and every surface gridded from it.

Reservoir volumetrics takes the whole chain, since a resource number rests on surfaces that rest on picks that rest on logs that rest on the file you accepted this morning.

None of them re-checks. That is the point of doing it once, here, and writing down what was done.

## Exercise

Write a short handover note for a colleague taking over this delivery. Say what you can vouch for about the six files, what you cannot vouch for, and which two files need a call back to the sender with the reason for each. Then answer in one sentence: what would you need in order to turn the dead NPHI curve into usable data?

As a self check: you can vouch that each file was read according to its own declarations, that 24 curves arrived once the depth index is excluded, that `feet_20.las` was converted with its factor recorded, that 5 of the 6 files have a uniform depth step, and that the 161 depth samples in `wrapped_12.las` reconcile from both the token count and the header depth frame. You cannot vouch that any curve is well calibrated, that any file describes the well its header names, or that a corruption preserving the token arithmetic did not occur. The two files needing a call back are `nullheavy_20.las`, because NPHI is dead and 71 of the 201 GR samples are null, and `irregular_20.las`, because its depth column has no uniform step. Turning the dead NPHI into usable data requires a redelivery of that curve from the sender, since nothing in the file can be interpolated into data that was never recorded.
