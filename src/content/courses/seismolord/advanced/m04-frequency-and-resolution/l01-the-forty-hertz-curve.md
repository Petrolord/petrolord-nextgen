# The forty hertz curve

The capstone asks for the wedge at two frequencies. This lesson runs the second one and reads it against the first. Most of what changes is predictable. One thing that does not change at all is the reason the next two lessons exist.

{{panel:sl-wedge-explorer}}

## The curve

Set the frequency to 40 Hz and step the thickness slider.

| Thickness | 40 Hz | 25 Hz |
| --- | --- | --- |
| 0 ms | 0.00000000 | 0.00000000 |
| 2 ms | 0.03694496 | 0.02427036 |
| 4 ms | 0.07182176 | 0.04683064 |
| 6 ms | 0.09535395 | 0.06826334 |
| 8 ms | 0.10973874 | 0.08428777 |
| 10 ms | 0.11559476 | 0.09975380 |
| 12 ms | 0.10920762 | 0.10806032 |
| 16 ms | 0.08994870 | 0.11559476 |
| 20 ms | 0.08168091 | 0.10669526 |
| 30 ms | 0.08000147 | 0.08313691 |
| 60 ms | 0.08000000 | 0.08000000 |

The tuning thickness is **10 ms**, and it is graded exactly, like the 25 Hz one.

Four differences are visible immediately.

**The peak moved left.** From 16 ms to 10 ms, a factor of 1.6, which is also the ratio of the two frequencies.

**The whole curve is compressed.** Everything happens sooner, on both limbs.

**Isolation arrives earlier.** The 40 Hz curve is within one part in a million of the isolated level by 32 ms, where 25 Hz needs 50 ms. The higher frequency wavelet has a shorter reach, so its two copies stop talking to each other at a smaller separation.

**The peak has the same height.** 0.1155947595834732, to every digit.

## The first three are expected

A higher frequency wavelet is narrower in time. Its main lobe is shorter, its side lobes are closer to the centre and it decays faster. Every one of the first three differences is a restatement of that.

The resolution consequence is the point of the exercise. At 25 Hz the model cannot separate the top and base of a bed thinner than 16 ms. At 40 Hz that limit falls to 10 ms. In bed thickness at the course velocity of 2000 m/s, that is the difference between resolving a 16 m sand and resolving a 10 m sand, and it is bought entirely with bandwidth.

## The fourth is not expected

The peak heights being similar would be unremarkable. A tuning peak is roughly 1.44 times the isolated level for any Ricker, and the isolated level is 0.08 in both runs, so both peaks should land near 0.1157.

They do not land near each other. They land **on** each other. The stored 64 bit values are 0.1155947595834732 and 0.1155947595834732, and a strict equality test between them returns true.

That is far too exact to be a coincidence of two independent calculations. Two separately computed floating point numbers that happen to be close normally differ somewhere in their last few digits. These do not differ anywhere.

Something in the model is producing literally the same arithmetic at 25 Hz and 16 ms as at 40 Hz and 10 ms. The next lesson finds it, and the answer turns out to be the most transferable result in this tier.

## A first clue

Before moving on, look at two more pairs from the table above.

At 25 Hz and 32 ms the model gives 0.08168091. At 40 Hz and 20 ms it gives 0.08168091.

At 25 Hz and 48 ms it gives 0.08000147. At 40 Hz and 30 ms it gives 0.08000147.

So it is not only the peak. Three different thickness pairs give matched amplitudes across the two frequencies, and all three pairs share a property that is visible once you look for it.

$$25 \times 16 = 400 \qquad 40 \times 10 = 400$$
$$25 \times 32 = 800 \qquad 40 \times 20 = 800$$
$$25 \times 48 = 1200 \qquad 40 \times 30 = 1200$$

## Worked example

Predict, without running the model, a 40 Hz thickness whose amplitude will match the 25 Hz amplitude at 24 ms.

The product is $25 \times 24 = 600$, so the matching 40 Hz thickness is $600/40 = 15$ ms. That is not on the 2 ms grid, so the model cannot show it directly; the nearest grid thicknesses at 40 Hz are 14 ms and 16 ms, and the 25 Hz value at 24 ms, 0.09428645, does indeed lie between the 40 Hz values there, 0.09879693 and 0.08994870.

## Exercise

State the ratio of the two tuning thicknesses and the ratio of the two frequencies, then say what the equality of the two ratios implies for a third frequency of 20 Hz. Predict the 20 Hz tuning thickness and check it on the panel.

As a self-check: the tuning thicknesses are 16 and 10 ms, a ratio of 1.6, and the frequencies are 25 and 40 Hz, a ratio of 1.6 the other way, so tuning thickness is inversely proportional to frequency and the product of the two is constant at 400. At 20 Hz the predicted tuning thickness is $400/20 = 20$ ms, which is what the panel reports.
