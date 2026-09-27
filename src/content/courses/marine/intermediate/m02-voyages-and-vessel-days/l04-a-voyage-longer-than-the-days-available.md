# A voyage longer than the days available

{{panel:marine-voyage-calculator}}

Fleet sizing works in vessel-days: it adds the time the voyages need and divides it by the time a vessel is available. That arithmetic is sound only while each voyage fits inside the time one vessel has. When one voyage is longer than the available days, the division still returns a number, and the number describes a plan no vessel can sail. The engine computes it and says so in a reason.

## The golden case

One dedicated installation, one voyage of demand, a 7 day period with 6.5 days available, and 200 port hours a voyage: the port time alone is longer than the week. The voyage takes 9.250000 days, and the engine returns this reason, verbatim:

> voyage X takes 9.25 days, longer than the 6.5 days a vessel is available in the period

It still sizes the fleet: 9.250000 vessel-days and 2 vessels (engine). Two vessels hold more than enough vessel-days between them, yet neither can sail a single voyage of nine and a quarter days inside a seven day week. The vessel-days can be divided on paper; the voyage cannot be divided at sea. A planner who reads only the vessel count would charter two vessels for a job neither can do.

## A result with a reason is a result

This is the pattern the whole course follows. A refusal means the call cannot be computed as stated: a missing input, an unknown key, a figure outside what the engine accepts. The panel shows the message and no numbers. A result with a reason means the call was computed and something in it deserves the planner's attention. The panel shows every figure and prints the reason beside them. An overloaded voyage at the Associate tier was the same kind of result, and so are a shortfall of vessel-days and overflow on the deck, which come later in this tier.

A period of zero days, by contrast, cannot be computed at all, and the engine refuses it:

> periodDays must be a finite number above 0; got 0

## Checking the fit on a real plan

The Ekene milk run takes 2.586364 days against 6.5 available, so each vessel can sail two voyages in its week with time to spare, and the engine prints no reason. On a dedicated route read each set's voyage days against the available days; the reason names the set that fails.

## Exercise

Open the voyage and fleet calculator, choose the view "Fleet sizing for a period" and start from "A voyage longer than the days available".

1. Read the reason and the tiles "Vessel-days" and "Vessels". Confirm 9.250000 and 2.
2. Change "Days a vessel is available (stated)" from 6.5 to 7. Before you read the result, predict whether the reason disappears, and what its figures will say.
3. Restore 6.5 and change "Port hours a voyage (stated)" from 200 to 12. Predict whether the reason disappears and how many vessels the engine then returns.
4. Set "Period, days (stated)" to 0 and compare the refusal with the one quoted above.
5. Start from "Ekene week, PSV milk run" and confirm that the panel prints no reason.
