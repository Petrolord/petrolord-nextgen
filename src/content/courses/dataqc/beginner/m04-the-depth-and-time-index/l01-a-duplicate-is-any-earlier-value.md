# A duplicate is any earlier value

{{panel:dq-checks-explorer}}

Every value in a log hangs on its index, the depth column, and every value on a production sheet hangs on its date. If the index is wrong, every check that uses depth or time is wrong with it. `indexCheck` examines the index itself for four things: missing entries, duplicates, reversals and irregular steps. This module takes them one at a time, starting with duplicates, on the index where EKENE-7's two logging runs were spliced together. It is a stated input, 15 entries long.

| entry | depth, ft |
| --- | --- |
| 0 | 8520.000000 |
| 1 | 8520.500000 |
| 2 | 8521.000000 |
| 3 | 8521.500000 |
| 4 | 8522.000000 |
| 5 | 8521.500000 |
| 6 | 8522.500000 |
| 7 | 8523.000000 |
| 8 | 8523.000000 |
| 9 | 8523.500000 |
| 10 | 8524.500000 |
| 11 | 8525.000000 |
| 12 | `null` |
| 13 | 8526.000000 |
| 14 | 8526.500000 |

## The rule

A duplicate is a value equal to ANY earlier value in the index. The engine does not only compare each entry with the one before it. It remembers every depth it has seen, and a depth that turns up a second time is flagged wherever it turns up.

The splice has 2 duplicates. Their reasons, verbatim:

- entry 5: "index value 8521.5 repeats entry 3"
- entry 8: "index value 8523 repeats entry 7"

## Two kinds of repeat

Entry 8 is the simple case. Its depth, 8523.000000 ft, is the same as entry 7's, immediately before it. A check that compared neighbours only would find it too. It is a repeat: two rows at one depth.

Entry 5 is the case that shows why the rule says any earlier value. Its depth, 8521.500000 ft, differs from its neighbour entry 4. It matches entry 3, two rows back. A neighbour-only check would pass it as a new depth. The engine's rule catches it because a depth logged once already has a reading, and a second reading at that depth is a second claim about the same rock. At a splice, where the second run starts a little above the depth where the first run ended, that is exactly what happens.

Each duplicate is a question for the person merging the runs: which reading at this depth do you keep? The engine does not answer it. It does not drop either row, and it does not average them. It reports the pair, with the entry each one repeats, and leaves the choice to the caller.

## Duplicates survive a loose tolerance

The index check has a tolerance, and later lessons use it. It is worth knowing now that the tolerance governs the size of steps only. With a stated expected step of 0.5 and a step tolerance of 0.6, the splice still reads 2 duplicates. Equality is not a matter of degree.

## The clean log

The same check on EKENE-7's full depth index, 240 entries, finds 0 duplicates. The log index is clean in this respect, and both duplicates sit at the splice, where two runs were joined.

## Exercise

Open the checks explorer on the index view. It opens on the EKENE-7 splice index, direction increasing. Read the Duplicates tile and find each duplicate flag in the table, with its reason. Now delete the second 8523 from the box, the depth at entry 8, and read the tile again. Say which duplicate remains, which earlier entry it repeats, and why a check that compared neighbours only would have missed it.
