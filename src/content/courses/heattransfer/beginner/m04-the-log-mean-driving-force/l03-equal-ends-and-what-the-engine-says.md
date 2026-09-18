# Equal ends, and what the engine says

Drive the two end differences to the same number and the log mean has a problem. Published case 3 in this course does exactly that: both ends are 280.000000 degF. The answer that comes back is a log mean of 280.000000 degF, with the equal-ends flag reported as yes. The engine says what happened instead of quietly working around it.

{{panel:fc-exchanger-explorer}}

## Zero over zero

The closed form divides the difference of the two ends by the natural logarithm of their ratio. Set the two ends equal and the numerator goes to zero. The denominator goes to zero too, because the ratio is one and the logarithm of one is zero. Zero over zero is not a number, and a computer asked for it returns whatever its arithmetic happens to produce.

The true answer is not in doubt. As the two ends approach each other the log mean approaches their common value, so at equal ends it is that value. The module handles the case directly rather than letting the division happen, and 280.000000 degF is the common value of the two ends.

## An exchanger with equal ends is a real machine

This is not a contrived input. In counter-current flow the two ends are equal exactly when the hot drop equals the cold rise, which happens when the two capacity rates are equal. So equal ends is a case an engineer will actually meet, which is why it deserves a flag rather than a guard.

## The flag on every answer

The equal-ends flag is not only there when it is true. Every log mean answer carries it, reading no on the studio case and on ORON in both pairings, and yes on published case 3. That means a caller never has to decide whether the two ends were close enough to worry about. The engine has already decided, and it publishes the decision.

## Why the golden matters here

Published case 3 also carries a golden figure of 280.000000 degF. That golden was written by the oracle, which integrates the driving force rather than evaluating the closed form.

The special case is precisely where those two routes could part company. A closed form needs a branch and an integration does not. Both of them landing on 280.000000 degF is two independent routes agreeing at the one point where the closed form had to do something different from the general case.

## What not to extrapolate

The figures here cover equal ends and the cases in the table. They do not say how close two ends must be before the answer is uncomfortable. This course prints what the engine was asked, and it was not asked for a sweep across nearly equal ends, so there is no tolerance to read off. Run that sweep yourself rather than inferring one.

## Exercise

Write out the closed form for a log mean and show, term by term, what each part becomes when the two ends are equal. Then say which of the answer's five keys tells you the engine took the special branch, and what its value is on each of the four cases named in this lesson.
