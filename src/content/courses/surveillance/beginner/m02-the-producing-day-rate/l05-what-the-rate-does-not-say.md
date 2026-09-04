# What the rate does not say

`detectExceptions` sets its rate key to `"oil"`, the calendar volume off the row. The producing-day rate is computed on every point and is read by exactly one function in the whole file.

{{panel:pd-ledger-explorer}}

## Who reads which column

`derivePoint` computes `oilPd`, `waterPd`, `gasPd` and `liquidPd` on every point. `FIT_STREAMS` names the pairs the decline overlay works from: oil has a producing-day key `oilPd` and a calendar key `oil` in stb/d, gas has `gasPd` and `gas` in Mscf/d, liquid has `liquidPd` and `liquid` in stb/d. The decline overlay is the one function in `surveillance.js` that reads a producing-day column. `detectExceptions`, whose whole job is to say which wells have changed, reads the one that says how much they made. So a decline plot and an exception list built off the same ledger in the same studio can be reading two different quantities from the same rows, and neither output names which.

## What that costs on one well

The teaching field OGUTA was invented for this course and is neither real nor published. Its well OGUTA-6, read two ways over the same rows, gives this.

| Reading | Baseline window | Recent window | Change |
| --- | --- | --- | --- |
| mean calendar oil, stb | 502.666666666667 | 307.504761904762 | -38.825312618 per cent |
| mean producing-day oil, stb/d | 502.666666666667 | 512.000000000000 | -1.856763925729 per cent |
| mean hours_on, h | 24.000000000000 | 14.414285714286 | -39.940476190 per cent |

`rateDropPct` is 20 per cent with the doubling to high at 40, so the calendar reading raises a flag and the producing-day reading raises none. The engine prints "Oil down 39%: 308 vs 503 stb/d baseline." at medium severity.

## The exception that would have explained it

`downtimeHours` is 12. The mean recent hours on that well are 14.414285714286 h, above the threshold, so the one exception type that would have named the real cause does not fire either. The well is reported as a rate problem, the uptime exception sits below its trigger, and the column that settles the question is on every point and is never read.

## The mistake

Taking the absence of a downtime exception as evidence that hours are not the story. The downtime check answers one question, whether a window mean of hours crossed a fixed threshold. A well can lose nearly forty per cent of its operating hours against its own baseline, as that one did, and still average above 12 h.

## Exercise

Read the OGUTA-6 recent and baseline window means in the panel and write down the change in the calendar oil volume and the change in the producing-day oil rate.

Then say which of the two the printed exception measured, and what you would have to look at to find out why it moved.
