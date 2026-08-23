# Statistics over finite samples

Every number the QC panel quotes for a curve, its mean, its first reading and its last reading, is computed over the finite samples only. Never over the raw column. That distinction is the whole content of this lesson, and it is the point where the previous three lessons turn into arithmetic that either holds up or does not.

## The rule

A curve's column has two populations in it: real measurements and sentinel values standing in for measurements that do not exist. A statistic describes a population, so the first job is to say which population. The answer is always the finite samples: the cells that carry a reading. The sentinels are not small readings or extreme readings, they are not readings at all, and including them does not make a statistic noisier, it makes it meaningless.

For basic_20's gamma ray the split is: 301 samples in the column, 8 of them flagged null, so $301 - 8 = 293$ finite samples. The mean over those 293 is 64.9272 GAPI. That is the value the QC panel shows, and it is one of the six numbers the Associate capstone grades, to a tolerance of 0.05.

## What inclusion costs

Work the poisoning explicitly. The finite samples sum to $293 \times 64.9272 = 19023.6696$. If the eight sentinels of -999.25 were treated as data, the sum would gain $8 \times (-999.25) = -7994.00$ and the divisor would become 301:

$$\frac{293 \times 64.9272 + 8 \times (-999.25)}{301} = \frac{11029.67}{301} = 36.6434$$

Look hard at that result before moving on. It is 36.64 GAPI, roughly 28 GAPI below the truth, and it is a completely believable gamma ray. Nothing about it announces itself. Written into a report it reads as a clean sand where the real column is a mixed section, and no reviewer would ever query it.

Contrast the same file's bulk density, which carries 9 nulls out of 301 and a finite mean of 2.3393. Poison it the same way and you get $(292 \times 2.3393 + 9 \times (-999.25)) / 301 = -27.6086$, a negative bulk density, which is physically impossible and would be caught by anyone who glanced at it.

So the danger is not proportional to the damage. A heavily poisoned statistic often looks absurd and gets caught. A lightly poisoned one, a curve with two or three sentinels leaking into the sum, lands somewhere plausible and survives every review. If only two of basic_20's eight sentinels slipped through, the mean would read 57.7124 instead of 64.9272: wrong by more than seven units, and entirely respectable-looking. Silent errors are the expensive ones.

A second, quieter mistake lives in the divisor. Suppose you correctly excluded the eight sentinels from the sum but divided by 301 anyway: $19023.6696 / 301 = 63.2016$. No impossible values, no warning, just a mean pulled down by the fraction of the column that is missing. Sum over the finite samples, then divide by the count of finite samples. Both halves, every time.

## First finite and last finite

The other two statistics on the QC row are the bounds of where the curve actually carries data. For basic_20's gamma ray the first finite value is 43.14 at 1500.0 m and the last finite value is 56.76 at 1650.0 m. The column may be declared over a wider depth range, but those two depths are where real gamma ray begins and ends, and the difference, 150.0 m, is the interval the curve can honestly support.

That matters for the decision every data manager makes at import: what is the usable interval? If four curves are needed for a petrophysical evaluation, the usable interval is the overlap of their finite ranges, not the union of their declared ranges. Reading first finite and last finite per curve is how you find that overlap in seconds instead of scrolling a grid.

## Why NaN is the safety net

The parser converts every flagged value to NaN rather than leaving -999.25 or -9999 in place. NaN is contagious: any sum, mean or comparison that touches it returns NaN. Code that forgets to filter therefore produces a visibly broken answer instead of the quietly wrong 36.6434 above. The engine then filters to the finite samples deliberately, and the panel's mean column is finite-only by construction. You are not expected to correct it by hand; you are expected to know what it means.

The dead curve completes the picture. nullheavy_20's NPHI is 201 nulls out of 201 samples, so its finite population is empty. There is no mean, no first finite and no last finite, and the panel leaves those cells blank. Blank is the correct answer, not zero. A zero would claim a measurement that was never made.

## Exercise

Using basic_20, compute the finite sample count and confirm the divisor for each of these: GR with 8 nulls, RHOB with 9 nulls, and NPHI with 0 nulls, all from 301 samples. Then state what nullheavy_20's GR divisor is, given 71 nulls of 201. As a self-check: GR 293, RHOB 292, NPHI 301, and nullheavy_20's GR uses 130. Finally, take nullheavy_20's GR finite mean of 44.3489 and work out what a reader would report if it divided the correct finite sum by 201 instead of 130. As a self-check: $44.3489 \times 130 = 5765.357$, and $5765.357 / 201 = 28.6834$, a gamma ray understated by more than a third with nothing on the page to show it.
