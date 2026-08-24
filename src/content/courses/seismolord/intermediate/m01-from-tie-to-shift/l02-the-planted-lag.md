# The planted lag

Before you use a method on data whose answer you do not know, you run it on data whose answer you do. That principle is why this tier's observed seismic is not real seismic. It is a construction, and knowing exactly how it was constructed is part of the material rather than a detail to be skipped past.

## How the observed trace was made

The engine builds the synthetic from the teaching well at a 25 Hz Ricker wavelet, on a 2 ms sample grid in two-way time. It then makes the observed trace by copying that synthetic forward by four samples. Four samples at 2 ms each is 8 ms, so every event in the observed trace sits 8 ms later in TWT than the same event in the synthetic. The first four samples of the observed trace have nothing to copy into them and are left as gaps.

That is the entire construction. The observed trace is the synthetic and nothing else, moved down the time axis by 8 ms. There is no noise added, no second wavelet, no processing, no change of polarity, no missing reflector, and no lateral geology. The planted lag is 8 ms in TWT, the scan is not told what it is, and the correct answer therefore exists in advance.

## Why you validate on a known answer

A cross-correlation scan is a machine that always returns something. Give it two traces and it will hand back a lag and a number, whatever those traces are. That is convenient and it is also the danger, because a method that never refuses to answer cannot be judged by whether it answered.

So you test it where you can mark the paper. If the scan recovers 8 ms on a case built to be 8 ms, you have learned that the scan's sign convention is what you think it is, that its search window is wide enough to contain the answer, that its sample stepping lines up with the sample grid, and that you are reading its output the way the engine means it. Those are four separate ways to be wrong, and all four are invisible on data with no known answer, because on such data a wrong answer looks exactly like a right one.

The same logic runs through every part of this platform. An engine earns trust by reproducing something independently known, and only then gets pointed at something unknown. A synthetic case with a planted lag is the cheapest possible version of that discipline.

## What this construction is not

It is not a well tie. It is worth being blunt about this, because the exercise is convincing to look at and a learner who mistakes it for the real thing will carry the wrong expectations into their first genuine tie.

A real observed trace comes from a seismic volume, which means it has been through acquisition and processing. Its wavelet is whatever the processing sequence left behind, in both frequency content and phase, and it is not the Ricker you chose for your synthetic. It carries noise, both random and coherent. It samples an area around the well rather than the exact well path, so it contains geology the logs never saw. It may carry multiples, and it has been affected by transmission losses and absorption that the simple convolutional model does not represent. On top of that, the synthetic side is imperfect too, because the sonic may be affected by the borehole, the density may be washed out over intervals, and the time-depth function is itself an estimate.

None of those exist here. The two traces in this exercise differ by a time shift and by nothing at all besides.

## What still generalises, and what does not

Draw the line carefully, because most of the tier does generalise.

The mechanics generalise. The normalised correlation is the same measure on real data, the scan tests the same lags in the same way, the sign convention means the same thing, and the peak is selected by the same rule. Everything you learn about how the scan works is transferable exactly.

The reading habits generalise. In module 3 you will find that at zero lag, meaning an unshifted tie, this exercise still returns a correlation of 0.621742. That is a number many people would look at and accept, while the tie sits a full 8 ms wrong in TWT. The lesson that a plausible correlation is not evidence of alignment is a real lesson about real data, and it happens to be visible here with unusual clarity.

One thing does not generalise, and it is the headline number. The correlation at the winning lag in this exercise is exactly 1. That is a consequence of the observed trace being a copy of the synthetic, and no real tie produces it. Module 2 closes with a lesson on that point alone, because the failure mode it prevents is a learner treating 1 as the target and reading every honest tie as broken.

## Reading the shift with its units

One habit to build now. The planted lag is 8 ms and the shift the scan reports is 8 ms, and both are differences in two-way time. Whenever you write one down, write the unit and say that it is a shift in TWT. A bare 8 in a notebook is a number that will mislead somebody later, including you, because depth shifts, TWT shifts and one-way time shifts all get written as a small number of the same magnitude and only the label separates them.

## Exercise

Write down, in your own words, the three-sentence recipe that produces the observed trace in this tier, including the sample rate and the number of samples the copy moves. Then list four differences between that trace and a trace pulled from a processed seismic volume at a well location. Finally, decide which of these two statements you would defend on real data: the scan's sign convention means the same thing, and the scan's peak correlation means the same thing.

Self-check: the recipe is that the engine builds the 25 Hz synthetic on a 2 ms grid, copies it forward by four samples, which is 8 ms of TWT, and leaves the first four samples as gaps. Differences from real data include the processing wavelet in both amplitude and phase, random and coherent noise, geology sampled around the well rather than along it, multiples, transmission and absorption effects, and errors in the sonic, the density and the time-depth function. Of the two statements, the sign convention is defensible anywhere, because it is a property of how the engine pairs samples. The peak correlation is not, because its value of 1 here comes from the observed trace being a copy of the synthetic rather than from the method being good.
