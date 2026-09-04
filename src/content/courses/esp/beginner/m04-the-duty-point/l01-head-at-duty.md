# Head at duty

A duty point is a rate and a drive frequency. Head is the first of the three things the stage answers with, and it is head for one stage.

{{panel:pd-stage-explorer}}

## The curve the reading comes off

The published vendor curve carries five points, a published range of 1500 to 3500 bbl/d, a reference frequency of 60 Hz and a curve specific gravity of 1.0. Its head fit is a cubic in the rate over a normalising scale of 3500 bbl/d.

## Nine readings at the reference speed

| Rate, bbl/d | Head, ft | Region |
| --- | --- | --- |
| 1500 | 31.985714 | downthrust |
| 1750 | 31.423214 | downthrust |
| 2000 | 30.557143 | recommended |
| 2500 | 27.914286 | recommended |
| 3000 | 24.057143 | recommended |
| 3500 | 18.985714 | upthrust |

Head falls the whole way and the fall steepens as the rate rises. The region word changes twice while every row stays inside the published range, so region and range are two separate judgements on one reading.

## The same duty at another speed

The engine does not read the duty rate off the reference curve. It maps the rate back to the reference speed, reads the fit there, and maps the answer forward again. At 50 Hz and 2500 bbl/d the equivalent rate on the 60 Hz curve is 3000.000000 bbl/d and the head per stage is 16.7063492063 ft. At 60 Hz that same 2500 bbl/d reads 27.9142857143 ft.

Held at 2500 bbl/d and swept across speed the stage reads 7.10873016 ft at 40 Hz, 16.70634921 at 50 Hz, 27.91428571 at 60 Hz and 40.73253968 ft at 70 Hz.

## Where the square law appears not to hold

At 50 Hz the head multiple against the 60 Hz reading is 0.59848743 while the speed ratio squared is 0.69444444. Nothing is broken. The square law is exact when the reference rate moves with the speed, and holding the duty rate fixed moves the reading to a different place on the reference curve, so the law and the curve shape act at once.

## The mistake

Reading head at the duty rate straight off the published curve when the drive is not at the reference frequency. It hands you 27.9142857143 ft where the stage makes 16.70634921 ft, and the error is multiplied by every stage in the stack before anybody sees it.

## What it refuses

At a drive frequency of zero the head is NaN and the region is invalid. Head also refuses to notice the fluid: at 1500 bbl/d and 60 Hz it is 31.985714 ft on a 1.00 specific gravity fluid and 31.985714 ft on a 0.90 one. Gravity moves brake power and moves nothing else.

## Exercise

Read the stage at 2500 bbl/d at 40, 50 and 60 Hz in the panel and write the three heads with their equivalent rates on the 60 Hz curve.

Then say which one you would have got by reading 2500 bbl/d off the published curve.
