# Secondary qualifying

The backup barrier is tested against a shorter list of conditions than the primary, and knowing which conditions dropped off matters.

{{panel:wi-pa-explorer}}

## What the engine asks of a secondary

Once the primaries for a zone are known, the engine looks at every remaining barrier plug and asks three things.

Is it already counted as a primary for this zone? If so it is not counted again. One plug fills one slot per zone.

Does its base sit at or above the source top? The secondary backs the zone up from above, so it must lie entirely above the source.

Does it pass the length rule? Here the rule check runs with no source depth at all, so only the minimum length test applies, measured against the plug's own foundation. The `covers-source` and `above-source` checks that governed the primary are not part of the question.

A second source covering plug also qualifies, as the header puts it. P1 and P2 both land in `primaryQualifying` for the reservoir sand, so that zone reaches two without a separate backup at all.

## One plug, two roles

P3 intermediate is the primary for the intermediate gas stringer at 1800 m MD, because it covers that zone. For the reservoir sand at 2500 m MD it sits entirely above the source top and passes the length rule, so the same plug is listed under `secondaryQualifying` there. Nothing stops a plug serving two zones in two roles.

## Where the role flips

Move a backing plug down past a zone top and it stops being a secondary and becomes a primary, because it starts covering the source. The sweep against a zone top of 1800 m MD shows it.

| Backing plug, m MD | Primary qualifying | Secondary qualifying |
| --- | --- | --- |
| 1560 to 1680 | P3 intermediate | Backing plug |
| 1680 to 1800 | P3 intermediate, Backing plug | none |
| 1740 to 1860 | P3 intermediate, Backing plug | none |

The zone passes in every row, for two different reasons. In the upper row it has one primary and one secondary. In the lower rows it has two primaries.

## Why a primary is still compulsory

The pass condition needs at least one primary and a combined count of two. Secondaries do not substitute for the plug on the source. A stack of long, well founded plugs above a zone with nothing on the zone itself fails every time, and the verdict says so by leaving `primaryQualifying` empty.

## Exercise

1. Confirm in the panel that P3 appears as a primary for one zone and a secondary for the other.
2. Walk a backing plug down through 1800 m MD in steps and watch the moment it moves from one list to the other.
3. Delete P1 and P2 and check that the reservoir sand fails even though plugs remain above it.
