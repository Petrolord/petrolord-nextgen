# Releases and plumes it does not model

An Expert is judged as much by knowing where a tool stops as by using it well. This module lists what the consequence engine does not do, read from its header and its validation record and checked against what it exports. This lesson covers the release and dispersion end of the chain. Nothing here is taught as computed: each item is named as out of the engine, with what the analyst does instead.

## Four absences at the release end

| not in the engine | why, from the engine header and its validation record | what the analyst does instead |
| --- | --- | --- |
| two phase discharge | no public closed form was read with a worked example; the Yellow Book two phase models are numerical | uses a two phase model outside this engine for a flashing liquid |
| unconfined pool spreading | the Yellow Book spreading model is a differential equation for a fed pool; only a stated thickness is implemented | states a thickness and says where it came from |
| an instantaneous puff | the puff sigmas were not in a source read | models a short release with a puff model elsewhere |
| urban dispersion coefficients | a sourced urban sigma_y was not available; only the rural Briggs set is here | uses the rural set with care, or another tool, in a built-up area |

The reasons differ in detail: no source with a worked example was read, a coefficient was not available, or the published model is numerical or a differential equation. In each case the engine's authors left the model out rather than type one with nothing behind it. That is the validation principle of this whole course applied to scope.

## How each absence shows up

Two phase discharge is the absence to watch most closely. A pressurised liquefied gas flashes as it leaves the hole, and the liquid orifice equation assumes a liquid that stays liquid. The engine gives a liquid rate and a gas rate; it has no rate for a flashing release. Choosing either one for such a release is a modelling decision the note must defend.

The spreading model is absent by name. Ask for a pool with neither a bund nor a thickness and the engine refuses:

> bundAreaM2: a bund area (confined pool) or a pool thickness (unconfined pool) is required: no spreading model is implemented

The puff and the urban coefficients do not refuse, because there is no argument to ask for them. The plume is continuous and the sigmas are rural; a short release or a built-up site is still computed as a continuous plume over open country if you call it that way. The absence is silent, so the analyst must supply the judgement.

## Two edges that are modelled

Two limits at this end ARE in the engine and should not be confused with absences. Outside 100 m to 10 km the Briggs sigmas are still returned, with a warning in the engine's words: "the downwind distance is outside 100 m to 10 km, the range these curves are usually quoted for; treat the result as an extrapolation". And the plume has no calm air form, so a wind speed of zero is refused:

> windSpeedMS: must be above 0 m/s: the Gaussian plume divides by the wind speed and has no calm-air form

A warning travels with a number and a refusal replaces it. Both belong in the note.

## Exercise

Take a release of a pressurised liquefied gas from a small hole into a town centre on a still night. Write the paragraph of a consequence note that lists which of the four absences above apply, what you would use in place of each, and which parts of the calculation you could still run in this engine. Then name the one refusal you would expect if you tried to model the spill as an unbunded pool without a thickness.
