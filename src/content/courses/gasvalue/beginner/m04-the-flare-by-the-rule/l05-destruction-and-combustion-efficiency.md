# Destruction and combustion efficiency

The rule behind this module uses two efficiencies, and they set two different species. This lesson reads them side by side.

{{panel:gasvalue-flare-explorer}}

## Two efficiencies, two species

The rule separates two efficiencies. The DESTRUCTION efficiency is the share of hydrocarbon destroyed and sets the methane. The COMBUSTION efficiency is the share oxidised to CO2 and sets the CO2.

A combustion efficiency cannot exceed the destruction efficiency. Asked about a combustion efficiency of 0.98 above a destruction efficiency of 0.97, the engine refuses:

REFUSED: A flare combustion efficiency must lie in (0, 1] and cannot exceed the destruction efficiency.

EGBEMA's flare study gives a destruction efficiency of 0.97 and a combustion efficiency of 0.955.

## When the combustion efficiency is left out

Left out, the destruction efficiency stands in for the combustion efficiency, and the engine says so:

| EGBEMA | combustion efficiency used | flareCo2Tonnes | flareCh4Tonnes | flareCo2eTonnes |
| --- | --- | --- | --- | --- |
| both efficiencies given | 0.955 | 182079.024 | 1136.490 | 215946.438 |
| combustion efficiency typed blank ('') | 0.97 | 184877.310 | 1136.490 | 218744.723 |
| combustion efficiency left out | 0.97 | 184877.310 | 1136.490 | 218744.723 |
| left out minus given | 0.0150 | 2798.286 | 0.000 | 2798.285 |

A combustion efficiency typed blank behaves as one left out: the same efficiency used, the same tonnes and the same note. The note the engine attaches to both rows reads: "No combustion efficiency was given, so the destruction efficiency stands in for it. 40 CFR 98.233(n) puts combustion 1.5 points below destruction, so the CO2 here is slightly high."

The stand-in moves the CO2 and leaves the methane where it was, because the methane is set by the destruction efficiency alone. The CO2 moves by 2798.286 tonnes a year. The methane difference reads 0.000.

The CO2e difference reads 2798.285, and the CO2 difference 2798.286. The course's rounding note explains the last digit: the engine reports each tonnage to three decimals before the difference is taken, so the CO2e difference and the CO2 difference can differ in the third decimal though the methane is the same.

## The destruction efficiency across a range

The engine was run on EGBEMA at five destruction efficiencies, with the combustion efficiency left out so it stands in each time:

| destruction efficiency (input) | flareCo2Tonnes | flareCh4Tonnes | flareCo2eTonnes | methaneShareOfFlareCo2e |
| --- | --- | --- | --- | --- |
| 0.9 | 171818.645 | 3788.301 | 284710.023 | 0.3965 |
| 0.95 | 181146.263 | 1894.151 | 237591.952 | 0.2376 |
| 0.97 | 184877.310 | 1136.490 | 218744.723 | 0.1548 |
| 0.99 | 188608.357 | 378.830 | 199897.495 | 0.0565 |
| 1 | 190473.881 | 0.000 | 190473.881 | 0.0000 |

In these rows the combustion efficiency used is the destruction efficiency, so one input sits in both halves of the rule: in the CO2 as the combustion efficiency, and in the methane through one less the destruction efficiency.

Read the last row. At a destruction efficiency of 1, flareCh4Tonnes is 0.000, and flareCo2eTonnes equals flareCo2Tonnes at 190473.881. The methane share reads 0.0000.

## Neither has a default

Both efficiencies are inputs. A destruction efficiency left blank is refused, and the engine's refusal gives its reason: "A flare destruction efficiency in (0, 1] is required. For a flare it is most of the answer and it is contested, so it is not assumed."

## Reading it in the explorer

In the flare explorer, set up EGBEMA's flare with both efficiencies and read the three tonnages. Leave the combustion efficiency out and read the note. Then step the destruction efficiency through the five values in the table and read the methane and the CO2 at each.

## Exercise

Read the stand-in table: combustion efficiency used 0.955 and 0.97, flareCo2Tonnes 182079.024 and 184877.310, flareCh4Tonnes 1136.490 in both rows, and the difference row, 0.0150, 2798.286 and 0.000. Say which efficiency sets which species, what stands in when the combustion efficiency is left out, and why the methane does not move.

Self check: the destruction efficiency sets the methane and the combustion efficiency sets the CO2. Left out, the combustion efficiency is replaced by the destruction efficiency, 0.97. The stand-in moves the CO2 by 2798.286 tonnes a year and leaves the methane where it was, because the methane is set by the destruction efficiency alone.
