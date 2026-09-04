# Onward

One answer for the whole system, and a short list of things that answer is not.

## What it earns

A whole-system solve is the only thing that says what a well makes when the header is not a number somebody typed. It has one honest anchor: on a linear network the solver can be set against a matrix inverse that shares no code with it, and agrees to 0.0000e+0 psia at a wellhead in 2 iterations. It is fast where an independent referee is not, 6 Newton steps against 48 bisection sweeps on the same published tree. And it reaches numbers no single-well method can, such as the 2382.375141650 lb/d, 15.190761959 percent, a teaching system takes off its own four wells.

## Where it hands over

The pipe hydraulics are not in here. A branch relation is a callback the consumer supplies, and so is the well inflow, so every pressure drop in a result is a drop the caller's own model produced. There is no temperature anywhere, no thermal coupling and no cooldown, and nothing transient: no slugging, no holdup, no startup, because every equation is steady state. Compressibility along a branch does not exist, since mass in equals mass out on every branch by construction. There is no equipment between nodes, so no pump, compressor or choke as a node kind, and a sink only accepts whatever arrives at a fixed pressure.

Well, junction and sink are the whole vocabulary. Anything a real system has that is not one of the three must be written as a branch relation or left out, and saying which you did is part of the answer.

## The limit worth remembering

The answer came out of an iteration, and the iteration reports on itself. On the teaching network the engine returns converged = true with a residual of 1.546141e-11 lb/d while `checkConservation`, sitting in the same file and never called by the solver, reports a gap of 345 lb/d, 2.593852900 percent of what the engine says was produced. Both numbers describe the same answer. Only one of them was computed by something other than the loop that produced it.

## What you have finished

Which case has a closed form, what a loop decides that a tree does not, what a header costs the well with least margin, how streams combine, and what a reading of the result may claim. Print the flag, print the audit beside it, and say which question a ranking answered.

## Exercise

Write three things a network solve establishes and four it does not model at all.

Then say what you would print beside a converged flag before quoting the answer to anybody.
