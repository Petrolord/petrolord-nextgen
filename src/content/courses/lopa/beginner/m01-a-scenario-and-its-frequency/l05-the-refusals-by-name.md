# The refusals, each naming its field

{{panel:lp-worksheet}}

When an input cannot support a LOPA row, the engine returns an object with `error` and `field` and computes nothing. The `field` names the offending input, down to its position in a list, so a worksheet can point at the cell the analyst has to fix. A refusal carries no number, because a number would look like a result. Across the whole engine, 29 refusals are tabled across 7 functions. Eleven rows of that table belong to `lopaScenario`, the call behind the determination row you are learning here, and six of them are quoted below in the engine's own words.

## A frequency of zero, and a frequency missing

> initiatingEventFrequencyPerYr: must be a frequency above 0 per year

A row whose initiating event never happens has no consequence frequency to reduce. The field is the first thing the engine checks, before any product is formed.

> tmelPerYr: the tolerable mitigated event likelihood must be a frequency above 0 per year

The tolerable mitigated event likelihood is the second frequency on the row and there is no default for it. Without it the engine could form a mitigated frequency and would still have nothing to compare it with, so it declines the whole call.

## A probability of zero

> enablingConditions[0].probability: 'mode' must be a probability above 0 and no more than 1 (a probability of 0 means the scenario cannot happen, which is not a LOPA scenario)

The message names the list, the index and the entry's own name, and then says why zero is inadmissible. The same field refuses a probability above one. On the IPL side the wording changes to match what the number means there:

> ipls[0].pfd: 'relief' must have a PFD above 0 and no more than 1 (a PFD of 0 is a perfect layer, which none is)

## An IPL with no name, and one IPL named twice

> ipls[0].name: every IPL needs a name

A nameless layer cannot be defended in a review and cannot be checked for independence against the other layers on the row, so the engine requires the name before it will look at the figure.

> ipls[1].name: 'relief valve' appears twice: one credit per IPL

Names are compared with case ignored, so the same layer entered twice in different case is caught. The reason is arithmetic as much as bookkeeping: one piece of hardware credited twice would multiply the frequency by its IPL PFD twice, and the row would claim a reduction the plant does not have.

## Reading a refusal on a worksheet

| what to read first | why |
| --- | --- |
| `field` | it names the cell, with its list index |
| the quoted name inside the message | it identifies which entry, by the name you typed |
| the clause in brackets | it says why the value is inadmissible |

The engine never partially computes. Either a `basis` block comes back with the whole row, or one of these strings does, and nothing else.

## Exercise

ORONI's IPL list credits a layer with an IPL PFD of 0.01 and another with 0.1, giving a credited product of 0.001000000000. Work out what that product would become if the relief valve entry were duplicated and credited twice, and then say which of the five refusals above stops that happening. Write the field name the engine would return.
