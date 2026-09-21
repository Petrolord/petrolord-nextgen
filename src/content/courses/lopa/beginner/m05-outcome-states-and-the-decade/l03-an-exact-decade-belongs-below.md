# An exact decade belongs to the lower SIL

{{panel:lp-worksheet}}

Bands touch. The top of one is the bottom of the next, and a value landing exactly on the join has to go one way or the other. The engine's rule is written into its band convention and applies everywhere a band is decided, so a worksheet never has to guess.

## The convention, in the engine's words

The engine states it verbatim: "IEC 61508-1 Table 2 / IEC 61511-1 low demand: SIL n holds 10^-(n+1) <= PFDavg < 10^-n; an exact decade belongs to the higher-PFD band".

Each band includes its lower PFDavg bound and excludes its upper one. A PFDavg of exactly 0.01 is SIL 1, because 0.01 is the inclusive bottom of the SIL 1 band and the excluded top of the SIL 2 band. A PFDavg of exactly 0.001 is SIL 2 for the same reason.

| SIL | PFDavg from, inclusive | PFDavg to, exclusive |
| --- | --- | --- |
| 2 | 1e-3 | 1e-2 |
| 1 | 1e-2 | 1e-1 |

A higher PFDavg is a weaker function, so the band that includes the join is the one with the weaker claim. The rule is conservative in that sense: a value sitting exactly on a boundary is given the lower SIL, and a function has to be strictly past the boundary to claim the higher band.

## The same rule read in risk reduction factors

In risk reduction factor terms the direction flips, because a larger risk reduction factor is a smaller PFDavg. A required risk reduction factor of exactly 100 is SIL 1, and a required risk reduction factor of exactly 10 is below SIL 1. A value that has just crossed a decade does not reach the higher band until it is strictly past it.

The golden cases check exactly these joins:

| golden case | required RRF | outcome |
| --- | --- | --- |
| rrf-exactly-10 | 10.000000 | RISK_REDUCTION_BELOW_SIL1 |
| rrf-exactly-100 | 100.000000 | SIL1 |
| rrf-exactly-1000 | 1000.000000 | SIL2 |
| rrf-exactly-10000 | 10000.000000 | SIL3 |
| rrf-just-above-100 | 100.000010 | SIL2 |

The last row is the contrast that makes the rule visible. At exactly 100.000000 the outcome is SIL1, and at 100.000010 it is SIL2. Ten parts in a million of extra demand moves the band, and that is what a rule with an inclusive edge looks like when you stand next to it.

It also explains a shape worth recognising on a worksheet. A row sitting within a whisker of a decade is a row whose band can be argued about, and the argument is usually really about one of the factors upstream. An IPL PFD moved from 0.1 to 0.01 moves the demand by a decade on its own, and the join then stops mattering.

## Why a rule is needed at all

The alternative would have been to leave the join undefined and let whichever comparison happened to run first decide it. That is how two engineers produce two SILs from one row. The convention is written down, it is printed in the basis `silFromPfdAvg` returns and, in its own words, in the one `lopaScenario` returns, and it is the same on every row, which is the property that matters more than which way it points.

## Exercise

Using the convention, state the band for a required risk reduction factor of exactly 1000.000000 and for one of exactly 10000.000000. Then take ORONI's 13.500000 and say how much smaller the demand would have to become before the row left SIL1, and which state it would land in.
