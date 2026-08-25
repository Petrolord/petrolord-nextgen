# One curve in disguise

The matched amplitudes at the end of the last lesson are not a numerical accident. They follow from a property of the model that is worth stating as a law, because once you have it you can predict any frequency's tuning behaviour from any other frequency's, without running anything.

{{panel:sl-wedge-explorer}}

## The derivation

Start from the composite at the top interface:

$$s(t_0) = R_{top} + R_{base}\,w(T)$$

Everything that depends on frequency is inside $w(T)$, the Ricker evaluated at a lag equal to the bed thickness. Write the Ricker out:

$$w(T) = \left(1 - 2x\right)e^{-x}, \qquad x = \left(\pi f T\right)^2$$

Look at what $f$ and $T$ do in that expression. They appear **only as the product** $fT$, squared. There is no other appearance of either one. The wavelet does not know the frequency and the thickness separately; it knows their product and nothing else.

So the composite amplitude, divided by the reflection coefficient to remove the only other scale in the problem, is a function of one variable:

$$\frac{s(t_0)}{R_{top}} = 1 - \left(1 - 2u^2\right)e^{-u^2}, \qquad u = \pi f T$$

There are not two tuning curves in this tier. There is **one** curve, and frequency decides where along it the 2 ms grid happens to land.

## What the law predicts

Three consequences, each checkable on the panel.

**The tuning thickness times the frequency is a constant.** The maximum of the curve occurs at one particular value of $fT$, so if $f$ doubles then $T$ halves. The model gives 26, 20, 16, 10 and 8 ms at 15, 20, 25, 40 and 50 Hz, and the products are 390, 400, 400, 400 and 400.

**Equal products give equal amplitudes.** Any two combinations of frequency and thickness whose product agrees produce the same amplitude, whatever the individual values are.

**The theoretical tuning product is fixed.** The exact maximum of the continuous curve is at $fT = 1000\sqrt{6}/(2\pi) = 389.8484$ in units of Hz times milliseconds. Every frequency has its theoretical tuning thickness at that same product.

## Why 15 Hz breaks the pattern and is the most useful case

Four of the five frequencies on the panel give a product of exactly 400. Fifteen hertz gives 390, and its tuning amplitude is 0.1157008037 rather than 0.1155947596.

Nothing has gone wrong. The law says the amplitude depends on the product, and 390 is a different product from 400, so a different amplitude is correct.

What is interesting is which one is **larger**. The ideal product is 389.8484, and 390 is far closer to it than 400 is. So the 15 Hz run, by pure luck of where its grid samples fall, gets nearer to the true maximum of the curve than any of the other four, and reports a slightly higher peak.

That is the cleanest demonstration available that the curve is continuous and the model is a sampling of it. It also shows that a modelled tuning amplitude carries a small, frequency dependent, grid dependent error, which is the subject of module 5.

## Reading the tile

The panel has a tile reporting frequency times tuning thickness in Hz times ms. It is there for this lesson. Cycle the frequency through all five values and watch it read 390, 400, 400, 400, 400.

A learner who has understood this tier can predict the entire behaviour of a wedge at any frequency from that single number and the shape of one curve. A learner who has not will run the model again for every new frequency and read the answers off one at a time.

## Worked example

A processing report promises a dominant frequency of 32 Hz. Predict the tuning thickness in two way time, the tuning amplitude for a $\pm 0.08$ pair, and the bed thickness that corresponds to at an interval velocity of 2600 m/s.

The theoretical product is 389.8484, so the tuning thickness is $389.8484/32 = 12.18$ ms. On a 2 ms grid the model would report 12 ms, giving a product of 384. The tuning amplitude is close to the ideal $0.08 \times 1.446260 = 0.115701$, slightly reduced because 384 is not 389.85. In bed thickness at 2600 m/s, 12.18 ms of two way time is $12.18 \times 10^{-3} \times 2600/2 = 15.8$ m.

Everything in that answer came from one constant and one velocity, with no model run at all.

## Exercise

Using the constant product rule with the ideal value of 389.8484, compute the theoretical tuning thickness at 18 Hz and at 45 Hz. Then state what would happen to the products reported by the panel if the model's sample rate were changed from 2 ms to 1 ms.

As a self-check: at 18 Hz the theoretical tuning thickness is 21.66 ms and at 45 Hz it is 8.66 ms. A 1 ms sample rate would let the model land on odd millisecond thicknesses too, so in general the reported products would sit closer to 389.85 rather than clustering on 400. At 25 Hz specifically nothing would change: the candidates are 15 ms with a product of 375 and 16 ms with a product of 400, and 16 is the nearer of the two to 15.594, so the model still reports 16 ms and the same amplitude.
