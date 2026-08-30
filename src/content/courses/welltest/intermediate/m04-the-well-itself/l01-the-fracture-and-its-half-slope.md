# The fracture and its half slope

Three decades of linear flow, and no radial flow worth the name.

{{panel:wt-diagnostic-explorer}}

## The well

The fracture fixture is a vertical well with a hydraulic fracture of half-length 250 ft, infinite conductivity, in rock of 5 mD. Skin zero, storage 0.002 bbl/psi. It runs from 0.001 hours to 316.22776601683796 hours.

Notice the permeability. Everything else in this course is 85 mD; this well is in rock seventeen times tighter. That is not arbitrary: nobody fractures 85 mD rock, and the flow regimes a fracture produces are only visible when the formation is tight enough that the fracture dominates.

## What infinite conductivity means

The fracture conducts fluid so much better than the formation that there is no measurable pressure drop ALONG it. The whole fracture is at the wellbore pressure.

That makes the fracture face a plane held at constant pressure, and fluid moves towards it perpendicularly from both sides. That is linear flow, and it is the whole early response.

The finite-conductivity case, where the pressure does drop along the fracture, gives bilinear flow and a quarter slope first. The engine carries both models; this fixture is the infinite one.

## The half slope

Linear flow into a plane gives a pressure change proportional to the square root of time, so the derivative rises with a slope of one half.

On this fixture the engine's classifier reports linear flow from 0.001 hours to 1.7782794100389228 hours, a span of 3.25 decades. Three and a quarter decades of a single clean regime is exceptional and it is what a well-designed fractured-well test looks like.

Compare that against the radial flow it reports at the end: from 177.82794100389228 to 316.22776601683796 hours, a span of exactly 0.25 decades, which is the classifier's minimum. Radial flow on this well is barely present, at the very end of a test that ran for nearly two weeks.

## What that means for the analysis

A fractured well in tight rock is not a semilog problem. The semilog straight line, which is the entire Associate tier, is either absent or is the last quarter decade of a very long test.

The analysis is instead built on the linear-flow line: pressure change against the square root of time on Cartesian axes, whose slope gives the fracture half-length. That is the next lesson.

And this is the general situation for unconventional wells. A multi-fractured horizontal well in shale may never reach radial flow in its producing life. The methods that work there are linear-flow methods and rate transient analysis, both of which this course covers, and the semilog line never appears.

## Reading the sequence

The engine reports three segments on this fixture: linear, then bilinear from 23.71373705661655 to 100 hours, then radial.

The middle one is reported as a TRANSITION rather than as a regime, and module 2 is why. Its local slope passes through the bilinear band on the way from a half to zero, and a slope band alone would have called it bilinear flow.

The ordering rule settles it. Bilinear flow is a FINITE-conductivity fracture effect and it happens BEFORE linear flow, not after, so a bilinear stretch with linear flow already behind it is a transition. This fixture has infinite conductivity anyway, so there is no bilinear period in it at all.

## The storage question

With a storage coefficient of 0.002 bbl/psi and a test starting at 0.001 hours, the storage period is short and largely over before the record begins. That is why linear flow is visible from the first point.

On a real fractured well that is often not true, and the early linear flow is buried in storage. Recovering a fracture half-length then requires either a downhole shut-in or the model fit, which uses the whole curve.

## The misconception to avoid

"A fracture gives a negative skin, so a fractured well can be analysed with a semilog line and a negative skin." That equivalence holds only at late time, once radial flow has been established around the whole fractured system, and it hides everything the test was run to learn. The fracture half-length, which is what the completion engineer needs, is in the linear flow, and it is gone by the time the equivalent-skin description becomes valid.

## Exercise

Open the panel on the fractured-well fixture and read the derivative at 0.01, 0.1, 1 and 10 hours.

Take base-ten logarithms of both the times and the derivatives and confirm the slope is close to one half over the first three. Then say what the fourth point shows and where in the sequence it sits.
