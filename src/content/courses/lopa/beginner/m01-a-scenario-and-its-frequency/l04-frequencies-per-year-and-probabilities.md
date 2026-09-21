# Frequencies per year and probabilities

{{panel:lp-worksheet}}

Two kinds of number sit on a LOPA row and mixing them up is the commonest way to produce a worksheet that computes cleanly and means nothing. Frequencies are counts per year and may exceed one. Probabilities are dimensionless fractions above zero and no more than one. The engine holds each field to the kind it belongs to, and names the field when a number arrives in the wrong kind.

## The units the engine takes

| quantity | unit | allowed range, from the engine |
| --- | --- | --- |
| initiating event frequency, IEF | per year | above 0 |
| enabling condition, conditional modifier | probability | above 0 and no more than 1 |
| IPL PFD | probability | above 0 and no more than 1 |
| TMEL | per year | above 0 |
| proposed SIF PFDavg | probability | above 0 and no more than 1 |

The engine's units line says it in one line, verbatim: "frequencies per year; probabilities and PFDs dimensionless".

Only two fields on the determination row are frequencies: the initiating event frequency and the tolerable mitigated event likelihood. Everything else is a probability. That is why an IEF of 2.5 per year is accepted and the same 2.5 typed as an enabling condition is refused.

## Why zero is refused on both sides

No probability field accepts zero. An enabling condition of zero says the scenario cannot happen, which is not a scenario worth a row. An IPL PFD of zero claims a layer that never fails on demand, and no layer is that. A frequency of zero says the initiating event never occurs, and a tolerable frequency of zero says no occurrence is tolerable at any interval, which no SIF can be sized against. The engine refuses each of them by name, and module one lesson five reads those refusals in the engine's own words.

## The hour side of the house

The verification half of the engine works in hours. Failure rates arrive per hour and proof test intervals, restoration times and lifetimes arrive in hours, and what comes back is a PFDavg, which is a probability. `HOURS_PER_YEAR` is 8760, so a proof test interval of one year is 8760 hours, and a longest interval returned in hours is also reported in years by dividing by 8760.

Associate does not compute in that half. What matters here is that the two halves meet on one quantity and one only. The determination half produces a required PFDavg, a probability. The verification half produces an achieved PFDavg, also a probability. They are compared directly, with no unit conversion between them, and the year and the hour never meet inside a single product.

## Precision, and why it is printed so long

Frequencies per year, probabilities, IPL PFDs and PFDavg values are printed to twelve decimals in this course. Risk reduction factors, hours and years are printed to six. That is not decoration. A required PFDavg of 0.074074074074 and one of 0.007407407407 are a whole band apart, and a comparison that decides a band has to be made on the figure the engine actually returned.

## Exercise

Take ORONI's mitigated frequency without a SIF, 0.000013500000 per year, and its tolerable frequency of 0.000001000000 per year. Divide the first by the second and state the unit of the answer. Then take the reciprocal of that answer and state the unit of that. Write one sentence saying why only one of the two results can be compared with a proposed SIF's PFDavg.
