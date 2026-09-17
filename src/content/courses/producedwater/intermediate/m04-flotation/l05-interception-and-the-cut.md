# Interception, and the cut the kinetics gives

The chain is assembled. The last step is the one that turns a gas flux, a bubble and a residence time into a droplet diameter, and it is where this device's sharpness comes from as well.

{{panel:pw-device-explorer}}

## Capture is by interception

A droplet is captured when it comes close enough to a rising bubble to touch it. The efficiency of that encounter is proportional to the SQUARE of the droplet diameter divided by the bubble diameter, which is the Stokes flow interception result, with the module's `interceptionCoefficient` of 1.5 in front of it.

Multiply that efficiency by how many bubbles there are and how much water each one sweeps, and you have a rate constant. On the KOKORI cell it is 2830279.196411133744 per second per square metre of droplet diameter. The units of that constant are worth reading twice: it is a rate per unit of droplet diameter SQUARED, which is the interception law showing through.

## The cut is where the rate uses up the time

The removal of a given droplet size is an exponential decay in the rate multiplied by the residence time. The cut size is the droplet for which that product is the log of two, because an exponential has used up exactly half of what it started with at the log of two.

On this cell the residence is 434.751720 s and the cut comes out at 23.734355 micron. The module states the basis on every return:

interception of droplets on a rising bubble swarm: the rate goes as the square of the droplet diameter and as the gas rate over the cube of the bubble diameter, and the cut size is the droplet the cell removes half of in its residence time

## Where the sharpness of 2 came from

That same exponential is what fixes the grade curve. A survival that is an exponential in the SQUARE of the reduced size has the same half point and the same leading power as the reduced efficiency family at m equal to 2, so that is the family the train integrates for this device.

The sharpness of this device was therefore not chosen. It follows from capture by interception, and it would be a different number if the capture mechanism were different.

## What the bubble diameter does to the cut

The basis string says the rate carries the inverse CUBE of the bubble diameter, and the cut is a square root of a rate, so the cut goes as the bubble diameter to the three halves:

| bubble micron | cut micron | cut over the 300 micron cut |
| --- | --- | --- |
| 40 | 0.750546 | 0.048686 |
| 80 | 2.122865 | 0.137706 |
| 150 | 5.450349 | 0.353553 |
| 300 | 15.415916 | 1.000000 |
| 600 | 43.602795 | 2.828427 |
| 1200 | 123.327327 | 8.000000 |

FINER BUBBLES CUT FINER, and that is the entire engineering difference between the two kinds of flotation cell.

## The one calibration

One number in this chain has no derivation at all. `attachmentEfficiency`, the probability that a collision sticks, is 0.01 and it is a CALIBRATION. It is an input, so a caller with a vendor curve can move it, and nothing in this course presents it as published.

## Exercise

Say why the sharpness of a flotation cell is 2 rather than a value somebody selected, and what would have to change for it to be something else.

Then use the last column of the table to describe what halving the bubble diameter does to the cut size.
