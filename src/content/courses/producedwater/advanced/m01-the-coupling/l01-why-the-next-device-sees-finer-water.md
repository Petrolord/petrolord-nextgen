# Why the next device sees finer water

A train of treating equipment is not a row of independent boxes. Each device hands the next one the water it failed to clean, and that water is a different distribution from the one the first device met.

{{panel:pw-train-explorer}}

## What a stage passes forward

This module carries the OUTLET distribution forward at every stage. A device removes the droplets it is good at, which are the coarse ones, so the oil that survives is concentrated in the fine tail. The engine states the consequence plainly: the next device faces finer water than the inlet did and performs worse on it than its own cut size suggests.

That is why a table of fixed removal efficiencies throws the answer away. An efficiency quoted for a liner bank is an efficiency on one particular water. Put the same bank third in a train and it works on water whose coarse oil has already gone.

## The coupling, isolated

The clearest way to see the effect is to take every argument about device quality out of the picture. Put five identical devices in series, each of them cutting at 9 micron, on the OGBOTOBO inlet water. If a device were a fixed efficiency, every row of the removal column would be the same number.

| stage | removal percent this stage | outlet ppm | outlet median micron |
| --- | --- | --- | --- |
| 1 | 65.398946 | 622.818975 | 6.100736 |
| 2 | 31.825798 | 424.601866 | 4.835193 |
| 3 | 20.530945 | 337.427088 | 4.264879 |
| 4 | 15.300074 | 285.800496 | 3.918712 |
| 5 | 12.284239 | 250.692079 | 3.670618 |

The fifth identical device removes 12.284239 percent where the first removed 65.398946, because the water reaching it has had its coarse oil taken out 4 times already.

## Reading the fall as a ratio

The engine's own sweep prints each stage removal as a fraction of the first stage's. The column runs 1.000000, then 0.486641, then 0.313934, then 0.233950, then 0.187835. None of those numbers is an equipment difference. Every device in that column is the same device on the same geometry. The column is a measurement of what the stages upstream of it left behind.

The outlet median column says the same thing in droplet terms. It falls from 6.100736 micron after the first stage to 3.670618 micron after the fifth, so what is arriving at the last device is water whose typical droplet is well under its cut size.

## Why this is the tier's first lesson

Everything else an Expert reader does with a train rests on this. A stage removal means nothing without knowing what reached that stage, and a promise that one more box will clean the water further has to be checked against a curve that is already flattening.

## Exercise

Open the train explorer and build five identical 9 micron stages on the OGBOTOBO inlet. Read the removal column downward and write the ratio to the first stage at each step before you look at the figures above.

Then change the inlet sigma and run it again. Say which end of the droplet distribution is doing the work, and whether a wider spread makes the flattening faster or slower.
