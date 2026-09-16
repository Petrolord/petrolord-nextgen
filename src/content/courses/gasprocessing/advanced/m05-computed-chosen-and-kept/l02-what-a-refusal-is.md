# What a refusal is

A refusal is an answer. This module treats it as one, and the shape it gives a refusal is as much a part of the design as the arithmetic is.

{{panel:fc-absorber-explorer}}

## The contract

A state the method has no answer for comes back as an object carrying an `error` string. Nothing in this module throws. A caller checks one property and never catches, and there is no export it has to check differently.

That is a design decision with consequences a reader feels immediately. Exceptions travel up a stack and get caught somewhere the caller did not choose. An error on a returned object stays exactly where the question was asked.

## A refusal names the value it was handed

Look at what the messages carry. A temperature outside the water fit comes back as { error: "the Magnus water-saturation fit holds from -45 to 60 degC (-49 to 140 degF); 140.000001 degF is 60.0 degC" }. The band is there in both units, and the temperature it was given is there, converted to the units the band is stated in.

A caller is therefore told what to change and by how much rather than only that something is wrong. The same habit runs everywhere. An unknown solvent comes back as { error: "unknown amine 'DIPA'; this module carries MEA, DEA, MDEA" }, which names the alternatives. An impossible removal comes back as { error: "an absorption factor of 0.8 caps the removal at 0.8 however many stages are added, and the spec asks for 0.9: no stage count reaches it; raise circulation" }, which names the remedy.

## A refusal carries evidence

Beside the message, several refusals hand back the fields the judgement was made on. The stage count a spec needs when the solvent caps it returns 3 fields. A march that walks off the correlation returns 7 fields. A compressibility off the correlation band returns 6 fields. A contactor whose liquid is lighter than its gas returns 3 fields.

That is the difference between an answer that is missing and an answer nobody can tell is missing. A refusal with its evidence can be acted on without re-running anything.

## Every guard has two sides

A guard is only as good as its edges, so the digest reads each one from both sides.

| guard | value | the engine |
| --- | --- | --- |
| the lean glycol strength, lower edge | 90.000000000 | refuses |
| the lean glycol strength, just inside | 90.000001000 | answers |
| the lean glycol strength, just under the top | 99.999999000 | answers |
| the lean glycol strength, upper edge | 100.000000000 | refuses |
| the water fit, lower edge | -49.000000000 | answers |
| the water fit, below the lower edge | -49.000001000 | refuses |
| the water fit, upper edge | 140.000000000 | answers |
| the water fit, above the upper edge | 140.000001000 | refuses |

Notice that the two guards behave differently at their own edges, and that the difference is deliberate. The water fit is inclusive, because the fit holds at the stated limit. The glycol strength is exclusive at both ends, because a strength of 100 weight percent is unreachable and a loop below 90 is a different kind of loop.

A guard that refused its own stated limit would be as wrong as one that accepted anything.

## Exercise

State the module's error contract in one sentence and say what a caller has to write to honour it. Record the four refusals with evidence and the number of fields each returns. Then record the eight boundary rows and say which of the two guards is inclusive at its edges and why.
