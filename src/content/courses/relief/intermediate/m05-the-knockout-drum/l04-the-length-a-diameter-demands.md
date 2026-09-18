# The length a diameter demands

{{panel:fc-fire-drum-explorer}}

Sizing a knockout drum is a search over diameters. At each candidate diameter the engine returns the length that diameter demands, and you choose. This lesson is that search, and it starts with where the settling velocity comes from.

## The settling velocity is a stated input here

The drum route takes a dropout velocity as an input. It never computes one. That is worth dwelling on, because the module does carry a route that computes a settling velocity, and this course states the number instead.

The reason is the previous two lessons. A computed settling velocity rests on the drag correlation, which is held for literature: an empirical fit no route in this package derives, shared with the validation oracle on purpose, and therefore unchecked by any published case. A drum length built on a stated velocity rests on a number you can see and defend. A drum length built on a computed one silently inherits that fit.

The published drum cases are stated the same way. Every one of them carries its dropout velocity as an input column, at 1.730000 ft/s on five rows and 2.400000 ft/s on the sixth, so the set exercises the drum geometry without the settling fit in the way.

So when a drum question gives you a settling velocity, use the one you were given. Do not go and compute a different one from a droplet size.

## The diameter walked at the ODIDI duty

| diameter ft | vapour velocity ft/s | required length ft | L over D |
| --- | --- | --- | --- |
| 5.000000 | 14.473498 | 12.648469 | 2.529694 |
| 6.000000 | 10.051040 | 10.540391 | 1.756732 |
| 7.000000 | 7.384438 | 9.034621 | 1.290660 |
| 8.000000 | 5.653710 | 7.905293 | 0.988162 |
| 9.000000 | 4.467129 | 7.026927 | 0.780770 |
| 10.000000 | 3.618375 | 6.324234 | 0.632423 |
| 12.000000 | 2.512760 | 5.270195 | 0.439183 |
| 14.000000 | 1.846109 | 4.517310 | 0.322665 |

A wider drum gives more vapour cross-section, so the vapour crosses it more slowly, so less length is needed to give a droplet time to fall. Both the velocity column and the length column fall the whole way down. That is the design move in one table.

## The holdup does something less obvious

| holdup fraction | vapour velocity ft/s | fall distance ft | required length ft |
| --- | --- | --- | --- |
| 0.000000 | 3.340002 | 9.000000 | 7.505603 |
| 0.100000 | 3.523372 | 8.100000 | 7.125904 |
| 0.250000 | 4.151655 | 6.750000 | 6.997154 |
| 0.300000 | 4.467129 | 6.300000 | 7.026927 |
| 0.500000 | 6.680004 | 4.500000 | 7.505603 |
| 0.750000 | 17.084312 | 2.250000 | 9.597904 |
| 0.900000 | 64.176478 | 0.900000 | 14.421645 |
| 0.990000 | 1973.354184 | 0.090000 | 44.344927 |

The required length is not monotonic in the holdup. Two effects move against each other. Filling the drum shrinks the vapour space and speeds the gas up, which needs more length. Filling it also shortens the distance a droplet has to fall, which needs less. Read the required-length column top to bottom and find where it turns.

Across that whole range the required length runs from 6.997154 ft to 44.344927 ft, a spread of 37.347773 ft, while the vapour velocity runs from 3.340002 ft/s to 1973.354184 ft/s. Those are the course's own printed extremes and spread.

## What the two tables together tell you

The diameter sweep moves one input and the holdup sweep moves another, and the two behave completely differently. The diameter is a clean lever: push it one way and both the velocity and the length follow. The holdup is not a lever at all, because the length turns inside its range.

Neither table prints a ratio between any two of its rows, and none should be formed. Where a comparison belongs in this course it is computed and printed, as the spread above is. A quotient of two rows off either table is a figure this engine never produced.

## Exercise

Say where the drum route's settling velocity comes from in this course and why it is stated rather than computed. Then give the diameter that needs the shortest length in the sweep, name the two effects that fight each other as the holdup rises, and say which row the required length turns on.
