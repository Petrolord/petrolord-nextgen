# Quality control

The workflow's checks catch a broken run. Quality control for a forward model is broader: it is how you keep an entire modelling study honest against its data, its calibration and its own history of edits. This lesson is the Expert tier's QC practice, built around the three questions a basin study must survive.

## Does it honour the observations?

A forward model is anchored at the present, and every present-day observable is a free test. Geometry: the model's final depths must reproduce the well's formation tops exactly, and in this engine they do by construction, so a mismatch means the input stratigraphy itself is wrong. Temperature: modelled present temperatures against corrected log temperatures; the fixture's 149.76037539670858 is the kind of number a good well test checks to a few degrees. Maturity: modelled final Ro against measured reflectance profiles, the calibration channel, multiple horizons if the well gives them, because a profile's shape tests the history where a single point only tests the ending.

The order of adjustment when calibration fails is the Professional tier's rule, now with teeth: geometry first, because it is the best observed; heat flow last, because it is the least; and never the kinetics, which are published science, not tuning knobs.

## Does it use its freedoms honestly?

Heat-flow history is the standard free parameter, and the honest use is bounded: shapes physically motivated by the basin's tectonics, rift-decay cooling here, values inside regional analogue ranges, and one history for all wells rather than one per well. The dishonest use, module 5 of the Professional tier warned, is compensation: heat tuned to hide geometry errors. The tell is a calibrated well surrounded by mis-predicted neighbours, and the QC practice is holdout testing, calibrate on some wells, verify on others, exactly cross-validation as the mapping courses taught it.

Erosion amounts are the second freedom, and the signature machinery is their honest constraint: amounts inferred from maturity excess carry the sensitivity curve's error bars, and an amount asserted without a maturity residual to demand it is decoration, not inference.

## Can its results be reproduced?

The study-hygiene layer, unglamorous and decisive. Inputs are versioned: which stratigraphic picks, which TOC dataset, which heat-flow scenario, so that every reported run can be rerun. The comparison set is recorded with each result: a signature means nothing without the twin run's identity. And the one-line run records of the Professional tier scale up to a run register: date, inputs version, purpose, checks passed, one line per run. A study with fifty undocumented runs has one result: that its numbers cannot be audited.

The engine side of reproducibility is already handled, committed goldens and an independent oracle; the study side is yours.

## Worked example

A study's calibration well fits measured Ro beautifully; two nearby wells read 0.15 too low in the model at the same horizon. Run the three questions. Observations: the neighbours fail, so the fit is local, not global. Freedoms: suspect compensation, and check whether the calibration used a heat flow above regional analogues, or a local erosion amount without maturity residuals elsewhere to support it. Reproducibility: pull the run register for what was adjusted last; if the final edit was heat flow at the calibration well, the diagnosis writes itself. Remedy in adjustment order: revisit the neighbours' geometry, then regional heat, and let the calibration well's fit degrade honestly if it must.

## Exercise

State the three QC questions and one concrete test under each. Then answer in one sentence: why are the published kinetics never a calibration knob?

As a self check: honour observations, for instance modelled against measured reflectance profiles on multiple horizons; use freedoms honestly, for instance holdout wells against a single regional heat history; be reproducible, for instance a run register naming inputs and twins for every result. Kinetics stay fixed because they are the cross-basin calibration standard, laboratory-derived and oracle-checked, and a model that retunes them can fit anything while meaning nothing, the vitrinite scheme's fixedness being the one anchor every basin study shares.
