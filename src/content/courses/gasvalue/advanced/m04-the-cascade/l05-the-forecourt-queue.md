# The forecourt queue

Buses arrive at IBAFO's forecourt and wait for a dispenser. `cngDispensing` sizes the forecourt as a queue. A CNG forecourt is the same queue as the carousel and the loading rack: lpgCng calls the loading-rack queue in terminalDepot for both, and the supply course (`supply`) is where this academy teaches that queue.

{{panel:gasvalue-rollout-explorer}}

## IBAFO's forecourt

14 buses an hour, 6 minutes a fill, each fill the cascade's 16.0133 kg. The number of dispensers is the input the study varies:

| dispensers (input) | utilisation | probabilityOfWaiting | averageWaitMinutes | kgPerHour |
| --- | --- | --- | --- | --- |
| 2 | 0.7000 | 0.5765 | 5.7647 | 224.1860 |
| 3 | 0.4667 | 0.2024 | 0.7588 | 224.1860 |

## Reading the two rows

On 2 dispensers, utilisation is 0.7000, the probability that a bus waits is 0.5765, and the average wait is 5.7647 minutes. On 3 dispensers they are 0.4667, 0.2024 and 0.7588 minutes.

kgPerHour prints 224.1860 in both rows. The gas the forecourt dispenses an hour is the same on 2 dispensers and on 3. What the dispenser count moves is the queue: the utilisation, the probability of waiting and the wait.

The engine's note on the forecourt: "A CNG fill takes minutes, so a forecourt queues at traffic a liquid-fuel operator would think of as quiet."

## A forecourt that cannot keep up

At 25 buses an hour on 2 dispensers the forecourt cannot keep up. The engine gives an answer and no refusal: stable false, utilisation 1.2500, and the queue's message: "The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals."

This is an answer with a flag. stable prints false and the utilisation prints 1.2500. The message says no average waiting time exists. It is the queue's message, and it speaks of a rack and a bay: the forecourt calls the loading-rack queue.

## Whole dispensers

| probe | engine |
| --- | --- |
| 2.5 dispensers | REFUSED: The number of bays must be a whole number, one or more. |
| no fill time | REFUSED: Arrivals, fill time and a dispenser count are required and must be positive. |

A dispenser count must be whole. 2.5 is refused, in the queue's own words about bays. A fill time is required, and so are the arrivals and the dispenser count, each positive.

## The same queue three times

This tier has now run the same queue twice. The carousel ran it on KANO's positions wholly working, 16, with cylinders arriving at 320.0000 an hour. The forecourt runs it on whole dispensers, 2 or 3, with buses arriving at 14 an hour. The field names are shared: utilisation, probabilityOfWaiting, averageWaitMinutes. On the carousel they printed 0.7333, 0.1769 and 0.0912 minutes.

In practice, the arrivals a forecourt study types come from counting the buses at the busiest hour.

## In the explorer

Open IBAFO's forecourt at 14 buses an hour. Read the four fields on 2 dispensers and on 3. Set the arrivals to 25 on 2 dispensers and read stable and the message. Then type 2.5 dispensers and read the refusal.

## Exercise

Read the two forecourt rows: 2 dispensers at utilisation 0.7000, probabilityOfWaiting 0.5765, averageWaitMinutes 5.7647; 3 dispensers at 0.4667, 0.2024, 0.7588; kgPerHour 224.1860 in both. Say which fields the dispenser count moves and which it does not, and what the engine returns at 25 buses an hour on 2 dispensers, quoting stable and the utilisation.
