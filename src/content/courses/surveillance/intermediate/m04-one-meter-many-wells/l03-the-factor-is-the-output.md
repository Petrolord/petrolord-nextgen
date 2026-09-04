# The factor is the output

An allocation factor is not a correction applied on the way to an answer. It is the answer, and `computeAllocation` returns it per phase and per date because it is the only number in the run that describes the field rather than a well.

{{panel:pd-exception-explorer}}

## One ratio, and nothing tidies it

For each date and each phase, `computeAllocation` sums the theoretical volumes of the wells that have a basis, divides the metered total by that sum, and keeps the result. It is dimensionless, and nothing normalises it, clamps it into a band, or rescales the tests that produced it. `factorWarnLow` at 0.7 and `factorWarnHigh` at 1.3 only decide whether a `factor_out_of_band` diagnostic is counted.

The five published allocation runs are the same field and the same meter under five settings, and only the theoretical side moves.

| Published run | Theoretical oil, stb | Grand oil factor |
| --- | --- | --- |
| default | 38046.666666667 | 1.043350271596 |
| `useUptime` false | 41300.000000000 | 0.961162227603 |
| `maxTestAgeDays` 120 | 23540.000000000 | 1.686321155480 |
| `includeInvalidTests` true | 33246.666666667 | 1.193984359334 |
| basis ledger | 39980.000000000 | 0.992896448224 |

Measured oil is 39696.000000000 stb in all five. The factor swung from 0.961162227603 to 1.686321155480 without one barrel of metered volume changing.

## The daily column, and the day the field moved

On the teaching field OGUTA, which this wave invented and which is neither real nor published, the last seven allocated days read as calendar volumes over each date.

| Date | Entries | Oil factor |
| --- | --- | --- |
| 2024-11-14 | 3 | 1.199542699562 |
| 2024-11-15 | 3 | 1.216888186094 |
| 2024-11-16 | 3 | 0.790840256747 |
| 2024-11-17 | 3 | 0.773452921269 |
| 2024-11-18 | 3 | 1.211141796077 |
| 2024-11-19 | 3 | 0.783672959586 |
| 2024-11-20 | 3 | 1.190463125091 |

Three dates fall by a third, and no test changed on them: OGUTA-2 is carried throughout by g-o2-2 dated 2024-11-02 at 1036.000000 stb/d of oil. The well changed. Its own ledger row reads 1021.000000 stb on 2024-11-15 and 88.000000 stb on 2024-11-16, so the meter saw far less oil while the model still claimed a full day.

An earlier step runs the other way: on 2024-11-05 four entries give an oil factor of 0.966380008629, and on 2024-11-06 the test carrying OGUTA-17 ages out, leaving three entries and a factor of 1.212710044537.

## The mistake

Reading the factor as a property of the meter. It is a ratio between one measurement and a set of models, and on those three dates one well's collapse moved it. Because every share is that same factor times a theoretical, OGUTA-6 and OGUTA-9 were scaled down on 2024-11-16 for something that happened on a different well.

## What it refuses

`computeAllocation` will not clamp, will not normalise and will not attribute. A factor of 1.686321155480 is returned exactly as it fell out, and the only response is a count in `diagnosticCounts` that names the number and never the well.

## Exercise

Write the OGUTA oil factors for 2024-11-15 and 2024-11-16 and the OGUTA-2 ledger volumes on those dates.

Then say which wells on the field had their allocated oil moved by the difference.
