# What this engine models

Conduction through cylindrical layers, a ground shape factor, two boundary films, and two masses. That is the whole list, and knowing where it ends is most of knowing how to use it.

## The nine things it computes

`layerResistance` turns one annulus and one conductivity into a resistance per foot of pipe. `burialResistance` does the same for a trench. `overallU` stacks whatever it is given and divides by an area to get a coefficient. `pipeMassLbPerFt` and `contentsMassLbPerFt` are geometry and a density, nothing more.

The other four are where a fluid, a rate and a clock enter: `relaxationLengthFt`, `steadyStateProfile`, `uForArrivalTemp` and `cooldownTime`. Every one of them is built on a U and the two masses, which is why the stack has to be right before anything downstream can be.

## What it does not compute

It solves no flow. There is no pressure drop model, no holdup, no phase behaviour, no composition, and no hydrate or wax curve. It will not tell you where the sea is cold, how thick the soil is, or which film coefficient your line actually has. Those are inputs. The module is a heat leak calculator wrapped around a pipe drawing, and it is very good at that one job.

## The catalogs are defaults, not physics

Two catalogs of film coefficients ship with the module, and both are exposed as inputs precisely because they are the uncertain half of a stack.

| Boundary | h, Btu/(hr ft2 degF) |
| --- | --- |
| Flowing liquid, bore side | 300.0000 |
| Flowing multiphase, bore side | 200.0000 |
| Flowing gas, bore side | 25.0000 |
| Shut in and stagnant, bore side | 5.0000 |
| Seabed with current, outside | 200.0000 |
| Still water, outside | 50.0000 |
| Air, exposed and windy, outside | 6.0000 |
| Air, sheltered, outside | 2.0000 |

The bore side runs from 300.0000 down to 5.0000, a ratio of 60.000000. While the line flows, the inside film is very nearly a short circuit and contributes almost nothing. Shut the line in and the bore goes stagnant, and the same term becomes one worth arguing about.

The conductivity catalog works the same way. Every layer still takes its own k as an input, so a published foam datasheet always beats the shipped default, and the default is there to let a first pass run rather than to settle an argument.

## The mistake

Treating a catalog entry as a computed result. The seabed film of 200.0000 Btu/(hr ft2 degF) is a shipped default that somebody chose, and quoting it as though the engine measured it puts a guess at the centre of a stack and calls it an answer.

## Exercise

List the four functions that need a fluid property and the five that do not.

Then say which single catalog value you would want measured first on a line that spends most of its life shut in, and why.
