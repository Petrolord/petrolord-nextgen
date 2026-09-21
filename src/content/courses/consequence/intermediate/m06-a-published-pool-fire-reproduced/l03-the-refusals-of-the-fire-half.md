# The refusals of the fire half

{{panel:cq-fire}}

Every function in the engine returns a result or a refusal. A refusal names the field that caused it and says why in the engine's own words, and it carries no number. The fire half of the engine has its own set, and most of them guard a place where a formula would otherwise return a plausible number that means nothing. This lesson gathers the six a professional meets most often, quoted exactly as the engine returns them.

## A boiling point below ambient

`poolBurningRate` with the Burgess method refuses a liquid whose boiling point sits below ambient, naming `boilingPointK`:

> boilingPointK: is below ambient: the liquid boils, and the printed Burgess form assumes a liquid heated from ambient to its boiling point

The printed form would shrink its denominator and inflate the burning flux. For a liquefied gas, use the Babrauskas row the table carries.

## No air viscosity

`poolFireTilt` has no default viscosity. Leave it out and the engine refuses, naming `airKinematicViscosityM2S`:

> airKinematicViscosityM2S: must be above 0 m2/s (air at 15 C is about 1.5e-5; the YB example prints 7.5133e-6)

The message gives both the physical value and the published one, and the choice is yours to state.

## A flame that leans over the target

`cylinderViewFactor` refuses a target under a tilted flame, naming `tiltDeg`:

> tiltDeg: the tilted flame reaches over the target (1 + (L/R) sin(tilt) >= X/R): the closed form does not apply to a target under the flame

Beyond this line the closed form counts flame surface behind the target as seen, and its Fv goes wrong. The refusal is the engine's judgement, because the Yellow Book states no domain for the formula.

## Two refusals about the transmissivity

`atmosphericTransmissivityBagster` refuses a path too short for the fit, or too long, whenever its pw x product falls outside the band, naming `pathLengthM`:

> pathLengthM: pw x lies outside 1e4 to 1e5 N/m, where the YB advises against the Bagster fit: supply a transmissivity from another source

In either case, state a transmissivity from another source.

`solidFlameDistanceForHeatFlux` refuses a distance search with no fixed transmissivity, naming `transmissivity`:

> transmissivity: a fixed transmissivity in (0, 1] is required for a distance search

A Bagster value recomputed at every step would walk out of its band as the search moved.

## A fuel the table does not carry

`poolBurningRate` refuses a fuel outside Table 6.5, naming `fuel`:

> fuel: must be one of liquid-hydrogen, lng, lpg, butane, hexane, heptane, benzene, xylene, gasoline, kerosene, jp-5, methanol, ethanol, or give massBurningFluxInfKgM2S and kBetaPerM

The way forward is written into the message: state your own asymptote and k beta product, with their source.

## Exercise

Work the fire panel to produce four of the refusals above, one at a time, starting from ERHA or the stated view factor flame: the viscosity, the overhang, the Bagster band and the distance search. For each, write down the input you changed, the field the panel named, and one sentence on what you would state in a consequence note to proceed. The panel offers neither the Burgess method nor a fuel outside its list, so for those two write down the call that would draw each refusal instead.
