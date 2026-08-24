# Scanning the lags

The correlation measures one alignment. The scan tries all of them. This lesson is about the search itself: which lags are tested, how they are stepped, how many there are, and what the rule for choosing a winner does and does not guarantee.

## The search is exhaustive, not clever

The engine does not hunt for the answer. It tests every lag in the window, scores each one, keeps the whole set of scores, and then picks the largest. There is no starting guess, no iteration toward a solution, and no possibility of the search stopping early on a local peak, because it never stops early. It computes them all.

That matters more than it sounds. A search that walks downhill from a starting point can settle in the wrong place and report success. An exhaustive scan cannot, within its window. Whatever it returns is genuinely the best of everything it looked at, so the only ways it can be wrong are that the answer lay outside the window or that the best correlation is not the correct alignment. Both are real risks and both are examined later, in module 3. Neither is a failure of the search.

The price is arithmetic, and it is small. Each lag costs one pass over the trace, and there are a few dozen lags, so the whole scan is a few dozen passes. That is nothing on a single trace, which is why exhaustive search is the right design here.

## The window and the step

Two settings define the search.

The **window** is the maximum lag in either direction. In this exercise it is 40 ms of TWT, so the engine considers shifting the synthetic anywhere from 40 ms earlier to 40 ms later. The window is a statement of prior belief. It says that a bulk shift larger than 40 ms is not a shift you are willing to entertain from this scan, which is a reasonable position when the time-depth function is roughly right and you are correcting a datum or a checkshot offset rather than searching for a completely different reflector. A window too wide invites the scan to find agreement with the wrong cycle somewhere far away. A window too narrow can exclude the true answer, and a scan whose peak sits at the very edge of its window is telling you the window may be the problem.

The **step** is one sample. The engine converts the window from ms to samples by dividing by the sample rate, and then walks lag by lag in whole samples. It does not test fractions of a sample, because a fractional shift would require interpolating the trace, and the engine will not invent samples that were never recorded.

At the 2 ms sample rate used here, 40 ms is 20 samples, so the search runs from lag $-20$ to lag $+20$ in steps of one. That is 20 negative lags, 20 positive lags, and zero lag itself: **41 lags tested**, covering $-40$ ms to $+40$ ms in 2 ms steps.

Two consequences follow directly. The reported shift is always a whole number of samples, so on this grid it is always an even number of ms, and 8 ms qualifies while 7 ms could never be returned. And the resolution of the answer is the sample rate, so a scan on a 2 ms grid cannot distinguish a true offset of 8 ms from one of 8.4 ms. That is why the graded tolerance on the shift is 0.5 ms, comfortably inside a single sample.

## Choosing the winner

The rule is the plainest one available. Of all the lags that were scored, take the one with the highest correlation. Lags that were not scored, because fewer than eight live overlapping samples survived or because a sum of squares was zero, are not candidates and cannot win.

Notice that the rule takes the highest correlation and not the largest absolute correlation. A strongly negative correlation is not a candidate for the answer, because a negative correlation means the traces are inverted rather than aligned. Selecting on magnitude would let the scan report a polarity error as a tie, and the engine deliberately does not.

Notice also what the winner does not tell you on its own. It is the best of 41, which says nothing about how much better it is than the second best, or than zero lag, or whether the curve has one clear peak or several similar ones. All of that is in the scored set, which is why the engine keeps the whole series rather than only the winner, and why the panel plots it. Module 3 is entirely about reading that curve.

## Running the scan here

On the planted case, the scan builds the 25 Hz synthetic, takes the observed trace that is that same synthetic arriving 8 ms late in TWT, and scores all 41 lags. The answer it returns is a shift of 8 ms of TWT with a correlation of 1. The next lesson works through why the sign is positive, and the lesson after that works through why the correlation is exactly 1 and why that value belongs to this exercise rather than to well ties in general.

Try shifting your attention across the curve rather than staring only at its top. The panel below runs the full scan and plots the correlation against every lag it tested.

{{panel:sl-shift-explorer}}

## Exercise

Work out how many lags the scan would test in each of these cases, and say in one sentence what changes about the answer's precision. First, the same 40 ms window on a 4 ms sample grid. Second, a 20 ms window on the 2 ms grid used here. Third, a 100 ms window on the 2 ms grid. Then say what you would conclude if a scan on the 40 ms window returned its best correlation at a lag of 40 ms.

Self-check: on a 4 ms grid, 40 ms is 10 samples, so the scan tests 21 lags from $-40$ to $+40$ ms in 4 ms steps, and the reported shift can only be a multiple of 4 ms, so the answer is coarser. A 20 ms window on a 2 ms grid is 10 samples each way and tests 21 lags, with the same 2 ms precision as before over a narrower range. A 100 ms window on a 2 ms grid is 50 samples each way and tests 101 lags, at the same precision over a wider range. A peak sitting exactly at the edge of the window is a warning rather than a result, because the scan may only be reporting the closest it was allowed to look, and the honest response is to widen the window and run it again.
