# Available days and the period

{{panel:marine-voyage-calculator}}

Vessel-days measure what the voyages need. The other side of the fleet question is what one vessel can supply, and that is a planner's statement: `vesselAvailableDays`, the days in the period a vessel is free to sail. The engine divides the one by the other and calls the quotient the vessels before rounding.

## Why a vessel is not available all week

A supply vessel spends time that no voyage plan shows: crew changes, bunkering and maintenance alongside, surveys, the odd day of a defect. The Ekene fixture holds half a day of each week for crew change and maintenance, so a vessel is available for 6.5 of the 7 days. The figure belongs to whoever runs the vessels; the engine holds no allowance of its own and takes what the call states.

## Vessels before rounding

For the Ekene week on the PSV milk run:

| figure | value |
| --- | --- |
| vessel-days needed | 10.345455 |
| days a vessel is available | 6.5 |
| vessels before rounding | 1.591608 |

One and a half vessels, and a bit more, is what the week asks for. Whether that becomes one vessel, two or the fraction itself is the vessel rounding rule, which the next lesson takes.

## The boundary at the period

Available days can equal the period: a vessel that works every day of the week is accepted, and on the golden case with 7 of 7 days the engine returns 0.202381 vessels before rounding. Available days above the period describe a week longer than itself, and the engine refuses them by name:

> vesselAvailableDays must be at most periodDays (7); got 7.5

The period and the available days must both be stated. An unstated availability is refused as well:

> vesselAvailableDays must be a finite number above 0; got nothing

## What the course leaves out

The vessel's day rate, the contract that secures it and the terms of hire sit with the procurement course. This course states a fuel price and no hire rate: it counts how many vessels the week needs and leaves their price to the people who buy them.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "Ekene week, PSV milk run".

1. Read the tile "Vessels before rounding" and confirm 1.591608. Divide the vessel-days by the available days yourself.
2. Change "Days a vessel is available (stated)" from 6.5 to 7. Predict the vessels before rounding by hand, then read the tile. Say whether the vessel count moves.
3. Type 7.5 into the same control and compare the refusal with the one quoted above.
4. Set the control to "not stated" and read the refusal. Restore 6.5.
5. Start from "Available days equal to the period" and confirm 0.202381.
