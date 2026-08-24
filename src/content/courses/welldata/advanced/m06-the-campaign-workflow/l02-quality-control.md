# Quality control

A campaign summary that is wrong looks exactly like one that is right. Both are a short page of whole numbers, and whole numbers carry an authority they have not earned. Somebody reads six counts off a panel, pastes them into a note, and the note becomes what the project believes about the delivery.

This lesson is the pass that stands between those two outcomes. Five checks, in the order the questions get asked, run on this delivery of six files.

## Check 1: does the curve total reconcile with the per-file counts

Start with the one aggregate that can be verified by arithmetic alone, because it sets the habit for the four that cannot.

The campaign reports 24 curves imported with the depth index excluded. The per-file rows say 4 curves for each of the six files. Six files at 4 curves each is 24, so the total reconciles.

Two failures live here. The first is a total that does not match the sum of the rows, which means the aggregation is broken and nothing else on the page can be trusted. The second is subtler: a total of 30 would be the depth index counted as a curve in every file, which is the classic overcount this course has flagged at all three tiers. The check is cheap. Add the column and compare.

Notice also what the reconciliation tells you. Every file contributes the same 4, so this reading has no exception in it. It describes the format of the delivery rather than any file in it, and a reading with no exception is worth recognising as such rather than staring at.

## Check 2: is every exception identified by file, not only counted

Three of the six readings are counts where exactly one file differs. Read each one and ask for the name.

One file needs a depth unit conversion, and it is `feet_20.las`, the only foreign-unit file in the set. One file has no uniform depth step, and it is `irregular_20.las`, which is why 5 of the 6 are uniform. One dead curve exists in the delivery, and it is in `nullheavy_20.las`.

A summary that reports the counts without the names has produced a number that no one can act on. Nobody schedules a morning against the sentence "one file needs conversion". They schedule it against "`feet_20.las` needs conversion", because that sentence names a file somebody can open. Treat a count without a name as an incomplete finding and go back to the per-file table for the name.

## Check 3: does every aggregate travel with its composition

This is the check that gives the tier its name, and it is the one most often skipped because the aggregate looks self-explanatory.

The delivery reports 272 flagged nulls in `nullheavy_20.las`. Broken out by curve, that is 71 in GR out of 201 samples, 0 in RHOB, 201 in NPHI out of 201 samples, and 0 in DT. The four add to 272.

Now read the two versions side by side. "272 flagged nulls" suggests a file with a widespread quality problem across its curves. The composition says something else entirely: two curves are complete, one curve is missing about a third of its readings, and one curve has no data at all. Those are different problems with different responses, and the single number shows neither.

So the check is procedural rather than analytical. For every aggregate on the page, can you produce the composition behind it without going back to the files? If not, the aggregate is not ready to be reported.

## Check 4: is a dead curve reported separately from scattered nulls

The previous check leads directly to this one, and it is where two of the six readings turn out not to be independent.

The dead curve count is 1 and the null count is 272, and the dead curve is 201 of that 272. Report them as two separate findings and a reader can reasonably add them into a picture of a file with a dead curve plus 272 scattered nulls elsewhere, which overstates the damage by 201.

The right report says it once and says it correctly: `nullheavy_20.las` carries 272 flagged nulls against a declared null of -9999, of which 201 are NPHI, a curve with no finite sample anywhere, and 71 are scattered nulls in a GR that does have data. The dead curve should probably not have been delivered at all. The 71 scattered nulls are a data quality matter inside a usable curve, and the person who computes shale volume from that GR needs to know about them.

## Check 5: is the wrapped file's sample count reconciled rather than trusted

Last, the reading that depends on a mechanism rather than on a count of things you can see.

`wrapped_12.las` reports 161 depth samples, and that number came out of a reshape: 805 numeric tokens in the data section divided by 5 declared curves gives 161 samples per curve. The reconciliation is that the same 161 follows independently from the header's depth frame, which was computed without looking at a single token.

The failure to look for here is a sample count that matches the physical line count of the data block. That block holds 483 lines, and 483 is what a reader built on one record per line would report. A campaign row showing 483 samples for this file has not made a rounding error. It has confused lines with samples, and every curve in the file is then misassembled.

Run all five checks against the panel below, which puts the campaign table, each aggregate and the per-curve composition behind it on one page.

{{panel:wd-campaign-explorer}}

## Exercise

Run the five checks on this delivery using the panel, writing one line for each that says what passed and where you read it. Then answer in two sentences: which check would catch a summary reporting 30 curves, and why can the dead curve count and the null count not be read as two independent findings?

As a self check: check 1 reconciles 6 files at 4 curves each against the reported 24; check 2 names `feet_20.las` for the conversion, `irregular_20.las` for the missing uniform step and `nullheavy_20.las` for the dead curve; check 3 breaks the 272 flagged nulls into 71 in GR, 0 in RHOB, 201 in NPHI and 0 in DT; check 4 separates the dead NPHI from the 71 scattered nulls in GR and records the file's declared null of -9999; and check 5 confirms 161 samples from 805 tokens over 5 curves and again from the header depth frame, against a data block of 483 lines. A reported total of 30 curves is caught by check 1, since it is 6 files at 5 curves each with the depth index wrongly counted. The dead curve count and the null count are not independent because the dead curve is 201 of the 272, so reporting them separately invites a reader to add damage that is being counted twice.
