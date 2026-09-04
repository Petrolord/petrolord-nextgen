# Continuous and intermittent

Gas lift comes in two families and this module models one of them. Knowing which one you are holding decides whether its answers apply.

{{panel:pd-column-explorer}}

## What continuous lift is

Gas enters the tubing at one depth and keeps entering. Above that point the produced fluid is aerated and light, which is exactly the transfer line the design draws: 114.7 psia at the wellhead plus 0.1 psi/ft on `westTexasOil`, 214.7 psia plus 0.12 psi/ft on `deepHighPressure`, 164.7 psia plus 0.08 psi/ft on `constantPressurePPO`, 154.7 psia plus 0.09 psi/ft on `midDecrementKnifeEdge`. A steady point of injection is what makes a single lifted gradient a sensible thing to declare.

## What intermittent lift is, and why nothing here fits it

Intermittent lift accumulates a slug and blows it out on a cycle, so the tubing gradient swings between a rising liquid column and an almost empty one, and there is no single lifted gradient to declare. The header says it plainly: intermittent lift is not modelled, everything here is continuous lift. That is not a gap to work around. Spacing, valve settings and the unloading warnings all rest on the continuous picture, so the right response to an intermittent well is a different tool, not a reinterpreted output from this one.

## The column does not know about rate

The injection column is static. There is no friction, no velocity and no injection gas rate in the annulus at all, so what it returns is the shut-in gas column. The published cases carry design gas rates of 500.0, 250.0, 800.0 and 600.0 Mscf/d and none of those numbers touches the casing pressure at depth. The rate reaches the design elsewhere, through the port that has to pass it: `westTexasOil` valve 1 is credited with 1359.548505991 Mscf/d through a 0.25 in port against a 500.0 Mscf/d target.

## The mistake

Raising the design gas rate and expecting the casing column to answer. It cannot. A column marched from 1014.7 psia with sg 0.65 gives 1215.716705320 psia at 8000 ft whatever rate is going down it, because the only inputs are surface pressure, gas gravity, temperature and depth. A gas lift design that appears insensitive to rate is not being conservative, it is being honest about what a static column is. The place to argue about rate is the port and the throughput, where 1359.548505991 Mscf/d and 500.0 Mscf/d are compared against each other, and not the annulus.

## Exercise

March the published column at 1014.7 psia, sg 0.65, 100.0 degF at surface and 190.0 degF at 8000 ft, and record the pressure at depth.

Then name the four inputs that changed it, and say which quantity from the design list is missing from that set.
