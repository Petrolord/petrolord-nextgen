# The rule the screens share

A forecast rule is only useful if every screen uses it. In the AFE Cost Control Manager one rule sets every line's forecast, and every tile, table and export that shows a forecast reads that same rule.

{{panel:ec-cost-explorer}}

## One rule, stated once

itemForecast is the entered forecast when it is positive, otherwise the larger of the budget and actual + commitment. The EAC is the sum of the line forecasts, and the variance at completion is the budget minus the EAC. On OFON-1:

| code | budget | actual + commitment | entered forecast | itemForecast | rule used |
| --- | --- | --- | --- | --- | --- |
| DRL-01 | 14200000 | 12400000 (derived) | none | 14200000 | budget |
| CSG-02 | 3900000 | 4300000 (derived) | none | 4300000 | actual + commitment |
| CMT-03 | 1250000 | 940000 (derived) | 1400000 | 1400000 | entered |
| LOG-04 | 2100000 | 1250000 (derived) | none | 2100000 | budget |
| CMP-05 | 5600000 | 1200000 (derived) | none | 5600000 | budget |

EAC 27600000, variance at completion -550000. All three branches of the rule appear on one AFE.

## Where the rule is read

The dashboard tiles, the Cost Breakdown table, the PDF export, the Excel export and the Top 5 all use this one rule. A reviewer who reads 27600000 on a tile will find 27600000 in the PDF and in the Excel file. The S-curve ignores a negative entered forecast too, as the published case "negative entered forecast is ignored (the S-curve ignores it too)" records with an EAC of 100.0000 on a line whose entered forecast was -50.

## Two things the screens do

Editing a line does not copy the line's budget into its forecast field. That matters because a copied budget is a positive figure, and under the rule a positive entered forecast wins. CSG-02, with 4300000 spent against a budget of 3900000, would forecast 3900000 after such a copy and show no line overrun. The second thing is the mark: the Cost Breakdown table marks a line whose entered forecast is below the money spent and committed with the amount, "below spent and committed", so that copy would carry a mark of 400000 beside it.

## What it refuses

Sharing one rule makes the screens consistent. It leaves the rule's limits in place, and every screen shares them. None of them forecasts a line under its budget without an entered forecast, none of them extrapolates from progress or CPI, and none of them reads a zero or negative forecast as the line's forecast; a negative entry is flagged forecastIgnored "negative".

## The mistake

The mistake is reconciling screens while the inputs go unchecked. When two reports of one AFE disagree, check first the date of each export, then each line's forecast field for a figure equal to its budget. The screens read one rule, so a disagreement points at the data or the date of the export. The other mistake is quoting an EAC without its rule: 27600000 means three budgets, one spend and one entered figure, and a partner who reads it as a projection from performance has been misled.

## Exercise

Name the five places in the Suite that read the one forecast rule, and state OFON-1's EAC and variance at completion as they all show it. Then explain how a budget copied into a line's forecast would change CSG-02's itemForecast, and why that change hides an overrun.
