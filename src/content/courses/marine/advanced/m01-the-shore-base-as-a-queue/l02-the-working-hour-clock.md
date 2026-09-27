# The working-hour clock

{{panel:marine-base-calculator}}

A queue needs a clock, and the engine states which one it uses: the working hour. Arrivals an hour are the stated arrivals a day over the stated working hours a day, and every time the queue returns, the mean wait and the mean time at the base, is counted in working hours. A base that works round the clock and a base that works a twelve-hour day can take the same arrivals a day and still see two different arrival rates.

## Arrivals an hour

On the Ekene base, 3.2 arrivals a day over 24 working hours are 0.133333 arrivals an hour. The same base on a 12-hour working day, stated with 3 berths, takes the same 3.2 arrivals in half the hours, so its berths see 0.266667 arrivals an hour. The service time is 8.000000 hours in both cases.

| golden input | berths | working hours | arrivals an hour (engine) | offered load (engine) | berth utilisation (engine) |
| --- | --- | --- | --- | --- | --- |
| ekene-base-mmc | 2 | 24 | 0.133333 | 1.066667 | 0.533333 |
| ekene-base-twelve-hour-day | 3 | 12 | 0.266667 | 2.133333 | 0.711111 |

Halving the working day doubles the rate at which vessels reach the quay in the hours the quay is open. The twelve-hour base carries a third berth and still runs its berths harder, at a berth utilisation of 0.711111 against 0.533333.

## Why the working hour

A base that closes at night holds its arrivals until the gate opens, so the queue it forms is a queue in the hours it works. Counting the night would spread the same vessels over hours in which no berth serves anyone and make the base look idler than it is. The engine therefore states the working hour as its clock, an engine convention, and a plan quotes the working day beside every queue figure. The calculator prints the mean wait twice: in hours, and in working days, which is the wait in hours over the working hours a day.

## What the clock leaves out

The clock treats every open hour alike. It holds no shift change, no tide window and no first-light rule, and the engine plans no schedule by the clock. Those details belong to a planner's schedule, so the course quotes each queue figure as a steady-state average on the working-hour clock.

## A working day the engine refuses

The working day is a number above 0 and at most 24. A day of 25 hours is refused, verbatim:

> workingHoursPerDay must be a number above 0 and at most 24; got 25

Left unstated, the same field is refused, verbatim:

> workingHoursPerDay must be a number above 0 and at most 24; got nothing

A shorter day can also push the berths past saturation, which is a different refusal, read later in this module.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Read the Arrivals an hour and Berth utilisation tiles. Switch the start to "Ekene base, a twelve-hour day" and read them again. On that start, set the Berths (stated) control to 2 and, from the offered load of 2.133333, predict whether the engine returns a result or a refusal; then read what it returns. Finally set the Working hours a day (stated) control to 25 and read the refusal.
