# One place at a time

{{panel:qr-event-tree}}

A person is in one place at a time. That plain fact is a rule in the engine: occupancy fractions may not exceed one at any place, and they may not exceed one in total across the places in a roster. A roster that breaks the rule describes someone who does not exist, so the engine refuses it and names the whole list as the offending field.

## The refusal

A roster of 0.6 and 0.5 of the year is refused, in the engine's own words:

> locations: the occupancy fractions sum to 1.1: one person cannot spend more than the whole year across locations

No single place is wrong on its own, since 0.6 and 0.5 are each a sensible share of a year. The fault is in the total, so the field named is `locations`, the whole list. The message prints the sum it found, so the size of the overlap is visible at once. A total above one usually means two rosters were merged, or a shift pattern was counted twice, and the fix is to rebuild the roster from the hours actually worked rather than to trim one place until the sum fits.

## Reaching one exactly

The occupancy check allows the total to reach one exactly. A person who spends the whole year at one place, or divides every hour of it among several, is allowed. The golden case full-occupancy shows it:

| per year, or fraction | golden case and quantity |
| --- | --- |
| 0.000022000000 | full-occupancy, IRPA |
| 1.000000000000 | full-occupancy, total occupancy |
| 0.000041195890 | operator-two-areas, IRPA |
| 0.236986301370 | operator-two-areas, total occupancy |

The full-occupancy case spends the whole year in its places and its total occupancy is 1.000000000000. The operator-two-areas case uses less than a quarter of the year. Both are accepted, and each IRPA matches the oracle.

## Totals below one

Most real rosters total well below one. The EREMOR operator's total occupancy is 0.497716894977 of the year; the rest of the year is spent away from the three places the assessment covers. That is entirely normal. The IRPA counts only the time spent where an LSIR is known, and the time elsewhere contributes nothing here.

The rule therefore bites in one direction. It never asks you to account for every hour. It only stops you claiming more hours than a year holds.

The same rule applies to hours. Each place may hold from zero to 8760 hours, and the hours across places are converted to fractions and summed against the same limit of one, so a roster typed in hours meets exactly the same check as one typed in fractions.

## Exercise

The EREMOR operator's occupancy fractions are 0.114155251142, 0.091324200913 and 0.292237442922. Add them and confirm that you reach the total of 0.497716894977. Then say whether the engine would accept the roster, and what the largest extra fraction of the year is that could be added at one more place before the refusal above would be returned.
