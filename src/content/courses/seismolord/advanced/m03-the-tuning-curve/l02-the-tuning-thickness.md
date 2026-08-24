# The tuning thickness

Two of the six capstone fields are tuning thicknesses, and both are graded with a tolerance of zero. This lesson is about what the model does to produce them, what the number means, and why an exact grade is the right choice rather than a harsh one.

{{panel:sl-wedge-explorer}}

## How the model finds it

There is no curve fitting and no interpolation. The model holds 31 amplitudes, one per trace, and walks them:

> start at the first, and step forward keeping the index of the largest value seen so far.

The index that survives is multiplied by the 2 ms sample interval, and that is the tuning thickness. At 25 Hz the winner is index 8, so the answer is 16 ms. At 40 Hz it is index 5, so the answer is 10 ms.

Two properties of that procedure are worth noticing. It returns a value **on the grid**, always an even number of milliseconds, because the only candidates are the thicknesses that were modelled. And on a tie it keeps the **first** maximum, because the comparison is strictly greater than. No tie occurs at either capstone frequency, but knowing the rule matters if you ever build a wedge whose curve is flat near its apex.

## Why the tolerance is zero

The capstone grades both tuning thicknesses exactly. There is no partial credit for 14 or 18.

That is not severity, it is the nature of the quantity. The answer is the identity of a sample, and a sample either is the maximum or is not. Allowing plus or minus 2 ms would allow three different samples to count as correct, which would be equivalent to not asking the question. Compare it with the amplitude fields, which are continuous quantities read to many decimal places and are graded to 0.002 because the last digits depend on floating point storage.

The practical consequence is that this field is failed by reading the chart rather than the tile. The plotted apex looks flat: 0.11386 at 14 ms, 0.11559 at 16 ms and 0.11250 at 18 ms differ by about 1.5 percent, which is invisible at chart scale. The tile carries the model's own answer.

## What the number means

Sixteen milliseconds is a two way time thickness. To turn it into rock you need a velocity, and this course has one: the Associate tier fixed a 2000 m/s overburden, which makes two way time and depth numerically equal, so **1 ms of two way time is 1 m of bed**.

At that velocity the 25 Hz tuning thickness of 16 ms is a bed 16 m thick, and the 40 Hz tuning thickness of 10 ms is a bed 10 m thick. A 25 Hz survey over this section therefore cannot separate the top and base of any bed thinner than about 16 m, and every such bed will map brighter than its rock volume deserves.

That is a survey design statement, and it is the main commercial use of this number. It is also the reason the velocity must travel with the answer. The same 16 ms is 24 m of bed at 3000 m/s and 32 m at 4000 m/s. A tuning thickness quoted in metres without its velocity is not a fact about anything.

## Frequency moves it, coefficients do not

Run the panel at 15, 20, 25, 40 and 50 Hz and record the tuning thickness at each: 26, 20, 16, 10 and 8 ms. The thickness falls as the frequency rises, roughly in inverse proportion.

Now change the reflection pair instead. Whatever opposite signed pair you use, at 25 Hz the tuning thickness stays at 16 ms. A pair of $\pm 0.08$ gives 16 ms, a pair of $+0.08$ and $-0.05$ gives 16 ms, and a pair of $+0.08$ and $-0.02$ gives 16 ms. Only the height of the peak changes.

The reason is the closed form. At the top interface the composite is $R_{top} + R_{base}\,w(T)$, and the thickness that maximises it is the thickness that maximises $|w(T)|$, which involves the wavelet and nothing else. The coefficients scale the curve. The wavelet positions it.

Say it as a sentence you would defend in a meeting: **the tuning thickness belongs to the wavelet, the tuning amplitude belongs to the rock.**

## Worked example

A survey is expected to deliver a dominant frequency of 30 Hz over a target whose interval velocity is 3200 m/s. Estimate the tuning thickness in metres, and state what it means for a 14 m target.

The theoretical tuning thickness in two way time is $\sqrt{6}/(2\pi \times 30) = 0.012995$ s, or 12.99 ms. Converting to bed thickness at 3200 m/s: $12.99 \times 10^{-3} \times 3200 / 2 = 20.8$ m.

A 14 m bed is well below that, so its top and base will not be separable and its amplitude will sit on the rising limb, where brightness tracks thickness. Amplitude can be used to map relative thickness variation across the field, and cannot be used to claim the bed is thick anywhere.

## Exercise

The panel reports a tuning thickness of 20 ms at 20 Hz and 8 ms at 50 Hz. Show that these are consistent with an inverse relationship, then state what tuning thickness you would predict at 100 Hz and why that prediction should be treated cautiously on this particular model.

As a self-check: 20 Hz times 20 ms is 400 and 50 Hz times 8 ms is 400, so the product is constant and the thickness is inversely proportional to frequency. At 100 Hz the same product predicts 4 ms. It should be treated cautiously because the model samples at 2 ms, so a 4 ms answer rests on only two samples either side of it and the grid is far too coarse to locate a maximum of that width reliably.
