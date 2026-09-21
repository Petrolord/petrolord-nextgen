# Six outcome states

{{panel:lp-worksheet}}

The engine answers a required risk reduction factor with a state, and there are six of them: NO_SIF_REQUIRED, RISK_REDUCTION_BELOW_SIL1, SIL1, SIL2, SIL3 and BEYOND_SIL3_REDESIGN. A state is a word the worksheet carries. Two of the six are outside the SIL table altogether, and those two are where the engine's design shows.

## The states across a ladder of demands

| required RRF, stated | outcome | required SIL | required PFDavg |
| --- | --- | --- | --- |
| 0.5 | NO_SIF_REQUIRED | none | null |
| 1 | NO_SIF_REQUIRED | none | null |
| 5 | RISK_REDUCTION_BELOW_SIL1 | none | 0.200000000000 |
| 50 | SIL1 | 1 | 0.020000000000 |
| 500 | SIL2 | 2 | 0.002000000000 |
| 5000 | SIL3 | 3 | 0.000200000000 |
| 50000 | BEYOND_SIL3_REDESIGN | none | 0.000020000000 |

A demand at or below one needs nothing: the layers already in place meet the tolerance. Between one and ten the row needs some reduction and less than a SIL 1 function provides by definition, and the engine says so by name. Above that the three SIL states carry a required SIL of 1, 2 or 3. Beyond a demand of 10000 the table has no band left to name.

## Some reduction, below a band

RISK_REDUCTION_BELOW_SIL1 is not a failure and it is not nothing. It means a gap exists and it is smaller than the lowest banded function covers. The engine returns the required PFDavg for it, so the gap can be closed with a figure attached: at a demand of 5 the required PFDavg is 0.200000000000, and at 10 it is 0.100000000000. That gap can be closed by a function or by another independent protection layer, and a layer is often the cheaper answer.

A worksheet that reports it should say which of those two routes was taken, because the two leave the plant in very different positions. A function added for a demand of 5 has to be specified, installed, proof tested and managed for its life, and a further independent protection layer credited at an IPL PFD of 0.1 carries the same obligations under a different name.

## Beyond SIL three is never clipped

The state BEYOND_SIL3_REDESIGN carries its required PFDavg intact. At a demand of 50000 the required PFDavg is 0.000020000000 and at 500000 it is 0.000002000000. The engine could have clipped such a row to the highest band it knows and reported SIL3, which would make every worksheet fit the table. It does not take that route, because a reader then cannot see how far beyond the table the row sits, and that distance is the whole message.

The process sector treats a demand of that size as a reason to redesign the process or add layers outside the safety instrumented system. The next module's second lesson reads the engine's own notes on those rows.

Reading the six states together, the pattern is that the engine never converts a demand into an approximation of itself. Where a band exists it names the band and returns the required PFDavg inside it. Where no band exists it says so in a word and still returns the required PFDavg. A reader of the worksheet always has the number and always knows what kind of answer it is.

## Exercise

Using the ladder above, take a required risk reduction factor of 5 and state its outcome and its required PFDavg. Then work out which state ORONI's 13.500000 falls in, and how many times larger the demand would have to be before the row left the SIL table entirely. Write one sentence on what you would do with a row reporting RISK_REDUCTION_BELOW_SIL1.
