# Why an allocation is not a measurement

Nobody measured the well. One meter measured the stream, and `computeAllocation` split that one number across a set of models.

{{panel:pd-exception-explorer}}

## Three lines of arithmetic, and none of them touch the well

`computeAllocation` forms a theoretical for each well on each date as the test rate in stb/d times the uptime fraction, which gives a volume in stb over that date. It sums the theoreticals of the wells that have a basis, divides the metered total by that sum to get a factor, dimensionless, and multiplies each theoretical by it.

The published allocation golden runs 24 days on basis test with useUptime true and maxTestAgeDays 180. Measured oil is 39696.000000000 stb, theoretical oil is 38046.666666667 stb, allocated oil is 39696.000000000 stb, and the grand factor is 1.043350271596. Two wells took a share.

## One well, one day, three different numbers

On the teaching field OGUTA, invented by this wave and neither real nor published, the last allocated day is 2024-11-20. OGUTA-2 has test g-o2-2 dated 2024-11-02 in force and an uptime of 1.000000000, so its theoretical oil for that day is 1036.000000000 stb. Its allocated oil is 1233.319797595 stb. The row the well itself filed in the ledger that day carries 1014.000000000 stb.

| Reading of OGUTA-2 on 2024-11-20 | Oil, stb over the day |
| --- | --- |
| Its own ledger row | 1014.000000000 |
| Theoretical from the test in force | 1036.000000000 |
| Allocated share of the meter | 1233.319797595 |

All three are calendar volumes over one row and not producing-day rates. Naming which you are quoting is the whole discipline.

## The factor carries the field into every well

The oil factor on that date is 1.190463125091, and every well on it is multiplied by that same number. OGUTA-6 goes from a theoretical of 260.862500000 stb to an allocated 310.547186969 stb, OGUTA-9 from 928.000000000 stb to 1104.749780085 stb. The factor is not a property of any one of them. It is the ratio between what the meter saw, 2648.616764649 stb, and what the models claimed, 2224.862500000 stb, so an error anywhere in that set arrives in every well scaled by that well's share.

## The mistake

Reading an allocated volume as production data. It is a modelled quantity carrying a field-wide correction, and the well's own ledger row is a separate number that disagrees with it. The careful version is subtler: quoting the theoretical because it sits closer to the ledger row. The theoretical is a test rate scaled by an uptime, so it is just as modelled, and it is the number of the three that no meter ever saw.

## What it refuses

A well with no test in force takes no share at all rather than a guessed rate, and records the reason. Over the teaching field's 21 allocated days the diagnostics are `{"no_test_in_force":57}` and only four wells of eight ever take a share.

## Exercise

Write down the three OGUTA-2 oil numbers for 2024-11-20 and label each one.

Then say which of them changes if the facility meter is recalibrated and the ledger is untouched.
