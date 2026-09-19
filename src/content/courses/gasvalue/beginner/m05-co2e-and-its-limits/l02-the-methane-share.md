# The methane share

abatement reports one more figure beside the CO2e: methaneShareOfFlareCo2e, the methane share of the flare's CO2e. This lesson reads it across the inputs that move it.

{{panel:gasvalue-flare-explorer}}

## EGBEMA's share

On EGBEMA's flare, with both efficiencies given and the study's GWP of 29.8, the engine reports:

| EGBEMA flare | value |
| --- | --- |
| flareCo2Tonnes (t/yr) | 182079.024 |
| flareCh4Tonnes (t/yr) | 1136.490 |
| flareCo2eTonnes (t/yr) | 215946.438 |
| methaneShareOfFlareCo2e | 0.1568 |

CO2e is the CO2 plus the methane times the GWP. The two tables below run EGBEMA's flare across the GWP, which multiplies the methane in that sum, and across the destruction efficiency, which sets the methane, and read the share in every row.

## The share at three GWPs

The engine was run on EGBEMA at the study's GWP and at two others, for comparison only:

| GWP (input) | flareCo2eTonnes | methaneShareOfFlareCo2e |
| --- | --- | --- |
| 29.8 | 215946.438 | 0.1568 |
| 20 | 204808.832 | 0.1110 |
| 40 | 227538.640 | 0.1998 |

At 29.8 the share is 0.1568. At 20 it is 0.1110, and at 40 it is 0.1998. The GWP is the study's input with no default, and the rows at 20 and 40 are for comparison only.

## The share across the destruction efficiency

The engine was run on EGBEMA at five destruction efficiencies, with the combustion efficiency left out so it stands in each time:

| destruction efficiency (input) | flareCh4Tonnes | flareCo2eTonnes | methaneShareOfFlareCo2e |
| --- | --- | --- | --- |
| 0.9 | 3788.301 | 284710.023 | 0.3965 |
| 0.95 | 1894.151 | 237591.952 | 0.2376 |
| 0.97 | 1136.490 | 218744.723 | 0.1548 |
| 0.99 | 378.830 | 199897.495 | 0.0565 |
| 1 | 0.000 | 190473.881 | 0.0000 |

At 0.9 the share is 0.3965. At 1 it is 0.0000, and the methane in that row is 0.000.

## Two rows at 0.97

EGBEMA's flare at a destruction efficiency of 0.97 appears twice in this lesson, with two different shares.

With both efficiencies given, the combustion efficiency is 0.955 and the share is 0.1568.

With the combustion efficiency left out, the destruction efficiency stands in at 0.97. The methane is the same, 1136.490, because the methane is set by the destruction efficiency alone. The CO2 is 184877.310 against 182079.024 with both given, and the CO2e is 218744.723. The share reads 0.1548.

Read the two rows side by side. They share the methane, 1136.490. They differ in the combustion efficiency used, in the CO2 and in the CO2e, and the share reads 0.1568 in one and 0.1548 in the other. A share of EGBEMA's flare at 0.97 is therefore read together with the combustion efficiency it was computed on.

## A blank GWP blocks the share

With the GWP left blank, flareCo2eTonnes is null and methaneShareOfFlareCo2e is null too. The engine names the missing input in blockedBy: no methane global warming potential supplied. The CO2, 182079.024, and the methane, 1136.490, are still reported.

## Reading it in the explorer

Set up EGBEMA's flare in the explorer at 29.8 and read the share. Change the GWP to 20 and then 40. Then leave the combustion efficiency out and read the share at 0.97 again. Finally clear the GWP and read what the share shows.

## Exercise

Read the two shares at a destruction efficiency of 0.97: 0.1568 with both efficiencies given and 0.1548 with the combustion efficiency left out, each with flareCh4Tonnes 1136.490. Say what is the same in the two rows, what differs, and what the share reads when the GWP is blank.

Self check: the methane is the same in both, 1136.490, because the methane is set by the destruction efficiency alone. The CO2 differs, 182079.024 with combustion at 0.955 and 184877.310 with the stand-in, and so do the CO2e, 215946.438 and 218744.723, and the share, 0.1568 and 0.1548. With the GWP blank the share is null, blocked by no methane global warming potential supplied.
