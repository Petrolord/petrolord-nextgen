# Above the band

The search runs between -99 and 1000 percent. A cash flow whose root sits above 1000 percent has a rate, and the engine does not have it, so it reports the status `above-clamp` and no number.

{{panel:ec-value-explorer}}

## Two cases whose roots are real

| case | NPV | IRR | status | the root the band hides |
| --- | --- | --- | --- | --- |
| tiny capex, large single year | 133.3087 | none | above-clamp | 15389.6875 |
| three fat years on 20 capex | 1074.4692 | none | above-clamp | 2305.7875 |

Both roots are recorded in the goldens, so both are known quantities. Neither is reported by the engine, because neither is inside the band the engine searched, and reporting a root you did not find is how a screening card ends up carrying a number nobody can reproduce.

## Where a rate that large comes from

A rate of 15389.6875 percent is what arithmetic produces when a very small outlay is followed by a large single year. Spend almost nothing and receive a great deal, and the discount rate needed to shrink the receipt back down to the outlay is enormous. The value of the case is 133.3087, which is a modest number in money, and the rate is four figures of percent. That gap is the whole lesson: the rate divides out scale, and when the denominator is tiny, the ratio explodes while the money stays small.

The second case is the same shape with less extremity: three fat years on a capex of 20 gives 2305.7875 percent on an NPV of 1074.4692.

## Saying so is the repair

The engine as published reports `above-clamp` and leaves the rate null. That status is a precise statement: a root exists, it was not inside the band, and here is the reason you are seeing nothing. Contrast that with the two statuses that mean something else entirely. `no-sign-change` says no root exists. `no-root` says the flow changes sign and still no rate zeroes it inside the band. `above-clamp` is the one that says the answer is out there and out of reach.

## Why the band is bounded at all

A search has to stop somewhere. The bound at 1000 percent is a choice about the range of rates a screening tool expects to meet, and a real development case sits far inside it: every rate that zeroes an EGINA flow falls between -66.9344 and 43.8661 percent. Cases that clear 1000 percent are almost always cases whose capex is wrong, missing or entered in the wrong units, and the status is a prompt to go and look at the inputs.

## The mistake

The mistake is treating `above-clamp` as an equivalent of no return. A case reporting `above-clamp` on an NPV of 1074.4692 is not a marginal case, and filing it with the failures loses it. The other mistake is chasing the hidden root by widening the band until a number appears, then putting 15389.6875 percent on a management page, where it will be read as a real and repeatable expectation rather than as the artefact of a 20 unit capex that it is.

## Exercise

State the NPV, status and hidden root for both `above-clamp` cases. Then explain, in terms of what the rate divides out, how a case worth 133.3087 can carry a root of 15389.6875 percent, and say what you would check first in its inputs.
