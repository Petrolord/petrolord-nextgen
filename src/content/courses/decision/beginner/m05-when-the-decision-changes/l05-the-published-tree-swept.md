# The published tree swept

Sweeping a published tree shows how a switch looks when it lands on a grid point. The drillFarmOut tree, whose golden EMV is 43.0000, ties Drill and Farm out exactly at a success probability of 0.200000.

{{panel:ec-tree-explorer}}

## The sweep

The success probability is moved in both chance nodes together, so the drill and the farm-out are always judged on the same prospect.

| success probability | Drill | Farm out | Do nothing | best |
| --- | --- | --- | --- | --- |
| 0.100000 | -19.0000 | 6.0000 | 0.0000 | Farm out |
| 0.150000 | -3.5000 | 9.0000 | 0.0000 | Farm out |
| 0.200000 | 12.0000 | 12.0000 | 0.0000 | tied (Drill marked) |
| 0.250000 | 27.5000 | 15.0000 | 0.0000 | Drill |
| 0.300000 | 43.0000 | 18.0000 | 0.0000 | Drill |

The last row is the published tree as stated: Drill 43.0000, Farm out 18.0000, Do nothing 0.0000, root 43.0000.

## An exact tie

At 0.200000 both branches are worth 12.0000 to the last digit, and the engine reports the tie: tiedIndices [0, 1], indifferent true, and the same pair at card precision. The optimal path marks Drill only because it is listed first, and the Decision advantage card reads Indifferent.

List the same two branches the other way round and only the mark moves. The exact tie of Drill at 40.0000 less a cost of 10.0000 against Farm out at 30.0000 shows it: in either order the engine reports tiedIndices [0, 1] and indifferent true at EMV 30.0000, and the optimal path marks whichever branch is listed first.

## Two crossings compared

The EKPAN lottery crosses at 80 / 350 = 0.228571, a probability with no exact binary image, where the engine reads 21.7143 for both branches and reports them tied, because the residue of -7.11e-15 is inside its tie band. The published tree crosses at 0.200000 exactly and is reported tied too. Both crossings are reported as ties, and the marked branch at each is only the one listed first. On EKPAN the switch falls between the sweep rows 0.200000 and 0.250000; on the published tree it falls on a row.

## The mistake

The careful mistake is reading the row at 0.200000 as the first probability at which drilling is better. It is the probability at which drilling is equal, and above it drilling is better. A reader who writes "drill from 0.200000" and one who writes "farm out up to 0.200000" have described the same tie with opposite words; the honest reading is that the two are indifferent at 0.200000.

## What it refuses

The engine reports ties: tiedIndices, indifferent and the card-precision pair. It still returns one best branch index, and that index is a mark: it reads the same whether the runner-up is tied or behind by 25.0000, so the tie fields are the ones to read. A residue of -7.11e-15 is inside the band and reads as a tie.

## Exercise

From the sweep, state the success probability at which the published tree switches and the value of both branches there, and explain why the engine reports a tie and which branch it marks. Then say what it would mark if Farm out were listed first, and why EKPAN's crossing at 0.228571 is reported as a tie although the two values differ by -7.11e-15.
