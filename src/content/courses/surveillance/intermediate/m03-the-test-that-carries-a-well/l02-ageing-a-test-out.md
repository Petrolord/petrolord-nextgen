# Ageing a test out

`maxTestAgeDays` reads like a limit. It is a limit only while it is a finite positive number, and the clause that establishes that decides more about an allocation than the number itself does.

{{panel:pd-exception-explorer}}

## The guard, and what falls through it

The age check is wrapped in `Number.isFinite(maxTestAgeDays) && maxTestAgeDays > 0`. Anything that fails that clause turns the check OFF entirely and the oldest test on file carries its well forever. A demonstration test 2088 days old on 2024-11-20:

| `maxTestAgeDays` | Test in force |
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

Omitting the argument entirely gives none, because the default parameter substitutes 180. So `undefined` and `null` mean opposite things here, and both are how a form field spells the user did not fill this in. Zero, which reads as no age is acceptable, is the most permissive setting on the list.

## What the setting is worth in barrels

On the teaching field OGUTA, invented for this course and neither published nor real, over 21 allocated days. The metered oil the split is working from does not move: allocated oil is 58426.784897363 stb in every row.

| `maxTestAgeDays` | Wells with a share | Theoretical oil, stb | Last-day oil factor |
| --- | --- | --- | --- |
| 180, the default | 4 | 54713.920833333 | 1.190463125091 |
| 120 | 3 | 48437.920833333 | 1.190463125091 |
| 60 | 2 | 39172.000000000 | 1.348582874057 |
| 0 | 4 | 65033.920833333 | 0.909283141463 |

Tightening the age from 180 to 60 days takes two wells out of the split and drops the theoretical oil to 39172.000000000 stb, so the same metered oil is divided among fewer wells and the last-day oil factor rises to 1.348582874057. Setting it to 0 does the opposite: 65033.920833333 stb of theoretical oil, MORE than the default, because tests older than 180 days are now carrying their wells again.

## The mistake

Reading a factor near one as evidence the age setting is sensible. At `maxTestAgeDays` of 0 the last-day oil factor is 0.909283141463, closer to one than the default gives, and it was produced by tests the default had already thrown out.

## What it refuses

The function refuses nothing on the strength of a test's content. Age and the `is_valid` flag are the only two gates, so a stale rate and a fresh one are indistinguishable inside the limit, and a rate measured a day inside the limit carries its well at full weight.

## Exercise

Run the teaching allocation at `maxTestAgeDays` of 180, 60 and 0 and record the wells taking a share at each.

Then say why 0 admits more wells than 60 does.
