# The least-squares quadratic

The engine turns the four catalogue points into a quadratic by least squares. It does not pass the curve through the points. It finds the quadratic that sits closest to all four at once, and then it tells you how close that turned out to be.

{{panel:fc-pump-explorer}}

## The fit, and the variable it is written in

For OKONO the coefficients come back as c0 = 540.203016, c1 = 0.738126 and c2 = -291.101770, with a scale of 1900.000000.

The scale is the largest flow in the point set, and the quadratic is written in the normalised variable q over the scale rather than in raw gpm. That is why c2 is a number of a few hundred instead of a number with a great many leading zeros. Normalising costs nothing in accuracy and it keeps the three coefficients within a few orders of magnitude of each other, which matters for the arithmetic behind the fit.

The shutoff head is simply the fitted head at zero flow, which is c0: 540.203016 ft.

## The fit misses every point it was given

Read the shutoff against the catalogue. The catalogue reads 540.000000 ft at zero flow and the fit reads 540.203016 ft, a difference of 0.203016 ft. The fitted shutoff is not the catalogue's own first point.

That is not a fault. Here is the whole fit read back at each catalogue flow:

| flow gpm | catalogue head ft | fitted head ft | residual ft |
| --- | --- | --- | --- |
| 0.000000 | 540.000000 | 540.203016 | 0.203016 |
| 600.000000 | 512.000000 | 511.406569 | -0.593431 |
| 1200.000000 | 424.000000 | 424.551043 | 0.551043 |
| 1900.000000 | 250.000000 | 249.839372 | -0.160628 |

Four points, four residuals, and not one of them is zero. A quadratic has three coefficients and there are four points, so there is no quadratic that hits all four. The residual column is the fitted head less the catalogue head on each row, and the signs alternate down it, which is what a least-squares fit through scattered points looks like when it is behaving.

## Why a quadratic at all

Three coefficients are enough to carry the shape a centrifugal head curve has: a head at shutoff, a gentle slope near it, and a steepening fall as the flow rises. More coefficients would follow the readings more closely and would also follow whatever error is in the readings, which is not an improvement.

## The mistake

Expecting the engine to reproduce a catalogue number exactly. Ask the fitted curve for the head at zero flow and it gives 540.203016 ft, which is 0.203016 ft away from the printed catalogue value. That gap is the fit doing its job across all four points at once.

## Exercise

Write the three coefficients and the scale for the OKONO fit, and say what the scale is taken from. Then give the fitted head at 1200.000000 gpm, give its residual, and say why no quadratic can make all four residuals zero.
