# The lift pressure

Five terms added together. The gas under the plunger has to hold up everything above it before anything moves.

{{panel:pd-profile-explorer}}

## The five terms, on the published case

6000.0 ft of 2.441 in tubing, a 200.0 ft slug of 1.020 SG liquid, 120.0 psia line, 600.0 psia casing, a 6.0 lb plunger, gas gravity 0.65 at 580.0 degR and z 0.90.

| Term | psi |
| --- | --- |
| line pressure | 120.0000000000 |
| slug hydrostatic | 88.3320000000 |
| gas column | 16.2440440692 |
| plunger weight | 1.2821115429 |
| friction | 0.0000000000 |

Those five sum to a required lift pressure of 225.8581556122 psia. The independent oracle, working in pascals and metres, publishes 225.9658011080 psia, a difference of -0.1076454958 psi, and the slug term accounts for -0.1076108162 psi of it.

The line pressure is the largest term and it is a surface number, so the cheapest change to a lift requirement is often not downhole at all.

## Friction is measured, not modelled

Friction is 0.0000000000 psi because nobody supplied a value. It enters linearly: hand the case 40.0 psi of friction and the requirement becomes 265.8581556122 psia, which is 40.0000000000 psi more. Nothing here estimates it, so a zero friction term means an absent measurement rather than a frictionless plunger.

## The gas column carries an unstated convention

The gas standing above the slug has weight, and the term is a gas density times the height of that column. The convention hides in which pressure the density is evaluated at, and the engine evaluates it at the LINE pressure.

On OGUTA-2 the line is 145.0 psia, the gas density there is 0.5015053107 lbm/ft3, and a foot of column costs 0.003482675768 psi. Over the tubing above the slug that gives a gas column term of 28.0007131786 psi. The gas at the bottom of that column is not at 145.0 psia. It sits near the pressure the balance is solving for, 248.1897322873 psia. The published case has the same spread: 120.0 psia against 225.8581556122 psia.

Read this as a convention rather than an error. The independent oracle carries the term the same way, and the two gas column terms on the published case agree to 3.4680e-5 psi. A defensible choice stated is worth more than a better choice left implicit, and this one is not stated: the header defends carrying the term and never says where it is evaluated.

## The mistake

Recomputing the column at the pressure under the slug, or at the average of the two ends, and treating the disagreement as an engine error. Both readings are defensible and they do not give the same term. The returned object records no pressure for it, so the only way to know which one you hold is to reproduce it: density at the line pressure, applied over the height above the slug, and see whether you land on 28.0007131786 psi.

## Exercise

Add the five OGUTA-2 terms in the panel, confirm 248.1897322873 psia, and rank them by size.

Then add 40.0 psi of friction to the published case and say what that proves about the term you cannot measure.
