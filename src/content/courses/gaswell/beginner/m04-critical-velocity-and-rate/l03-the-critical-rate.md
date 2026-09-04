# The critical rate

The critical rate belongs to the station. It does not belong to the well, and it does not move when the well's production moves.

{{panel:pd-droplet-explorer}}

## Four inputs and two steps

The engine, run on the conditions of published velocity row 3: 1000.0 psia, 540.0 degR, z 0.90, gas gravity 0.65, water at 60.0 dyne/cm and 67.0 lbm/ft3, through a 2.441 in string.

| Step | Value |
| --- | --- |
| gas density | 3.6097875709 lbm/ft3 |
| terminal droplet velocity | 6.5866417464 ft/s |
| Turner critical velocity | 7.9039700957 ft/s |
| flow area | 0.0324984725 ft2 |
| Turner critical rate | 1614.343766935 Mscf/d |

The same station under the other correlation gives a critical velocity of 6.5866417464 ft/s and a critical rate of 1345.286472446 Mscf/d.

Every input on that list is a station property or a fluid property. None of them is a production number. Read the list again and notice what is missing: how much gas this well actually makes.

## It does not move

Walk the same station across a contiguous sweep of production rates, from 400.0 Mscf/d to 2600.0 Mscf/d, and the critical rate reads 1614.343766935 Mscf/d at every single point. At 400.0 Mscf/d, at 1614.0 Mscf/d, at 2600.0 Mscf/d, the same figure.

That is not a quirk of the sweep. The critical rate is the answer to a question about the gas, the liquid and the pipe, and none of those three know what the well is flowing today. A well that drops from 2600.0 to 400.0 Mscf/d has not changed its critical rate at all. It has changed which side of it the well sits on.

## The mistake

Reporting a fallen critical rate as good news. When production drops, the wellhead pressure usually drops with it, the gas thins, and the critical velocity rises, so the number a careless recomputation returns can land anywhere. What it cannot do is follow the well down out of politeness. If a critical rate moved between two reports, a station number moved, and finding out which one is the work.

The second mistake is quoting it as a rate the well can achieve. It is a rate the string requires at that station, and whether the well can supply it is a question these modules never ask.

## What it refuses

There is no inflow performance in these modules. The gas rate is an input, so a loading verdict is a verdict at a rate somebody supplied and not a prediction of what the well will do next.

The balance refuses rather than guesses at its edges. A liquid lighter than the gas returns no velocity, and a surface tension of 0.0 dyne/cm returns no velocity, so no critical rate follows from either.

## Exercise

Rebuild 1614.343766935 Mscf/d from the five steps in the table. Then change the production rate in the panel three times without touching the station, and record the critical rate each time.
