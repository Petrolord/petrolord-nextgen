# An absent velocity is not unlimited capacity

{{panel:fc-rate-explorer}}

The transport term needs a velocity and a line inside diameter. When either is missing, the honest answer is that the term cannot be computed, and that is what the engine gives: the bare transport door returns a not a number result rather than a figure of any kind.

That choice is worth understanding, because the alternative is quietly attractive to a program. A missing velocity could be treated as unlimited transport capacity. An unlimited transport term makes the series combination equal the reaction term exactly, so the screening would then report a rate, name reaction kinetics as the controlling step and print a controlling margin, all from an input nobody supplied. Every one of those outputs would look like an answer.

## What the door does instead

The engine returns a not a number result for a blank velocity, for a blank diameter, for a zero velocity and for a negative diameter, and the vendored gate asserts the result is not infinity rather than merely checking that it is not a normal number. That distinction in the gate is the whole point: a test that accepted any non finite value would pass on the behaviour this one is written to prevent.

The rate door goes further. It refuses outright rather than returning a partial answer, and its message names the box:

> a positive velocity is required: an absent velocity is not an unlimited mass-transfer capacity

The same shape of refusal covers a blank line inside diameter. The whole screening stops earlier still, because it computes the wall shear first, so its message says the film survival check did not run and then names the velocity. A refusal that names the input lets a user fix the screen in one move and stops a caller reading silence as a pass. Notice that the behaviours sit at different depths: the bare term hands back a not a number result for a direct caller to check, and the rate door and the whole screening refuse on the user's behalf.

## The habit to take away

Any calculation with a missing input has a value that makes the answer look best, and supplying it answers a question nobody asked. The shape to look for in any engine is a function that hands back infinity, zero or one where it ought to hand back nothing. Ask of every blank field on a screen whether its absence is declared or merely missing.

This module declares the absence of its withdrawn severity region in two fields of its own. It declares the absence of an inspection interval and of a retirement thickness in a list. Those declarations are what let a reader tell a deliberate refusal from a gap, and they are the standard to hold a screening tool to.

## Exercise

Clear the velocity box on the shipped case and record exactly what the screening returns, then clear the line inside diameter and do the same. Write down whether you receive a rate, a controlling word or a refusal in each case, and copy the message you are given. Then reason through what the reported rate and controlling word would have been had a blank velocity been read as unlimited transport capacity, using the reaction term of 44.225132 mm/yr from the shipped case.
