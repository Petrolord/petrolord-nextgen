# Pounds a day, and why the rate arrives here

Up to this point in the chain the rate has not appeared once. The water content is per MMscf, the spec is per MMscf, and the load is per MMscf. The rate arrives at exactly one place, and where it arrives decides what it can and cannot move.

{{panel:fc-water-explorer}}

## One multiplication

OBIAFU loses 46.450380 lb of water per MMscf, and at 62.000000 MMscfd that is 2879.9235 lb a day. The load per MMscf became a load a day, and the answer stopped being a property of the gas and started being a property of the plant.

## Intensive and extensive

An intensive quantity does not know how much material there is. A density is intensive. So is the water content of 53.450380 lb per MMscf, and so is the load of 46.450380 lb per MMscf. Both are the same at any rate whatever.

An extensive quantity scales with how much material there is. The 2879.9235 lb a day is extensive. So are the gallons a day, the gpm and the MMBtu an hour, because each of them is the same load with the rate already inside it.

| rate, MMscfd | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr | Btu per gallon |
| --- | --- | --- | --- | --- |
| 10.000000 | 464.5038 | 1.032231 | 0.112463 | 1815.8525 |
| 30.000000 | 1393.5114 | 3.096692 | 0.337388 | 1815.8525 |
| 62.000000 | 2879.9235 | 6.399830 | 0.697269 | 1815.8525 |
| 120.000000 | 5574.0455 | 12.386768 | 1.349553 | 1815.8525 |
| 250.000000 | 11612.5949 | 25.805766 | 2.811568 | 1815.8525 |

## The column that does not move

Look at the last column before any of the others. The Btu a gallon stays at 1815.8525 down the whole table. The rate moves across a wide range and the duty per gallon does not shift at all.

That column is a property of the glycol loop. It says what it costs to heat one gallon from the absorber to the still and boil its water back out, and it has no interest in how many gallons there are. The rate only decides how many gallons there are, which is why the MMBtu an hour column moves and the Btu a gallon column does not.

## Where the rate cannot reach

Because the rate enters at one multiplication and nowhere else, there are whole questions it has no grip on. It cannot change the water content, because pressure and temperature settle that before the rate is mentioned. It cannot change the load per MMscf, because that is the content less a contract. It cannot change what a gallon of glycol costs to regenerate.

What it changes is size. A bigger rate is a bigger pump, a bigger reboiler and a bigger contactor, on the same chemistry and the same heat balance. That is why a rate change is usually an equipment conversation and a conditions change is usually a process one.

## The mistake this prevents

A dehydration answer typically arrives as a list: water content, water removed, circulation, duty per gallon, duty. Three of those move with the rate and two of them do not. Someone who scales every number on the sheet when the rate changes will get the two intensive figures wrong, and the duty per gallon is the one that hides, because 1815.8525 looks like a result rather than a ratio.

## Exercise

Record the water out and the circulation at 10.000000, 62.000000 and 250.000000 MMscfd, and record the Btu a gallon at each. Then say which two of the five columns in an answer are intensive, and what the rate is actually multiplying.
