# A warning, which withholds nothing

The third way this module declines is the mildest and the easiest to misread. A warning is not a decline at all. The answer is reported in full AND the module says something about it.

{{panel:pw-train-explorer}}

## What a warning is

Every warning in this module names a quantity and a threshold. It does not remove a figure, it does not null a field, and it never changes what was returned. It sits beside the answer and tells you something the answer alone cannot.

That is a different act from a refusal, which returns no answer, and from a withheld verdict, which returns the answer and holds back the judgement. Three acts, three shapes on the return, and a reader who collapses them will mis-report the run.

## Reading one

The sigma warning is a good example. Take one device at one cut size on one water and move only the spread of the inlet distribution.

| sigma | removal at a 12 micron cut, percent | outlet median micron | warning |
| --- | --- | --- | --- |
| 0.5 | 84.480253 | 15.793311 | none |
| 0.7 | 80.243119 | 12.244813 | none |
| 0.8 | 78.263077 | 10.953502 | none |
| 1 | 74.748250 | 8.988225 | none |
| 1.5 | 68.402514 | 5.944722 | sigma outside the customary band |

The bottom row still carries a removal of 68.402514 percent and an outlet median of 5.944722 micron. Both numbers are the engine's real answer at that input. The warning says the input itself is outside the band produced water is customarily described in, and leaves you to decide whether your water is the exception.

## The verdict machinery, and a figure that is not a limit

The same shape appears where a specification is compared. Give the OGBOTOBO outlet of 160.391597 ppm a specification of 30 ppm and the module reports that it does not meet it, with a margin of -130.391597 ppm. Give it 60 ppm and it reports the same verdict with a margin of -100.391597 ppm.

NEITHER OF THOSE FIGURES IS A LIMIT. They are two arbitrary numbers, chosen only to show which branch of the comparison fires. This module states no discharge limit and neither does this course. Anyone quoting a figure from that block as a limit has quoted an example.

What the module DOES is compare, and report a margin, and withhold the comparison when there is nothing honest to compare against. That is the whole of its relationship with a specification.

## The habit

When you read a return, sort what you see into the three acts before you read any number. Is this an error string, a null verdict with a reason, or a full answer with a note beside it? Each calls for a different sentence in your report, and only one of them is a number you can quote.

## Exercise

In the panel, drive an input until a warning appears and confirm that every field the run reported before it is still populated.

Then take a warned run and write the sentence you would put in a report. Make sure it distinguishes what the engine computed from what the engine flagged.
