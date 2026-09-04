# What the pump actually sees

A stage curve is read at a rate, and the rate it must be read at is not the rate the well is reported at. The design chain begins by throwing the tank away.

{{panel:pd-lift-explorer}}

## The order the module walks

Flowing bottomhole pressure less the annulus column gives the pump intake pressure. Black oil properties at that pressure turn tank rates into in situ rates and release whatever gas is no longer in solution. A separator, if there is one, takes some of that gas up the annulus. What is left is the stream the pump swallows, and its rate and its density are the only two things the rest of the design uses.

## The published golden design gassyOffshore, at the tank and at the pump

It produces 1200.0 stb/d of oil at a water cut of 0.5000, so 1200.000000 stb/d of water, with a producing gas oil ratio of 500.0 scf/stb against 300.0 scf/stb still in solution at the intake.

| Quantity | Value |
| --- | --- |
| Oil at depth | 1440.000000 bbl/d |
| Water at depth | 1224.000000 bbl/d |
| Liquid at depth | 2664.000000 bbl/d |
| Free gas at depth | 288.000000 bbl/d |
| Total stream at depth | 2952.000000 bbl/d |
| Rate through the pump | 2750.400000 bbl/d |

Three of those six are rates a design could be built on, and only 2750.400000 bbl/d is the duty.

## What the separator changes

At a separator efficiency of 0.7000 the vented gas is 201.600000 bbl/d and 86.400000 bbl/d still goes through the pump. Taking gas out leaves the pump swallowing something heavier: the whole stream has a mixture density of 50.53658537 lbm/ft3 and the pumped fluid has 53.80104712 lbm/ft3, heavier by 3.26446175 lbm/ft3. The published golden design highWaterCut has no separator, its efficiency is 0.0000, and its two densities are both 63.25602186 lbm/ft3.

## The mistake

Designing on the tank liquid rate. On gassyOffshore the rate at depth is 1.11000000 times the tank liquid rate and on highWaterCut it is 1.02100000 times it, so the size of the error is a property of the fluid and not a margin anyone can carry. The teaching well QUA-IBOE-4, which is not a published case, runs at 1.17300000.

## What it refuses

It will not compute the black oil properties. Solution gas, the volume factors and the three densities are caller inputs at intake conditions. It will not supply the discharge pressure either, because that is a flowing traverse result. It reports in situ viscosity and flags viscous service above 10 cSt, and applies Hydraulic Institute correction factors only when a user hands them over.

## Exercise

Read gassyOffshore in the panel and write down the liquid rate at depth, the total stream at depth and the rate through the pump.

Then say which of the three the stage curve is read at, and what reading it at either of the others would cost.
