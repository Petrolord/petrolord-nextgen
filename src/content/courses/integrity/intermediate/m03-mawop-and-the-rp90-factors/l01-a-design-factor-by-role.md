# A design factor by role

The engine never asks what the pipe is. It asks what job the pipe is doing, and the job sets the fraction of the rating you are allowed to use.

{{panel:wi-annulus-explorer}}

## The table

`RP90_MAWOP_FACTORS` in `wellIntegrity.js` holds five entries and nothing else:

| Role | Factor |
| --- | --- |
| outer-casing-burst | 0.5 |
| inner-casing-burst | 0.8 |
| inner-tubing-collapse | 0.75 |
| shoe-formation | 1.0 |
| rating | 1.0 |

These are the API RP 90 convention defaults. They are a working operating envelope, not a prediction of when steel parts.

## What each role means

**outer-casing-burst** is a string with another annulus outside it, or the formation. You are pressuring it from the inside and the thing that would contain a failure is not readily inspectable.

**inner-casing-burst** is a string you can reach, log and pressure test as a routine operation.

**inner-tubing-collapse** is the completion string being squeezed from the annulus side. The failure mode is buckling rather than rupture, so it is treated separately from burst.

**shoe-formation** is not steel at all. It is the fracture limit at a casing shoe, already established by a leak off test, so there is no further derating to apply.

**rating** is the escape hatch. It means you have supplied a limit that is already the working limit and you want the engine to take it at face value.

## Where the factor enters

`mawop` looks up the factor for each candidate role, then hands the candidates to `maaspRows` as ordinary elements. The row arithmetic is identical to MAASP. The factor multiplies the limit and nothing else:

    allowable surface pressure = factor x limit - differential head

So a role change never moves the hydrostatic term. It moves only the rated term, and it moves it by a fixed proportion.

## Where the engine refuses

If a candidate carries a role that is not in the table, `mawop` throws with the candidate name in the message rather than defaulting to something permissive. An unrecognised role is a typing error or a convention the engine has not been taught, and both deserve a stop.

`maaspRows` then refuses any factor outside the interval greater than zero and up to and including one. A factor above one is not a design factor, it is an uprate, and this engine will not perform one.

## Exercise

Load one candidate in the panel and run it five times, once per role, changing nothing else. Record the allowable each time.

Then predict, before you run it, which two roles must give the same answer, and say why the hydrostatic term never changed across the five runs.
