# Several starts and the lowest inertia

{{panel:ef-cluster-explorer}}

Lloyd passes always stop, but where they stop depends on where they started. One start can settle into a poor arrangement and stay there. The remedy is to start several times from different rows and keep the best. The engine runs `nInit` starts, 10 by default, each drawing its starting rows in turn from one mulberry32 stream on the seed, each running its passes to the end. The start with the lowest inertia wins.

| start | starting rows | passes | inertia |
| --- | --- | --- | --- |
| 0 | 129, 5, 79, 11 | 5 | 58.330411 |
| 1 | 137, 81, 87, 29 | 4 | 75.958349 |
| 2 | 47, 102, 33, 10 | 6 | 58.330411 |
| 3 | 128, 90, 126, 167 | 6 | 58.289042 |
| 4 | 58, 113, 49, 100 | 3 | 78.982664 |
| 5 | 94, 129, 82, 3 | 5 | 58.289042 |
| 6 | 157, 61, 162, 127 | 5 | 78.768801 |
| 7 | 75, 119, 21, 79 | 4 | 77.624096 |
| 8 | 130, 0, 7, 80 | 6 | 58.289042 |
| 9 | 155, 107, 97, 128 | 7 | 58.330411 |

## Ten starts from seed 3

The table is k 4, seed 3, 10 starts, on the 180 cored rows with standard scaling. Start 0 is the one-start run of the earlier lessons. Four starts stop far up, between 75.958349 and 78.982664. Three stop at 58.330411 and three at 58.289042.

Start 3 wins with 58.289042. Starts 5 and 8 print the same figure. When a later start only ties the best so far, it does not replace it, so the earliest of them keeps the win. The basis reads:

> lowest inertia over the runs; a run within 1e-12 (relative) of the best so far does not replace it

## One start against ten, seed by seed

| seed | inertia, one start | inertia, ten starts |
| --- | --- | --- |
| 1 | 58.330411 | 58.289042 |
| 2 | 58.289042 | 58.289042 |
| 3 | 58.330411 | 58.289042 |
| 4 | 78.754217 | 58.289042 |
| 5 | 78.775612 | 58.297079 |
| 6 | 58.289042 | 58.289042 |
| 7 | 78.775612 | 58.289042 |
| 8 | 58.330411 | 58.289042 |
| 9 | 58.330411 | 58.289042 |
| 10 | 75.911640 | 58.289042 |

The lowest inertia in the table is 58.289042. With one start, 8 of the 10 seeds stop above it, some as high as 78.775612. With ten starts, 9 of the 10 reach it, and seed 5 stops just above, at 58.297079.

More starts make a poor stop less likely. They do not rule it out, as seed 5 shows. That is why a k-means result is quoted with its seed and its number of starts: the teaching clustering is k 4, seed 3, 10 starts, inertia 58.289042.

## Why seed 5 stops above

With ten starts, seed 5 ends at 58.297079. None of its ten starts found 58.289042. Each start is a separate search from its own starting rows, and ten of them drawn from one stream can all miss the lowest arrangement. The figure is still a valid result of that call. It belongs to a different partition from the teaching one, and quoted without its seed it could not be reproduced.

## What a poor stop looks like

With one start, seed 5 stops at 78.775612 with clusters of 32, 96, 30 and 22 rows. One cluster holds 96 of the 180 rows, a far more lopsided grouping than the 29, 59, 54 and 38 rows of the teaching clustering. A lower inertia says the fit is tighter. It says nothing yet about rock types.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows and the four logs, k 4 and seed 3, with ten starts, and check the starts table against the one above. Then set the seed to 5 and read which start wins and at what inertia. Double the starts at seed 5 and write down whether the winning inertia changes.
