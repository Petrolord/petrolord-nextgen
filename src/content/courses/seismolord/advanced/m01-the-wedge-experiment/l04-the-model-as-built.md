# The model as built

This lesson is the specification. Everything the tier measures comes out of the arrangement described here, and several results that look strange later are ordinary once you know how the model is laid out. Read it once now and come back to it when a number surprises you.

## The panel

The model builds **31 traces**. The first has a bed thickness of 0 ms and the last has 60 ms, in steps of 2 ms, which is the sample rate. Each trace is an independent run of the same recipe with only the base reflection moved.

Every trace is **91 samples long**, covering 0 to 180 ms of two way time. The length is three times the maximum thickness, which gives the wavelet room to run out at both ends of the trace without being clipped by its edges.

The top reflection sits at sample **30**, which is **60 ms**, one third of the way down the trace. That position is fixed for every trace in the panel. This matters more than it looks: because the top never moves, any change in the time of the peak is a change caused by interference and not by the model sliding the reflection around.

The base reflection sits at sample $30 + T/2$, where $T$ is the thickness in milliseconds. At $T = 0$ the two coefficients land on sample 30 together and cancel exactly. At $T = 60$ the base is at sample 60, which is 120 ms.

## The wavelet

The wavelet is a zero phase Ricker,

$$w(t) = \left(1 - 2\pi^2 f^2 t^2\right)\exp\left(-\pi^2 f^2 t^2\right)$$

sampled at 2 ms with a fixed half length of 60 ms, giving **61 samples spanning 120 ms**. Its centre sample is exactly 1.0 and it is symmetric about that centre. The Associate tier derived it and its side lobes, so the shape should be familiar.

One consequence of the fixed 60 ms half length is worth stating now. The wavelet's span does not shrink when the frequency rises. A 40 Hz Ricker at 2 ms is still 61 samples long; the extra samples simply carry values that have decayed to nearly nothing. Nothing in the model changes length when the frequency changes, so comparisons between frequencies are comparisons of shape alone.

## The convolution

Each trace is built by convolving the two spike reflectivity series with the wavelet, using the same shared routine the Associate tier's synthetic used. Convolution is a sum, so each output sample is the total of every scaled and shifted wavelet copy that reaches it. With only two spikes on the trace, each output sample is the sum of at most two contributions:

$$s(t) = R_{top}\, w(t - t_0) + R_{base}\, w(t - t_0 - T)$$

That expression is worth memorising, because almost every result in this tier is read off it. At the top interface itself, where $t = t_0$, the first term is $R_{top} \times 1$ and the second is $R_{base}$ multiplied by the wavelet's value at a lag of $T$. With the capstone's pair that becomes

$$s(t_0) = 0.08 - 0.08\, w(T)$$

and the whole tuning curve is that one line evaluated at each thickness in turn.

## How the amplitude is measured

The model does not simply read the sample at the top interface. For each trace it searches a **window** around sample 30 and reports the largest absolute value it finds. The half width of that window is the wavelet's peak to trough time in samples, plus one:

$$w_{samples} = \mathrm{round}\!\left(\frac{\sqrt{6}}{2\pi f}\cdot\frac{1000}{2}\right) + 1$$

At 25 Hz that is 9 samples, so the search runs 18 ms either side of the top interface. At 40 Hz it is 6 samples, or 12 ms either side.

The window exists because on thin beds the peak of the composite does not sit at the top interface. It drifts, and module 3 measures the drift. Reading the fixed sample at $t_0$ instead would give a smaller number on exactly the thicknesses where the tuning effect is strongest, which would flatten the interesting part of the curve.

Note also that the search takes the largest **absolute** value. That is why the reported amplitudes are all positive even though the trace has a large trough as well as a large peak.

## Worked example

Take the 25 Hz trace at $T = 20$ ms and predict the amplitude at the top interface by hand.

The Ricker at 25 Hz evaluated at a lag of 20 ms: $x = (\pi \times 25 \times 0.020)^2 = (1.5708)^2 = 2.4674$, so $w = (1 - 2 \times 2.4674)\exp(-2.4674) = (-3.9348)(0.08479) = -0.33369$.

Then $s(t_0) = 0.08 - 0.08 \times (-0.33369) = 0.08 \times 1.33369 = 0.106695$.

The model reports 0.10669526 at 20 ms. The agreement is exact to the precision the model stores, and it will be exact for every thickness at which the peak has not drifted away from the top interface.

## Exercise

Using $s(t_0) = 0.08\,(1 - w(T))$, predict the amplitude of the 25 Hz wedge at $T = 14$ ms, given that the 25 Hz Ricker at a 14 ms lag is $-0.4232714$. Then say why the same calculation would not be trusted at $T = 6$ ms.

As a self-check: $0.08 \times (1 + 0.4232714) = 0.11386171$, which is what the model reports at 14 ms. At 6 ms the calculation would give $0.08 \times (1 - 0.4451737) = 0.04439$, but the model reports 0.06826334, because at that thickness the largest value in the search window is not at the top interface at all; it has moved 4 ms earlier, and the window search finds it there.
