# Two blocks from the Application Guidelines

{{panel:prms-aggregation-calculator}}

The Guidelines for Application of the PRMS (November 2011) work an aggregation of two gas blocks. That edition prints no licence, so the course treats it as copyright and uses its numbers and section numbers only; the 2022 revision is sold and was not read. The figures below were read on 2026-09-27.

## What the Guidelines print

Section 6.3 and Table 6.2 give two blocks, A and B, in thousand million cubic metres: an expectation of GIIP of 53.4 and 35.6, a Proved GIIP of 43.3 and 28.5, and a total Proved of 71.8. Fig. 6.5 prints the arithmetic Proved as 72 and the probabilistic Proved of independent blocks as 77.

## The reading the golden case takes

The Guidelines add the blocks by error propagation for symmetric distributions (section 6.3.3). The golden case reads each block as a normal distribution, with the printed expectation as its mean and the expectation less the Proved as its 90 percent half-width. That reading is the Guidelines' own; the engine takes whatever distribution a call states.

| block | mean | standard deviation | low estimate (engine) | Proved printed (text) |
| --- | --- | --- | --- | --- |
| A | 53.400000 | 7.881072 | 43.300000 | 43.3 |
| B | 35.600000 | 5.540159 | 28.500000 | 28.5 |

## Three totals

The arithmetic sum by category is a low of 71.800000, a best of 89.000000 and a high of 106.200000 (engine). The Guidelines print 71.8 in the table and 72 on the figure: the figure rounds the table.

With the blocks independent (a correlation of 0), seed 2011 and 200000 draws, the sampled P90 is 76.623299, the P50 89.004415 and the P10 101.376062. The Guidelines print 77. These are Monte Carlo estimates. The exact low of a sum of two independent normals is 76.654150: the sum of the expectations, 89.000000, less the square root of the sum of the squared half-widths 10.100000 and 7.100000. The sampled P90 misses it by 0.030852 at these 200000 draws.

With near total dependence (a correlation of 0.999, the same seed and draws), the sampled P90 falls back to 71.774133, beside the arithmetic 71.800000: the sum of the lows is the low of the total when the blocks move together.

## The same blocks as lognormals

A lognormal through the same expectation and Proved has a standard deviation of 8.289303 for A and 5.848198 for B; the engine reads their low estimates back as 43.300000 and 28.500000. On seed 2011 and 200000 draws the sampled P90 of the total is 76.434906. The reading moves the figure. The golden case takes the Guidelines' symmetric reading, the course names both, and neither sampled figure is graded.

## What the example teaches

A published example checks the engine only as far as its reading is stated. The normal reading reproduces the printed 71.8 exactly and lands within sampling error of the exact independent low; a second reading of the same numbers gives a different sampled total. A report that quotes a probabilistic total names the distributions it assumed.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "The 2011 Guidelines blocks, independent". Read the arithmetic table and the Monte Carlo table with its seed and draws. Switch to "The 2011 Guidelines blocks, near total dependence" and compare the P90. Then return to the independent start, set each project's distribution control to "lognormal", state the means 53.4 and 35.6 and the standard deviations 8.289303 and 5.848198, and read the new P90 with its seed and draws.
