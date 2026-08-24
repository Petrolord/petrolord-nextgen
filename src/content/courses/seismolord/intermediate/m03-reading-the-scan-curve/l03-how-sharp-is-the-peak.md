# How sharp is the peak

Lesson 1 read the curve going up and coming down. Lesson 2 read it at the far end, where doing nothing still scored 0.621742. This lesson reads the part in between, the shoulders on either side of the answer, and asks what they tell you.

The question is not whether the shift is right. The scan already answered that. The question is how tightly the data pins it down.

## The numbers on the shoulder

Go back to the same table and take only the three lags nearest the answer on each side.

| lag (ms) | correlation | distance from the answer |
| --- | --- | --- |
| 4 | 0.892968 | 4 ms |
| 6 | 0.972386 | 2 ms |
| **8** | **1.000000** | 0 |
| 10 | 0.972386 | 2 ms |
| 12 | 0.892968 | 4 ms |

Now read the second column as a cost. Being one sample off, which is 2 ms here, costs you 0.027614 of correlation. Being two samples off costs 0.107032. Being four samples off, back at zero lag, costs 0.378258.

The first of those is small. If your scan had returned 6 ms instead of 8 ms, the correlation it reported would have been 0.972386, and nothing about that number would have looked wrong. It is a good correlation. On real data you would have been pleased with it.

## What a broad peak means

Say this precisely, because the temptation is to read it as a fault in the method.

The scan is not uncertain about which lag is best. It is certain: 1.000000 beats 0.972386 by a clear margin, and the arithmetic is exact. What the shoulders tell you is something else. They tell you how much worse a slightly wrong answer would be, and here the answer is: barely worse.

That is a statement about the data, not about the algorithm. The correlation at 6 ms is high because the trace at 6 ms genuinely does resemble the observed trace, almost as well as the trace at 8 ms does. Nothing has malfunctioned. The traces are smooth, they change slowly from sample to sample, and so a small slide changes very little.

The useful word for this is precision, and it is worth holding apart from correctness.

**Correctness** is whether the peak is in the right place. The scan handles that, and on this exercise it is exact.

**Precision** is how narrowly the data constrains that place. A narrow peak means the data insists on one lag. A broad peak means several nearby lags are almost as consistent with the data, so the shift is determined loosely even when it is determined correctly.

Both things are true here at once. The best lag is 8 ms, exactly, and the data would have been nearly as happy with 6 ms or 10 ms.

## Why this is information rather than a defect

Three consequences follow, and they are practical.

The first is about how much to trust a reported shift. A shift that comes out of a broad peak carries a wider margin than one that comes out of a narrow spike. If you report a bulk shift, you know from the shoulders roughly how much room there was around it. That is a more honest statement than the lag on its own.

The second is about noise. The shoulders tell you how much the correlation moves when the alignment moves. If a small change in alignment barely moves the correlation, then a small amount of noise, which perturbs the correlation in a similar way, can shuffle the ordering of nearby lags. On this noiseless exercise it cannot, because the ordering is exact. On real data, a peak this broad means the difference between adjacent lags is the sort of quantity noise can overturn, and you should not treat the last sample of the answer as gospel.

The third is about what a narrow peak would have meant. Sharper wavelets produce sharper peaks, because a trace made of short pulses stops resembling itself as soon as you slide it. Longer wavelets produce broader ones. So the width of the scan peak is telling you something about the frequency content of what you are correlating, which is the thread module 4 picks up from the other end.

## Reading the width in practice

You do not need a formula to use this. You need to look at the curve and ask two questions.

How far do you have to move before the correlation drops by an amount you would care about? Here you can move two samples and still be above 0.97, so the honest answer is that this scan pins the shift down to within a couple of samples rather than to one sample.

And does the peak stand out from the rest of the curve? A broad peak that still rises well clear of its surroundings is a usable result. A broad peak that barely rises above a generally high curve is a warning, because it means the correlation is not really distinguishing between alignments at all.

Keep both questions qualitative. The point is not to convert the shoulders into a stated uncertainty. It is to stop reading the best lag as if it were the only lag the data allows.

## Exercise

Using only the correlations at 6, 8 and 10 ms, write down how much correlation one sample of misalignment costs on this pair, then state in one sentence whether that cost would be large enough to survive a modest amount of noise on the observed trace. Second, answer this: two scans on two different wells report best lags with the same correlation, but on one well the neighbouring lags score almost as highly and on the other they score far lower. Which shift would you quote with more confidence, and why?

As a self-check: the correlation is 1.000000 at 8 ms and 0.972386 at both 6 ms and 10 ms, so one sample of misalignment costs 0.027614. That is a small margin, and modest noise on a real trace can move a correlation by more than that, so on real data the ordering of adjacent lags around a peak this broad should not be treated as decisive. Of the two wells, you would quote the shift from the well with the far lower neighbours with more confidence, because that data clearly prefers one alignment over the ones beside it, while neighbours that score almost as highly mean several nearby lags fit nearly as well and the shift is only loosely determined, even though both scans may have found the correct peak.
