# Apparent thickness has a floor

Amplitude is one way to read thickness off a trace and it has been shown to be ambiguous. The other way is to measure the time between the peak and the trough. This lesson measures what that method actually returns, and finds that it fails in a completely different manner from the amplitude method, which is what makes the two useful together.

## The measurement

For every trace in the panel, take the time of the largest positive value and the time of the largest negative value, and record the difference. Call it the **apparent thickness**, because that is what an interpreter measuring the event on a section would write down.

At 25 Hz:

| True thickness | Apparent thickness |
| --- | --- |
| 2 ms | 14 ms |
| 4 ms | 12 ms |
| 6 ms | 14 ms |
| 8 ms | 12 ms |
| 10 ms | 14 ms |
| 12 ms | 16 ms |
| 14 ms | 14 ms |
| 16 ms | 16 ms |
| 18 ms | 18 ms |
| 20 ms | 20 ms |
| 22 ms | 18 ms |
| 24 ms | 20 ms |
| 26 ms and above | equal to the true thickness |

At 40 Hz the same table reads 10, 8, 10, 8, 10 ms for true thicknesses of 2 to 10 ms, and equals the true thickness from 12 ms onward.

## The three regimes

**Above about 26 ms at 25 Hz the method is exact.** Apparent thickness equals true thickness, sample for sample, all the way to 60 ms. There is no bias to correct and no calibration to apply. This is the regime the method was designed for.

**Between tuning and 26 ms it under reads.** A 22 ms bed measures 18 ms and a 24 ms bed measures 20 ms. The two events are still being pulled toward each other by interference, so the measured separation is a few milliseconds short. The error is modest, it is in one direction, and it is largest just above tuning.

**Below tuning it stops responding.** From 12 ms down to 2 ms the measurement returns 12 to 16 ms whatever the bed does. A 2 ms bed measures 14 ms, seven times its true thickness. The measurement has hit a floor and is now reporting the wavelet rather than the geology.

## Where the floor comes from

Module 3 established that in the thin bed limit the composite becomes a fixed shape centred on the bed midpoint: a peak followed by a trough, symmetric, with a separation that no longer depends on thickness. That separation is the floor.

It can be computed. For a Ricker wavelet the thin bed doublet has its extrema at $\pm 0.5246/(\pi f)$ from the centre, so the separation is

$$\Delta t_{floor} = \frac{1.0493}{\pi f}$$

which is **13.36 ms at 25 Hz** and **8.35 ms at 40 Hz**. The model, restricted to a 2 ms grid, reports 12 or 14 ms at 25 Hz and 8 or 10 ms at 40 Hz, which brackets both figures correctly.

The floor is about 86 percent of the theoretical tuning thickness at any frequency, since both scale as $1/f$. It is a property of the wavelet, exactly like the tuning thickness, and it moves the same way when bandwidth changes.

## Why this pairs well with amplitude

The two methods fail on opposite sides of the tuning thickness.

**Amplitude** is single valued and informative below tuning, where it is close to proportional to thickness, and ambiguous above it.

**Apparent thickness** is exact above tuning and flat below it.

So a reading of both, taken together, is much stronger than either alone. If the apparent thickness comfortably exceeds the floor, the bed is above tuning and the apparent thickness is the answer, with amplitude adding nothing. If the apparent thickness is sitting at the floor, the bed is below tuning, the apparent thickness is worthless, and the amplitude becomes the measurement, read against a wedge calibrated on the local reflection pair.

That pairing is the practical output of this tier and it is what module 6 assembles into a workflow.

## The failure mode to name

A measured apparent thickness at the floor looks like a normal measurement. It has a number, it is repeatable, and it is stable across the whole thin area of a map, which reads as reassuring consistency.

A thin bed of variable thickness therefore maps as a bed of **uniform thickness at about 13 ms**, and the uniformity is an artefact of the wavelet. Any volume calculated from that map is wrong in a way no amount of care in the picking will fix, and the only defence is knowing the floor for the bandwidth in use and refusing to report apparent thicknesses near it as measurements.

## Worked example

A section is picked over a sand at 25 Hz and the peak to trough separation comes out at 13 ms across a wide area, with occasional values of 15 to 16 ms near a well that measured 15 m of sand. What is happening?

The floor at 25 Hz is 13.36 ms, so the widespread 13 ms readings are at the floor and carry no thickness information. The 15 to 16 ms readings near the well are just above the floor and just above the 16 ms tuning thickness at the course velocity, so they are marginally real. The correct report is that the sand is below tuning across most of the area with a thickness that this method cannot resolve, and that only the small area near the well can be measured at all.

## Exercise

State the apparent thickness floor at 15 Hz and at 50 Hz using the formula above, then explain why a survey that improves the dominant frequency from 25 Hz to 50 Hz halves the floor but does not make a 4 ms bed measurable.

As a self-check: at 15 Hz the floor is $1.0493/(\pi \times 15) = 22.3$ ms and at 50 Hz it is 6.68 ms. Doubling the frequency halves the floor because the floor scales as $1/f$, but a 4 ms bed is still below the 6.68 ms floor at 50 Hz, so its peak to trough separation would still report the wavelet rather than the bed; the only change is that the wrong answer becomes 6.68 ms instead of 13.36 ms.
