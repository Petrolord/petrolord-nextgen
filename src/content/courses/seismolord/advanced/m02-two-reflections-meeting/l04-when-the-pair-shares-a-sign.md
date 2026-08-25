# When the pair shares a sign

Everything so far has assumed an equal and opposite pair. This lesson breaks that assumption deliberately, because the result is the sharpest available proof that tuning is a property of the reflection pairing and not a general rule about thin beds.

## The change

Keep everything else identical. Same 25 Hz Ricker, same 2 ms grid, same 31 traces, same top coefficient of $+0.08$. Change only the base coefficient from $-0.08$ to $+0.08$, so that both interfaces reflect with the same polarity.

Geologically this is a sand with shale above it and something harder than the sand below it, such as a cemented interval or a limestone. It is not exotic. It is simply the case where the rock below a bed is not the same as the rock above it.

## What the model does

The tuning curve inverts.

| Thickness | Opposite pair | Same signed pair |
| --- | --- | --- |
| 0 ms | 0.00000000 | 0.15999999 |
| 4 ms | 0.04683064 | 0.14839722 |
| 8 ms | 0.08428777 | 0.11634836 |
| 12 ms | 0.10806032 | 0.07122778 |
| 16 ms | 0.11559476 | 0.04440524 |
| 20 ms | 0.10669526 | 0.05411077 |
| 28 ms | 0.08550713 | 0.07449286 |
| 40 ms | 0.08007754 | 0.07992246 |
| 60 ms | 0.08000000 | 0.08000000 |

Three things have happened, and all three matter.

**The maximum has moved to zero thickness.** With both coefficients positive they land on the same sample at zero thickness and add to 0.16, twice the isolated level. There is no tuning peak anywhere on the curve, because the amplitude only falls as the bed thickens.

**A notch has appeared at 16 ms**, where the amplitude reaches its minimum of 0.04440524. That is 55 percent of the isolated level, so a bed at that thickness is not bright but nearly half invisible.

**The notch is at exactly the same thickness as the peak was.** Sixteen milliseconds is where an opposite pair is brightest and where a same signed pair is dimmest.

## Why the two cases mirror each other

The reason is in the two term sum again. At the top interface the composite reads

$$s(t_0) = R_{top} + R_{base}\, w(T)$$

The only thing that changed is the sign of $R_{base}$, so the second term changed sign and nothing else did. Wherever the opposite pair added, the same signed pair subtracts by the identical amount.

Sixteen milliseconds is the thickness at which $w(T)$ is most negative for a 25 Hz Ricker, a value of $-0.4449$. With $R_{base}$ negative that produces the largest positive contribution available. With $R_{base}$ positive it produces the largest negative one. The special thickness is a property of the **wavelet**. Which way the amplitude moves there is a property of the **pair**.

## What this rules out

Two habits do not survive this lesson.

The first is the belief that thin beds are bright. Thin beds are bright when the pair is opposite, which is the common case for a sand encased in shale, and thin beds are dim when the pair shares a sign. Both are ordinary geology and the interpreter has to know which one is in front of them before reading anything off an amplitude.

The second is the belief that a dim patch on an otherwise bright horizon means the reservoir is absent. On a same signed pair, a dim patch is exactly what a bed at 16 ms produces, and the reservoir there is not absent but at the notch thickness.

## How to tell which case you are in

The reflection pair is not something to guess at from the seismic. It comes from the logs, and the Associate tier's impedance work is where it comes from. Compute the impedance of the encasing rock above, of the bed, and of the rock below, then form both coefficients. If they are opposite in sign, the wedge in this tier applies as it stands. If they share a sign, run the model with the actual pair before reading anything off an amplitude map.

This is one of the strongest arguments for tying a well before mapping amplitudes. Without the tie there is no reliable way to know whether brightness on that horizon means more rock or less.

## Worked example

A sand has an impedance of 6,600,000, the shale above is 5,875,000 and a tight carbonate below is 8,200,000.

Top: $(6{,}600{,}000 - 5{,}875{,}000)/(12{,}475{,}000) = +0.058116$.

Base: $(8{,}200{,}000 - 6{,}600{,}000)/(14{,}800{,}000) = +0.108108$.

Both positive, so this is the same signed case. At 25 Hz this sand is at its brightest when it is absent and at its dimmest at about 16 ms. Mapping brightness over it and calling the bright parts the best reservoir would rank the field upside down.

## Exercise

State, in one sentence each, what sets the thickness at which a same signed pair notches and what sets the direction of the amplitude change at that thickness. Then explain why a well tie is a prerequisite for reading an amplitude map over a bed of unknown encasement.

As a self-check: the notch thickness is set by the wavelet, because it is the lag at which the wavelet's side lobe is most negative, while the direction of the change is set by the relative signs of the two reflection coefficients, because the base term enters the sum multiplied by its own sign. A well tie is the prerequisite because only impedances from logs establish whether the pair is opposite or same signed, and without that the same amplitude map supports two opposite readings of where the best rock is.
