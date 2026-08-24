# Why the two amplitudes match

The capstone asks for the tuning amplitude at 25 Hz and again at 40 Hz, and the two answers are the same digits. Learners who notice usually assume they have made a mistake. This lesson establishes that they have not, separates the two distinct reasons the values agree, and warns against the overgeneralisation that follows most easily from it.

## Reason one: the ideal peak does not depend on frequency

Write the amplitude at the top interface in terms of the product $u = \pi f T$:

$$\frac{s(t_0)}{R_{top}} = 1 - \left(1 - 2u^2\right)e^{-u^2}$$

The maximum of the right hand side is a number. It occurs where the Ricker is most negative, at $u = \sqrt{3/2}$, and the Ricker's value there is $-2e^{-3/2} = -0.4462603$. So the ideal peak is

$$s_{max} = R_{top}\left(1 + 2e^{-3/2}\right) = 0.08 \times 1.4462603 = 0.1157008$$

with no $f$ anywhere in it. **The tuning amplitude of an equal and opposite pair under a Ricker wavelet is genuinely independent of frequency.** Frequency decides the thickness at which the peak occurs. It does not decide the height.

That is the physical half of the answer, and it is the half that transfers. Raising the frequency of a survey does not make a tuned bed brighter. It moves the thickness at which beds are tuned.

## Reason two: the two runs land on the same grid point

The physical argument explains why the peaks are close. It does not explain why they are identical to the last binary digit, because the model does not evaluate the ideal peak. It evaluates the curve at whatever thicknesses the 2 ms grid provides and reports the largest.

At 25 Hz the grid's best offer is 16 ms, giving a product of $25 \times 16 = 400$. At 40 Hz the grid's best offer is 10 ms, giving $40 \times 10 = 400$.

Same product, same value of $u$, same Ricker value, same arithmetic. The two runs are not two similar calculations. They are the **same calculation** performed twice, and floating point arithmetic is deterministic, so the results agree in every bit.

The number they share is

$$0.08 \times \left(1 + 0.4449345\right) = 0.1155947596$$

which is 0.09 percent below the ideal 0.1157008, because a product of 400 is not the ideal 389.8484.

## The tier below already met this without the mechanism

The Associate tier noted that the Ricker's side lobe reads $-0.4449$ at both 25 Hz and 40 Hz while it reads $-0.4463$ at 15 Hz, and described the difference as an artefact of 2 ms sampling. That description was correct and incomplete.

The mechanism is the product rule. At 25 Hz the deepest sampled side lobe is at 16 ms, and at 40 Hz it is at 10 ms, and both have a product of 400, so both report the same wavelet value. At 15 Hz the deepest sampled side lobe is at 26 ms, a product of 390, which is nearer the ideal 389.85 and therefore reports a deeper lobe of $-0.4463$.

This is worth noticing as a habit as much as a fact. A result labelled an artefact in a lower tier is often a mechanism that has not been reached yet.

## The overgeneralisation to avoid

Because the two graded amplitudes agree exactly, it is tempting to conclude that a modelled tuning amplitude is always the same number regardless of frequency. The panel disproves it in one click.

At 15 Hz the model reports a tuning amplitude of **0.1157008037** at 26 ms, which is higher than the 25 Hz and 40 Hz value. At 18 Hz it reports 0.1156614646 at 22 ms. Neither equals 0.1155947596.

The correct statement has two parts, and both parts have to be there:

> The ideal tuning amplitude is frequency independent. A modelled tuning amplitude carries a small error that depends on how close the sample grid lets the model get to the ideal product of 389.85, so modelled values differ slightly from frequency to frequency.

## Worked example

Predict the modelled tuning amplitude at 50 Hz on a 2 ms grid.

The theoretical tuning thickness is $389.8484/50 = 7.80$ ms, so the grid's nearest offer is 8 ms and the product is $50 \times 8 = 400$. That is the same product as the 25 Hz and 40 Hz runs, so the amplitude will be identical: 0.1155947596. The panel confirms it.

## Exercise

Explain, in two sentences, why 20 Hz gives the same tuning amplitude as 25 Hz on this model while 15 Hz does not. Then state whether a survey reprocessed to a higher dominant frequency would show a tuned bed as brighter, and justify the answer from the ideal expression.

As a self-check: 20 Hz tunes at 20 ms and 25 Hz at 16 ms, and both products are 400, so both evaluate the Ricker at the same argument and return the same amplitude, whereas 15 Hz tunes at 26 ms for a product of 390 and therefore evaluates the Ricker somewhere else. A reprocessed survey with a higher dominant frequency would not show a tuned bed as brighter, because the ideal peak amplitude is $R_{top}(1 + 2e^{-3/2})$ with no frequency in it; what would change is which beds are at their tuning thickness, so a different set of locations would be the bright ones.
