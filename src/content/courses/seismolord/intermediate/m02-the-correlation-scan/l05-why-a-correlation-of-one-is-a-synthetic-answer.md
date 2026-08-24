# Why a correlation of one is a synthetic answer

This is the honesty lesson of the module. The scan reported a correlation of 1, and 1 is the ceiling of the measure. If you take that away as what a successful tie looks like, this tier will have done you harm rather than good, because you will spend your career looking at correct ties and calling them failures.

## Why it is exactly 1, in arithmetic

Start with the formula. At the winning lag the engine pairs synthetic sample $i$ with observed sample $i + 4$, and the observed trace was built so that observed sample $i + 4$ holds exactly the value of synthetic sample $i$. Over every counted position, therefore, $g_{i+\ell} = s_i$.

Substitute that into the correlation:

$$ C = \frac{\sum s_i \, s_i}{\sqrt{\left(\sum s_i^2\right)\left(\sum s_i^2\right)}} = \frac{\sum s_i^2}{\sum s_i^2} = 1 $$

The numerator and the denominator are the same quantity, so the ratio is 1 by construction and not by luck. No property of the rock, the wavelet, the sample rate or the search window enters that cancellation. It would come out to 1 for any trace whatever, compared against a shifted copy of itself.

## The word for what actually happened

Correlating a series with a shifted copy of itself is an autocorrelation. That is the correct name for the operation this exercise performed, and it explains the result completely.

It also explains a feature of the curve you will meet in the next module. An autocorrelation is symmetric about the lag that undoes the shift, because sliding two identical shapes past each other looks the same from either side. So the curve rises to 1 at 8 ms and falls away at the same rate on both sides of it. Two genuinely different traces have no reason to do that, and a real scan curve is usually lopsided.

The scan did not measure a tie. It measured a copy. Everything about the method was exercised correctly, which is what the exercise was for, but the quality number that came out is a statement about the construction rather than about the earth.

## What a real tie is up against

A real observed trace differs from the synthetic in ways that no time shift can remove, and every one of them pulls the correlation down from 1.

The wavelet in the data is whatever the processing left, in both bandwidth and phase, and it is not the Ricker you selected. Noise is present, both random and coherent, and the noise contributes to the sum of squares in the denominator while contributing nothing consistent to the numerator. The trace samples an area around the borehole rather than the borehole itself, so it contains reflections from geology the logs never touched. Multiples, transmission losses and absorption are in the data and are not in a simple convolutional synthetic. On the other side, the sonic can be disturbed by the borehole, the density can be washed out over intervals, gaps have to be handled, and the time-depth function used to place the log in TWT is itself an estimate with its own error.

Any one of those puts a ceiling on the agreement well below 1. All of them are present at once in every real tie.

## What good looks like instead

Since the truth file for this tier contains no real-tie correlation, take no number from this lesson. Take the criteria.

A real tie is judged good when the peak is clearly better than its surroundings, so that the winning lag stands out from the rest of the scanned range rather than edging past it. It is judged good when the peak is sharp enough to locate a lag rather than being a long plateau over which any of a dozen shifts would do. It is judged good when the resulting shift is physically plausible, of a size consistent with a datum or checkshot discrepancy rather than a whole wavelet cycle. It is judged good when the shifted synthetic ties the marker events you care about, so that the correlation number and your eyes agree about which reflector is which. And it is judged good when neighbouring wells in the same survey need shifts of a similar size, since a single well demanding a wildly different correction is usually reporting a problem in its own inputs.

Notice that four of those five are about relative evidence, not about an absolute score. That is the point. The correlation is a comparative instrument. It ranks the alignments of one pair of traces against each other well, and it compares poorly across different wells, different intervals and different volumes, because each of those changes what the ceiling is.

## The failure mode this prevents

Picture the interpreter who leaves this tier believing that a good tie scores 1. Their first real well returns a number far below it. They widen the window, and the scan finds somewhere else to sit. They narrow the correlation interval to the few events that already agree, and the number improves because they have removed the disagreement rather than resolved it. They try another wavelet, and another, keeping whichever gives the best score. Each step is defensible on its own and the sequence is a slow slide into fitting the measure instead of tying the well. The final answer has a good number attached and less evidence behind it than the first attempt had.

The protection is to know what your number means before you go looking for a better one. In this exercise the number is 1 because the observed trace is the synthetic. On real data the ceiling is lower, unknown in advance, and set by the physics and the processing rather than by your skill. A tie is good when the peak is convincing against its own curve and the shift makes sense, and that judgement is yours to make and to write down.

## Exercise

Write the two-line proof that $C = 1$ at the winning lag in this exercise, then list five reasons a real tie cannot reach it. Then write one paragraph you would put in a tie report to justify a shift, using no absolute correlation threshold at all.

Self-check: the proof is that $g_{i+\ell} = s_i$ over every counted position, so the numerator is the sum of $s_i^2$ and the denominator is the square root of that quantity times itself, giving 1 exactly. Reasons include the processing wavelet differing in bandwidth and phase, noise entering the denominator without helping the numerator, geology around the well that the logs never saw, multiples and absorption absent from the convolutional model, and errors in the sonic, the density and the time-depth function. A defensible justification names the shift with its sign and unit in TWT, states that its peak stands clearly above the rest of the scanned range and is sharp rather than flat, states that the shift is consistent with a known datum or checkshot discrepancy, names the marker events that tie after it is applied, and compares it with the shifts used at neighbouring wells.
