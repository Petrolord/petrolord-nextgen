# What it refuses to guess

A state the method has no answer for comes back as an object with an `error` string. The engine throws nothing, so a caller checks a property rather than catching an exception. A refusal is a normal return.

{{panel:fc-liquid-explorer}}

## The liquid line's own refusal

| what was given | the message |
| --- | --- |
| a liquid line with no rate | "liquid line drop needs positive rate, bore, length, density and viscosity" |
| a liquid line with a negative rate | "liquid line drop needs positive rate, bore, length, density and viscosity" |
| a liquid line with no bore | "liquid line drop needs positive rate, bore, length, density and viscosity" |
| a liquid line with no length | "liquid line drop needs positive rate, bore, length, density and viscosity" |
| a liquid line with no viscosity | "liquid line drop needs positive rate, bore, length, density and viscosity" |
| a traverse with no profile segment | "a traverse needs at least one profile segment" |

## One message, five different mistakes

Read the first five rows again. They are five separate faults and they produce one identical string, which names five inputs and states the condition all of them have to meet. The message describes the contract rather than pointing at the offender.

So the message is where to start and it is not where to finish. A caller who reads "needs positive rate, bore, length, density and viscosity" still has to look at the row to see which of the five arrived missing or negative. Expecting the engine to name the guilty input is expecting something this message does not do.

## A refusal is designed, and it is data

The engine's list of states the method has no answer for runs to eighteen entries across the whole module. Every one of them is a returned object.

That choice matters to anyone building on it. A thrown exception has to be caught somewhere, and code that forgets is code that stops. A returned error travels back through the same path as a result, so it can be shown beside the other rows of a sizing sweep, with the row that refused saying why.

## Refusing is better than defaulting

Consider what the alternative would look like. A missing viscosity defaulted to some plausible centipoise gives a Reynolds number, a friction factor and a pressure drop, all of them printing normally, all of them resting on a number nobody supplied. The refusal removes that whole class of quiet wrongness by declining to produce the first link.

## The other refusal on this list

A traverse with no profile segment comes back as { error: "a traverse needs at least one profile segment" }. That one is about the shape of the input rather than about a physical impossibility, and it arrives in exactly the same way as the others.

So a caller needs one code path rather than two. Whether the method was handed nonsense or handed a state it has no answer for, the return is an object, the property is `error`, and the string says what was wanted.

## The mistake

Treating a returned error as a failure of the run. It is the method reporting the truth about the state it was handed, and on a sizing sweep it is one row's verdict while the other rows answer normally.

## Exercise

Write the message a liquid line gives when its rate is missing, and say how many distinct faults produce that same string. Then say what the engine returns instead of throwing, and what a caller has to do to notice it.
