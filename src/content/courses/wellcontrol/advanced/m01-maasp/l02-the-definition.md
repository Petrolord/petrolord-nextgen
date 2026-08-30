# The definition

One subtraction, and what each term is.

{{panel:wc-tolerance-explorer}}

## The expression

    MAASP = (fracture EMW - mud density) x g x TVD at the shoe

The fracture pressure at the shoe, less the mud column standing on it, is what is left over for surface pressure.

## The numbers

At 1440 kg/m3 mud and a 1750 kg/m3 fracture equivalent:

| well | shoe TVD | MAASP |
|---|---|---|
| slant | 1282.248590311 m | 3898114.5728331697 Pa |
| horizontal | 1172.343525979 m | 3563996.418103266 Pa |

## Why the slant well's is higher

Because its shoe is deeper in true vertical depth. A deeper shoe has more fracture pressure and more mud column, and the difference between them grows with depth as long as the fracture gradient exceeds the mud weight.

That is the general rule: setting casing deeper buys MAASP, in proportion to the gap between the two gradients.

## What it is used for

As a limit on the SHUT-IN CASING PRESSURE, and on the casing pressure at every moment during a kill.

If the casing gauge reads more than the MAASP, the shoe is at its fracture pressure and the formation there is taking fluid.

## Why it is a surface number

Because that is where the gauge is. The calculation converts a downhole limit into a number the choke operator can read directly, which is the point.

## What it is compared against

**At shut-in:** the SICP. If it already exceeds the MAASP, the shoe has been fractured and the standard procedure is not available.

**During the kill:** the casing pressure at every moment, and particularly its peak when the influx reaches the shoe.

**At the planning stage:** the casing pressure a design kick would produce, which is what kick tolerance computes.

## The one thing to be careful about

It assumes the annulus is full of mud of the stated density from surface to the shoe.

During a kill it is not: there is influx somewhere in it and kill mud coming up behind. So the MAASP computed with the ORIGINAL mud is the right limit early in the operation and the wrong one later.

## Exercise

Compute both wells' MAASP yourself from the expression.

Then recompute the slant well's with a kill mud weight of 1521.319686054 kg/m3 in the hole instead, and say what happened to the limit.
