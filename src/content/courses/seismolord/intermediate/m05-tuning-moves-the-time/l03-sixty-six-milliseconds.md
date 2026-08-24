# Sixty six milliseconds

The Associate tier reported the three peak times and moved on, and the previous two lessons put the moving peak and the fixed reflectivity to work. None of that answers the question a professional actually has to answer, which is whether the effect is big enough to change a decision. An effect that is real but tiny is a curiosity. An effect that is real and large is a working hazard, and it has to be sized before you know which one you are dealing with.

## The subtraction

The strongest synthetic amplitude sits at 1580 ms TWT at 15 Hz and at 1646 ms TWT at 40 Hz. The difference is 66 ms.

That is the whole calculation, and it is the only arithmetic in this lesson. All the work is in deciding whether 66 ms is a lot, and the only honest way to answer that is to hold it against things whose size you already know.

## Against the sample rate

The synthetic is computed on a 2 ms grid, so 66 ms is 33 samples. The capstone grades the two peak times to a tolerance of 2 ms, which is one sample. The movement caused by changing the wavelet is therefore thirty three times the precision the assessment demands of you when you report a single one of those times.

That ratio is the point. The grading is tight because reading a time off a panel is a precise act. The effect is loose because choosing a wavelet is a coarse act. A quantity you are expected to report to within one sample is being relocated by thirty three samples by a decision that is not usually written down anywhere.

## Against the scan you just learned

This tier's bulk-shift scan searches lags from minus 40 ms to plus 40 ms in 2 ms steps, and on the teaching exercise it recovers a planted lag of 8 ms.

Set 66 ms beside that 8 ms. The misalignment you spend a whole module learning to measure, defend and report is 8 ms. The movement of the brightest event caused by nothing more than a change of wavelet is more than eight times larger. It is also larger than the entire one-sided range of the scan, which reaches only 40 ms, so if two people picked the brightest event at those two frequencies and then tried to reconcile their picks with a bulk-shift scan of this width, the scan could not close the gap between them at all.

The lesson is not that the scan is too narrow. The scan is sized for the misalignment it exists to correct. The lesson is that tuning movement and misalignment are different problems, and a shift scan does not fix the first one.

## Against the well itself

The logged interval on the teaching well runs from 1500 ms TWT to 1650 ms TWT, a span of 150 ms. The 66 ms of movement is close to half of that.

So this is not a subtle relocation within a broad zone of interest. Nearly half the two-way time the well actually illuminates lies between the 15 Hz answer and the 40 Hz answer. If your reservoir target sat inside this interval, the two wavelets would put the brightest event on opposite parts of it.

The Associate tier used a teaching time-depth function with a single 2000 m/s overburden, which was chosen so that a two-way time in milliseconds equals the depth in metres on this well. Under that convention the 66 ms becomes 66 m of apparent depth. That is a prognosis error big enough to matter to anyone drilling to the event.

## Against the wavelet that caused it

The Associate tier worked with a Ricker wavelet spanning about 120 ms, and used half a wavelet length as the working threshold for when two reflections start to interfere. On that scale 66 ms is more than half a wavelet.

That is a consistency check rather than a coincidence. The peak relocates because a different group of neighbouring coefficients falls inside the reach of the wavelet at each frequency, and the reach of the wavelet is the scale that sets how far it can relocate. An effect of this kind cannot move the peak by an arbitrary amount. It moves it by something on the order of the length of the wavelet, which is exactly what 66 ms is.

Knowing that is useful in the field. If you rebuild a synthetic at a different bandwidth and the brightest event has moved by a few milliseconds, that is ordinary. If it has moved by something comparable to a wavelet length, that is also ordinary, and it is the case that hurts.

## What 66 ms means for a pick

Put all four comparisons together and the summary is short. Sixty six milliseconds is thirty three samples, thirty three times the grading tolerance on a reported time, more than eight times the bulk shift this tier measures, wider than one side of the scan that measures it, close to half the logged interval of the well, and on the order of a wavelet length.

None of that was caused by the earth. All of it was caused by a choice of wavelet that in most projects is made once, by somebody else, and never restated.

## Exercise

Compute the movement of the peak between 15 Hz and 40 Hz on the teaching well, then express it in samples at the 2 ms sample rate and as a multiple of the 2 ms grading tolerance on a reported peak time. As a self-check: 1646 ms TWT minus 1580 ms TWT is 66 ms, which is 33 samples, and 33 times the 2 ms tolerance. Then answer in two sentences: why can a bulk-shift scan running from minus 40 ms to plus 40 ms not reconcile two picks made 66 ms apart, and why is it reasonable that the movement is on the order of a wavelet length rather than an arbitrary size?
