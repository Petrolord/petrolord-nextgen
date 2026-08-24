# One file converts

The campaign runs all six teaching files through the same import pipeline and returns a field that reads: files needing depth unit conversion, 1. One number, drawn from six files, graded with a tolerance of zero like every other field in this capstone. This lesson is about why one is the answer that matters, and how you would reach it without opening a single file.

## The field counts files, not curves

The Professional tier worked a conversion curve by curve. You took feet_20 apart, established that its depth column was denominated in feet, worked the factor, and handled the sonic separately because a unit with a length in its denominator converts the other way round. That was one file examined closely.

The campaign asks a smaller question of a larger set. Of the six files delivered, how many needed a depth unit conversion at all. Here is that column, straight from the campaign table:

| file | converted |
|---|---|
| basic_20.las | no |
| feet_20.las | YES |
| irregular_20.las | no |
| nullheavy_20.las | no |
| quirks_20.las | no |
| wrapped_12.las | no |

Five no, one yes, so the graded count is 1 and the file is feet_20.las.

Note what the field does with that file. It adds one. More than one curve inside feet_20 was restated by the pipeline, and the campaign still adds one, because the question was how many files, not how many curves. A learner who reports a curve count has answered a question nobody asked, and with a tolerance of zero there is no partial credit for a right answer to the wrong question.

## One is the expensive answer

Three answers were possible here, and they are not equally comfortable.

Zero would mean the whole delivery already arrived in the project's units. Nothing to convert, nothing to record, and one residual worry: a campaign that reports zero exceptions on every field looks exactly like a campaign that is not checking. You cannot tell a clean batch from a broken test by reading the output, which is a thought this module returns to at the end.

Six would mean every file is foreign. That is more work than zero and less risk than you would think. One convention applies to everything, you make the conversion decision once, you check it once, and any file that came out in the wrong units stands out against five siblings that came out right. Uniformly foreign data is an inconvenience rather than a hazard.

One is the answer that costs you something. A mixed delivery sets an expectation with five files and breaks it with the sixth. A person who has opened five files in a row and found metres opens the sixth expecting metres. Depth numbers of similar magnitude do not announce which frame they are in, and a foot depth read as a metre depth produces a well that is deep enough to look plausible and wrong enough to ruin every tie. The exception is dangerous precisely because it is rare.

That is the general shape. The frequency of an error and the damage it does often run in opposite directions, and a campaign is worth running because it finds the rare one before the rare one finds you.

## Spotting it without opening the files

The unit is declared in the header, so this is a header scan rather than a data read. Three signals, in the order you should trust them.

The declared depth unit is the finding. A campaign reads the header of every file and puts the depth unit in one column, and you then read one column across six files instead of six files one at a time. The odd entry is visible at a glance, and it stays visible when the batch is sixty files rather than six.

The depth range is corroboration. The same interval of hole carries numerically larger start and stop values in feet than in metres, so a file whose depths sit well above its siblings deserves a second look. This only works when the wells are comparable, and two wells at genuinely different depths can produce the same pattern with nothing wrong. Use it to confirm a finding, never to make one.

The pipeline's converted flag is a verdict, not evidence. It tells you what the importer concluded. If a unit string is absent or unrecognised, a file can come through unconverted without anyone deciding that it should be left alone, and the campaign count then reads lower than the truth. So before you trust a count of 1, confirm that all six files declared a depth unit you recognise.

## Worked example

Take the campaign table one row at a time and treat each file as a yes or no.

basic_20.las, no. feet_20.las, yes, and it is the only foreign-unit file in the set. irregular_20.las, no. nullheavy_20.las, no. quirks_20.las, no. wrapped_12.las, no. Add the yes entries and the field is 1.

Now check the other half, which is the half people skip. For a count of 1 to be correct, five files must have declared a metric depth unit and been correctly left alone. The count is a statement about all six files, not about feet_20, and the five quiet ones carry as much of it as the loud one does. Confirming that a file needed no action is real work, and a campaign that only reports its exceptions gives you no way to do it. That is why the panel shows every file rather than the exceptions alone.

## Exercise

For each of the six files, write down the single header field you would read to decide whether it needs a depth unit conversion. Then state what the campaign field would report in two alternative deliveries: one where feet_20 had arrived in metres like the rest, and one where two of the six had arrived in feet. Finally, name one way a count of 1 could be wrong in each direction, too low and too high.

Self-check: the field to read is the declared depth unit for each file, in the header, which is where the unit lives and the only place it is stated. If feet_20 had arrived in metres the count would be 0, and if two files had arrived in feet it would be 2, because the field counts files and each qualifying file adds exactly one. The count reads too low when a file's unit string is missing or unrecognised, so no conversion is attempted and nobody records a decision, and it reads too high when an already metric file is converted because its unit was misread. In the real campaign the answer is 1, that file is feet_20.las, and it contributes 1 regardless of how many of its curves were restated on the way through.
