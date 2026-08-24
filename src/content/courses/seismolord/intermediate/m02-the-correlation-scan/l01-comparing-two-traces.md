# Comparing two traces

Before you can find the best shift you need a way to score a shift, and before that you need a way to say how well two traces agree at all. This lesson builds that measure from the ground up, and the useful part is the false start, because the obvious answer fails for a reason worth understanding.

## What agreement has to mean here

Two traces sit on the same TWT grid, sampled every 2 ms. Call them $s$ for the synthetic and $g$ for the observed seismic. You want one number saying how alike they are.

Be precise about what alike should mean for seismic. It cannot mean that the samples are equal, because the two traces are not in the same units in any meaningful sense. Seismic amplitude is a recorded quantity scaled by acquisition, by processing gain and by whatever normalisation was applied along the way. The synthetic is a dimensionless product of reflection coefficients and a wavelet whose peak was set to one by convention. There is no reason for the two to share a scale, and a comparison that punishes them for not sharing one is measuring the wrong thing.

What you want is agreement of shape. Peaks in the same places, troughs in the same places, the same relative sizes, the same polarity. A synthetic that is a faithful prediction multiplied by 40 is a good tie. A synthetic that is a faithful prediction turned upside down is a serious problem. A measure that cannot tell those two apart, or that ranks the first as poor because the numbers are larger, is useless.

## The obvious first attempt

The natural way to reward samples that agree in sign and size is to multiply them together and add up the products across the trace:

$$ D = \sum_{i} s_i \, g_i $$

The instinct behind this is sound. Where both traces are positive the product is positive. Where both are negative the product is positive again, because two negatives multiply to a positive, so a matched trough contributes just as much as a matched peak. Where one is positive and the other negative the product is negative and the total is pushed down, which is exactly the penalty a polarity mismatch deserves. Where either trace is near zero the product contributes almost nothing, so quiet parts of the trace neither help nor hurt.

That is a lot of correct behaviour from one sum, and it explains why the product of samples sits at the heart of every version of this measure, including the one the engine uses.

## Why the raw sum is not enough

The problem is that $D$ grows with the size of the traces and not only with their agreement. Multiply the observed trace by ten and every product is ten times larger, so $D$ is ten times larger, while nothing about the alignment has changed by a hair.

The consequence is what matters. Suppose you are comparing a synthetic against a loud part of the section and against a quiet part. The loud comparison can beat the quiet one on $D$ even if it agrees less well, because volume alone lifts the score. The measure would then be answering "where is the seismic strongest" while you asked "where does the seismic look like my synthetic". Applied across a range of lags, that is a scan that drifts toward the noisiest window rather than the best match.

A second consequence follows. Without a fixed scale, $D$ has no interpretable size. If a shift scores 41.7, you have no way to say whether that is excellent or poor, because you have nothing to compare it against and the number would be different if somebody had rescaled the volume last week. A quality measure you cannot read is not a quality measure.

## Normalisation is the fix

The way out is to divide the sum of products by something that grows the same way the sum does. If the observed trace is multiplied by ten, you want the divisor to be multiplied by ten too, so the ratio is unchanged.

The energy of each trace is what supplies that. Summing the squares of the samples of a trace gives a quantity that scales with the square of any gain applied to it, so the square root of it scales with the gain itself. Divide the sum of products by the square root of the product of the two energies, and the gains on both traces cancel out of the ratio exactly.

What you are left with is a pure statement about shape. It does not change when either trace is amplified. It is dimensionless, and it is bounded, so a value close to its maximum means the same thing every time you see it, on any pair of traces, at any lag, in any project. That last property is what makes the number worth recording next to a tie.

Two practical matters have to be handled alongside the normalisation, and the next lesson deals with both. Traces contain gaps, which are samples with no value, and a sample with no value cannot enter a product. And when one trace is shifted against the other they no longer cover the same span of time, so the sums must run over the overlap only, and the overlap has to be long enough for the result to mean anything.

## Exercise

Take two short series on the same grid, $s = [1, -2, 1]$ and $g = [2, -4, 2]$, and compute the raw sum of products. Then multiply $g$ by ten to get $[20, -40, 20]$ and compute it again. Then take a third series $h = [-1, 2, -1]$, which is $s$ inverted, and compute the raw sum of products of $s$ with $h$. Say in one sentence what each result tells you and what it fails to tell you.

Self-check: the first sum is $2 + 8 + 2 = 12$. The second is $120$, ten times larger, from a pair of series whose shapes agree exactly as well as before, which is the scale problem in miniature. The third is $-1 - 4 - 1 = -6$, negative, which correctly flags the polarity reversal. So the raw sum gets the sign of the relationship right and the size of it wrong, and any measure built on it has to divide out the scale before its value can be read.
