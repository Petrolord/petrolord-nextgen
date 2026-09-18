# Brine density

The second thing salinity does is make the water heavier, and the weight of the water is half of the driving force behind every device in this module. The engine takes a fresh water density from a fit in temperature and adds a salinity term to it.

| degC | ppm TDS | fresh kg/m3 | brine kg/m3 |
| --- | --- | --- | --- |
| 41 | 0 | 991.861174 | 991.861174 |
| 41 | 62000 | 991.861174 | 1035.261174 |
| 53 | 15000 | 986.674641 | 997.174641 |
| 78 | 120000 | 972.971292 | 1056.971292 |

## Two inputs, two terms

Read the first two rows together. The temperature is the same on both, so the fresh water column repeats 991.861174, and the whole difference between 991.861174 and 1035.261174 is the salt. Read the first and third rows together and both inputs have moved, which is why neither column repeats. Keeping those two effects separate in your head is the point of the table: temperature sets the fresh water density, salinity adds to it, and the answer is the sum.

## The slope is declared

How fast density rises with dissolved solids is set by one declared constant, brineDensitySlopeKgM3, which is 700. Like the viscosity multiplier it is customary rather than published here, and the module keeps it in the same frozen object as everything else that was chosen rather than derived. A reader who wants to move it may, and the move is visible to anybody reading the same object. That visibility is the entire argument for declaring a constant instead of writing it into the line that consumes it, because a number written into a formula is a number nobody will ever review again.

## The fit has an edge and the engine states it

The fresh water density fit is stated from a lower temperature to an upper one, and the engine says so when a temperature arrives outside that range. This is the same discipline as the viscosity fit and the salinity correction. Every fit in this module carries the range it was stated over, and crossing the range produces a named refusal rather than a quiet extrapolation.

## Why this number matters more than it looks

A brine density on its own is a dull figure. It matters because the next lesson produces an oil density, and the difference between the two is what makes a droplet rise at all. Look down the brine column and notice how small the movement is: a few tens of kilograms per cubic metre across a wide range of real produced water. The oil density moves much further. That is worth holding on to, because it means the crude, and therefore the API gravity somebody typed into the studio, carries most of the variation in the driving force.

{{panel:pw-water-explorer}}

## Exercise

Using the table, separate the temperature effect from the salinity effect between the second row and the fourth. Then say why a brine density quoted without the temperature it was measured at is of no use to this engine.
