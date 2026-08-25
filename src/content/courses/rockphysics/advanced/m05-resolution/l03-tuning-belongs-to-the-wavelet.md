# Tuning belongs to the wavelet

The tuning thickness does not depend on how strong the reflections are. It depends only on the wavelet. This lesson establishes that, and credits where it was established.

## The demonstration

Run the same wedge with two different reflection pairs.

| pair | tuning thickness | peak amplitude |
| --- | --- | --- |
| +0.1 / -0.1 | 16 ms | 0.1444934457540512 |
| +0.08 / -0.08 | 16 ms | 0.1155947595834732 |

Same thickness, different height. The ratio of the peaks is

$$\frac{0.1444934457540512}{0.1155947595834732} = 1.2499999677728444$$

which is $0.1/0.08 = 1.25$ to the precision the engine stores.

So the tuning curve scales exactly with the size of the reflection coefficients and its shape, including where its maximum sits, does not change at all.

## Where this was established

The Seismolord Expert tier owns this result. It derived the underlying law from a wedge with a $\pm 0.08$ pair, which is the second row of the table above, and showed that the Ricker wavelet depends on frequency and thickness only through their product.

That law is why 25 Hz at 16 ms, 40 Hz at 10 ms and 50 Hz at 8 ms all give the same peak amplitude: their products are all 400 Hz milliseconds.

This tier is not re-deriving it. It is confirming it on a different reflection pair, which is a useful thing to do with a law borrowed from another course: run it on your own fixture and check that it holds.

## The confirmation

At 15, 25, 40 and 50 Hz with the $\pm 0.1$ pair:

| frequency | tuning | peak | product |
| --- | --- | --- | --- |
| 15 Hz | 26 ms | 0.14462600648403168 | 390 |
| 25 Hz | 16 ms | 0.1444934457540512 | 400 |
| 40 Hz | 10 ms | 0.1444934457540512 | 400 |
| 50 Hz | 8 ms | 0.1444934457540512 | 400 |

Three of the four peaks are identical to the last digit, and their products are all exactly 400. The 15 Hz case has a product of 390 and a slightly higher peak, because 390 sits nearer the ideal value of 389.8484 than 400 does.

Everything the Seismolord tier found on a $\pm 0.08$ pair holds here on a $\pm 0.1$ pair, with every amplitude scaled by 1.25.

## Why this is useful

Because it separates two things that a recorded amplitude mixes.

The tuning thickness is a property of the wavelet, so it can be computed from the survey's frequency content without knowing anything about the rocks.

The tuning amplitude is a property of the rocks, scaling directly with the interface reflection coefficient, so once the thickness is accounted for the amplitude still carries rock information.

That separation is what makes a tuning correction possible at all. If the thickness at which tuning occurred depended on the rocks, you could not correct for it without already knowing the answer.

## Reading it off the panel

The frequency control moves the tuning tile and nothing else.

{{panel:rp-avo-explorer}}

Step it through 15, 25, 40 and 50 Hz and watch the tile read 26, 16, 10 and 8. Every reflection coefficient, intercept, gradient and class is unchanged throughout, because reflectivity is a property of the interface and tuning is a property of the wavelet.

Two entirely separate things, on one panel, sharing no inputs.

## Worked example

Use the product law to predict a tuning thickness without running the model.

The law says the peak occurs where $f T \approx 390$ with $f$ in hertz and $T$ in milliseconds.

For a 35 Hz survey: $T = 390/35 = 11.1$ ms.

For a 20 Hz survey: $T = 390/20 = 19.5$ ms.

Neither needs the reflection coefficients, the rocks, or the fluid. A tuning thickness can be quoted from the survey alone, which is why it belongs in a survey's specification rather than in a prospect's.

## Exercise

State what would happen to the tuning thickness and the tuning amplitude if the reservoir's reflection coefficients doubled.

Self check: the tuning thickness would not move at all, staying at 16 ms for a 25 Hz wavelet, because it is set by the wavelet's peak to trough time. The tuning amplitude would double exactly, since the tuning curve scales linearly with the reflection coefficients, as the 1.25 ratio between the two Ekene pairs demonstrates.
