# Why the index curve is not a kind

DEPT carries the kind depth. The importer assigns it, stores it, and will tell you about it. And the graded count of recognised kinds on feet_20 is 4 rather than 5, because DEPT is not counted.

That looks like an inconsistency until you see what the index curve is, at which point it stops looking like one. This lesson is about that difference.

## An index is the axis, not a reading

Every other curve in a LAS file is a sequence of readings. Each reading was produced by a sensor at a moment when the tool was at a place in the hole, and the reading is a claim about the rock there.

The depth column is not that. It is the statement of where each of those readings was taken. It is the coordinate against which everything else is sampled, and it is the reason the other columns mean anything at all. Strip the gamma ray out of a file and you still have a well log with four curves. Strip the depth column out and you have four unlabelled sequences of numbers with no way to place any of them.

That asymmetry is what the word index names. The index is the axis. The measurements live on it.

## The consequences show up everywhere

Once you see the index as the axis, several things about the import pipeline stop being arbitrary.

The index is the first curve. The LAS standard requires it, and the importer takes the first curve as the depth curve without looking at its mnemonic. That is why a file whose first column is not a depth is a broken file rather than an unusual one.

The index unit governs the file. When the importer decides that feet_20 is a foot-referenced file, it is reading the unit of the index. It is that unit that gets checked against the recognised depth units and that produces a hard refusal when it is unrecognised, because a file with an uninterpretable axis cannot be imported at all, whereas a file with one uninterpretable measurement can be imported with that measurement flagged.

The index kind is not guessed. The importer forces the kind of the first curve to depth rather than looking the mnemonic up. It does hold DEPT, DEPTH and MD in its table, but the first curve is depth whatever it is called, because its role is structural rather than a matter of what somebody typed in the curve section.

The index derives the shape of the well. The start depth, the stop depth and the step of the imported well are all computed from the index and from nothing else. Those three numbers describe the axis, and they are stored on every curve in the file, because every curve shares that axis.

## Why the count excludes it

Now the count. The question the graded number answers is how many measurements the importer recognised, and the index is not a measurement.

Counting it would make the number mean something less useful. Every well ever imported has exactly one index, so including it adds one to every count and tells you nothing you did not already know. It would also make the number harder to reason about, because a count that mixes the axis with the things sampled on it cannot be compared across files without first subtracting the constant.

Excluding it makes the number answer a real question: of the measurements in this file, how many did the platform understand. On feet_20 the file holds four measurements, the importer recognised all four, and the answer is 4.

The same convention runs through the rest of the platform. When the campaign work at the Expert tier counts curves across the teaching set, it counts them with the index excluded, for the same reason. Where you see a curve count in this platform, assume the index is not in it and check if it matters.

## Where the mistake comes from

The wrong answer here is 5, and it arrives by an honest route. The learner opens the file, counts the lines in the curve section, gets five, checks that every one of them came out of the pipeline with a kind, and concludes that five kinds were recognised.

Every step of that is true. Five curves are declared. All five carry a kind. The error is in the last move, which quietly changes the question from how many measurements were recognised into how many curves have a non-empty kind field.

The defence is to read the question as written and to notice that it says kinds recognised, not curves with kinds. The kind field on the index was not recognised in any meaningful sense; it was assigned by position. Nothing was inferred, nothing could have failed, and there is no sense in which the importer succeeded at a task when it labelled the first column depth.

That is the deeper reason the exclusion is right rather than merely conventional. The count measures how well the platform's vocabulary matched this file. The index contributes no information to that measurement, because it would be depth regardless of what the file said.

## Exercise

A LAS file declares four curves: MD in M, GR in GAPI, RHOB in G/C3 and a fourth curve called XPOR in V/V that appears in none of the importer's kind lists. Work out what the pipeline reports for the count of recognised kinds, and give your reasoning in terms of index and measurements. Then say what the count would be if the same file had been delivered with its curves in a different order, with GR first and MD second.

Self-check: the file holds one index, MD, and three measurements. The importer recognises GR as gr and RHOB as density. XPOR is in no list, so its kind is null and it is not recognised. The count is 2, out of three measurements, which is the sort of number the count exists to tell you. On the reordered file the importer would take the first curve as the index whatever it was called, so GR would be forced to the kind depth and treated as the axis. Its unit is GAPI, which is not a recognised depth unit, so the import is refused outright and no count is produced at all. The lesson is that the index is defined by position, so a file that puts something else first is broken rather than merely unusual.
