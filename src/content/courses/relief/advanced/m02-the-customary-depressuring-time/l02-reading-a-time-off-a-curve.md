# Reading a time off a curve

An orifice is a decision, so the useful object is the time against the orifice across the whole range you would consider, rather than a single call at the size you happened to type first. This lesson reads that curve.

{{panel:fc-blowdown-explorer}}

## The sweep

| orifice in (stated) | time s | time min, derived | final temperature degR | steps | substeps |
| --- | --- | --- | --- | --- | --- |
| 0.500000 | 1677.618587 | 27.960310 | 340.807983 | 16777 | 0 |
| 0.750000 | 745.608268 | 12.426804 | 340.807983 | 7457 | 0 |
| 1.000000 | 419.404662 | 6.990078 | 340.807983 | 4195 | 0 |
| 1.250000 | 268.419002 | 4.473650 | 340.807983 | 2685 | 0 |
| 1.500000 | 186.402100 | 3.106702 | 340.807983 | 1865 | 0 |
| 2.000000 | 104.851242 | 1.747521 | 340.807983 | 1049 | 0 |
| 2.500000 | 67.104843 | 1.118414 | 340.807983 | 672 | 0 |
| 3.000000 | 46.600653 | 0.776678 | 340.807983 | 467 | 0 |

Everything else is held at the AFIESERE conditions. Only the orifice moves, which is what makes the table a sweep rather than a collection of cases.

## The one comparison the lab prints here

The time does not scale with the diameter. Doubling the orifice from 1.000000 in to 2.000000 in takes the time from 419.404662 s to 104.851242 s, a ratio of 0.250000182473.

That is the only ratio on this page you may quote, because it is the only one the course computes. The temptation with a table like this is to form ratios all the way down it, and every one you form yourself is a number nothing stands behind. If you want the relationship, the printed ratio is where it is, and it tells you the time runs with the area of the hole rather than its diameter, since the mass rate through a choked throat goes with the throat area.

Read the rest of the table for direction. The time falls as the orifice grows, monotonically, across the whole range, and the row at 1.250000 in is the AFIESERE case the rest of the module is written on. The step count falls with the time, because the step size is fixed here and a shorter march needs fewer steps to cover the same pressure drop. The substep column stays at zero on every row, which is a statement about the step size rather than about the orifice, and the next module is where it becomes interesting.

## The column that does not move

The final temperature column reads 340.807983 degR on every row. Distinct final temperatures across this sweep, counted: 1.

A column that does not move is a result rather than an oversight, and it is the subject of the fourth lesson in this module. Notice for now that the sweep is the evidence for it. Somebody could assert that the end state is independent of the orifice, and it would sound like a plausible claim about a model. The sweep makes it a measurement.

## What a reading is worth

A time read off this table is worth exactly what its inputs are worth. It carries the stated volume, the two pressures, the gas properties, the discharge coefficient and the step size, and moving any of them moves the whole curve. The curve is not a property of the vessel. It is a property of the vessel and the assumptions together, which is why a study quotes both.

## Exercise

Record the times at orifices of 0.500000, 1.000000, 1.250000 and 3.000000 in, in seconds and minutes. Record the printed ratio between the times at 1.000000 in and 2.000000 in and say what it tells you the time runs with. Then record the count of distinct final temperatures across the sweep, and write one sentence on why forming your own ratios down this table is a mistake.
