# Nozzles and total flow area

Three holes in the bit, and the one number that describes them.

## The nozzles

A drilling bit has jets, usually three, that direct the mud at the cutting structure and the hole bottom. They are removable, they come in sizes measured in thirty-seconds of an inch, and choosing them is one of the few hydraulic decisions made at the rig floor.

## Total flow area

The only thing the calculation needs is the SUM of the nozzle areas:

    TFA = sum of pi/4 x d^2 over the nozzles

This course uses 0.000461814 m2, which is three 14/32 inch nozzles.

## Why only the total

Because the nozzles are in parallel and the pressure drop across each is the same. Three equal nozzles carrying a third of the flow each produce exactly the same pressure drop as one nozzle with three times the area carrying all of it.

So the DISTRIBUTION of nozzle sizes affects where the jets point and how the bottom is cleaned, and it does not affect the pressure drop at all. That is a real separation between the hydraulic calculation and the bit design.

## The one place the distribution matters

Bit balling and bottom hole cleaning. An asymmetric nozzle arrangement, or a blocked nozzle, changes which part of the cutting structure gets cleaned.

The pressure calculation will not notice a blocked nozzle except through the reduced total area, which shows as a pump pressure INCREASE. That is a genuine diagnostic: a sudden rise in standpipe pressure with no other change is a plugged nozzle until proved otherwise.

## The reverse diagnostic

A sudden FALL in standpipe pressure with no other change is a washout: a hole in the string somewhere above the bit, which lets mud take a shortcut.

Both are detected by comparing the measured pump pressure against the computed one, which is one of the reasons the calculation is run at all.

## The units trap

Nozzle sizes are quoted in thirty-seconds of an inch and total flow area in square inches, while every equation here is in SI. A 14/32 nozzle is 0.011113 m in diameter and 9.699e-5 m2 in area.

Three of them is 2.9096e-4 m2, which is not the 4.61814e-4 m2 this course uses. That difference is worth checking rather than assuming, and the exercise asks you to.

## Exercise

Work out what nozzle arrangement gives a total flow area of 0.000461814 m2.

Try three equal nozzles first and see what size they would have to be, in thirty-seconds of an inch, and say whether that is a size that exists.
