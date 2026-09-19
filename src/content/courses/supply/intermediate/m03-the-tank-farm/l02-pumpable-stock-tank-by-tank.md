# Pumpable stock tank by tank

A depot's stock report is usually one line: so many cubic metres in the farm. The line hides a question that matters every time a tank runs low. How much of that stock can the pumps actually move? The engine answers it one tank at a time, and this lesson shows why the farm total cannot answer it.

{{panel:supply-depot-explorer}}

## The rule

`tankFarmCover` counts pumpable stock tank by tank. Each tank's pumpable stock is its stock above its own heel, and never below zero. The farm's pumpable stock is the sum of those tank figures. Ullage is counted the same way: each tank's capacity less its stock, never below zero, summed over the tanks.

The IBAFO farm this morning:

| tank | capacity m3 | heel m3 | stock m3 | pumpable m3 |
| --- | --- | --- | --- | --- |
| IB-T1 (PMS) | 7500.000 | 210.000 | 5288.400 | 5078.400 |
| IB-T2 (PMS) | 7500.000 | 210.000 | 164.700 | 0.000 |
| IB-T3 (AGO) | 5000.000 | 150.000 | 3902.600 | 3752.600 |
| IB-T4 (DPK) | 2500.000 | 85.000 | 1377.000 | 1292.000 |

| the farm | value |
| --- | --- |
| stock m3 | 10732.700 |
| heel m3 | 655.000 |
| pumpable stock m3 | 10123.000 |

## The tank below its heel

IB-T2 holds 164.700 m3 against a heel of 210.000 m3. Its stock is below its own heel, and the engine counts its pumpable stock as 0.000 m3. The tank is neither empty nor available. It is a tank waiting for a receipt.

A pumpable stock can never be negative. A tank below its heel does not owe volume to anyone. The engine stops each tank's count at zero, which is the physical truth: a pump draws from one tank, and a shortfall in one tank has no effect on what another can deliver.

## The figure the engine does not use

Take the farm's stock and subtract the farm's heel in one step and you get a different figure. The engine prints it, and prints what is wrong with it:

> The farm's stock less the farm's heel is 10077.700 m3. That is not pumpable stock: IB-T2 holds 164.700 m3 against a heel of 210.000 m3, and no pump lends one tank's volume to another's heel.

So two figures sit beside each other. The netted figure is 10077.700 m3. The pumpable stock counted tank by tank is 10123.000 m3. The netted figure lets IB-T2's missing heel volume be made good from IB-T1's petrol, as though product could pass between the tanks' bottoms. It cannot. The tank-by-tank figure keeps each tank's heel inside that tank.

The difference between the two depends entirely on which tanks are below their heels. On a morning when every tank stands above its heel, the two methods agree. They part company on the mornings when a tank is running low.

## What the pumpable stock feeds

The pumpable stock is what the engine divides by the daily liftings to get days of cover, which the next lesson reads. A cover figure built on the netted stock inherits its error.

It also changes how a depot should read a single product. IB-T1 and IB-T2 both hold petrol. The petrol that can be lifted today is IB-T1's 5078.400 m3. IB-T2 adds nothing until it is filled above its heel, whatever the product total says.

## Checking a stock report

When you are handed a farm total, ask for the tank rows behind it. Check each tank's stock against its heel. Any tank at or below its heel contributes 0.000 m3 of pumpable stock, and a report that shows a pumpable figure for it has netted across the farm.

## Exercise

Read the four IBAFO tank rows and the farm's pumpable stock. Say why IB-T2's pumpable stock is 0.000 m3 while it holds product. Then quote the farm's stock less the farm's heel and the pumpable stock counted tank by tank, say which is larger, and explain the difference in terms of IB-T2.
