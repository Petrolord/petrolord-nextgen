# The size of the disagreement

Two defensible rules for the plunger stroke, applied to the same string on the same day, return answers inches apart. The gap is not a mistake in either one.

{{panel:pd-card-explorer}}

## The size of the gap, on two strings

| Case | Spring rule, in | Wave march, in | Gap, in | Percent |
| --- | --- | --- | --- | --- |
| published taper, 9 spm | 45.279814701 | 49.670227367 | 4.390412667 | 9.696181 |
| published taper, 15 spm | 45.279814701 | 53.042713176 | 7.762898475 | 17.144281 |
| ODUMA-4, 10 spm | 91.152184050 | 98.526653100 | 7.374469050 | 8.090282 |
| ODUMA-4, 14 spm | 91.152184050 | 98.622401776 | 7.470217726 | 8.195325 |

Two strings, two fluid loads, two surface strokes, and the marched answer is the longer one on every row. On the published taper the gap reaches most of eight inches, and on ODUMA-4 it passes seven at the speed the design actually runs. This is a property of the two rules, not a peculiarity of one case.

## Why it is not numerical noise

The obvious objection is that the march is a numerical scheme and the difference is its error. That objection can be answered with numbers, because the goldens were produced by a completely independent route: the oracle marches a staggered grid with RK4 on the velocity and tension system, while the engine marches displacement on a collocated grid with an explicit central difference. Different unknowns, different grid, different integrator.

At 9 spm the oracle returns a plunger stroke of 49.864170826 in and the engine 49.670227367 in, a difference of -0.193943459 in or -0.388944 percent. Two independent numerical routes agree to under four tenths of a percent while the spring rule sits 9.696181 percent away from both. The gap between the rules dwarfs the disagreement between the schemes.

## The row where that argument fails

At 5 spm the oracle returns 45.740807246 in and the engine 45.449104154 in, a difference of -0.291703092 in or -0.637731 percent. The overtravel at that speed is 0.169289454 in, or 0.373874 percent.

The gap between the two rules is smaller than the gap between the two solvers. At 5 spm the overtravel is real physics but it is inside the noise of the numerics, and quoting it as a measured effect would be quoting something the oracle cannot resolve. The oracle's own gates hold the two routes to 2 percent on plunger stroke, so anything under that is invisible to it by construction.

That is the discipline: the effect is only demonstrated where it is larger than the disagreement between the routes that measure it.

## What each rule is for

The spring rule is the static limit and a sanity check. At 0.5 spm the two answers differ by 0.006976549 in, 0.015408 percent.

The march is the answer at a running speed. Neither is a correction to the other, and averaging them would be meaningless.

## Exercise

Write the spring rule and the marched stroke for the published taper at 9 spm and for ODUMA-4 at 10 spm, with both gaps in inches.

Then state the engine to oracle difference at 5 and at 9 spm and say which of those two speeds can carry a claim about overtravel.
