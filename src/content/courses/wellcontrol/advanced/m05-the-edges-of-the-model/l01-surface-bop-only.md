# A surface BOP only

The assumption that makes every number wrong offshore.

## The assumption

The blowout preventer is at surface, immediately below the rig floor. The annulus runs from the bit to the BOP with nothing else in it, and the choke line is short enough to ignore.

## What a floating rig has instead

The BOP is on the seabed. Between it and the rig there is a riser, and the returns come up either the riser or, during a kill, a choke line running from the seabed stack to the rig.

## What the choke line does

It is a long, narrow pipe. On a deepwater well it can be two thousand metres or more, and circulating through it costs pressure.

At a slow circulating rate that friction is tens of bar, and it is added to every casing pressure reading at the rig.

## The correction

The choke line friction is measured, by circulating through the choke line at the kill rate before it is needed, and subtracted from the observed casing pressure.

That is a standard procedure and it is essential, because without it the choke operator holds a casing pressure that is too high by the choke line friction, and the bottom hole pressure is too high by the same amount.

## The riser margin

If the riser is disconnected, the mud column above the seabed is replaced by seawater, and the bottom hole pressure falls by the difference.

Some operators carry a riser margin, an extra mud weight that keeps the well overbalanced with the riser gone. On a deepwater well it can be a large number, and it is often not achievable because it would fracture the shoe.

## What else changes subsea

**The MAASP** is measured at the rig and the shoe is below the seabed, so the mud column between them includes the riser.

**Gas at the BOP** behaves differently, because the pressure there is the seawater head rather than atmospheric.

**The volumes** include the riser and the choke line, which are not in this engine's span walk at all.

## What this engine does about it

Nothing. It takes a shoe TVD, a bit TVD and a set of volumes, and it assumes the annulus runs to a surface gauge.

Every number it produces is correct for a land or a jack-up well and needs a correction on a floater.

## Why the course states it this prominently

Because a large fraction of well control events happen offshore, and a learner who applied this calculation to a deepwater well without the correction would be wrong by tens of bar on every pressure.

## Exercise

For a choke line friction of 25 bar at the kill rate, say what the choke operator should do with the observed casing pressure.

Then say what happens to the bottom hole pressure if the correction is forgotten, and in which direction.
