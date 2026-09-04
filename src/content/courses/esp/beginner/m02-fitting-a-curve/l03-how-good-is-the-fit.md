# How good is the fit

The fit checks itself against one threshold, and it can be badly wrong and still pass.

{{panel:pd-stage-explorer}}

## The check the engine runs

The head fit rmse is compared against two percent of the tallest published head point. On the golden vendor curve that point is 32.0000 ft, so the threshold is 0.6400 ft. The rmse is 0.0534522484 ft, or 0.00167038 of it, and warnings raised is 0. That fit passes comfortably, and says nothing about whether the pump is right, only that the five numbers typed in sit on a smooth cubic.

## The same curve, mistranscribed

BRASS-11 is a teaching curve, not a published case: the same five vendor points, twice mistyped. The mild version types 26.0 where the sheet says 28.0 at 2500 bbl/d, the slip 3.05 where it says 30.5 at 2000 bbl/d.

| Version | Rmse, ft | Threshold, ft | Warnings | Head at 2500, ft | BEP head, ft |
| --- | --- | --- | --- | --- | --- |
| As published | 0.05345225 | 0.640000 | 0 | 27.914286 | 26.992525 |
| Mild, 28.0 typed 26.0 | 0.58797473 | 0.640000 | 0 | 26.942857 | 26.041925 |
| Slip, 30.5 typed 3.05 | 5.92250912 | 0.640000 | 1 | 18.502857 | 22.574983 |

The slip is caught. Its rmse is many times the threshold and the engine says so: "The head fit misses the points by more than two percent of the curve height; check the transcription." It would have been caught by eye anyway, since it reads 18.502857 ft at 2500 bbl/d.

## The one that gets through

The mild error is the one that matters. It takes the rmse from 0.05345225 to 0.58797473 ft, more than a tenfold degradation, and 0.58797473 is still below 0.640000. Warnings raised: 0.

Nothing says anything is wrong. The curve still looks like a pump curve and answers at every rate. At 2500 bbl/d it answers 26.942857 ft rather than 27.914286 ft, and the head at the best efficiency point comes back 26.041925 ft rather than 26.992525 ft.

## What the check does not look at

The best efficiency rate is 2635.0000 bbl/d on all three versions, the slip included, because the efficiency points were never touched and the BEP search reads the efficiency fit alone. A head transcription error is invisible to the rate that search returns, while the head reported at that rate moves.

There is no check on the efficiency transcription: the threshold is a head threshold against the tallest head point, and an efficiency typed wrong raises nothing.

## The mistake

Treating zero warnings as confirmation that the sheet was read correctly. It means only that the head rmse came in under two percent of the tallest head point, which the mild BRASS-11 error does. The check that works is the residual at each point rather than the rmse over all of them, because one bad point is a single large residual against four small ones, which a summed measure averages away.

## Exercise

Read the head fit rmse and the warning count for the vendor curve and both BRASS-11 versions.

Then say what head at 2500 bbl/d the mild version would have had you report, and what in its output would have warned you.
