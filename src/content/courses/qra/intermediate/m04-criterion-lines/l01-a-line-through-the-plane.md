# A line through the plane

{{panel:qr-societal}}

An F-N curve on its own is a description. To judge it, an assessment sets it beside a criterion drawn on the same log-log plane. Most published criteria are straight lines on that plane, and this lesson introduces their form, the one number that sets their tilt, and what the engine accepts as a criterion.

## The form

A criterion line has the form F = C / N^alpha, between a smallest N and, optionally, a largest N. C fixes the height of the line and alpha fixes its slope on the log-log plot. On such a plot the line is straight, falling alpha decades of frequency for every decade of N.

| alpha | the name it goes by | what it means |
| --- | --- | --- |
| 1 | risk neutral | ten times the deaths is allowed at a tenth of the frequency |
| 2 | risk averse | ten times the deaths is allowed at a hundredth of the frequency |

With alpha of 1, F times N is the same at every point on the line. With alpha of 2, large events are held to a stricter standard than their expected deaths alone would demand, which is how a line expresses a society's aversion to many deaths at once. The engine carries no aversion weighting of its own; the slope of a criterion is where aversion enters.

## What the engine accepts

The comparison function takes the scenarios and a criterion. The criterion can be a preset name, a line given as constants, or a set of points. The two presets are vrom-establishments, a line, and r2p2-para-136, a single point. A line is given as { constantC, exponentAlpha }, with the smallest N and the largest N as optional limits.

## A line with no slope

A line needs a positive alpha. Given a line with no slope, the engine refuses:

> criterion.exponentAlpha: must be above 0 (1 is risk neutral, 2 risk averse)

The message names the field, says what is allowed, and reminds the caller what the two common values mean. A flat line would allow the same frequency for a thousand deaths as for one, so it could express no view about events of different size.

## Why a line and a curve can be compared exactly

The F-N curve is a step function and the line falls smoothly. On any step the curve is flat and the line keeps falling, so the ratio of curve to line is largest at the step's right-hand corner, which the curve attains. That is why the engine compares only at corners and why the comparison is exact. The third lesson of this module works the argument through on the Dutch line.

## What a criterion is not asked to do

A criterion line judges the societal picture. It says nothing about any one person's individual risk, which has its own published limits in the Expert tier. It also never becomes a score: this course never scores a risk matrix, which belongs to the risk and change course.

## Exercise

For a line with C = 1e-3 and alpha of 2, the line gives 1e-5 per year at N = 10. Without a calculator, say what it gives at N = 100 and at N = 1000, then say what a line with the same C and alpha of 1 would give at N = 10, and whether that line is higher or lower there.
