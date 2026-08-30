# The semilog slope

A slope is a difference over a cycle, and a cycle is a factor of ten.

{{panel:wt-buildup-explorer}}

## Reading a slope on a log axis

On a semilog plot the horizontal axis is the logarithm of time, so a "cycle" is a factor of ten in time: 1 to 10 hours is one cycle, 10 to 100 hours is the next.

The slope m is the pressure change across one such cycle, in psi. It is quoted as a positive number by convention whichever direction the pressure is moving, because a drawdown falls and a buildup rises and the same quantity is meant.

You can read it off a plot with a ruler: find two points a decade apart on the straight part of the line and take the pressure difference. Software fits it by least squares instead, which is the same idea with all the points in the middle carrying weight too.

## What the engine returns

`hornerAnalysis` and `mdhAnalysis` both fit an ordinary least-squares line to the points you give them and return five things: the slope, the permeability that slope implies, the pressure the line takes at one hour, the skin, and the coefficient of determination of the fit. The buildup analysis adds the pressure the line extrapolates to at the far end.

Two of those, the permeability and the skin, are what the report says. The other three are how you decide whether to believe them.

## The slope at the planted permeability

For this reservoir at 450 stb/d, a permeability of 85 mD gives

    m = 162.6 x 450 x 1.25 x 0.9 / (85 x 45) = 21.520588235294117 psi per cycle

That is the slope the data would show if the semilog line could be read perfectly. It is a useful number to carry, because every fit you run in this tier can be compared against it: a fit that returns a much steeper slope has picked up something that is not radial flow.

And a much steeper slope is exactly what happens. Fit all forty buildup points and the slope comes out at 79.08878233809047 psi per cycle, nearly four times the correct value, because most of those points are not on the radial line at all.

## The arithmetic in both directions

The slope equation runs both ways and it is worth being fluent in both.

Forward, from rock to slope: a better reservoir gives a flatter line. Double the permeability and halve the slope.

Backward, from slope to rock:

    k = 162.6 q B mu / (m h)

Every quantity on the right except m is something you brought to the test. The test itself contributes one number, the slope, and that single number is the whole of the permeability determination.

That is worth sitting with. A well test that runs for four days, produces tens of thousands of pressure readings and costs a week of deferred production, contributes exactly one number to the permeability, and it is the steepness of a line drawn through a fraction of those readings.

## Units, and the way to check them

The 162.6 is a unit conversion with physics folded into it, and it is specific to oilfield units: q in stb/d, B in rb/stb, mu in cp, k in mD, h in ft, pressure in psi, time in hours.

There is no way to derive it at the desk, and the practical defence against getting it wrong is a sanity check rather than a derivation. At a few hundred stb/d in a few tens of millidarcies over a few tens of feet, a semilog slope of a few tens of psi per cycle is normal. A slope of 0.2 or of 2000 means something is wrong with the inputs, not with the reservoir.

## The misconception to avoid

"A steeper line means a bigger pressure drop, so the well is more damaged." No. The steepness of the semilog line is permeability and thickness only. Damage moves the line up or down without tilting it. Two wells with identical slopes can have completely different skins, and two wells with identical skins can have completely different slopes. Keeping those separate is the point of the next module.

## Exercise

Open the panel and read the slope for the window that uses every point, and then for the window that uses only shut-in times at or after two hours.

Both fits are least squares, on the same test, with the same software. Write down the ratio of the two slopes, and say in one sentence what physical thing the earlier points are contributing that makes the first line steeper.
