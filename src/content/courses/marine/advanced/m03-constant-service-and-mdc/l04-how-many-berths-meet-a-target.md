# How many berths meet a target

{{panel:marine-base-calculator}}

A base manager rarely asks for the wait at a given number of berths. The question is the other way round: how many berths keep the mean wait at or below a target? The engine answers it when the call states a target mean wait in hours, which is its one optional input.

## How the search runs

The engine starts from the fewest berths that keep the berth utilisation below 1, which is the whole part of the offered load plus one, and tries each count upward to 100 under the stated model. It returns the first count whose mean wait is at or below the target, with the wait there and a reason in its own words. The search counts from saturation upward, so it never offers a count that has no steady state, and it uses the model the call states, so an M/M/c target and an M/D/c target can give different counts.

## Four targets

| golden input | model | target, hours | berths (engine) | mean wait there, hours (engine) |
| --- | --- | --- | --- | --- |
| ekene-base-mmc-target-one-hour | M/M/c | 1 | 3 | 0.440347 |
| ekene-base-mdc-target-one-hour | M/D/c | 1 | 3 | 0.259397 |
| base-target-met-exactly-by-current | M/M/c | 9 | 1 | 9.000000 |
| base-target-zero-unreachable | M/M/c | 0 | none | none |

The engine's reasons, verbatim, for the Ekene base under each model:

> 3 berths are the fewest with a mean wait at or below 1 hour (0.440347 hours)

> 3 berths are the fewest with a mean wait at or below 1 hour (0.259397 hours)

On the Ekene base both models need a third berth to bring the wait under an hour. The two berths the base has wait 3.180124 hours as M/M/c and 1.665786 as M/D/c, both above the target.

## At or below

A wait exactly at the target meets it. On base-target-met-exactly-by-current the wait at one berth is 9.000000 hours and the target is 9, so one berth is the answer, verbatim:

> 1 berth is the fewest with a mean wait at or below 9 hours (9 hours)

That inclusive reading is the engine's stated choice; the alternative, met only strictly below, would push that answer to a second berth. The course's readings module takes it up.

## A target no count meets

Every steady-state queue has some wait, however small, so a target of 0 hours is never met. The engine reports it with no berth count, verbatim:

> no berth count up to 100 gives a mean wait at or below 0 hours

That is a result with a reason. A negative target is a refusal, verbatim:

> targetMeanWaitHours must be a finite number at or above 0; got -1

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene base, a one-hour target, M/M/c". Read the Fewest berths that meet it tile and the reason. Set Target mean wait, hours (optional) to 0.3, predict from the table of the same call at more berths how many berths the engine will return, and check. Then start from "A target met exactly" and "A target of zero" and read each reason.
