# Candidates and the pick

`sizeTubingForRate` returns `largestUnloaded` and it returns every candidate it rejected. The pick is one line. The rejections are the rest of the object.

{{panel:pd-profile-explorer}}

## The whole list, scored twice

EBOCHA-5 at the controlling station, 7500.0 ft, 1500.0 psia, 653.67 degR, z 0.9142643742, at 3100.0 Mscf/d. The same nine candidates, run once under each correlation.

| Candidate, in | Coleman rate, Mscf/d | Coleman ratio | Turner ratio |
| --- | --- | --- | --- |
| 3.958 | 4010.445008120 | 0.7729815504 | 0.6441512920 |
| 3.826 | 3747.407462010 | 0.8272385726 | 0.6893654772 |
| 3.740 | 3580.834014580 | 0.8657201053 | 0.7214334210 |
| 3.548 | 3222.613396799 | 0.9619521855 | 0.8016268212 |
| 3.476 | 3093.146724566 | 1.0022156322 | 0.8351796935 |
| 3.068 | 2409.637406392 | 1.2865006128 | 1.0720838440 |
| 2.441 | 1525.374720469 | 2.0322875149 | 1.6935729291 |
| 2.041 | 1066.416841966 | 2.9069308342 | 2.4224423618 |
| 1.610 | 663.579159341 | 4.6716355635 | 3.8930296363 |

Under Coleman `largestUnloaded` is 3.476 in at 1.0022156322. Under Turner it is 3.068 in at 1.0720838440.

## Both the winner and the rejects move

3.476 in reads 1.0022156322 under Coleman and 0.8351796935 under Turner. It loses 0.1670359387 of ratio, which is 16.666667 percent of it, and that is enough to move it from being the answer to being a reject. 3.068 in makes the opposite trip: it reads 1.2865006128 under Coleman, comfortably surplus to requirements, and 1.0720838440 under Turner, where it is the only candidate that just clears.

The candidates that unload under Coleman are 3.476, 3.068, 2.441, 2.041 and 1.610 in. Under Turner they are 3.068, 2.441, 2.041 and 1.610 in. One correlation choice, made from a wellhead pressure of 880.0 psia, moved the boundary one candidate down the list.

## What the object actually carries

The return has three keys, `rows`, `largestUnloaded` and `ok`, and the rows come back largest diameter first: 3.958, 3.826, 3.740, 3.548, 3.476, 3.068, 2.441, 2.041, 1.610. Each row carries `idIn`, `ok`, `correlation`, `adjustment`, `rhoGasLbFt3`, `terminalFtS`, `velocityFtS`, `constant`, `areaFt2`, `criticalVelocityFtS`, `criticalRateMscfd`, `actualVelocityFtS`, `ratio` and `loaded`.

The correlation is recorded on every row, as "coleman" or "turner", with the adjustment beside it as 1.0000 or 1.2000. So the object does tell you which correlation produced the pick, if you read past the pick.

## The mistake

Lifting `largestUnloaded` into a recommendation and discarding `rows`. A single diameter looks like a measurement. What it is is the first row in an ordered list that satisfied a threshold, and the row above it and the row below it are the two numbers that say how firm that answer is.

## What it refuses

A rate nothing on the list can carry returns `null` rather than the least bad candidate. At 40.0 Mscf/d `largestUnloaded` is `null` and the best ratio anywhere on the list is 0.0502326405.

That null used to say two things at once, and `ok` separates them. A null under `ok: true` is a finding: nothing on this list carries this rate. A null under `ok: false` is not a finding, because the question was never evaluated. Read the boolean before the pick.

## Exercise

Read the full candidate list under both correlations and write the two picks.

Then find 3.476 in on both lists and write its two ratios.
