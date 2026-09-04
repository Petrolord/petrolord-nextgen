# Damage lowers the ceiling

The well that most needs acid is the well that will accept it most slowly.

{{panel:st-acid-explorer}}

## Skin is in the denominator

Look again at where the skin sits:

    q = 2 pi k h (pFrac - pRes) / (mu (ln(re/rw) + s))

Skin is added to the geometric resistance term. A positive skin is extra resistance, so it makes the denominator larger and the rate smaller. That is the whole mechanism, and the consequence is not obvious until you say it out loud.

Damage restricts flow OUT of the well and equally flow IN. The near wellbore ring that is choking production is the same ring the acid has to be pushed through, and it chokes the acid too.

## How far it falls

The published ceiling of 0.000544181 m3/s is computed at the damaged skin of 8.481054145, which is the Hawkins skin for a permeability ratio of 5 out to 0.9 m.

That skin on its own is larger than the geometric term for a drainage radius of 300 m and a wellbore radius of 0.108 m. So the damage more than doubles the denominator, and the damaged well accepts under half the rate the same well would accept clean.

Run the module 2 sweep through the rate equation and the pattern is steady.

| k/ks | skin | ceiling, against the clean well |
| --- | --- | --- |
| 1 | 0 | the clean ceiling |
| 2 | 2.120263536200091 | about four fifths |
| 3 | 4.240527072400182 | about two thirds |
| 5 | 8.481054144800364 | under half |
| 8 | 14.841844753400636 | about a third |
| 12 | 23.322898898201 | about a quarter |
| 20 | 40.28500718780173 | about a sixth |

Severe damage is not a slightly slower job. It is a job that takes several times as long.

## Which makes it a scheduling problem

Module 3 planned 29.546905102 m3 of acid to move the front to 0.6 m. Divide that volume by the published ceiling and the pumping alone runs to about fifteen hours, at the maximum rate the rock will allow, with no margin and no shutdowns.

Take the front all the way to the damage at 0.9 m and the volume rises to 67.71725584279905 m3, which at the same starting ceiling is more than a day of continuous pumping.

Those hours are pump spread, tanks, coiled tubing, acid inhibitor holding up at reservoir temperature, and a well shut in. That is a cost line and a crew rotation, and it decides jobs. A treatment that looks cheap on chemical volume can be unaffordable on time.

One consolation, and it is real. The ceiling is not fixed during the job. As acid clears the near wellbore the skin falls and the well takes fluid faster, so the first barrels are the slowest you will pump. The engine reports a single steady state number, which is the pessimistic end of that.

## Exercise

Using the panel, compute the ceiling at zero skin and at the published damaged skin, and form the ratio.

Repeat at a permeability ratio of 12 and say how the job duration compares.

Then argue, in three sentences, when the duration alone should push a designer away from a matrix treatment and towards the fracture route.
