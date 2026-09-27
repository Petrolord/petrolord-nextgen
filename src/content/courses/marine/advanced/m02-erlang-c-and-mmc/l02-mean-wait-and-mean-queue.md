# Mean wait and mean queue

{{panel:marine-base-calculator}}

Once the probability of waiting is known, M/M/c gives the two averages a base planner asks for first: how many vessels are waiting at any moment, and how long an arriving vessel waits before it reaches a berth. Both come from the probability of waiting, the berth utilisation and the service time.

## The two formulas

Write PiW for the probability of waiting, rho for the berth utilisation, c for the berths and S for the service time. Adan and Resing give the mean queue as E(Lq) = PiW rho / (1 - rho) in eq. 5.2, and the mean wait as E(W) = PiW S / (c (1 - rho)) in eq. 5.3. Both carry the factor 1 over (1 - rho), which is why a base close to saturation waits so long: as rho approaches 1 that factor grows without limit.

On the Ekene base with two berths, PiW is 0.371014 and rho is 0.533333, so the mean queue is 0.424017 vessels and the mean wait 3.180124 hours with a service of 8.000000 hours. The mean time at the base adds the service to the wait, 11.180124 hours; the mean in the system adds the offered load to the mean queue, 1.490683 vessels.

## More berths, stated as probes

| berths (stated) | mean queue (engine) | mean wait, hours (engine) | mean time at the base, hours (engine) | mean in the system (engine) |
| --- | --- | --- | --- | --- |
| 2 | 0.424017 | 3.180124 | 11.180124 | 1.490683 |
| 3 | 0.058713 | 0.440347 | 8.440347 | 1.125380 |
| 4 | 0.009187 | 0.068902 | 8.068902 | 1.075854 |
| 5 | 0.001365 | 0.010236 | 8.010236 | 1.068032 |

A third berth cuts the mean wait from a little over three hours to under half an hour. The fourth and fifth berths buy minutes. The time at the base falls toward the service time of 8.000000 hours and can never go below it, because every vessel is served.

## Whose wait is it

The mean wait of 3.180124 hours is averaged over every arriving vessel, including the ones that find a berth free and wait nothing. The vessels that do wait wait longer than that on average, since the zeros pull the mean down. A plan that quotes the figure says so, and quotes the model, the berths, the arrivals, the working day and the service with it, because every one of them moves it.

## Wait and time at the base

The course keeps the two words apart. The wait is the time in the queue on the working-hour clock. The time at the base adds the service. A charterer counting a vessel's idle hours at the quay and a base manager counting berth occupancy read different figures from the same call.

## A name the engine does not read

The engine's input is berths, and it refuses any other word for the same thing, verbatim:

> servers is not an accepted key; the accepted keys at the top level are berths, arrivalsPerDay, workingHoursPerDay, service, model, targetMeanWaitHours

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Read the Mean queue, Mean wait, hours, Mean time at the base, hours and Mean in the system tiles. From the Probability of waiting and Berth utilisation tiles, work eq. 5.2 and eq. 5.3 by hand and compare. Then set the Berths (stated) control to 3 and read the four tiles again against the table.
