# States with no finite answer

{{panel:lp-proof-test}}

Some searches have no finite answer, and the engine distinguishes carefully between the two ways that happens. A STATE is an answer: the call succeeded, the engine understood the subsystem, and the honest result is that no interval meets the target or that the interval does not enter the question. A REFUSAL is the absence of an answer: the call was malformed, the engine returns an object carrying `error` and `field`, and nothing is computed. A refusal carries no number, and a verification note that reports one as though it were a result is reporting something the engine never said.

## Three states the longest interval search can return

| state | subsystem, stated | target | longest T1 hours | PFDavg reported |
| --- | --- | --- | --- | --- |
| UNACHIEVABLE | 1oo1, lambdaDU 1e-6, lambdaDD 2e-4, MTTR 72 | 0.01 | null | floor 0.014400000000 |
| INTERVAL_INDEPENDENT | 1oo1, lambdaDU 0, lambdaDD 1e-6, MTTR 8 | 0.01 | null | 0.000008000000 |
| CAPPED_AT_LIFETIME | 1oo1, lambdaDU 2e-8, lambdaDD 0, coverage 0.9, T2 87600 | 0.01 | 87600.000000 | 0.000876000000 |

UNACHIEVABLE means the part of the PFDavg that does not depend on T1 already reaches the target. Detected failures sitting down for the MTTR, the MRT, and the uncovered part under partial coverage are all in that part. Here the floor is 0.014400000000 against a target of 0.01, so no interval, however short, meets it. INTERVAL_INDEPENDENT means there are no undetected failures at all, so T1 never enters the arithmetic and the reported 0.000008000000 is what the subsystem achieves at every interval. CAPPED_AT_LIFETIME means the target is met even at the lifetime, so the engine returns the lifetime of 87600.000000 hours and says why, because no interval longer than the lifetime is meaningful.

## A target of one is refused

A target PFDavg of one is a target every subsystem meets, so a search against it has no crossing to find. The engine declines the call:

> targetPfdAvg: must lie in (0, 1)

The field named is `targetPfdAvg`, and the message is the whole answer. There is no interval alongside it and no state.

## A sensitivity sweep with no intervals is refused

A sensitivity sweep is a list of intervals and their results, so an empty list has nothing to report. The engine declines the call:

> intervalsHours: must be a non-empty list of proof test intervals in hours

Again the field is named, again nothing is computed, and again a reader of the note learns exactly which input was wrong.

## Why the difference is worth this much care

A state and a refusal look alike on a screen, because both give you no interval to write in the plan. They mean opposite things. UNACHIEVABLE is a finding about the design: the hardware cannot reach that target and only better hardware, better coverage or a looser target will move it. A refusal is a finding about the call: the analyst typed something the engine cannot act on. One belongs in the verification note as evidence. The other belongs in the analyst's own working until the call is fixed.

## Exercise

The UNACHIEVABLE row reports a floor of 0.014400000000 against a target of 0.01. Work out how much looser the target would have to be, as a ratio, before any finite interval could exist for that subsystem. Then say which of the three states would be returned if the same subsystem were given that looser target and a very short interval, and write one sentence on which input would have to change to move the floor itself.
