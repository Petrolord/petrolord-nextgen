# What the profile refuses

`steadyStateProfile` refuses two things, correctly declines to refuse a third, and accepts several inputs that describe a different line from the one being asked about.

{{panel:pd-line-explorer}}

## The two it refuses

A zero length and a zero U, both with the same message: the profile needs a length, a mass rate, a heat capacity and a heat transfer coefficient. That is a presence check on four inputs and it is the whole of the checking.

## The one it is right not to refuse

Given an inlet 20.0 degF below the 40.0 degF ambient it returns `ok = true` and an arrival of 39.5203295082 degF. A line colder than its surroundings warms towards them on the same exponential, and the module handles it with no special case at all. This is the one direction of the balance that needs none.

## What it accepts and should not

A coefficient that describes a different pipe. The published stack with a 3.0 ft trench entered as 0.3 ft comes back with 4 terms instead of 5 and U 1.3348791131 instead of 0.7455927364, an error of 79.035960 percent, with `ok: true` and no note. `burialResistance` returned NaN there and `overallU` caught it and dropped the term rather than refusing on it.

A coefficient referred to the wrong area. On the published buried build, the 8.625 in coated outside diameter U of 0.501513997498 handed to the profile with the 6.065 in bore arrives at 138.61917975 degF over 26400.0 ft, against the correct 125.06144556 degF, an error of 13.55773419 degF.

Neither is visible in anything the profile returns. Counting the entries in the `resistances` array against what was handed in is the only check the API offers: two films, one entry per layer, and one burial entry if a trench was asked for.

## The refusal that cannot be checked

`relaxationLengthFt` refuses a zero U, a zero mass rate and a zero heat capacity, and refuses them as a bare NaN rather than an object with a reason. There is no `ok` field to test, so an unchecked caller carries the NaN into an ntu, an arrival and a margin. The conductivity helper in the same file states the discipline the trench branch broke: a NaN propagates into a refusal, a plausible wrong number does not.

## The one it will never compute

The hydrate boundary. `flowlineThermal` says hydrate and wax boundaries are fluid properties that come from a lab or a compositional flash and the consumer supplies them. There is no boundary field, no margin field and no verdict in anything the profile returns, and `ok: true` is a statement about four inputs.

## Exercise

Give the panel a U that came from a trench entered at a tenth of its depth and record the arrival.

Then say which returned field would have shown the mistake, and what you would check by hand instead.
