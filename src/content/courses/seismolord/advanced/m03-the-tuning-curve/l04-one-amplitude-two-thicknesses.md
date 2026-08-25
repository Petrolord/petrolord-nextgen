# One amplitude two thicknesses

The tuning curve rises and then falls. Any curve that does that fails to be invertible over the range where it turns, and this lesson works out exactly where the failure starts, how wide it is, and what an interpreter is supposed to do about it.

{{panel:sl-wedge-explorer}}

## The three bands

At 25 Hz the curve divides into three bands by amplitude, and the band a reading falls in decides how much it is worth.

**Below 0.08, the isolated level.** One thickness only. The rising side crosses the isolated level at about 7.5 ms and the falling side never goes below it, so any amplitude under 0.08 belongs to a bed thinner than 7.5 ms and to nothing else. In this band an amplitude is a thickness measurement.

**Between 0.08 and 0.11559, the tuning peak.** Two thicknesses. Every value in this band is produced once on the way up and once on the way down.

**Above 0.11559.** No thickness at all. This pair and this wavelet cannot make an event that bright.

The ambiguous band is narrow in amplitude, spanning a factor of only 1.445 from bottom to top, and wide in thickness, covering everything from 7.5 ms to beyond 60 ms. That is the awkward combination: small differences in amplitude map onto large differences in rock.

## The pairs, measured

Read off the 25 Hz model, with the falling side interpolated between samples:

| Rising side | Amplitude | Falling side |
| --- | --- | --- |
| 8 ms | 0.08428777 | 29.03 ms |
| 10 ms | 0.09975380 | 22.35 ms |
| 12 ms | 0.10806032 | 19.53 ms |
| 14 ms | 0.11386171 | 17.12 ms |

At 40 Hz, where the peak sits at 10 ms:

| Rising side | Amplitude | Falling side |
| --- | --- | --- |
| 6 ms | 0.09535395 | 14.78 ms |
| 8 ms | 0.10973874 | 11.83 ms |

Notice how the pairs behave as they approach the peak. At 14 ms and 17.12 ms the two candidates differ by only 22 percent, and near the apex they converge. Far from the peak they diverge violently: 8 ms and 29 ms differ by a factor of 3.6. So the ambiguity is least damaging exactly where the amplitude is highest and most damaging where it is closer to the isolated level, which is the opposite of what intuition suggests.

## The rule this produces

An amplitude read over a bed near tuning supports two thickness estimates, and reporting one of them without the other is not a simplification, it is a suppressed result.

The professional form of the answer is a sentence with three parts: the two candidate thicknesses, the assumptions that produced them, and the observation that would separate them. For example: *the mapped amplitude of 0.0998 over the sand is consistent with 10 ms or with about 22 ms of bed, assuming a 25 Hz wavelet and a reflection pair of plus or minus 0.08 from the type well, and the peak to trough separation on the trace will separate the two because the thick case gives a separation near 22 ms while the thin case cannot give less than about 12 ms.*

## What breaks the tie

Four things, in rough order of reliability.

**Well control.** A penetration measures the thickness directly. One well inside the ambiguous area often settles the whole map, because the two branches make very different predictions everywhere else.

**Peak to trough separation.** Above tuning it tracks true thickness. Below tuning it flattens onto a floor. Module 4 measures the floor, and it is the reason this is a usable discriminator rather than a hopeful one.

**Frequency.** The two branches move differently when the wavelet changes, because the tuning thickness moves and the isolated level does not. Running the same trace through a higher frequency band and watching whether the event brightens or dims tells you which side of the peak it sits on.

**Geological context.** Thickness maps have shapes. A branch that puts the thickest rock on the flank and the thinnest at the crest is usually the wrong branch. This is the weakest of the four and the most often used alone.

## Worked example

A horizon maps at 0.108 across a prospect where the type well gives a pair of $\pm 0.08$ and processing reports a dominant frequency near 25 Hz. Give the full answer.

From the 25 Hz table, 0.10806 occurs at 12 ms on the rising side and at 19.53 ms on the falling side. In bed thickness at the course velocity of 2000 m/s those are 12 m and 19.5 m, a difference of 63 percent in rock volume. Both are consistent with the amplitude. The peak to trough separation resolves it: about 16 ms in the thin case, against about 19.5 ms in the thick case. Those are close enough that on noisy data the test may not settle it, which is itself worth reporting.

## Exercise

At 40 Hz the model gives an amplitude of 0.10974 at 8 ms. State the other thickness consistent with that amplitude, then state whether the ambiguity at 40 Hz is worse or better than the ambiguity at 25 Hz for a bed known to be somewhere between 8 and 12 ms.

As a self-check: the other candidate is about 11.8 ms. For a bed in the 8 to 12 ms range the 40 Hz ambiguity is worse, because at 40 Hz that range straddles the tuning peak at 10 ms so both branches are in play, whereas at 25 Hz the whole range sits on the rising side below the 16 ms peak and the amplitude there has a single thickness for each value.
