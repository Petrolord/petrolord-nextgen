# Why a well needs lifting

A well that will not flow is not empty. It is full, and what fills it weighs more than the formation can push out.

## The column that holds the well down

Every published design case declares a kill fluid gradient as an input: 0.45 psi/ft on `westTexasOil`, 0.5 psi/ft on `deepHighPressure`, 0.42 psi/ft on `constantPressurePPO` and 0.46 psi/ft on `midDecrementKnifeEdge`. Nothing in the module computes those numbers. They are the standing column, and lifting means replacing part of it with something lighter.

## What one bite of gas buys

Injection gas applied to the annulus U-tubes the kill fluid down the tubing and out. Treat the gas as weightless and the reach is the kickoff pressure less the unloading wellhead pressure, divided by the kill fluid gradient.

| Case | Kickoff, psia | Unloading wellhead, psia | Kill fluid, psi/ft | Weightless reach, ft |
| --- | --- | --- | --- | --- |
| westTexasOil | 1014.7 | 114.7 | 0.45 | 2000.000000000 |
| deepHighPressure | 1414.7 | 214.7 | 0.5 | 2400.000000000 |
| constantPressurePPO | 1114.7 | 164.7 | 0.42 | 2261.904761905 |
| midDecrementKnifeEdge | 1164.7 | 154.7 | 0.46 | 2195.652173913 |

`westTexasOil` is designed to 7500.0 ft of target depth and its first bite of gas reaches 2000 ft. That gap is the whole subject.

## Why a string, and not a valve

Once the fluid level passes a valve the well can be lifted from a little deeper, and the next valve takes it deeper again. The published strings carry 8, 7, 6 and 7 valves against declared limits of 12, 14, 10 and 12, so none of them ran out of valves. A string ends when the pressure runs out of room, not when the mandrels run out.

## The mistake

Reading the kickoff pressure as the pressure the well runs on. `westTexasOil` kicks off at 1014.7 psia and operates at 914.7 psia, `deepHighPressure` at 1414.7 and 1314.7 psia, `midDecrementKnifeEdge` at 1164.7 and 1064.7 psia. That 100 psi is spent getting the fluid out and is gone once the well is lifting, so a design sized on the kickoff number is optimistic at every depth in it.

## What it refuses

There is no inflow performance relation anywhere in this module. It will tell you where gas can reach and never whether the well then produces, or how much. Unloading on paper and making oil are separate questions, and only one of them is asked here.

## Exercise

Take the four published kickoff and unloading wellhead pressures and their kill fluid gradients, and rank the four cases by weightless reach.

Then write down which case reaches deepest on that arithmetic, and which case is actually designed to the greatest depth. Say in one sentence why those are not the same case.
