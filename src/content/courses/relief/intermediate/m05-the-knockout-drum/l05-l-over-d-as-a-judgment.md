# L over D, as a judgment

{{panel:fc-fire-drum-explorer}}

The required length is an answer. The L over D beside it is a judgment about whether the drum you just sized is a sensible piece of equipment. The engine offers that judgment as a note, and the note has two edges, both measured.

## The band the engine treats as reasonable

| edge | value | what happens |
| --- | --- | --- |
| the smaller-drum note ends at | 2.000000000000 | below this the note appears |
| the go-wider note starts at | 6.000000000000 | above this a different note appears |

Between those two the engine says nothing, and that silence is the band it treats as reasonable. Below the lower edge the note reads `L/D below 2: a smaller drum may do`, which is the engine's own wording. A drum shorter than twice its diameter is usually a wide vessel doing a job a narrower one would do for less steel.

The edges are bisected out of behaviour rather than read off constants.

## The stated teaching drum

| ODIDI as stated | value |
| --- | --- |
| diameter | 9.000000 ft |
| holdup | 0.300000 |
| vapour velocity | 4.467129 ft/s |
| required length | 7.026927 ft |
| L over D | 0.780770 |
| note | L/D below 2: a smaller drum may do |

So the stated drum is carrying the note. It works, in the sense that the length satisfies the criterion, and the engine is telling you a narrower drum would also work and cost less. That is advice rather than a fault, and it is the kind of remark that only makes sense to a reader who knows the note has an edge and where the edge is.

## What a stated fraction is a fraction of

This is the closing skill of the tier. The holdup input is a level fraction, and the same figure read as an area fraction gives a different drum. The course prints the size of that difference rather than asserting it.

| fraction stated | length ft, read as a level | length ft, read as an area fraction | ratio |
| --- | --- | --- | --- |
| 0.100000 | 10.481166 | 10.346904 | 0.987190 |
| 0.250000 | 10.291794 | 10.332911 | 1.003995 |
| 0.500000 | 11.039649 | 11.039649 | 1.000000 |
| 0.750000 | 14.117118 | 13.159863 | 0.932192 |
| 0.900000 | 21.212138 | 17.274356 | 0.814362 |

The ratios are printed, so they may be quoted. Read the middle row: at half depth the two conventions agree exactly, which is the same fact the segment table gave and the reason a check performed only at half full proves nothing about the convention. Read the bottom row: at a high level the two readings are far apart, and neither of them is flagged.

## Why a note

The engine could refuse a drum outside the band and it does not. That is right, because an L over D outside the band is perfectly buildable. A long thin drum can be what a plot allows, and a wide flat one what an existing foundation carries.

So the judgment arrives as a note the caller may overrule, and the note is null inside the band rather than absent. A null in a field that has a value elsewhere says the check ran and had nothing to report, which is more than a missing key says.

## What the published drum rows can discriminate

Six distinct holdup fractions appear in the published drum rows. That number is the point of the set: a published set that used one holdup could not tell a route that reads the holdup from a route that ignores it. Six fractions can. The oracle behind those rows derives the vapour area by Simpson quadrature of the area integral and the length as a transit time against a fall time, in SI, rather than by evaluating the engine's own expressions.

## Exercise

Give both edges of the L over D note and quote the engine's wording at the lower one. Then record the stated teaching drum with its note, and explain what the level against area table shows at its middle row and at its bottom row.
