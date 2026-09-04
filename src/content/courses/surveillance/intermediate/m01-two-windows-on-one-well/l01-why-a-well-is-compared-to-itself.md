# Why a well is compared to itself

A surveillance list never says a well is bad. It says a well changed, and the only thing it changed against is its own past.

{{panel:pd-exception-explorer}}

## Two windows, one well, one column

`detectExceptions` builds two windows on each well and compares a mean over one against a mean over the other. Nothing else in `surveillance.js` works that way: `computeKpis` rolls a field up with no baseline near it, and `derivePoint` sees a single row.

Every exception the surveillance golden commits is that pair. P-1 raises a `rate_drop` at medium with a value of 555.714285714286 and a baseline of 900.000000000000, and P-5 raises one at high with 100.000000000000 against 300.000000000000. Nine exceptions on seven wells at an asOf of 2025-06-30, and the shipped engine re-run raises the same nine.

## Which column the comparison reads

`detectExceptions` sets its rate key to `oil` for a producer and to `winj` for an injector. Both are CALENDAR VOLUMES off the ledger row, stb over a row. The producing-day rate that the same file computes on every point as `oilPd` is read by exactly one function in the module, the decline overlay.

The teaching field OGUTA, which this course invented for itself and which is neither a published case nor a real field, prices the difference on one well. OGUTA-6 has a mean calendar oil of 307.504761904762 stb over the recent window against 502.666666666667 stb over the baseline, a drop of 38.825312618416 per cent. Its mean producing-day oil rate over those same rows is 512.000000000000 stb/d against a baseline of 502.666666666667 stb/d, a drop of -1.856763925729 per cent. The volume fell. The rate did not.

The engine reports OGUTA-6 as `rate_drop` at medium: "Oil down 39%: 308 vs 503 stb/d baseline."

## The exception that would have named the cause

Only the hours moved on that well. Mean hours on stream are 14.414285714286 h in the recent window against 24.000000000000 h in the baseline, a change of -39.940476190 per cent. The `downtimeHours` threshold is 12, and 14.414285714286 h is above it, so the downtime exception does not fire and nothing in the list mentions uptime at all.

## The mistake

Reading the value and the baseline as two measurements of a well. They are two readings of one column over two windows, and the returned row does not say which column was read, how long either window was, or how many rows made either mean.

## What it refuses

`detectExceptions` holds no absolute standard. No rate a well is supposed to make, no watercut it is supposed to hold, so a well producing badly and steadily raises nothing. OGUTA-9 raised none at all, at a recent calendar oil mean of 942.836455279584 stb against a baseline of 1004.457323679256 stb, a change of -6.134742308 per cent.

## Exercise

Read OGUTA-6 in the panel and write down its mean calendar oil volume and its mean producing-day oil rate over the recent window.

Then say which of the two produced the reported 38.825312618416 per cent, and what a reader who saw only the message would conclude.
