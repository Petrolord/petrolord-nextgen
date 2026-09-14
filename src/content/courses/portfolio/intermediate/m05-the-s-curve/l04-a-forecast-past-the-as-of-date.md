# A forecast past the as-of date

After the as-of date the S-curve's Forecast line leaves the actuals and follows the EAC spread evenly from the start of the window. On OFON-1 that makes it jump.

{{panel:ec-cost-explorer}}

## Where the forecast breaks

| point | label | Planned | Actual | Forecast |
| --- | --- | --- | --- | --- |
| 5 | Jul 27 | 13435430 | 12700000 | 12700000 |
| 6 | Aug 27 | 16212086 | 15090000 | 15090000 |
| 7 | Sep 27 | 18988742 | null | 19374834 |
| 8 | Oct 27 | 21675828 | null | 22116556 |
| 9 | Nov 27 | 24452483 | null | 24949669 |

Up to and including Aug 27, the last point before 2027-08-15, the Forecast equals the Actual: 12700000 at Jul 27 and 15090000 at Aug 27. From Sep 27, the first point after the as-of date, it reads 19374834, then 22116556 and 24949669.

## The rule behind the jump

Past the as-of date the Forecast is the EAC of 27600000 spread linearly over the window from its start, read at each point's day. It is the Planned line drawn again with the EAC in place of the budget of 27050000. That is why Forecast sits above Planned at every projected point: 19374834 against 18988742 at Sep 27, and 24949669 against 24452483 at Nov 27. The EAC exceeds the budget, a variance at completion of -550000, and the whole projected line carries that ratio.

The projection never looks at the actuals it follows. It does not start from 15090000 and add the spend still to come. The step from 15090000 at Aug 27 to 19374834 at Sep 27 is a change of formula at the as-of date, and the size of the step depends on how far the actuals sit from a straight line, which says nothing about September.

## The EAC behind it

The EAC is the one forecast rule applied to each line. CSG-02 forecasts its actual plus commitment of 4300000 because that exceeds its budget of 3900000. CMT-03 forecasts its entered 1400000. DRL-01, LOG-04 and CMP-05 forecast their budgets. A negative entered forecast is ignored by the rule, and the S-curve ignores it too, so the projected line carries the same total as the dashboard's EAC.

## The published cases

A published past window read mid-year ends on a last point of Planned 1101, Actual null and Forecast 1377: the projection runs above the plan to the end. A published window lying wholly in the future has an Actual of null from its first point, with a last Forecast of 2450 against a last Planned of 2000.

## What it refuses

The projection has no remaining-work estimate, no burn rate from recent invoices and no dependence on progress. Earned value of 15231500 and CPI of 1.009377 play no part in it.

## The mistake

The first mistake is reading the jump as a spending surge expected in September. The second is a forecast copied from the budget. Before EC5-0, editing a line in the Suite copied its budget into its forecast. A copied forecast is an entered forecast, so the rule takes it, and CSG-02 would forecast 3900000 whatever its actual, hiding its line variance of -400000. The Forecast line would then settle onto the Planned line and show a job heading for its budget. The repaired app no longer copies.

## Exercise

Write OFON-1's Forecast at Aug 27, Sep 27 and Nov 27 beside the Planned at the same points. Then explain why the Forecast jumps at the as-of date, why it sits above Planned at every projected point, and what a budget copied into CSG-02's forecast would have done to that line.
