# Working the capstone

There is an order for this work. Most of what goes wrong is a step taken before the step it depends on.

{{panel:pd-balance-explorer}}

## Fix the string and the speed before anything is marched

The engine refuses a design at or above the string's own fundamental, with the number in the message, and says nothing predicted there would be trustworthy. Check the note first rather than diagnosing it afterwards from a strange looking card.

## Solve the card once, and write down how it was sampled

`runRodPumpDesign` forwards neither `cardSamples` nor `nodes` to the card solver, so the shipped values are what you get: `cardSamples` 180, which keeps 186 points, `nodes` 120, `maxCycles` 20 and `tol` 0.0001. Record them beside every load. A load is a claim about the well and about the sampling together, and only one of those is in the answer.

## Read each load knowing which route produced it

`prlPeakLb` is the maximum of the decimated card. The tension envelope is accumulated over every marched step. They disagree by 1.563440 percent on ODUMA-4, so say which one a number came from before comparing it with anything, a unit rating included. Treat the plunger stroke separately from the loads: from 60 to 1920 nodes the stroke moves 0.044644 percent and the loads move far more.

## Balance separately, then run the design

`balanceUnit` needs a surface card and `runRodPumpDesign` calls the card solver internally, so no single call returns a balanced design. Solve the card, balance it, then run the design, which solves the same card again. Pass the structural unbalance and the crank offset to the balance, where they are read, and not to the design function, where they are not.

## Choose the service factor deliberately and quote it

On ODUMA-4 the design is acceptable above a service factor of 0.828733084 and overstressed below it, and the card does not change across that boundary. A loading percentage without its factor beside it is not a reportable number.

## Read numbers, not the warning list

The fillage check fires below 0.85 with nothing in between: 301.389964 bbl/d silent against 301.354487 bbl/d warned, 0.035477 bbl/d apart. The `notPeriodic` flag can be raised at one node count and not at a coarser or a finer one. Warnings are a filter set at a chosen place; the number is the evidence.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Card sampling | `cardSamples` and `nodes` written beside every load |
| Load route | the subsampled peak or the envelope, named |
| Balance | computed from its own card, with the unbalance and offset passed to it |
| Service factor | stated with every loading percentage |
| Grid sensitivity | any dip compared against the node spread before it is called an optimum |

Then the units: lb for load, in for stroke, ft for depth, bbl/d for rate, spm for speed, hp for power, in-lb for torque, psi for stress, psia for pressure, degF for temperature.

## Exercise

Write the order of work as six lines, naming what each step needs from the step before it.

Then say which two steps cannot be swapped without changing an answer, and what the wrong answer would look like.
