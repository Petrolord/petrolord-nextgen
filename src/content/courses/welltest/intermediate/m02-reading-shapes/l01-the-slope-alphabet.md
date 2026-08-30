# The slope alphabet

Four numbers, and every diagnosis in classical well testing is built from them.

{{panel:wt-diagnostic-explorer}}

## The alphabet

On a log-log plot of the Bourdet derivative against time, each flow regime is a straight line, and the slope of that line identifies the regime.

| slope | regime | what it means physically |
|---|---|---|
| 1 (early) | wellbore storage | the well is producing its own contents |
| 1/4 | bilinear flow | flow along a finite-conductivity fracture and into it at once |
| 1/2 | linear flow | flow into a plane: a fracture face, or a channel |
| 0 | radial flow | the disturbance expanding freely in a uniform layer |
| 1 (late) | closed boundary | every boundary reached, pseudo-steady state |
| steeply negative | constant pressure | recharge from an aquifer or a gas cap |

Four distinct values, and two of them are the same number distinguished only by where in the test they occur.

## Why the slopes are what they are

Each one follows from how the pressure change grows with time in that regime.

**Storage**: dp is proportional to t, so d(dp)/d(ln t) is proportional to t, which is a slope of 1.

**Linear flow**: dp goes as the square root of t, so the derivative goes as the square root of t, a slope of one half. This is flow into a plane, where the swept area grows only as the depth of penetration.

**Bilinear flow**: dp goes as t to the quarter, giving a quarter slope. It happens when a fracture has finite conductivity, so the pressure drop ALONG the fracture matters at the same time as flow into it from the formation. Two linear flows at right angles, hence the name.

**Radial flow**: dp goes as ln t, the derivative is constant, slope zero.

**Closed boundary**: once every boundary has been felt, the reservoir depletes as a tank and pressure falls linearly in time, so the derivative is proportional to t and the slope is 1 again.

**Constant pressure**: pressure stops changing, dp approaches a constant, and the derivative falls off a cliff.

## The order matters as much as the shape

The alphabet identifies a regime. The ORDER in which regimes occur is what identifies the well and the reservoir, and physics constrains it.

Storage always comes first, because the wellbore is between the reservoir and the gauge. Boundaries always come last, because the disturbance has to travel to reach them. Radial flow is in the middle, when it exists at all.

A fracture's linear and bilinear flow come BEFORE radial flow, because they are near-well geometry. A channel's linear flow comes AFTER radial flow, because it is a boundary effect. Same slope, opposite ends of the test, completely different conclusions.

So reading a derivative plot is reading a sequence, not a set. A half slope on its own is ambiguous; a half slope before the plateau and a half slope after it are different diagnoses.

## What a real plot looks like

Rarely as clean as the table. Real regimes are separated by transitions that occupy as much of the plot as the regimes do, and a transition has a slope of its own that belongs to no regime.

A test that shows a clean unit slope, a clean plateau and a clean doubling is a teaching figure. A test that shows one recognisable plateau and a lot of curvature is a good real test. A test with no recognisable regime at all is common.

## The engine's classifier

`detectFlowRegimes` implements exactly this alphabet as slope bands: 0.85 to 1.2 for unit slope, within 0.12 of zero for radial, 0.38 to 0.62 for linear, 0.16 to 0.34 for bilinear, below minus 0.35 for constant pressure. It computes a local slope over about two points each side, groups consecutive points with the same label, and discards groups spanning less than a quarter of a decade.

It then applies the one piece of ORDER logic it has: a unit-slope segment that is first becomes wellbore storage, and one that is last becomes a boundary.

That is a sensible implementation and it is the subject of the next two lessons, because slope bands alone are not enough.

## The misconception to avoid

"A half slope means a fracture." A half slope means linear flow, and linear flow means fluid moving towards a plane. Which plane depends on when it happens: a fracture face early, a channel boundary late. Reading the slope without reading its position in the sequence is the commonest diagnostic error at this level.

## Exercise

Open the panel and step through all seven fixtures, writing down the sequence of regimes the engine reports for each.

Then, for each fixture, write down the sequence you would EXPECT from the planted truth shown beside it. Keep both lists: the next two lessons are about where they differ.
