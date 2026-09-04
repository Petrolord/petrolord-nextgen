# Liquid capacity

The screen computes how much liquid the plunger brings up in a day, returns it, and never compares it to anything.

{{panel:pd-remedy-explorer}}

## The number is already there

`screenPlungerLift` returns `liquidPerDayBbl`. On the teaching well OGUTA-2, an 8200.0 ft candidate on 2.441 in tubing, a cycle delivers 0.9261160790 bbl and the timing gives 16.01716223 trips a day, so the installation lifts 14.83375148 bbl/d. That is a returned field, not a derivation a user has to attempt.

The well it is installed on makes 1150.0 Mscf/d at 5900.0 scf/bbl, which is a liquid make of 194.91525424 bbl/d. The well makes 13.13998380 times what the cycle carries, and the shortfall is 180.08150275 bbl/d.

## Nothing in the verdict knows that

`feasible` on this well is false, built from `pressureOk` = true and `glrOk` = false and nothing else. Had the gas cleared, `feasible` would have read true with 180.08150275 bbl/d of liquid a day going nowhere. The design object returns lift, gasPerCycleScf, liquidPerCycleBbl, requiredGlrScfBbl, wellGlrScfBbl, ruleOfThumbGlrScfBbl, ruleOfThumbAgrees, timing, liquidPerDayBbl, gasPerDayMscf, pressureOk, glrOk, feasible and warnings. The ingredients of the comparison are two of those keys. The comparison is none of them.

## The same reading on the published case

This is not an artefact of a teaching well. Take the published plunger case, give it a derived well gas-liquid ratio of 4500.0 scf/bbl and a derived gas rate of 700.0 Mscf/d, and the cycle runs 69.96279070 min for 20.58236937 trips a day and 23.82707902 bbl/d. The well liquid make is 155.55555556 bbl/d, so the well makes 6.52851973 times what the cycle carries. The screen reports pressureOk = true, glrOk = false, feasible = false, and the liquid comparison appears nowhere in that verdict.

## Why the omission is easy to make

A plunger screen is written around the question can it lift, and that question is genuinely answered: the force balance and the gas expansion are both real work. The second question, will it keep up, is arithmetic on numbers the function already holds. It is the kind of check that gets left out precisely because it is trivial, and there is no place in the returned object where its absence shows.

A cycle carrying 0.9261160790 bbl is a correct answer about a cycle, and 194.91525424 bbl/d is a correct answer about a well. Only the ratio between them says anything about the installation, and that is the number the function declines to form.

## What a careful reader does

Divide the well gas rate by its gas-liquid ratio to get the liquid make, and put that beside `liquidPerDayBbl`: 194.91525424 bbl/d against 14.83375148 bbl/d here. A ratio above one means the liquid level rises whatever the flags say, and a plunger that clears every check the screen performs can still be the wrong remedy.

## Exercise

Write `liquidPerDayBbl` and the well liquid make for OGUTA-2 and form the ratio.

Then say which two keys of the returned object you needed, and why the presence of both of them makes the missing comparison a decision rather than an oversight.
