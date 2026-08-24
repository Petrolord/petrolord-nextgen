# The impedance log

The previous lesson computed impedance at five depths by hand. The engine does the same thing at every depth, and the result is a curve.

That is a small step mechanically and a significant one conceptually. Up to this point the workflow has been reading curves that a logging tool measured. The impedance log is the first genuinely new curve the workflow creates. It was never recorded downhole, it exists because two measured curves were combined, and it is the property that seismic actually responds to.

## How it is built

The recipe is one multiplication repeated 301 times. For each sample index, take the velocity derived from DT at that depth, take the RHOB value at the same depth, multiply them, and write the result into the same slot of a new array. The teaching log runs from 1500 m to 1650 m at a half metre step, so the impedance log has the same 301 samples on the same depth grid as its inputs.

Two conditions make this legitimate. First, the two curves must be on the same depth grid. Multiplying sample $i$ of one curve by sample $i$ of another only means anything if both samples describe the same piece of rock, and the engine refuses outright when the velocity and density arrays differ in length. Second, both values must be valid at that depth, which the QC section below takes up.

## Reading the shape

Across the teaching log, impedance runs from a minimum of **5436.47** to a maximum of **10624.96** in course units. That maximum is one of the six values the capstone grades.

Take the measure of that range first. The difference between the extremes is a little over 5188, and the maximum is just under twice the minimum. Compare that with the density curve, which varied by a couple of tenths on a base of about 2.2, a spread of well under twenty percent. Velocity is doing most of the work in shaping this log. Density modulates the result rather than driving it, and the previous lesson showed that modulation is enough to matter at individual boundaries.

Now read the curve as a geologist would. Impedance rises where the rock is both faster and denser, which in this section means the tighter, better cemented, lower porosity intervals. It falls in the slower, less dense intervals, which are the more porous and less compacted ones. A high impedance excursion and a tight streak are usually the same observation in two vocabularies.

The important reading, though, is not where the curve is high or low. It is where it JUMPS. Scan the log for places where neighbouring samples differ sharply, because those are the interfaces. A long smooth ramp from one impedance level to another produces very little reflected energy no matter how large the total change. A step of the same size compressed into one sample interval produces a strong one. Module 4 turns each adjacent-sample difference into a reflection coefficient, and the largest jumps in this log become the largest coefficients in that series.

Everything the synthetic will show is already latent in this curve. The wavelet, which arrives in module 5, only blurs and shapes what the impedance contrasts have already decided.

## The QC point

Impedance is a product, and a product is only as good as both of its factors. A null in DT or in RHOB at some depth means there is no impedance value at that depth. The engine carries the gap through rather than inventing a value: where either input is a null, a non-finite number, or a non-positive value, the output impedance is a gap too. Nothing is interpolated across the hole and nothing is filled with a default.

That policy is deliberate and it is the right one. An invented impedance value creates an invented contrast against its neighbours, which creates an invented reflection coefficient, which puts a reflector in the synthetic that does not exist in the rock. Better an honest gap that shows on the display as a break in the pen.

The same logic applies to spikes. A single bad density reading, a cycle skip on the sonic, or a washout artefact does not stay local. It becomes an impedance spike, and because module 4 works on differences between neighbouring samples, one bad sample creates two false reflection coefficients, one on the way in and one on the way out. The engine offers an optional three point median despike for this, replacing a sample with the median of itself and its two neighbours wherever all three are valid and leaving the first and last samples untouched. It is a mild filter and no substitute for looking at the input curves.

This is where the null discipline from the Well Data course pays off. Every null you identified during import is a place where the impedance log will correctly say nothing, instead of a curve that looks continuous and is quietly fictional in places.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

Using the range above, work out the difference between the maximum and minimum impedance in the teaching log, and express the maximum as a multiple of the minimum. Then say in one sentence why the maximum value matters less to a synthetic than the largest jump between neighbouring samples does.

Self-check: the difference is $10624.96 - 5436.47 = 5188.49$, and the ratio is $10624.96 / 5436.47 = 1.954$, so the maximum is a little under twice the minimum. The maximum matters less because reflections are produced by contrast between adjacent layers, so a high absolute impedance surrounded by similarly high values reflects nothing, while a modest impedance next to a very different one reflects strongly.
