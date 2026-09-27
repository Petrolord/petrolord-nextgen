# Offered load and berth utilisation

{{panel:marine-base-calculator}}

Two figures decide whether a base can cope at all. The offered load is the arrivals an hour times the service time: the berth-hours of work that arrive in each working hour, which Iversen's handbook counts in erlangs. The berth utilisation is the offered load over the berths: the share of each berth's working hours spent serving a vessel.

## The Ekene base

On the Ekene base, 0.133333 arrivals an hour times 8.000000 service hours give an offered load of 1.066667: slightly more than one berth's worth of work arrives every hour. Spread over 2 berths, the berth utilisation is 0.533333. The same call at more berths, each a stated probe, spreads the same load thinner:

| berths (stated) | berth utilisation (engine) | mean wait, hours (engine) |
| --- | --- | --- |
| 1 | refused | |
| 2 | 0.533333 | 3.180124 |
| 3 | 0.355556 | 0.440347 |
| 4 | 0.266667 | 0.068902 |
| 5 | 0.213333 | 0.010236 |

The offered load does not move with the berths. What moves is how much of it each berth carries, and the wait falls much faster than the utilisation does.

## Below one, or no steady state

When the berth utilisation reaches 1, work arrives faster than the berths can finish it, the queue grows without limit, and no average exists to report. The engine refuses such a call and says how many arrivals a day the stated berths can take. The Ekene base with one berth offers 1.066667 berth-hours an hour to a single berth, and the engine's message, verbatim:

> arrivalsPerDay must be at most 2.999999 (rounded down at the sixth decimal so that it is accepted) for a steady state with 1 berth: the berth utilisation must stay below 1, so arrivals a day must stay below berths x working hours a day / service hours = 3; got 3.2, a berth utilisation of 1.066667

The bound is the berths times the working hours over the service hours: one berth working 24 hours with 8-hour calls can serve 3 a day. The printed figure sits just below the bound, and a later module reads why.

## Just below saturation

A utilisation just under 1 is accepted, and the figures show what it costs. On the golden input base-just-below-saturation the berth utilisation is 0.999500 and the engine returns a mean wait of 999.250063 hours and a mean queue of 1997.500875 vessels. The steady state exists, and it is very long. A base planned close to a utilisation of 1 has no room for a busy week.

## What utilisation does not say

A berth utilisation of 0.533333 does not mean a vessel waits about half the time. How often a vessel waits and for how long depends on the model: M/M/c, the next module, and M/D/c, the one after. The utilisation only says whether a steady state exists and how busy the berths are within it.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Read the Offered load and Berth utilisation tiles, then the table of the same call at more berths beneath the result, and check the rows for three, four and five berths against the table above. Switch the start to "Ekene base with one berth (refused)" and read the bound in the refusal. Then start from "Just below saturation" and read the Mean wait, hours and Mean queue tiles.
