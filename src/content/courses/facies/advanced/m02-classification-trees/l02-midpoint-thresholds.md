# Midpoint thresholds

{{panel:ef-classify-explorer}}

A split is a log and a threshold. The log is chosen by the Gini decrease; this lesson is about where the threshold sits, and about how the engine prints it. The two are separate questions, and the second one catches people who copy a threshold out of a printed tree.

## Where a threshold can sit

Within a node, the engine sorts the distinct values of a log and considers a threshold halfway between each consecutive pair. Any threshold between the two values would send the same rows each way, so the midpoint stands for the whole gap. The basis states it, in the engine's words:

> midpoints a/2 + b/2 of consecutive distinct values of the node (a when that rounds to b); x <= threshold goes left

Two details sit in that sentence. The midpoint is computed as a/2 + b/2. And if a and b are so close that their midpoint rounds to b itself, the threshold is a, so that a still goes left and b still goes right. Without that guard, a threshold equal to b would send b left with a, and the gap between them would split nothing.

"x <= threshold goes left" is a boundary drawn for this rule: a value exactly at the threshold goes left. A training value sits exactly on its threshold only in the guarded case, where the threshold is a; a new row can land on any threshold, and it goes left.

## The thresholds of the Ekene tree

The tree grown on all 180 cored rows with five channels, printed at six decimals by the course:

| node | split on | threshold |
| --- | --- | --- |
| 0 | NPHI | 0.123000 |
| 2 | GR | 95.600000 |
| 3 | RHOB | 2.357000 |
| 4 | NPHI | 0.259000 |
| 5 | PEF | 2.490000 |
| 9 | GR | 55.950000 |
| 10 | RHOB | 2.381000 |

The root threshold on NPHI sits between the limestone rows and the rest. The generator held limestone NPHI at or below 0.12 and every other facies at or above 0.13, and the midpoint of the two values that face each other across that gap is where the engine drew the line.

## How the printed tree shows a threshold

The engine's printed tree writes each threshold as the shortest decimal that reads back to the stored number. Most midpoints of these logs print short. One does not: the midpoint on RHOB at node 10 is not exact in binary, and its printed line carries the tail, exactly as the engine prints it:

    |   |   |   |   |--- RHOB <= 2.3810000000000002

The number stored and the number printed at six decimals, 2.381000, describe the same threshold. The long form is the same threshold written out to the digits its binary value reads back as, and nobody reasons with those digits. Quote the six-decimal field when you use the threshold, and quote the printed line only as the engine's own words, whole and exact.

## Exercise

Open the view "A classification tree and its printed form" with the five channels and the default depth. Find the RHOB line with the long tail in the printed tree, and find the same threshold at six decimals. Then type your own table of four rows in which one log reads 0, 1, 4 and 6 and the facies are a, a, b, b. Grow the tree and write down the threshold it prints and which rows it sends left.
