# Reading a warning

Warnings in this package are a count and a code. They are not a severity, and their absence is not a clearance.

{{panel:pd-stage-explorer}}

## The count does not track the error

The gassyOffshore golden design swept down the drive raises no warning at 60 and 55 Hz, one warning coded upthrust at 50 Hz, and two warnings coded outsideCurve and upthrust at 46, 44, 42 and 40 Hz. The stage counts across those last four rows are 481, 589, 748 and 1009.

Two warnings at 481 stages. The same two warnings, with the same two codes, at 1009 stages. The count saturates immediately and then says nothing more, however far the design travels afterwards.

## Silence is not a clearance

The highWaterCut golden design raises one warning coded downthrust at 50 Hz and then zero warnings at 46, 44, 42 and 40 Hz, while its stage count goes 264, 320, 354, 395, 445. The quietest rows in that sweep are the ones furthest from the design.

The transcription check behaves the same way. It fires when the head fit residual exceeds two percent of the tallest published head point, 0.640000 ft on this curve. Correctly transcribed, the residual is 0.0534522484 ft and nothing fires. A teaching version with 28.0 ft typed as 26.0 has a residual of 0.58797473 ft, still under threshold, fires nothing, and reads 26.942857 ft at 2500 bbl/d. Only a decimal slip, 30.5 typed as 3.05, reaches 5.92250912 ft and raises one warning.

## A note is not a warning either

The viscosity check on a 20 cp fluid at 58 lbm/ft3 reports 21.517241 cSt, correction required true and factors applied false, with a note that the water curve overstates head and efficiency. Nothing was refused, nothing was corrected, and the head and efficiency were returned unchanged.

## The mistake

Reading warnings raised zero as a verdict. Zero means no coded condition was met. It does not mean the design was checked and passed, and on the highWaterCut sweep it is the answer at every frequency where the stack has nearly doubled.

## What it refuses

The warning list refuses to rank. Codes carry no order and no magnitude, so outsideCurve reads identically whether the equivalent rate is 87.4783 bbl/d past the end of the data or 625.6000 bbl/d past it. The distance exists in the reading and never in the warning.

## Exercise

Write the warning count and codes for the gassyOffshore sweep at 50, 46 and 40 Hz beside the stage count at each.

Then do the same for the highWaterCut sweep, and say which of the two designs a warning count alone would have caught.
