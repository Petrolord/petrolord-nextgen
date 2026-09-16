# Duty into pounds an hour

{{panel:fc-fire-drum-explorer}}

A relief valve is sized on a mass flow. The pool fire duty is a heat rate. The bridge between them is one division, and the thing divided by is a latent heat of vaporisation.

## The relation, and what it assumes

The relief load is the duty divided by the latent heat of the boiling liquid. Behind that division is a model: all the heat arriving at the shell goes into boiling liquid at the relieving pressure, and the vapour generated is what the valve has to pass.

Three assumptions are inside it. The liquid is at its boiling point at the relieving pressure, so no part of the duty goes into heating it up. The vapour leaves as fast as it forms. And the latent heat is one number for the whole event rather than something that moves with pressure and composition. All three are the standard screening basis, and the engine leaves them to you.

## The teaching chain at its stated latent heat

| step | value |
| --- | --- |
| wetted area | 683.6960 ft2 |
| pool fire duty | 4434115.2612 Btu/hr |
| latent heat, stated | 128.000000 Btu/lb |
| relief load | 34641.5255 lb/hr |

The latent heat is stated rather than derived. This module carries no property tables, so the number comes from wherever you got it, at whatever pressure you looked it up, and the engine accepts it.

## The published load cases

| published duty Btu/hr | latent Btu/lb | published load lb/hr | engine load lb/hr | relative difference |
| --- | --- | --- | --- | --- |
| 4138017.5155 | 150.000000 | 27586.7834 | 27586.7834 | 5.876e-10 |
| 10000000.0000 | 100.000000 | 99999.9999 | 100000.0000 | 5.876e-10 |
| 6791329.6724 | 87.500000 | 77615.1962 | 77615.1963 | 5.876e-10 |

Three rows, and the same relative difference on all three. That is the signature of a pure unit conversion: the discrepancy is not case dependent because it is the rounding in the published constant rather than anything about the cases.

The middle row is worth a moment. A published load of 99999.9999 against an engine load of 100000.0000 is one number written two ways, and reporting that as a disagreement reports somebody's print format.

## The unit trap on this step

The division looks trivial and it has one real trap. A duty is in Btu an hour and a latent heat is in Btu a pound, so the quotient is pounds an hour and nothing has to be converted. That is a happy accident of the USC set and it does not survive a move to SI, where a duty in kW against a latent heat in kJ per kg gives kilograms a second.

So a latent heat borrowed from an SI property table is converted before it goes in, and a load read out of this route is labelled pounds an hour before it goes anywhere else.

## What the oracle can and cannot check here

The validation oracle for this route re-derives every unit packaging, taking Btu, hours and pounds through kW and kilograms a second and back. So the arithmetic and the units are genuinely checked by an independent path.

What it cannot check is the latent-heat method itself, because that method is the model this route is. There is no more fundamental route in this package to compare it against. A check that cannot reach the model has to say so, and this one does.

## Exercise

Write down the three assumptions inside the duty-to-load division. Then record the teaching chain from wetted area to relief load with its stated latent heat, and say what the validation oracle does and does not reach on this route.
