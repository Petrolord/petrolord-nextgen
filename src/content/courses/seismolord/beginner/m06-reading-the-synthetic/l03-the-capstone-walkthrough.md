# The capstone walkthrough

The Associate capstone is not an essay and not a multiple choice paper. It asks you to build the synthetic in the app and report six numbers from the summary panel, each checked against the engine's own answer within a stated tolerance. This lesson walks the six and sets out the order the server enforces before the capstone opens at all.

One setting governs everything: the wavelet must be at 25 Hz. Reporting from a 15 Hz or 40 Hz run will fail even if you read the panel perfectly.

## The six

| # | Quantity | Value | Tolerance |
| --- | --- | --- | --- |
| 1 | Mean sonic velocity | 3145.29 m/s | 1 |
| 2 | TWT at top of log | 1500 ms | 0.5 |
| 3 | Maximum impedance | 10624.96 | 10 |
| 4 | Strongest reflection coefficient, absolute value | 0.017688 | 0.0005 |
| 5 | TWT of that strongest reflection coefficient | 1582 ms | 2 |
| 6 | TWT of the strongest synthetic amplitude | 1642 ms | 2 |

**1. Mean sonic velocity, 3145.29 m/s, tolerance 1.** Tests that you inverted slowness to velocity sample by sample and averaged the velocities. Averaging DT first and inverting afterwards falls outside a tolerance this tight. It also confirms the sonic units were read correctly.

**2. TWT at the top of the log, 1500 ms, tolerance 0.5.** The tightest tolerance on the list, because the quantity is pure arithmetic on a depth with nothing to estimate. It tests the time-depth function, and above all that the two-way factor is present. A one-way conversion returns 750 ms.

**3. Maximum impedance, 10624.96, tolerance 10.** Tests that velocity and density were multiplied sample by sample and the maximum taken over the impedance log. It is the one graded number that needs both input curves to be right.

**4. Strongest reflection coefficient, 0.017688 in absolute value, tolerance 0.0005.** Tests the reflectivity stage. Report the magnitude rather than the signed value; the scan looks for the largest absolute coefficient so that a strong negative competes fairly with a strong positive.

**5. TWT of that strongest reflection coefficient, 1582 ms, tolerance 2.** Tests that the reflectivity series was placed on the time axis correctly. The tolerance is one sample of the 2 ms grid, so you have one sample of slack and no more.

**6. TWT of the strongest synthetic amplitude, 1642 ms, tolerance 2.** Tests the convolution stage, and it is the entry most often reported wrongly.

## The 60 ms that separates the last two

Numbers 5 and 6 are 60 ms apart. That gap is the point of the pair, and a learner who writes 1582 twice, or 1642 twice, has told the grader that module 5 did not land.

The reflection coefficient series is a set of spikes, one per interface, and its largest member sits at 1582 ms. The synthetic is what a 25 Hz wavelet makes of that whole series: each coefficient contributes a scaled and shifted copy of the wavelet, the copies overlap, and the trace at any instant is their sum. The largest excursion of the sum lands where contributions reinforce one another, which need not be at the largest single spike and here is not.

Frequency moves it, which is the clearest evidence that the peak belongs to the wavelet rather than to the geology. At 15 Hz the strongest synthetic amplitude is 0.157315 at 1580 ms, at 25 Hz 0.073005 at 1642 ms, at 40 Hz 0.036223 at 1646 ms. The coefficients never changed; only the wavelet did. That is also why the capstone fixes the frequency, since entry 6 has no single correct answer without one.

## The order the server enforces

The capstone is the last gate on the deep path, and the platform will not let you reach it early. The sequence is:

1. Read every lesson in every module. Progress is recorded per lesson, so a skipped lesson leaves the module incomplete.
2. Pass each module quiz at 75 percent. Three failed attempts on the same quiz trigger a 24 hour cooldown before you may try again, which sends you back to the lessons rather than letting you guess your way through a bank.
3. Clear all six modules, from Seismic and the Well Tie through to this one.
4. Pass the final exam at 70 percent. The exam draws across the whole course, so it is broader than any single quiz and set slightly lower for that breadth.
5. Only then does the capstone unlock.

Passing the capstone grants the Associate certification for this course, which is what the ladder above recognises and the entry ticket to the Professional tier.

## How to sit it

Open the app, load the teaching well, set the wavelet to 25 Hz and build. Read the six values straight from the panel rather than recomputing them by hand, then sanity-check each: velocity in the low three thousands, TWT at the top equal to the depth in metres, impedance in the ten thousands, reflection coefficient a few hundredths, and the last two times 60 ms apart with the synthetic peak the later of the two. If a check fails, the previous lesson's QC list says which stage to look at.

Try it yourself: the panel below builds the synthetic from the teaching well at a frequency you choose.

{{panel:sl-synthetic-explorer}}

## Exercise

Without opening the app, write down which of the six graded quantities would change if you rebuilt the synthetic at 40 Hz, and which would not. As a self-check: only entry 6 moves, from 1642 ms to 1646 ms, and the amplitude that goes with it falls from 0.073005 to 0.036223; entries 1 to 5 are computed before the wavelet is applied. Then state in one sentence why entries 5 and 6 are different numbers.
