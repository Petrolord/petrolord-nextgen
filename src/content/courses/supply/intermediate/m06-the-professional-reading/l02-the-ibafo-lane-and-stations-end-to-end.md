# The Ibafo lane and stations end to end

Product leaves IBAFO by truck. This lesson reads the lane, the fleet and the forecourt as one chain, in the order the product travels, and marks at each link which input carries the weight. Money is in naira, and every cost on the lane is invented for this course.

{{panel:supply-depot-explorer}}

## The lane

The lane runs 312.00 km to a station cluster, with a 33000.00 litre payload, an average speed of 46 km/h, 1.5 hours to load, 1.25 to discharge, 1.75 queueing, a working day of 12 hours, 300 working days a year and a transit loss of 0.3 percent. The engine prints:

| item | value |
| --- | --- |
| complete | true |
| round trip km | 624.00 |
| cycle hours | 18.065 |
| trips a truck a day | 0.664260 |
| trips a truck a year | 199.2780 |
| cost a trip, naira | 495830.99 |
| litres delivered a trip | 32901.00 |
| cost per litre delivered, naira | 15.0704 |
| kg CO2e a trip | none |

The answer reads complete true, a flag that names a cost box left blank or null. A cost left out of the call takes the default its signature states and still reads complete true: with the driver cost left out, the lane reads 437830.99 naira a trip, complete true. The carbon figure is none, because no diesel emission factor was supplied, and the engine says the carbon figure is left blank. The cost per litre is spread over the litres delivered after the transit loss.

## The fleet

The stations on the lane take 1260000.00 litres a day. With the lane's trips a truck a day:

| item | value |
| --- | --- |
| trips needed a day | 38.181818 |
| trucks required | 58 |
| fleet trip capacity a day | 38.527080 |
| fleet utilisation | 0.991038 |
| spare trips a day | 0.345262 |
| spare litres a day | 11393.64 |

The 58 trucks are a ceiling, and the spare is what rounding up bought.

## The forecourt

At one IBAFO forecourt, 36000.00 litres a day, a peak share of 0.12, 32 litres a transaction at 38 litres a minute with 1.5 minutes of overhead, and 6 nozzles:

| item | value |
| --- | --- |
| peak transactions an hour | 135.00 |
| service minutes a transaction | 2.342 |
| forecourt utilisation | 0.878289 |
| forecourt probability of waiting | 0.688546 |
| forecourt mean wait, minutes | 2.2083 |
| reorder level litres | 11875.00 |
| ullage at reorder litres | 28125.00 |
| payload fits the ullage | false |

The forecourt is the rack's queue with nozzles for bays. Its tank check fails, and the engine says so:

> A 33000 litre load cannot discharge into 28125 litres of ullage at the reorder level. Order earlier or order a part load.

## Where each link is fragile

The lane's weight sits in its cycle. The queue hours and the average speed are typed inputs, and the cycle sets the trips a truck a day, which sets both the depreciation a trip and the fleet.

The forecourt gives two separate answers, a queue and a tank check. The nozzle sweep reads stable false at 5 nozzles and true at 6. The reorder sweep reads payload fits false at a fraction of 0.25 and true at 0.1. The forecourt's delivery of 33000.00 litres is the IBAFO lane's payload, and stationSizing checks the payload loaded. The lane delivers 32901.00 litres a trip after its transit loss, and the station's check does not use that figure.

## A blank box anywhere

A blank or null input shows at every link, in one of three ways. A blank driver cost reads complete false with Driver named, and a blank truck capital reads a floor. A missing demand or nozzle count is refused. A farm with no daily throughput gives days of cover none. A cost left out of the lane call is the case to watch: it takes its stated default and reads complete true. The chain holds only as long as every box on it was filled by someone who measured it.

## Exercise

Read the lane, fleet and forecourt tables. For each, name the one input you would check first before trusting the figures, and quote the figure it moves. Then say where the lane's payload reappears at the station, and what the engine reports when it does.
