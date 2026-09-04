# What a duty point cannot tell you

A duty reading is one stage on one curve. Four things it looks like it settles, and settles none of.

{{panel:pd-stage-explorer}}

## It cannot tell you the curve was transcribed correctly

A teaching curve built from the published points, with 28.0 ft typed as 26.0 at 2500 bbl/d, has a head fit residual of 0.58797473 ft against a transcription warning threshold of 0.640000 ft. Warnings raised: zero. It reads 26.942857 ft at 2500 bbl/d where the correct curve reads 27.914286 ft, and puts the best efficiency head at 26.041925 ft instead of 26.992525 ft.

The correctly transcribed curve has a residual of 0.0534522484 ft against the same 0.640000 ft threshold. A silent curve is not the same thing as a right one.

## It cannot tell you the fluid can be pumped on a water curve

The viscosity check fires above 10 cSt. An 8 cp fluid at 58 lbm/ft3 is 8.606897 cSt and needs nothing. A 20 cp fluid at the same density is 21.517241 cSt, the correction is required, and the factors applied are none: the module reports that the water curve overstates head and efficiency, then asks for Hydraulic Institute factors rather than inventing them.

What that costs is visible when factors are supplied. Head factor 0.85 and efficiency factor 0.70 turn 28.00000000 ft into 23.80000000 ft and 0.7000000000 into 0.4900000000, with a rate factor of 0.90 turning the duty into 2250.000000 bbl/d. With no factors supplied the reading is returned unchanged.

## It cannot tell you the reading came from data

Inside the published range is a separate field with its own answer, and it is false at rates where head, efficiency and power all still print to eight decimal places.

## It cannot tell you the stack, the well or the motor

One stage of the published curve at 2500 bbl/d and 60 Hz makes 27.914286 ft. Nothing in that reading knows the head the well requires, how many stages are needed to make it, or what the motor is rated for. Those are three more translations and each has its own way of going wrong.

## The mistake

Treating a clean duty reading as a cleared design. Region recommended, inside the published range true, a residual well under threshold: all four can be true of a curve that was typed in wrong and a fluid the curve does not apply to.

## Exercise

Read head at 2500 bbl/d and 60 Hz on the published curve and write it down.

Then list the three checks it has not made: the transcription residual against its threshold, the viscosity against 10 cSt, and inside the published range.
