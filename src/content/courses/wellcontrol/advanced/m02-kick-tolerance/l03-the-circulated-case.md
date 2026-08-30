# The circulated case

The bubble at the shoe, and Boyle on the way back.

{{panel:wc-tolerance-explorer}}

## The picture

The influx has been circulated up until its top is just below the casing shoe, at constant bottom hole pressure.

That is the worst moment: the influx is as high as it can get while still being in open hole, and it has expanded on the way.

## The height

The influx cannot be taller than the distance from the bit to the shoe, and it cannot be taller than the headroom allows:

    h_shoe = min(h_max, TVD_bh - TVD_shoe)

On the slant well that second term is 1225.671108990 m and does not bind. On the horizontal well it is 42.515647195 m and binds hard.

## The volume at the shoe

    V_shoe = h_shoe x annulus capacity at the shoe

Note the capacity is at the SHOE now, which is nearly twice the capacity at the bit, because the drill pipe is narrower than the collars.

## The pressure there

    P_shoe = Pf - rho_m g (TVD_bh - TVD_shoe) + (rho_m - rho_i) g h_shoe

The same expression as the shut-in case, evaluated at the height the influx has reached.

## Boyle back to the start

That volume at the shoe is not the pit gain. The pit gain was the volume at the BOTTOM, at formation pressure.

    V_initial = V_shoe x P_shoe / Pf

Boyle, compressing the expanded bubble back down to the pressure it entered at.

## The numbers

| well | h_shoe | tolerance at the shoe |
|---|---|---|
| slant | limited by headroom | 3.133289667323 m3 |
| horizontal | 42.515647195 m, the whole gap | 1.078825341807 m3 |

## Why the horizontal well's is so small

Because the gap between its bit and its shoe is 42.5 m of true vertical depth. The influx can only be 42.5 m tall before its top is at the shoe, and 42.5 m at the shoe capacity is a small volume.

Then Boyle compresses it further, because the pressure at the shoe on that well is close to the formation pressure.

So the horizontal well can tolerate very little influx, despite having plenty of headroom, because there is nowhere for the influx to go.

## Exercise

For the horizontal well, compute the volume 42.515647195 m of influx occupies at the shoe capacity.

Then apply Boyle with the shoe and formation pressures the panel reports, and confirm the tolerance.
