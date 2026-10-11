# Why density needs the far angles

Density is the parameter the angles see least. This lesson inverts Ekene-1 from three sets of stacks and scores each parameter at the well. The near stack recovers AI (acoustic impedance) and moves density's shape without moving its level far; adding the mid and far stacks turns the density correlation negative. On the Ekene pack density is not resolved.

## The experiment

Ekene-1, blind, simultaneous inversion with weights of 0.050000, 0.050000 and 0.050000 and 60 iterations, from three sets of stacks. Each parameter is scored against the well's log after the high cut: correlation, and the RMS of the relative error in percent of AI, Vp/Vs and density.

| stacks used | AI correlation | AI error percent | Vp/Vs correlation | Vp/Vs error percent | density correlation | density error percent |
| --- | --- | --- | --- | --- | --- | --- |
| the three LFMs alone (no seismic) | -0.190352 | 8.638086 | 0.048283 | 11.122749 | -0.087754 | 0.767482 |
| near only | 0.858677 | 9.807415 | -0.744719 | 30.824755 | 0.614032 | 0.627310 |
| near and mid | 0.865225 | 9.757899 | 0.383124 | 13.660754 | -0.707948 | 12.184029 |
| near, mid and far | 0.863789 | 8.956955 | 0.470296 | 10.707173 | -0.767957 | 14.112317 |

## AI

The near stack alone holds AI. Its correlation goes from negative with the LFMs alone to 0.858677 with the near stack, and the mid and far stacks add little to it. The AI error falls as stacks are added, and with all three it is still above the LFMs-alone figure. The post-stack pattern holds: shape at the cost of level.

## Vp/Vs

With the near stack only, Vp/Vs goes badly wrong: a correlation of -0.744719 and an error of 30.824755 percent, far worse than the LFMs alone. G2 is small at 10 degrees, and the solver still moves the shear impedance to fit the near stack. The mid and far stacks pull Vp/Vs back, to a correlation of 0.470296 and an error just below the LFMs-alone figure with all three. Vp/Vs needs at least the mid angles.

## Density

With the near stack only, density's RMS error stays under one percent, 0.627310 against 0.767482 with the LFMs alone, while its correlation changes from -0.087754 to 0.614032. G3 is tiny at 10 degrees, so the near stack moves density's shape without moving its level far, and that positive correlation rests on a level the LFM still sets.

Add the mid and far stacks and the density correlation at Ekene-1 turns negative, to -0.767957, with an error of 14.112317 percent: the inversion moves density away from the log. In this table density is the least reliable of the three parameters.

## Why the title still holds

The far stack here reaches 30 degrees, and G3 grows fastest beyond it, between 30 and 40 degrees. So the reading has two halves: the coefficients point to angles beyond those the pack's stacks reach, and on the Ekene pack, with these stacks, density is unresolved. A study on this pack reports density as unresolved and uses AI, with Vp/Vs only as far as its blind score supports. Nothing here shows that stacks beyond 30 degrees would succeed: the pack has none.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Simultaneous inversion by stacks" and Data to "Ekene teaching pack", Well to Ekene-1, "The well's own log" to left out, weights 0.050000, 0.050000, 0.050000 and Iterations 60. Set "Stacks used" to near only, then near and mid, then near, mid and far, and read the three parameter rows each time. Then, with all three stacks, raise the density weight alone to 1 and write one sentence on what happens to the density error and correlation.
