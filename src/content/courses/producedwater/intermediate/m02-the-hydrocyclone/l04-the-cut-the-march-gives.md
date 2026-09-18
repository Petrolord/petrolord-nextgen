# The cut size the march gives

Everything the last three lessons set up now meets in one number. The cut size of a liner is the droplet whose radial migration just crosses the gap in the time the water is in the tube.

{{panel:pw-device-explorer}}

## The definition, stated as a race

A droplet that migrates faster than it needs to is captured. A droplet that migrates slower is carried out with the water. The droplet exactly on the boundary crosses the travel in exactly the residence time, and that droplet is the cut size, because half of the volume at that diameter enters inside its starting radius and is caught.

So the model does not need an efficiency curve to find the cut. It needs a distance, a time, and a migration velocity.

## The KOKORI bank, with every term on the page

| quantity | value |
| --- | --- |
| flow per liner | 0.000690049023 m3/s |
| turndown | 1.150082 |
| field | 1322.687929 g |
| liner volume | 0.000673478925 m3 |
| residence | 0.975987 s |
| travel | 0.003624368671 m |
| migration velocity at the cut | 0.003713541683 m/s |
| cut size | 4.430689 micron |
| Reynolds at the cut droplet | 0.030870 |

Read the travel and the migration velocity together and the residence time falls out of them, which is the arithmetic the march performs in reverse. The droplet has 0.003624368671 m to cross and 0.003713541683 m/s to do it in.

## Two numbers that are the same here

The return carries an IDEAL cut and a REPORTED cut, with a shear penalty between them. On this bank the shear penalty is 1.000000, so the ideal cut and the reported cut are the same number, 4.430689 and 4.430689.

They are not always the same number, and the module that separates them is the next one. Carry the shape of it forward: the reported cut is the ideal cut with a penalty applied, and the penalty is one until the bank is pushed past its envelope.

## What the march is checked against

A cut size defined this way makes a claim that can be tested without using any of the arithmetic that produced it. If 4.430689 micron really is the droplet this liner removes half of, then firing droplets of that diameter into the liner from starting radii spread by area and marching each one should see about half of them reach the core.

That is exactly what the published cases for this device carry. The captured fraction at the reported cut comes out at 0.500455, on every row of the cyclone group, against the one half the definition asks for. The march that produced the number and the march that checked it re-derive the field by different routes, so the agreement is evidence rather than bookkeeping.

## The Reynolds number beside it

Every device in this module reports the Reynolds number of its OWN cut droplet, and this one is 0.030870. That is well inside the creeping flow band Stokes is stated to, so the migration velocity under the centrifugal field is being computed where the law it comes from is honest. A cut size that fell outside that band would say so on the same return instead of arriving quietly.

## Exercise

Using the table above, check that the travel divided by the migration velocity at the cut gives the residence time, and say what that identity means about how the cut size was found.

Then explain what a shear penalty of 1.000000 tells you about how this bank is being run.
