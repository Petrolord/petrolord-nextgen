# The capstone walkthrough

The Associate capstone is not an essay and not a multiple choice paper. Its brief gives you a case of its own: a depth window of the teaching log, an overburden velocity for the time-depth function, and a wavelet frequency. It asks you to build that synthetic in the app and report six numbers from the summary panel, each checked against the engine's own answer within a stated tolerance. This lesson walks the six on the teaching case, the whole log at 2000 m/s and 25 Hz, and sets out the order the server enforces before the capstone opens at all. None of the teaching numbers is a capstone answer.

## Setting the case

The synthetic explorer opens on the whole log at 2000 m/s and 25 Hz. Type the brief's wavelet frequency, overburden velocity, and the top and base of its depth window. Read the subtitle after typing: it repeats the window, the velocity and the frequency the panel is using. Every one of the six moves with the case; a panel left on the teaching settings produces six reasonable numbers that are all wrong.

## The six, worked on the teaching case

**1. Mean sonic velocity, 3145.29 m/s.** Tests that you inverted slowness to velocity sample by sample and averaged the velocities over the samples in the window. Averaging DT first and inverting afterwards gives a different number.

**2. TWT at the top of the window, 1500 ms.** Pure arithmetic on a depth: $2z/V$, in milliseconds. It tests the time-depth function, and above all that the two-way factor is present. On the teaching case the velocity is 2000 m/s, so the TWT in ms equals the depth in m; at any other velocity it does not.

**3. Maximum impedance, 10624.96.** Tests that velocity and density were multiplied sample by sample and the maximum taken over the impedance log in the window.

**4. Strongest reflection coefficient, 0.017688 in absolute value.** Tests the reflectivity stage. Report the magnitude rather than the signed value. The coefficients sit on the 2 ms TWT grid, so the time-depth function decides which depth samples share a cell; change the velocity and the strongest coefficient can change too.

**5. TWT of that strongest reflection coefficient, 1582 ms.** Tests that the reflectivity series was placed on the time axis correctly, to one sample of the 2 ms grid.

**6. TWT of the strongest synthetic amplitude, 1642 ms at 25 Hz.** Tests the convolution stage, and it is the entry most often reported wrongly.

## The gap between the last two

On the teaching case numbers 5 and 6 are 60 ms apart. That gap is the point of the pair. The reflection coefficient series is a set of spikes, one per interface. The synthetic is what the wavelet makes of the whole series: each coefficient contributes a scaled and shifted copy of the wavelet, the copies overlap, and the largest excursion of the sum lands where contributions reinforce one another, which need not be at the largest single spike.

Frequency moves it, which is the clearest evidence that the peak belongs to the wavelet rather than to the geology. On the teaching case, at 15 Hz the strongest synthetic amplitude sits at 1580 ms, at 25 Hz at 1642 ms, at 40 Hz at 1646 ms, while the coefficients never change. That is why every brief states its frequency.

## The order the server enforces

The capstone is the last gate on the deep path, and the platform will not let you reach it early. The sequence is:

1. Read every lesson in every module. Progress is recorded per lesson, so a skipped lesson leaves the module incomplete.
2. Pass each module quiz at 75 percent. Three failed attempts on the same quiz trigger a 24 hour cooldown before you may try again, which sends you back to the lessons rather than letting you guess your way through a bank.
3. Clear all six modules, from Seismic and the Well Tie through to this one.
4. Pass the final exam at 70 percent. The exam draws across the whole course, so it is broader than any single quiz and set slightly lower for that breadth.
5. Only then does the capstone unlock.

Passing the capstone grants the Associate certification for this course, which is what the ladder above recognises and the entry ticket to the Professional tier.

## How to sit it

Open the app, type the brief's case into the synthetic explorer and build. Read the six values straight from the panel, then sanity-check each: velocity in the low thousands, TWT at the top equal to twice the depth over the velocity, impedance in the thousands, a reflection coefficient of a few hundredths, and the synthetic peak at a different time from the strongest coefficient. If a check fails, the previous lesson's QC list says which stage to look at.

Try it yourself: reproduce the teaching values on the panel below, then change the velocity to 2500 m/s and watch which of the six move.

{{panel:sl-synthetic-explorer}}

## Exercise

Without opening the app, write down which of the six would change if you rebuilt the teaching synthetic at 40 Hz, and which would change if you kept 25 Hz but changed the overburden velocity. As a self-check: at 40 Hz only entry 6 moves, from 1642 ms to 1646 ms, because entries 1 to 5 are computed before the wavelet is applied. A new velocity moves entries 2, 5 and 6 at once, because every time on the panel is built from it, and it can move entry 4 too, because it changes which depth samples share a time cell; the mean velocity and the maximum impedance, which never leave depth, do not move.
