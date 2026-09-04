# The story so far

A diagnosis is a straight line through part of a plot, and the part is chosen by the analyst.

## The claim

`chanDiagnosis` does not read a history. It reads a tail of one, fits two lines through it and compares one of them against a number somebody chose. Everything a verdict is worth follows from that.

**The window.** The tail is set by `lateFraction`, default 0.5, clamped to the range 0.1 to 1.0 with no notice when the clamp fires. On teaching well ELELENWO-4, a case this course built rather than a published one, 38 samples running from 15.000 to 3600.000 days, the default opens the window at 250.242976 days and keeps 19 of them. The window start is the only dimensional number the diagnosis returns.

**The two fits.** One call returns two slopes measured on two different sets of samples. The ratio slope is 1.040602176 over all 19 late samples across 1.157940604 log cycles at a fit quality of 0.921895186 as a fraction. The derivative slope is 1.442132492 over the 15 samples with a positive derivative, across 0.900620470 log cycles at 0.998513658. They are 0.401530316 apart and the object says nothing about the difference.

**The threshold.** The derivative slope alone picks the mechanism. Against a channelling boundary of 1.3 the margin is 0.142132492322, and because that is inside an ambiguous band of 0.25 the reading comes back ambiguous with low confidence. The dial is worth more than the margin: across its range the same 38 samples give derivative slopes from 1.229355999 to 1.600276347, a move of 0.370920348, and the mechanism changes on the way.

**The alternative.** What a stimulation buys is a ratio of two geometry groups. On that well, a drainage radius of 1180 ft and a wellbore radius of 0.354 ft, the floor the geometry allows is a skin of -7.361728083308 and a skin of 7.5 puts the denominator at 14.861728083308. An acid job to -2.2 is worth a multiplier of 2.879215612184.

**The screening.** The mechanism becomes seven verdicts. The water cut gate opens the shutoff at 30.0 percent before any mechanism is read, the gas gate is a factor of two on an expected ratio the user typed, and only the water shutoff is ever blocked.

## The one sentence

Every verdict here is the engine asserting something with nothing behind it. The oracle checks the log-log slope by Theil-Sen and the skin multiplier by a radial Darcy rate in SI, and it asserts no mechanism, no confidence, no verdict and no block reason anywhere.

## Exercise

Write out the window, the two fits, the threshold, the alternative and the screening in one sentence each, and beside each the number you would use to defend it.

Then say which single field of the diagnosis, if quoted alone, would let a reader reproduce your verdict.
