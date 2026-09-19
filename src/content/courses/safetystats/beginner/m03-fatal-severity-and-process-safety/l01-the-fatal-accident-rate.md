# The fatal accident rate

{{panel:ss-rates-explorer}}

In 2024 IOGP member companies reported 32 fatalities in 4158877000 hours worked. The engine turns that into a fatal accident rate of 0.769438 per 100,000,000 hours. IOGP published 0.77, and the golden case reproduces the engine's figure with a relative difference of 0. The year before, 27 fatalities in 3291382000 hours give 0.820324 against a published 0.82.

| case | fatalities | hours | engine FAR | published |
| --- | --- | --- | --- | --- |
| IOGP 2024 | 32 | 4158877000 | 0.769438 | 0.77 |
| IOGP 2023 | 27 | 3291382000 | 0.820324 | 0.82 |
| UGHELLI | 0 | 2318640 | 0.000000 | none |

The fatal accident rate, FAR, is the number of fatalities per 100,000,000 hours worked. In this course it is always an observed FAR: a count of deaths that happened, over hours that were worked. Another course in the academy will teach a predicted FAR from a risk assessment, which is a different number made a different way.

## A very large base for a very rare event

Fatalities are rare. The 2024 figure rests on 32 of them spread across more than four billion hours. On the OSHA base of 200,000 hours that rate would sit well under one hundredth, awkward to read and easy to misprint. A base of 100,000,000 hours turns it into a number near one, which a reader can hold and compare from year to year.

The engine's function for this rate is `fatalAccidentRate`, and it takes only two inputs: the fatalities and the exposure hours. It returns fatalities x 100,000,000 / exposureHours. The same count and hours put through the general `incidenceRate` function with a base of 100,000,000 give the same 0.769438.

## Fatalities and fatal incidents

A fatality count and a fatal incident count are different counts. In 2024 the 32 fatalities happened in 21 fatal incidents, because some incidents killed more than one person. The first count gives the FAR. The second, on the same hours and the same base, gives a fatal incident rate of 0.504944. Both are useful. The FAR measures how many people died; the fatal incident rate measures how often an event killed someone. A report should say which one it is printing.

## A zero on a small site

UGHELLI worked 2318640 hours with 0 fatalities, and its observed FAR is 0.000000. That figure is correct, and on its own it says little. A site working a few million hours a year would expect to see a fatality rarely even at a rate far above the industry figure, so a zero over one year is what most sites will see most of the time. How much a zero can rule out is a question the next tier answers. At this tier, the lesson is to report the zero with its hours, so that a reader can see how little exposure stands behind it.

## Exercise

Multiply the 2024 fatalities of 32 by 100,000,000 and divide by 4158877000 hours, and check you reach 0.769438. Then repeat with the 21 fatal incidents and compare with 0.504944. Finally, open the rates explorer, compute the 2023 figure from 27 fatalities and 3291382000 hours, and write one sentence comparing it with 2024 that names the base and both counts.
