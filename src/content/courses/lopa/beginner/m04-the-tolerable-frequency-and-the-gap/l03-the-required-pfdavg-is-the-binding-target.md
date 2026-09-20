# The required PFDavg is the binding target

{{panel:lp-worksheet}}

The required SIF PFDavg is one over the required risk reduction factor. On ORONI at a tolerable frequency of 1e-6 per year the required risk reduction factor is 13.500000 and the required PFDavg is 0.074074074074, in the SIL1 band. Those two figures say the same thing in two units, and only one of them is the specification a function has to meet.

## What the engine says about the band

The engine's basis puts it in one line, verbatim: "the SIF must achieve requiredSifPfdAvg itself; the SIL band alone does not guarantee it".

A SIL is a band ten times wide. The SIL1 band runs from a PFDavg of 1e-2 up to 1e-1, so it holds functions that differ from each other by a factor of ten in how often they fail on demand. The required PFDavg is one number inside that band. A function anywhere in the band above that number misses the tolerable frequency while carrying the correct SIL on its datasheet.

## The demonstration, at a tolerable frequency of 1e-7

Take the same ORONI row against a tolerable frequency of 1e-7 per year. It requires SIL2 with a required PFDavg of 0.007407407407. Four functions are proposed, each stated as a PFDavg:

| proposed SIF PFDavg, stated | its own SIL band | mitigated frequency with the SIF, per year | meets the TMEL |
| --- | --- | --- | --- |
| 0.02 | 1 | 0.000000270000 | false |
| 0.009 | 2 | 0.000000121500 | false |
| 0.005 | 2 | 0.000000067500 | true |
| 0.0005 | 3 | 0.000000006750 | true |

The second row is the whole point. A function with a PFDavg of 0.009 sits inside the SIL2 band the row requires, and it misses, because 0.009 is above the required 0.007407407407. Its mitigated frequency comes out at 0.000000121500 per year against a tolerance of 1e-7. Everything about the paperwork is correct and the row is still not closed.

## Why the engine reports both figures

The engine returns the required risk reduction factor, the required SIL and the required PFDavg together, and it does not clip or round any of them to the band. The alternative would have been to report the band alone, which is shorter and is the form a specification often travels in. The engine does not take that route, because the band is a label and the number is the target, and only the number can be checked against a function's own PFDavg.

There is a second reason to keep the full figure. A band is a step function, so two rows that demand almost the same reduction can be labelled a band apart, and two rows a band apart in label can demand almost the same reduction. The required PFDavg of 0.074074074074 tells a designer exactly where inside the SIL1 band this row sits, and how much room a proposal has before it stops closing the gap. The label alone tells nobody that.

In practice, write both into the safety requirements specification. The band drives architecture, competence and management requirements in the standards. The required PFDavg drives the verification arithmetic that the next tier performs, and that arithmetic is where a function passes or fails.

## Exercise

At a tolerable frequency of 1e-7 per year the required PFDavg is 0.007407407407. Using the table above, work out by how much the proposed 0.009 function overshoots that target, then take the 0.005 function and say how much margin it holds. Write one sentence on which of the two you would put in a specification and what you would record beside it.
