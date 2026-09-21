# Brief and Scala, daily

{{panel:hy-protection-chemicals}}

For a 10.000000 hour shift the Brief and Scala daily reduction factor is 0.700000, so a limit of 100 becomes 70.000000. At 12.000000 hours the factor is 0.500000, at 16.000000 hours 0.250000 and at 20.000000 hours 0.100000. The BC Occupational Health and Safety Regulation prints those four factors, and the engine reproduces all four.

## The formula

Brief and Scala (1975), Am Ind Hyg Assoc J 36:467, adjust an eight-hour chemical exposure limit for a longer shift with a daily reduction factor:

RF = (8/h) x (24 - h)/16

The course prints that formula and measures its denominators, and it prints no reading of the two parts, so take this as background. The first part is usually read as scaling the amount taken in, since a worker on a longer shift breathes the air for more hours. The second is read as scaling the recovery time, since an eight-hour day leaves 16 hours away from the air and a longer shift leaves fewer. The factor multiplies the eight-hour limit. The engine's door is `briefScalaDailyRf`, and the golden classes it PUBLISHED, REPRODUCED, with 4 published cases, 3 oracle-only ones and 2 refusals.

| shift, hours | daily factor | adjusted limit for a limit of 100 |
| --- | --- | --- |
| 8.000000 | 1.000000 | 100.000000 |
| 9.000000 | 0.833333 | 83.333333 |
| 10.000000 | 0.700000 | 70.000000 |
| 10.500000 | 0.642857 | 64.285714 |
| 12.000000 | 0.500000 | 50.000000 |
| 14.000000 | 0.357143 | 35.714286 |
| 16.000000 | 0.250000 | 25.000000 |
| 20.000000 | 0.100000 | 10.000000 |
| 24.000000 | 0.000000 | 0.000000 |

## What the reproduction proves

The BC regulation prints 0.700000 at 10.000000 hours, 0.500000 at 12.000000, 0.250000 at 16.000000 and 0.100000 at 20.000000, and the engine returns exactly those. That is a printed value set against the engine's arithmetic, so the constants 8, 24 and 16 are tested by something outside the two files that hold them. The golden's 3 oracle-only cases are rows no source prints, and they rest on the same arithmetic the four printed rows test. The denominator is also pinned by measurement: the engine's raw factor at 4 hours gives back 16.000000000000.

## Where the factor ends

At 24.000000 hours the factor is 0.000000, and the adjusted limit is zero. That is judgement J8: 24 hours a day leaves no recovery time, and the formula says no concentration is acceptable. The engine reports it and does not refuse it. A shift longer than 24 hours, or of zero hours, is refused on `shiftHours`:

> shiftHours must be a number of hours above zero and at most 24

## What it applies to

The factor adjusts a chemical exposure limit that was set for an eight-hour day. It is a screening adjustment, and it treats every substance as if it accumulated in the body in the same simple way. A hygienist uses it where no substance-specific adjustment exists, and says so. Noise has its own extended-shift rule, the OSHA action level of the first lesson of this module. Where the Expert crew case adjusts limits, the daily factor is applied to the three chemical limits and the noise row is read as a noise dose against 50 percent, and that is the practice this course prints.

## Exercise

Evaluate the daily factor by hand at 10.000000 and 14.000000 hours and confirm 0.700000 and 0.357143. Then multiply a limit of 100 by each and check the adjusted limits in the table. Finally, say which of the rows in the table the BC regulation prints, and what that printing proves about the formula.
