# A refusal is a returned object

Every refusal in both modules is a returned object carrying an error string. Neither module throws. A caller checks a property on the result rather than wrapping the call in a try block, and a refusal arrives as data that can be shown on screen beside everything else.

{{panel:fc-pump-explorer}}

## What a refusal looks like

A refused call returns an object whose error property is a sentence. Here are seven of the pump module's, in the engine's own words:

| what was asked | the message |
| --- | --- |
| a pump curve from two points | "a pump curve needs at least three flow and head points" |
| three readings at one flow | "the pump curve points are degenerate: give three distinct flows" |
| a pump curve with a negative head | "pump curve points need non-negative flow and head" |
| a system curve with no flow to state its friction at | "a system curve needs a friction head at a stated positive flow" |
| a system curve with no static head at all | "a system curve needs a static head: it may be negative, but it cannot be missing" |
| a duty with no system to work into | "both a pump curve and a system curve are needed" |
| power at an efficiency of zero | "pump efficiency must be between 0 and 1" |

Each message names what was wrong and states the domain the input has to sit in. That is enough to fix the call without opening the engine.

## Two messages, one cause

Read the first two rows together. Three points is the minimum a quadratic fit needs, and three points at the same flow are three points the fit cannot use, so the module refuses both. The second message is the more interesting of the two because the count was satisfied and the refusal still happened. Presence is not sufficiency.

## A domain can be one-sided

The static-head message is worth reading closely. It says the static head may be negative but it cannot be missing. A pump discharging into a vessel below it has a negative static head and that is a perfectly ordinary station, so the guard checks for a number rather than for a positive number. Compare the friction head, which is refused when it is negative, because friction takes energy out of the fluid whichever way the fluid is going.

## The same convention in the other module

The compression module refuses the same way and its messages carry the same shape. A discharge pressure at or below the suction pressure comes back as "discharge pressure must exceed suction pressure". A stage asked for a compression ratio of one comes back as "a stage needs a compression ratio above 1: at a ratio of 1 the stage adds no pressure", which names the fault and then says why it is one. One convention across both machines means one habit for the caller.

## Why this matters for the caller

Because no exception is thrown, code that forgets to check the error property carries on with an object that has no answer in it. The engine has done its job by refusing clearly. The contract it offers is that the result is always an object, and that the object either holds the answer or holds the reason there is none.

## The mistake

Substituting a value for a refused input and continuing. The message named the input because the input is the fix. Filling it in produces a duty point, a power and an operating region that are all internally consistent and all built on a number nobody supplied.

## Exercise

Write the message the engine gives for a pump curve built from three readings at one flow, and say why the point count alone was not enough. Then explain why a static head of a negative value is accepted while a friction head of a negative value is refused.
