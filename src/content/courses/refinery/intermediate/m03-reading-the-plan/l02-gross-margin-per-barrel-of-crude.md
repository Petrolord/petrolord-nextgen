# Gross margin per barrel of crude

The margin is a month's total. To compare months, crudes or refineries of different sizes, planners divide it by the crude that earned it. The course gives the definition:

gross margin per barrel = margin / total crude.

For ABUA as typed: margin 7077935.48, total crude 2029032.26 bbl, gross margin per barrel of crude 3.4883. That is the figure the course's one sentence is built on. A refinery is judged on its margin per barrel of crude.

{{panel:refinery-plan-explorer}}

## Per barrel of crude

The denominator is crude, and only crude. It is not product sold and it is not unit throughput. That matters because not every barrel run is sold: every crude yields some offgas that no product takes, the reformer and the hydrotreater each make offgas as well, and the plan leaves 103638.71 bbl of it as surplus. Dividing by crude makes the figure a statement about the barrel the refinery bought: what each one is worth after it has been bought, distilled, processed and sold.

It is also why the figure travels. The Associate tier's screen priced a gross margin a barrel before any capital was spent. The plan prints the same quantity for a running month. When the two sit side by side, one is the promise and the other is the plan.

## The five changes, per barrel

The lab prints both the margin and the gross margin per barrel for each change. Read them together:

| change | total crude (bbl) | margin | gross margin per bbl | margin change from the plan as typed |
| --- | --- | --- | --- | --- |
| the plan as typed | 2029032.26 | 7077935.48 | 3.4883 | 0.00 |
| the diesel hydrotreater typed as shut for a turnaround (capacity 0) | 735294.12 | 424264.71 | 0.5770 | -6653670.77 |
| the diesel hydrotreater capacity left blank (no limit) | 2082608.70 | 7173508.35 | 3.4445 | 95572.87 |
| the crude unit at 1900000 barrels for the month | 1900000.00 | 6847760.00 | 3.6041 | -230175.48 |
| the Forcados cargo cancelled (availability typed 0) | 1747826.09 | 4030705.04 | 2.3061 | -3047230.44 |
| a jet floor of 300000 and a fuel oil floor of 700000 | 2267857.14 | 5929846.43 | 2.6147 | -1148089.05 |

Look at the third and fourth rows. With the hydrotreater left blank, the margin change is 95572.87, and the gross margin per barrel reads 3.4445 against 3.4883 as typed. With the crude unit held at 1900000 barrels for the month, the margin change is -230175.48, and the gross margin per barrel reads 3.6041.

The lab also prints the gross margin per barrel's own change from the plan as typed, taken over the printed figures: -0.0438 for the hydrotreater left blank and 0.1158 for the crude unit at 1900000 barrels. Those two rows are the lesson, and the exercise asks you to read them. The total and the ratio need not move together. With the hydrotreater left blank the plan runs 2082608.70 bbl of crude against 2029032.26, and the total rises while the ratio falls. With the crude unit held at 1900000 barrels it runs 1900000.00 bbl, and the ratio rises while the total falls.

## Which to maximise

The plan maximises the margin, the total. The engine sets the solver's sense, maximize: true, and the objective at ABUA's plan equals the margin, 7077935.48. The gross margin per barrel is a reading of the plan, divided out after the plan is found. The crude unit row shows the two parting: a ratio of 3.6041 against 3.4883, on a margin change of -230175.48. The course uses the ratio to compare: the screen with the plan, and the plan with its actuals.

## Exercise

Read the rows for the hydrotreater left blank and the crude unit at 1900000 barrels. For each, give the margin change from the plan as typed (95572.87 and -230175.48) and the change in gross margin per barrel that the lab prints (-0.0438 and 0.1158). Say what the pair shows about why a plan is chosen on its margin, and what the gross margin per barrel is still good for.
