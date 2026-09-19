# The forecourt is the same queue

At the end of the lane is a filling station, and its forecourt has the same shape as the depot's rack. Cars arrive at random, each holds a nozzle for a while, and there are a fixed number of nozzles. The engine's `stationSizing` sizes the forecourt by calling `rackQueue`, with nozzles in place of bays.

{{panel:supply-depot-explorer}}

## From litres a day to cars an hour

A station knows its throughput in litres a day. Its arrivals have to be derived, and the engine converts:

transactions a day = throughput / litres a transaction

The peak hour carries a stated share of those transactions, and the queue is sized for the peak. The service time is:

service minutes = litres a transaction / dispense rate + an overhead

The overhead is the time a car holds a nozzle without fuel flowing, measured at the station itself.

The IBAFO forecourt's inputs:

| input | IBAFO forecourt |
| --- | --- |
| throughput litres a day | 36000.00 |
| peak share | 0.12 |
| litres a transaction | 32 |
| dispense rate litres a minute | 38 |
| overhead minutes | 1.5 |
| nozzles | 6 |

## What the engine prints

| item | value |
| --- | --- |
| transactions a day | 1125.0 |
| peak transactions an hour | 135.00 |
| service minutes a transaction | 2.342 |
| forecourt utilisation | 0.878289 |
| forecourt probability of waiting | 0.688546 |
| forecourt mean wait, minutes | 2.2083 |

Read these exactly as modules one and two read the rack. The peak transactions an hour are the arrivals, the service minutes are the load time and the nozzles are the bays.

The station and rackQueue agree on the probability of waiting when rackQueue is given the station's unrounded arrivals and service minutes. The station reports those two inputs rounded, and rackQueue fed the printed 135.00 and 2.342 answers 0.688454 against the station's 0.688546. Quote the station's own figure.

The same trap applies. A forecourt utilisation of 0.878289 leaves an arriving car waiting with a probability of 0.688546. The mean wait of 2.2083 minutes is averaged over every car, including the ones that drive straight to a free nozzle.

## The nozzle sweep

At the same peak:

| nozzles | utilisation | stable | probability of waiting | mean wait minutes |
| --- | --- | --- | --- | --- |
| 4 | 1.317434 | false | 1.000000 | none |
| 5 | 1.053947 | false | 1.000000 | none |
| 6 | 0.878289 | true | 0.688546 | 2.2083 |
| 7 | 0.752820 | true | 0.392371 | 0.5311 |
| 8 | 0.658717 | true | 0.209905 | 0.1801 |

At 4 and 5 nozzles the forecourt cannot keep up with its peak, and the engine prints no wait, as it did for the rack at 3 bays. At 6 the queue is stable. Nozzles are whole, like bays, and the smallest stable forecourt in the sweep has 6.

## What is different about a forecourt

The model is the same and the stakes are different. A truck at a rack waits because its load is booked. A driver at a forecourt who sees a queue may drive to the next station, which is the lost trade the waiting model does not count.

The peak share matters as much as the daily throughput. The forecourt is sized for the peak hour's 135.00 transactions, and the peak share is an input the station supplies from its own till records. A forecourt sized on the daily average would be sized for a quiet hour, and its queue figures would describe a station that exists only in the middle of the afternoon.

## What the engine refuses

Throughput, litres a transaction, dispense rate and the nozzle count are all required:

> REFUSED: Throughput, litres per transaction, dispense rate and nozzle count are required.

## Exercise

Read the IBAFO forecourt's inputs and its transactions a day, peak transactions an hour and service minutes. Say which rack input each of the last two stands in for. Then read the nozzle sweep, say which rows are unstable and what the engine prints for their wait, and say what the forecourt's utilisation and probability of waiting at 6 nozzles each measure.
