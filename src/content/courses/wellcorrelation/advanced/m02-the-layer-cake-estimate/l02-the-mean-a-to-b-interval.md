# The mean A to B interval

The layer-cake estimate needs one number before it can do anything: a single TOP_A to TOP_B interval that stands for the whole section. Three wells carry both surfaces and they give three different answers, so the first job is to turn three measurements into one working value. This lesson does that, checks it, and then looks hard at what the single value threw away.

## The three intervals

Each interval is one subtraction inside one wellbore. Do them separately and write the well name beside each result.

Ekene-1: 1640 minus 1500 is 140 m.

Ekene-2: 1662 minus 1512 is 150 m.

Ekene-3: 1628 minus 1495 is 133 m.

Both depths in each subtraction come from the same hole, which is what makes each result a measurement rather than a comparison between wells. That distinction is easy to lose and it is the reason the arithmetic is laid out one well per line.

## The mean

$$\frac{140 + 150 + 133}{3} = \frac{423}{3} = 141$$

The mean TOP_A to TOP_B interval is 141 m. It is graded to a tolerance of 0.01 m, so the value is expected exactly rather than approximately. The sum of 423 is worth writing down as you go, because a mean quoted with no visible sum cannot be checked by a reader and cannot be checked by you a week later.

The result is an interval, so it is in metres, it is positive, and it is not a depth. Nothing is at 141 m. The number is a distance between two surfaces, and treating it as a depth is the first way this calculation goes wrong.

## The spread you just discarded

The three inputs run from 133 m in Ekene-3 to 150 m in Ekene-2, so they span 17 m. Set the mean beside them and the deviations are small in one well and not small in the others: Ekene-1 is 140 against 141, which is 1 m below the mean; Ekene-2 is 150 against 141, which is 9 m above; and Ekene-3 is 133 against 141, which is 8 m below.

A mean of 141 m therefore represents Ekene-1 well and represents the other two poorly. That is not a flaw in the arithmetic. It is what a mean does. It returns a single value and hides the fact that the values it came from disagreed by 17 m.

Keep the 17 m written next to the 141 m from here on. The mean is what you compute with, and the spread is what tells your reader how much the mean deserves to be trusted. Quoting one without the other is the most common way a defensible calculation becomes a misleading one.

Note also that the spread is a floor rather than an estimate. Three wells set a range, and a fourth well carrying TOP_B could only leave the range where it is or widen it. The section's real variation in this interval is at least 17 m.

## Why the mean, and not something else

Three candidates were available and the mean is the right one here, for reasons worth being able to state.

The mean uses all three observations, and with three of them you cannot afford to discard any. The median would return 140 m, which is Ekene-1's value, and it would silently drop the information in the other two wells. On a sample of three, a median is close to picking a well and calling it representative.

Neither extreme is defensible without a reason. Choosing 150 m or 133 m is a claim that Ekene-4 resembles one particular well, and nothing in the data supports that claim about the TOP_A to TOP_B interval.

The mean also has one property that matters for what follows. It is the value that makes the errors in the three wells balance out, which makes it the natural central estimate when you have no basis for preferring any well. That is a modest justification, and it is the honest one. The mean is the best available summary of three wells you have no reason to rank, and it is not a measurement of the section.

## An exact number, and why that matters

The division comes out even. 423 divided by 3 is 141 with nothing left over, so the mean is exact and there is no rounding decision to make and none to disclose. That is a property of this fixture rather than of the method, and it is convenient, because it means any disagreement between your answer and the panel is a mistake rather than a difference in how the two of you rounded.

It also explains the tolerance. A graded tolerance of 0.01 m on a number that is exactly 141 is not there to accommodate rounding. It is there so that a learner who carries a value through a spreadsheet is not failed by floating-point noise. Treat the target as 141 exactly, and if your working produces anything else, look for the arithmetic slip rather than reaching for the tolerance.

## Checking it

Two checks cost nothing and catch most mistakes.

Bracket the answer. A mean must fall between the smallest and largest inputs, so 141 must sit between 133 and 150. It does. A mean outside its own inputs means an arithmetic slip, and the check takes a second.

Check the direction of each subtraction. TOP_B is deeper than TOP_A in every well, so each interval must be positive. A negative interval means the subtraction ran the wrong way, and the resulting mean would be nonsense while still looking like a number.

The panel below reports the three intervals and their mean for whichever starting marker you select, so you can compare it against the arithmetic above.

{{panel:wc-prediction-explorer}}

## Exercise

Recompute the mean TOP_A to TOP_B interval with Ekene-2 excluded, using only Ekene-1 and Ekene-3, and compare it with the three-well value of 141 m. Then say in one sentence what the size of that change tells you about how much weight a single well carries in this estimate.

Self-check: without Ekene-2 the intervals are 140 m and 133 m, their sum is 273, and the mean is 273 divided by 2, which is 136.5 m. That is 4.5 m shallower than the three-well mean of 141 m, and dropping one well of three moved the answer by more than four metres. A single well carries about a third of the weight in this estimate, so the prediction is only as settled as its least settled input pick, and any revision to one TOP_B pick moves the result by roughly a third of the revision.
