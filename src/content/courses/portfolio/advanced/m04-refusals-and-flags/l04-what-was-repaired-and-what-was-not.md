# Flags and standing properties

Between a refusal and a clean answer sit two more kinds of reading. A flag is raised on a result the engine still returns. A standing property is a way the tools behave that no flag will ever mention. An expert answer names both.

{{panel:ec-governance-explorer}}

## Flags the engines raise without refusing

| flag | where | what raises it | example |
| --- | --- | --- | --- |
| forecastBelowCommitted | each AFE line | a positive entered forecast below the money spent and committed | CMT-03 at a forecast of 900000 against 940000 committed: kept, flagged by 40000 |
| forecastIgnored "negative" | each AFE line | an entered forecast below 0, replaced by the standard rule | CMT-03 at -5 forecasts 1250000 |
| cpiStatus | the AFE | why CPI is null | "no-spend" when nothing has been spent |
| spiStatus | the AFE | why SPI is null | "no-planned-value" on the start day; "no-budget" on an empty AFE |
| valid and note | the partner split | a negative interest, or interests above 100 percent | 30 and -20: valid false, the partner named |
| undated invoices | beside the S-curve | invoices with no date the engine can read | the published undated case: 2 |

Every one of these leaves the numbers visible. The forecast below committed is a legitimate re-baseline or a typing slip, and only the reader can say which. A CPI of null with cpiStatus "no-spend" is an answer: there is no cost efficiency to report yet. A split marked valid false still shows its amounts so the error can be traced.

## Properties the course teaches as they stand

An AFE with no dates reads time progress 1, so SPI measures nothing there; the Suite labels SPI unavailable for such an AFE. A positive entered forecast is taken as typed even below the money already spent, and flagged. After the as-of date the S-curve's Forecast ignores the actuals and is the EAC spread from the start. Correlation in the risk summary is clamped to 0 to 1, and the Suite's correlation slider stops at 0.9: OKONO's 600.0000 set reads a stdDev of 239.8888 and a P(loss) of 0.059000 at rho 1.000000 against 232.0795 and 0.049500 at rho 0.900000, so the fully correlated case can be run through the engine but cannot be set from the screen. The Suite stores a risk score from 1 to 10 with each project, and neither the optimizer nor the risk summary reads it. The stated fallback grid is used only when a call states a small exactStateLimit, since the default of 200000 is never reached by an inventory of sixteen projects or fewer.

None of these is an error to be caught. Each is a condition a number is true under.

## The mistake

The mistake is reading a returned result as a clean one. A forecast total, a split or an S-curve can come back complete and still carry a flag in a field nobody printed. Read the flags first: lines below committed, lines with an ignored forecast, the two ratio statuses, valid, and the undated count.

The other mistake is working around a property silently. Put it in the answer: SPI as of a stated date, the correlation used and the seed, and whether the solve was exact.

## Exercise

List four flags the engines raise without refusing, with the input that raises each and one published or OFON-1 number that shows it. Then name three properties the course teaches as they stand, and say for each which figure in an answer it conditions.
