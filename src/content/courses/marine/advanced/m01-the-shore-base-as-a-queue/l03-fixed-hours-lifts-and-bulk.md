# Fixed hours, lifts and bulk

{{panel:marine-base-calculator}}

The service time of one call is how long a vessel holds a berth. The engine builds it from three stated terms: fixed hours (mooring, paperwork, the safety walk), lift hours for the deck cargo, and bulk hours for the tanks. The lift hours are the lifts over the stated lifts an hour; the bulk hours are the cubic metres over the stated cubic metres pumped an hour.

## Alongside or one after the other

The deck crane and the bulk hoses can work at the same time, or the base can do one and then the other. The call states which through the concurrent choice. With the two at the same time (concurrent true), the service is the fixed hours plus the larger of the lift hours and the bulk hours. One after the other (concurrent false), it is the fixed hours plus both.

| golden input | concurrent | lift hours (engine) | bulk hours (engine) | service hours (engine) | offered load (engine) | berth utilisation (engine) |
| --- | --- | --- | --- | --- | --- | --- |
| ekene-base-mmc | true | 5.000000 | 6.000000 | 8.000000 | 1.066667 | 0.533333 |
| ekene-base-sequential-service | false | 5.000000 | 6.000000 | 13.000000 | 1.733333 | 0.866667 |

On the Ekene base, 60 lifts at 12 an hour take 5.000000 hours and 900 m3 at 150 m3 an hour take 6.000000. Alongside, the bulk is the longer, so the call takes 8.000000 hours; one after the other it takes 13.000000, and the berths run at 0.866667. The engine's basis prints the arithmetic in its own words, verbatim:

> working-hour clock: 3.2 arrivals a day over 24 working hours; service 8 hours = 2 fixed + 5 for lifts alongside 6 for bulk; M/M/c (Poisson arrivals, exponential service, first come first served)

## The choice is the planner's

Whether a base can crane and pump at once depends on its crews, its hose connections and its safety rules, which the engine cannot see. So the concurrent choice has no default, and a call without it is refused, verbatim:

> service.concurrent must be true (lifts and bulk at the same time) or false (one after the other); there is no default; got nothing

A plan names the choice beside every queue figure.

## Service terms the engine refuses

A call whose terms add to no time at all is refused, verbatim:

> service must give a service time above 0 hours (fixed hours, lifts or bulk); got 0

A rate of zero would make the hours infinite, and is refused by name:

> service.liftsPerHour must be a finite number above 0; got 0

A service term the engine does not read is refused with the full list of the terms it does read, verbatim:

> service.craneRate is not an accepted key; the accepted keys of service are fixedHours, lifts, liftsPerHour, bulkM3, bulkM3PerHour, concurrent

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Read the Lift hours, Bulk hours and Service hours tiles and check each against the stated terms. Switch the start to "Ekene base, lifts then bulk" and read the service hours, the berth utilisation and the mean wait; say in one sentence how far the wait moved. Back on the first start, set Lifts and bulk at the same time (stated) to "not stated" and read the refusal, then set Lifts an hour (stated) to 0 and read that one.
