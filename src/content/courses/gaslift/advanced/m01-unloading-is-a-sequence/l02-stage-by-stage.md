# Stage by stage

Every transfer in a string costs the same surface pressure and every transfer buys less depth than the one before it.

{{panel:pd-unloading-explorer}}

## The same price, a smaller purchase

On midDecrementKnifeEdge each stage spends 26.75 psi of surface injection pressure.

| Transfer | Depth won, ft |
| --- | --- |
| valve 1 to valve 2 | 1819.125755854 |
| valve 2 to valve 3 | 1491.961773151 |
| valve 3 to valve 4 | 1206.034109541 |
| valve 4 to valve 5 | 957.138060181 |
| valve 5 to valve 6 | 741.303728444 |
| valve 6 to valve 7 | 430.416867128 |

The stated minimum spacing is 275.0 ft, so the last transfer is still legal and still worth a quarter of the first one. The deeper the string goes the flatter the race between the injection line and the unloading line becomes, and the same money buys less hole.

## The gas rate is not what varies

Through the six valves the stage rate runs 1529.098759722, 1534.198233515, 1529.067116144, 1505.775891086, 1440.849796778 and 1347.108582683 Mscf/d, and the orifice at 9000.000000000 ft passes 1946.971134442 Mscf/d. The design target is 600.0 Mscf/d and every stage passes it. A sequence can be in serious trouble with every stage rate comfortable, because the rate and the closing verdict are computed from different things.

## A sequence with nothing left open

deepHighPressure is 7 valves on 40.00 psi per valve, and every one of its stages is clean. At stage 2 valve 1 has a spread of 39.204722432 psi and the casing at valve depth has already dropped 43.324677700 psi from its own opening stage, which leaves a closing margin of -4.119955268 psi and a shut valve. One transfer at that decrement already outruns the widest spread in the string, so nothing survives a handover.

## The mistake

Comparing two designs by valve count. midDecrementKnifeEdge and deepHighPressure both carry 7 valves. One of them multipoints at four stages out of seven and the other never does, and the count says nothing about which is which. What separates them is the decrement measured against the spreads, 26.75 psi per valve against spreads of 55.525309973 psi and downward, versus 40.00 psi per valve against 39.204722432 psi and downward.

## What it refuses

The transfer and unloading lines are straight lines on constant declared gradients, 0.09 psi/ft on the knife edge case and 0.12 psi/ft on deepHighPressure. A real unloading column is neither straight nor constant. The engine does not model it, it takes the gradient as an input and says so, which means every depth won in the table is only as good as the gradient the caller declared.

## Exercise

Read the six spacing increments of midDecrementKnifeEdge in the panel and write down the first, the middle and the last one.

Then read deepHighPressure stage 2 and name the two numbers that decide valve 1 is shut there, and say which of them a valve count would have told you.
