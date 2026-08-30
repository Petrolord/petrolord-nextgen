# Onward

What this course certified, and what it hands on.

## What this course certified

The industry-standard 1D geomechanics workflow: a mechanical earth model from logs and a stress estimate, full-tensor Kirsch wellbore stability at a point, and the mud weight window walked along a whole trajectory with its tightest point and its two lower-bound candidates.

## What it took as given

**The overburden**, integrated from a density log upstream.

**The pore pressure**, from the Pore Pressure course. This engine deliberately does not compute it, so a geomechanics answer can never contain a circular pore pressure argument.

Both are inputs, both carry their own uncertainty, and neither can be checked from inside this course.

## What it hands on

**To well control:** the fracture gradient at every depth, which becomes the shoe's fracture equivalent mud weight, and the pore pressure gradient that sets the kill mud weight. Every MAASP and every kick tolerance in that course rests on numbers from this one.

**To casing design:** a casing point, to be compared against the kick tolerance one, with the shallower governing.

**To the well planner:** the window as a function of inclination and azimuth, so a trajectory can be chosen on evidence rather than on drilling convenience alone.

**To drilling hydraulics:** the fracture gradient the equivalent circulating density is compared against.

## What hydraulics and well control hand back

**The circulating uplift, the surge and the swab**, all of which have to fit inside the static window this course produces.

**The trip margin**, which pushes the mud weight up toward the fracture gradient and is decided on well control grounds.

Two courses pushing the same number in opposite directions, and the well plan holds both.

## Three habits from this tier

**Walk the whole trajectory.** The tightest point is not reliably at total depth, and on one of the two wells in this course it is at the kick-off.

**Say which bound binds.** It decides the remedy, the uncertainty, the failure mode and which parameters are worth measuring. It is one extra column and it changes what the reader can do.

**Run the sensitivity before quoting a precision.** The Poisson ratio alone moves these windows by more than a thousand kilograms per cubic metre, and it usually comes from a lithology table.

## The five things this course will not certify

Inelastic and anisotropic rock behaviour, time-dependent effects, chemical effects, thermal stress, and natural fractures and bedding.

All five are taught in Expert m05 and the go-live migration refuses to run if any graded field names one of them.

## The one sentence

A mud window is a property of a trajectory rather than of a depth, its floor is set by whichever of two unrelated failures happens to be larger there, and the input that moves it most is the one that usually came from a table.
