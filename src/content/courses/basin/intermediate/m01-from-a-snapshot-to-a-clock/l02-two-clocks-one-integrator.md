# Two clocks, one integrator

The engine that powers this tier carries two reaction states for every source layer, advances both with the same integrator, and never lets one feed the other. This lesson is about why that separation exists, because conflating the two states is the classic implementation mistake in basin modelling software, and it was the headline defect found when this engine's ancestor was audited.

## The vitrinite state

Vitrinite is a specific component of organic matter, derived from woody plant tissue, and its optical reflectance rises irreversibly as it is heated. That makes it a natural thermometer-with-memory, and a measured Ro from a well sample is the calibration point almost every basin model is judged against.

The Easy%Ro scheme models vitrinite maturation as twenty parallel first-order reactions. The state is twenty numbers, the unreacted fraction in each bin, initialised to the published stoichiometric weights. The weights are fixed by the publication. They do not depend on what kind of kerogen your source rock holds, because vitrinite is vitrinite wherever it sits. The frequency factor is likewise pinned at $10^{13}$ per second. Nothing about this state is a tuning knob.

From the state, one number is extracted: F, the total reacted weight. The reflectance is then $R_o = e^{-1.6 + 3.7F}$, a formula you will take apart in module 2.

## The kerogen state

The kerogen state answers a different question: how much of this source rock's generative potential has been spent? Its twenty numbers are initialised to the potentials of a kerogen type from the library. The golden fixture uses Type II, the standard marine kerogen, whose potentials peak at 54 kcal/mol and sum to 1. Type I and Type III have their own spectra, and module 4 compares all three.

From this state the engine extracts the transformation ratio, $TR = 1 - \sum x_i / \sum x_i^0$, the fraction of the initial potential that has reacted. TR is what generation will be proportional to, one tier up.

Unlike the vitrinite parameters, kerogen potentials are legitimately editable. A geochemist with pyrolysis data from an actual source rock can and should replace the library spectrum with a measured one. That is not a defect, it is the design: the calibrated thermometer stays fixed while the rock-specific chemistry is swappable.

## One integrator

Both states advance the same way. For a time step at constant temperature, every bin decays exponentially at its own Arrhenius rate, which the next lesson unpacks. The engine literally calls one function, kineticStep, for both states, passing different fractions and, for kerogen, possibly a different frequency factor.

So the difference between the two clocks is entirely in their parameters and their read-out, never in their mechanics. That is worth internalising, because it tells you exactly what kind of errors are possible. If the integrator is right, both clocks are right mechanically, and any disagreement with measured data is a parameter question.

## The mistake this design prevents

The audited defect worth remembering: an earlier implementation drove reflectance from the kerogen state, so that editing a kerogen's potentials silently changed the model's Ro. That breaks the one thing a basin modeller must be able to trust. Ro is the calibration channel, compared against measured well data; if the act of describing your source rock's chemistry moves the calibration channel, calibration becomes circular and the model can be tuned into agreement with anything.

The engine you are using keeps the channels separate: the vitrinite state makes Ro and only Ro, the kerogen state makes TR and, above this tier, mass. You can verify the separation yourself in module 4, where changing kerogen type moves TR by a factor of 132 while Ro does not move at all.

## Worked example

A Type II source layer is initialised. Write down what each state holds at that moment, and what each reads out.

The vitrinite state holds the twenty published weights, summing to 0.85, all unreacted, so F is 0 and $R_o = e^{-1.6} = 0.20189651799465538$. The kerogen state holds the Type II potentials, summing to 1, all unreacted, so TR is 0. Neither state knows the other exists. After any shared temperature history, F and TR will both have grown, each according to its own spectrum, and the pair (Ro, TR) is the tier's complete description of the layer's thermal maturity.

## Exercise

Answer three questions in a sentence each. Which state produces the number you would compare against a measured well sample, and why is it deliberately not editable? Which state's parameters may be replaced with laboratory data? If a colleague's basin model changes its reported Ro when they switch kerogen type from II to III, what do you know about their software?

As a self check: the vitrinite state produces Ro, the calibration channel, and it is fixed because a thermometer you can retune is not a thermometer. The kerogen state's potentials may be replaced with pyrolysis-derived spectra. A model whose Ro moves with kerogen type is driving reflectance from the kerogen state, the exact conflation this engine's design forbids, and its calibrations cannot be trusted.
