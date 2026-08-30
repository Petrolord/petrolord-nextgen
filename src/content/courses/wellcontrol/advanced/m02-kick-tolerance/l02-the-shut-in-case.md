# The shut-in case

The influx standing at the bottom, and the headroom above it.

{{panel:wc-tolerance-explorer}}

## The picture

The well is shut in. The influx occupies the bottom of the annulus, to a height h. Above it, mud all the way to surface.

The pressure at the bottom is the formation pressure, because the well is shut in and static.

## The pressure at the shoe

Walk up from the bottom:

    P_shoe = P_formation - (mud column from shoe to bottom) + (the influx's contribution back)

Which the engine writes as

    P_shoe(h) = Pf - rho_m g (TVD_bh - TVD_shoe) + (rho_m - rho_i) g h

The third term is the correction for the influx being lighter than the mud it replaced.

## The headroom

Set that equal to the fracture pressure at the shoe and solve for the largest h:

    headroom = P_frac_shoe - (Pf - rho_m g (TVD_bh - TVD_shoe))
    h_max    = headroom / ((rho_m - rho_i) g)

The headroom is the pressure margin available at the shoe with the hole full of mud, and the division converts it into an influx height.

## The volume

    shut-in tolerance = h_max x annulus capacity at the bit

Because the influx is at the bottom, in the collar annulus.

## The numbers

At 1440 kg/m3 mud, a 1750 kg/m3 fracture equivalent and a 60 kg/m3 kick intensity:

| well | headroom | shut-in tolerance |
|---|---|---|
| slant | 2422457.129684061 Pa | 2.783680488747303 m3 |
| horizontal | 2849174.495466821 Pa | 3.274027579221525 m3 |

## Why the horizontal well's headroom is larger

Because its bit and its shoe are nearly at the same true vertical depth, so the mud column between them is small, so the pressure at the shoe with the hole full of mud is far below the fracture pressure.

That looks like an advantage and it is not, because the other case is about to take it away.

## What this case ignores

Expansion. The influx is shut in and static, so it is at formation pressure and at the volume it entered at.

That is the whole of what the second case adds.

## Exercise

Compute the headroom for the slant well from the four inputs in the expression.

Then compute h_max for a 240 kg/m3 influx and confirm the volume against the table.
