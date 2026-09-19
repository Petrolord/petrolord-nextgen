# The upper limit at zero

{{panel:ss-intervals-explorer}}

The ABO crew's 0 recordables in 41300 hours, at four confidence levels:

| confidence | count upper | rate upper per 200,000 | rate lower | minus ln of half the miss |
| --- | --- | --- | --- | --- |
| 0.800000 | 2.302585092994 | 11.150533 | 0.000000 | 2.302585092994 |
| 0.900000 | 2.995732273554 | 14.507178 | 0.000000 | 2.995732273554 |
| 0.950000 | 3.688879454114 | 17.863823 | 0.000000 | 3.688879454114 |
| 0.990000 | 5.298317366548 | 25.657711 | 0.000000 | 5.298317366548 |

The count upper column and the last column agree to every digit printed. That is the whole formula for the upper limit at zero.

## Where the formula comes from

The Garwood upper limit is the Poisson mean at which the observed count or fewer has probability alpha/2. At a count of zero, "zero or fewer" is just zero, and the probability of zero events at a mean mu is e to the minus mu. Setting that equal to half the miss and solving gives mu equal to minus the natural log of half the miss. The derived column is that expression, and the engine's count upper limit matches it at every confidence.

At 0.950000 half the miss is 2.5 percent, and the count upper limit is 3.688879454114. It is also the first row of the Garwood table, which reads 0.000000000000 and 3.688879454114 for a count of 0.

## Why the lower limit is zero

The lower limit asks for the mean at which zero or more events has probability alpha/2. Zero or more events has probability one at every mean, so no positive mean satisfies it, and the chi-square form has nothing left to solve: with 2N degrees of freedom and N of zero there are no degrees of freedom at all. The engine short-circuits that degenerate case and returns 0 for a zero count before any quantile is taken. The engine returns 0.000000 at every confidence.

## From the count to the rate

The count upper limit is multiplied by the base over the hours, exactly as any Garwood limit is. On the ABO crew that is 200,000 over 41300. At 0.950000 the result is 17.863823 per 200,000 hours. At 0.800000 it is 11.150533, and at 0.990000 it is 25.657711. The count limits do not know how many hours the crew worked. The rate limits do, and they shrink in exact proportion as the hours grow.

That proportion is what makes zero events easy to plan with. Double the hours and every rate upper limit in the table halves, because the count upper limit stays where it is. The last lesson of this module turns that into a question about how many hours a crew needs.

## What the confidence costs

Moving from 0.800000 to 0.990000 raises the ABO upper limit from 11.150533 to 25.657711 on the same zero. A report that quotes a zero with its upper limit must therefore quote the confidence too. Without it, a reader cannot tell a limit of 11.150533 from one of 25.657711, and both are true statements about the same crew.

## Exercise

Take the count upper limit at 0.900000, 2.995732273554, and multiply it by 200,000 over 41300. Confirm that you reproduce the rate upper limit of 14.507178. Then state what the rate upper limit at 0.900000 would become if the crew had worked twice the hours with no recordable, and explain why the count upper limit did not move.
