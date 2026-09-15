# A clamp is not an answer

A search that stops at its own boundary has not found a rate. Before this course's repair the engine reported the boundary as the result, which put 1000 percent on the card for a project whose value is negative at every rate the search could reach.

{{panel:ec-value-explorer}}

## The case that produced it

The EGINA concept priced at 18.0000 USD a barrel is worth -1797.2732 million USD, its status is `no-root`, and its payback is never. The flow does change sign, because year 0 spends 2250.0000 and later years earn, so a naive search is entitled to start looking. It simply never finds a crossing: no discount rate between -99 and 1000 percent makes that NPV zero, because the NPV is negative across the whole band.

The old behaviour ran to the end of the band and returned where it stopped. 1000 percent is not a property of the cash flow. It is a property of the search.

## Why nobody caught it

The number was plausible in the worst way. It cleared every screening threshold anyone would set, so it was coloured green on the card, and a reader scanning a portfolio saw a strong return on a case that never returns its money. Green on a case worth -1797.2732 million USD is the exact opposite of the reading the arithmetic supports, and the failure is silent: nothing about 1000 percent announces that it came from the boundary rather than from a solution.

## The repaired behaviour

The engine now reports a rate only when it has verified a root inside the band, and otherwise reports null with a status that names the reason.

| status | what it means |
| --- | --- |
| ok | a root was found inside the band |
| no-sign-change | the flow never changes sign, so no root exists |
| above-clamp | a root exists above the band the search covers |
| multiple-roots | the flow changes sign more than once |
| no-root | the flow changes sign and no rate inside the band zeroes it |

At 18.0000 USD a barrel the status is `no-root`. The published tax floor case is the same shape: NPV -944.3201, status `no-root`.

## Round numbers deserve suspicion

The tell is that the reported rate was exactly the boundary. A solver that lands precisely on the limit of its own search range has almost certainly returned a return code rather than a solution. The engine's genuine answers do not look like that: 29.5998 percent on the Base case, 40.4321 percent on the tie-back, 14.4152 percent on the low price case, and -36.6747 percent on the published case that never pays back. That last one is worth holding beside 1000 percent, because it shows the repaired engine reporting an ugly verified root rather than hiding it.

## The mistake

The mistake is trusting a rate without checking the sign of the value it came with. An IRR of 1000 percent beside an NPV of -1797.2732 million USD is a contradiction on the face of the card, and the two numbers were printed next to each other the whole time. Read the NPV first, then the status, then the rate.

## Exercise

State the NPV, rate and status the EGINA concept reports at 18.0000 USD a barrel, and say what the engine reported there before the repair. Then name all five statuses and give, for each, one sentence on what it tells a reader about the shape of the cash flow.
