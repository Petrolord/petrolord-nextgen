# The excess factor

One multiplier, applied to one row, and it is linear all the way through.

{{panel:cm-volume-explorer}}

## Where it is applied

Inside `annulusRows`, and only there:

    if (openHole && excessOpenHolePct > 0) capM2 *= 1 + excessOpenHolePct / 100;

So it multiplies the CAPACITY of open hole rows. Cased rows are untouched, because the inside diameter of a piece of steel is a measurement rather than a guess.

## The consequence for the volumes

The open hole capacity on this course's wells goes from 0.011780948889016823 at the bit size to 0.013548091222369345 at 15 percent, and every volume that spans open hole moves with it.

| excess | open hole capacity (m2) | slurry (m3) | sacks |
|---|---|---|---|
| 0 | 0.011780948889016823 | 22.295953209602207 | 583.6636965864452 |
| 10 | 0.012959043777918507 | 24.1809050318449 | 633.0079851268299 |
| 15 | 0.013548091222369345 | 25.123380942966243 | 657.6801293970221 |
| 25 | 0.01472618611127103 | 27.008332765208937 | 707.0244179374067 |
| 40 | 0.01649332844462355 | 29.835760498572974 | 781.0408507479837 |
| 50 | 0.017671423333525234 | 31.720712320815664 | 830.3851392883682 |

## The relationship is exactly linear

Not approximately. The excess multiplies a capacity, the capacity multiplies a length, and the result is added to a fixed cased contribution and a fixed shoe track.

So the slurry volume is a straight line in the excess with a positive intercept, and the intercept is the part of the job that is not in open hole. On the slant well the open hole part at zero excess is 18.849518222426916 cubic metres, and every one percent of excess adds a hundredth of that.

## What it does not touch

**The displacement volume.** That is inside the casing and has nothing to do with the hole.

**The shoe track.** Also inside.

**The cased annulus.** Steel does not wash out.

So on a job whose top of cement is inside the previous casing, only PART of the annular slurry responds to the excess, and the responding part is the part below the previous shoe.

## What it does touch that is easy to miss

The placement simulation, not just the volume sheet. The engine passes the same excess into `simulatePlacement`, so the annulus the cement is placed into is the inflated one. Getting the excess wrong therefore moves the achieved top of cement as well as the volume ordered, and the two errors partly cancel: order for 15 percent, place into a hole that really washed out 30, and the cement stops short.

## Exercise

Using the table above, work out how many extra sacks each ten percent of excess costs on this job.

Then check that the answer is the same between 0 and 10 as it is between 40 and 50, and say why it has to be.
