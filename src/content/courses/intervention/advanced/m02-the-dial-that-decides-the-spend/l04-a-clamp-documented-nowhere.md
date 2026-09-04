# A clamp documented nowhere

`lateFraction` accepts any number you hand it. Values outside a range are silently replaced with the nearest edge, and nothing in the return object records that it happened.

{{panel:pd-candidate-explorer}}

## What the clamp returns

Six values handed to `chanDiagnosis` on teaching well ELELENWO-4, a teaching case and not a published one. The history is 38 samples from t = 15.000000 to 3600.000000 days, and not one datum changes between rows.

| lateFraction handed in | Window starts, days | Derivative slope | Mechanism |
| --- | --- | --- | --- |
| -3.00 | 2308.407093 | n/a | coning |
| 0.00 | 2308.407093 | n/a | coning |
| 0.05 | 2308.407093 | n/a | coning |
| 0.10 | 2308.407093 | n/a | coning |
| 1.00 | 15.000000 | 1.229355999 | displacement |
| 2.50 | 15.000000 | 1.229355999 | displacement |

A negative fraction is answered. So is zero. The floor is 0.10 and the ceiling is 1.00, and the rows at or below the floor return one reading because they are one run.

## Why the floor lands on coning

The window at the floor opens at t = 2308.407093 days, the first sample after this teaching well was beaned back on day 2200. The samples from there carry derivatives of -9.958064965, -8.779998197, -7.741300002 and -6.825482691. The derivative fit takes only positive derivatives, so nothing survives it, the fit fails, and the branch that reads the negative count runs instead. Its mechanism is coning, `treatable = false`, and on a coning diagnosis the screening returns the water shutoff squeeze blocked.

That mechanism appears nowhere in the derived sweep from 0.20 to 1.00 on this history.

## Why the ceiling is the whole history

Both 1.00 and 2.50 read all 38 samples from t = 15.000000 days and return a derivative slope of 1.229355999, fitted on the 34 positive samples over 2.122891107 log cycles, mechanism displacement. Ask for more history than exists and you get the history, with nothing saying the request was trimmed.

## The mistake

Reading a clamped run as an error that never happened. Someone who types 0.05 meaning the last handful of points is not refused: they are handed a mechanism, and it is the one that blocks the squeeze. The only clue is that 0.05 and 0.10 return identical answers.

## What it refuses

Nothing here. The module does know how to refuse: hand it a history of 5 samples and it returns `ok = false` with "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more." That guard counts before it reads. The dial has no guard, and the clamp appears in no field of the result, no note and no warning.

## Exercise

Run ELELENWO-4 at `lateFraction` 0.05 and at 0.20 and record the mechanism and the derivative slope each returns.

Then say which of the two a screening run would act on, and what a reader would need to tell the first apart from a fraction of 0.10 typed on purpose.
