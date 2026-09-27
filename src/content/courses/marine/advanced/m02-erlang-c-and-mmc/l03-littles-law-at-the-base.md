# Little's law at the base

{{panel:marine-base-calculator}}

Little's law ties a count to a time. In a steady state, the mean number of vessels in any part of the base equals the arrivals an hour times the mean time a vessel spends in that part. Adan and Resing state it in s. 3.4 of Queueing Systems. It needs no assumption about the arrivals or the service beyond a steady state, so it holds for M/M/c and M/D/c alike, and it is the quickest check a planner has on any queue figure.

## Applied twice

Apply it to the queue: the mean queue is the arrivals an hour times the mean wait. Apply it to the whole base: the mean in the system is the arrivals an hour times the mean time at the base, which is the mean queue plus the offered load, because the vessels at the berths average the arrivals an hour times the service time. On the Ekene base with two berths:

| check | arrivals an hour (engine) | times | product (derived) | the engine's figure |
| --- | --- | --- | --- | --- |
| the queue | 0.133333 | mean wait 3.180124 | 0.424017 | mean queue 0.424017 |
| the system | | mean queue 0.424017 plus offered load 1.066667 | 1.490683 | mean in the system 1.490683 |

Worked with the six-decimal figures the panel prints, the product can differ from the engine's figure in the sixth decimal, because both inputs are rounded. Worked at full precision it agrees exactly.

## The same check at three berths

With the Ekene inputs at three berths, a stated probe, the engine returns a mean wait of 0.440347 hours and a mean queue of 0.058713. The arrivals an hour have not changed, and 0.133333 times 0.440347 gives the mean queue again to the precision printed. A queue figure that fails this check has been copied wrongly or comes from a different call.

## What the law does and does not do

Little's law does not compute a wait from nothing. It converts between a count and a time once one of them is known. The engine computes the M/M/c wait from Erlang's C formula (eq. 5.3), and the law gives the mean queue from it. For M/D/c the engine computes the wait by an approximation, and the same law gives that model's mean queue.

It also reads the other way. A base manager who counts on average half a vessel at the breakwater, with 3.2 arrivals a day on a 24-hour clock, can estimate the mean wait without knowing the service distribution, because the law does not ask for one.

## Units matter

The arrivals must be on the same clock as the time, and the engine uses the working hour for both. Mixing arrivals a calendar day with a wait in hours breaks the check.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Multiply the Arrivals an hour tile by the Mean wait, hours tile and compare with Mean queue; add the Offered load tile to Mean queue and compare with Mean in the system. Then start from "Ekene supply base, M/D/c" and run the first check again on that model's wait and mean queue. Say whether the law holds for both models, and why it should.
