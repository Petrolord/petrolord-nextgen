# The fit reads the data

The last lesson ended with two answers to the same question. Put them side by side.

| source | mudline transit time (us/m) | compaction constant |
|---|---|---|
| the least squares fit through the twelve picks | 650.0000000000014 | 0.7000000000000015 per km |
| the well's own header | 656 | 0.0006 per m, which is 0.6 per km |

The fit was exact. The residuals were zero to fourteen digits. And it disagrees with the label on the well. This is the most important thing in the course, so it is worth being slow about.

## Neither number is wrong

The fit is not broken. Hand it the twelve picks and the correct answer to the question "what exponential passes through these points" is a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km. Any other pair of parameters would fit those points worse. There is no arithmetic error to find.

The header is not lying either. The well's normal compaction trend, the one the sonic log was built around and the one that reads 317.2847498247154 us/m at 2500 m where the log reads the same value, does have a mudline transit time of 656 us/m and a compaction constant of 0.0006 per m.

What happened is the plain thing. The picks were drawn on a different trend from the one in the header, and the fit reported what the picks actually say. It answered the question it was asked, about the data it was given, and it answered correctly.

## The general statement

A fitted trend describes the data you gave it.

That sentence carries the whole lesson. Least squares has no opinion about geology. It does not know that a pick came from a sand, or from a washed out interval, or from an overpressured shale three hundred metres below the onset of overpressure. It knows twelve pairs of numbers, and it returns the parameters that best describe those twelve pairs, with as many digits as you care to print.

So the quality of a trend is the quality of its picks, and nothing about the fitting step can improve on them. If you hand it shale picks from a normally pressured section, it returns the shale trend. If you hand it the wrong points, it returns a confident number describing the wrong points. The confidence is the dangerous part. Nothing in the output distinguishes the two cases, and the exactness of the fit here is not evidence that the trend is right for the well. It is only evidence that the picks were consistent with each other.

## What it costs downstream

The trend is not the answer to anything by itself. It is the reference the log is measured against, so it enters the pressure calculation at every depth. Compare the two trends down the well:

| z (m bml) | well trend (us/m) | fitted trend (us/m) |
|---|---|---|
|    0 | 656.000000 | 650.000000 |
| 1000 | 459.281873 | 433.531681 |
| 2000 | 351.320676 | 326.036694 |
| 2500 | 317.284750 | 294.722796 |
| 3000 | 292.070315 | 272.656264 |
| 4000 | 259.553028 | 246.148327 |

They differ at every depth below the mudline, and the difference is much larger than the 0.5 us/m tolerance the capstone allows on a transit time. At the Intermediate tier the pressure prognosis is driven by the ratio of the trend value to the log value at each depth, so two trends that disagree like this produce two different pressure profiles from the same sonic log. The prognosis inherits the picks.

## The habit

Before you build anything on a fitted trend, check that its parameters are physically sensible. Four checks cover most of it.

Is the mudline transit time plausible for water rich sediment at the seabed, in the high hundreds of us/m. A fitted value of 300 us/m is describing a mudline that is already compacted, which does not happen.

Is the mudline transit time above the matrix transit time. The engine enforces this and throws if it is not, but the margin matters too. A fitted mudline value only a little above the matrix leaves the exponential almost no range to work in.

Is the compaction constant in the range the basin supports, a few tenths per km. Check it in the same units every time. This course quotes the fitted constant as 0.7000000000000015 per km and the well's own as 0.0006 per m, and the factor of a thousand between those two conventions is an easy mistake to make in a hurry.

Does the fitted curve overlay the log through the normally pressured section. This is the check that would have caught the discrepancy here, and it costs one plot.

None of these are numerical tests. They are you asking whether the number describes a rock. The fit cannot do it for you, because from inside the fit every dataset looks like the right dataset.

Set the panel to a depth in the normally pressured section and read the two trend values there against the log.

{{panel:pp-frame-explorer}}

## Exercise

You have a fitted trend at 650.0000000000014 us/m and 0.7000000000000015 per km, and a well header saying 656 us/m and 0.0006 per m. Say which one you would carry into a pressure prognosis, and name the first thing you would check.

Self check: neither can be chosen on the strength of the numbers alone, because the fit is exact for its picks and the header is correct for the model the log was built on. The first check is to plot both curves on the sonic log and see which one the log follows through the section you believe is normally pressured, which in this well is everything above 2500 m below the mudline. After that, look at where the twelve picks sit. Four of them, at 2600, 2900, 3200 and 3500 m, are below the depth at which this well departs from normal compaction, and picks taken below the onset of overpressure are a standard way to bias a trend. A trend built only on picks you can defend as normally pressured shale is the one to carry forward.
