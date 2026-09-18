# Where the correlation stops

A correlation with an empirical parameter has a range it was fitted over and a range it is asked about. This one says when it has left the first, and it says something quieter and more interesting at the other end.

{{panel:fc-suction-explorer}}

## The far end, where it refuses to endorse itself

At 9000.000000 cSt the engine returns a corrected flow of 551.907863 gpm and a corrected head of 206.365549 ft, and it warns:

"B above 40 is outside the published correlation, so a corrected centrifugal curve cannot be used here: this service needs a positive-displacement pump or vendor viscous test data"

B on that row is 40.385733873. The warning names the parameter, names the threshold, and names the two things that would actually answer the question. It does not withhold the numbers, and a caller reading only the numbers gets a corrected curve for a service the method has just disclaimed.

## The near end, where nothing is corrected and B is still reported

At 1.000000 cSt the engine reports B = 0.425703013, with a note:

"at water viscosity there is nothing to correct"

At 5.000000 cSt it reports B = 0.951900876, with a different note:

"B at or below 1: no correction applies"

Two branches, two notes, two reasons. The first is about the fluid being water. The second is about the correlating parameter being small enough that the method leaves the curve alone.

## B is real at water viscosity

It would be easy to assume B is zero or undefined where no correction is applied. It is neither. At 1.000000 cSt B is 0.425703013, and at 1.000001 cSt, a millionth higher, it is 0.425703226, a difference of 2.1285145351823687e-7.

B is what says how far from water the fluid is, and the decision not to correct is a separate statement carried by the note. Confusing the two leads a reader to look for a discontinuity in B that is not there.

## The return shape is the same on every branch

The corrected flow and head are present on the water row, present on the row a millionth above it, and present on a corrected row. On the two no-correction branches they are the catalogue values themselves: at 1.000000 cSt the corrected flow is 1150.000000 gpm against a stated best efficiency flow of 1150.000000 gpm, a difference of 0 gpm.

"The catalogue values, unchanged" is an answer, and it is returned as one. A caller does not have to know which branch it landed on to read the fields, and it has to read the note to know why they say what they say.

## The mistake

The mistake is running a 9000.000000 cSt service through this and quoting 551.907863 gpm. The figure is what the arithmetic gives and the warning says the arithmetic does not apply.

The second is treating the absence of a correction as the absence of an answer. At 1.000000 cSt and at 5.000000 cSt the answer is the catalogue point, stated as a result with a note explaining itself.

## Exercise

Quote both no-correction notes with the viscosity and B that produce each. Then give B at 1.000000 cSt and at 1.000001 cSt with the difference between them, and say what the warning at 9000.000000 cSt names and what it still returns.
