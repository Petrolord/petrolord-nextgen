# The normalised correlation

This is the measure the engine uses. It is the sum of products from the last lesson, divided by a normaliser built from the energy of each trace, computed over a carefully defined set of samples.

## The formula

Let $s$ be the synthetic and $g$ the observed seismic, both on the same 2 ms TWT grid, and let $\ell$ be the lag in samples by which the comparison is offset. The engine pairs synthetic sample $i$ with observed sample $i + \ell$, and computes

$$ C(\ell) = \frac{\sum_{i \in L} s_i \, g_{i+\ell}}{\sqrt{\left(\sum_{i \in L} s_i^2\right)\left(\sum_{i \in L} g_{i+\ell}^2\right)}} $$

where $L$ is the set of sample positions that count, defined in the next section. The numerator is the sum of products. The denominator is the square root of the product of the two sums of squares, each taken over the same set $L$.

Confirm for yourself that this does what the last lesson asked. Multiply $g$ by any positive constant $k$. The numerator gains a factor of $k$. In the denominator, the sum of $g^2$ gains a factor of $k^2$, and the square root turns that back into a factor of $k$. The two cancel and $C$ is unchanged. The same argument applies to $s$. The measure is blind to the gain on either trace and sensitive only to shape.

One detail is worth naming because it is a real choice and not an oversight. The sums are taken about zero rather than about each trace's mean, so this is a correlation about zero rather than a statistical correlation coefficient about a mean. That suits seismic, where both traces already oscillate about zero and any constant offset would itself be a defect rather than a baseline to be removed.

## Which samples count

Three rules define $L$, and each one exists for a reason you can state.

**The sample must overlap.** When the synthetic is offset by a lag, its ends hang past the ends of the observed trace. Any position $i$ where $i + \ell$ falls outside the observed trace has no partner and is skipped. This is why the sums are recomputed at every lag rather than once: the set of positions changes as the lag changes.

**Neither sample may be a gap.** A gap is a sample with no value, and the platform writes it as a declared non-value rather than a zero. That distinction matters here. Treating a gap as zero would silently add a term of zero to the numerator and a term of zero to the sum of squares, which quietly dilutes the correlation with samples that carry no information. So a position where either trace is a gap is excluded from all three sums, not zeroed. In this exercise the observed trace begins with four gap samples, because it was made by copying the synthetic forward by four samples and nothing filled the space left behind.

**There must be at least eight live overlapping samples.** If fewer than eight positions survive the first two rules, the engine does not score that lag at all. It returns no value for it rather than a poor value. This guards the far ends of the scan, where the traces barely overlap and a correlation computed on two or three samples could easily reach a large value by accident. A high score from a handful of samples is not evidence, and the cleanest way to prevent it from winning a scan is to refuse to compute it.

The engine also declines to score a lag where either sum of squares is zero, since that would mean dividing by zero, and a stretch of exact silence carries no shape to compare.

## Reading the value

$C$ is dimensionless. It has no units, and quoting it with any would be an error. It is also bounded: it can never leave the range from $-1$ to $+1$, which follows from the Cauchy-Schwarz inequality, the statement that a sum of products can never exceed the square root of the product of the two sums of squares. That bound is what makes the number readable.

Read the three landmarks as follows.

A value of $+1$ means the two series are identical in shape over $L$, up to a positive constant multiplier. Every peak lines up with a peak, every trough with a trough, and the relative sizes match exactly.

A value near $0$ means no consistent linear relationship over $L$. Positive products and negative products roughly cancel. The traces are not aligned, and they are not inverted either.

A value of $-1$ means the two series are identical in shape but opposite in sign. That is a polarity problem, and a strongly negative correlation at a plausible lag is a signal to check polarity conventions before touching anything else, because moving the trace will never fix it.

The values in between are the ones that require judgement, and the tier keeps returning to that. A correlation of 0.6 says the traces have a good deal in common and does not say the alignment is right. Module 3 shows exactly that situation in this very exercise, where the completely unshifted comparison scores 0.621742 while sitting a full 8 ms wrong in TWT.

## Exercise

Using the series $s = [1, -2, 1]$ and $g = [2, -4, 2]$ from the last lesson, compute $C$ at zero lag by hand. Then compute $C$ for $s$ against its inverted copy $h = [-1, 2, -1]$. Then answer this in one sentence: why must the sums of squares be recomputed at every lag rather than computed once for each trace and reused?

Self-check: for $s$ and $g$ the numerator is $12$, the sum of $s^2$ is $1 + 4 + 1 = 6$, the sum of $g^2$ is $4 + 16 + 4 = 24$, and the denominator is $\sqrt{6 \times 24} = \sqrt{144} = 12$, giving $C = 1$ exactly, which is right because $g$ is $s$ multiplied by two. For $s$ and $h$ the numerator is $-6$, both sums of squares are $6$, the denominator is $6$, and $C = -1$, the polarity case. The sums must be recomputed at every lag because the set of counted positions changes with the lag: samples move in and out of the overlap, and gaps in one trace exclude different positions in the other as it slides.
