# What unloading means

A design is a list of depths until somebody runs it. Unloading is the run, and it is where each depth is either handed over or not.

{{panel:pd-unloading-explorer}}

## A stage is a transfer

Stage n is the moment the point of injection arrives at valve n. The published midDecrementKnifeEdge design, 9000 ft, spaced on 26.75 psi per valve, carries 7 valves and therefore 7 stages. Its surface injection pressure is 1164.7000 psia at stage 1 and 1004.2000 psia at stage 7, stepping down by the decrement at every transfer. A stage is a state of the string, numbered by which valve is taking the gas, and not a clock reading.

## The casing falls at surface and rises at depth

| Stage | Surface injection, psia | Injection at depth, psia | Production at depth, psia |
| --- | --- | --- | --- |
| 1 | 1164.7000 | 1237.549064732 | 366.561773513 |
| 2 | 1137.9500 | 1263.359621226 | 530.283091540 |
| 3 | 1111.2000 | 1276.585507117 | 664.559651124 |
| 4 | 1084.4500 | 1279.335341477 | 773.102720982 |
| 5 | 1057.7000 | 1273.386228667 | 859.245146399 |
| 6 | 1030.9500 | 1260.244861595 | 925.962481959 |
| 7 | 1004.2000 | 1237.985650690 | 964.700000000 |

The surface pressure only falls. The pressure at the point of injection climbs to 1279.335341477 psia at stage 4 and then falls back to 1237.985650690 psia at the packer, because the extra gas weight bought by another 957.138060181 ft of depth stops covering another 26.75 psi of decrement.

## The fluid level is declared, not computed

Every golden stage row puts the fluid level exactly at the valve depth: 2354.019705701 ft at stage 1, 9000.000000000 ft at stage 7. That is an assertion, that the well unloads cleanly to each new valve and no further. It is not a level anybody solved for.

## The mistake

Reading the seven stages as seven equal events. They are not. The first transfer moves the point of injection 1819.125755854 ft deeper and the last one moves it 430.416867128 ft, for the same 26.75 psi of surface pressure each time. A design that looks generously spaced at the top is buying almost nothing at the bottom.

## What it refuses

The annulus column is static. There is no friction, no velocity and no injection rate in it at all, so the casing pressure at every stage is a shut in gas column and not a flowing one. The unloading and transfer lines are straight lines on gradients the caller declares, 0.09 psi/ft here, and the engine does not pretend a real unloading column is either straight or constant. Intermittent lift is not modelled anywhere.

## Exercise

Read the seven stages of midDecrementKnifeEdge in the panel and write down the surface injection pressure and the injection pressure at depth for each.

Then name the stage where the pressure at depth stops rising, and say in one sentence which two quantities changed places to make that happen.
