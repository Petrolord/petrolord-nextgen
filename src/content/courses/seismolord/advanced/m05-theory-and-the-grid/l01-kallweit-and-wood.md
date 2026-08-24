# Kallweit and Wood

Five of the six capstone fields are read off the model. The sixth is calculated, and it exists so that the model can be checked against something the model had no part in producing. This lesson derives it.

## The classical result

Kallweit and Wood published the result in 1982 that the tuning thickness of an equal and opposite reflection pair equals the **peak to trough time of the wavelet**, and that for a Ricker wavelet that time is

$$T_{tune} = \frac{\sqrt{6}}{2\pi f}$$

At 25 Hz that is 15.593936024673521 ms, which is the capstone's sixth field, graded to 0.05 ms.

Two parts of that statement deserve separate attention. The first is the general claim, that tuning happens at the wavelet's peak to trough time whatever the wavelet is. The second is the specific evaluation for a Ricker.

## Why tuning is at the peak to trough time

The composite at the top interface is $R_{top} + R_{base}\,w(T)$, and for an opposite pair that is $R_{top}\left(1 - w(T)\right)$. That expression is largest when $w(T)$ is at its most negative.

$w$ is the wavelet, and $T$ is a lag measured from its centre, which is its peak. The lag at which a wavelet is most negative is by definition the time from its peak to its trough. So the tuning thickness is the wavelet's peak to trough time, for any wavelet at all, with no assumption about its shape beyond having a peak and a trough.

That is a satisfying result, and it explains why the tuning thickness is a property of the wavelet rather than of the rock. The reflection coefficients are outside the bracket. They scale the answer and they do not move it.

## Evaluating it for a Ricker

Write the Ricker in terms of $u = \pi f t$:

$$r(u) = \left(1 - 2u^2\right)e^{-u^2}$$

Differentiate with respect to $u$:

$$\frac{dr}{du} = -4u\,e^{-u^2} + \left(1 - 2u^2\right)\left(-2u\right)e^{-u^2} = -2u\left(3 - 2u^2\right)e^{-u^2}$$

The derivative is zero at $u = 0$, which is the central peak, and at $2u^2 = 3$, which gives $u = \sqrt{3/2} = \sqrt{6}/2$. The second of these is the trough. Converting back to time through $u = \pi f t$:

$$t = \frac{u}{\pi f} = \frac{\sqrt{6}}{2\pi f}$$

The value of the wavelet there is $r = (1 - 3)e^{-3/2} = -2e^{-3/2} = -0.4462603$, which is the deepest the Ricker ever gets and the number the tuning amplitude is built from.

## Two forms of the same constant

The formula is often quoted as a rule of thumb in the form $1/(2.6f)$.

$$\frac{\sqrt{6}}{2\pi} = 0.3898484 \qquad \frac{1}{2.6} = 0.3846154$$

The rule of thumb is 1.34 percent low. At 25 Hz it gives 15.3846 ms against the exact 15.5939 ms, a difference of 0.21 ms. The capstone's tolerance on this field is 0.05 ms, so **the rule of thumb does not pass**. It is a field estimate, not the graded quantity, and the difference between the two is exactly the kind of thing an Expert tier is expected to keep straight.

## What makes this field different from the other five

It is not a reading. Nothing on the panel has to be run to produce it. Given a frequency and a calculator it can be written down, and it would be the same number if the model did not exist.

That independence is the entire point. The model reports 16 ms and theory says 15.5939 ms. Those two numbers were produced by completely different routes: one by convolving 31 traces and taking an argmax, the other by differentiating a closed form. Their agreement to within one sample is evidence that the model is doing what it claims. Had the model returned 24 ms, the theory would have caught it.

## Worked example

Compute the theoretical tuning thickness at 40 Hz and confirm that the model's answer of 10 ms is consistent with it.

$$\frac{\sqrt{6}}{2\pi \times 40} = \frac{2.4494897}{251.3274} = 0.0097462\ \mathrm{s} = 9.746210\ \mathrm{ms}$$

The model's 2 ms grid offers 8 ms and 10 ms as candidates. The theoretical value sits 0.254 ms from 10 and 1.746 ms from 8, so 10 is the nearer, and 10 is what the model reports. The two routes agree as closely as the grid allows.

## Exercise

Derive the wavelet value at the tuning lag from the expression $r(u) = (1 - 2u^2)e^{-u^2}$ with $u^2 = 3/2$, then use it to state the ideal tuning amplitude for a pair of $\pm 0.05$. Say whether that amplitude depends on frequency.

As a self-check: with $u^2 = 3/2$ the wavelet is $(1 - 3)e^{-3/2} = -2e^{-3/2} = -0.4462603$, so the ideal tuning amplitude is $0.05 \times (1 + 0.4462603) = 0.0723130$. It does not depend on frequency, because $u^2 = 3/2$ at the tuning lag whatever the frequency is, so the wavelet value there is always $-0.4462603$; frequency only sets the time at which that lag occurs.
