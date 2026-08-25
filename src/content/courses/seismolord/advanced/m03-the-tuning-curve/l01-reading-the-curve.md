# Reading the curve

The tuning curve is the product of this tier. Every graded field except the theoretical one is a reading off it. This lesson treats it as an object in its own right: what its shape is, what each part of it is telling you, and what it does not contain.

{{panel:sl-wedge-explorer}}

## What is plotted

Amplitude on the vertical axis. Bed thickness in two way time on the horizontal. Thirty one points, one per trace in the panel, joined for readability.

Two things are worth being precise about, because both are commonly misread.

The horizontal axis is **true thickness**, the thickness that was built into the model. It is not the thickness anyone measured off the trace. On thin beds the two differ substantially, which is the subject of a later lesson.

The vertical axis is the **largest absolute value near the top interface**, not the value at the top interface. Those coincide on most of the curve and diverge on the thinnest beds. The model searches a window and reports the largest value it finds, so the curve is the envelope of what an interpreter would actually pick.

## The four parts of the shape

**The origin.** The curve starts at exactly zero. Equal and opposite coefficients on the same sample cancel completely. This point requires no measurement and is worth using as a sanity check whenever a wedge is built: if the model does not return zero at zero thickness, the pair is not equal and opposite.

**The thin bed limb**, from 0 to about 6 ms at 25 Hz. Here amplitude is close to proportional to thickness: the model gives 0.02427 at 2 ms, 0.04683 at 4 ms and 0.06826 at 6 ms. The two wavelet copies overlap so heavily that the composite is nearly the difference of two almost identical functions, and the size of that difference scales with how far apart they are. This is the regime where an amplitude can be inverted for thickness, and the only regime where it can.

**The approach to the peak**, from about 6 ms up to 16 ms. Still rising, but no longer proportional: amplitude per millisecond of bed falls from 0.0114 at 6 ms to 0.0072 at 16 ms as the curve flattens toward its apex.

**The tuning peak**, at 16 ms at 25 Hz. The maximum of the curve.

**The falling limb and the tail**, from the peak out to 60 ms. Amplitude decays toward the isolated level of 0.08 and settles onto it. Within one part in a million of 0.08 by 50 ms at 25 Hz.

## What a point on the curve does not tell you

A single point carries an amplitude and nothing else. It does not carry which limb it is on, which is the whole difficulty of using tuning in interpretation.

Given the number 0.09975, the curve offers 10 ms on the rising side and about 22 ms on the falling side, and offers no way to choose. Given 0.0817 it offers something between 7 and 8 ms, and also 32 ms. Given anything above 0.1156 it offers nothing at all, because no thickness produces an amplitude larger than the tuning peak with this pair and this wavelet.

That last case is the most useful of the three. **The tuning peak is a ceiling.** If a real map shows an amplitude well above what the model says is possible for the known reflection pair, then something in the assumptions is wrong: the coefficients are larger than the well suggests, the frequency is higher than assumed, or the bright patch is not this bed at all. A ceiling that is exceeded is a fact rather than an opinion, and it is the most defensible way a wedge model gets used in an argument.

## Reading the panel accurately

Three habits make readings off this panel reproducible.

Set the frequency **before** reading anything, and record it with every number. The curve is a different curve at every frequency.

Read the tuning thickness from the **marker**, not by eye from the plotted line. The line is drawn through 31 points and its apex looks flat over several samples. The marker is placed at the sample the model selected.

Read the isolated level from the **tile**, not from the right hand end of the plotted curve. At 25 Hz the curve at 60 ms is within a rounding error of the isolated level, but at lower frequencies it has not settled by the end of the panel, and reading the last plotted point would then be wrong.

## Worked example

Confirm the ceiling claim at 25 Hz using nothing but the closed form.

At the top interface the composite is $s = 0.08\,(1 - w(T))$, so $s$ is largest where $w(T)$ is most negative. The Ricker's minimum value is $-2e^{-3/2} = -0.446260$, reached at a lag of $\sqrt{6}/(2\pi f)$ which is 15.5939 ms at 25 Hz. The largest amplitude any thickness could produce is therefore $0.08 \times 1.446260 = 0.115701$.

The model's peak is 0.11559476, which is slightly below that ceiling because the 2 ms grid cannot place a sample at 15.5939 ms. Module 5 is about that gap. For now the point is that the ceiling is known in advance from the wavelet and the coefficient alone, with no model run at all.

## Exercise

Using the 25 Hz curve, state what range of amplitudes is consistent with a bed known independently to be thicker than 24 ms, and what range is consistent with a bed known to be thinner than 8 ms. Then say which of those two constraints is more useful in practice and why.

As a self-check: above 24 ms the curve runs from 0.09429 at 24 ms down to 0.08 at the thick end, so amplitudes between about 0.080 and 0.094 are consistent, while below 8 ms the curve runs from 0 up to 0.08429, so amplitudes between 0 and about 0.084 are consistent. The thick constraint is more useful because it is narrow, a band about 18 percent wide, whereas the thin constraint spans everything from nothing to slightly above the isolated level and therefore excludes almost nothing.
