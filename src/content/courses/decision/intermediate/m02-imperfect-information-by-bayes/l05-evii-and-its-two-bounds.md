# EVII and its two bounds

The expected value of imperfect information is the value of deciding after the survey less the value of deciding without it. For the EKPAN CSEM survey it is 24.8250 million USD, and it sits between 0 and the EVPI of 52.0000.

{{panel:ec-information-explorer}}

## Rolling it back

evWithInfo weights the best value after each reading by the chance of that reading:

0.460000 x 207.7989 + 0.540000 x 9.2361 = 100.5750

EVII is evWithInfo less emvPrior: 100.5750 less 75.7500 is 24.8250.

| quantity | value |
| --- | --- |
| emvPrior | 75.7500 |
| evWithInfo | 100.5750 |
| evii | 24.8250 |
| evWithPerfect | 127.7500 |
| evpi | 52.0000 |

## The lower bound

EVII cannot be negative. A company holding the survey can always ignore it and take the prior action, so deciding after the reading can never be worth less than deciding before it. The engine derives its posteriors from the prior and the likelihoods, so its inputs cannot be probabilistically inconsistent and its EVII cannot fall below 0. The bound is reached when no reading changes the action: the published uselessSignal case keeps its posteriors at 0.300000 and 0.700000 after both readings and returns evii 0.0000.

A negative value of information therefore means broken inputs. Before the repair the VOI Analyzer printed a gross value of -15.00 for typed indicator numbers that contradicted the stated outcome chances. The repaired Analyzer withholds that value.

## The upper bound

EVII cannot exceed EVPI: a survey that sometimes misreads cannot beat one that never does. EKPAN's survey recovers 24.8250 of the 52.0000. The published perfectSignal case reaches the bound. Its readings leave posteriors of 1.000000 and 0.000000, its evWithInfo is 78.0000, the published prospect's evWithPerfect, and its evii of 35.0000 equals that prospect's EVPI of 35.0000.

## Published cases

| case | evWithInfo | evii |
| --- | --- | --- |
| seismicBayes | 55.5000 | 12.5000 |
| uselessSignal | 43.0000 | 0.0000 |
| perfectSignal | 78.0000 | 35.0000 |

evWithInfo less evii is 43.0000 in every row, the value of that prospect without information, so the three cases are one decision with three surveys: worthless, partial and perfect.

## Gross, and nothing else

EVII charges nothing for the survey. At a survey cost of 8.0000 the net value is 16.8250. The gross 24.8250 is the highest price at which buying the survey still leaves the decision no worse off than going without it. EVII is risk neutral, undiscounted and single stage: one survey, read once, then one action.

## The mistake

Quoting evWithInfo, 100.5750, as the survey's value credits the survey with the 75.7500 the prospect is worth without it. A subtler error divides 24.8250 by 52.0000 and calls the ratio the survey's accuracy. It is a ratio of values, and it moves with the prior and the payoffs while the likelihoods 0.850000 and 0.250000 stay put. The accuracy of a survey lives in its likelihoods, and the value of that accuracy lives in what it changes on this decision.

## Exercise

Roll back evWithInfo for EKPAN from the signal chances and the best value after each reading, then write EVII. State both bounds with their numbers, and use uselessSignal and perfectSignal to show a case sitting on each bound.
