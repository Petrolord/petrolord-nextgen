# Thinning past isolation

The wedge has been read from the thick end, where one reflection stands alone at 0.08. This lesson walks the thickness down and watches what the amplitude does. The direction it moves is the reason this tier exists.

{{panel:sl-wedge-explorer}}

## The walk down

Set the frequency to 25 Hz and step the thickness slider from 60 ms toward zero, reading the amplitude at each stop.

| Thickness | Amplitude | Relative to isolated |
| --- | --- | --- |
| 60 ms | 0.08000000 | 1.000 |
| 40 ms | 0.08007754 | 1.001 |
| 32 ms | 0.08168091 | 1.021 |
| 26 ms | 0.08907417 | 1.113 |
| 22 ms | 0.10089387 | 1.261 |
| 18 ms | 0.11249567 | 1.406 |
| 16 ms | 0.11559476 | 1.445 |
| 14 ms | 0.11386171 | 1.423 |
| 10 ms | 0.09975380 | 1.247 |
| 6 ms | 0.06826334 | 0.853 |
| 2 ms | 0.02427036 | 0.303 |
| 0 ms | 0.00000000 | 0.000 |

The bed gets thinner all the way down that column. The amplitude rises for most of it.

That is the tuning effect stated as plainly as it can be stated. Between 60 ms and 16 ms, **every step that removes rock makes the event brighter**, and at 16 ms the bed produces an amplitude 44.5 percent larger than the same interface produces when the bed is thick.

## Why the amplitude rises

The mechanism is in the two term sum. At the top interface the trace holds $0.08 \times 1.0$ from the top reflection plus $-0.08 \times w(T)$ from the base reflection, where $w(T)$ is the wavelet's value at a lag equal to the bed thickness.

The Ricker is positive near its centre and **negative** everywhere beyond its first zero crossing. That crossing is at $\pi f T = \sqrt{1/2}$, which at 25 Hz is 9.0 ms. So for every thickness above 9 ms, $w(T)$ is negative, $-0.08\,w(T)$ is positive, and the base reflection is adding to the top reflection rather than subtracting from it.

That is the whole of it. The base reflection is negative and the wavelet's side lobe is negative, and two negatives make a positive contribution. The two reflections are opposed in the earth and cooperative on the trace, over exactly the range of thicknesses where a real reservoir sand tends to sit.

The contribution does not keep growing, because the side lobe decays as the lag increases. It is largest where the side lobe is deepest, at a lag of about 15.6 ms, and that is where the curve turns over.

## Where it turns over the other way

Below 9 ms at 25 Hz the wavelet's value at lag $T$ is positive, because the lag is now inside the wavelet's main peak. The base contribution flips sign and starts subtracting. From there the amplitude falls steeply, reaching zero at zero thickness where the cancellation is exact.

So the curve has two regimes with completely different behaviour and the same appearance on a map.

**Above tuning**, thinner is brighter. Amplitude carries a weak inverse signal about thickness, contaminated by the fact that it also carries reflection strength.

**Below tuning**, thinner is dimmer, and the fall is fast. In this regime the amplitude is close to proportional to thickness: at 25 Hz the model gives 0.02427 at 2 ms, 0.04683 at 4 ms and 0.06826 at 6 ms, so amplitude per millisecond of bed runs 0.01214, 0.01171 and 0.01138. That near proportionality is the basis of the classic thin bed amplitude method, and it works only if you already know you are below tuning.

## The interpretation trap in one sentence

An amplitude map over a bed near tuning ranks locations by how close each one is to the tuning thickness, not by how much rock is there.

Consider two locations in the same field with the same rock properties, one with a 16 ms bed and one with a 32 ms bed. The thin one maps at 0.1156 and the thick one at 0.0817. The map says the thin location is 41 percent better. The rock says it has half as much reservoir. Every number in that comparison is correct and the conclusion drawn from the map is exactly backwards.

## Worked example

A prospect maps at an amplitude of 0.1025 on a survey whose wavelet is close to 25 Hz, and the encasing shale and reservoir sand are known from a nearby well to give a reflection pair of about $\pm 0.08$. What thicknesses are consistent with the map?

Read across the 25 Hz curve for 0.1025. The rising side passes 0.1025 at about 10.5 ms, and the falling side passes it again between 20 and 22 ms. Both are consistent, they differ by roughly a factor of two in rock volume, and the amplitude cannot separate them. Any decision made on that map alone is a coin toss dressed as a measurement.

## Exercise

Using the table above, state the two thicknesses at which the 25 Hz wedge produces an amplitude close to 0.0891, and say which of the pair a mapper is more likely to assume. Then state what one additional measurement would resolve the pair, and why it works.

As a self-check: 0.08907417 occurs at 26 ms on the falling side, and the rising side passes the same value between 8 and 10 ms, so the two candidates are roughly 9 ms and 26 ms. A mapper is more likely to assume the thicker one, because assuming that a bright amplitude means more rock is the default habit. The resolving measurement is the peak to trough separation on the trace, which equals the true thickness above tuning and sticks near a floor below it, so a separation of 26 ms confirms the thick case while a separation near 12 to 14 ms says the bed is somewhere below tuning without saying where.
