# What insulation cannot do

Insulation moves one number, the overall coefficient, and that coefficient is one of several things a flow assurance answer rests on.

{{panel:pd-thermal-explorer}}

## It cannot get out from under the rest of the stack

Aerogel at k 0.0120 gives a layer resistance exactly 7.50000000 times that of syntactic polypropylene foam at the same 2.0 in, because a layer resistance is inverse in conductivity. The two coefficients differ by 7.42733831. The films and the steel wall are still there and did not move.

Push thickness instead of material and the same wall appears. On a sweep of the published pipe, a 5.0000 in foam wall gets U to 0.3860878878 Btu/(hr ft2 degF) with the foam carrying 99.741999 percent of the stack: the only term left to improve is the one already being improved.

## It cannot draw the line it is judged against

Neither engine computes a hydrate boundary. The thermal module says in as many words that hydrate and wax boundaries are fluid properties, that they come from a lab or a compositional flash, and that the consumer supplies them. The inhibition module says it does not compute where the boundary is either.

So no amount of foam produces a verdict. It produces a temperature. Whether that temperature is safe is settled by a laboratory number somebody else measured, and every margin in this course is conditional on it.

## It cannot survive a mistyped id

`conductivity` returns n/a for an id outside the catalog, `aerogelBlanket` for one, and falls back to nothing. That is deliberate: carbon steel and aerogel differ by 2166.666667, so a fallback to the first catalog entry would return a layer resistance smaller by that factor, `ok` unchanged and nothing in the return to question.

## It cannot answer a question about the fluid

`overallU` never sees a rate, a temperature, a length or a clock. Whether the line arrives warm, and how long it has after a shutdown, are questions with other inputs, and a good U is part of both answers rather than either one.

The blunt version of the same point is the weight coat. Concrete at k 0.9000, 2.0 in of it on the published pipe, leaves U at 12.1285554677. Thick, heavy, and not insulation.

## The mistake

Reading a low U as a result. A coefficient of 0.7132000377 Btu/(hr ft2 degF) on the published buried build is a good number and says nothing on its own about whether anything is safe. It has to be carried into an arrival temperature, at a rate, over a length, and compared against a boundary the engine did not draw.

## Exercise

Set the foam to aerogel at k 0.0120 on the published pipe, record the layer resistance and U, and take each as a ratio against the syntactic polypropylene case.

Then name the two things you would still need before you could say the line is safe.
