# Shoe, float collar, plugs, spacer

The hardware the volume sheet is written around.

{{panel:cm-volume-explorer}}

## The shoe

The bottom joint of the casing, with a rounded nose so the string does not hang up on a ledge, and a one-way valve. On this course's slant well the shoe is at 3000 m of measured depth and on the horizontal well at 2800.

## The float collar

A second one-way valve, usually one or two joints above the shoe. On the slant well it sits at 2960 m and on the horizontal well at 2760, in both cases 40 m above the shoe.

Two valves rather than one, so that a single failure does not let the cement U-tube back into the casing after the job.

## The shoe track

The length of casing between the float collar and the shoe, and the volume inside it.

    shoe track volume = casing bore capacity x (shoe depth - float collar depth)

On both wells that is 40 m of 0.01937743444976952 square metres, which is 0.7750973779907808 cubic metres.

That volume is cement that is pumped and NEVER displaced out. It stays inside the casing and is drilled out with the next hole section. Its purpose is to keep the last of the cement, which is the part most contaminated by mud, out of the annulus at the shoe.

## The plugs

A bottom plug pumped ahead of the cement, which wipes mud off the casing wall and bursts at the float collar. A top plug pumped behind it, which wipes cement off the wall and lands on the float collar to end the job.

The engine does not model either. It models the FLUID sequence they separate, and the bump of the top plug is the end of the displacement volume.

## The spacer

A fluid pumped between the mud and the cement, for three reasons: cement and water-based mud flocculate on contact and the spacer keeps them apart; the spacer can be designed to water-wet the pipe and the rock so the cement bonds; and it gives the density hierarchy a step to climb.

On this course's jobs the spacer is 4 cubic metres at 1500 kg/m3, between a mud at 1440 and a lead slurry at 1560.

## Displacement

Everything pumped behind the top plug, to push it from surface to the float collar.

    displacement volume = casing bore capacity x float collar depth

Note the depth: the float collar, not the shoe. Displace to the shoe and you have pushed the shoe track cement out into the annulus, which is exactly what the shoe track exists to prevent.

## Exercise

Compute the displacement volume for the slant well from its float collar depth of 2960 m and the bore capacity above.

Then compute what it would be if somebody displaced to the shoe instead, and say how much cement would have left the casing that should not have.
