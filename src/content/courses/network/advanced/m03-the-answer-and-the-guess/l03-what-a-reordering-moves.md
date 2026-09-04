# What a reordering moves

Reverse the nodes array. No physics changes. Six numbers stay put to the last bit and one moves by four orders more than the rest.

{{panel:pd-fight-explorer}}

## Why a reordering touches anything at all

The order of the nodes array is not decorative. `unknownIds` is built from it, the Jacobian column order is that order, and the dense solve pivots on it, so reversing the array changes which row is eliminated against which. The network does not change: same wells, same eight branches, same separator at 265 psia, same tolerance and cap. The answer being reordered is the one the engine reports `converged` true on after 11 iterations at `residualLbD` 1.546141e-11 lb/d with `pinned` t4, and on which `checkConservation` reports produced 13300.677150912 lb/d, delivered 12955.677150912 lb/d, a gap of 345.000000000 lb/d, 2.593852900 percent.

## What moved on the teaching network

| Node | Original, psia | Reversed, psia | Movement, psia |
| --- | --- | --- | --- |
| t1 | 1257.276513628954 | 1257.276513628954 | 0.0000e+0 |
| t2 | 820.813328309357 | 820.813328309357 | -1.1369e-13 |
| t3 | 1188.244679299341 | 1188.244679299341 | 0.0000e+0 |
| t4 | 831.176261906558 | 831.176261912029 | 5.4710e-9 |
| ha | 780.469728020218 | 780.469728020218 | -1.1369e-13 |
| hb | 781.662938843358 | 781.662938843358 | 0.0000e+0 |
| hc | 588.783893593083 | 588.783893593083 | 0.0000e+0 |

The largest movement among the unpinned nodes is 1.1369e-13 psia. The movement at the pinned node, t4, is 5.4710e-9 psia. Two rows print identically to twelve decimals and still carry a nonzero movement. The difference lives below anything the printed value shows, so a reader comparing printed pressures learns nothing about which kind of number is which.

## What the two magnitudes mean

A movement of 1.1369e-13 psia is the noise of a different elimination path on the same well posed system, and it is evidence the solve is determined: pivot differently, get the same answer. A movement of 5.4710e-9 psia is not that. It is the last accepted step landing somewhere slightly different on a node the solver could never move deliberately, sized by the path rather than by the problem.

## Two kinds of number, one label

`pressures` is one object. t4 sits in it beside ha and hc, formatted the same and in the same units. The only field separating them is `pinned`, which names t4 and says nothing about magnitude. The reordering separates them experimentally, because it is a change a determined number is immune to and an undetermined one is not.

## The mistake

Reading the reordering as a stability test that passed. A reader who quotes the largest movement across all seven nodes reports 5.4710e-9 psia and calls it clean, because it is still tiny in psia. The scale is not the finding. The finding is that one node moved on a change that moved nothing physical, and that same node under a change of guess moves hundreds of psia.

## Exercise

Run this network with the nodes array reversed and record the movement at every node. Then name the field that predicts, before you look, which node will be the outlier.
