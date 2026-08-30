# Where the movement comes from

Four effects that change the length of a tubing string after it is landed.

{{panel:cd-spaceout-explorer}}

## Temperature

The largest of the four in most wells. Steel expands when heated and contracts when cooled, and the coefficient is small but the string is long.

Produce a hot reservoir and the tubing warms towards the flowing temperature, which is well above the static geothermal profile in the upper part of the well. Inject cold water or pump a cold stimulation fluid and it cools far below it.

A change of tens of degrees over kilometres of steel is metres of length.

## Ballooning

Internal pressure swells the pipe radially, and a pipe that swells radially shortens axially. External pressure does the reverse. The effect is real and it is smaller than the thermal one in most producing wells and comparable in a high rate injection.

## Piston effect

Pressure acting on the changes in cross section at the seal assembly and at the packer produces a net force, which stretches or compresses the string according to which way the differential runs.

## Buckling

If the string goes into compression it buckles helically inside the casing, and a helix is shorter end to end than a straight line of the same pipe. So buckling itself shortens the string, and it does so nonlinearly.

## What this course does with them

Nothing. This course does not compute any of the four.

It takes a length change as an input, from the Casing and Tubing Design course, and asks a purely geometric question: given that the string will move by this much, where should the seals be landed and how long does the bore need to be.

## Why that division is the right one

Because computing the length change needs a temperature profile, a pressure profile, a fluid density and a survey, and none of those is in this model. Borrowing the answer keeps the boundary honest.

And because the geometric question is genuinely separable. Once you know the string moves up by so much and down by so much, the landing problem does not care why.

## Exercise

Name the four effects and say, for each, whether it lengthens or shortens the string under production heating.

Then say which one is nonlinear and why.

Finally, state in one sentence what this course takes as input and what it computes.
