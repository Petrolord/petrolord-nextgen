# Predicting torque from a hookload fit

The cross-check that matters, and what it catches.

{{panel:td-friction-explorer}}

## The setup

Fit the open-hole friction factor to an observed pick-up hookload. Then, without refitting, compute the rotating torque that factor implies and compare it against the measured off-bottom torque.

Two independent observations, one fitted parameter. The comparison is the test.

## Why the test has power

Because the two observations depend on the friction factor through DIFFERENT paths.

Hookload depends on `fa mu N` integrated along the string, with fa near 1 for a trip.

Torque depends on `ft mu N r` integrated along the string, with ft near 1 for pure rotation, and with the tool joint radius in it.

A factor that is wrong because the side force distribution is wrong will miss both, but usually not by the same proportion, because the side force distribution enters the two integrals with different weightings: torque weights by the local contact radius and hookload does not.

## What it catches

**A wrong contact radius.** Torque is proportional to it and hookload is nearly independent of it. A missing tool joint diameter is a 25 percent torque error and almost no hookload error, so a hookload fit predicts a torque a quarter too low.

**A missing stabiliser or reamer.** Same mechanism: a local contact with a large radius that the string description does not have.

**Cuttings.** A cuttings bed produces axial ploughing force that is not proportional to normal force, and it produces relatively less rotational resistance. So a factor fitted to a hookload in a dirty hole over-predicts the torque.

That last one is a real and useful signal: hookload high, torque normal, points at hole cleaning rather than at geometry.

## What it does not catch

A wrong mud weight, because it scales both similarly.

A wrong survey in a way that scales the whole side force, because again both scale.

So the test is a filter rather than a proof. Passing it removes a specific class of errors and leaves others.

## The numbers on the worked case

On the build-and-hold well, fitting to a pick-up hookload of 1100000 N gives 0.39698485180907916, and that factor implies a rotate-on-bottom torque of 29279.912795337634 N.m against 26934.19951651723 N.m at the book value of 0.35.

That is an 8.709051395352985 percent difference in torque for a 13.424243374022616 percent difference in the factor. If the rig's measured torque sat at the book value while its hookload sat at the fitted one, that discrepancy is the diagnosis.

## The discipline

Never report a fitted factor without also reporting what it predicts for the observation you did NOT fit to.

One number and one observation is a tautology. One number and two observations is a test.

## Exercise

Fit a factor on the horizontal well to a pick-up hookload of 700000 N and read the torque it implies.

Then say which of the three error types above would be most likely to explain a measured torque 20 percent below that prediction, and what you would check first on the rig.
