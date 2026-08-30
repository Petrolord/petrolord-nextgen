# Uncertainty in a TVD

The vertical component, and why it is the one a horizontal well lives on.

## The quantity

Vertical position uncertainty is the vertical-vertical entry of the covariance, and its square root is a sigma in metres of true vertical depth.

It is not the same as the highside sigma, though in a horizontal well they are close: highside is perpendicular to the hole in the vertical plane, and when the hole is horizontal that is straight up.

## Why it is usually small

Because inclination is measured well, and true vertical depth is an integral of the cosine of the inclination, which is insensitive to inclination errors when the hole is steep.

At vertical, an inclination error has no effect on TVD at all to first order: the derivative of the cosine is the sine, which is zero. At 45 degrees it is at its largest relative effect. At horizontal it is zero again, but for the opposite reason: the cosine is flat there too.

So TVD uncertainty accumulates mostly through the build sections and hardly at all in the vertical or horizontal parts.

## Where it comes from

Two contributors dominate.

**Assembly sag**, which biases inclination directly and therefore accumulates a real TVD error through any inclined section.

**Depth error resolved vertically**, which in a vertical well is the whole story and in a horizontal well is nothing.

Almost every other source is azimuth-related and contributes nothing vertically, which is why the vertical column of the panel's source table is mostly zeros.

## Why it matters most in a lateral

A horizontal well in a thin reservoir has a target window of a few metres of TVD, held over a kilometre or more.

The vertical uncertainty at that point is typically larger than the window. So the survey alone cannot tell you whether the well is in the reservoir, and it never could.

That is the entire justification for geosteering: the position is refined against formation evaluation, not against the survey, because the survey's vertical uncertainty is bigger than the thing being steered into.

## Where it matters for pressure

Every pressure in this module is at a true vertical depth. A pore pressure, a fracture pressure, a mud weight, a kill sheet, a hydrostatic column.

An uncertainty of a few metres of TVD is a pressure uncertainty of a few tenths of a bar in a normally pressured well, which is small. It becomes relevant in a narrow mud window, where the margin between pore and fracture pressure is itself only a few tenths.

The geomechanics course takes that up.

## What to do about it

**Where it matters, measure it.** Geosteering, formation evaluation, and correlation against offset wells all give better vertical control than the survey.

**Check the sag correction.** It is applied as a correction to inclination and it depends on the assembly. An assembly change without a corresponding sag change is a systematic vertical error.

**Watch the lateral's inclination.** Half a degree away from horizontal over a kilometre is nearly nine metres of TVD, which is far larger than the survey uncertainty and is a plan issue rather than a measurement one.

## The misconception to avoid

"TVD is the depth we know best." True vertical depth is derived from inclination and measured depth, and it is known better than lateral position but not exactly. In a lateral, its uncertainty routinely exceeds the reservoir thickness, which is the reason the drilling and the geology are done together.

## Exercise

A lateral is drilled at 89.5 degrees for 1200 m. The inclination is uncertain by 0.15 degrees at one sigma.

Compute the TVD change over the lateral at the nominal inclination, and the change if the inclination were one sigma steeper. State the difference and compare it against a 3 m reservoir window.
