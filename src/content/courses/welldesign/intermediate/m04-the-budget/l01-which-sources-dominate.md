# Which sources dominate

Twenty-seven contributors, and a handful that matter.

{{panel:wd-uncertainty-explorer}}

## The question

The total covariance is a sum over sources. Which ones are actually paying for it?

That is not idle curiosity. If one source is most of the answer, then reducing THAT source is the only thing that will move the total, and everything else is effort spent on rounding.

## The measure

A source's contribution at a station is a three by three matrix, not a scalar, so ranking requires choosing a scalar summary.

The panel uses the TRACE, the sum of the three variances, which is the total variance in all directions. It is frame-independent, which is a real advantage: rotating into the borehole frame does not change it.

Other summaries are defensible. The lateral variance alone would be the right measure if anti-collision were the only concern. The trace is the general-purpose one.

## The ranking at total depth

On the validation well at 8000 m, horizontal, the top of the list is dominated by one source.

**AMIL**, axial magnetic interference, pays for well over half the total variance on its own. The next two, both declination and field-strength reference terms, together account for about a quarter more. The fourth is an axial magnetometer bias and the fifth is assembly sag.

Five sources out of twenty-seven account for the great majority of the answer.

## Why AMIL

Axial magnetic interference is the field the drill string itself contributes along the hole axis, corrupting the axial magnetometer.

Its weighting function goes as the sine of the inclination and the sine of the azimuth relative to magnetic north, divided by the horizontal field component.

This well is horizontal, so the sine of the inclination is 1: worst case. Its azimuth is 75 degrees against a declination of minus 4, so it is heading east-north-east, well away from magnetic north: near worst case. And the dip is 72 degrees, so the horizontal field component is small: worst case again.

Three factors all at their least favourable simultaneously. That is why one source is half the budget.

## What that means for mitigation

AMIL is not a tool specification. It is the drill string's own magnetism, so a better MWD sensor does nothing for it.

What does work: more non-magnetic drill collar spacing, which is a bottom hole assembly design decision, and multi-station analysis, which estimates the interference from the survey data itself and corrects for it. Both change the parameter set to one with a smaller AMIL magnitude, and both are procedural rather than instrumental.

That is the practical payoff of reading the budget: it tells you the answer is bought with collars and survey procedure, not with a better tool.

## The vertical component

Look at the vertical column in the panel's source table. Almost every source contributes zero to it.

The exception is sag, which biases inclination directly and therefore has a substantial vertical contribution while contributing little laterally.

So the vertical uncertainty of a horizontal well is essentially one source, and the lateral uncertainty is a different set entirely. They cannot be traded against each other.

## The misconception to avoid

"All twenty-seven sources matter, so the model is complicated." The model has twenty-seven sources so that it is correct in every geometry. In any GIVEN geometry a handful dominate and the rest are noise, and which handful changes with the geometry. That is the next lesson.

## Exercise

Open the panel at total depth and record the top five sources and their shares.

For each, say from the previous module whether it is a sensor property, a property of the earth, or a property of the drill string. Then say which of the three categories a better MWD tool would help with.
