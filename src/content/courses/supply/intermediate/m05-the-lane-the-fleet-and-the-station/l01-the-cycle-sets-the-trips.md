# The cycle sets the trips

Product that leaves the IBAFO rack goes by road. A tanker loads, drives to a cluster of stations, discharges and drives back empty, and the length of that loop decides how many loads one truck can carry in a day. The engine's `truckingEconomics` computes the loop first and every cost after it. This lesson reads the loop.

{{panel:supply-depot-explorer}}

## The lane's inputs

The IBAFO lane runs to a station cluster 312.00 km away. The inputs, each a measured or planned figure for this lane:

| input | IBAFO lane |
| --- | --- |
| distance km | 312.00 |
| payload litres | 33000.00 |
| average speed km/h | 46 |
| load hours | 1.5 |
| discharge hours | 1.25 |
| queueing hours | 1.75 |
| working hours a day | 12 |
| working days a year | 300 |

Distances print to two decimals of a kilometre, hours to three decimals. The average speed is the speed over the whole road trip, stops and slow sections included, and it is the input most often borrowed from a map when it should come from a fleet's own records.

## The cycle

The engine computes:

cycle = round trip / average speed + load + discharge + queue hours

For IBAFO:

| item | value |
| --- | --- |
| round trip km | 624.00 |
| cycle hours | 18.065 |

The round trip is out and back, because a tanker returns empty to load again. The queue hours are this lane's allowance for waiting, typed as an input. The rack model of modules one and two prints a mean wait for the loading rack; the lane takes its own figure for all the waiting in a cycle, at the depot and at the stations, and it is the caller's job to make that figure honest.

## Trips a truck a day

trips a truck a day = working hours / cycle

| item | value |
| --- | --- |
| trips a truck a day | 0.664260 |
| trips a truck a year | 199.2780 |

Trips print to six decimals. A cycle longer than the working day gives a figure below one: each truck completes part of a trip in a day, and a trip spans more than one working day. The engine does not round the figure to a whole trip. A fleet averaged over many trucks and many days really does deliver that fraction of a load per truck per day, and the fleet lesson later in this module turns it into whole trucks.

Trips a year use the working days. The engine spreads the truck's capital over that yearly count, which the next lesson reads.

## Distance moves the cycle

The same lane at three distances:

| distance km | cycle hours | trips a truck a day |
| --- | --- | --- |
| 156.00 | 11.283 | 1.063584 |
| 312.00 | 18.065 | 0.664260 |
| 468.00 | 24.848 | 0.482940 |

The load, discharge and queue hours are the same in every row. Only the driving time changes. Those fixed hours at each end of a lane sit inside every cycle, however short the road, and they deserve the same scrutiny as the road.

## What the engine refuses

The distance, the payload and the average speed are required and must be positive. Leave one blank and the engine stops:

> REFUSED: Distance, payload and average speed are required and must be positive.

A lane with no distance has no cycle, and a cycle computed from a zero speed would be infinite. The engine gives no typical figure for either.

## Exercise

Read the IBAFO lane inputs, its round trip, cycle hours and trips a truck a day. Say what each term of the cycle formula is and which of them are typed allowances. Then read the distance sweep and say which part of the cycle is the same in every row and why the trips a day depend on it.
