# Working the capstone

There is a right order for the six numbers a professional screen produces, and most of what goes wrong comes from another.

{{panel:pd-line-explorer}}

## Write the boundary down before any pipe

Neither engine computes a hydrate temperature. Record the flowing and shut-in boundary with its source, and treat every margin as conditional on them. A line packs up after it stops, so the shut-in boundary is the higher and the one a cooldown is measured against.

## Build the stack, then count its terms

Count the `resistances` entries against what was handed in: two films, one per layer, one burial entry if a trench was asked for. A trench shallower than half the coated diameter comes back NaN, is caught and dropped, and the exposed line returns with `ok: true` and no note. That floor is 0.35937500 ft on the published 8.625 in coated diameter.

Then read `referenceIdIn` and keep it with the U: the three consumers take a bare diameter and cannot see it. The check is a product: U times its reference diameter in ft is 0.360463185702 on the published buried build whichever reference is named, and pi times that is the reciprocal of the total resistance.

## Lc, then ntu, then the arrival

Compute Lc as m Cp over U pi D and check it before anything else. It is exactly linear in mass rate and heat capacity: doubling the rate multiplies it by 2.0000000000, raising Cp from 0.50 to 0.60 by 1.2000000000. An order of magnitude slip shows there and nowhere later.

ntu is the length over Lc, and the arrival follows from ntu alone once inlet and ambient are fixed. Run stations for shape, never for accuracy: the published arrival is 43.35769344274401 degF at 2 stations and at 501, a difference of 0.0000e+0 degF.

## Invert last, and check the round trip

`uForArrivalTemp` answers a different question, so run it after the forward pass, knowing which side of the target the line sits on. Put the U it returns back through the profile. On the published fluid over 26400.0 ft a 120.00 degF target needs 0.801009837807 Btu/(hr ft2 degF) at ntu 0.559615787935, and the forward run returns 120.000000000000 degF, error 0.0000e+0 degF. A dirty round trip means the diameter or length disagrees between calls.

## On a shutdown, check the sign first

Set the start against the target. If the target is higher there is no no-touch time, and `cooldownTime` will not say so: on one such pair it returned -4.6959175559 hr with `ok: true`, and a station table warming by 24.2422513458 degF. Only then take the time constant as M Cp over U A, decide which layers fill the two mass slots, and record what was lumped. Lumping a coating in moved one teaching cooldown by 3.5480816986.

| Step | What passing looks like |
| --- | --- |
| Boundary | Both, each with a source |
| Stack | Term count matches, diameter travels with the U |
| Lc, ntu, arrival | In that order, stations for shape |
| Cooldown | Sign checked, then hours, then the lumped mass |

## Exercise

Work a screen through that order and write one line for each step.

Then name the step that, out of order, leaves every later number defensible and the verdict wrong.
