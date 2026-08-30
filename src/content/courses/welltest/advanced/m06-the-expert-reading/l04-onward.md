# Onward

What you can do, what you should not claim, and where this sits in the wider work.

## What the three tiers gave you

**Associate.** The classical straight-line analysis: the semilog slope, permeability, skin, the skin pressure drop, flow efficiency, Horner and MDH, p*, and the discovery that the choice of window moves the permeability by a factor of nearly four and inverts the sign of the skin.

**Professional.** The derivative as the diagnosis: the slope alphabet, the required ordering of regimes, the engine's classifier and its transitions-as-regimes failure mode, the boundary gallery, the fracture and the horizontal well, dual porosity, and the data preparation that makes any of it readable.

**Expert.** The regression and its limits: log residuals, bounds, the confidence interval that measures the optimiser, the phantom fault, the model that degenerates at a bound, superposition and rate history, gas pseudo-pressure and deliverability, and rate transient analysis for oil, gas and linear flow.

## The single most useful habit

Write the interpretation down as a chain, and make every link explicit.

    the data ->
    the preparation ->
    the diagnosis (regimes, intervals, levels, ordering) ->
    the model ->
    the fit (settings, starting values, bounds) ->
    the parameters (with which ones the data actually constrained) ->
    the uncertainty (fit, and separately inputs) ->
    the alternatives that also fit

Every failure in this course happened at a link that was not written down. The window that included storage. The regime that was assumed rather than diagnosed. The model with a parameter nothing constrained. The rate history that was not looked at. None of them were arithmetic.

## What not to claim

Do not claim a permeability to more than two significant figures from a single test.

Do not claim a boundary distance unless the diagnosis showed a boundary.

Do not claim a fracture half-length without stating the permeability it assumed.

Do not present a fit's confidence interval as the uncertainty of the result.

Do not report an absolute open flow without naming the method.

Each of those is something this course demonstrated rather than asserted, and each of them appears routinely in reports.

## Where this connects

Well test analysis does not stand alone.

The permeability and skin feed the inflow performance relationship that nodal analysis is built on, and a skin from a test is the input to a stimulation candidate ranking.

The drainage volume and the oil in place feed material balance and reserves, and disagreements between a test volume and a volumetric estimate are geological information about compartmentalisation.

The flow capacity feeds a simulation model, and it is one of the few dynamic constraints available on a static permeability distribution.

And the rate transient methods here are the same physics as decline curve analysis approached from the pressure side, which is why a well with both a rate history and a flowing pressure record supports far more than a rate history alone.

## The one sentence

A well test measures a pressure history. Everything else is a chain of choices, and the value of an interpretation is set by how much of that chain the report lets somebody else check.

## Exercise

Take a well test report you have access to, or the last one you wrote.

Go through the eight links of the chain above and mark which ones the report states. Then write the three questions you would send back to its author.
