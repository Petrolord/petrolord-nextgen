# Surface torque against depth

The profile, and why it does not look like the tension profile.

{{panel:td-string-explorer}}

## The shape

Torque accumulates upward from the bit, exactly as tension does, but the term it accumulates is different:

    dM = ft mu N r ds

There is no weight term. Weight adds to tension in every interval; it adds to torque only through the side force it produces.

So in a vertical hole the torque profile is flat, and in a horizontal lateral it climbs steadily, which is the opposite of what the tension profile does.

## The vertical well

Surface torque rotating on bottom is exactly 2700 N.m, which is the bit torque.

The profile is a horizontal line from the bit to surface: no side force anywhere, so no friction torque anywhere. The 2700 N.m that went in at the bit comes out at surface unchanged.

## The horizontal well

Surface torque rotating on bottom is 24324.87703304575 N.m, of which 2700 is bit torque. The other 21624.87703304575 N.m accumulated along the string.

Most of it accumulated in the lateral, where the side force per metre is the buoyed weight per metre and there are 1600 m of it.

## Why torque is the better diagnostic on a long well

Because the fraction of it that is friction is so much higher.

On the horizontal well, 88.90 percent of the surface torque is friction. On the hookload, the friction share is smaller and it sits on top of a large and steadily growing weight term.

So a 10 percent change in downhole friction moves the torque by about 9 percent and the hookload by rather less, and the torque reading is the one that shows it.

## The catch

Surface torque is measured at the top drive, and top drive torque measurements are noisy, are affected by the drive's own losses, and swing hard during stick-slip.

So the better signal comes through a worse instrument. In practice both are watched, and downhole torque measurement near the bit, where it exists, is better than either.

## Reading a torque profile

**A flat section** is a section with no side force: a straight vertical hole.

**A steep section** is a section with a lot of side force: a build under tension, or a long lateral.

**A step** is a bit torque or a downhole tool applying a moment.

**A section where torque falls going up** cannot happen in this model. Friction always opposes rotation, so the torque only accumulates. Anything else is an input error.

## Exercise

Compute the friction share of the surface torque for all five wells from the rotate-on-bottom rows, as (surface torque minus 2700) over surface torque.

Rank them, and say what the ranking tells you about which wells a surface torque measurement is most useful on.
