# A message that prints zero

The one sentence in this module whose whole job is to say how far off the answer is rounds the answer to nothing.

{{panel:pd-fight-explorer}}

## The sentence, twice

Cap the teaching network AGBADA WEST at nine iterations and the engine says "The solve ran 9 iterations without meeting its tolerance. The worst nodal imbalance is 0.004 lb/d." The residual it is describing is 3.876838925407e-3 lb/d. Cap it at ten and the sentence reads "The worst nodal imbalance is 0.000 lb/d." on a residual of 3.214654498152e-8 lb/d.

## Why it is zero

The message formats the residual with `toFixed(3)`. Three decimal places is a reasonable format for a number of pounds a day and a useless one for a residual, because a residual worth printing is small by construction. `toPrecision(3)` would have printed 0.00388 and 3.21e-8. An exponential format would have printed 3.8768e-3 and 3.2147e-8. Neither changes a single arithmetic operation in the solve.

## What the reader concludes

Take the ten iteration sentence at face value and the worst node is in balance, which means the solve met its tolerance and `converged` came back false in error. That is the exact opposite of the truth: the solve did not meet its tolerance, `converged` is right, and the imbalance is real but too small for the format. A reader who trusts the number distrusts the flag, and the flag was the honest half.

## The format is wrong in exactly the wrong place

Cap the same network at one iteration and the sentence prints 7545.876 lb/d against a residual of 7.545876e+3 lb/d, which is faithful. The format tells the truth about answers so bad that nobody needed the digits, and lies about answers close enough that the digits were the only thing left to read. The failure message is most misleading precisely where a user is deciding whether to accept the result.

## What the sentence still does not say

It does not say the criterion it failed was a scaled target rather than the tolerance that was asked for. It does not say what the conservation gap is. At the ten iteration cap the answer carries a trunk of 12955.677151 lb/d and a manifold of 780.469728 psia, the same figures the converged solve returns, and `checkConservation` on it reports a gap of 345.000000 lb/d. The converged solve at eleven iterations reports a residual of 1.546141e-11 lb/d and carries the same 345 lb/d gap, 2.593852900 percent of what it says was produced. The message that prints zero and the message that prints nothing at all are describing the same hole.

## Exercise

Write the two sentences the engine prints at nine and at ten iterations, then write beside each the residual it was given. Say which of the two would mislead a careful reader further, and what one line of formatting would have to change to fix both.
