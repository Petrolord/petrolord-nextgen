# Working the capstone

There is a right order for a flow assurance study, and most of what goes wrong comes from taking the steps out of it.

{{panel:pd-hydrate-explorer}}

## Write the boundary down first, before any pipe

Neither engine computes a hydrate temperature. Take the flowing and the shut-in boundary, record where each came from, and treat every later margin as conditional on them. A line packs up after a shutdown, so the shut-in boundary is the higher of the two and the one a no-touch time is measured against.

## Build the stack, then count the terms

`overallU` returns a `resistances` array. Count its entries against what was handed in: two films, one per layer, and one burial entry if a trench was asked for. A trench shallower than half the coated diameter comes back as NaN, is caught and dropped, and the return is then the exposed line with `ok: true` and no note. On the published 8.625 in coated diameter that floor is 0.35937500 ft. Counting terms is the only check the API offers.

## Carry the reference diameter with the coefficient

Read `referenceIdIn` and never separate it from the U. The three consumers take a bare diameter and cannot see that field, so pairing them is the caller's job. The check is the product: U times its own reference diameter is the same whichever reference was chosen, and pi times it is one over the total resistance.

## Run heat loss before Joule-Thomson, and keep both

Compute the arrival with no pressures passed and write it down. Then pass the pressures and write the second arrival beside it. The difference is the Joule-Thomson term as the engine applies it, undamped. Compute ntu / (1 - exp(-ntu)) from the ntu the profile returns, divide the term by it, and report all three arrivals. Three arrivals with the damping factor beside them is an answer somebody can check. One arrival is a number.

## On a shutdown, check the sign before reading hours

Set the start temperature against the target. If the target is the higher there is no no-touch time, and `cooldownTime` will not say so: it returns negative hours with `ok: true` and a station table that runs backwards. Then list the layers, decide which go into the two mass slots, and report what was lumped and what was left out.

## Size the dose, then check it yourself

`inhibitionRequirement` picks a concentration with one relation and checks it with another, never comparing the two. Take `depressionCheck.recommendedF` from the return and set it against `neededDepressionF` by hand. Where the check is null nothing was checked.

| Step | What passing looks like |
| --- | --- |
| Boundary | Flowing and shut-in, both with a source |
| Stack | Term count matches what was asked for |
| Reference | Diameter travels with the coefficient |
| Arrival | Heat loss, engine and damped, all three |
| Cooldown | Start above target, checked before hours |
| Mass | What was lumped, written down |
| Dose | Check compared against the need by hand |

## Exercise

Work a screen of this kind through that order, one line for each step.

Then name the step that, taken out of order, leaves every later number defensible and the verdict wrong.
