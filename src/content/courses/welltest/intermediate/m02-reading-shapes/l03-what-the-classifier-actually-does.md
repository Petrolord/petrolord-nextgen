# What the classifier actually does

Read the code before you trust the label.

{{panel:wt-diagnostic-explorer}}

## The algorithm, in full

`detectFlowRegimes` takes a derivative series and does five things.

**One.** It drops every point whose x or derivative is not positive. Negative derivative values, which happen with noise and with recharge, are simply removed rather than classified.

**Two.** For each remaining point it estimates a local log-log slope by central difference over up to two points on each side:

    slope_i = (log10 d_hi - log10 d_lo) / (log10 x_hi - log10 x_lo)

**Three.** It maps that slope to a label with fixed bands: unit slope for 0.85 to 1.2, radial for absolute value at or below 0.12, linear for 0.38 to 0.62, bilinear for 0.16 to 0.34, constant pressure for at or below minus 0.35. Anything else is unlabelled.

**Four.** It groups consecutive points carrying the same label into segments, and discards any segment spanning less than 0.25 of a decade.

**Five.** It applies its only piece of order logic: a unit-slope segment that is FIRST is relabelled wellbore storage, and one that is LAST is relabelled boundary or pseudo-steady state.

That is the whole classifier. It is a reasonable implementation and it does what it says.

## What it does not do

It does not know what came before. Apart from the first-and-last rule for unit slopes, no segment's label depends on any other segment.

It does not know the physics of ordering. Nothing prevents it from reporting recharge before radial flow, or bilinear fracture flow after two hundred hours of radial flow, both of which it does on the fixtures in this course.

It does not know how confident it is. A segment that sat exactly on a band edge and one that sat in the middle of a band are reported identically.

It does not know about transitions. Every point gets a label or no label, and a transition between two regimes has a perfectly well defined local slope that will usually fall inside one of the bands.

## The gaps between the bands

Look at the bands laid end to end: below minus 0.35 is constant pressure, minus 0.12 to 0.12 is radial, 0.16 to 0.34 is bilinear, 0.38 to 0.62 is linear, 0.85 to 1.2 is unit slope.

The gaps are deliberate. A slope of 0.36 is between bilinear and linear and gets no label, which is correct: it is not clearly either. A slope of 0.7 is between linear and unit and gets no label.

Those gaps are what stop the classifier labelling everything, and the fact that unlabelled stretches appear on a plot is a feature. An unlabelled stretch is the classifier saying it does not recognise the shape, which is usually because the shape is a transition.

## The minimum span

The quarter-decade minimum is what keeps noise from generating segments. It is also what can hide a real, short regime.

A radial plateau that lasts only a fifth of a decade will not be reported at all. That is not a mistake in the classifier; it is the classifier refusing to call a five-point stretch a flow regime, which is the right call more often than not. But it means an absent label is not evidence of an absent regime.

On the fracture fixture the classifier reports radial flow over exactly 0.25 decades at the very end of the test, right at the threshold. A slightly shorter test would have reported no radial flow at all on the same well.

## What to do with a label

Treat it as a hypothesis with two pieces of evidence attached: the slope is in the band, and the segment is long enough to be worth mentioning.

Then check the two things the classifier cannot: is this regime physically possible at this point in the sequence, and does the height of the segment make sense for the reservoir you think you have?

Those two checks are the subject of the next two lessons.

## The misconception to avoid

"The software identified the flow regimes." The software identified stretches whose local log-log slope fell inside a named band and lasted a quarter of a decade. Whether those stretches are flow regimes is a question about physics that the software was never given the information to answer.

## Exercise

The classifier's radial band is an absolute slope at or below 0.12.

For a derivative that is genuinely drifting slowly upward, compute how much the derivative can rise across one decade while still being labelled radial. Express that as a percentage change in the derivative, and then as a percentage error in the permeability that would be read off it.
