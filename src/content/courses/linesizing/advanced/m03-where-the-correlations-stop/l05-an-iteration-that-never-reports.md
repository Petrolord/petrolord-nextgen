# An iteration that never reports

Two answers in this module come out of loops. Neither loop says whether it finished, and both return their last iterate exactly as if it were a converged result.

{{panel:fc-gasline-explorer}}

## The two loops

The friction factor solve runs a fixed point. Colebrook is implicit, with the friction factor on both sides, so the engine iterates until the value stops moving.

The General Flow solve runs a rate and a friction factor against each other. The rate needs the friction factor, the friction factor needs the Reynolds number, and the Reynolds number needs the rate, so the two are cycled until they settle. That is where 0.0112132010 on the SOKU trunk comes from.

Both return their last iterate with no flag beside it.

## What is missing, exactly

There is no converged field, no iteration count and no residual. A caller receives the same shape of answer whether the loop settled on the third pass or ran to its limit still moving.

Be precise about the size of this. Both loops do converge everywhere this digest looked, across every published case, every bore, every roughness and every duty in the tables. No wrong number has been produced by it. What is absent is the evidence, which is exactly what makes the absence easy to miss.

## Why a second run does not help

Nothing in this engine reads a clock or a random number, so every result reproduces exactly. Running the same case twice returns the same figure whether or not the loop converged, and a reader who checks for stability by repeating a call learns nothing at all.

Determinism is a virtue here and it removes the one check a caller might have improvised.

## Compare the solver that does report

The outlet-pressure bisection in the Professional tier has a failure path. Asked for a rate the line cannot carry, it refuses in words rather than returning its last guess. That is what a solver looks like when it distinguishes between an answer and the place it stopped.

The two loops in this module have no such distinction available to them. They return a number in every case.

## The mistake

The mistake is treating ten decimals as evidence of convergence. The precision is the format, and it is printed identically for a value that settled and one that was still moving.

The second mistake is over-correcting. These loops are not suspect and their results are not provisional, so the right habit is not distrust of the figures. It is knowing that if a future case ever fails to converge, this engine will report it as an ordinary number and nothing will mark the day it started being wrong.

## Exercise

Name the two iterations in this module and say what each one solves for. Then state exactly what the digest establishes about whether they converge, explain why repeating a call cannot test it, and contrast both with the way the outlet-pressure solve handles a case it cannot answer.
