# The worked example that disagrees

{{panel:hy-heat-stress}}

At 348.900000 W the NIOSH 2016-106 section 8.1 equation, checked for transcription only, gives a NIOSH heat REL of 27.458939 C. The same document's worked example prints 27.800000 C. The difference is 0.341061 C against a printed tolerance of 0.050000 C, which puts the printed value 6.821223 tolerances away. For the RAL the equation gives 24.047916 C, also the section 8.1 equation checked for transcription only, and the example prints 25.000000 C: 0.952084 C apart, 1.904167 tolerances away at a printed tolerance of 0.500000 C.

## Where the two numbers come from

NIOSH 2016-106 publishes the equations in section 8.1 and a worked example in section 1.1.3. The example states its work rate as 300 kcal/h, which is 348.9 W, and reads each limit off a figure. The golden records it verbatim:

> section 1.1.3 example reads 27.8 C off Figure 8-2 at 300 kcal/h (348.9 W); the section 8.1 equation gives 27.459

> section 1.1.3 example reads 25 C off Figure 8-1 at 348.9 W; the section 8.1 equation gives 24.048

Reading a value off a plotted curve is a legitimate way to use a figure. It carries the resolution of the plot and the reader's eye. The equation carries neither. So the document holds two routes to the same limit, and they land in different places.

| limit | equation at 348.900000 W, C (transcription only) | example prints, C | equation minus printed, C | printed tolerance, C | tolerances away |
| --- | --- | --- | --- | --- | --- |
| NIOSH heat REL | 27.458939 | 27.800000 | -0.341061 | 0.050000 | 6.821223 |
| RAL | 24.047916 | 25.000000 | -0.952084 | 0.500000 | 1.904167 |

## Both learners did what the document shows

A learner who opens section 1.1.3 and follows the figure gets 27.800000 C. A learner who opens section 8.1 and evaluates the equation gets 27.458939 C. Each followed the document. If a course graded one of those numbers, the other learner would be marked wrong for doing exactly what NIOSH printed. That is one of the two reasons no heat stress limit is graded in this course; the next lesson sets out both.

## Which one the engine follows

The engine evaluates the equation. What the digest prints is the test rather than a reason for it: the golden pins both example values as errata, cases the engine must stay OUTSIDE the printed tolerance of. An engine edited to agree with the figure's 27.800000 C would turn the suite red.

That pin tests the engine's behaviour. It leaves the constants where they were. The equation's own inputs, 56.7 and 11.5 for the NIOSH heat REL, 59.9 and 14.1 for the RAL, are still the NIOSH 2016-106 section 8.1 equation, checked for transcription only, and the worked example cannot rescue them, since it disagrees with the equation printed beside it.

## What a reader does with this

When a report quotes a NIOSH heat REL, it says whether the value came from the equation or from a figure, because the two routes disagree by more than the precision either would be quoted at. It also carries the status of the equation, and it treats a margin of a few tenths of a degree as inside the disagreement the document itself contains.

## Exercise

Take the NIOSH heat REL row and confirm that 27.458939 less 27.800000 gives the difference in the table, then divide its size by 0.050000 and confirm the tolerances away. Then write the two sentences a report would need if it quoted a NIOSH heat REL at 348.900000 W: one naming the route, one giving the status.
