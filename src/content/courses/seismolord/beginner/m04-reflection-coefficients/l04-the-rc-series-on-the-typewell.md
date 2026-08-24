# The RC series on the teaching well

One formula applied once gives one number. Applied all the way down a log, it gives a **reflectivity series**: one impedance curve in, one reflection coefficient per interface out. That series is the earth's half of the convolutional model, and building it is the last step before a wavelet enters the picture.

## Differencing turns a log into a series

The engine works on the impedance curve *after* it has been resampled onto the seismic time grid, so on the teaching well the samples sit 2 ms apart. It then walks down that curve and, for each sample, differences it against the sample immediately above using the formula from lesson 2.

Two structural details follow directly from that description. First, the output has one value per interface, and an interface needs two samples to exist, so the very first sample of the series has no value at all: there is nothing above it to difference against. Second, "interface" here means the gap between two adjacent grid samples, not a geological contact you have picked. The engine has no idea where the layer boundaries are. It differences everything and lets the numbers decide which interfaces matter.

The result is a spiky-looking curve that is mostly close to zero, with a scattering of larger values where impedance changes fastest. It is the infinite-bandwidth ideal that module 5 will blur into something recordable.

## The strongest reflection on basic_20

On the teaching well the largest reflection coefficient in the whole series is **0.017688 in absolute value**, and it is **negative** in sign, so impedance drops downward across that interface. It sits at **1582 ms**, which under this course's teaching time to depth function is also **1582 m**, since the function is set up so that milliseconds and metres coincide on this well.

Both of those numbers are capstone answers. The magnitude 0.017688 and the location 1582 are what the exercise asks for, so it is worth being able to reproduce them rather than recall them: they come from differencing 7702.20 at 1582 m against 7979.58 at 1580 m, which is the arithmetic worked step by step in lesson 2.

## Reading the neighbourhood

A single extreme value in any series should make you suspicious. A noise spike, a bad density sample or a hiccup in the sonic each produces one large coefficient with ordinary values on either side of it, so check the neighbours before you believe the peak.

Here are the reflection coefficients at five consecutive grid samples through the event:

| TWT (ms) | Reflection coefficient |
| --- | --- |
| 1578 | -0.017366 |
| 1580 | -0.017629 |
| 1582 | -0.017688 |
| 1584 | -0.017538 |
| 1586 | -0.017238 |

Every value in that 8 ms window is negative, and every one is within a whisker of the peak. The largest magnitude, 0.017688, exceeds the smallest in the window, 0.017238, by only 0.000450, which is about 2.5 percent of the peak. The step from 1580 to 1582 changes the coefficient by just 0.000059. The values rise smoothly to the maximum and fall smoothly away from it.

That is the signature of a real feature. A spike would show one outlying value with neighbours several times smaller; this shows a broad, coherent, single-signed shoulder of softening impedance with a well defined crest. The pick at 1582 ms is the crest of a genuine event, not an artefact, and you can say so with evidence rather than assertion.

Most of the rest of the series is much weaker than this. That is what makes 0.017688 the answer to "which is the strongest": not that it is a large number in absolute terms, since a few hundredths is unremarkable in a clastic section, but that nothing else on this well reaches it.

## Gaps stay gaps

Logs have holes in them. Curves start and stop, tools wash out, and the time to depth function only covers part of the hole. The engine's policy across the whole chain is consistent, and it is the right one: **a gap produces a gap, never a zero.**

If either impedance sample of a pair is missing, the reflection coefficient for that interface is left as no-data rather than being set to zero. The same holds one step earlier, when impedance is resampled onto the time grid: samples outside the interval the time to depth function actually covers, or samples bracketed by missing values, come through as no-data.

The distinction is not pedantic. Zero is a real, meaningful reflection coefficient, and it means "these two rocks have matching impedance, so nothing reflects here". No-data means "we do not know what happens here". Filling holes with zeros would quietly manufacture the claim that a run of interfaces is acoustically transparent, and that claim would then be convolved with a wavelet and displayed as if it had been measured. In the app, no-data intervals break the pen rather than drawing a flat line.

## What happens next

The series built in this lesson is exactly the input module 5 needs. Convolving it with a wavelet replaces each coefficient with a scaled, signed copy of that wavelet and adds the copies where they overlap, which produces the synthetic trace. Everything the synthetic knows about the rocks, it knows from this series.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

Using the neighbourhood table, work out the average magnitude of the five coefficients listed and compare it against the peak, then say what a noise spike would have looked like instead. As a self-check: the five magnitudes sum to 0.087459 and the average is 0.017492, which is about 1.1 percent below the peak of 0.017688, confirming a broad crest rather than an isolated outlier; a noise spike would show a single value far above neighbours that sit near the background level of the series, and the neighbours would often differ in sign. Then state what value the series carries at an interface where one of the two impedance samples is missing, and why that value is not zero.
