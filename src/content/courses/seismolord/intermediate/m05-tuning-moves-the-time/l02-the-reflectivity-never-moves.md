# The reflectivity never moves

The Associate tier gave you the other half of the picture and you should keep it in one line: the strongest reflection coefficient on the teaching well is 0.017688043415546417 in absolute value at 1582 ms TWT, it carries no frequency label, and it is the same number whether the panel is set to 15, 25 or 40 Hz. Reflectivity is a property of the rock, and the wavelet is a property of the seismic experiment.

This lesson is not about proving that again. It is about what a fixed quantity is worth to you once you are producing numbers other people will use.

## You cannot report a change against a moving target

Every measurement is a comparison, and a comparison needs one end of it to hold still.

The peak of a synthetic does not hold still. Its amplitude and its two-way time both belong to the wavelet you chose, so a statement built only from peaks has nothing anchoring it. If two peak readings disagree you cannot tell from the readings alone whether the rock differs, the processing differs or somebody made an error, because all three produce the same symptom.

The reflectivity holds still. It was fixed before any wavelet was chosen, so it is available as the fixed end of every comparison you want to make. That is the professional use of it, and it is why a tie record that mentions only what was brightest is weaker than one that names a coefficient.

## The only quantity two datasets share

The clearest case is two seismic volumes over the same field, processed at different times to different bandwidths.

The bright events in the first volume belong to the first volume. The bright events in the second belong to the second. Neither set of amplitudes is a property of the rock, so putting them side by side and reading a difference as geology is a mistake, and the same applies to any pick made by following brightness in either one.

The reflectivity computed from the well belongs to neither volume. It came from the sonic and density curves and the time-depth function, none of which know that either survey exists. That is what makes it usable in both. It is the common currency between datasets, between vintages of the same dataset and between two interpreters who happen to be working at different bandwidths.

So when work has to cross a dataset boundary, the reflectivity is the thing that crosses with it. On the teaching well that means 0.017688043415546417 at 1582 ms TWT travels, while 0.1573149710893631 at 1580 ms TWT with a 15 Hz wavelet stays behind with the experiment that produced it.

## The diagnostic in the middle of a tie

The fixed point also earns its keep while you are still working, because it tells you which half of the problem to look at when something disagrees.

If the reflection coefficients are where you expect them and the amplitudes are not what you expected, the discrepancy lives in the wavelet, the bandwidth or the interference between neighbouring coefficients. Editing the logs will not help, and time spent re-reading the sonic is wasted.

If the coefficients themselves have moved, the problem is upstream in the curves or in the time-depth function, and the wavelet is not involved at all.

You can only make that split if you look at both. An interpreter who watches only the convolved trace has one number with rock and wavelet mixed into it and no way to separate them. The reflectivity is the separation, and reaching for it early is what keeps a tie problem from turning into an afternoon of guessing.

## A move in the fixed point is an alarm

Since the value of a fixed point is that you notice when it moves, know what a genuine move means.

The reflectivity changes when the sonic or density curves change, which happens when a null is handled differently, when a despike is applied or when a curve is edited over a washed-out interval. It changes when the unit of the sonic is read differently, which is the failure the Associate tier's quality control lesson drilled. The times attached to it change when the time-depth function changes, which happens when a checkshot is loaded or a different overburden velocity is assumed.

Every one of those is a change to the well or to how the well was read. None of them is a change to the seismic experiment. So if you rebuild a synthetic, find the strongest coefficient somewhere other than 1582 ms TWT and cannot name which of those inputs you altered, you have found a data problem rather than a property of the wavelet, and it is worth stopping for.

## Report the separation, not only the peak

One practical consequence closes the lesson. When you report a peak, report how far it sits from the coefficient it is supposed to represent. On this well that is about 2 ms at 15 Hz, 60 ms at 25 Hz and 64 ms at 40 Hz, all measured against 1582 ms TWT.

That separation is a number your reader cannot compute for themselves from a peak reading alone, and it is the number that tells them whether brightness located the contrast or wandered off it. The next lesson deals with how large the wandering gets.

Open the panel, change the frequency, and confirm that the strongest reflection coefficient stays where it is while the peak does not.

{{panel:sl-shift-explorer}}

## Exercise

Explain in three sentences why the reflectivity, rather than the peak amplitude, is the quantity you would carry from an old seismic volume to a reprocessed one, using the teaching well numbers to make the point concrete. As a self-check: the peak of 0.1573149710893631 at 1580 ms TWT belongs to a 15 Hz wavelet and would be different at any other bandwidth, while the coefficient of 0.017688043415546417 at 1582 ms TWT was computed from the well before any wavelet was chosen and is therefore valid against both volumes. Then say which half of a tie problem you would investigate first if the coefficients were where you expected them but the amplitudes were not, and name two changes that would genuinely move the reflectivity.
