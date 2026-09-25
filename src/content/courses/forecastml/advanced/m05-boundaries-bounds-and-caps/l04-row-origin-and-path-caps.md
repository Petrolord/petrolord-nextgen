# Row, origin and path caps

{{panel:pf-uncertainty-explorer}}

{{panel:pf-backtest-explorer}}

Every call has to finish, so each kind of size has a cap, read from the exported `DEFAULTS`. A cap trades time for size: a study larger than a cap is split into calls, or its step raised.

## The caps

| default | value | what it sets |
| --- | --- | --- |
| `MAX_POINTS` | 100000 | the most values a series may carry |
| `MAX_H` | 10000 | the largest h (and horizon) accepted |
| `MAX_SIMS` | 100000 | the most bootstrap paths accepted |
| `MAX_ORIGINS` | 5000 | the most origins one backtest or comparison accepts |
| `PS_MAX_EVALS` | 200000 | the most SSE evaluations one fit takes |

## Series length

A series of 100000 values is fitted by `fitSmoothing`; 100001 values are refused by all six functions. The message states the count and the cap:

> y has 100001 values, above the 100000 this engine accepts

## Origins

A backtest or a comparison runs one fit per origin, so the origin count is capped at 5000. EKENE-P1 repeated to 5005 values, with step 1, asks for 5003 origins and is refused, naming the field `step`:

> step gives 5003 origins, above the 5000 a backtest accepts: raise step or firstOrigin

The message names both ways out. A larger step spaces the origins out; a later first origin starts them further along.

## Paths and horizons

The bootstrap accepts up to 100000 paths; one more is refused:

> nSims must be a whole number from 1 to 100000

A fit or an Arps forecast accepts an h up to 10000 steps, and the bootstrap shares that top. For a fit, h of 10001 is refused:

> h must be a whole number from 0 to 10000

The bootstrap's own h message runs from 1, because an interval needs at least one step.

## The evaluation cap, which warns

The fit's cap is different in kind. The compass search stops at 200000 SSE evaluations if its step has not yet fallen to 2^-30 of the range. The fit is not refused: it returns with `converged` false and a warning in `warnings`. No fit in this course reaches that cap. If one of yours does, report the warning with the parameters, and read them as the point where the search stopped, which may not be the minimum. Every optimiser record the course reads reports `converged` true; the three EKENE-P1 fits in its fitting table take 38, 329 and 1067 evaluations.

## Reading a cap

A cap is a limit on work. It says nothing about whether a forecast is good, and staying under one proves nothing about the method. When a study meets a cap, split it or raise the step, and say in the note that you did.

## Exercise

Open "A rolling-origin backtest" in the backtest explorer with EKENE-P1, holt, first origin 24, horizon 6, and step 6, and count the origins it lists. Change the step to 3 and then 1 and count again. Then, in the uncertainty explorer's "Bootstrap intervals", set the paths to 100000 and read the tile, then 100001 and read the engine's words.
