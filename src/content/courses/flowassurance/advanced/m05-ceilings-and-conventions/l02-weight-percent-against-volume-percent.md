# Weight percent against volume percent

`leanWtPct` is used as a weight percent on one line of `injectionRate` and as a volume percent on the next. One of the two lines has to change, because it cannot be both.

{{panel:pd-hydrate-explorer}}

## The two lines

The gross-up multiplies the pure inhibitor mass by 100 over the lean strength, which treats the lean number as a mass fraction. It is one. The next line blends the stream density as the inhibitor density times the lean strength plus the water density times the remainder, all over 100, which is the volume fraction rule. The mass fraction form is the reciprocal relation: the reciprocal of the density is the sum of each mass fraction over its own density. The rate is a mass divided by that density.

## What the two blends give

TEACHING LINE AKASO SPUR values, a construct of this course rather than a published case. The catalog carries methanol at 6.6000 lb/gal and MEG at 9.3000 lb/gal.

| Stream | Engine blend, lb/gal | Mass fraction blend, lb/gal | Rate returned, bbl/d | Rate on the mass fraction blend, bbl/d |
| --- | --- | --- | --- | --- |
| Methanol, 96.00 weight percent lean | 6.6696000000 | 6.6555426582 | 307.7753251096 | 308.4253852443 |
| MEG, 89.00 weight percent lean | 9.1944000000 | 9.1837169650 | 466.5311621077 | 467.0738583526 |

The methanol rate is 0.211213 percent low and the MEG rate is 0.116326 percent low. Both are small because both lean streams are strong, and the mass balance above them is right: the methanol design moves 82766.408593 lb per day of pure inhibitor inside 86215.008951 lb per day of stream, and neither figure moves.

## The sign never changes

The arithmetic mean of two densities always exceeds their harmonic mean, whichever component is heavier, so the engine's stream density is always the higher of the two. The rate is the stream mass over that density, so the rate is always the lower. The error is a systematic under-dose on every fluid and every lean strength.

## What dilution does to it

Sweep points on lean methanol, not published cases.

| Lean, weight percent | Engine blend, lb/gal | Mass fraction blend, lb/gal | Rate low by, percent |
| --- | --- | --- | --- |
| 90.0 | 6.7740000000 | 6.7406318883 | 0.495029 |
| 80.0 | 6.9480000000 | 6.8873873874 | 0.880052 |
| 70.0 | 7.1220000000 | 7.0406753645 | 1.155069 |
| 60.0 | 7.2960000000 | 7.2009419152 | 1.320078 |
| 50.0 | 7.4700000000 | 7.3686746988 | 1.375082 |

## The mistake

Deciding the finding is too small to matter. A recovered glycol stream comes back lean, and the error grows the leaner it comes back. It also stacks on a dose already sized short, in the same direction, and two systematic under-doses pointing the same way are not a small problem.

## Exercise

Take a lean strength, compute the stream density both ways, then the rate both ways.

Then say which line you would change, and what the other has to be renamed to if you do.
