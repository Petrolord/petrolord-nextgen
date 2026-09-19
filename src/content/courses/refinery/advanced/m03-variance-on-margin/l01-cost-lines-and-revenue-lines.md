# Cost lines and revenue lines

Module 2 read every variance as recorded: a change in the line's own value. That is the right way to take a line apart. It is the wrong way to add lines together, because the eight ODIOMA lines sit on two sides of the margin. This lesson sorts them.

{{panel:refinery-variance-explorer}}

## The direction column

Every matched line carries a direction, set by its event type. A delivery's value is what it sold for, so a delivery line is revenue. Every other event's value is what it cost, so a receipt line and a unit_run line are cost.

| material | type | direction | total variance |
| --- | --- | --- | --- |
| escravos | receipt | cost | 11607000.00 |
| forcados | receipt | cost | -30508000.00 |
| cdu | unit_run | cost | -319550.00 |
| reformer | unit_run | cost | -169800.00 |
| gasoline | delivery | revenue | -5427700.00 |
| jet | delivery | revenue | -3731500.00 |
| diesel | delivery | revenue | -9590800.00 |
| fuel_oil | delivery | revenue | -6092800.00 |

Escravos (illustrative) and Forcados (illustrative) are labels on invented figures.

## One sign, two meanings

A positive gap on a delivery helps the margin and the same gap on a receipt hurts it. That is the fact the whole tier turns on.

Take the escravos line. Its total variance is 11607000.00, positive, because the month spent more on Escravos crude than the plan did. More money spent on crude is less margin. Now take a delivery that sold for more than planned: its total variance would also be positive, and more money received is more margin. The two figures carry the same sign and pull the margin in opposite directions.

The negative signs split the same way. The crude unit's total variance is -319550.00: less was spent running it, which helps margin. Diesel's is -9590800.00: less was received for diesel, which hurts margin.

## Totals as recorded

The engine adds the lines on each side as recorded, and prints each side's totals:

| total | volume variance | price variance | unexplained | total variance |
| --- | --- | --- | --- | --- |
| cost lines, as recorded | -20622400.00 | 1020050.00 | 212000.00 | -19390350.00 |
| revenue lines, as recorded | -24572090.00 | -270710.00 | 0.00 | -24842800.00 |

Each of these rows is meaningful on its own. The cost row's total variance is -19390350.00. It is negative, so the month spent less than the plan on crude and unit runs. The revenue row's total variance is -24842800.00. It is negative, so the month received less than the plan from products. Within one side every line means the same thing by its sign, so the lines can be added.

The cost row's parts say more. Its volume variance of -20622400.00 is negative: fewer barrels were bought and run than planned, at plan prices. Its price variance of 1020050.00 is positive: the barrels that did move cost more each. Its unexplained reads 212000.00, and the one cost line with an unexplained figure is Forcados, which reads 212000.00.

## The question left open

Two side totals do not yet say what happened to the margin. A reader holding -19390350.00 and -24842800.00 has to decide how to combine them, and the obvious way, adding them, is the trap module 3 is built to show. The next lesson reads how the engine puts both sides on one footing before it adds, one line at a time.

## Exercise

Read the direction and total variance of the escravos line and the diesel line. For each, say whether the total helped or hurt the margin, and why the sign alone cannot tell you. Then read the two side totals as recorded and say, for each, whether the month spent or received more or less than the plan.
