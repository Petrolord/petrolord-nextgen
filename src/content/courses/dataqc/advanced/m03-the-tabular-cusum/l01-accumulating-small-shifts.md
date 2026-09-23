# Accumulating small shifts

{{panel:dq-monitor-explorer}}

The tabular CUSUM keeps two running sums, one for readings above target and one for readings below. S_hi(i) = max(0, S_hi(i-1) + x_i - target - k) and S_lo(i) = max(0, S_lo(i-1) + target - k - x_i), both starting at 0, and a signal is either sum strictly above h. On the NIST/SEMATECH 6.3.2.3 example, with a target of 325, k 0.317500 and h 4.195900 in the data's units, S_hi climbs from 0.000000 at group 12 to 3.007500 at group 13 and 4.940000 at group 14, and group 14 is the first upper signal.

| group | x - 325 | S_hi | S_lo | cumulative sum |
| --- | --- | --- | --- | --- |
| 11 | -0.375000 | 0.000000 | 0.312500 | -2.650000 |
| 12 | 0.150000 | 0.000000 | 0.000000 | -2.500000 |
| 13 | 3.325000 | 3.007500 | 0.000000 | 0.825000 |
| 14 | 2.250000 | 4.940000 | 0.000000 | 3.075000 |
| 15 | 2.825000 | 7.447500 | 0.000000 | 5.900000 |

## What each term does

x_i - target is how far the reading sits above target. Subtracting k takes away an allowance, so a reading only adds to S_hi when it exceeds the target by more than k. The max(0, ...) keeps the sum from going negative: readings below target drain S_hi back towards zero and no further. S_lo does the same on the low side. Between them, a run of readings a little above target builds S_hi a step at a time, while scatter around target keeps being reset to zero.

## Why it sees a small shift

A single reading slightly above target is ordinary, and an individuals chart would not signal on it. The CUSUM asks a different question: whether the readings have been on one side, by more than k, for long enough that their total passes h. A persistent shift smaller than the individuals limits can do that, a step at a time, as groups 13 and 14 do on NIST's page.

## The plain cumulative sum

The engine also returns the plain cumulative sum of x - target, the last column of the table. It carries no allowance and no floor at zero. It rises and falls with every reading, and its slope over a stretch shows the level of that stretch against target. It does not signal; the tabular sums do.

## On EKENE-3

With a target of 611.380000 psig and sigma 3.774063 psi from phase one, and k 0.5 and h 4 in sigma units, k is 1.887031 psi and h is 15.096251 psi. The first upper signal is day 8, at the glitch, where S_hi jumps to 26.197812. The first lower signal is day 21, where S_lo reaches 19.657812, and from day 21 to day 40 S_lo stays above h on every day. The shift planted from day 16 has been gathered into S_lo one day at a time: 4.992969 on day 16, 8.378906 on day 18, 14.164843 on day 20.

## Exercise

Using the NIST table, start from group 12's S_hi of 0.000000 and add group 13's x - 325 of 3.325000 less k 0.317500. Check your answer against 3.007500, then carry it on to group 14 and confirm it passes h 4.195900. In the panel's CUSUM view, read EKENE-3's S_lo for days 16 to 21 and mark the first day it passes 15.096251.
