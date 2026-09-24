# Frozen values and a slow drift

{{panel:dq-checks-explorer}}

A sensor that stops updating does not go blank. It keeps reporting its last reading, day after day or sample after sample, and every one of those readings is present, valid and in range. The only sign is that the value does not move. `frozenRuns` looks for exactly that: a run of at least `minRun` consecutive present values, each within `tolerance` of the run's FIRST value. The Petrolord defaults are minRun 5 and tolerance 0.

| series | runs | start | end | length | value held |
| --- | --- | --- | --- | --- | --- |
| EKENE-7 DT, us/ft, entries | 1 | 175 | 183 | 9 | 83.200000 |
| EKENE-3 gas, Mscf/d, days | 1 | 74 | 81 | 8 | 748.700000 |

## The two frozen runs

EKENE-7's sonic held one value, 83.200000 us/ft, from entry 175 to entry 183: a run of 9. In a log, where the rock changes every half foot, nine identical readings in a row suggest the tool stopped responding.

EKENE-3's gas meter held its day 74 value for the seven days after it, a stated planted defect, so the run is eight days long, days 74 to 81, at 748.700000 Mscf/d. Its reason, verbatim: "8 values in a row from entry 73 to 80 stay at 748.7". The entries count from 0, so entry 73 is day 74 and entry 80 is day 81.

The same check finds no frozen run in the oil, water or gross columns at the defaults.

| EKENE-3 column | frozen runs at the defaults |
| --- | --- |
| oil | 0 |
| water | 0 |
| gross | 0 |

## Why compare with the first value

The rule compares every value in a candidate run with the run's first value. There is an alternative: compare each value with the one before it. The slow drift below shows why the engine took the first.

The readings 410.000000, 410.100000, 410.200000, 410.300000, 410.400000, 410.500000, 410.600000 are a stated input. They rise 0.100000 at a time. At tolerance 0.15 and minRun 5, the engine finds 0 runs, because each value is compared with the run's first value, and the values soon move beyond the tolerance from it.

Derived, and a rule the engine does not use: comparing each value with the one before it would chain all 7 readings into one run, because every single step is within the tolerance. A drifting gauge is a different fault from a stuck one, and neighbour comparison would report it as stuck. Comparing with the first value keeps a frozen run meaning what it says.

## The defaults are choices

A minRun of 5 sets how long a run must be before it is flagged, and a tolerance of 0 says only exact repeats count. Both may be wrong for a channel that is steady by nature, such as a shut-in pressure, where long equal runs are the truth. Set them from what the channel should do. The engine refuses a minRun below 2, since a run of one is every value:

> minRun must be a whole number, 2 or more

A missing value ends a run. A frozen meter that also drops a reading will show as two shorter runs, and both may fall under minRun.

## Exercise

Open the checks explorer on the consistency view. The stuck-series box holds a stretch of EKENE-3's gas around its frozen run, with minRun 5 and tolerance 0. Read the flag and copy its reason. Now replace the series with the seven drift readings from this lesson, set the tolerance to 0.15, and read the flags. Explain why a rule comparing each value with its neighbour would have flagged the drift and this one does not.
