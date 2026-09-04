# A split by mass share

A junction with two ways out divides its stream by the mass on each leg, and by nothing else.

{{panel:pd-network-explorer}}

## The rule, on the gate fixture

A well of 400 stb/d oil arriving on 1000 lb/d splits onto two legs carrying 750 and 250 lb/d. Leg x oil = 300.000000000 stb/d, leg y oil = 100.000000000 stb/d, sum = 400.000000000 stb/d.

Mass share is the only split that conserves anything. Divide by pipe size, by drawn priority or by half and half, and the two legs stop adding to what arrived.

## The split the solve decides

On AGBADA WEST the loop tee is the junction with two ways out. AGBADA-9 arrives on its flowline at 3992.446687538 lb/d carrying oil = 1042.000000000 stb/d, water = 369.000000000 stb/d and gas = 1613.000000000 Mscf/d. It leaves by the loop leg at 3402.582062368 lb/d and by the crosslink at 589.864625170 lb/d.

| Leg out of the loop tee | Mass, lb/d | Oil, stb/d | Water, stb/d | Gas, Mscf/d |
| --- | --- | --- | --- | --- |
| Loop leg | 3402.582062368 | 888.049556192 | 314.482040532 | 1374.687076907 |
| Crosslink | 589.864625170 | 153.950443808 | 54.517959468 | 238.312923093 |

Each column adds back to what arrived, and no ratio was carried across the junction.

## The share is not on the drawing

The crosslink is drawn from the north manifold to the loop tee, and the solve returns it at -589.864625170 lb/d, so it carries 589.864625170 lb/d the other way. The split above runs against its own arrow. Take the drawing at face value and the loop tee becomes a junction with one way out, the crosslink oil, water and gas go into it instead of out of it, and every total downstream of the north manifold is wrong by a stream that was never subtracted.

The sign is a property of the solution. The pressure across that branch is -1.193210823 psi in the drawn sense, which is to say the drawn downstream end is the higher of the two.

## What the check says about the same answer

The shares came from a solve reporting converged = true at a residual of 1.546141e-11 lb/d, and `checkConservation` on that answer reports a gap of 345 lb/d, 2.593852900 percent of what the engine says was produced.

The gap is visible in the split itself. The north bypass stream carries 9898.095088544 lb/d where the solve says that branch passes 9553.095088544 lb/d, a difference of 345 lb/d, because AGBADA-12 was handed in at its allocation of 985 lb/d while its flowline passes 640 lb/d. The shares are still shares. One of the masses being shared is not the mass the solve found.

## What it refuses

The module will not iterate a recirculating split. If the solved directions form a cycle it stops with a reason: "The solved flow directions form a loop, so the network is recirculating." It reports the drawing mistake and computes nothing further.

## Exercise

Read the two legs out of a splitting junction on the panel and check that oil, water and gas each add back to what arrived.

Then reverse the drawn direction of the crosslink and say which of those numbers change and which do not.
