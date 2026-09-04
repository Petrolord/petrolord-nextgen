# Which test is in force

A well test is a rate measured once. `testInForce` is the rule that decides how long that one measurement is allowed to speak for a well, and it is the function that decides which wells are in an allocation at all.

{{panel:pd-exception-explorer}}

## The most recent test on or before the day

For a given well and a given date, `testInForce` takes the latest test dated on or before that date, provided its age is within `maxTestAgeDays`, a default of 180 days. The published probes on well w-p1 at the default show the whole rule in six dates.

| Date | Test in force |
| --- | --- |
| 2024-12-19 | none |
| 2024-12-20 | t-p1-a |
| 2025-01-25 | t-p1-a |
| 2025-02-04 | t-p1-a |
| 2025-02-05 | t-p1-b |
| 2025-02-17 | t-p1-b |

A newer test takes over on its own date and not before it, and no interpolation happens between the two. Well w-p3 returns none at all six of those dates at both 180 and 120 days, and a well with no test in force takes NO share of the metered stream rather than a guessed rate, recording a `no_test_in_force` diagnostic instead.

## The limit is inclusive, and one day past it the well drops out

On the teaching field OGUTA, invented for this course and neither published nor real, OGUTA-17 is carried on 2024-10-31 by test g-o17-1 dated 2024-05-09 at 688.000000 stb/d of oil, 175 days old. On 2024-11-05 the same test is 180 days old and still in force. On 2024-11-06 there is no test in force for that well.

Across the 21 allocated days on that field, four wells take a share and the run records 57 `no_test_in_force` diagnostics. Over the same days OGUTA-2 switches carriers: g-o2-1 dated 2024-06-18 at 1074.000000 stb/d, 135 days old on 2024-10-31, then g-o2-2 dated 2024-11-02 at 1036.000000 stb/d, 3 days old on 2024-11-05.

## Which tests are even candidates

`groupTests` runs first and drops a test only when its `is_valid` is STRICTLY false. Handed six tests at the default settings it keeps five: a true, an ABSENT flag, a null, the STRING "false" and a zero. One of the six is dropped. With `includeInvalidTests` set it keeps all six.

## The mistake

Reading a filed test as the thing that carries the well. The flag on the row carries it. OGUTA-17 has a test dated 2024-11-06 at 421.000000 stb/d of oil, and because that row was filed with `is_valid` false the well has no carrier from that date, so the well drops out of the split on the day a fresh test was taken on it.

## What it refuses

`testInForce` never looks forward and never averages. It will not blend two tests, will not extrapolate a decline between them, and returns null rather than the nearest test when the nearest one is in the future.

## Exercise

Probe OGUTA-17 on 2024-11-05 and on 2024-11-06 and record which test is in force at each.

Then say what changed about the well between those two dates.
