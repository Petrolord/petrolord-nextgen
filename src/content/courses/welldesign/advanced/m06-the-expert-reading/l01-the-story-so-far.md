# The story so far

Five modules, two wells, and one dimensionless number.

## The claim

Two wells are safely apart when the clearance between their surfaces exceeds their combined position uncertainty at an agreed confidence, and every term in that sentence is a modelling choice with a number attached.

## What each module established

**Module 1.** Anti-collision is a distance check divided by an uncertainty, and the uncertainty is usually the larger term. The closest approach between two wells is generally not at a station of either one, so it is solved in closed form on the minimum-curvature arcs. Centre to centre is not clearance: two hole radii and a tool projection allowance come off first, and on the standard example that is over a metre before uncertainty is considered. Both wells must be in one frame, and the scan is only as complete as the list of offsets it was given.

**Module 2.** The separation factor is clearance over k times the combined sigma, with the sigma obtained by the pedal-curve method rather than by a radial distance, which for a tilted elongated ellipse is a real difference in the unsafe direction. Eleven published standard cases, all reproduced: two clear, four review, five no-go. The thresholds of 1.0 and 1.5 are consensus rather than calculation, and the margin above 1 exists for the errors the model excludes.

**Module 3.** The factor is inversely proportional to k, so the confidence factor must be agreed in advance and not adjusted afterwards. Surface position uncertainty is not in the survey model, is added separately, and dominates the shallow section where platform wells are closest. The tool projection allowance is a geometric correction rather than a safety margin. Wells that share a surface location share uncertainty, and treating it as independent is pessimistic rather than dangerous.

**Module 4.** Three norths, two angles: declination from physics with a date on it, convergence from cartography with none. A one degree reference error is 52 m at 3000 m of reach, larger than the whole uncertainty budget and outside the model entirely. The geomagnetic model is checked here against its publisher's own test values and agrees to the precision they print.

**Module 5.** The traveling cylinder shows direction and the ladder shows exposure, and a report needs both plus the violation list. This implementation differs from the published oracle by under one percent at far-field stations of the one kicked-off case, at factors above twenty, and agrees exactly everywhere a decision is carried. And four things are taught and not certified: gyroscopic models, multi-station analysis and in-field referencing, relief well ranging, and probabilistic collision risk.

## The numbers to carry

- The industry confidence factor: 3.5. The no-go and review thresholds: 1.0 and 1.5.
- The standard example's geometric deductions: 0.4572 and 0.3048 m of hole radius plus 0.3 m of allowance.
- The default surface position sigma: 0.5 m at one sigma.
- A one degree azimuth error at 3000 m: about 52 m.
- Of eleven standard offsets, five are no-go and one is negative.

## The one that matters most

A negative separation factor is not on the same scale as a positive one. Once the envelopes overlap, the factor is inversely proportional to the confidence factor, so widening the confidence interval or admitting a larger surface position error improves the number without moving either well. Report the clearance in metres instead.

## Exercise

Write down the separation factor formula from memory, naming every term and its source.

Then say, for each term, whether it is geometry, a modelled uncertainty, or a convention.
