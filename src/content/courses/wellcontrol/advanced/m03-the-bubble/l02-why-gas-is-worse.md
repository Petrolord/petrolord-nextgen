# Why gas is worse

The same pit gain, two fluids, two operations.

{{panel:wc-tolerance-explorer}}

## The comparison

Two kicks of 2 m3 pit gain, one gas at 240 kg/m3 and one water at 1050 kg/m3, in 1440 kg/m3 mud.

## At shut-in

**The pressure deficit** is the density difference times gravity times the height.

For the gas: (1440 - 240) x 9.80665 x height.
For the water: (1440 - 1050) x 9.80665 x height.

The gas produces about three times the deficit for the same height, so its shut-in casing pressure is about three times higher.

## On the way up

**The gas expands.** By the time it reaches the shoe it occupies more of the annulus, so more mud has been displaced and the pressure at the shoe is higher again.

**The water does not.** It arrives at the shoe at very nearly the volume it entered at.

## In the kick tolerance calculation

The influx density enters twice: in the density difference that converts headroom into height, and in the pressure at the shoe that Boyle uses.

Both times, a lighter influx gives a smaller tolerance.

## The numbers

Slant well, 1440 kg/m3 mud, 1750 fracture equivalent, 60 kick intensity:

| influx density | kick tolerance |
|---|---|
| 240 kg/m3 | 2.783680489 m3 |
| 700 kg/m3 | about 4.5 m3 |
| 1050 kg/m3 | about 9.5 m3 |

A gas kick and a water kick of the same size are not the same problem.

## The operational difference

**A gas kick** gives a rising casing pressure through the circulation, a peak when it reaches the choke, difficult choke control while it is passing, and gas at surface to be handled.

**A water kick** gives a nearly flat casing pressure and comes out without drama.

## Why the classification matters, one more time

The Professional tier said the classification changes an expectation and not a procedure.

Here it changes a number: the kick tolerance. So the classification does enter a decision, and the decision is the planning one of whether the standard procedure will work.

## Exercise

Use the tolerance explorer to compute the slant well's kick tolerance at influx densities of 240, 500 and 900 kg/m3.

Plot the three roughly and say whether the relationship is linear.
