# Which conventions travel

A convention is safe where both sides of every comparison it enters are built from it. Apply that test to 0.433 in a plunger balance and it fails twice.

{{panel:pd-remedy-explorer}}

## The test

The ESP treatment of this same constant survives because the design chain and the diagnostics chain are both fed the rounded gradient, so the bias is uniform and cancels at the point of use. That defence is real and entirely local. It holds only while nothing outside the convention is compared against something inside it.

## Where the plunger balance breaks it

The required lift pressure on the published case is the sum of five terms.

| Term | Value, psi | Built from 0.433 |
| --- | --- | --- |
| Line pressure | 120.0000000000 | no |
| Slug hydrostatic | 88.3320000000 | yes |
| Plunger weight | 1.2821115429 | no |
| Gas column | 16.2440440692 | no |
| Friction | 0.0000000000 | no, it is an input |

One term of five carries the convention. The 225.8581556122 psia that comes out is compared against a casing pressure of 600.0 psia, which came from a gauge and was built from nothing. Nothing cancels, because the other side of the comparison holds no matching bias. It survives into the verdict at 0.1076454958 psi, or 0.04763796 percent of the lift pressure.

## Where the gate breaks it

The gate pins `PSI_PER_FT_SG` to 0.433 exactly, which is the convention made enforceable. It then loosens the slug assertion alone to a relative tolerance of 5e-3, because the golden carries the oracle's exact-gradient answer of 88.4396108162 psi and the engine returns 88.3320000000 psi. That single assertion compares a value inside the convention against a value outside it, and the tolerance covering it is 4.109234 times the disagreement.

## The other door in the same domain

Temperature is the same story in another currency. `gasWellLoading` takes degR at the door and `gasProperties` takes degF, so one station is 620.0000 degR or 160.3300 degF depending on which door it enters, and `gasProperties.toRankine` hands back 620.0000 degR. Each module is right and neither knows the other exists.

## The mistake

Carrying an adjudication across a module boundary because the constant is the same. The constant travelling is exactly what makes the adjudication not travel: the reasoning that licensed it depended on both ends of a comparison living inside one chain, and a shared constant in two modules guarantees comparisons that do not.

## What it refuses

Nothing in either module declares its convention. No field names the gradient used, no field names the temperature unit accepted, and no cross-module assertion exists. A convention absent from the return value is enforced by the reader.

## Exercise

Name which of the five lift pressure terms carries the rounded gradient and which do not.

Then say in two sentences why the ESP defence of 0.433 does not license the same constant here.
