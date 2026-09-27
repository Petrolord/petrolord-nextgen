# Berths, arrivals and service

{{panel:marine-base-calculator}}

The earlier tiers planned voyages and sized a fleet as if every vessel could load the moment it reached the supply base. This tier looks at the quay. Vessels arrive to lift deck cargo and pump bulk, a berth serves one vessel at a time, and when every berth is busy the next vessel waits. A shore base is therefore a queue, and the engine's `shoreBase` function returns its steady-state averages from inputs the call states.

## What a call states

A shore base call states the berths, the arrivals a day, the working hours a day, the service terms of one call, the queue model and, if the planner wants one, a target mean wait. None has a default, and a call that leaves one out is refused by name. The Ekene supply base is synthetic:

| input | the Ekene supply base (fixture) |
| --- | --- |
| berths | 2 |
| arrivals a day | 3.2 |
| working hours a day | 24 |
| fixed hours a call | 2 |
| lifts a call, and the rate | 60 lifts at 12 an hour |
| bulk a call, and the rate | 900 m3 at 150 m3 an hour |
| lifts and bulk at the same time | true |

## What comes back

The engine returns the service hours, the arrivals an hour, the offered load, the berth utilisation, the mean queue, the mean wait, the mean time at the base and the mean in the system, and as M/M/c the probability of waiting. On the Ekene base as M/M/c the berth utilisation is 0.533333 and the mean wait 3.180124 hours; as M/D/c the same base waits 1.665786 hours on average. The first three modules build each figure from the inputs above.

## Two words this tier uses narrowly

Utilisation is always of a named thing, and at the base it is the berth utilisation: the share of the working hours a berth is busy. Wait is the mean wait in the queue on the working-hour clock, the time before a vessel reaches a berth; the time at the base adds the service. A lesson that quotes a wait quotes its model, berths, arrivals, working day and service beside it, because each moves the figure.

## A queue figure is an average

Every queue figure is a steady-state average of a stated model on stated inputs. It is no schedule and no promise that a berth will be free when a given vessel arrives: three vessels bunched on one morning wait longer than the average says. The engine plans no schedule by the clock and knows no berth-specific cranes, shifts or priorities. The base is one queue.

## Where the Suite comes in

A Suite user finds the same shore base in the Marine Logistics Planner, which runs this engine file. The course is complete without it: the shore base calculator calls the vendored engine on any inputs you type.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Match each control, from Berths (stated) down to Queue model (stated), to its line in the table above. Read the Berth utilisation and Mean wait, hours tiles. Then switch the start to "Ekene supply base, M/D/c" and list which tiles change, which stay the same, and what the Probability of waiting tile now shows.
