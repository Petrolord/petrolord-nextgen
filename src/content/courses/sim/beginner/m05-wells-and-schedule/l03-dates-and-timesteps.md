# DATES and timesteps

The SCHEDULE section is a sequence. Wells are set up, then time advances, then things change, then time advances again. Two keywords advance time and they do it differently.

## DATES

DATES advances the run to a calendar date. Ekene's history uses it 36 times, once per month:

    DATES
      1 FEB 2023 /
    /

Everything stated before a DATES block applies from the previous point in time up to that date. So the pattern through the history is: set this month's rates, advance to the first of next month, set the next month's rates, advance again.

That is why the deck has 36 WCONHIST blocks and 36 DATES blocks. They interleave.

## TSTEP

TSTEP advances by a LIST OF LENGTHS rather than to a date:

    TSTEP
      60*30.4375 /

Sixty steps of 30.4375 days each. That is the prediction tail: five years of monthly steps after the history ends.

The value 30.4375 is a mean month, 365.25 divided by 12. It is not any particular month. Using it means the prediction steps do not line up with calendar months, which is fine for a forecast and would be wrong for history.

## Why history uses DATES and prediction uses TSTEP

Because history has dates and prediction does not.

The Ekene ledger records what happened in January 2023, February 2023 and so on. Those are calendar months of 31, 28 and 31 days, and a schedule that advanced by a uniform 30.4375 days would put the March rates into a period that is not March. Rates would be applied over the wrong intervals and the cumulative volumes would drift.

The forecast has no such constraint. Nothing happens on a particular date, so uniform steps are simpler and they make the output regular.

## Report steps and solver steps

A DATES or TSTEP entry defines a REPORT step, which is when the simulator writes output. It is not the timestep the solver actually takes.

Internally the solver chooses its own step size, cutting it when convergence is hard and growing it when things are quiet, and it may take many internal steps inside one report step. You cannot control that from the deck beyond setting limits.

So the 36 entries in the history are 36 points at which results are written, not 36 solves.

## What the step size costs

Report steps cost output volume and nothing else. Solver steps cost run time.

But there is a coupling worth knowing: a schedule that changes well controls abruptly forces the solver to cut its step and rebuild, so a deck with a control change every month is more expensive than one with a change every year, even if the physics is identical. History-matching decks are expensive for exactly this reason.

## The misconception to avoid

"A shorter timestep is more accurate." Shorter REPORT steps give finer output and change nothing about the solution. Shorter SOLVER steps do reduce time-discretisation error, and the solver already chooses them adaptively. Setting a tiny report interval in the belief that it improves accuracy buys a much larger output file and the same answer.

## Exercise

First, the history has 36 DATES blocks and the prediction has one TSTEP block of 60 steps. State how many report steps the whole run writes, and how long the prediction period is in years.

Second, explain in two sentences why applying a uniform 30.4375 day step to a monthly production history would misallocate volumes, and name the month where the error is largest.
