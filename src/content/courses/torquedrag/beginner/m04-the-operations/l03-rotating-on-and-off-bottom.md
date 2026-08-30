# Rotating, on bottom and off

The two operations that produce torque, and the difference between them.

## Off bottom

The string turns at 120 rpm with no axial motion and no weight on bit. Then:

    va = 0,  fa = 0,  ft = 1

All the friction is tangential. Axially the string is frictionless, so the hookload is the free-hanging weight in that geometry, the integral of w cos(theta) along the hole.

On the build-and-hold well that is 665057.129179305 N, and the surface torque is 26357.98350914472 N.m.

## On bottom

The same, with the two bit boundary conditions applied: tension starts at -89000 N and torque starts at 2700 N.m.

    hookload = 576057.1291793063 N
    surface torque = 26934.19951651723 N.m

The hookload dropped by exactly the weight on bit. The torque rose by 576.2160073725099 N.m, which is NOT the bit torque of 2700 N.m.

## Why the torque did not rise by the bit torque

Because the bit torque did go in, and the friction changed at the same time.

Putting weight on bit puts the bottom of the string into compression. A compressed string in a curve presses against the wall differently from a tensioned one, so the side force distribution near the bit changes, and the tangential friction changes with it.

The two effects nearly cancel here: 2700 N.m went in at the bit and about 2124 N.m of friction torque came out. The net is 576 N.m.

That near-cancellation is specific to this geometry and this weight on bit. On the horizontal well the same comparison gives 5507.031624462717 N.m, which is more than double the bit torque.

## What the surface torque is made of

Almost all of it is friction. On the build-and-hold well, 2700 N.m of 26934 is bit torque and the rest, about 90 percent, is the string rubbing against the hole.

That proportion is the reason torque is a better hole-condition indicator than hookload on a long well. It is dominated by the thing you are trying to monitor.

## The radius that carries it

Tangential friction acts at the tool joint radius, not the pipe body radius, because the tool joints are what touch the wall. For this drill pipe that is 0.168275 m diameter, so 0.0841375 m of radius.

That is 33 percent larger than the pipe body radius of 0.0635 m, and torque is proportional to it, so using the wrong radius understates the torque by a third. The Professional tier has a lesson on exactly this.

## Exercise

Compute the ratio of surface torque to bit torque for each of the five wells, using the rotate-on-bottom rows in the panel.

Then say which well has the smallest ratio and why that is the well where a downhole torque measurement would tell you the least.
