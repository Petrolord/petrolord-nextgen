# Three quantile rules

{{panel:dq-outliers-explorer}}

Tukey's fences are built on the first and third quartiles, and a quartile sounds like a single well defined number. It is not quite. Between two sorted values there is a choice of where exactly the quartile falls, and different software makes that choice differently. Hyndman and Fan catalogued the rules in use. The engine implements three of them, R6, R7 and R8, exactly as NIST/SEMATECH 7.2.6.2 states them, and every result names the rule it used.

## How each rule works

Sort the N values into Y[1] to Y[N]. For a probability p, each rule computes a position h:

* R6: h = p(N + 1)
* R7: h = 1 + p(N - 1)
* R8: h = p(N + 1/3) + 1/3

Split h into its whole part k and its fraction d. The quantile is Y[k] + d (Y[k+1] - Y[k]), a straight line between the two neighbouring sorted values, clamped to the minimum and maximum. The rules differ only in where they put h, so on a long series they agree closely and on a short one they can differ visibly.

## The published anchor

The engine is checked against NIST's silicon wafer resistivities, twelve values, at the 0.9 quantile by each rule:

| rule | engine 0.9 quantile | golden | NIST printed | relative difference against golden |
| --- | --- | --- | --- | --- |
| R6 | 95.198070 | 95.198070 | 95.1981 | 0 |
| R7 | 95.195680 | 95.195680 | 95.1957 | 0 |
| R8 | 95.197243 | 95.197243 | 95.1972 | 0 |

The three rules first differ in the third decimal on twelve values, and the engine matches the golden for each one exactly.

## The same question on EKENE-7

The water sand gamma ray, entries 130 to 199, is seventy samples. Its quartiles by each rule:

| rule | first quartile | third quartile | IQR, derived |
| --- | --- | --- | --- |
| R6 | 31.817500 | 38.737500 | 6.920000 |
| R7 | 31.947500 | 38.642500 | 6.695000 |
| R8 | 31.825833 | 38.725833 | 6.900000 |

The interquartile range, Q3 less Q1, runs from 6.695000 gAPI under R7 to 6.920000 under R6. R7 gives the narrowest range here, and R8 sits close to R6. A fence built on the IQR moves with it, so the choice of rule reaches every fence in the next lesson.

## Why R7 is the default

R7 is the default of Excel, R and numpy. R6 is the rule NIST uses. The engine's default is R7, so that an engineer who checks a fence in a spreadsheet gets the same quartiles the engine used. That is a Petrolord choice, and the alternative has real merit: R6 matches the NIST handbook's own worked examples. A caller who wants R6 or R8 passes `method` and the engine uses it and names it.

Whichever rule you choose, say it. Two analysts who compute a first quartile on the same seventy samples, one in a spreadsheet and one in a statistics text, can disagree in the first decimal and both be right.

## Naming a quantile

This course names a quantile by its probability and its rule: the 0.9 quantile by R6, the first quartile by R7. It never uses a P label. P labels mean different things in different parts of the industry, depending on whether they count from the low end or the high end, and a quantile named by probability and rule has only one reading.

## Exercise

Open the explorer's fences view with the water sand gamma ray. Read Q1 and Q3 under R7 and confirm 31.947500 and 38.642500. Switch the quartile rule to R6, then to R8, and record Q1 and Q3 each time against the table above. Then, for the NIST silicon wafer row, state which of the three printed figures a spreadsheet's default percentile function would reproduce, and why.
