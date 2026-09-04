# A limit that turns itself off

`testInForce` guards a test's age with `Number.isFinite(maxTestAgeDays) && maxTestAgeDays > 0`. Zero is the strictest number a user can type on that dial, and it is the value that switches the age check off.

{{panel:pd-reading-explorer}}

## The guard, on one old test

A derived demonstration, a single test 2088 days old on 2024-11-20.

| maxTestAgeDays | Test in force |
| --- | --- |
| 180 | none |
| 365 | none |
| exactly the age of the test | demo-old |
| one day short of the age | none |
| 1 | none |
| 0 | demo-old |
| -1 | demo-old |
| NaN | demo-old |
| null | demo-old |
| Infinity | demo-old |
| omitted entirely | none |

Omitting the argument refuses the old test, because the default parameter substitutes 180. Passing null accepts it, because null is not a finite positive number and the guard is skipped. Both are how a form field spells "not filled in", and they mean opposite things.

## What it costs a field

The teaching field OGUTA, invented for this course and not a published case, on that one setting with everything else default.

| maxTestAgeDays | Wells taking a share | Theoretical oil, stb |
| --- | --- | --- |
| 30 | 2 | 28036.000000000 |
| 14 | 1 | 15540.000000000 |
| 7 | 1 | 8288.000000000 |
| 1 | 1 | 2072.000000000 |
| 0 | 4 | 65033.920833333 |

At the default of 180 days that theoretical oil is 54713.920833333 stb over four wells, and at 60 days it is 39172.000000000 stb over two. Tightening the dial from one day to zero does not tighten it further. It admits every test on file and returns more theoretical oil than the default does.

## The dial that looks healthiest

The allocation factor is dimensionless, the metered total over the theoretical total, so a factor near one reads as a field whose tests agree with its meter. On the teaching field the last allocated day carries an oil factor of 1.190463125091 at the default, with 57 `no_test_in_force` diagnostics. At `maxTestAgeDays` 0 that factor is 0.909283141463, nearer to one, with 42 `no_test_in_force` diagnostics, the fewest on the sweep. Only `factor_out_of_band` rises, from none to 9.

Tuning the age limit by watching the factor look healthy tunes straight into the disabled guard.

## A second dial of the same shape

`decimate(points, maxPoints)` strides by `Math.ceil(n / maxPoints)`. Off a 1501 point series at a cap of 1500 it returns 751, half the budget. Off a 2999 point series it returns 1500 and off a 3000 point series 1501, one more than the maximum the argument names, because the last point is always kept.

## The mistake

Treating a settings value as an assertion about the data. A returned allocation names neither the age limit that chose its tests nor the count of wells that limit excluded.

## Exercise

Run the teaching field at `maxTestAgeDays` of 1 and then of 0 and record the wells taking a share at each.

Then say which run you would defend to a partner, and what you would show alongside the factor to defend it.
