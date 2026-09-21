# AR5 and AR6

{{panel:carbon-inventory-explorer}}

## Two assessment reports

The four sets the course types in come from two IPCC assessment reports, AR5 and AR6. The AR5 values are adapted from IPCC AR5 WG1 chapter 8, and the AR6 values from IPCC AR6 WG1 chapter 7 (section 7.6.1.1). All four are the 100-year horizon, GWP100, as tabulated in GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024.

| set | report | CH4 | N2O |
| --- | --- | --- | --- |
| IPCC AR6 GWP100, fossil methane | AR6 | 29.8 | 273 |
| IPCC AR6 GWP100, non-fossil methane | AR6 | 27 | 273 |
| IPCC AR5 GWP100, fossil methane | AR5 | 30 | 265 |
| IPCC AR5 GWP100, non-fossil methane | AR5 | 28 | 265 |

Read the table by report. Each report gives methane two values, one fossil and one non-fossil: AR6 gives 29.8 and 27, and AR5 gives 30 and 28. Each report gives nitrous oxide one value: 273 on AR6 and 265 on AR5. Every figure here is a published IPCC value as tabulated by GHG Protocol. None of them is invented for the course.

## Same gas, same horizon, different report

The two fossil sets hold the same gas on the same horizon and differ only in the report. On AR6 fossil methane is 29.8, and on AR5 it is 30. The engine's note explains what that does to comparison, verbatim: "Global warming potentials differ between IPCC assessment reports. An inventory on one report is not comparable with one on another, so the set is stated on every result."

## The Igbogene inventory on the two fossil sets

The lab rebuilds the Igbogene inventory on each set. Here are the two fossil sets:

| set | Scope 1 tCO2e | Scope 2 tCO2e | total tCO2e | total less the course set |
| --- | --- | --- | --- | --- |
| IPCC AR6 GWP100, fossil methane | 30030.777 | 12915.000 | 42945.777 | 0.000 |
| IPCC AR5 GWP100, fossil methane | 30062.438 | 12915.000 | 42977.438 | 31.661 |

The same Igbogene, with the same activity on every line, totals 42945.777 tCO2e on AR6 and 42977.438 tCO2e on AR5. The course's arithmetic puts the AR5 total 31.661 tCO2e above the course set. Scope 2 is 12915.000 on both, because it is a CO2 line with a GWP of 1 on every set.

The methane lines are where the two reports part:

| set | Flaring (unburned CH4) tCO2e | Vented and fugitive methane tCO2e |
| --- | --- | --- |
| IPCC AR6 GWP100, fossil methane | 485.922 | 4231.600 |
| IPCC AR5 GWP100, fossil methane | 489.183 | 4260.000 |

The flare's 16.306 t of methane and the 142.000 t vented are the same tonnes of gas on both rows. Only the GWP they are converted at changes.

## Nitrous oxide moves nothing here

The Igbogene inventory has no nitrous oxide line. Its gases are CO2 and CH4, so the N2O values of 273 and 265 convert nothing in it. The atom balance does not compute combustion N2O, and a nitrous oxide line would need an emission factor line of its own.

In practice, a reporting regime names the assessment report its filings are converted on, and that choice sits with the regime and the operator.

Switch the panel between the two fossil sets. The CO2 lines hold still and the two methane lines move.

## Exercise

Read the two fossil rows of the inventory table and the methane lines on each. Say what the relationship between the two totals shows about what changes when the same inventory is converted on a different report.

Self check: the total is 42945.777 tCO2e on AR6 fossil and 42977.438 tCO2e on AR5 fossil, 31.661 tCO2e apart by the course's arithmetic. The activity on every line is the same and Scope 2 is 12915.000 on both. Only the methane lines move, from 485.922 to 489.183 for the flare and from 4231.600 to 4260.000 for the vented methane, because the methane lines are the only Igbogene lines whose GWP differs between the two sets.
