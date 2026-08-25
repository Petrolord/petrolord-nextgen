# The rejoin and the limits

Two structural facts complete the Bowers machinery: where the two curves meet, and where both stop being trustworthy. Short lesson, load-bearing content, and then the course's climax in the next one.

## The rejoin, exactly

At $\sigma' = \sigma_{max}$ the unloading bracket collapses to $\sigma_{max}$ and the two curves are the same equation. The engine demonstrates the identity to the last bit: vLoading at 50 MPa is 3919.263125861896 m/s and vUnloading at 50 of 50 is 3919.263125861896, equal as doubles, not merely close. The same collapse happens for any stress if $U = 1$: no irreversibility, one curve.

Why the rejoin matters practically: it anchors the unloading curve's high end to the loading calibration. A basin's A and B, fitted on normally pressured loading sections, automatically position the START of every unloading path; only the path's flatness, U, needs unloading-specific calibration. The two-curve system shares parameters where sharing is physical, which is why it needs only two extra numbers rather than a whole second calibration.

The rejoin also gives the inversion a domain rule: a velocity implying a loading-equivalent stress ABOVE sigma_max is inconsistent with the assumed history, since the rock cannot sit above the curve it departed from. The engine's unloading inversion will return a stress above sigma_max in that case, which is the arithmetic flagging that the assumed maximum is too low or the rock is still loading; either way, the parameters, not the rock, are wrong. On the graded numbers: the loading-equivalent 29.24 sits below the assumed 50, consistent, no flag.

## The limits both curves share

Worth stating as one list, since module 6's QC inherits it. Both curves describe SHALE compaction physics: sands, carbonates and cemented intervals are off-model, exactly as they were off-trend for Eaton, and the screening discipline transfers unchanged. Both consume VELOCITY: every sonic-quality hazard, washout, gas, anisotropy near salt, feeds straight through, with lesson 5 of module 4's error gain setting the price. Both assume the frame: overburden error passes into pore pressure with full weight through the subtraction, for Bowers exactly as for Eaton, and this shared input is the one place the two methods' errors are correlated, which subtracts a little from what their agreement can prove.

And both are calibrations, not laws. A, B, U and sigma_max are fitted constants with basin-sized error bars. The golden values are a teaching fixture; the numbers in any real report are somebody's regression, and asking to see the calibration data behind them is not rude, it is the job.

## What the two-method system cannot do

A candid boundary, before the cross-check lesson leans on agreement: Eaton and Bowers share the sonic, share the frame, and share the compaction-physics worldview. Their agreement defends against implementation error, trend error, and calibration-family error, which is most of what goes wrong. It does NOT defend against a bad sonic, a bad overburden, or a mechanism outside both models, a gas-charged interval fools both; a truly independent check needs different DATA, a measured pressure, a drilling response, resistivity-based methods, not just different mathematics on the same log. The cross-check is a strong test, and knowing exactly how strong is part of using it honestly.

## Worked example

Exercise the domain rule numerically. Assume unloading with sigma_max 25 MPa, U 3, and feed the inversion this well's TD velocity, 3691.0906301457703 m/s. The loading-equivalent is 43.752391704220855 MPa, ABOVE the assumed 25: inconsistent history. The arithmetic, if run anyway: $25 \times (43.752391704220855/25)^3 = 25 \times 1.7500956681688342^3 = 134.0063499838033$ MPa of claimed effective stress, which exceeds the overburden's 91.12 and implies a pore pressure of minus 42.88 MPa. The absurd output is the system working: an impossible number traced back through the chain lands on the impossible assumption, that this rock's maximum stress was 25 when its velocity requires at least 43.75 on the shared curves.

## Exercise

Explain in two sentences why the rejoin at sigma_max, rather than at some other stress, is required by the physics the curves encode, and what a hypothetical unloading curve that crossed ABOVE the loading curve would imply.

Self check: the unloading path begins at the moment stress starts falling, and at that moment the rock is a loading rock at sigma_max, so the two curves must share that point by construction; the unloading curve exists only below it. A curve above the loading curve would claim an unloaded rock is FASTER than a loading rock at the same current stress by more than its history explains, which the model forbids because unloading can only preserve stiffness, never add it; observed points above the loading curve mean cementation or lithology change, not unloading, and they are screened out rather than fitted.
