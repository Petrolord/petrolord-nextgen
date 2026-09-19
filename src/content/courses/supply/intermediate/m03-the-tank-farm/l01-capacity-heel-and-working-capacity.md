# Capacity, heel and working capacity

A depot's rack loads trucks from its tanks, and a tank's nameplate capacity is the first figure anyone quotes about it. It is also the figure that overstates what the tank can do. Every tank keeps a volume in the bottom that the pumps cannot draw, and the engine takes that volume off before it counts anything a depot can sell.

{{panel:supply-depot-explorer}}

## The heel

The heel is a volume stated for each tank, and the engine's formulas say what it does. Working capacity is capacity less heel. Each tank's pumpable stock is its stock above its own heel, and never below zero. The digest defines the heel by those two uses and by nothing physical, and this course reads it the same way. It is an input for each tank, and the engine does not assume one.

The IBAFO tank farm, invented for this course, has four tanks:

| tank | capacity m3 | heel m3 |
| --- | --- | --- |
| IB-T1 (PMS) | 7500.000 | 210.000 |
| IB-T2 (PMS) | 7500.000 | 210.000 |
| IB-T3 (AGO) | 5000.000 | 150.000 |
| IB-T4 (DPK) | 2500.000 | 85.000 |

Each tank carries its own heel. Nothing in the engine derives a heel from a capacity, and neither should you.

## Working capacity

The engine's `tankFarmCover` defines:

working capacity = capacity less heel

For the farm as a whole:

| the farm | value |
| --- | --- |
| capacity m3 | 22500.000 |
| heel m3 | 655.000 |
| working capacity m3 | 21845.000 |

Working capacity is the volume a farm can cycle: the room between the heel and the top of each tank, summed over the tanks. It is the figure the engine uses for turns a year, which the last lesson of this module reads. Stock below a tank's heel is in the tank and adds nothing to that tank's pumpable stock.

## The units

Every volume in this module is in cubic metres and prints to three decimals, which is to the litre. The tank farm's figures are stock volumes and they are taken as given. Correcting a stock to standard conditions is the Associate tier's work, done at the AKODO terminal with a strapping table and a VCF typed off the terminal's own tables. The farm model does not ask about it. Read every IBAFO volume as the depot's recorded stock, and do not add a gross figure from one source to a standard figure from another.

## Why the heel matters before the stock does

It is tempting to treat the heel as a correction to be applied once to the farm total. That is the wrong habit. The heel is fixed per tank, while the stock in each tank moves every day. When a tank runs low, the heel becomes the whole of what it holds, and the pumpable stock in that tank reaches zero while the tank still has product in it. The next lesson shows one IBAFO tank in exactly that state and what happens to the farm total when it is counted wrongly.

Capacity and heel are typed per tank, like every other input in this module. A figure that is typed once and never checked is a figure nobody measured.

## Exercise

Read the four tanks' capacities and heels and the farm's capacity, heel and working capacity. Say which two of the engine's formulas use the heel, why it is an input for each tank and never a fixed share of capacity, and what the farm's working capacity of 21845.000 m3 is used for in the engine.
