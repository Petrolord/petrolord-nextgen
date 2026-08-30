# A kick on a trip

Formation fluid entering while the string comes out.

## The event

The pressure in the wellbore falls below the pore pressure, and formation fluid flows in.

While tripping out there are two mechanisms doing that at once.

## Mechanism one: swab

Pulling the string reduces the pressure by the swab amount. On the slant well at 0.5 m/s that is 39.90653514930159 kg/m3 of equivalent mud weight, and at 1.0 m/s it is more than 60.

If the mud weight's margin above the pore pressure is smaller than that, pulling the string takes the well underbalanced.

## Mechanism two: not filling the hole

Every stand pulled out removes steel from the hole, and the level in the annulus falls unless mud is added.

The volume is calculable: a stand of drill pipe displaces its steel volume if it is open, its whole volume if it is closed. If the hole is not filled, the level drops and the hydrostatic pressure with it.

## Why the two together are dangerous

Because they act in the same direction and neither is visible at surface until the well flows.

The defence against the second is a trip tank: a small calibrated tank that fills the hole automatically and measures how much it took. Comparing that against the calculated displacement is the primary trip-time well control indicator.

## The signature

**Hole taking less mud than calculated** on the way out. That means something is filling the space, and the only thing available is formation fluid.

**Hole taking more mud than calculated** on the way in, which means the hole is losing mud somewhere.

Both are detected by comparing a measured volume against a computed one, which is why the calculation is done at every stand.

## What the swab calculation contributes

The trip speed limit. Given a pore pressure and a mud weight, the maximum speed that keeps the swab within the margin.

That is the number in this course, and it is a planning number: the trip tank is what actually catches a kick.

## The connection to circulation

After a trip, the first thing done is to circulate bottoms up: pump one annulus volume and watch what comes back.

If the well took a kick during the trip, that is when it arrives at surface. Circulating bottoms up before drilling ahead is not a formality.

## Exercise

For a mud weight of 1440 kg/m3 and a pore pressure of 1410, compute the maximum swab the well can tolerate.

Then use the sweep in the previous module to find the trip speed that produces it, and say whether that is a realistic tripping speed.
