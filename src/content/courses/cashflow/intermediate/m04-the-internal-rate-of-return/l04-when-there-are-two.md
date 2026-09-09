# When there are two

A vector whose last entry is negative has an NPV curve that crosses zero twice. The engine reports one crossing, does not say which, and does not say that there was another.

{{panel:ec-time-explorer}}

## The published vector

two_roots_2_and_6 is [-100, 208, -108.12]. Its sampled NPV curve:

| rate, percent | NPV |
| --- | --- |
| 0 | -0.120000 |
| 1 | -0.049015 |
| 2 | -0.000000 |
| 3 | 0.028278 |
| 4 | 0.036982 |
| 5 | 0.027211 |
| 6 | 0.000000 |
| 7 | -0.043672 |
| 10 | -0.264463 |
| 20 | -1.750000 |

The engine reports 6.0000 percent. The golden records 2.0000 percent, the oracle's root, and the NPV is printed as 0.000000 at both. Newton starts at 10 percent, where the curve reads -0.264463 and rises toward the root at 6, so 6 is where it lands. The oracle reports the root nearest zero on the positive side, the hurdle-rate region. The recorded note on the case says that the method statement does not choose, that both zero the NPV, and that the choice is an owner decision.

The reported root is an accident of the start. two_roots_10_and_20, [-100, 230, -132], has roots at 10 and 20 percent and reports 10.0000, because Newton begins on one. three_roots_0_7_33, [-100, 340, -382.4, 142.4], reads 0.000000 at 0 percent, -0.005143 at 7, 0.010161 at 8, 0.081930 at 30 and -0.012624 at 33. The engine reports 7.3509 percent and the oracle 0.0000.

## Why a terminal negative does it

At very negative rates the discount factor on the last entry is enormous, so a negative last entry drags the NPV down without limit: two_roots_2_and_6 reads -8832.000000 at -90 percent. At very high rates every later entry vanishes and the NPV tends to the first entry, -100, negative too. A curve that is negative at both ends and positive anywhere between must cross zero twice at least, and an even number of times.

## AKATA

AKATA with an abandonment of 60000000 in 2035 ends in -29598201.95. Its NPV is 81637829.18 at 0 percent and -78880508.48 at 100 percent, so it is positive in the middle and negative at the ends, and it has two roots. The engine reports 23.2570 percent, and the headline NPV at the configured rate is 38666394.86. Nothing in the return says a second root exists.

## The mistake

The careful mistake is to take 6.0000 percent to a hurdle of 5 percent and approve. The NPV at 5 percent is 0.027211, positive, so on this vector the approval happens to hold. The same reasoning on three_roots_0_7_33, 7.3509 percent against a hurdle of 5 percent, approves a vector whose NPV at 5 percent is -0.028075. A root is where the curve is zero; a comparison with a hurdle needs the sign of the curve at the hurdle, which is the NPV, not a root.

## What it refuses

It refuses to count the roots, to flag a multi-root profile, or to choose the hurdle-side root. The choice is recorded as an owner decision and not yet made, so the reported IRR on any terminal-negative vector is one of two, and the reader must supply the other.

## Exercise

From the sampled curve of two_roots_2_and_6, write the sign of the NPV at 1, 4 and 7 percent, and say from those three signs alone why there must be two roots. Then say which root a finder started at 3 percent would reach, and why that would not be an error either.
