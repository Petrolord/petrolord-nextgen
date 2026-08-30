# What the classifier actually does

Read the code before you trust the label.

{{panel:wt-diagnostic-explorer}}

## The algorithm, in full

`detectFlowRegimes` takes a derivative series and does six things.

**One.** It drops every point whose x or derivative is not positive. Negative derivative values, which happen with noise and with recharge, are simply removed rather than classified.

**Two.** For each remaining point it estimates a local log-log slope by central difference over up to two points on each side:

    slope_i = (log10 d_hi - log10 d_lo) / (log10 x_hi - log10 x_lo)

**Three.** It maps that slope to a label with fixed bands: unit slope for 0.85 to 1.2, radial for absolute value at or below 0.12, linear for 0.38 to 0.62, bilinear for 0.16 to 0.34, constant pressure for at or below minus 0.35. Anything else is unlabelled.

**Four.** It groups consecutive points carrying the same label into segments, and discards any segment spanning less than 0.25 of a decade.

**Five.** It applies three ORDERING rules, which are the subject of the next lesson:

- a unit slope that is FIRST is wellbore storage, and one that is LAST is a boundary or pseudo-steady state;
- a constant-pressure stretch with any regime AFTER it is a transition, because recharge does not recover;
- a bilinear stretch with radial or linear flow BEFORE it is a transition, because bilinear flow is near-well fracture geometry and precedes both.

**Six.** It returns every surviving segment with its regime, a readable label, its start and end, and its span in decades. A segment relabelled as a transition is returned like any other: relabelled, never hidden.

## What the ordering rules are worth

They are the difference between a slope classification and something you can read. A slope band is a NECESSARY condition for a regime and not a sufficient one, because a transition between two regimes has a perfectly well defined local slope and it usually falls inside one of the bands.

The next lesson gives the evidence: on the seven fixtures in this course, the rules remove eight labels that were not regimes and leave every genuine one alone.

## What it still does not do

It does not know the LEVEL a segment sits at. A plateau implying 900 mD in a field mapped at 40 is reported exactly like one implying 40, and only you can notice.

It does not know how confident it is. A segment that sat exactly on a band edge and one that sat in the middle of a band are reported identically.

It does not know the pressure. The rules above use only the order of the segments, and there are shapes that ordering cannot separate. A fracture's linear flow legitimately comes first in a test, and so does the roll-off of a wellbore storage unit slope. Telling those apart needs the pressure curve, because during storage the pressure and its derivative coincide, and `detectFlowRegimes` is handed only the derivative. The next lesson has exactly that case, still mislabelled.

And it does not know what reservoir it is looking at, which is the thing being determined. An ordering rule can say a regime is impossible in a position. It cannot say which of two possible regimes is the right one.

## The gaps between the bands

Look at the bands laid end to end: below minus 0.35 is constant pressure, minus 0.12 to 0.12 is radial, 0.16 to 0.34 is bilinear, 0.38 to 0.62 is linear, 0.85 to 1.2 is unit slope.

The gaps are deliberate. A slope of 0.36 is between bilinear and linear and gets no label, which is correct: it is not clearly either.

Those gaps are what stop the classifier labelling everything, and an unlabelled stretch on a plot is the classifier saying it does not recognise the shape. That is a feature, and it is a different statement from the transition label, which says the shape IS recognised and is a passage between two regimes.

## The minimum span

The quarter-decade minimum is what keeps noise from generating segments. It is also what can hide a real, short regime.

A radial plateau that lasts only a fifth of a decade will not be reported at all. That is not a mistake; it is the classifier refusing to call a five-point stretch a flow regime, which is the right call more often than not. But it means an absent label is not evidence of an absent regime.

On the fracture fixture the classifier reports radial flow over exactly 0.25 decades at the very end of the test, right at the threshold. A slightly shorter test would have reported no radial flow at all on the same well.

## The misconception to avoid

"The software identified the flow regimes." The software identified stretches whose local slope fell inside a named band, which lasted a quarter of a decade, and which sit in a position where that regime is possible. Three conditions, all of them necessary, none of them about the LEVEL the segment sits at or about what reservoir would produce it. Those are still yours.

## Exercise

The classifier's radial band is an absolute slope at or below 0.12.

For a derivative that is genuinely drifting slowly upward, compute how much the derivative can rise across one decade while still being labelled radial. Express that as a percentage change in the derivative, and then as a percentage error in the permeability that would be read off it.
