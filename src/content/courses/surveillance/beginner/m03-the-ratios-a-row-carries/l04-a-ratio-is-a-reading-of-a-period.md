# A ratio is a reading of a period

A ratio on one row is unambiguous. A ratio over a period is not, because there are two defensible ways to form it out of the same rows and they are different numbers.

{{panel:pd-ledger-explorer}}

## The two readings

A mean of daily ratios takes the watercut or the gas-oil ratio off each row and averages those, unweighted. It answers what a typical day of this well looked like. A volumetric ratio sums the volumes over the period first and divides once. It answers what this period produced.

`detectExceptions` calls `windowMean` on the `gor` and `watercut` keys, so it takes the mean of the daily ratios. `computeKpis` takes the mean of the field oil, the mean of the field water and the mean of the field gas, and forms the ratios off those means, so it is volume weighted by construction. `buildFieldSeries` is volumetric too, per day, across the whole field at once. All three are in the shipped studio.

## Where the two cannot disagree

The teaching well OGUTA-2 was invented for this course and is neither real nor published. Its baseline window holds 30 rows carrying 31167.000000000 stb of oil, 9661.770000000 stb of water and 18076.860000000 Mscf of gas, and its daily ratios do not move at all: every baseline day reads a watercut of 0.236641221374 and a gas-oil ratio of 580.000000000 scf/stb. So the baseline gas-oil ratio is 580.000000000 scf/stb read as a mean of daily ratios and 580.000000000 scf/stb read volumetrically, a difference of -0.000000000000.

When the daily ratio is constant the two readings are one number, which is why a window of uniform days cannot show the problem at all.

## Where they do

The same well's recent window holds 7 rows carrying 4327.000000000 stb of oil, 1964.000000000 stb of water and 2792.000000000 Mscf of gas. Read as a mean of daily ratios its gas-oil ratio is 1066.663410762250 scf/stb, read volumetrically it is 645.250751097758 scf/stb, and the first is 1.653099061020 times the second. Its watercut reads 0.451386451920 as a mean of daily ratios and 0.312192020347 volumetrically.

Neither reading is wrong. They answer two different questions off identical rows, and nothing in a returned number says which was asked.

## The mistake

Quoting a period watercut or gas-oil ratio without naming the reading. It is not a rounding difference and it is not a defect in either function. A surveillance tool needs the mean of daily ratios to spot a well that has changed and the volumetric one to book a barrel, and the sentence carrying the number has to say which of the two it is.

## Exercise

Read the OGUTA-2 recent window in the panel and write down its gas-oil ratio both ways.

Then say which of the two you would quote to somebody asking how much gas the period made, and which to somebody asking whether the well changed.
