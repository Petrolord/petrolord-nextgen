# Corners decide everything

{{panel:qr-societal}}

A criterion line is continuous and an F-N curve is a staircase. Comparing them looks as if it should need a check at every value of N, which is infinitely many. It needs only a handful, and the engine's comparison is exact because of a simple geometric fact. This lesson states the fact, runs the JISIKE off-site curve against the Dutch line with it, and shows what the engine reports at each corner.

## The argument

On each step of the curve F is flat. The line F = C / N^alpha falls as N rises. So along any step, the ratio of the curve to the line grows from the step's left end to its right end, and it is largest at the right end, which is a corner. The curve attains that corner, because the step function is left-continuous and holds its higher value exactly at each scenario's N. Checking every corner inside the line's range therefore checks every point. The engine compares only there, and that is exact.

## The JISIKE curve against the Dutch line

| corner N | F(N) per year | line per year | ratio F / line | state |
| --- | --- | --- | --- | --- |
| 12.000000 | 0.000009700000 | 0.000006944444 | 1.396800 | EXCEEDS |
| 40.000000 | 0.000001700000 | 0.000000625000 | 2.720000 | EXCEEDS |
| 300.000000 | 0.000000200000 | 0.000000011111 | 18.000000 | EXCEEDS |

Every corner inside the range lies above the line. The line value at each corner is C / N^alpha with the preset's constants; the ratio is F divided by it.

## The corner that is not checked

The curve's first corner, at N = 3, lies below the line's smallest N of 10. The engine does not check it. That is the line's range doing its job, and the engine reports only the corners it checked, so a reader sees three rows where the curve has four corners. The high frequency at N = 3 is left to whatever criterion the analyst chooses for small events.

## What the corners do not need

The engine never interpolates between corners, never samples a grid of N for the comparison, and never smooths the curve. The corners alone decide the state, and with it the worst ratio. The one exception comes when a line has an upper end that falls between corners, where the engine evaluates the curve at that end too; the fourth lesson of this module shows it.

## Reading the ratio

A ratio above one means the curve lies above the line at that corner, and the state there is EXCEEDS. The ratio also says by how much: at N = 12 the curve is 1.396800 times the line, and at N = 300 it is 18.000000 times. The ratios grow along this curve because the curve falls more slowly with N than a risk averse line does. Which corner carries the worst ratio is the question of the last lesson in this module.

Take the step that ends at N = 40. Its F is 0.000001700000 per year from just past 12 up to 40. At the left end the line is higher than at 40, so the ratio there is smaller than 2.720000. Nowhere on the step can it exceed the value at the corner.

## Exercise

Divide the curve's F(40) of 0.000001700000 per year by the line's 0.000000625000 per year and confirm the ratio 2.720000. Then say, without computing, whether the ratio at a point midway along the same step is larger or smaller, and which property of the line tells you.
