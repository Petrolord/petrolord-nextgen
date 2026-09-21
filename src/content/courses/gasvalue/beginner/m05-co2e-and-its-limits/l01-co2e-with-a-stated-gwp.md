# CO2e with a stated GWP

Module four gave the flare two species, CO2 and methane. CO2e puts them on one scale, and it needs one more input the engine does not supply: the methane GWP.

{{panel:gasvalue-flare-explorer}}

## The rule for CO2e

CO2e is the CO2 plus the methane times the GWP. The GWP here is the methane global warming potential, and it multiplies the methane alone. The engine's basis sentence for the flare says of the rest: unburned ethane and heavier carry no GWP here.

## The GWP is an input

The methane GWP is an input with no default: the assessment report it comes from is the study's to choose, and this course does not choose it.

EGBEMA's study uses a methane GWP of 29.8. It is invented and illustrative, and it is the study's input.

The limits the course states for the flare model include this one: the methane GWP and any credit price are case inputs; the engine ships neither.

## EGBEMA at three GWPs

EGBEMA's flare at the study's GWP and at two others, for comparison only:

| GWP (input) | flareCo2eTonnes | methaneShareOfFlareCo2e |
| --- | --- | --- |
| 29.8 | 215946.438 | 0.1568 |
| 20 | 204808.832 | 0.1110 |
| 40 | 227538.640 | 0.1998 |

The table varies one input, the GWP, on EGBEMA's flare as module four read it: 182079.024 tonnes of CO2 and 1136.490 tonnes of methane a year. In the rule, the GWP sits on the methane term of the CO2e.

At the study's 29.8, EGBEMA's CO2e is 215946.438 tonnes a year. At 20 it is 204808.832, and at 40 it is 227538.640. The rows at 20 and 40 are there for comparison only. They are not offered as better or worse choices.

## A blank GWP

With the GWP left blank, the engine still reports the two species, and it does not form the CO2e:

| field | value |
| --- | --- |
| flareCo2Tonnes | 182079.024 |
| flareCh4Tonnes | 1136.490 |
| flareCo2eTonnes | null |
| methaneShareOfFlareCo2e | null |
| blockedBy | no methane global warming potential supplied |

The CO2 and the methane need no GWP, and they are reported as before. The CO2e and the methane share both read null. The engine names the missing input in blockedBy: no methane global warming potential supplied.

A blank GWP is not refused. The call answers, and the one figure that needs the GWP is left missing and named.

## Where GWP sets are taught

This course uses a methane GWP only as the case's stated input. GWP sets and their editions are taught in the Carbon & Energy Efficiency course, `carbon`.

## Reading it in the explorer

The flare explorer takes the GWP as an input with no default, and it starts blank. Set up EGBEMA's flare with both efficiencies and leave the GWP blank: read the CO2, the methane and the blocked CO2e. Then type 29.8 and read the CO2e and the methane share against the table above.

## Exercise

Read the GWP table and the blank row: 215946.438 at 29.8, 204808.832 at 20, 227538.640 at 40, and null with the GWP blank. Say what CO2e is made of, which of its terms the GWP multiplies, what the engine reports when the GWP is blank, and what the rows at 20 and 40 are for.

Self check: CO2e is the CO2 plus the methane times the GWP, so the GWP multiplies the methane. With the GWP blank, the engine reports the CO2 and the methane, leaves the CO2e and the methane share null, and names the missing input: no methane global warming potential supplied. The rows at 20 and 40 are for comparison only.
