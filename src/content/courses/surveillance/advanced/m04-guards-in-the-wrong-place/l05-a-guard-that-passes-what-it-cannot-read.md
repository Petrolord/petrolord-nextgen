# A guard that passes what it cannot read

The rod loading check is `const loading = d.worstSection ? d.worstSection.loadingPct : NaN` and then `if (loading > 100)`. NaN > 100 is false, so a design whose loading could not be read is accepted as workable.

{{panel:pd-reading-explorer}}

## The rung nobody could read

Derived, on a ladder of six trials: ok = true, rate reported 900.000000000 bbl/d, equipment "2 in plunger, 74 in stroke at 10 spm, 0.94 gravity liquid", and the rod loading printed as "NaN % of Goodman". Rungs tried = 6, rungs thrown out = 2, for running at 120.0 and 140.0 per cent of their allowable.

The rung the advisor chose is the one whose loading nobody knows, and the two rungs above it were rejected for being overloaded.

## The same ladder, the other way round

With that unreadable loading treated as a failure instead, the whole ladder refuses: "The largest unit tried (1.75 in plunger, 64 in stroke at 9 spm) makes 520 bbl/d against a target of 800. Rod pumping is rate-limited by the plunger it can swing at this depth, and this well is past it."

Same well, same six trials, opposite answer, and the only thing that changed is what an unreadable value is taken to mean. The trusting half of a disagreeing function is the half that is wrong.

## One step further, and the advisor blames the chain

A `worstSection` object with no `loadingPct` on it is truthy, so `loading` is undefined, `undefined > 100` is false, the rung is accepted, and `undefined.toFixed(0)` throws. `runDesignPass` catches it and reports "The design chain failed: Cannot read properties of undefined (reading 'toFixed')".

The guard also prints at two precisions. An accepted trial rounds to a whole number and a rejected one to one decimal, so loadings of 99.5, 99.9 and 100.0000000 per cent are accepted and print a hundred, while 100.0000001 is thrown out and prints 100.0.

## The same shape in the surveillance module

`summarizeDeferments` accrues an open event's days to `asOf`, and when `asOf` is omitted it substitutes today. Derived: the day count with `asOf` omitted differs from the anchored one, which is why this course states that finding as a property rather than as a value.

Anchored recomputations of one open event, at 3200.000000 stb of deferred oil throughout: asOf 2024-06-30 gives 30 days, 2024-08-31 gives 92, 2024-11-20 gives 173, 2025-06-30 gives 395. The day count is `Math.max(1, endDay - startDay + 1)`, so an event ending a month before its start is silently 1 day.

## The mistake

Reading a printed value as a measured one. "NaN % of Goodman" is at least visible. A deferment day count that answers differently tomorrow on the same rows is not, and every other window in that module anchors on the field's latest ledger date so that an old dataset surveils honestly.

## Exercise

Run the rod ladder with the unknown loading and record the accepted rung and its printed loading.

Then say what the advisor should return when a chain hands back a section it cannot read, and why an accepted rung is worse than a refusal.
