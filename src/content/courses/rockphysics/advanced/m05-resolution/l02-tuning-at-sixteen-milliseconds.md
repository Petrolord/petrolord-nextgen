# Tuning at sixteen milliseconds

The wedge fixture gives a tuning thickness of 16 ms at 25 Hz. This lesson looks at the curve that produces it.

## The curve

Amplitude of the composite against bed thickness, at 25 Hz on a 1 ms grid:

| thickness (ms) | peak amplitude |
| --- | --- |
| 2 | 0.030337944626808167 |
| 8 | 0.10745733231306076 |
| 16 | 0.1444934457540512 |
| 30 | 0.10392113029956818 |
| 50 | 0.10000059753656387 |

The isolated value, which the curve approaches at large thickness, is 0.10000000149011612, the float32 representation of the 0.1 reflection coefficient at the top.

## Three regions

Below about 8 ms the amplitude is collapsing. The top and base reflections overlap so closely that they are cancelling, and by 2 ms only 30 percent of the isolated amplitude survives.

Between about 8 and 26 ms the amplitude is above the isolated value, peaking at 16 ms. This is the tuning region, where the two opposite reflections happen to reinforce.

Above about 30 ms the amplitude has settled to the isolated value and the two events are separable. Here the interface arithmetic of the earlier modules applies directly.

## The peak is 44 percent bright

$$\frac{0.1444934457540512}{0.10000000149011612} = 1.4449$$

An interface with a reflection coefficient of 0.1, in a bed at tuning, records as though its coefficient were 0.1445.

That is the number to carry. Tuning does not perturb an amplitude by a few percent. It brightens it by nearly half.

## What the theory says

For an equal and opposite pair under a Ricker wavelet, the tuning thickness is the wavelet's peak to trough time:

$$T_{tune} = \frac{\sqrt{6}}{2\pi f}$$

At 25 Hz that is 15.593936024673521 ms, against the 16 ms the engine reports.

The difference is the sampling. The engine evaluates the curve on a 1 ms grid, so it can only report an integer number of milliseconds, and 16 is the nearest grid point above the theoretical value. That is a discretisation artefact and not a disagreement with theory.

The same relation is often quoted as $1/(2.6f)$, after Kallweit and Wood, which at 25 Hz gives 15.38 ms. The three values agree to within the grid spacing.

## Reading it off the panel

The tuning tile carries the thickness at the selected frequency.

{{panel:rp-avo-explorer}}

At 25 Hz it reads 16 ms. That single number is one of the seven capstone fields, and it is graded exactly, with no tolerance, because it is an integer number of grid samples rather than a measured quantity.

## Worked example

Confirm the theoretical value and see how close the grid gets at each frequency.

First pin the constant, because it is easy to get wrong. The tuning thickness in milliseconds is

$$T_{tune} = \frac{1000\sqrt{6}}{2\pi f} = \frac{389.8484}{f}$$

Check that constant at one point before using it: $\sqrt{6} = 2.4495$, and $2\pi = 6.2832$, so $1000 \times 2.4495 / 6.2832 = 389.85$. Dropping the $2\pi$ by mistake would give 2449.5, which at 25 Hz predicts 98 ms and is obviously wrong against the 16 ms the engine reports. Evaluating a constant at one known point is a cheap habit and it catches exactly this.

Now apply it:

| frequency | theory (ms) | engine (ms) |
| --- | --- | --- |
| 15 Hz | 25.98989337445587 | 26 |
| 25 Hz | 15.593936024673521 | 16 |
| 40 Hz | 9.746210015420951 | 10 |
| 50 Hz | 7.796968012336761 | 8 |

Every reported value is the theoretical one rounded up to the 1 ms grid, and the largest discrepancy is 0.41 ms at 25 Hz.

## Exercise

A survey has a dominant frequency of 30 Hz. Compute the tuning thickness in milliseconds and in metres for a sand at 2900 m/s.

Self check: $389.8484/30 = 13.0$ ms. Converting to thickness, $h = 13.0 \times 2900 / 2000 = 18.8$ m. So a sand thinner than about 19 m would be at or below tuning in that survey.
