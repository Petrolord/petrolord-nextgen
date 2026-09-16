# What it refuses to guess

A named input that is missing, not a number, or outside its domain throws a SeparatorInputError whose input property names the input. No default, no clamp and no fallback stands in for it.

{{panel:fc-separator-explorer}}

## The refusals, in the engine's own words

| what was given | the message |
| --- | --- |
| no mist extractor and no override | "internalsId is required: name a mist extractor from K_BASE or give kOverride" |
| a mist extractor not in the table | "internalsId 'verticalFoam' is not a mist extractor in K_BASE" |
| no pressure to a K lookup | "pPsig must be a finite, non-negative gauge pressure (got undefined)" |
| a negative gauge pressure | "pPsig must be a finite, non-negative gauge pressure (got -20)" |
| a temperature that is not a number | "tF must be a finite temperature in degF (got warm)" |
| no gas gravity | "gasSg must be a finite, positive gas gravity with air = 1 (got undefined)" |
| a liquid level of zero | "liquidLevelFrac must lie strictly between 0 and 1 (got 0)" |

Each message names the input, states the domain and quotes back what arrived. That is enough to fix the row without opening the engine.

## Two kinds of no

The first kind is a throw. The inputs are wrong, so there is nothing to compute and the engine says which input.

The second kind is a returned object with an error string. The inputs are valid and the method has no answer for the state they describe: an unknown sizing mode comes back as { error: "unknown sizing mode 'cylindrical'" }, a vertical vessel with no settling comes back as { error: "a positive settling velocity is needed" }, and a gas heavier than its liquid comes back as { error: "settling needs a positive K and a liquid denser than the gas" }.

The distinction is worth holding. A throw is a typing error. A returned error is a physical or methodological dead end, and it arrives as data so the caller can display it beside the other results.

## A refusal is a finding

A gas gravity that arrives as undefined is not a missing decoration on a report. It is the input that produces Ppr and Tpr, which produce z, which produces the gas density, which produces the settling velocity and the diameter. Defaulting it to anything would give a complete vessel built on a number nobody supplied.

The retired app defaulted in exactly this way, holding z at 0.85 whatever the gas and whatever the conditions, and printed a full set of dimensions every time.

## The domain matters as much as the presence

A liquid level of 0 and a liquid level of 1 are both numbers, both finite, and both refused, because the geometry they describe is a vessel with no liquid or no gas in it. A negative gauge pressure of -20 is likewise a perfectly good number outside its domain. Presence is not validity, and the guard checks both.

## The mistake

Catching the throw and carrying on with a substituted value. The message named the input because the input is the fix. Silencing it moves the fault downstream, where it arrives as a diameter that is merely a little surprising.

## Exercise

Write the message the engine gives for a mist extractor that is not in the table and for a liquid level of zero, and say what each names. Then explain the difference between a thrown SeparatorInputError and a returned { error: "a positive settling velocity is needed" }, and say which of the two a user interface should show beside the results.
