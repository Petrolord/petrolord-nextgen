# Time steps and instant deposition

The forward model is a loop over time. This lesson fixes the loop's conventions, and then dwells on the one that most changes how you read its output: layers arrive all at once.

{{panel:bs-charge-explorer}}

## The march

Time runs from the oldest ageStart, 150 Ma, down to zero in steps of 1 Ma, the engine's DT_MA. At each step the model asks which layers exist, stacks their geometry top down from conserved solid thicknesses, builds a thermal grid on that geometry, solves for temperature, and advances every layer's two kinetic states one step at its centre temperature. History is recorded per layer per step: depths, temperature, Ro, TR, generated and expelled mass. One hundred and fifty steps, each one a composition of the three tiers of this course.

The step length matters differently for heat and for kinetics. For the kinetics, the Professional tier proved 1 Ma steps are exact at constant temperature, and within-step temperature changes are the transient solver's business. For the heat, 1 Ma sets the resolution of the transient response, the next lesson's subject.

## Instant deposition

The model deposits a layer in full at its ageStart. The Upper Shale's deposition window in the input, 80 to 20 Ma, describes geological reality; the model's version is 1600 metres arriving at the 80 Ma step, then sixty million years in which deposition adds nothing more.

Watch the source feel it, in the panel's tracks or these engine values. At 81 Ma the source top sits at 1467.7117658564923 m, its temperature 88.19694650623187 degC, its TR 0.0205. One step later the top is 2800 m, the temperature 153.07156059972218 and climbing, and the TR recorded at that same 80 Ma step has already leapt to 0.269. One model step performed sixty real megayears of deposition in an instant; the true basin spread that transition across the shale's sixty million year window.

## What the simplification costs, and what it spares

Cost: timing distortion around each arrival. In the real basin the source warmed through the 90 to 150 degC band gradually as the shale accumulated; in the model it crosses the band in about two steps. The Professional tier's ramp machinery says maturity gained on a climb depends on residence per degree, so the model under-collects reaction during the climb itself and then over-heats slightly early once arrived. Both distortions are confined to the arrival's neighbourhood; a graded consequence is that generation onset dates read sharper in the model than the rock experienced them.

Spared: an entire class of input nobody has. A within-window deposition schedule, sedimentation rate curves per layer, would demand data the fixture does not carry and real basins often lack. Version one takes the honest coarse answer over the detailed guess, documents it, and the documentation is the point: you now know that a step-shaped burial track is a convention, not a discovery, and you will not interpret a model's abrupt maturity onset as geological suddenness.

The follow-on version of the engine records within-window deposition as its planned refinement, exactly because the cost above is understood and bounded.

## Worked example

The Mid Sand arrives at 120 Ma, 1200 m of present thickness deposited in one step. Predict the source's response from the mechanics, then check against the values. Prediction: an instant deepening by the freshly decompacted Mid Sand thickness, a temperature jump, then transient adjustment over the following steps. The engine: at 121 Ma the source still sits at the surface, top 0 and bottom 728.8203220981025 m, at 43.98832639241226 degC; at 120 its top is 1467.7117658564923 m and its centre reads 96.99499328861161 degC; over the next steps the temperature relaxes DOWN, 94.67786299953347 at 119 and 94.04446278867474 at 118, because this step's first estimate overshot the new steady state. Compare the 80 Ma arrival, where the adjustment ran upward, 153.07156059972218 then 161.38 then 164.38: the transient can approach its target from either side, and the next lesson explains why.

## Exercise

State the loop's five per-step actions in order. Then answer in one sentence: why is a step-shaped burial track a convention rather than an error, and what misreading does knowing it prevent?

As a self check: determine existing layers, stack geometry from solid thicknesses, build the thermal grid, solve temperature, advance both kinetic states and record. The staircase is a convention because deposition within each window is deliberately unresolved by version one, trading unavailable schedule data for a documented simplification; knowing it prevents reading the model's sharp burial and maturity onsets as evidence that the basin itself did anything suddenly.
