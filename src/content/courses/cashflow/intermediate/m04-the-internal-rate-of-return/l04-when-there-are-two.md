# When there are two

A vector whose last entry is negative has an NPV curve that crosses zero twice. The engine names neither crossing: it reports null, says multiple-roots, and lists the roots it found.

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

The curve is zero at 2 percent and again at 6. Both lie inside the band from -99 to 1000 percent, so the engine refuses to call either one the IRR: irr is null, irrStatus is multiple-roots, and the roots are listed beside the status as 2.0000 and 6.0000 percent.

The same rule catches every vector of the shape. two_roots_10_and_20, [-100, 230, -132], is null with 10.0000 and 20.0000 listed. two_roots_5_and_50 is null with 5.0000 and 50.0000. three_roots_0_7_33, [-100, 340, -382.4, 142.4], is null with 0.0000, 7.3509 and 32.6491. one_in_band_one_above, [-1, 30, -200], is null with 900.0000 listed and irrRootAboveBand set, its other crossing being past the top of the band.

## Why a terminal negative does it

At very negative rates the discount factor on the last entry is enormous, so a negative last entry drags the NPV down without limit: two_roots_2_and_6 reads -8832.000000 at -90 percent. At very high rates every later entry vanishes and the NPV tends to the first entry, -100, negative too. A curve that is negative at both ends and positive anywhere between must cross zero twice at least, and an even number of times.

## AKATA

AKATA with an abandonment of 60000000 in 2035 ends in -29598201.95. Its NPV is 81637829.18 at 0 percent and -78880508.48 at 100 percent, so it is positive in the middle and negative at the ends, and it crosses twice. The engine reports IRR null. The headline NPV at the configured rate is still 38666394.86, the number a decision is made on.

## Why no root is chosen

A finder that reports whichever root it reaches first lets the starting point decide. A Newton search from 10 percent on two_roots_2_and_6 can settle on 6.0000 percent and say nothing of 2.0000; on three_roots_0_7_33 it can settle on 7.3509 and miss 0.0000 and 32.6491. So the engine lists every root it found in the band and names none of them.

## The mistake

The careful mistake survives the null. It is to take any single rate to a hurdle and approve. Carry 6.0000 percent to a hurdle of 5 percent and the approval happens to hold, because the NPV at 5 percent is 0.027211. The same reasoning on three_roots_0_7_33, 7.3509 against 5 percent, approves a vector whose NPV at 5 percent is -0.028075. A root is where the curve is zero; a hurdle comparison needs the sign of the curve there, which is the NPV.

## What it refuses

It refuses to choose a root, and it refuses to pretend a multi-root vector has an IRR. It refuses to look outside the band. And it refuses to make the decision: what the roots mean against a hurdle is the reader's to work out.

## Exercise

From the sampled curve of two_roots_2_and_6, write the sign of the NPV at 1, 4 and 7 percent, and say from those three signs alone why there must be two roots. Then say what the engine returns for this vector, and which number a hurdle comparison should use instead.
