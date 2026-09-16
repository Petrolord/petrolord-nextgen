# What a point source cannot say

The pool fire model treats the whole fire as a point radiating in every direction. It computes no view factor and no solid-flame surface emissive power, and close to the flame it under-predicts and says so.

{{panel:fc-layout-explorer}}

## What the model does

A point source spreads the radiated fraction of the heat release over the surface of a sphere and asks where the intensity meets the allowable. That is a good approximation at a distance, where a flame of any shape looks small, and it is the reason the ERHA figure of 59.5294 m from an 18.000000 m bund is worth quoting at all.

It is a poor approximation near the fire, where the flame is not small, where its shape and tilt decide how much of it a target can see, and where a real calculation needs the view factor between a flame surface and a receiver.

## The case where it says so

| quantity | value |
| --- | --- |
| pool diameter m | 20.000000 |
| allowable kW/m2 | 4000.000000 |
| heat release kW | 742986.6626 |
| flame height m | 25.6078 |
| radius from centre m | 2.2745 |
| setback from edge m | 0.0000 |
| setbackStatus | within-pool-edge |

An allowable of 4000.000000 kW/m2 is an absurd tolerance, and it drives the radius down to 2.2745 m, which is inside a pool whose edge is 10.0 m from the centre. The engine reports the setback from the edge as 0.0000 m with a status of within-pool-edge rather than returning a negative distance.

It also notes that the computed radius of 2.2745 m is well inside the flame height of 25.6078 m, so the point source is being used where it under-predicts. The instruction attached is to treat the answer as a lower bound and to use a solid-flame view factor model for design.

## A status is part of the answer

A setback of 0.0000 m read on its own says a pump could stand against the bund wall. Read with its status it says something quite different: the model has left the region it is good for, and the number is the smallest the answer could possibly be.

That is why setbackStatus travels with every pool fire result, including the ordinary ones. beyond-pool-edge on the ERHA bund is the engine confirming that its answer of 50.5294 m sits in the region where a point source is defensible.

## The other held items on this plot

The spacing table figures and the API 521 radiation labels are recorded values with no source checked. They are the inputs to a layout judgement rather than results of one, and a site standard replaces the table wholesale.

## The mistake

The mistake is quoting a setback without its status, which strips the only warning the model gives about its own validity. The second is reading a lower bound as an answer.

## Exercise

State what the point source model does not compute and where it under-predicts. Give the radius, the edge setback and the status for the published within-pool-edge case, and say what the engine instructs a designer to do instead. Then name the two held items that sit on a layout judgement.
