# The tolerable mitigated event likelihood

{{panel:lp-worksheet}}

The tolerable mitigated event likelihood is the frequency the organisation will tolerate for this consequence. It is the second and last frequency on the row, per year, and it is the only place where the seriousness of the consequence enters the arithmetic. ORONI's tolerable frequency is 1e-6 per year, which the engine prints as 0.000001000000.

## It is an input and the engine does not choose it

The engine holds no criteria, no matrix and no corporate risk standard. It takes the number, checks that it is a frequency above zero, and uses it. Where the number comes from is a matter for the organisation, and it is usually written into a risk criteria document that sets a tolerable frequency for each described consequence.

Without it the engine computes nothing at all and names the field:

> tmelPerYr: the tolerable mitigated event likelihood must be a frequency above 0 per year

There is no default, and that is deliberate. A default tolerable frequency would let a row produce a SIL band that looks authoritative and rests on a criterion nobody in the organisation ever adopted.

## The consequence is carried in words and by this number

The word the academy's risk courses use for a consequence category has no place here. A LOPA row describes its consequence in words, a fatality in the separator area or a release reaching the jetty, and carries it into the arithmetic through the tolerable frequency attached to it. Two rows with the same frequency and different consequences are separated by nothing else.

## Each step of ten in the tolerance is a step of ten in the demand

The mitigated frequency does not move when the tolerable frequency does. Only the tolerance moves, and the required reduction moves with it.

| TMEL per year, stated | required RRF | outcome | required SIL | required PFDavg |
| --- | --- | --- | --- | --- |
| 1e-4 | 0.135000 | NO_SIF_REQUIRED | none | null |
| 1e-5 | 1.350000 | RISK_REDUCTION_BELOW_SIL1 | none | 0.740740740741 |
| 1e-6 | 13.500000 | SIL1 | 1 | 0.074074074074 |
| 1e-7 | 135.000000 | SIL2 | 2 | 0.007407407407 |
| 1e-8 | 1350.000000 | SIL3 | 3 | 0.000740740741 |
| 1e-9 | 13500.000000 | BEYOND_SIL3_REDESIGN | none | 0.000074074074 |
| 1e-10 | 135000.000000 | BEYOND_SIL3_REDESIGN | none | 0.000007407407 |

The same ORONI row, with the same 0.000013500000 per year mitigated frequency, needs no function at 1e-4 and is beyond the SIL table at 1e-9. Nothing about the plant changed across those rows. Only the number somebody wrote in the criteria document changed.

That is the strongest argument for treating the tolerable frequency as a decision made once, in the open, and applied to every row alike. Set row by row it becomes a dial for producing whichever SIL band the project would prefer to fund.

It also explains why the tolerable frequency is recorded on the worksheet beside the consequence it belongs to. A reader who sees 0.000001000000 per year with no description of what is being tolerated has no way to judge whether the figure is reasonable, and the required risk reduction factor of 13.500000 that follows from it inherits that gap. The consequence in words and the frequency in figures travel together or neither of them means anything.

## Exercise

ORONI's mitigated frequency is 0.000013500000 per year. Using the ladder above, state the tolerable frequency at which this row first demands a function at all, and the one at which it first demands a SIL 2 function. Then take the required risk reduction factor of 13.500000 at 1e-6 and show how the 135.000000 at 1e-7 follows from it.
