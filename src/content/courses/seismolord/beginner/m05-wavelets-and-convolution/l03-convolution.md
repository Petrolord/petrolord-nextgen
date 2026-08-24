# Convolution

You now have both halves of the model: a reflection coefficient series on the two millisecond grid from module 4, and a 61 sample Ricker wavelet from the previous lesson. Convolution is the operation that turns those two into a synthetic trace.

## The operational recipe

The formal definition of convolution is a sum of products with one index running backwards, and it is easy to lose the physics inside the algebra. So learn it as a recipe first. To convolve a reflectivity series with a wavelet:

1. Take the first nonzero reflection coefficient. Note its time and its value.
2. Lay down a copy of the wavelet centred on that time, with every sample of the wavelet multiplied by the coefficient.
3. Repeat for every other reflection coefficient in the series, each one getting its own scaled copy at its own time.
4. Add all the copies together, sample by sample, on the common time grid. The result is the synthetic trace.

That is convolution, complete. It is often summarised as *replace every spike with a scaled copy of the wavelet and sum*, and the summary is exact rather than approximate.

Two details in step 2 do real work. **Scaled** means the whole wavelet is multiplied by the coefficient, so a coefficient of 0.01 produces a copy whose peak is 0.01 and whose side lobes are about $0.01 \times (-0.4449)$ at 25 Hz, roughly $-0.0044$. Small coefficients make small events; the shape is identical. **Flipped where the coefficient is negative** means a negative coefficient turns the copy upside down: the central peak becomes a central trough, and the two negative side lobes become positive ones. Nothing about the wavelet changes, only its sign, which is exactly the polarity convention from module 4 carried into the trace.

Written compactly, the trace $s$ at sample $i$ is

$$s_i = \sum_j w_j \, r_{i - j}$$

with $w$ the wavelet indexed from its centre and $r$ the reflectivity. The formula and the recipe are the same statement; the recipe is easier to reason about.

## What the engine actually does

The app follows the recipe directly. Reflectivity and wavelet go in, and a trace of the same length as the reflectivity series comes out, which is why the operation is described as a *same-length* convolution. The wavelet's centre sample is treated as zero lag, which is what makes the odd 61 sample length necessary. Samples with no data, the nulls outside the logged interval, are treated as zero for the purpose of the sum while still being flagged as having no input of their own. That flag is why the displayed synthetic breaks its pen outside the logged interval even though the arithmetic produced numbers there: those numbers are smear from neighbouring real reflections, not measurements.

## Three consequences

**An isolated reflection appears as a clean wavelet.** If a reflection coefficient has no neighbours within a wavelet length, nothing overlaps its copy, and the trace shows the wavelet shape exactly, scaled by the coefficient. Peak amplitude equals the coefficient and peak time equals the interface time. This is the easy case, and the one textbook figures usually show.

**Adjacent reflections overlap and add.** Once two coefficients sit closer together than the wavelet is long, their copies land on shared samples. The side lobe of one falls on the peak of the other, or two peaks fall together, and the trace records the sum. In this course the wavelet spans 120 ms while the entire logged interval of the teaching well runs from 1500 ms to 1650 ms, a window of 150 ms. Overlap is therefore not an exception in this data. It is the normal condition.

**Every amplitude in the trace is a sum, not a measurement.** This is the sentence to carry forward. When you read a value off the synthetic at some time, you are not reading the strength of the reflection at that time. You are reading the total of every wavelet copy that reaches that sample: the local reflection's own contribution, plus a side lobe from a reflection a few tens of milliseconds above it, plus a shoulder from another below it, and so on, each carrying its own sign.

## The point that sets up the capstone

Follow that third consequence to its conclusion. If amplitude at any time is a sum of contributions from many reflections, then nothing guarantees that the largest total lands where the largest single contribution lands.

A cluster of several moderate coefficients, spaced so that their peaks and side lobes reinforce one another, can produce a larger sum than one isolated strong coefficient does on its own. When that happens, the time of the strongest amplitude in the synthetic is not the time of the strongest reflection coefficient.

That is not a hypothetical. It is what the teaching well does, and lesson 5 names the two times where it happens. For now it is enough to explain, from the recipe alone, why such a mismatch is possible and not a sign that something went wrong.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

A reflectivity series has a single coefficient of $-0.02$ at 1600 ms and nothing else within 200 ms. Using a 25 Hz Ricker, describe the trace around 1600 ms: what is at 1600 ms, and what sign are the events on either side of it?

As a self-check: the copy is the wavelet flipped and scaled by 0.02, so 1600 ms carries a trough of amplitude $-0.02$, flanked by two positive side lobes of about $0.02 \times 0.4449$, which is roughly $0.0089$ each. Because the reflection is isolated, no summing occurs and the peak time matches the interface time exactly. Then state in one sentence what would change if a second coefficient of $+0.02$ were added at 1620 ms.
