# What a diagnostic is for

An allocation returns three diagnostic codes and a count of each. None of them is a verdict, none of them names a well in the count, and the one an operator most wants is the one that fires for the wrong reason.

{{panel:pd-exception-explorer}}

## The three codes

`no_test_in_force` fires on a well and a date with no test inside `maxTestAgeDays`, and that well takes no share. `no_basis` fires on a date whose theoretical is zero for a phase, and that date's metered volume is allocated to nobody. `factor_out_of_band` fires when a factor falls outside `factorWarnLow` of 0.7 or above `factorWarnHigh` of 1.3, and it changes nothing about the split.

The published default allocation returns `{"factor_out_of_band":6,"no_test_in_force":24}`. Turning `useUptime` off on the same 24 days returns `{"factor_out_of_band":1,"no_test_in_force":24}`.

## The counts move the wrong way against the factor

On the teaching field OGUTA, invented for this course and neither real nor published, the same 21 days under four settings.

| Setting | Last-day oil factor | Diagnostics |
| --- | --- | --- |
| default | 1.190463125091 | `{"no_test_in_force":57}` |
| `maxTestAgeDays` 120 | 1.190463125091 | `{"no_test_in_force":65,"factor_out_of_band":6}` |
| `maxTestAgeDays` 60 | 1.348582874057 | `{"no_test_in_force":86,"factor_out_of_band":35}` |
| `maxTestAgeDays` 0 | 0.909283141463 | `{"no_test_in_force":42,"factor_out_of_band":9}` |

The bottom row has the factor closest to one and the fewest no-test diagnostics, 42 against 57. It is also the row on which the age check is not running at all: the guard is `Number.isFinite(maxTestAgeDays) && maxTestAgeDays > 0`, so zero fails it and the check is off. An operator turning the dial down while watching the factor converge on one and the diagnostics thin out walks straight into a disabled guard and gets a cleaner-looking run for it.

## A diagnostic names a symptom

A derived two-well demonstration makes the point without any settings at all. Told that SHARE-B was shut in, the oil factor is 1.000000000000 and no diagnostic fires. Told nothing about SHARE-B, so that no ledger row exists for it, the oil factor is 0.500000000000 and the diagnostics are three `factor_out_of_band`. The code that fired reports that a factor left the band. Nothing reports that a well with no row was credited with a full 24 h day and took half the metered oil.

## The mistake

Reading a short diagnostic list as a clean run. The list counts events, not wells, and there is no count of anything that went right, so a run with fewer diagnostics may simply be one where fewer checks were live.

## What it refuses

The counts carry no well identifiers and no dates. `diagnosticCounts` is a tally, so a `no_test_in_force` of 57 does not say whether that is one well for a long time or many wells briefly.

## Exercise

Write the OGUTA last-day oil factor and the diagnostic counts at `maxTestAgeDays` of 180 and of 0.

Then say which of the two runs applied an age limit.
