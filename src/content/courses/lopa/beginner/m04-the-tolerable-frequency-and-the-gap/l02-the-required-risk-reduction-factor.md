# The required risk reduction factor

{{panel:lp-worksheet}}

The required risk reduction factor is the mitigated frequency without a SIF divided by the tolerable frequency. It is a plain ratio of two frequencies per year, so it is dimensionless, and it says how many times over the remaining frequency has to be reduced before the row meets its tolerance. On ORONI it reads 13.500000.

## The division, in full

| quantity | engine key | value |
| --- | --- | --- |
| mitigated frequency without a SIF, per year | `mitigatedFrequencyWithoutSifPerYr` | 0.000013500000 |
| TMEL, per year | `tmelPerYr` | 0.000001000000 |
| required RRF, the first over the second | `requiredRrf` | 13.500000 |
| outcome | `outcome` | SIL1 |
| required SIL | `requiredSil` | 1 |

Both frequencies are per year, so the units cancel. The engine prints risk reduction factors to six decimals, and it is worth keeping the word straight: a required risk reduction factor comes from the analysis of the row, and an achieved risk reduction factor comes from the verification of a function. This tier produces the first kind only.

## What the number means on the plant

13.500000 says the layers already credited leave the consequence arriving thirteen and a half times more often than the organisation will tolerate. Something has to supply that factor. A safety instrumented function is the usual answer, and it is not the only one: another independent protection layer with a suitable IPL PFD closes the same gap, and so does a change to the process that removes the initiating event or the enabling condition altogether.

The engine expresses the gap as a ratio because a ratio is what a protective function is specified against. It does not recommend how to close it.

## A required factor at or below one

When the mitigated frequency already meets the tolerance the ratio comes out at or below one, and the outcome is NO_SIF_REQUIRED. The engine reports that state, because there is no such thing as a negative or a zero demand for risk reduction. The golden case f-equals-tmel sits exactly on this line with a required risk reduction factor of 1.000000 and the outcome NO_SIF_REQUIRED, and ipl-sufficient sits below it at 0.100000 with the same outcome.

## Read the ratio, then read what made it

Two rows can report the same 13.500000 for very different reasons. One may have a high initiating frequency and strong layers, another a low initiating frequency and almost no layers. The required factor is identical and the plants are not alike at all. That is why the engine returns the unmitigated frequency, both products and the credited and uncredited layers alongside the ratio, so the reviewer reads the chain and then the ratio.

The order matters in a review. A required risk reduction factor of 13.500000 arrived at from an unmitigated frequency of 0.013500000000 per year and a credited IPL product of 0.001000000000 is a row whose layers are already carrying three orders of magnitude. If one of those layers turns out to be unjustified the demand grows by a factor of one over its IPL PFD, and the band can move with it. Reading the ratio on its own hides all of that behind a single tidy number.

## Exercise

Using the mitigated frequency of 0.000013500000 per year and the tolerable frequency of 0.000001000000 per year, carry out the division and confirm 13.500000. Then work out the required risk reduction factor this row would report if one further layer with an IPL PFD of 0.1 were credited, and say whether a function would still be required.
