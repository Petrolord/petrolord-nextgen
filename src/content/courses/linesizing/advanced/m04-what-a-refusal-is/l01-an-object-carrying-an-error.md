# An object carrying an error

Before any particular refusal is worth studying, the shape of a refusal is. This engine has one, it keeps to it, and the shape is what lets a caller handle every failure the same way.

{{panel:fc-liquid-explorer}}

## The contract

A refusal is an object carrying an `error` string. It is never a thrown exception, never a null and never a bare number.

This engine throws nothing. A liquid line called with no rate comes back as { error: "liquid line drop needs positive rate, bore, length, density and viscosity" }, and a traverse with no profile comes back as { error: "a traverse needs at least one profile segment" }. Both arrive as ordinary return values through the ordinary path.

So a caller checks a property rather than catching. One test, in one place, for every failure the engine has.

## Why the shape is the useful part

A thrown exception leaves the normal path and can unwind past the code that knew what to do about it. A sentinel value, a zero or a minus one standing in for a failure, is indistinguishable from a real answer that happens to equal it. A null says something went wrong and nothing about what.

An error object avoids all three. It arrives where the answer would have arrived, it cannot be confused with a pressure or a rate, and it carries a sentence naming what was missing.

## The failure mode the contract is defending against

A NaN or an Infinity returned without an error is worse than no guard at all.

An absent guard produces an obviously wrong answer that somebody notices. A NaN passes the check, because it is a returned value with no error property beside it, and then propagates into whatever is downstream. In this engine that means a sizing sweep, a marched profile or a wall specification, each of which will carry it forward without complaint.

Three returns do sit outside the contract on purpose, and the next lesson takes them apart. They are exceptions that were designed rather than overlooked, which is a different thing from a gap.

## The mistake

The mistake is testing the truthiness of the result. An error object is an object and is entirely truthy, so code that asks whether it got something back will conclude that it did, and then read a pressure field that is not there.

The second mistake is wrapping these calls in a try block and concluding from a quiet run that everything succeeded. Nothing here throws, so the catch will never fire, and a refusal will pass through it silently on its way into a report.

## Exercise

State the shape of a refusal in this engine and the three things it is never. Then give two refusal messages verbatim, explain why a caller checks a property rather than catching, and say why a NaN returned without an error is worse than having no guard at all.
