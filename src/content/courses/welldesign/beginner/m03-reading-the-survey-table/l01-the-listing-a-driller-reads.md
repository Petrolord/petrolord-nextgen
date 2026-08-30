# The listing a driller reads

One row per station, fifteen columns, and every one of them computed from three.

{{panel:wd-survey-explorer}}

## The columns

The panel shows the listing for both golden wells. Every column after the third is derived:

| column | what it is | where it comes from |
|---|---|---|
| MD | measured depth | measured |
| Inc | inclination | measured |
| Azi | azimuth | measured |
| TVD | true vertical depth | integrated along the path |
| TVDss | subsea true vertical depth | TVD minus the depth reference elevation |
| N, E | displacement from the wellhead | integrated |
| X, Y | world coordinates | N and E plus the surface location |
| DLS | dogleg severity | the two attitudes and the interval |
| Build rate | inclination change per unit length | the two inclinations |
| Turn rate | azimuth change per unit length | the two azimuths |
| VS | vertical section | N and E projected on one azimuth |
| Closure distance | straight-line horizontal distance from the wellhead | N and E |
| Closure azimuth | direction of that line | N and E |

Three measured, twelve computed. The listing looks like data and it is mostly arithmetic.

## Two wells, two unit systems

The panel carries one well in feet and one in metres, deliberately.

Depth unit is not cosmetic in survey work: dogleg severity is quoted per 30 m in metric units and per 100 ft in feet units, build and turn rates likewise, and the conversion between the two conventions is exact but easy to get backwards. The next lesson is about that.

Everything else scales with the unit and the arithmetic is identical.

## Reading it for sense

Four checks worth making on any listing before using it.

**Does TVD stop growing where inclination reaches 90?** It should. A horizontal section adds measured depth and no true vertical depth, and if the TVD column keeps climbing at 90 degrees, something is wrong.

**Do the displacements point where the azimuth says?** At an azimuth of 90 degrees the well should be gaining east and not north. This catches sign and reference errors immediately.

**Is dogleg severity plausible?** Above about 6 degrees per 30 m in a section that will be cased is a problem, and above 10 is unusual outside a short kickoff.

**Does the closure azimuth match the vertical-section azimuth?** If the well is heading in one direction, they should be close, and the difference tells you how much the well has turned out of its section plane.

## What the listing does not show

Uncertainty. Every row is a point, quoted to more decimals than it deserves, with no indication that the position is known to tens of metres.

That is what the Professional tier adds, and it is the single most common gap between what a listing looks like and what it means.

## The reference row

The first row of any listing is the tie-on: the depth, inclination and azimuth the survey starts from, and the position it starts at. For a surface hole that is 0, 0, 0 at the wellhead.

For a sidetrack it is a point partway down an existing well, and every position below it inherits whatever error the parent well had at that depth. That is worth remembering when the sidetrack's uncertainty is quoted as though it started fresh.

## The misconception to avoid

"The survey listing is the survey." The survey is the first three columns. The rest is one particular calculation of them, and the same three columns put through different software with a different vertical section azimuth or a different depth reference produce a different-looking listing of the same well.

## Exercise

Open the panel and switch between the two golden wells.

For each, find the deepest station and write down its measured depth, TVD, and the difference. Then find the station where the two wells' inclinations are closest to each other, and compare their dogleg severities in both conventions.
