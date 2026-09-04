# Sweeping the gas rate

Six design gas rates in a row return the same margin to nine figures, and the next point in the sweep carries an extra multipointing stage.

{{panel:pd-unloading-explorer}}

## The sweep

The published `midDecrementKnifeEdge` case with only `qgiTargetMscfd` moved.

| Target, Mscf/d | Stage 5 surface margin on valve 4, psi | Multipointing stages |
| --- | --- | --- |
| 400 | 0.124769727 | 2, 3, 4, 5 |
| 600 | 0.124769727 | 2, 3, 4, 5 |
| 1000 | 0.124769727 | 2, 3, 4, 5 |
| 1400 | 0.124769727 | 2, 3, 4, 5 |
| 1600 | 15.249903355 | 2, 3, 4, 5, 6 |
| 2000 | 15.249903355 | 2, 3, 4, 5, 6 |
| 2400 | 33.744341944 | 2, 3, 4, 5, 6, 7 |
| 3500 | 55.613320820 | 2, 3, 4, 5, 6, 7 |

600.0 Mscf/d is the published value. From 400 to 1400 Mscf/d nothing moves at all, and at 1600 Mscf/d the design gains a multipointing stage.

## The channel is port selection and nothing else

The design gas rate does not enter the closing test. It enters `selectPort`, which picks the smallest catalogue port that passes the target at the stage differential, and the port sets the port to bellows ratio R, which sets the dome charge and so the closing surface pressure.

R changes only when the target crosses a catalogue step. Sweep the port directly and the same numbers come back: a 0.25 in port on every valve gives 0.124769727 psi at R of 0.063749851, a 0.3125 in port gives 15.249903355 psi at 0.099609142, a 0.375 in port gives 33.744341944 psi at 0.143437165 and a 0.4375 in port gives 55.613320820 psi at 0.195233918. The gas rate sweep is the port sweep read through a lookup.

## The step that is not a step

At 1400 Mscf/d the chosen ports become 0.25, 0.25, 0.25, 0.25, 0.25, 0.3125, 0.3125 in, so valve 6 has moved up a size and valves 1 to 5 have not. The margin is unchanged at 0.124769727 psi, because the stage 5 test is on valve 4 and valve 4 still has its 0.25 in port. A port set can change without the verdict changing.

## The mistake

Reading a flat stretch as insensitivity. Six rows at 0.124769727 psi look like a design comfortably clear of any edge. The flat stretch was never evidence of robustness, it was evidence that the axis had not yet reached its mechanism.

## What it refuses

The sweep cannot interpolate. There is no design between 1400 and 1600 Mscf/d that gives a margin between 0.124769727 and 15.249903355 psi, because no port exists between 0.25 and 0.3125 in. A fitted curve through these points would describe a valve catalogue that does not exist.

## Exercise

Write the stage 5 surface margin at 400, 1400, 1600 and 2400 Mscf/d, and the multipointing stages at each.

Then match each distinct margin to the port that produces it, and say in one sentence why the port change at 1400 Mscf/d left the margin alone.
