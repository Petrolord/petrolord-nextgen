# Ullage and turns

Cover looks down at what a farm holds. Ullage looks up at the room it has left, and turns look across a year at how hard the farm works. Both come from the same tank rows, and both are counted the same way the pumpable stock is: tank by tank.

{{panel:supply-depot-explorer}}

## Ullage

Ullage is the empty room in a tank above its stock, the volume a receipt can go into. A depot needs it every time a cargo or a pipeline batch is due, because product that has nowhere to go stays in the ship or the line.

The engine counts it tank by tank: each tank's capacity less its stock, never below zero, summed over the tanks. It prints each tank's ullage beside its capacity and stock:

| tank | capacity m3 | stock m3 | ullage m3 |
| --- | --- | --- | --- |
| IB-T1 (PMS) | 7500.000 | 5288.400 | 2211.600 |
| IB-T2 (PMS) | 7500.000 | 164.700 | 7335.300 |
| IB-T3 (AGO) | 5000.000 | 3902.600 | 1097.400 |
| IB-T4 (DPK) | 2500.000 | 1377.000 | 1123.000 |

The farm's ullage is 11767.300 m3. Like the pumpable stock, it is useful only tank by tank. The tank rows print the room in each tank: IB-T3, the farm's one AGO tank, has 1097.400 m3 of ullage, and IB-T4, its one DPK tank, has 1123.000 m3. The farm total adds room across tanks that hold different products.

Notice IB-T2. It has 7335.300 m3 of room and no pumpable stock. The tank ready to receive is the one that cannot yet deliver.

## Turns a year

Turns measure how many times a year the farm's working capacity is filled and emptied by its liftings:

turns a year = daily throughput x 365 / working capacity

For IBAFO:

| the farm | value |
| --- | --- |
| working capacity m3 | 21845.000 |
| daily throughput (liftings) m3 | 2640.000 |
| turns a year | 44.1108 |

The divisor is working capacity, capacity less heel, as the engine's formula states. Turns print to four decimals.

The daily throughput is the other half of the formula, and the engine does not supply it. With no daily throughput the engine gives days of cover none and turns a year none: both need the throughput.

## What turns tell you

A farm with many turns is working its tanks hard. Each turn is a receipt and a run of liftings, and each receipt needs ullage to arrive into. A farm with few turns is holding stock for a long time relative to what it sells. Neither is good or bad on its own. A strategic reserve is meant to turn slowly; a busy inland depot close to its market turns fast.

Turns are also the figure a depot's commercial side reads. The throughput fee in module four is charged on throughput, revenue = throughput x fee, and turns are built on the same daily throughput. Module four reads the money side of IBAFO's throughput.

## The two readings together

Ullage and turns pull against each other. A farm running many turns has little slack between receipts, so the ullage at any moment must be managed tightly. The forecourt in module five meets the same problem on a small scale, when a delivery arrives at a station tank that has too little room for it.

## Exercise

Read the four tanks' capacities, stocks and ullages and the farm's ullage. Say why the room for a gas oil receipt is IB-T3's ullage and not the farm's. Then read the working capacity, daily throughput and turns a year, and say why the formula divides by working capacity.
