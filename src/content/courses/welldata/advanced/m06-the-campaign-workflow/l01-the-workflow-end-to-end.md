# The workflow end to end

Five modules have taken the campaign apart a piece at a time. This lesson puts it back together in working order, and it starts one tier lower than you might expect, because the campaign is the third step of a three-step ladder and it inherits everything the first two steps produced.

## The ladder behind this tier

**The Associate tier read and quality-controlled one file.** It gave you the LAS format itself, so that a file becomes a set of named curves on a depth column rather than a wall of text. It gave you the null flag and the dead curve, so that missing data is counted rather than averaged into a result. It gave you the header as a set of claims to be verified, and a fixed checklist to run before letting a file out.

**The Professional tier imported one file into the project's units and vocabulary.** It converted the depth column and every curve carrying a length, assigned a kind to each curve, tested the step rather than trusting the header, and recorded the provenance so that somebody else could check the work.

**This tier runs the delivery as a campaign and reports the exceptions.** The pipeline is unchanged. What changes is that it runs over a set, that the output is aggregates rather than fields, and that the product handed to the project is a list of what differs from the rest.

Nothing new is tested at this tier. Everything new is in the reading.

## The campaign in order

**Step 1: treat the delivery as a set.** Six files arrived together from one sender, one field, one format. Write down what ought to be uniform across them before you look, because an expectation stated in advance is what turns a number into a finding.

**Step 2: run every file through the same pipeline.** Each file goes through the Professional tier's import path without modification, and each one yields the same row: curves excluding the depth index, whether anything in it converted, whether the depth column has a uniform step, how many dead curves it holds, how many flagged nulls it holds, and how many depth samples it carries.

**Step 3: read the totals.** Across this delivery that gives 24 curves imported with the depth index excluded, 1 file needing a depth unit conversion, 1 dead curve, 5 files of 6 with a uniform depth step, 161 depth samples in `wrapped_12.las`, and 272 flagged nulls in `nullheavy_20.las`.

**Step 4: find the exception and name the file.** Four of those readings are counts where one file differs from the rest, and a count without a name is only half a finding. The file needing conversion is `feet_20.las`, the only foreign-unit file in the set. The file without a uniform step is `irregular_20.las`, which is why 5 of 6 are uniform rather than all 6. The dead curve is in `nullheavy_20.las`. The curve total is the one reading with no exception at all, because every file contributes exactly 4 curves once the depth index is excluded, and 6 times 4 is 24.

**Step 5: decompose every aggregate.** A total is a summary of a composition, and the composition is where the actionable finding lives. The 272 flagged nulls in `nullheavy_20.las` break down as 71 in GR out of 201 samples, 0 in RHOB, 201 in NPHI out of 201 samples, and 0 in DT. So 201 of the 272 are one curve that is entirely absent, and only 71 are scattered nulls inside a curve that does have data. That file declares its null as -9999 rather than the more common value, which is a reminder that the flag is read rather than assumed.

**Step 6: reconcile what can be checked twice.** The curve total is 6 files at 4 curves each, so 24 is confirmed by multiplication rather than accepted from a tile. The 161 samples in the wrapped file follow from 805 numeric tokens divided by 5 declared curves, and the same 161 follows independently from the header's depth frame. A reading that two routes agree on is one you can report.

**Step 7: report.** The output is not a verdict on the delivery. It is a list of exceptions by file with a recommended action for each, every aggregate written beside its composition, and a statement of what can go into the registry today and what is waiting on the sender.

## What the campaign does not do

It does not decide. One dead curve is a finding, and whether that curve gets flagged, dropped or queried with the sender is a decision a person makes and writes down.

It does not replace opening the file. Once the campaign has pointed at `nullheavy_20.las`, you open `nullheavy_20.las`. The campaign chose the file rather than doing the work.

And it does not certify the files it says nothing about. Scattered nulls appear in every file in this delivery, from 6 in `feet_20.las` to 17 in `basic_20.las`, and none of those is an exception. A file with no flag beside it is a file where nothing crossed a threshold, which is not the same statement as a file that is right.

## Exercise

Write the seven steps in order and put beside each one the single thing it produces for this delivery. Then answer in two sentences: which step turns a count into something a project can act on, and why is step 6 worth doing when the panel has already displayed the numbers?

As a self check: step 1 states what should be uniform across a six-file delivery, step 2 produces one row per file from the unchanged import pipeline, step 3 produces the six aggregates of 24 curves, 1 converted file, 1 dead curve, 5 uniform files of 6, 161 samples in the wrapped file and 272 flagged nulls in `nullheavy_20.las`, step 4 attaches a file name to each exception, step 5 breaks the 272 into 71 scattered nulls in GR and 201 in a dead NPHI, step 6 reconciles 6 times 4 as 24 and 805 tokens over 5 curves as 161 samples, and step 7 reports the exceptions with their compositions and says what can be published. Step 4 is what turns a count into something actionable, because a project schedules work against a file name rather than against a number. Step 6 is worth doing because a displayed number carries no evidence of its own correctness, and a reading two independent routes agree on is one you can defend.
