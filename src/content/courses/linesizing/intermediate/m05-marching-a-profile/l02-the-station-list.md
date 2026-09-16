# The station list

Run the same line over a ridge and it arrives at exactly the same pressure. Everything that differs between the two cases happens in the middle, where nobody reads.

{{panel:fc-liquid-explorer}}

## The same line, flat and over a ridge

| station | distance ft | flat elevation ft | flat pressure psia | ridge elevation ft | ridge pressure psia |
| --- | --- | --- | --- | --- | --- |
| 0 | 0.000000 | 0.000000 | 900.000000 | 0.000000 | 900.000000 |
| 1 | 8800.000000 | 0.000000 | 891.446456 | 420.000000 | 732.488123 |
| 2 | 17600.000000 | 0.000000 | 882.892912 | 420.000000 | 723.934579 |
| 3 | 26400.000000 | 0.000000 | 874.339369 | 0.000000 | 874.339369 |

Both arrive at 874.339369 psia, having spent 25.660631 psi, because the ridge climbs 420.000000 ft and gives all of it back.

## The arrival is the same and the line is not

At the crest the ridge stands at 732.488123 psia against 891.446456 psia on the flat line, a difference of 158.958333 psi. That is a large number to be invisible in a result, and it is invisible in every report that quotes an arrival pressure.

A line is sized on its worst station and not on its last one. The crest is where the pressure is lowest, so it is where the fluid is closest to whatever limit matters, and it is the station a review has to see.

## Why the elevation comes back

The two middle stations sit at 420.000000 ft and the ends sit at 0.000000 ft, so the profile climbs and then descends the same distance. Elevation is a static column, and a static column is paid for on the way up and returned on the way down, which is why the total spend over the whole line is the friction alone at 25.660631 psi.

That is a property of a liquid line, and it is exactly the property that the gas half of this tier does not have. The elevation term in a gas form is inside an exponential, and equal distances up and down do not cancel there.

## What the list is for

Three uses follow from this one pair of cases. The list locates the minimum, which no total can. It shows where the profile is doing the work, so a route change can be aimed. And it gives a plot to check against a survey, which is the ordinary way a wrong elevation entry is caught.

## The worst station is not always under the highest ground

On this profile the lowest pressure and the highest ground coincide, because the line is level apart from one ridge and the duty is uniform along it. On a real route they need not coincide. Pressure falls with distance as well as with elevation, as the flat column shows, so a hill late in a line sits at a lower pressure than the same hill early in it. The worst station is the one the march reports rather than the one a survey suggests.

## The mistake

The mistake is judging a profile by its arrival. Both columns arrive at 874.339369 psia and only one of them has a station 158.958333 psi lower than the other.

The second mistake is assuming that because the elevation returned, it did nothing. It set the pressure everywhere between the two ends.

## Exercise

Give both station lists with their elevations and pressures. State the arrival pressure of each and the difference between the two at station 1. Then explain why the ridge costs nothing overall and why that does not make it unimportant.
