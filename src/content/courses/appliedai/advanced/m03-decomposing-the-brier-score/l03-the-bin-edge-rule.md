# The bin-edge rule and the library rule

{{panel:ae-trust-explorer}}

A probability given to 2 decimals often lands exactly on a bin edge. With 10 bins, 0.3 is both the top of bin 2 and the bottom of bin 3, and a rule has to say which bin it belongs to. The rule is a choice, two common tools choose differently, and the reliability table moves with the choice.

## The engine's rule

The bin basis states it:

> bins: `10 equal-width bins: p is in bin i when i/10 <= p < (i+1)/10 (edges as computed in double precision), the last bin closed at 1; an empty bin has null means and is skipped`

A probability exactly on an interior edge opens the upper bin: 0.3 goes to bin 3. The one exception is the top, where 1 closes the last bin. The edges are the doubles i/M as the machine computes them, and a probability typed as 0.3 is compared with the double 3/10. This is numpy histogram's rule.

scikit-learn's calibration_curve does the opposite at an interior edge: it puts the value in the LOWER bin, so 0.3 lands in bin 2. Neither rule is wrong. They are two conventions, and a table from one need not match a table from the other.

## How much it matters on the Ekene set

Counted over the whole calibration set, 17 probabilities sit exactly on an interior edge at 10 bins, with the values 0.1, 0.2, 0.3, 0.4 and 0.6. The course derived the library rule's table on the same rows. The engine does not implement that rule; the derived figures are there to compare:

| bin | engine rows | library-rule rows (derived) | library-rule gap (derived) |
| --- | --- | --- | --- |
| 0 | 19 | 21 | 0.020952 |
| 1 | 36 | 36 | 0.120000 |
| 2 | 39 | 41 | 0.107073 |
| 3 | 28 | 29 | 0.220345 |
| 4 | 15 | 10 | 0.234000 |
| 5 | 16 | 20 | 0.410500 |
| 6 | 15 | 11 | 0.665455 |
| 7 | 3 | 3 | 0.723333 |
| 8 | 8 | 8 | 0.602500 |
| 9 | 21 | 21 | 0.069524 |

Six of the ten bins hold a different number of rows. The summaries:

| figure | engine rule | library rule (derived) |
| --- | --- | --- |
| ECE | 0.209300 | 0.209300 |
| MCE | 0.723333 | 0.723333 |
| REL | 0.080032 | 0.078849 |

ECE is the same because every bin on this set is over-confident, so moving an edge row between two over-confident bins leaves the pooled gap unchanged. MCE is the same because the largest gap is in bin 7, which holds no edge value. REL differs by -1.18e-3. On another set, with bins on both sides of the diagonal or an edge value in the worst bin, ECE and MCE would be exposed too.

## What to do about it

Name the rule whenever a table from this engine is compared with the library's. A reliability table, an ECE, an MCE or a Murphy term quoted without its bin count and its edge rule cannot be reproduced to six decimals by someone using the other convention. The Brier score and log loss need neither, because they use no bins.

The boundary is tabled rule by rule later in this tier: p = i / M opens bin i, scikit-learn closes bin i - 1 at that value, and p = 1 is in bin M - 1, closed, with no bin above it.

## Exercise

Open the trust explorer on "A boundary rule, probed" and choose the rule "a calibration bin edge". Probe 0.3 at 10 bins and read the bin; then probe 0.29 and 0.31. Probe 1 and read the bin. Change the bins to 4 and probe 0.25 and 0.5. For every probe, write the bin the engine chose and the bin scikit-learn's rule would choose, and mark the ones that differ.
