# No change of sign

A rate of return exists only where the cash flow changes sign. A flow that is negative every year, or positive every year, has nothing to solve for, and the engine reports the status `no-sign-change` with no rate at all.

{{panel:ec-value-explorer}}

## Why the sign matters

The rate is the discount rate that drives the NPV to zero. Discounting shrinks every year by the same factor, and a flow whose years all point the same way keeps that sign at every rate the search visits. There is no crossing to find. Raising the rate on a flow that only spends makes the loss smaller and never reaches zero; raising it on a flow that only earns makes the gain smaller and never reaches zero either.

## Five published cases, one status

| case | NPV | IRR | status |
| --- | --- | --- | --- |
| a case that only spends | -524.1537 | none | no-sign-change |
| zero capex, all positive | 717.9604 | none | no-sign-change |
| opex above revenue every year | -8228.8301 | none | no-sign-change |
| royalty 100 percent | -1464.8989 | none | no-sign-change |
| zero production every year | -979.6325 | 0 by convention | no-sign-change |

Four of these lose money and one makes it, and only the last carries a rate at all, which is a convention rather than a solved root. The case with zero capex is worth 717.9604 and has no internal rate of return whatsoever, which is not a criticism of the case. It is a project that never asked for money up front, so there is no investment for a return to be a return on.

## The status is the finding

`no-sign-change` is the most informative of the five statuses, because it tells you something structural about the cash flow before you look at any of its values. A flow that only spends is a cost, not an investment. A flow that only earns has had its capex omitted, or genuinely has none, and either way the reader now knows to check. The opex case at -8228.8301 is negative in every producing year, which means the operating cost exceeds the revenue the barrels bring in, and that is a screening result worth acting on.

The zero production case carries one extra convention: its rate is recorded as 0 and its payback as the project life. That convention belongs to that published case, and a 0 there is the answer to a flow with no revenue rather than a measured rate.

## What to read instead

The NPV is defined for all five. It is defined for every cash flow, at every discount rate, whether or not a root exists, and it is stated in money rather than in percent. On the case with royalty at 100 percent the NPV of -1464.8989 is the whole story: the state took the gross revenue and the contractor carried the costs.

## The mistake

The mistake is reading a missing rate as a broken calculation and going looking for a workaround, most often by nudging an input until a rate appears. A rate coaxed out of a modified flow is a rate on the modified flow. The other mistake is treating the two directions as one: an all negative flow and an all positive flow share a status and share nothing else.

## Exercise

Name the five published cases that report `no-sign-change` and give the NPV of each. Then explain why the case worth 717.9604 has no rate, and say which single number you would put on a screening card in place of the rate for all five.
