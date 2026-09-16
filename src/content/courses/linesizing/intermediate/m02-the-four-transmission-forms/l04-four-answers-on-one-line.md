# Four answers on one line

Four published forms, one pipe, identical inputs, and four different rates. The spread from the lowest to the highest on the SOKU trunk is 1.336801.

{{panel:fc-gasline-explorer}}

## The whole disagreement on one table

| form | rate scfd | against Weymouth |
| --- | --- | --- |
| weymouth | 66104956.1404 | 1.000000 |
| panhandleA | 86864172.0167 | 1.314034 |
| panhandleB | 88369202.2673 | 1.336801 |
| general | 73861363.0502 | 1.117335 |

Nothing has been changed between those rows. The same bore, the same 32.000000 miles, the same 850.000000 psia against 620.000000 psia, the same gravity, the same temperature, the same compressibility, the same efficiency of 1.000000. The disagreement is between the correlations themselves.

## The engine is not the source of the disagreement

Each of the four is published in this package with its own golden on five cases, so whether a form is being computed as published is a question answered form by form on that table rather than asserted here. The disagreement between the four on identical inputs is a separate question, and it is the one this table shows.

The two are worth keeping apart, because they look nothing alike once stated. An implementation problem is one form drifting away from its own golden. A method disagreement is every form sitting on its own golden and the four still returning different rates.

## The ordering on the cases in this package

| case | lowest | highest |
| --- | --- | --- |
| SOKU, 11.938000 in over 32.000000 miles | weymouth 66104956.1404 | panhandleB 88369202.2673 |
| 12.000000 in over 50.000000 miles | weymouth 70590220.5870 | panhandleB 94339255.3131 |
| 6.065000 in over 10.000000 miles | weymouth 24925322.1809 | panhandleB 37233929.7642 |
| 16.000000 in over 80.000000 miles | weymouth 39887572.7874 | panhandleB 49902446.8811 |

On every case in this package Weymouth is the lowest and Panhandle B the highest, with General Flow above Weymouth and both Panhandles above that. It is worth stating what that is and what it is not. It is an observation about five lines. It is not a rule, and the diameter table in the next lesson shows the two Panhandles changing places on a bore none of these cases uses.

## What identical inputs means here

It is worth being precise about how little was allowed to vary. The four rows came from the same call with the same eight conditions, and only the name of the form changed between them. No efficiency was tuned, no roughness was supplied to one and withheld from another, and no pressure was re-based. Whatever separates 66104956.1404 scfd from 88369202.2673 scfd is inside the correlations and nowhere else.

## Choosing is engineering

A spread of 1.336801 across the answers is wider than many of the decisions a designer is actually weighing, which makes the choice of form a larger decision than the choice of bore. It is settled by what the line resembles, what the operator has calibrated against its own metering, and what a contract names, rather than by anything on this table. It is also a choice that should be recorded rather than defaulted, because a later reader cannot recover it from the rate alone.

## The spread is the thing to report

A designer who hands over a single rate has made the choice silently. Handing over the rate together with the form that produced it, and the spread of 1.336801 across the four, lets the next reader see how much of the answer is the pipe and how much is the correlation.

## The mistake

The mistake is running all four and reporting the average. An average of four correlations is a fifth number with no publication behind it and no case it was fitted to.

The second mistake is picking the form that gives the answer the project wants and saying nothing about it.

## Exercise

Write the four rates and each against Weymouth, and give the spread from lowest to highest. Say what the golden agreement on all four forms proves and what it does not. Then explain why averaging the four is not a way of choosing between them.
