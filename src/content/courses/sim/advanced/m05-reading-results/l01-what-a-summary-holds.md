# What a SUMMARY holds

This module is about reading results. Nothing in it is graded, and it is here because a deck writer who cannot read a results file is writing blind.

## Why it is not graded

The engines this course is built on emit decks and do grid geometry. They do not solve flow equations, so this course has no simulated result of its own to check an answer against.

A course should grade what it can check and teach what a practitioner needs. This module is the second of those, and it is the same treatment the waterflood course gave to enhanced recovery screening.

## What the file is

A summary file is a time series database. One row per report step, one column per vector you requested, written as the run proceeds.

It is not the full model state. That lives in restart files, which hold every cell's pressure and saturation at selected steps and are enormous. A summary file holds aggregates and well-level quantities and is small enough to open in anything.

That size difference decides how they are used: summaries are read constantly, restarts are read when somebody needs to see a map.

## What a row is

A report step, which is a DATES entry or a TSTEP interval. Ekene's deck writes 36 history steps and 60 prediction steps, so its summary has 96 rows.

The solver's own internal steps do not appear. A report step may have taken twenty solver steps or one, and the summary shows the state at the end of it either way.

## Rates are averages, totals are exact

This catches people.

A rate vector at a report step is the average over the step, not the instantaneous value at its end. A total is the cumulative to that instant.

So differencing consecutive totals and dividing by the step length reproduces the rate exactly, and reading a rate as an instantaneous value is an approximation that gets worse as the steps get longer.

If a rate and a total disagree in a way that matters, trust the total. Totals are accumulated by the solver; rates are reported.

## What is not in there

Anything you did not request. The SUMMARY section is a list, and a vector omitted is a vector unavailable, with a re-run as the only remedy.

And anything the model does not compute. There is no sweep efficiency vector, no swept-volume vector, no out-of-zone vector. Those are quantities you derive, which is what the waterflood course spent three tiers doing.

## The first thing to read

The oil in place at initialisation, which the run reports before any timestep.

That number is the denominator of every recovery factor the study will quote, and it is the first place a static-model error shows up. Reading it against the volumetric booking takes ten seconds and it is the single highest-value line in the whole output.

## The misconception to avoid

"The results file contains the results." It contains the vectors you asked for at the steps you asked for. Everything else the model computed, at every cell and every internal step, was discarded as it went. Deciding what to keep is a decision made before the run, in the SUMMARY section, by somebody who did not yet know what they would want.

## Exercise

First, Ekene's deck has 36 history steps and 60 prediction steps. State how many rows its summary file has and what a single row represents.

Second, explain in two sentences why differencing a cumulative reproduces a rate exactly while reading a rate as instantaneous does not.
