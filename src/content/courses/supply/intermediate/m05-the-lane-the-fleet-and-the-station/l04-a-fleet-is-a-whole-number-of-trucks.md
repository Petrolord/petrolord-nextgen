# A fleet is a whole number of trucks

The lane gives a truck's trips a day as a fraction. A haulier buys whole trucks. The engine's `fleetSizing` joins the two with a ceiling and reports what the rounding buys, which is the same care modules one and two took with bays.

{{panel:supply-depot-explorer}}

## The arithmetic

fleetSizing computes:

trips needed a day = demand / payload
trucks = the ceiling of trips needed / trips a truck a day

The ceiling rounds up to the next whole truck. A fleet one truck short fails to meet the demand on every day of the year; a fleet rounded up meets it with some trips to spare, and the engine reports the spare.

For the stations the IBAFO lane serves, with the lane's own trips a truck a day:

| item | value |
| --- | --- |
| demand litres a day | 1260000.00 |
| payload litres | 33000.00 |
| trips a truck a day (from the lane) | 0.664260 |
| trips needed a day | 38.181818 |
| trucks required | 58 |
| fleet trip capacity a day | 38.527080 |
| fleet utilisation | 0.991038 |
| spare trips a day | 0.345262 |
| spare litres a day | 11393.64 |

## Reading the rounding

The trips needed a day, 38.181818, is not a whole number, and neither is the number of trucks those trips would need. The engine rounds the trucks up to 58. Those 58 trucks can make 38.527080 trips a day between them. The spare, 0.345262 trips a day, is what the ceiling bought, and the engine also prints it in litres, 11393.64.

The fleet utilisation, 0.991038, is the share of the fleet's trip capacity the demand uses. It is a fleet figure and has nothing to do with the rack's utilisation. Keep the two words apart in any report by naming the fleet or the rack beside each.

The engine sizes a fleet for the average cycle. A truck in the workshop, a day of heavy traffic or a longer queue at the depot all change what the fleet can make on the day, and the engine prints no allowance for any of them. Any spare for breakdowns or peaks is a decision the operator adds.

## The demand sweep

On the same lane:

| demand litres a day | trips needed a day | trucks required | fleet utilisation |
| --- | --- | --- | --- |
| 330000.00 | 10.000000 | 16 | 0.940897 |
| 660000.00 | 20.000000 | 31 | 0.971248 |
| 1260000.00 | 38.181818 | 58 | 0.991038 |
| 1980000.00 | 60.000000 | 91 | 0.992594 |

Each row's utilisation depends on how close the trips needed fall below a whole truck's worth of capacity. Quote each row as printed. The engine prints no fleet for any demand between these rows.

## What the engine refuses

Demand, payload and trips a truck a day are required and must be positive. With no demand the engine stops:

> REFUSED: Demand, payload and trips per truck per day are required and must be positive.

A fleet sized for no demand is no fleet. The trips a truck a day must come from a lane, and the engine does not assume one.

## The chain behind the count

The 58 trucks rest on everything the lane computed: the distance, the speed, the load, discharge and queue hours, and the working day. A change to any of them moves the trips a truck a day, and the fleet with it. A depot that cuts its queue hours on this lane shortens the cycle, and the engine would size a different fleet. This course prints no fleet for a changed lane, so it quotes none.

## Exercise

Read IBAFO's demand, payload, trips a truck a day, trips needed and trucks required. Say what the ceiling does and why it is needed. Then read the fleet trip capacity, the fleet utilisation and the spare trips and litres, and say what the spare represents and why it is not a reserve for breakdowns.
