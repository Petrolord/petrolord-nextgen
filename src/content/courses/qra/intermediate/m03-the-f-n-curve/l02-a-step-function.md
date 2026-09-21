# A step function

{{panel:qr-societal}}

The F-N curve is drawn on a log-log plot and it usually looks like a descending staircase. That shape is not a drawing convention. F is constant between two consecutive values of N and falls at each one, because between two corners no scenario enters or leaves the count. This lesson reads the steps of the JISIKE off-site curve, and shows why reading between the corners matters once the curve meets a criterion.

## The corners

| N | F(N), N or more, per year |
| --- | --- |
| 3.000000 | 0.000049700000 |
| 12.000000 | 0.000009700000 |
| 40.000000 | 0.000001700000 |
| 300.000000 | 0.000000200000 |

Each row is a corner, a distinct N at which some scenario sits. The curve holds its value from just after the previous corner up to and including this one, then drops.

## Reading between the corners

Take N = 5. No scenario has N between 3 and 12, so the scenarios with 5 or more deaths are exactly those with 12 or more. The engine's step gives F(5) = F(12) = 0.000009700000 per year. In the same way F(12.5) = F(40) = 0.000001700000 per year: just past a corner, the scenario at that corner has left the count, and the next scenarios down the list are those at the following corner.

## Left-continuous

The model string calls the curve left-continuous:

> F(N) = sum of f_i with N_i >= N, at each distinct N_i > 0 (left-continuous step function)

In plain words: at a corner, F takes the higher value, the one that still includes the scenario sitting there. At N = 12 the flash fire at the road counts, so F(12) is 0.000009700000 per year. A moment past 12 it does not, and F falls to the value of the next corner. That is what "N or more" means when N lands exactly on a scenario.

## What the step is for

The step shape is what makes the curve comparable with a criterion line. A line of the form F = C / N^alpha falls smoothly with N while the curve stays flat on each step. So on any step, the ratio of curve to line is largest at the step's right-hand end, which is a corner the curve actually reaches. The next module turns that observation into the engine's rule that corners decide a line comparison exactly. If the curve were drawn as a smooth line through the corners, that argument would fail and a criterion check would have to be made at every point.

## Where the staircase starts

The staircase starts at the smallest N above zero, here N = 3. The release that reaches no one has N of 0, so it has no step. The engine keeps it out of the curve and reports its frequency, 0.000050000000 per year, so the whole scenario set is accounted for. The jet fire at the fence and the second jet fire at the fence share N = 3. They do not make two steps. They make one corner, whose drop carries both frequencies together.

## Exercise

Using the corner table, give F(N) at N = 5, N = 12 and N = 12.5, and name the scenarios counted in each. Then say which of the three values would change if the flash fire at the road had a stated N of 3, and which would stay as they are.
