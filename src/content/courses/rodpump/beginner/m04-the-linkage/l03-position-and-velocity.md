# Position and velocity

The closure returns a position. The derivative of that position with respect to crank angle is the torque factor, and it carries no speed in it.

{{panel:pd-string-explorer}}

## One revolution, read downward from the top

Position is measured downward from the top of the stroke, so a large number is a low polished rod. A negative torque factor means the polished rod is going up.

| Crank, deg | Position, in | ds/dtheta, in/rad | Velocity at 10 spm, in/s |
| --- | --- | --- | --- |
| 0.0 | 106.685326630 | -0.727786321 | -0.762136053 |
| 15.0 | 104.146850318 | -18.627647824 | -19.506827186 |
| 30.0 | 97.102890470 | -34.558953004 | -36.190050957 |
| 45.0 | 86.510128148 | -45.311100991 | -47.449673999 |
| 60.0 | 73.948635846 | -49.617592869 | -51.959421749 |
| 75.0 | 60.989577714 | -48.696603752 | -50.994964201 |
| 90.0 | 48.707362253 | -44.821028030 | -46.936470795 |

The rod is already at its fastest by 60.0 deg and slowing again by 75.0 deg, a fifth of the way into the upstroke.

## Geometry alone, then speed on top

The velocity is the torque factor times the crank's angular velocity. Double the strokes a minute and every velocity in that column doubles, while not one torque factor changes. That split is worth holding: ds/dtheta is a property of six lengths, and spm is the only place time enters.

The largest torque factor on the published unit is 56.305306799 in from the engine and 56.307014882 in from the oracle's Newton closure with implicit differentiation, a difference of -1.7081e-3 in.

## The two halves are not mirror images

At 10 spm the fastest downward velocity is 58.962779400 in/s and the fastest upward velocity is -52.143013743 in/s. The ratio the engine's revolution gives between them is 0.884337785. They are not equal in size, and no dimension was chosen to make them unequal.

## The mistake

Assuming the polished rod moves as a sine. A sine reaches the same speed each way and turns at exactly half the cycle. The four-bar does neither: the upstroke takes 0.544444444444 of the revolution, and the position on the published unit is still 1.876427807 in below the top at cycle fraction 0.500000, where a simple harmonic stroke of the same length is at its extreme of 106.687716837 in. The four-bar turns at cycle fraction 0.541667, where its position reads 0.003849789 in.

Every load a rod string sees is an acceleration times a mass, so a motion that is wrong in shape is wrong in load before any string is modelled.

## What it refuses

It refuses to give a velocity without a speed. The torque factor is in inches, and inches per second appear only once a spm is supplied. It also refuses to turn a torque factor into a torque, because no load has been named anywhere in the closure.

## Exercise

Read the torque factor and the velocity at crank 0.0, 30.0, 60.0 and 90.0 deg at 10 spm, then set the panel to a different speed and read the same four.

Say which column moved and which did not, and why.
