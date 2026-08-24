# Onward to Professional

You can now build a synthetic seismogram from a sonic and a density curve, place it on a two-way time axis, convolve it with a wavelet of your choosing, and read the result critically enough to catch it when it lies. That is the whole of the beginner tier, and it is deliberately only the first third of the workflow. This closing lesson describes what the two tiers above add.

## Professional: aligning the synthetic

The beginner tier stops at the moment the synthetic exists. The Professional tier starts by putting it next to a real trace and asking the question every interpreter eventually has to answer: do these two line up, and how do you know?

The tier works on a controlled version of that problem. The observed seismic it hands you is the 25 Hz synthetic you already built, planted 8 ms late. The lag is known to the engine and hidden from you, which is what makes the exercise honest: there is a right answer to recover.

The method is a cross-correlation scan. Rather than sliding the synthetic by eye until the peaks look aligned, the app shifts it across a range of lags, measures how well the two traces agree at each lag, and reports the best shift together with the strength of that agreement. Applied to the planted case, the scan returns the 8 ms it was given.

The result is small and the lesson behind it is not. A tie is a measurement, with a number and a quality attached, rather than an opinion formed at a display. Two interpreters running the same scan get the same shift; two aligning by eye get two answers and no way to arbitrate between them. Once the tie is a measurement it can be recorded, revisited when the processing changes, and compared against neighbouring wells.

The tier also revisits frequency, using the same summary panel you have been reading. The strongest synthetic amplitude and its position are compared at 15 Hz and at 40 Hz: 0.157315 at 1580 ms against 0.036223 at 1646 ms. Nothing about the rock changed between those runs. Both the size of the peak and where it sits moved because the wavelet moved, which becomes a working caution: an amplitude read off a seismic volume is a joint statement about the geology and the bandwidth of the data.

## Expert: quantifying what can be resolved

The Expert tier goes after the harder question underneath. If the wavelet decides how thin layers appear, what exactly can seismic resolve, and what is it merely hinting at?

The tool is the wedge model. A layer is thinned steadily from thick to zero and the pair of reflections from its top and base is followed as they approach each other. The pair is equal and opposite, a positive coefficient at the top and a negative one of the same size at the base, the classic setup because it isolates the interference effect from any difference in reflection strength.

What emerges is a tuning curve: amplitude against layer thickness. Instead of falling smoothly as the layer thins, the amplitude rises to a maximum at a particular thickness before collapsing. That maximum is the tuning thickness. Below it the two reflections have merged into one event whose amplitude no longer tracks thickness, and a thinning reservoir can appear to brighten rather than fade.

The tier then compares the tuning thickness measured from the modelled curve against the classical theoretical value for a Ricker wavelet, which depends on the dominant frequency alone, and repeats it at more than one frequency to show the resolution limit moving with bandwidth. That comparison is quantitative interpretation in miniature: the model is trusted only because it reproduces something independently known.

## The progression in one line

The three tiers divide the work cleanly:

* Beginner **builds** the synthetic.
* Professional **aligns** it to the seismic.
* Expert **quantifies** what the seismic can and cannot see.

Each tier depends on the one below it. An alignment is worthless if the synthetic it aligns is wrong, which is why the beginner tier spends a whole module on quality control. A resolution study is worthless if the tie is out by a wavelet cycle, which is why the Expert tier assumes a measured shift rather than an eyeballed one.

## Where this sits on the ladder

Beneath this course sits Well Data Manager. Every input used here came from there: the LAS file, the declared null value, the unit conventions in the header, the habit of inspecting a curve before computing on it. The QC lesson in this module was that course's discipline applied to a seismic product.

Above it sit mapping and volumetrics. A tied well turns a seismic horizon into a named geological surface. Enough tied wells turn a set of picks into a structural map, and a map with a closure and a thickness becomes a volume with a number attached, which is what somebody eventually spends money on. Every step of that chain rests on the tie being right.

## Exercise

State in one sentence each what the Professional tier adds and what the Expert tier adds, then explain why the Professional tier plants a known 8 ms lag rather than an unknown one. As a self-check: Professional aligns the synthetic to observed seismic by cross-correlation and examines how frequency moves the peak; Expert models a wedge to find the tuning thickness and checks it against the classical theoretical value; the lag is planted so the scan's answer can be verified against a known truth rather than accepted on trust. Finally, name one thing the Well Data Manager course contributed to the synthetic you built.
