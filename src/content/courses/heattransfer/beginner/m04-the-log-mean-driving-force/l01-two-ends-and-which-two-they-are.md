# Two ends, and which two they are

The driving force an exchanger works across is not a temperature. It is a temperature difference, and because the difference is not the same at both ends of the exchanger, it is an average of two of them. The average is a log mean: the two ends subtracted, divided by the natural logarithm of their ratio. Everything difficult about it is in the question of which two ends.

{{panel:fc-exchanger-explorer}}

## The counter-current pairing

In counter-current flow the hot stream enters where the cold stream leaves. So each end of the exchanger has one inlet and one outlet at it, and each inlet is paired with the other stream's outlet.

On the studio terminals that gives a hot inlet of 300 F facing a cold outlet of 134.375000 degF, a difference of 165.625000 degF. At the other end a hot outlet of 200.000000 degF faces a cold inlet of 100.000000 degF, a difference of 100.000000 degF. The log mean of those two is 130.064846 degF.

## The parallel pairing

In parallel flow both streams enter at the same end, so the two inlets are paired and the two outlets are paired.

The same four temperatures now give a hot inlet of 300 F facing a cold inlet of 100.000000 degF, which is 200.000000 degF, and a hot outlet of 200.000000 degF facing a cold outlet of 134.375000 degF, which is 65.625000 degF. Their log mean is 120.584840 degF. One end got wider and the other got much narrower, and the mean came out below the counter-current one.

The parallel end differences sit further apart than the counter-current pair. The log mean is pulled down hard by the narrow end, and that is a property of the mean rather than of this case.

## Both pairings on both cases

| case | arrangement | end one, degF | end two, degF | log mean, degF |
| --- | --- | --- | --- | --- |
| the studio case | counter | 165.625000 | 100.000000 | 130.064846 |
| the studio case | parallel | 200.000000 | 65.625000 | 120.584840 |
| ORON | counter | 177.484127 | 113.000000 | 142.824087 |
| ORON | parallel | 223.000000 | 67.484127 | 130.108390 |

ORON shows the same pattern on its own four temperatures. Its parallel pairing has the wider end one and the narrower end two, and its parallel log mean comes out below its counter-current one. Read the direction off the table and stop there. Do not divide one row by another, on either case. This engine is not asked for that ratio anywhere in this course, so nothing here stands behind such a figure.

## What the answer carries

The log mean door hands back five keys. The log mean itself, the two end differences it used, a flag saying whether the two ends were equal, and the basis, which is the arrangement it worked under.

The two end differences are the useful ones for checking. If your log mean disagrees with the engine's, compare the ends before you look at the mean. A log mean is one subtraction, one division and one logarithm, and it is hard to get wrong once its two inputs are agreed. The pairing is where the disagreement usually is, and the two end keys let you find it in one glance.

## Exercise

For the studio case, write out both pairings as four subtractions and check all four end differences against the table. Then say, for each arrangement, which of the four terminal temperatures appears at which end, and which terminal appears at both ends in neither arrangement.
