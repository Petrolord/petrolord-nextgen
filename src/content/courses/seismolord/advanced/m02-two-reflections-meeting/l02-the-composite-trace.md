# The composite trace

Before the tuning curve can be read, the trace behind each of its points has to be understood. This lesson takes one trace apart and finds a symmetry in it that explains several later results at once.

## The two term sum

With only two reflections on the trace, the composite is

$$s(t) = R_{top}\, w(t - t_0) + R_{base}\, w(t - t_0 - T)$$

Two scaled copies of the same wavelet, one at the top interface and one $T$ milliseconds below it. For the capstone's pair, $R_{base} = -R_{top}$, so

$$s(t) = 0.08\left[w(t - t_0) - w(t - t_0 - T)\right]$$

A difference of two copies of the same symmetric function, offset from each other by $T$.

## The symmetry that follows

A difference of that form has a property worth stating carefully. Let $m = t_0 + T/2$ be the **midpoint of the bed**, halfway between the two reflections in time. Because the Ricker is symmetric about its own centre, $w(m + u - t_0) = w(t_0 + T/2 + u - t_0) = w(T/2 + u)$ and $w(m + u - t_0 - T) = w(u - T/2) = w(T/2 - u)$. Subtracting them gives

$$s(m + u) = 0.08\left[w(T/2 + u) - w(T/2 - u)\right] = -s(m - u)$$

The composite is **antisymmetric about the midpoint of the bed**. Whatever it does above the midpoint, it does in mirror image and with the opposite sign below it.

Three consequences fall straight out, and none of them need any further calculation.

**The trace is exactly zero at the midpoint.** Setting $u = 0$ gives $s(m) = -s(m)$, so $s(m) = 0$.

**The peak and the trough are equal in size.** They sit at mirrored positions, so their values differ only in sign.

**The apparent thickness is centred on the bed.** The peak sits as far above the midpoint as the trough sits below it, whatever the true thickness is.

## Reading it off the model

Take the 25 Hz trace at $T = 16$ ms, so the top is at 60 ms, the base at 76 ms and the midpoint at 68 ms.

| Time | Amplitude |
| --- | --- |
| 56 ms | 0.08486944 |
| 58 ms | 0.10669428 |
| 60 ms | 0.11559476 |
| 62 ms | 0.10806032 |
| 64 ms | 0.08372938 |
| 66 ms | 0.04570305 |
| 68 ms | 0.00000000 |
| 70 ms | -0.04570305 |
| 72 ms | -0.08372938 |
| 74 ms | -0.10806032 |
| 76 ms | -0.11559476 |
| 78 ms | -0.10669428 |
| 80 ms | -0.08486944 |

Every prediction holds. The sample at 68 ms is exactly zero, the peak at 60 ms and the trough at 76 ms are 0.11559476 apart in sign only, and the whole table reads the same forwards and backwards with the sign flipped.

Notice also that the zero at the midpoint is a **real zero on a real trace**, not an absence of data. An interpreter looking at this event sees a peak, a zero crossing, and a trough. The zero crossing is the most stable feature of the three, and on thin beds it is often the only one that stays where the geology is.

## Where the picks go

That last point deserves the emphasis. On this trace three candidate picks are available for the top of the bed: the peak at 60 ms, the zero crossing at 68 ms and the trough at 76 ms. Only one of them is at the top of the bed. The zero crossing marks the bed's midpoint, and the trough marks its base.

At 16 ms thickness the three are still 8 ms apart from each other and the peak is genuinely at the top interface. The next lesson thins the bed further and the peak stops being where the top is, which is when picking on a peak starts to cost time as well as amplitude.

## Worked example

Take the 25 Hz trace at $T = 4$ ms. The top is at 60 ms, the base at 64 ms, and the midpoint at 62 ms. Predict the sample at 62 ms and check the symmetry at 56 ms and 68 ms.

The model gives 0.00000000 at 62 ms, exactly as antisymmetry requires. At 56 ms it gives 0.04683064 and at 68 ms it gives $-0.04683064$, which are 6 ms either side of the midpoint and are mirror images. The peak of this trace sits at 56 ms, which is **4 ms above the top interface**, and the trough at 68 ms, which is 4 ms below the base. The event has spread outward while the bed has thinned.

## Exercise

For the 25 Hz trace at $T = 2$ ms the peak is 0.02427036 at 54 ms. Using antisymmetry alone, state the time and value of the trough, then state the apparent thickness that a peak to trough measurement would report and compare it with the true thickness.

As a self-check: the midpoint is at 61 ms, so the trough sits 7 ms below it at 68 ms with a value of $-0.02427036$. The peak to trough separation is 14 ms while the bed is 2 ms thick, so an apparent thickness measured this way overstates the bed by a factor of seven, and no amount of care in picking would improve it because the waveform genuinely has that shape.
