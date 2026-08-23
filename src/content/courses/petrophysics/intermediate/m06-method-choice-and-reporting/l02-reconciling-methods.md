# Reconciling methods

The intermediate workflow produces three porosities and three saturations for every sample. The temptation, faced with that spread, is either to pick one arbitrarily or to average them all and move on. Both are wrong. Reconciliation is the professional skill of choosing a primary method for a stated reason, keeping the alternatives as evidence, and explaining every disagreement from physics. This lesson gives you the decision framework used on the typewell and transferable to any well.

## Porosity: primary, backup, comparison

The three SAND_A porosity means from the earlier modules are:

* Neutron-density average, $\phi_{ND}$: 0.1762
* Density only, $\phi_D$: 0.2022
* Wyllie sonic, $\phi_W$: 0.2069

Book $\phi_{ND}$ as primary. The neutron-density pair is the standard because the two tools err in opposite directions in shale and in gas, so their average is more stable than either input, and the crossplot behind them carries its own lithology check.

Keep the sonic as the bad-hole backup. The sonic tool reads the formation along a refracted path close to the borehole wall and tolerates rugosity that wrecks the density pad contact. On the typewell the hole is in good shape and the sonic is never promoted, but the report still states $\phi_W$ so that a later reader can see what the backup would have given.

State the density-only value for comparison. On the typewell $\phi_D$ sits between the other two in the sand, and the gap between $\phi_D$ and $\phi_{ND}$ is a direct measure of how hard the neutron is pulling the average around.

The reconciliation sentence for the typewell is short: the primary $\phi_{ND}$ of 0.1762 sits below $\phi_D$ at 0.2022 because the neutron reads low in this clean gas-free sand, and below $\phi_W$ at 0.2069 because the Wyllie transform runs optimistic in uncompacted section. One sentence, both gaps explained, no hand waving.

## Saturation: baseline plus one shaly-sand model

Run Archie always. It is the baseline every other model degenerates to, and its zone mean of 0.4478 for SAND_A anchors the comparison. Then run one shaly-sand model chosen for the setting: Simandoux for moderate salinity and dispersed clay, Indonesia where waters are fresh and its empirical calibration is appropriate. The typewell exercise runs both so you can see the spread; a real report typically commits to one and says why.

The SAND_A means span 0.4280 (Indonesia) to 0.4478 (Archie), a spread of about 0.02. Part of the reconciliation is explaining why the spread is small: SAND_A is clean, linear $V_{sh}$ in the zone is near zero, and both shaly-sand equations collapse to Archie as the shale term vanishes. A small spread in a clean sand is not a coincidence; it is the models agreeing where they should agree.

## When methods disagree strongly

Strong disagreement is not a nuisance, it is a diagnostic. The location of the disagreement localises the problem:

* Porosities diverging in a shale interval point at clay effects: the neutron reads bound hydrogen, the density reads the shale grain density, the sonic reads slow shale transit.
* Density porosity spiking against a quiet sonic points at bad hole, because the pad tool suffers first.
* Neutron dropping against a rising density porosity, the crossover, points at gas.
* Archie splitting away from the shaly-sand models flags exactly the samples where clay conductivity matters, which is useful information about where the sand is dirty.

In each case the professional response is the same: identify the interval, name the physical cause, decide which method remains trustworthy there, and document the decision. The methods are instruments in disagreement, and the disagreement is data.

## What reconciliation is not

Reconciliation is never blind averaging of models. Averaging Archie with Simandoux produces a number with no physics behind it: it is not the solution of any saturation equation, and its error behaviour is unknown. The neutron-density average is not a counterexample, because that average is itself a calibrated method with known error cancellation, chosen deliberately. The rule is that every booked number must be the output of a named method, selected for a stated reason, with the alternatives reported alongside it.

## Worked example

Write the saturation reconciliation for SAND_A in three steps:

1. Baseline: Archie mean 0.4478.
2. Shaly-sand: Simandoux mean 0.4335, Indonesia mean 0.4280.
3. Explanation: spread of about 0.02 saturation units, consistent with near-zero $V_{sh}$ in the zone; the shaly-sand corrections are small because there is little shale to correct for; book the Simandoux value 0.4335 with Archie quoted as the conservative bound.

Three lines, and a reviewer knows what was run, what was booked and why.

## Exercise

SAND_B carries more shale than SAND_A. Its zone means are 0.7692 (Archie), 0.7504 (Simandoux) and 0.7455 (Indonesia). Compute the Archie-to-Indonesia spread for both zones and state, in one sentence each: why the SAND_B spread (self-check: 0.0237) is larger than the SAND_A spread (self-check: 0.0198 against the Archie baseline 0.4478), and which single input curve drives that difference.
