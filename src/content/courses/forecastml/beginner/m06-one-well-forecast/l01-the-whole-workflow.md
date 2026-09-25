# The whole workflow in order

{{panel:pf-smoothing-explorer}}

This module puts the tier together on one well. The workflow is short, and its order matters: read the series, fit every method, compare them fairly, and report what was done in terms a reader can check. The worked example is EKENE-P4, the noisy allocation, because noise is where the three methods part company.

## Step 1: read the series

EKENE-P4 has 48 months, from 815.700000 bbl/d in month 0 to 216.400000 bbl/d in month 47, with no missing month. Had a month been missing, the engine would have refused the fit by name at the first gap, and filling it would have been a decision to make and report before going further.

## Step 2: fit each method, every parameter free

Leave every parameter blank and fit all three methods. Record the parameters, `atBounds`, `scoredFrom` and `converged` for each.

| method | parameters | atBounds | scoredFrom | SSE | MSE |
| --- | --- | --- | --- | --- | --- |
| ses | alpha 0.528376 | none | 1 | 215501.852140 | 4585.145790 |
| holt | alpha 0.501603, beta 0.354191 | none | 2 | 278219.131326 | 6048.241985 |
| damped | alpha 0.388341, beta 0.109704, phi 0.800000 | phi = 0.8 | 2 | 207120.428138 | 4502.618003 |

Every fit converged. Only the damped trend sits on a bound, phi on its lower edge 0.8.

## Step 3: compare by MSE

Simple smoothing scores 47 errors and the two trend methods score 46, because they spend month 1 on the start. So compare the MSE and never the SSE. By MSE the damped trend is lowest at 4502.618003, simple smoothing next at 4585.145790, and Holt highest at 6048.241985. That order is in-sample: it says which fit followed the months it had already seen most closely.

## Step 4: say what the comparison means

The lowest in-sample MSE here is the damped trend's. An in-sample MSE says how well a method followed months it had already seen, with parameters chosen on those same months. Whether a method forecasts months it has not seen is a different question, answered by scoring forecasts on months held back from the fit. That is the Professional tier's work, and until it is done, the ranking in step 3 is a statement about the history.

## Step 5: read the forecasts

| method | forecast step 1 | forecast step 12 |
| --- | --- | --- |
| ses | 241.813456 | 241.813456 |
| holt | 236.028094 | 172.008815 |
| damped | 244.373345 | 239.235397 |

Simple smoothing is flat, as it must be. Holt falls by its final trend every step. The damped trend with phi on 0.8 fades fast and ends close to where it started. Three methods, fitted on the same months, give step 12 forecasts spread from 172.008815 to 241.813456 bbl/d. That spread is a reminder of how much of a forecast is the method.

## Step 6: report

Report the forecast with its method, parameters, the months it was fitted on and h. For EKENE-P4: damped, alpha 0.388341, beta 0.109704, phi 0.800000 (on its lower bound), fitted on months 0 to 47, 12 steps, 244.373345 at step 1 and 239.235397 at step 12, all in-sample. A later lesson in this module sets out everything such a report names.

## Exercise

In the smoothing explorer choose "Three methods on one series", load EKENE-P4 and set h to 12. Work through steps 1 to 5 yourself, recording each figure from the panel. Then do the same on EKENE-P1 and write one sentence saying which method has the lowest in-sample MSE there and why that is not yet a test.
