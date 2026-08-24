# When the scan misleads

The scan has been reliable for three lessons. It found a planted lag exactly, its curve was symmetric, and its peak stood clear. This lesson closes the module by stating what it cannot do, because the failures of a tool you trust are more dangerous than the failures of one you do not.

## The one thing the scan is asked to find

Read the question `suggestBulkShift` actually poses. For each candidate lag it slides the whole synthetic by that lag, correlates, and scores. Every sample of the synthetic moves by the same amount. There is no lag in the search that moves the top of the log by one number and the bottom by another.

So the scan finds the best **constant** shift. That is its entire remit.

Now notice what follows. If the real disagreement between your synthetic and the seismic is not a constant shift, the scan does not detect that. It has no way to express the finding. It does what it was built to do, which is to pick whichever constant shift leaves the least disagreement, and it returns that shift with a correlation attached. The output looks the same whether the model fits or not.

## Four ways the model can be wrong

Each of these produces a scan result that looks ordinary.

**Stretch.** The synthetic runs slower than the seismic, so the interval between two events on the synthetic is longer than the interval between the same two events on the seismic. Usually this traces back to the time and depth relationship: a velocity that is too low over part of the section, drift between checkshots, or a sonic that was affected by borehole conditions. A constant shift cannot fix an interval that is the wrong length. Line up the top and the base is out. Line up the base and the top is out. The scan splits the difference and reports a shift that is wrong at both ends.

**Squeeze.** The same failure with the sign reversed, and the same splitting happens.

**Phase rotation.** The wavelet in the seismic is not the wavelet you built the synthetic with. A rotated wavelet moves energy between peaks and troughs and changes where the apparent centre of an event sits. Shifting the synthetic in time cannot undo a rotation in phase, because the two are different operations. The scan will still find the lag that best compensates for part of the effect, and the shift it returns will be a mixture of the real time error and the phase error, with no label telling you how much of each.

**A mis-picked marker.** You believed a formation top on the log corresponds to a particular reflector, and it does not. The tie is then anchored to the wrong event. The scan will happily align the synthetic to whatever it was pointed at. Nothing in the correlation knows which reflector you meant.

In all four cases you get a lag, you get a correlation, and neither one announces the problem.

## Why the correlation does not save you

You might hope a bad model shows up as a bad number. It often does not, and lesson 2 already told you why. Seismic traces are oscillatory and smooth, so partial agreement produces respectable correlations. A stretched synthetic still has most of its events near most of the right reflectors, so the best constant shift still scores well.

It is worth knowing how far down the number could go if things really did disagree. Across all 41 lags in this scan, the lowest correlation anywhere is -0.409277. That is the other end of the range: a lag at which the synthetic sits so badly against the observed trace that peaks are landing on troughs and the correlation goes negative. The scan explores that whole range every time it runs, from -0.409277 up to the peak, and reports only the top of it.

The practical reading is that the correlation has a lot of room in it. A returned value can sit far from the best the pair can achieve and still sound acceptable when quoted alone, which is why the shape of the curve matters more than the single number.

## How to catch these

The scan will not warn you. Your workflow has to.

Look at the whole curve, not the peak. A scan that has two humps of similar height, or flanks that disagree badly in shape, is telling you the two traces do not have one clean relationship.

Check the shift at more than one place. If you can correlate over an upper window and a lower window separately and they want different shifts, that is stretch or squeeze, and no single number will serve. This is the diagnostic that catches the most common real failure.

Look at the traces after you apply the shift. Overlay them and check that events line up across the whole logged interval and not only near the middle. A shift that ties the middle and loses both ends has the signature of an interval error.

Ask whether the result is physically sensible. A large shift on a well with good checkshots deserves an explanation. So does a shift that is small when you had reason to expect a large one.

And keep the model in mind. A bulk shift is the right correction when the whole synthetic is displaced by the same amount, which happens for ordinary reasons such as a datum difference or a reference level mismatch. When the disagreement varies through the section, the honest conclusion is that a bulk shift is the wrong instrument and the time and depth relationship needs work instead.

## Exercise

For each of stretch, phase rotation and a mis-picked marker, write one sentence saying what the scan will return and one sentence saying what evidence in your own workflow would expose it. Then answer: why does the fact that this scan ranges from -0.409277 up to its peak make the reported correlation less informative on its own than it first appears?

As a self-check: in every one of the three cases the scan returns a lag and a correlation that look ordinary, because it can only express a constant shift and will always pick the constant shift that leaves the least disagreement. Stretch is exposed by correlating an upper and a lower window separately and finding they want different shifts, or by overlaying the shifted traces and seeing the ends drift apart while the middle ties. Phase rotation is exposed by comparing the character of events rather than their position, since a shift moves an event without changing its shape and a rotation changes it. A mis-picked marker is exposed by checking the tie against independent geological control. As for the range, the scan explores everything from -0.409277 up to its peak and reports only the top, so a correlation quoted alone tells you where one lag landed without telling you how the alternatives scored, and only the curve carries that.
