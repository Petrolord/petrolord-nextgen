# Primary qualifying

A primary is the plug that sits on the source, and it has to satisfy three separate checks to earn the name.

{{panel:wi-pa-explorer}}

## Three checks, all of them

For each flowing zone the engine runs every non-surface plug through the full rule check with that zone's top as the source depth. Three checks come back and all three must pass.

The first is the length rule from module three. Open hole and no foundation, the plug needs 100 m MD. On a mechanical or tagged foundation it needs 50 m. Each plug is measured against its own foundation setting.

The second is `covers-source`: the plug base must be at or below the source top. A plug that stops short of the zone is not isolating it.

The third is `above-source`: the plug must extend at least 50 m above the source top. Covering the zone is not enough on its own, because the seal you are relying on is the length of cement standing above the point where pressure enters.

## Reading the published plugs

P1 reservoir primary runs 2380 to 2520 m MD against a reservoir top of 2500 m MD. Its base is below the source top, its top clears the 50 m margin comfortably, and its length is 140 m. It sits on a mechanical foundation so it only needs 50 m, and it would pass the open hole figure of 100 m as well.

P2 reservoir secondary runs 2350 to 2510 m MD. Despite the name it also covers the source, clears the margin, and is long enough for the 100 m open hole rule with no foundation at all. The engine lists both P1 and P2 under `primaryQualifying` for the reservoir sand. A plug's name is a label you typed. Qualification is arithmetic.

P3 intermediate runs 1700 to 1810 m MD against a gas stringer top of 1800 m MD, and clears all three checks for that zone.

## The thresholds are hard

Nothing here is graded. The margin column from the length sweep shows how abrupt the edge is.

| Plug length, m | Open hole margin, m | Pass |
| --- | --- | --- |
| 98 | -2 | no |
| 100 | 0 | yes |
| 120 | 20 | yes |

Two metres short is short. The margin tells you how much cement is missing, which is more useful than the word `false`.

## Exercise

1. Run the published case and confirm both P1 and P2 appear as primaries for the reservoir sand.
2. Raise P1's base above 2500 m MD and identify which of the three checks fails first.
3. Change P1's foundation to none and see whether 140 m still carries it.
